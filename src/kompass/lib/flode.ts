/**
 * Flödets ordning.
 *
 * Kompassen ska vara lätt att genomföra: några få skärmar, få val per fråga,
 * och varje fråga ska ge något vi använder — i resultatet, i AI-analysen eller
 * i mötet. Listan byggs om varje gång svaren ändras:
 *
 *   1. Om er — bransch och storlek på samma skärm
 *   2. Vad som skulle göra störst skillnad
 *   3. Vad som görs för hand
 *   4. Högst en följdfråga, bara när den är relevant
 *   5. Tid per valt område och vad som händer när det inte fungerar — en skärm
 *   6. Systemen
 *   7. Arbetsflödet, frivilligt
 *
 * Den som backar och ändrar sig får alltid rätt frågor, inte gamla.
 */

import { ordFor } from "@/kompass/data/floden";
import {
  BRANSCH,
  FRAGA,
  FRAGOR,
  INGA_PENGAR_FOR,
  KANALER_MED_TELEFON,
  KONSEKVENS,
  KUNDBOKNING,
  MAL,
  MANGA_MISSADE_SAMTAL,
  MAX_SPAR,
  MAX_TIDSTJUVAR,
  MONSTER,
  NIVA_FOR_ANTAL,
  OMRADEN,
  OMRADESNYCKEL,
  SPECIAL,
  TIDSSKARM,
  tidsskalaFor,
  type Bransch,
  type Delfraga,
  type Fraga,
  type Mal,
  type Niva,
  type Omrade,
  type Signal,
  type Specialfraga,
} from "@/kompass/data/kompass";
import type { Kalla, Svar } from "@/kompass/lib/typer";

function enval(svar: Svar, id: string): string | undefined {
  const v = svar[id];
  return typeof v === "string" ? v : undefined;
}

function lista(svar: Svar, id: string): string[] {
  const v = svar[id];
  return Array.isArray(v) ? v : [];
}

const branschFor = (svar: Svar) => enval(svar, FRAGA.bransch) as Bransch | undefined;

// ── Mål ─────────────────────────────────────────────────────────────────────

/** Målet som id, ur ett sparat svar — för mejlen. */
export function malFranText(text: string | null | undefined): Mal | undefined {
  if (!text) return undefined;
  return (Object.keys(MAL) as Mal[]).find((m) => MAL[m] === text);
}

/** Vad de sagt skulle göra störst skillnad, eller undefined om de inte svarat. */
export function malFor(svar: Svar): Mal | undefined {
  return malFranText(enval(svar, FRAGA.mal));
}

// ── Storlek och områden ─────────────────────────────────────────────────────

/** Storleksnivån. Innan antal är besvarat räknar vi med ett litet företag. */
export function nivaFor(svar: Svar): Niva {
  const antal = svar[FRAGA.antal];
  return (typeof antal === "string" && NIVA_FOR_ANTAL[antal]) || "liten";
}

/** Områden som går att välja för en bransch. */
export function omradenFor(bransch: string | undefined): Omrade[] {
  return OMRADEN.filter(
    (o) => !o.branscher || o.branscher.includes(bransch as Bransch),
  );
}

/**
 * Området ett mönster pekar på. Där kunderna bokar tider blir planering
 * kundbokningar; från tio anställda blir förfrågningar ett ärendeflöde.
 */
export function omradeForMonster(
  text: string,
  bransch: Bransch | undefined,
  niva: Niva,
): Omrade | undefined {
  const m = MONSTER.find((x) => x.text === text);
  if (!m) return undefined;
  const id =
    (m.kundbokning && bransch && KUNDBOKNING.includes(bransch) ? m.kundbokning : undefined) ??
    (m.storre && niva !== "liten" ? m.storre : undefined) ??
    m.omrade;
  return omradenFor(bransch).find((o) => o.id === id);
}

/** De områden besökarens valda mönster pekar på, i den ordning de valdes. */
export function valdaOmraden(svar: Svar): Omrade[] {
  const bransch = branschFor(svar);
  const niva = nivaFor(svar);
  const omraden = lista(svar, FRAGA.tidstjuvar)
    .map((m) => omradeForMonster(m, bransch, niva))
    .filter((o): o is Omrade => o !== undefined);
  return [...new Set(omraden)].slice(0, MAX_TIDSTJUVAR);
}

