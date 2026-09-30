/**
 * Uträkningen bakom resultatet.
 *
 * Tiden kommer från besökarens egna svar per område. Våra antaganden är bara
 * två: hur stor del som brukar gå att automatisera (ANDEL_SPARBAR) och vad ett
 * missat samtal kostar i uteblivna affärer. Båda står i src/data/kompass.ts
 * och skrivs ut i "Så räknade vi".
 */

import {
  ANDEL_MISSADE_SOM_AFFAR,
  ANDEL_SPARBAR,
  FRAGA,
  KUNDVARDE_KR,
  LITEN_TID_UNDER,
  MANGA_MISSADE_SAMTAL,
  MINUTER_PER_MISSAT_SAMTAL,
  MISSADE_SAMTAL_PER_VECKA,
  OFTA_DUBBELT,
  OMRADEN,
  OMRADESNYCKEL,
  TID_PER_VECKA,
  VECKOR_PER_MANAD,
  type Bransch,
  type Omrade,
} from "@/kompass/data/kompass";
import type { AiAnalys } from "@/kompass/lib/ai-typer";
import { byggForslag, byggPlan } from "@/kompass/lib/analys";
import { malFor, nivaFor, pengarGallerFor, valdaOmraden } from "@/kompass/lib/flode";
import {
  avrundaHalvtimme,
  avrundaKronor,
  formateraKronor,
  formateraTimmar,
  summera,
} from "@/kompass/lib/tid";
import type { Intervall, OmradeResultat, Resultat, Svar } from "@/kompass/lib/typer";

/** Läser ett envalssvar. */
function enval(svar: Svar, id: string): string | undefined {
  const varde = svar[id];
  return typeof varde === "string" ? varde : undefined;
}

const procent = (andel: number) => `${Math.round(andel * 100)}`;

const INGEN_TID: Intervall = { min: 0, max: 0 };

/**
 * Ett valt område: besökarens tid × andelen som brukar gå att automatisera.
 * De har själva sagt att det görs för hand, så ingen fråga om hur.
 */
function raknaOmrade(omrade: Omrade, svar: Svar): OmradeResultat {
  const tidSvar = enval(svar, OMRADESNYCKEL.tid(omrade.id));
  const lagt = tidSvar ? TID_PER_VECKA[tidSvar] : undefined;
  const andel = ANDEL_SPARBAR;

  // Halvt besvarat (t.ex. avhopp mitt på skärmen) — visa området utan siffror
  // hellre än att gissa.
  if (!lagt) {
    return {
      omrade,
      besparing: INGEN_TID,
      harledning: `${omrade.namn}: inte tillräckligt med svar för att räkna.`,
      foreslaget: false,
    };
  }

  const besparing = {
    min: avrundaHalvtimme(lagt.min * andel.min),
    max: avrundaHalvtimme(lagt.max * andel.max),
  };

  return {
    omrade,
    lagt,
    besparing,
    harledning:
      `${omrade.namn}: du angav ${formateraTimmar(lagt)} i veckan. Vi räknar med att ` +
      `${procent(andel.min)}–${procent(andel.max)} % av det som görs för hand ` +
      `brukar gå att automatisera, alltså ${formateraTimmar(besparing)}.`,
    foreslaget: false,
  };
}

/**
 * Samtalsområdet föreslås även när det inte valts, om svaren pekar dit.
 * Många som tappar samtal tänker inte på det som tid — men det är ofta där
 * pengarna försvinner.
 */
function foreslaSamtal(svar: Svar, valda: Omrade[]): OmradeResultat | null {
  const samtal = OMRADEN.find((o) => o.id === "samtal");
  if (!samtal || valda.some((o) => o.id === samtal.id)) return null;

  const missade = enval(svar, FRAGA.missadeSamtal);
  if (!missade || !MANGA_MISSADE_SAMTAL.some((m) => m === missade)) return null;

  const perVecka = MISSADE_SAMTAL_PER_VECKA[missade] ?? 0;
  const besparing = {
    min: avrundaHalvtimme((perVecka * MINUTER_PER_MISSAT_SAMTAL.min) / 60),
    max: avrundaHalvtimme((perVecka * MINUTER_PER_MISSAT_SAMTAL.max) / 60),
  };

  return {
    omrade: samtal,
    besparing,
    harledning:
      `${samtal.namn}: runt ${perVecka} missade samtal i veckan × ` +
      `${MINUTER_PER_MISSAT_SAMTAL.min}–${MINUTER_PER_MISSAT_SAMTAL.max} minuter ` +
      `att ringa tillbaka och reda ut = ${formateraTimmar(besparing)}.`,
    foreslaget: true,
    skal: `Ni missar ${missade.toLowerCase()} samtal i veckan.`,
  };
}

