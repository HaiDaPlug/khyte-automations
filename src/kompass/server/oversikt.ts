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
import { fraga, harDatabas } from "@/kompass/server/db";

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
const datum = (tid: Date | string | null) => (tid ? DATUM.format(new Date(tid)) : "–");
const text = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : "–");
const kort = (v: unknown, max = 140) => {
  const t = text(v);
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
};

/** Ett begripligt besked när databasen inte svarar som den ska. */
function tolkaFel(fel: unknown): string {
  const { code, message } = (fel ?? {}) as { code?: string; message?: string };
  if (code === "42P01" || /does not exist/i.test(message ?? "")) {
    return "Tabellerna finns inte i databasen. Kör db/schema.sql mot databasen (se docs/current_state.md).";
  }
  return `Kunde inte läsa från databasen: ${message ?? "okänt fel"}`;
}

/**
 * Hämtar högst MAX_HANDELSER rader. En rad extra hämtas för att se om det
 * fanns fler — då är siffrorna i underkant och sidan säger till (avkortad).
 */
async function medTak<T>(sql: string, params: unknown[]): Promise<{ rader: T[]; avkortad: boolean }> {
  const rader = await fraga<T>(`${sql} limit ${MAX_HANDELSER + 1}`, params);
  const avkortad = rader.length > MAX_HANDELSER;
  return { rader: avkortad ? rader.slice(0, MAX_HANDELSER) : rader, avkortad };
}

export async function hamtaOversikt(dagar: Period, sida = 1): Promise<Oversikt> {
  if (!harDatabas()) {
    return { kopplad: false, skal: "Ingen databas är kopplad: DATABASE_URL är inte satt." };
  }

  const fran = new Date(Date.now() - dagar * 24 * 60 * 60 * 1000).toISOString();
  const leadsFran = (Math.max(1, sida) - 1) * LEADS_PER_SIDA;

  try {
    const [handelserSvar, avhoppSvar, leadsRader, [leadsAntal], besokRader, [besokAntal]] = await Promise.all([
      medTak<Handelse>(
        "select session_id, handelse, steg from kompass_events where created_at >= $1 order by id",
        [fran],
      ),
      medTak<{ senaste_fraga: string | null; klar: boolean }>(
        "select senaste_fraga, klar from kompass_svar where created_at >= $1 order by id",
        [fran],
      ),
      fraga(
        `select session_id, kontakt_at, mejl, kontakt_namn, foretag, telefon, bransch, antal_anstallda,
                mal, flaskhals, besparing_min, besparing_max, leverans_status, fritext
         from kompass_svar
         where mejl is not null and kontakt_at >= $1
         order by kontakt_at desc
         limit $2 offset $3`,
        [fran, LEADS_PER_SIDA, leadsFran],
      ),
      fraga<{ antal: number }>(
        "select count(*)::int as antal from kompass_svar where mejl is not null and kontakt_at >= $1",
        [fran],
      ),
      fraga(
        `select updated_at, bransch, antal_anstallda, mal, svar->'tidstjuvar' as tidstjuvar,
                senaste_fraga, klar, mejl, fritext, utm_source, referrer, enhet
         from kompass_svar
         where updated_at >= $1
         order by updated_at desc
         limit $2`,
        [fran, MAX_RADER],
      ),
      fraga<{ antal: number }>("select count(*)::int as antal from kompass_svar where updated_at >= $1", [
        fran,
      ]),
    ]);
    const handelser = handelserSvar.rader;

    const tratt = raknaTratt(handelser);
    const moteBesok = new Set(
      handelser.filter((h) => h.handelse === "mote_klick").map((h) => h.session_id),
    );

    type LeadRad = Record<string, unknown> & {
      session_id: string;
      kontakt_at: Date | null;
      besparing_min: string | number | null;
      besparing_max: string | number | null;
      leverans_status: Record<string, { status?: string }> | null;
    };
    const leads: Lead[] = (leadsRader as LeadRad[]).map((r) => ({
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
      updated_at: Date | null;
      klar: boolean;
      senaste_fraga: string | null;
    };
    const besok: Besok[] = (besokRader as BesokRad[]).map((r) => ({
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
      leadsTotalt: leadsAntal.antal,
      sida: Math.max(1, sida),
      sidor: Math.max(1, Math.ceil(leadsAntal.antal / LEADS_PER_SIDA)),
      besok,
      besokTotalt: besokAntal.antal,
      avkortad: handelserSvar.avkortad || avhoppSvar.avkortad,
    };
  } catch (fel) {
    return { kopplad: false, skal: tolkaFel(fel) };
  }
}
