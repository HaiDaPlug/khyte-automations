/**
 * En svarsrad som serverns eftersteg läser den: kontaktrutten, cron-jobbet
 * och mejlen. Samma kolumnlista överallt, så att de inte glider isär.
 */

import type { SparatForslag, SparatOmrade } from "@/kompass/lib/sammanstallning";
import type { LeveransStatus } from "@/kompass/server/leverans";

export const RAD_KOLUMNER =
  "session_id, bransch, antal_anstallda, roll, mal, flaskhals, bekraftelse, " +
  "bekraftelse_text, tidshorisont, verktyg, " +
  "missade_samtal, svarstid, kundvarde, omraden, forslag, timmar_min, " +
  "timmar_max, " +
  "besparing_min, besparing_max, kronor_min, kronor_max, harledning_kronor, " +
  "fritext, ai_forslag, svar, ai_analys, plan, ref, utm_source, utm_medium, utm_campaign, " +
  "referrer, enhet, kontakt_namn, foretag, telefon, mejl, ort, " +
  "skicka_resultat, tips_namn, tips_kontakt, leverans_status";

export type SvarsRad = {
  session_id: string;
  bransch: string | null;
  antal_anstallda: string | null;
  roll: string | null;
  mal: string | null;
  flaskhals: string | null;
  bekraftelse: string | null;
  bekraftelse_text: string | null;
  tidshorisont: string | null;
  verktyg: string[] | null;
  missade_samtal: string | null;
  svarstid: string | null;
  kundvarde: string | null;
  omraden: SparatOmrade[] | null;
  forslag: SparatForslag[] | null;
  plan: { rubrik: string; text: string; klartNar?: string }[] | null;
  svar: Record<string, unknown> | null;
  ai_analys: unknown;
  timmar_min: number | null;
  timmar_max: number | null;
  besparing_min: number | null;
  besparing_max: number | null;
  kronor_min: number | null;
  kronor_max: number | null;
  harledning_kronor: string | null;
  fritext: string | null;
  ai_forslag: string | null;
  ref: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  enhet: string | null;
  kontakt_namn: string | null;
  foretag: string | null;
  telefon: string | null;
  mejl: string | null;
  ort: string | null;
  skicka_resultat: boolean;
  tips_namn: string | null;
  tips_kontakt: string | null;
  leverans_status: LeveransStatus | null;
};