/** Räknar vi pengar för den här branschen? Se INGA_PENGAR_FOR. */
export function pengarGallerFor(bransch: string | undefined): boolean {
  return !INGA_PENGAR_FOR.includes(bransch as Bransch);
}

// ── Specialspåret ───────────────────────────────────────────────────────────

/** Spåret målet öppnar. */
const SPAR_FOR_MAL: Readonly<Partial<Record<Mal, string>>> = {
  affarer: FRAGA.affarer,
  service: FRAGA.kanaler,
  integration: FRAGA.systembrott,
};

/** Spåret branschen öppnar — en fråga byggd för just deras verksamhet. */
const SPAR_FOR_BRANSCH: Readonly<Partial<Record<Bransch, string>>> = {
  [BRANSCH.tillverkning]: FRAGA.produktion,
};

/** Spåret ett valt mönster öppnar — en fråga som gräver djupare i det. */
const SPAR_FOR_MONSTER: Readonly<Record<string, string>> = {
  "Flytta information mellan system": FRAGA.systembrott,
};

/**
 * Specialspåret som visas: det målet öppnar, annars branschens, annars
 * mönstrens. Högst MAX_SPAR — en följdfråga räcker för att gräva där de pekat.
 */
export function aktivaSpar(svar: Svar): string[] {
  const mal = malFor(svar);
  const bransch = branschFor(svar);
  const kandidater = [
    mal ? SPAR_FOR_MAL[mal] : undefined,
    bransch ? SPAR_FOR_BRANSCH[bransch] : undefined,
    ...lista(svar, FRAGA.tidstjuvar).map((m) => SPAR_FOR_MONSTER[m]),
  ].filter((id): id is string => id !== undefined);
  return [...new Set(kandidater)].slice(0, MAX_SPAR);
}

/** Ett besvarat specialspår: frågan och signalen i svaret. */
export type Diagnos = { fraga: Specialfraga; signal: Signal };

/** Alla besvarade specialspår, i spårens ordning. */
export function diagnoser(svar: Svar): Diagnos[] {
  return aktivaSpar(svar).flatMap((id) => {
    const fraga = SPECIAL[id];
    const varde = enval(svar, id);
    const signal = fraga?.alternativ.find((a) => a.svar === varde);
    return fraga && signal ? [{ fraga, signal }] : [];
  });
}

/**
 * Diagnosen — deras egen bild av var det bromsar. Styr vilket förslag som
 * leder.
 */
export function diagnosFor(svar: Svar): Diagnos | undefined {
  return diagnoser(svar).find((d) => d.signal.omraden.length > 0 || d.signal.ide);
}

/**
 * Frågar vi om missade samtal? När förfrågningar kommer in via telefon, och
 * för små företag som vill ha fler affärer — där ett missat samtal ofta är en
 * förlorad kund. Aldrig där vi inte räknar pengar på samtal.
 */
function fragaMissade(svar: Svar): boolean {
  const spar = aktivaSpar(svar);
  if (spar.includes(FRAGA.kanaler)) {
    return KANALER_MED_TELEFON.some((k) => k === enval(svar, FRAGA.kanaler));
  }
  return (
    spar.includes(FRAGA.affarer) &&
    nivaFor(svar) === "liten" &&
    pengarGallerFor(branschFor(svar))
  );
}

/** Frågar vi om kundvärde? Bara vid många missade samtal — annars används det inte. */
function fragaKundvarde(svar: Svar): boolean {
  return (
    fragaMissade(svar) &&
    pengarGallerFor(branschFor(svar)) &&
    MANGA_MISSADE_SAMTAL.some((m) => m === enval(svar, FRAGA.missadeSamtal))
  );
}

/** Raderna om samtal och kundvärde, när de är relevanta. */
function samtalsrader(svar: Svar): Delfraga[] {
  const ord = ordFor(branschFor(svar));
  return [
    ...(fragaMissade(svar)
      ? [
          {
            id: FRAGA.missadeSamtal,
            fraga: "Hur många samtal missar ni en vanlig vecka?",
            alternativ: ["Nästan inga", "1–5", "6–15", "Fler än 15"],
            reaktioner: {
              "Fler än 15":
                "Det blir många samtal i veckan som aldrig blir en affär. Här finns ofta mest att hämta.",
            },
          },
        ]
      : []),
    ...(fragaKundvarde(svar)
      ? [
          {
            id: FRAGA.kundvarde,
            fraga: `Vad är en ny ${ord.kund} värd för er, ungefär?`,
            hjalptext: "Det en ny kund köper för under första året.",
            alternativ: ["Under 5 000 kr", "5 000–50 000 kr", "Över 50 000 kr", "Vet inte"],
          },
        ]
      : []),
  ];
}

