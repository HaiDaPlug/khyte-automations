import "server-only";

import { loggaFel, tvattadFeltext } from "@/kompass/server/logg";
import { supabase } from "@/kompass/server/supabase";
import {
  skickaAdminlarm,
  skickaResultatmejl,
  skickaSaljnotis,
} from "@/kompass/server/mail";
import type { SvarsRad } from "@/kompass/server/rad";

/**
 * Eftersteg som körs när kontaktuppgifter lämnats.
 *
 * Varje steg körs för sig och sparar sin egen status. Misslyckas ett steg
 * påverkar det inte de andra, och svaret är redan sparat innan något av dem
 * körs. Cron-jobbet plockar upp det som gick fel.
 */

export const STEG = ["crm", "saljmejl", "resultatmejl"] as const;
export type Steg = (typeof STEG)[number];

export type StegStatus = {
  status: "vantar" | "skickad" | "misslyckad";
  forsok: number;
  fel?: string;
  tidpunkt?: string;
};

export type LeveransStatus = Partial<Record<Steg, StegStatus>>;

export const MAX_FORSOK = 3;

/** Så länge en cron-körning får hålla en rad innan en annan får ta den. */
export const LAS_MINUTER = 10;

/**
 * Steg 1: skapa lead i CRM.
 *
 * VÄNTAR PÅ BESLUT. CRM:et ligger i ett Supabase-projekt vi inte når — Hai
 * äger det med egna kopplingar. Tills vi har anslutning och vet vilken ägare
 * kompass-lead ska få markeras steget som 'vantar', inte 'misslyckad'.
 * Cron-jobbet rör inte väntande steg, så inga larm går ut i onödan.
 *
 * När CRM:et blir tillgängligt: implementera skrivningen här. Enligt khyte-crm
 * mappar ett lead till relationships (name, company, phone, email,
 * type='lead', owner, source, how_found) plus en action av typen 'handelse'.
 */
async function korCrm(): Promise<StegStatus> {
  return {
    status: "vantar",
    forsok: 0,
    fel: "CRM-kopplingen är inte uppsatt än. Leadet ligger kvar och kan skickas när anslutningen finns.",
    tidpunkt: new Date().toISOString(),
  };
}

/**
 * Idempotensnyckel per besök, steg och försök. Två körningar som tar samma
 * försök delar nyckel, och Resend skickar då bara ett mejl. Nästa försök får
 * en ny nyckel, så ett riktigt omförsök går igenom.
 */
const nyckel = (rad: SvarsRad, steg: Steg, tidigareForsok: number) =>
  `kompass-${rad.session_id}-${steg}-${tidigareForsok + 1}`;

/** Steg 2: notis till säljaren. */
async function korSaljmejl(
  rad: SvarsRad,
  tidigareForsok: number,
): Promise<StegStatus> {
  try {
    await skickaSaljnotis(rad, nyckel(rad, "saljmejl", tidigareForsok));
    return {
      status: "skickad",
      forsok: tidigareForsok + 1,
      tidpunkt: new Date().toISOString(),
    };
  } catch (fel) {
    return {
      status: "misslyckad",
      forsok: tidigareForsok + 1,
      // Felorsaken sparas och kan hamna i larmmejlet — tvättad.
      fel: tvattadFeltext(fel instanceof Error ? fel.message : "Okänt fel"),
      tidpunkt: new Date().toISOString(),
    };
  }
}

/** Steg 3: resultatmejl till användaren. Går ut så fort det finns en mejl. */
async function korResultatmejl(
  rad: SvarsRad,
  tidigareForsok: number,
): Promise<StegStatus | null> {
  if (!rad.skicka_resultat || !rad.mejl) return null;

  try {
    await skickaResultatmejl(rad, nyckel(rad, "resultatmejl", tidigareForsok));
    return {
      status: "skickad",
      forsok: tidigareForsok + 1,
      tidpunkt: new Date().toISOString(),
    };
  } catch (fel) {
    return {
      status: "misslyckad",
      forsok: tidigareForsok + 1,
      // Felorsaken sparas och kan hamna i larmmejlet — tvättad.
      fel: tvattadFeltext(fel instanceof Error ? fel.message : "Okänt fel"),
      tidpunkt: new Date().toISOString(),
    };
  }
}

/**
 * Kör alla eftersteg som inte redan lyckats.
 *
 * Returnerar den nya statusen. Anroparen ansvarar för att spara den —
 * så att ett misslyckat sparande inte döljer att mejlen faktiskt gick ut.
 */
