/**
 * Svaren som databaskolumner.
 *
 * Servern räknar själv ut resultatet från råsvaren — klienten skickar bara
 * vad besökaren svarat. Då kan ingen skicka in påhittade siffror, och
 * säljaren kan lita på det som står i raden.
 */

import { FRAGA } from "@/kompass/data/kompass";
import type { AiAnalys } from "@/kompass/lib/ai-typer";
import { diagnoser } from "@/kompass/lib/flode";
import { raknaUtResultat } from "@/kompass/lib/matchning";
import type { Svar } from "@/kompass/lib/typer";

function text(svar: Svar, id: string): string | null {
  const v = svar[id];
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function lista(svar: Svar, id: string): string[] {
  const v = svar[id];
  return Array.isArray(v) ? v : [];
}

/** Ett förslag som det sparas i kolumnen `forslag` — det mejlen byggs av. */
export type SparatForslag = {
  id: string;
  kalla: string;
  rubrik: string;
  affarsnytta: string | null;
  varfor: string;
  steg: string[];
  slipper: string;
  besparing_min: number | null;
  besparing_max: number | null;
  lagt_min: number | null;
  lagt_max: number | null;
  pengar: string | null;
  forsta_steget: string | null;
  /** Områdena ett förslag bygger på — för kedjor och AI-förslag flera. */
  omraden: string[];
  tjanster: string | null;
};

/** Ett område som det sparas i kolumnen `omraden`. */
export type SparatOmrade = {
  id: string;
  namn: string;
  lagt_min: number | null;
  lagt_max: number | null;
  idag: string | null;
  besparing_min: number;
  besparing_max: number;
  harledning: string;
  foreslaget: boolean;
  skal: string | null;
};

/**
 * Svaren som kolumner. Med AI-analysen blir förslagen och planen samma som
 * besökaren såg — används när mejl lämnas, så att mejlen säger samma sak.
 */
export function sammanstall(svar: Svar, ai?: AiAnalys | null) {
  const resultat = raknaUtResultat(svar, ai);

  const omraden: SparatOmrade[] = resultat.omraden.map((o) => ({
    id: o.omrade.id,
    namn: o.omrade.namn,
    lagt_min: o.lagt?.min ?? null,
    lagt_max: o.lagt?.max ?? null,
    idag: o.idag ?? null,
    besparing_min: o.besparing.min,
    besparing_max: o.besparing.max,
    harledning: o.harledning,
    foreslaget: o.foreslaget,
    skal: o.skal ?? null,
  }));

  const forslag: SparatForslag[] = resultat.forslag.map((f) => ({
    id: f.id,
    kalla: f.kalla,
    rubrik: f.rubrik,
    affarsnytta: f.affarsnytta ?? null,
    varfor: f.varfor,
    steg: f.steg,
    slipper: f.slipper,
    besparing_min: f.besparing?.min ?? null,
    besparing_max: f.besparing?.max ?? null,
    lagt_min: f.lagt?.min ?? null,
    lagt_max: f.lagt?.max ?? null,
    pengar: f.pengar ?? null,
    forsta_steget: f.forstaSteget ?? null,
    omraden: f.omraden?.map((o) => o.id) ?? (f.omrade ? [f.omrade.id] : []),
    tjanster: f.tjanster ?? null,
  }));

  // Roll och tidshorisont finns inte här: de frågas på tacksidan och skrivs
  // av /api/kompass/komplettera. Stod de här skulle varje sparande nolla dem.
  return {
    bransch: text(svar, FRAGA.bransch),
    antal_anstallda: text(svar, FRAGA.antal),
    mal: text(svar, FRAGA.mal),
    // Kolumnen heter flaskhals sedan den första versionen. Den håller nu det
    // första specialsvaret — deras egen bild av var det bromsar.
    flaskhals: diagnoser(svar)[0]?.signal.svar ?? null,
    bekraftelse: text(svar, FRAGA.bekraftelse),
    bekraftelse_text: text(svar, FRAGA.bekraftelseText),
    missade_samtal: text(svar, FRAGA.missadeSamtal),
    svarstid: text(svar, FRAGA.svarstid),
    kundvarde: text(svar, FRAGA.kundvarde),
    verktyg: lista(svar, FRAGA.verktyg),
    fritext: text(svar, FRAGA.fritext),
    omraden,
    forslag,
    plan: resultat.plan,
    timmar_min: resultat.lagt.min,
    timmar_max: resultat.lagt.max,
    besparing_min: resultat.besparing.min,
    besparing_max: resultat.besparing.max,
    kronor_min: resultat.missadeAffarer?.kronor.min ?? null,
    kronor_max: resultat.missadeAffarer?.kronor.max ?? null,
    harledning_kronor: resultat.missadeAffarer?.harledning ?? null,
  };
}

export type Sammanstallning = ReturnType<typeof sammanstall>;