/** Rubriken när spårets fråga delar skärm med samtalsraderna. */
const SPARRUBRIK: Readonly<Record<string, string>> = {
  [FRAGA.affarer]: "Era affärer",
  [FRAGA.kanaler]: "Era förfrågningar",
};

/**
 * Skärmen för specialspåret. Har spåret samtalsrader blir det en skärm med
 * flera rader; annars en vanlig fråga som går vidare med ett tryck.
 */
function sparSkarm(id: string, svar: Svar): Fraga | null {
  const fraga = SPECIAL[id];
  if (!fraga) return null;
  const alternativ = fraga.alternativ.map((a) => a.svar);
  const rader = id in SPARRUBRIK ? samtalsrader(svar) : [];

  if (rader.length === 0 && id !== FRAGA.kanaler) {
    return { id, typ: "enval", fraga: fraga.fraga, alternativ };
  }
  return {
    id: `skarm_${id}`,
    typ: "grupp",
    fraga: SPARRUBRIK[id] ?? fraga.fraga,
    delar: [{ id, fraga: fraga.fraga, alternativ }, ...rader],
  };
}

/** Id:n för spårets skärmar — för förloppet. */
export const SPARSKARMAR: ReadonlySet<string> = new Set(
  Object.keys(SPECIAL).flatMap((id) => [id, `skarm_${id}`]),
);

// ── Tidsskärmen ─────────────────────────────────────────────────────────────

const TIDSREAKTIONER: Readonly<Record<string, string>> = {
  "Mer än 10 h":
    "Det är över en arbetsdag i veckan, varje vecka. Där brukar det finnas mycket att hämta.",
  "Mer än en heltid":
    "Mer än en heltidstjänst. Här handlar det inte om minuter utan om hur verksamheten är byggd.",
};

/**
 * En skärm för allt de valt: en tidsrad per område, sist vad som händer när
 * det inte fungerar. Tidsvalen följer storleken — större företag mäter i
 * dagar och tjänster.
 */
function tidSkarm(valda: Omrade[], niva: Niva): Fraga {
  const skala = Object.keys(tidsskalaFor(niva));
  const reaktioner = Object.fromEntries(
    Object.entries(TIDSREAKTIONER).filter(([alt]) => skala.includes(alt)),
  );
  return {
    id: FRAGA.tid,
    typ: "grupp",
    fraga: valda.length > 0 ? TIDSSKARM.fraga : TIDSSKARM.fragaUtanTid,
    hjalptext: valda.length > 0 ? TIDSSKARM.hjalptext : undefined,
    delar: [
      ...valda.map((o) => ({
        id: OMRADESNYCKEL.tid(o.id),
        fraga: o.namn,
        alternativ: skala,
        reaktioner,
      })),
      {
        id: FRAGA.konsekvens,
        fraga: valda.length > 0 ? TIDSSKARM.konsekvens : "Välj det som stämmer bäst",
        alternativ: Object.keys(KONSEKVENS),
      },
    ],
  };
}

/**
 * Har de redan sagt att information flyttas mellan system? Då frågar
 * systemskärmen inte om samma sak igen.
 */
function vetOmDubbelinmatning(svar: Svar): boolean {
  return (
    valdaOmraden(svar).some((o) => o.id === "dubbelregistrering") ||
    aktivaSpar(svar).includes(FRAGA.systembrott)
  );
}

// ── Frågelistan ─────────────────────────────────────────────────────────────

/** Bygger hela frågelistan utifrån svaren hittills. */
export function byggFragor(svar: Svar): Fraga[] {
  const fragor: Fraga[] = [];

  for (const fraga of FRAGOR) {
    if (fraga.id === FRAGA.tidstjuvar) {
      fragor.push(fraga);
      // Följdfrågan direkt efter — den gräver i det de nyss pekade ut.
      for (const id of aktivaSpar(svar)) {
        const skarm = sparSkarm(id, svar);
        if (skarm) fragor.push(skarm);
      }
      fragor.push(tidSkarm(valdaOmraden(svar), nivaFor(svar)));
      continue;
    }
    if (fraga.id === FRAGA.slutet && fraga.typ === "grupp" && vetOmDubbelinmatning(svar)) {
      fragor.push({ ...fraga, delar: fraga.delar.filter((d) => d.id !== FRAGA.dubbelinmatning) });
      continue;
    }
    fragor.push(fraga);
  }

  return fragor;
}