export async function korEftersteg(
  rad: SvarsRad,
): Promise<LeveransStatus> {
  const tidigare = rad.leverans_status ?? {};
  const ny: LeveransStatus = { ...tidigare };

  // Hoppa över steg som redan lyckats — cron kör om den här funktionen.
  const arKlar = (steg: Steg) => tidigare[steg]?.status === "skickad";
  const forsok = (steg: Steg) => tidigare[steg]?.forsok ?? 0;

  // Ett steg som gett upp efter MAX_FORSOK försöks inte igen.
  const harGettUpp = (steg: Steg) =>
    tidigare[steg]?.status === "misslyckad" && forsok(steg) >= MAX_FORSOK;

  if (!arKlar("crm") && !harGettUpp("crm")) {
    ny.crm = await korCrm();
  }

  if (!arKlar("saljmejl") && !harGettUpp("saljmejl")) {
    ny.saljmejl = await korSaljmejl(rad, forsok("saljmejl"));
  }

  if (!arKlar("resultatmejl") && !harGettUpp("resultatmejl")) {
    const status = await korResultatmejl(rad, forsok("resultatmejl"));
    if (status) ny.resultatmejl = status;
  }

  return ny;
}

/**
 * Finns det något steg kvar att försöka med? Ett steg som misslyckats färre
 * än MAX_FORSOK gånger. 'vantar' (CRM:et, som inte är uppsatt) räknas inte.
 */
export function behoverForsok(status: LeveransStatus | null): boolean {
  if (!status) return false;
  return STEG.some((steg) => {
    const s = status[steg];
    return s?.status === "misslyckad" && s.forsok < MAX_FORSOK;
  });
}

/**
 * Lägger beslag på en rad innan cron-jobbet skickar något. En enda villkorad
 * uppdatering: den lyckas bara om raden fortfarande väntar och ingen annan
 * körning håller den. Databasen låter bara en av två samtidiga uppdateringar
 * vinna, så två körningar kan aldrig skicka samma mejl. Kraschar körningen
 * släpps låset av sig självt efter LAS_MINUTER.
 *
 * Returnerar true om raden är vår att behandla.
 */
export async function taRad(sessionId: string): Promise<boolean> {
  const nu = new Date();
  const till = new Date(nu.getTime() + LAS_MINUTER * 60_000).toISOString();
  const { data, error } = await supabase()
    .from("kompass_svar")
    .update({ behandlas_till: till })
    .eq("session_id", sessionId)
    .eq("behover_forsok", true)
    .or(`behandlas_till.is.null,behandlas_till.lt."${nu.toISOString()}"`)
    .select("session_id");

  if (error) {
    loggaFel(`Kunde inte ta raden ${sessionId}`, error.message);
    return false;
  }
  return (data?.length ?? 0) > 0;
}

/**
 * Sparar leveransstatus på raden — och om den behöver ett nytt försök, i en
 * egen kolumn. Cron-jobbet frågar efter just den kolumnen, så att det alltid
 * hittar raderna som väntar, hur många lyckade rader det än finns. Släpper
 * också cron-jobbets lås (se taRad).
 */
export async function sparaStatus(
  sessionId: string,
  status: LeveransStatus,
): Promise<void> {
  const { error } = await supabase()
    .from("kompass_svar")
    .update({
      leverans_status: status,
      behover_forsok: behoverForsok(status),
      behandlas_till: null,
    })
    .eq("session_id", sessionId);

  if (error) {
    loggaFel(`Kunde inte spara leveransstatus för ${sessionId}`, error.message);
  }
}

/**
 * Larmar admin om steg som just passerat tredje misslyckandet.
 * Larmet skickas en gång per steg — vi jämför mot den tidigare statusen.
 */
export async function larmaOmUppgivnaSteg(
  sessionId: string,
  innan: LeveransStatus,
  efter: LeveransStatus,
): Promise<void> {
  for (const steg of STEG) {
    const fore = innan[steg];
    const nu = efter[steg];

    const nyssUppgivet =
      nu?.status === "misslyckad" &&
      nu.forsok >= MAX_FORSOK &&
      (fore?.forsok ?? 0) < MAX_FORSOK;

    if (!nyssUppgivet) continue;

    try {
      await skickaAdminlarm(sessionId, steg, nu.fel ?? "Okänt fel");
    } catch (fel) {
      // Larmet får inte stoppa resten. Loggas för felsökning.
      loggaFel(`Kunde inte larma om ${steg} för ${sessionId}`, fel);
    }
  }
}
