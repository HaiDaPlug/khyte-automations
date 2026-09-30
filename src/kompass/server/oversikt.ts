import "server-only";

import {
  andel,
  leveransText,
  raknaAvhopp,
  raknaTratt,
  stegNamn,
  type Handelse,
  type Tratt,
} from "@/kompass/lib/oversikt";
import { formateraTimmarKort } from "@/kompass/lib/tid";
import { supabase } from "@/kompass/server/supabase";

/**
 * Den interna översikten: tratt, avhopp, leads och alla svar för en period.
 * Visas på /internal/kompass bakom sajtens inloggning — den innehåller
 * personuppgifter och får aldrig läggas utanför /internal/.
 *
 * Allt som visas är färdigformaterat här, så att sidan bara behöver
 * modulens serveringång.
 */

export const PERIODER = [7, 30, 90] as const;
export type Period = (typeof PERIODER)[number];

export type Lead = {
  datum: string;
  mejl: string;
  namn: string;
  telefon: string;
  bransch: string;
  storlek: string;
  mal: string;
  diagnos: string;
  frigors: string;
  leverans: string;
  mote: boolean;
  arbetsflode: string;
};

export type Besok = {
  datum: string;
  bransch: string;
  storlek: string;
  mal: string;
  forHand: string;
  slutade: string;
  lead: boolean;
  arbetsflode: string;
  kalla: string;
};

export type Oversikt =
  | {
      kopplad: true;
      dagar: Period;
      tratt: Tratt & { andelResultat: string; andelLeads: string; andelMote: string };
      avhopp: { namn: string; antal: number }[];
      /** Den här sidans leads, nyast först. */
      leads: Lead[];
      /** Alla leads i perioden — listan bläddras LEADS_PER_SIDA åt gången. */
      leadsTotalt: number;
      sida: number;
      sidor: number;
      /** De senaste MAX_RADER besöken. */
      besok: Besok[];
      besokTotalt: number;
      /** True när det fanns fler händelser än vi hämtar — siffrorna är då i underkant. */
      avkortad: boolean;
    }
  | { kopplad: false; skal: string };

/** Så här många händelser hämtas per anrop — Supabase ger högst 1000. */
const SIDA = 1000;
/** Tak för en period, så att sidan aldrig hänger. Räcker för tusentals besök. */
const MAX_HANDELSER = 50_000;
/** Så många besök visas i listan över alla besök. */
const MAX_RADER = 100;
/** Så många leads per sida. Äldre leads nås genom att bläddra. */
export const LEADS_PER_SIDA = 50;

const DATUM = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Stockholm",
  dateStyle: "short",
  timeStyle: "short",
});
const datum = (iso: string | null) => (iso ? DATUM.format(new Date(iso)) : "–");
const text = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : "–");
const kort = (v: unknown, max = 140) => {
  const t = text(v);
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
};

/** Ett begripligt besked när databasen inte svarar som den ska. */
function tolkaFel(fel: { message?: string; code?: string }): string {
  const m = `${fel.code ?? ""} ${fel.message ?? ""}`;
  if (/42P01|PGRST205|does not exist|Could not find the table/i.test(m)) {
    return "Tabellerna finns inte i databasen. Kör supabase/schema.sql i Supabase SQL Editor.";
  }
  return `Databasen svarade med ett fel: ${fel.message ?? "okänt fel"}`;
}

type Fel = { message?: string; code?: string };

/**
 * Hämtar alla rader sida för sida — Supabase ger högst 1000 per anrop.
 * Stannar vid MAX_HANDELSER och säger då till (avkortad).
 */
async function allaSidor<T>(
  hamta: (fran: number, till: number) => PromiseLike<{ data: unknown[] | null; error: Fel | null }>,
): Promise<{ rader: T[]; fel: Fel | null; avkortad: boolean }> {
  const rader: T[] = [];
  for (let start = 0; start < MAX_HANDELSER; start += SIDA) {
    const { data, error } = await hamta(start, start + SIDA - 1);
    if (error) return { rader, fel: error, avkortad: false };
    rader.push(...((data ?? []) as T[]));
    if (!data || data.length < SIDA) return { rader, fel: null, avkortad: false };
  }
  return { rader, fel: null, avkortad: true };
}

