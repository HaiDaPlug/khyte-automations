/**
 * Klientens anrop mot serverfunktionerna.
 *
 * Inga nycklar finns här — allt går via /api, som håller dem på servern.
 * Mätning och sparande får aldrig stoppa flödet: misslyckas ett anrop
 * fortsätter användaren, och svaret finns kvar i localStorage.
 */

import type { KontaktUppgifter } from "@/kompass/komponenter/KontaktVy";
import { api } from "@/kompass/konfig";
import { kontrolleraAiAnalys, type AiAnalys } from "@/kompass/lib/ai-typer";
import type { Kalla, Svar } from "@/kompass/lib/typer";

/**
 * Läser varifrån besökaren kom: UTM-parametrar, sidan de kom från och typ av
 * enhet. Bara domänen sparas av referrer — aldrig hela adressen.
 */
export function lasKalla(sokparametrar: URLSearchParams): Kalla {
  const kalla: Kalla = {};

  for (const nyckel of ["utm_source", "utm_medium", "utm_campaign"] as const) {
    const v = sokparametrar.get(nyckel)?.trim();
    if (v) kalla[nyckel] = v.slice(0, 100);
  }

  try {
    if (document.referrer) {
      const varifran = new URL(document.referrer).hostname;
      // Egna sidbyten räknas inte — bara när de kom utifrån.
      if (varifran && varifran !== window.location.hostname) {
        kalla.referrer = varifran;
      }
    }
  } catch {
    // Trasig referrer — strunta i den.
  }

  const bredd = window.innerWidth;
  const grov = window.matchMedia("(pointer: coarse)").matches;
  kalla.enhet = bredd < 640 ? "mobil" : grov && bredd < 1100 ? "surfplatta" : "dator";

  return kalla;
}

/** Händelser vi loggar för att se var folk hoppar av. */
export type Handelse =
  | "start"
  | "fraga_besvarad"
  | "resultat_visat"
  | "delning"
  | "kontakt_lamnad"
  | "mote_klick";

export async function loggaHandelse(
  sessionId: string,
  handelse: Handelse,
  steg?: string,
): Promise<void> {
  try {
    const kropp = JSON.stringify({ session_id: sessionId, handelse, steg });

    // sendBeacon överlever att sidan stängs — viktigt för avhoppsmätningen.
    if (typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon(
        api("event"),
        new Blob([kropp], { type: "application/json" }),
      );
      return;
    }

    await fetch(api("event"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: kropp,
      keepalive: true,
    });
  } catch {
    // Mätning får aldrig påverka användaren.
  }
}

/**
 * Sparanden körs ett i taget, i den ordning de startades. Svaren sparas efter
 * varje fråga — utan kö kan ett tidigt anrop landa efter ett senare och skriva
 * över nyare svar med gamla.
 */
let sparko: Promise<unknown> = Promise.resolve();

/**
 * Sparar eller uppdaterar svarsraden. Anropas efter varje fråga, så att även
 * den som hoppar av halvvägs finns kvar. Returnerar false om det misslyckades.
 */
export function sparaSvar(args: {
  sessionId: string;
  svar: Svar;
  ref?: string;
  kalla?: Kalla;
  /** Senast besvarade frågan — visar var en avhoppare slutade. */
  senasteFraga?: string;
  /** True när resultatet visats. Skickas aldrig som false, se server/api/svar.ts. */
  klar?: boolean;
}): Promise<boolean> {
  const jobb = sparko.then(() => skickaSvar(args));
  sparko = jobb.catch(() => undefined);
  return jobb;
}

async function skickaSvar(
  args: Parameters<typeof sparaSvar>[0],
): Promise<boolean> {
  try {
    // Bara råsvaren. Servern räknar själv ut resultatet ur dem.
    const svar = await fetch(api("svar"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // keepalive: sparandet ska gå igenom även om fliken stängs direkt efter.
      keepalive: true,
      body: JSON.stringify({
        session_id: args.sessionId,
        svar: args.svar,
        ref: args.ref,
        kalla: args.kalla,
        senaste_fraga: args.senasteFraga,
        klar: args.klar ? true : undefined,
      }),
    });

    return svar.ok;
  } catch {
    return false;
  }
}

// ── Den löpande analysen ────────────────────────────────────────────────────

/** Hämtar nästa analys. Null om det inte blev någon. */
async function hamtaAnalys(sessionId: string): Promise<AiAnalys | null> {
  try {
    const svar = await fetch(api("analys"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    });
    const kropp = (await svar.json()) as { analys?: unknown };
    return kontrolleraAiAnalys(kropp.analys);
  } catch {
    return null;
  }
}

let analysKo: Promise<void> = Promise.resolve();
let analysKors = false;
let nyAnalysBehovs = false;

/**
 * Begär en ny analys efter ett svar.
 *
 * Besökaren svarar ofta snabbare än en analys hinner bli klar. Därför körs
 * bara en i taget, och kommer det nya svar under tiden körs en till — med
 * alla svar — när den första är klar. Analyserna mellan hoppas över; det är
 * bara den senaste bilden som spelar roll.
 */
export function begarAnalys(
  sessionId: string,
  onAnalys: (analys: AiAnalys) => void,
): void {
  if (analysKors) {
    nyAnalysBehovs = true;
    return;
  }
  analysKors = true;
  analysKo = (async () => {
    do {
      nyAnalysBehovs = false;
      // Servern läser svaren från raden — vänta tills de senaste är sparade.
      await sparko;
      const analys = await hamtaAnalys(sessionId);
      if (analys) onAnalys(analys);
    } while (nyAnalysBehovs);
    analysKors = false;
  })();
}

/** Löser ut när ingen analys pågår eller väntar. */
export function vantaPaAnalys(): Promise<void> {
  return analysKo;
}

/**
 * Hämtar Claudes förslag på det besökaren vill slippa. Ska anropas efter att
 * det sista sparandet gått igenom — servern läser fritexten från raden.
 */
export async function hamtaForslag(sessionId: string): Promise<string | null> {
  try {
    const svar = await fetch(api("forslag"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    });
    const kropp = (await svar.json()) as { forslag?: string | null };
    return kropp.forslag ?? null;
  } catch {
    return null;
  }
}

/** Det frivilliga på tacksidan. */
export type Komplettering = {
  kontakt_namn: string;
  foretag: string;
  telefon: string;
  ort: string;
  tips_namn: string;
  tips_kontakt: string;
  roll: string;
  tidshorisont: string;
};

/** Skickar kompletteringen. Kastar med ett svenskt besked vid fel. */
export async function komplettera(
  sessionId: string,
  uppgifter: Komplettering,
): Promise<void> {
  const svar = await fetch(api("komplettera"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, ...uppgifter }),
  });

  if (!svar.ok) {
    const kropp = (await svar.json().catch(() => null)) as {
      fel?: string;
    } | null;
    throw new Error(kropp?.fel ?? "Kunde inte skicka");
  }
}

export type KontaktSvar = {
  ok: boolean;
  /** Felmeddelande på svenska, redo att visas. */
  fel?: string;
};

/** Skickar kontaktuppgifterna. Kastar vid fel så att vyn kan visa besked. */
export async function skickaKontakt(
  sessionId: string,
  uppgifter: KontaktUppgifter,
): Promise<KontaktSvar> {
  const svar = await fetch(api("kontakt"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, ...uppgifter }),
  });

  if (!svar.ok) {
    const kropp = (await svar.json().catch(() => null)) as {
      fel?: string;
    } | null;

    throw new Error(kropp?.fel ?? "Kunde inte skicka");
  }

  return { ok: true };
}