/**
 * Integrationsområdet föreslås även när det inte valts, om de svarar att samma
 * information ofta matas in på flera ställen. Utan tidsberäkning — de har inte
 * sagt hur mycket tid det tar.
 */
function foreslaDubbel(svar: Svar, valda: Omrade[]): OmradeResultat | null {
  const omrade = OMRADEN.find((o) => o.id === "dubbelregistrering");
  if (!omrade || valda.some((o) => o.id === omrade.id)) return null;
  if (enval(svar, FRAGA.dubbelinmatning) !== OFTA_DUBBELT) return null;

  const du = enval(svar, FRAGA.antal) === "Bara jag";
  return {
    omrade,
    besparing: INGEN_TID,
    harledning: `${omrade.namn}: föreslaget utifrån dina svar, utan tidsberäkning.`,
    foreslaget: true,
    skal: `${du ? "Du" : "Ni"} svarade att samma information ofta behöver matas in eller flyttas mellan flera system.`,
  };
}

/** Kronor i månaden som försvinner med missade samtal. */
function raknaMissadeAffarer(svar: Svar): Resultat["missadeAffarer"] {
  // Där ett missat samtal sällan är en ny kund räknar vi inga pengar alls.
  if (!pengarGallerFor(enval(svar, FRAGA.bransch))) return undefined;

  const missade = enval(svar, FRAGA.missadeSamtal);
  const kundvardeSvar = enval(svar, FRAGA.kundvarde);
  if (!missade || !kundvardeSvar) return undefined;

  const perVecka = MISSADE_SAMTAL_PER_VECKA[missade] ?? 0;
  const kundvarde = KUNDVARDE_KR[kundvardeSvar];
  if (!perVecka || !kundvarde) return undefined;

  const perManad = perVecka * VECKOR_PER_MANAD;
  const kronor = {
    min: avrundaKronor(perManad * ANDEL_MISSADE_SOM_AFFAR.min * kundvarde),
    max: avrundaKronor(perManad * ANDEL_MISSADE_SOM_AFFAR.max * kundvarde),
  };

  return {
    kronor,
    harledning:
      `Uteblivna affärer: runt ${perVecka} missade samtal i veckan × ` +
      `${VECKOR_PER_MANAD} veckor × ${procent(ANDEL_MISSADE_SOM_AFFAR.min)}–` +
      `${procent(ANDEL_MISSADE_SOM_AFFAR.max)} % som hade blivit en ny kund × ` +
      `${formateraKronor({ min: kundvarde, max: kundvarde })} per kund = ` +
      `${formateraKronor(kronor)} i månaden.`,
  };
}

/**
 * Räknar ut resultatet. Med en AI-analys blir förslagen och planen AI:ns —
 * men all tid räknas alltid här, ur besökarens egna svar.
 */
export function raknaUtResultat(svar: Svar, ai?: AiAnalys | null): Resultat {
  const valda = valdaOmraden(svar);

  const omraden = valda
    .map((o) => raknaOmrade(o, svar))
    .sort((a, b) => b.besparing.max - a.besparing.max);

  for (const foreslaget of [foreslaSamtal(svar, valda), foreslaDubbel(svar, valda)]) {
    if (foreslaget) omraden.push(foreslaget);
  }

  const lagt = summera(
    omraden.flatMap((o) => (o.lagt ? [o.lagt] : [])),
  );
  const besparing = summera(omraden.map((o) => o.besparing));
  const missadeAffarer = raknaMissadeAffarer(svar);

  const bransch = enval(svar, FRAGA.bransch) as Bransch | undefined;
  const niva = nivaFor(svar);
  const mal = malFor(svar);

  const forslag = byggForslag(svar, omraden, { missadeAffarer, mal }, ai);

  return {
    forslag,
    plan: byggPlan(svar, forslag, ai),
    niva,
    kallaForslag: ai ? "ai" : "regler",
    omraden,
    lagt,
    besparing,
    missadeAffarer,
    mal,
    litenTid: besparing.max < LITEN_TID_UNDER[niva],
    bransch,
  };
}