export async function hamtaOversikt(dagar: Period, sida = 1): Promise<Oversikt> {
  let db: ReturnType<typeof supabase>;
  try {
    db = supabase();
  } catch {
    return {
      kopplad: false,
      skal: "Ingen databas är kopplad: SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY är inte satta.",
    };
  }

  const fran = new Date(Date.now() - dagar * 24 * 60 * 60 * 1000).toISOString();
  const leadsFran = (Math.max(1, sida) - 1) * LEADS_PER_SIDA;

  try {
    const [handelserSvar, avhoppSvar, leadsSvar, besokSvar] = await Promise.all([
      allaSidor<Handelse>((a, b) =>
        db
          .from("kompass_events")
          .select("session_id, handelse, steg")
          .gte("created_at", fran)
          .order("id", { ascending: true })
          .range(a, b),
      ),
      allaSidor<{ senaste_fraga: string | null; klar: boolean }>((a, b) =>
        db
          .from("kompass_svar")
          .select("senaste_fraga, klar")
          .gte("created_at", fran)
          .order("id", { ascending: true })
          .range(a, b),
      ),
      db
        .from("kompass_svar")
        .select(
          "session_id, kontakt_at, mejl, kontakt_namn, foretag, telefon, bransch, antal_anstallda, " +
            "mal, flaskhals, besparing_min, besparing_max, leverans_status, fritext",
          { count: "exact" },
        )
        .not("mejl", "is", null)
        .gte("kontakt_at", fran)
        .order("kontakt_at", { ascending: false })
        .range(leadsFran, leadsFran + LEADS_PER_SIDA - 1),
      db
        .from("kompass_svar")
        .select(
          "updated_at, bransch, antal_anstallda, mal, tidstjuvar:svar->tidstjuvar, " +
            "senaste_fraga, klar, mejl, fritext, utm_source, referrer, enhet",
          { count: "exact" },
        )
        .gte("updated_at", fran)
        .order("updated_at", { ascending: false })
        .limit(MAX_RADER),
    ]);
    for (const fel of [handelserSvar.fel, avhoppSvar.fel, leadsSvar.error, besokSvar.error]) {
      if (fel) return { kopplad: false, skal: tolkaFel(fel) };
    }
    const handelser = handelserSvar.rader;

    const tratt = raknaTratt(handelser);
    const moteBesok = new Set(
      handelser.filter((h) => h.handelse === "mote_klick").map((h) => h.session_id),
    );

    type LeadRad = Record<string, unknown> & {
      session_id: string;
      kontakt_at: string | null;
      besparing_min: number | null;
      besparing_max: number | null;
      leverans_status: Record<string, { status?: string }> | null;
    };
    const leads: Lead[] = ((leadsSvar.data ?? []) as unknown as LeadRad[]).map((r) => ({
      datum: datum(r.kontakt_at),
      mejl: text(r.mejl),
      namn: [r.kontakt_namn, r.foretag].filter((v) => typeof v === "string" && v.trim()).join(", ") || "–",
      telefon: text(r.telefon),
      bransch: text(r.bransch),
      storlek: text(r.antal_anstallda),
      mal: text(r.mal),
      diagnos: text(r.flaskhals),
      frigors:
        r.besparing_max !== null && Number(r.besparing_max) > 0
          ? `${formateraTimmarKort({ min: Number(r.besparing_min), max: Number(r.besparing_max) })}/v`
          : "–",
      leverans: leveransText(r.leverans_status),
      mote: moteBesok.has(r.session_id),
      arbetsflode: kort(r.fritext),
    }));

    type BesokRad = Record<string, unknown> & {
      updated_at: string | null;
      klar: boolean;
      senaste_fraga: string | null;
    };
    const besok: Besok[] = ((besokSvar.data ?? []) as unknown as BesokRad[]).map((r) => ({
      datum: datum(r.updated_at),
      bransch: text(r.bransch),
      storlek: text(r.antal_anstallda),
      mal: text(r.mal),
      forHand: Array.isArray(r.tidstjuvar) && r.tidstjuvar.length ? r.tidstjuvar.join(", ") : "–",
      slutade: r.klar ? "Såg resultatet" : stegNamn(r.senaste_fraga),
      lead: typeof r.mejl === "string" && r.mejl.length > 0,
      arbetsflode: kort(r.fritext),
      kalla: [r.utm_source, r.referrer, r.enhet].filter((v) => typeof v === "string" && v).join(" · ") || "Direkt",
    }));

    return {
      kopplad: true,
      dagar,
      tratt: {
        ...tratt,
        andelResultat: andel(tratt.resultat, tratt.startade),
        andelLeads: andel(tratt.leads, tratt.resultat),
        andelMote: andel(tratt.mote, tratt.resultat),
      },
      avhopp: raknaAvhopp(avhoppSvar.rader),
      leads,
      leadsTotalt: leadsSvar.count ?? leads.length,
      sida: Math.max(1, sida),
      sidor: Math.max(1, Math.ceil((leadsSvar.count ?? leads.length) / LEADS_PER_SIDA)),
      besok,
      besokTotalt: besokSvar.count ?? besok.length,
      avkortad: handelserSvar.avkortad || avhoppSvar.avkortad,
    };
  } catch (fel) {
    return {
      kopplad: false,
      skal: `Kunde inte läsa från databasen: ${fel instanceof Error ? fel.message : "okänt fel"}`,
    };
  }
}