/** Är frågan besvarad? Fritext räknas alltid som klar — den är frivillig. */
export function arBesvarad(fraga: Fraga, svar: Svar): boolean {
  if (fraga.typ === "fritext") return true;

  if (fraga.typ === "grupp") {
    return fraga.delar.every((d) => {
      const v = svar[d.id];
      return d.flerval
        ? Array.isArray(v) && v.length > 0
        : typeof v === "string" && v.length > 0;
    });
  }

  const varde = svar[fraga.id];
  if (fraga.typ === "flerval") {
    return Array.isArray(varde) && varde.length > 0;
  }
  return typeof varde === "string" && varde.length > 0;
}

/**
 * Sätter ett svar och rensar det som blivit ogiltigt av ändringen.
 *
 * - Ett specialspår som inte längre visas ska bort, annars styr det förslagen.
 * - Frågor om samtal och kundvärde som inte längre ställs ska bort, annars
 *   ger de en kronsiffra.
 * - Väljer man bort ett område ska dess tid bort, annars räknas den in.
 */
export function sattSvar(svar: Svar, id: string, varde: string | string[]): Svar {
  const nya: Svar = { ...svar, [id]: varde };

  const aktiva = new Set(aktivaSpar(nya));
  for (const sid of Object.keys(SPECIAL)) {
    if (nya[sid] !== undefined && !aktiva.has(sid)) delete nya[sid];
  }

  if (!fragaMissade(nya)) delete nya[FRAGA.missadeSamtal];
  if (!fragaKundvarde(nya)) delete nya[FRAGA.kundvarde];
  if (vetOmDubbelinmatning(nya)) delete nya[FRAGA.dubbelinmatning];

  // Byter man storlek så att tidsskalan byts passar de gamla tidssvaren inte
  // längre — "Mer än 10 h" finns inte för ett företag med 30 anställda.
  const skala = tidsskalaFor(nivaFor(nya));
  const valdaIds = new Set(valdaOmraden(nya).map((o) => o.id));
  for (const omrade of OMRADEN) {
    const nyckel = OMRADESNYCKEL.tid(omrade.id);
    const tid = nya[nyckel];
    if (tid === undefined) continue;
    // Bortvalt område — eller ett mönster som bytt område när branschen
    // eller storleken ändrats.
    if (!valdaIds.has(omrade.id) || typeof tid !== "string" || !(tid in skala)) {
      delete nya[nyckel];
    }
  }

  return nya;
}

// ── localStorage ────────────────────────────────────────────────────────────

// v4: kompassen kortades 2026-09-30 (färre frågor och val). Gamla sparade
// svar passar inte in.
const LAGRINGSNYCKEL = "khyte-kompass-v4";

export type SparatLage = {
  sessionId: string;
  svar: Svar;
  steg: number;
  ref?: string;
  kalla?: Kalla;
};

/**
 * Sparar pågående svar så att en omladdning inte börjar om.
 * Misslyckas tyst — privat läge och blockerad lagring ska inte krascha flödet.
 */
export function spara(lage: SparatLage): void {
  try {
    localStorage.setItem(LAGRINGSNYCKEL, JSON.stringify(lage));
  } catch {
    // Lagring kan vara blockerad. Flödet fungerar ändå, det minns bara inte.
  }
}

export function lasSparat(): SparatLage | null {
  try {
    const ratt = localStorage.getItem(LAGRINGSNYCKEL);
    if (!ratt) return null;

    const tolkat = JSON.parse(ratt) as unknown;
    if (
      typeof tolkat === "object" &&
      tolkat !== null &&
      "sessionId" in tolkat &&
      "svar" in tolkat
    ) {
      return tolkat as SparatLage;
    }
    return null;
  } catch {
    return null;
  }
}

export function rensaSparat(): void {
  try {
    localStorage.removeItem(LAGRINGSNYCKEL);
  } catch {
    // Se kommentaren i spara().
  }
}
