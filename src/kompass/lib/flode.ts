/**
 * Flödets ordning.
 *
 * Listan byggs om varje gång svaren ändras. Del 1 är samma för alla: bransch,
 * storlek, mål och vad som görs för hand. Sedan väljer flödet frågor efter
 * deras situation — specialspår, en följdskärm per valt arbetsmönster — så
 * att ingen behöver svara på något som inte tydligt kan gälla dem, eller på
 * samma sak två gånger. Den som backar och ändrar sig får alltid rätt frågor,
 * inte gamla.
 */

import { ordFor } from "@/kompass/data/floden";
import {
  AFFARER_OM_FORFRAGNINGAR,
  BRANSCH,
  FRAGA,
  FRAGOR,
  INGA_PENGAR_FOR,
  KANALER_MED_TELEFON,
  KUNDBOKNING,
  MAL,
  MANGA_MISSADE_SAMTAL,
  MAX_SPAR,
  MAX_TIDSTJUVAR,
  NIVA_FOR_ANTAL,
  OMRADEN,
  OMRADESFRAGOR,
  OMRADESNYCKEL,
  SPECIAL,
  tidsskalaFor,
  type Bransch,
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

/** Service-målet i branschens ord: "Ge era patienter bättre service". */
function serviceText(bransch: Bransch | undefined): string {
  return `Ge era ${ordFor(bransch).kunder} bättre service`;
}

/** Vad de sagt skulle göra störst skillnad, eller undefined om de inte svarat. */
export function malFor(svar: Svar): Mal | undefined {
  const varde = enval(svar, FRAGA.mal);
  if (!varde) return undefined;
  if (varde === serviceText(branschFor(svar))) return "service";
  return (Object.keys(MAL) as Mal[]).find((m) => MAL[m] === varde);
}

/** Målet som text, tillbaka från ett sparat svar — för mejlen. */
export function malFranText(text: string | null | undefined): Mal | undefined {
  if (!text) return undefined;
  if (/^Ge era .+ bättre service$/.test(text)) return "service";
  return (Object.keys(MAL) as Mal[]).find((m) => MAL[m] === text);
}

// ── Specialspår ─────────────────────────────────────────────────────────────

/** Spåret målet öppnar. */
const SPAR_FOR_MAL: Readonly<Partial<Record<Mal, string>>> = {
  affarer: FRAGA.affarer,
  service: FRAGA.kanaler,
  integration: FRAGA.systembrott,
};

/** Spåret branschen öppnar — frågor byggda för just deras verksamhet. */
const SPAR_FOR_BRANSCH: Readonly<Partial<Record<Bransch, string>>> = {
  [BRANSCH.tillverkning]: FRAGA.produktion,
};

/** Spåret ett valt arbetsmönster öppnar — en fråga som gräver djupare i det. */
const SPAR_FOR_MONSTER: Readonly<Record<string, string>> = {
  "Flyttar information mellan system": FRAGA.systembrott,
};

/**
 * Specialspåren som visas, i ordning: först det målet öppnar, sedan
 * branschens, sedan mönstrens. Högst MAX_SPAR.
 *
 * Svarar de att intresserade inte hör av sig, eller att förfrågningar inte
 * följs upp, öppnas spåret om hur förfrågningar kommer in direkt efter —
 * det är där frågan om missade samtal hör hemma, och bara där.
 */
export function aktivaSpar(svar: Svar): string[] {
  const spar: string[] = [];
  const lagg = (id: string | undefined) => {
    if (!id || spar.includes(id)) return;
    spar.push(id);
    const affarer = enval(svar, FRAGA.affarer);
    if (id === FRAGA.affarer && AFFARER_OM_FORFRAGNINGAR.some((a) => a === affarer)) {
      lagg(FRAGA.kanaler);
    }
  };

  const mal = malFor(svar);
  lagg(mal ? SPAR_FOR_MAL[mal] : undefined);
  const bransch = branschFor(svar);
  lagg(bransch ? SPAR_FOR_BRANSCH[bransch] : undefined);
  for (const m of lista(svar, FRAGA.tidstjuvar)) lagg(SPAR_FOR_MONSTER[m]);

  return spar.slice(0, MAX_SPAR);
}

function specialSkarm(fraga: Specialfraga): Fraga {
  return {
    id: fraga.id,
    typ: "enval",
    fraga: fraga.fraga,
    hjalptext: fraga.hjalptext,
    alternativ: fraga.alternativ.map((a) => a.svar),
  };
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
 * Den första diagnosen som pekar ut något — deras egen bild av var det
 * bromsar. Styr vilket förslag som leder. "Vet inte" pekar inte ut något.
 */
export function diagnosFor(svar: Svar): Diagnos | undefined {
  return diagnoser(svar).find((d) => d.signal.omraden.length > 0 || d.signal.ide);
}

/** Frågar vi om missade samtal? Bara när förfrågningar kommer in via telefon. */
function fragaMissade(svar: Svar): boolean {
  const kanal = enval(svar, FRAGA.kanaler);
  return (
    aktivaSpar(svar).includes(FRAGA.kanaler) &&
    KANALER_MED_TELEFON.some((k) => k === kanal)
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

/**
 * Skärmen om samtal och förfrågningar, i branschens ord — "Vad är en ny
 * patient värd?". Missade samtal bara om de tar in förfrågningar via
 * telefon; kundvärdet bara när de missar många (det används bara till
 * kronorna för missade samtal), och aldrig där vi inte räknar pengar.
 */
function kundskarm(svar: Svar): Fraga {
  const ord = ordFor(branschFor(svar));
  const telefon = fragaMissade(svar);
  return {
    id: FRAGA.kunder,
    typ: "grupp",
    fraga: telefon ? "Era samtal och förfrågningar" : "Era förfrågningar",
    delar: [
      ...(telefon
        ? [
            {
              id: FRAGA.missadeSamtal,
              fraga: "Hur många samtal missar ni en vanlig vecka?",
              alternativ: ["Inga", "1–5", "6–15", "16–30", "Fler än 30"],
              reaktioner: {
                Inga: "Bra. Då lägger vi krutet på annat.",
                "16–30": "Den som inte får svar ringer ofta nästa firma på listan.",
                "Fler än 30":
                  "Det blir många samtal i veckan som aldrig blir en affär. Här finns ofta mest att hämta.",
              },
            },
          ]
        : []),
      {
        id: FRAGA.svarstid,
        fraga: "Hur snabbt får en förfrågan på mejl eller formulär svar?",
        alternativ: ["Inom en timme", "Samma dag", "Nästa dag", "Det varierar"],
        reaktioner: {
          "Inom en timme": "Snabbt. Det är precis det kunder märker.",
          "Det varierar": "Ärligt svar. Det är ofta det enklaste hålet att täppa till.",
        },
      },
      ...(fragaKundvarde(svar)
        ? [
            {
              id: FRAGA.kundvarde,
              fraga: `Vad är en ny ${ord.kund} värd för er?`,
              hjalptext: `Ungefär vad en ny ${ord.kund} köper för under första året.`,
              alternativ: [
                "Mindre än 1 000 kr",
                "1 000–5 000 kr",
                "5 000–20 000 kr",
                "20 000–100 000 kr",
                "Över 100 000 kr",
                "Vet inte",
              ],
            },
          ]
        : []),
    ],
  };
}

/** Skärmarna för ett specialspår. Förfrågningsspåret har två. */
function sparSkarmar(id: string, svar: Svar): Fraga[] {
  const fraga = SPECIAL[id];
  if (!fraga) return [];
  const skarm = specialSkarm(fraga);
  return id === FRAGA.kanaler ? [skarm, kundskarm(svar)] : [skarm];
}

/** Id:n för alla spårens skärmar — för förloppet och analysens startpunkt. */
export const SPARSKARMAR: ReadonlySet<string> = new Set([...Object.keys(SPECIAL), FRAGA.kunder]);

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
 * Området ett arbetsmönster pekar på. Delar två områden mönster avgör
 * branschen: där kunderna bokar tider blir det bokningar, annars planering.
 */
export function omradeForMonster(monster: string, bransch: Bransch | undefined): Omrade | undefined {
  const kandidater = omradenFor(bransch).filter((o) => o.monster === monster);
  if (kandidater.length <= 1) return kandidater[0];
  const kundbokning = bransch !== undefined && KUNDBOKNING.includes(bransch);
  return kandidater.find((o) => (o.id === "bokning") === kundbokning) ?? kandidater[0];
}

/** De områden besökarens valda mönster pekar på, i den ordning de valdes. */
export function valdaOmraden(svar: Svar): Omrade[] {
  const bransch = branschFor(svar);
  const omraden = lista(svar, FRAGA.tidstjuvar)
    .map((m) => omradeForMonster(m, bransch))
    .filter((o): o is Omrade => o !== undefined);
  return [...new Set(omraden)].slice(0, MAX_TIDSTJUVAR);
}

/**
 * Följdskärmen för ett valt område: tid i veckan och hur det görs i dag. Den
 * första skärmen frågar också vad som händer när det inte fungerar — en gång
 * räcker. Tidsvalen följer storleken — större företag mäter i dagar och
 * tjänster.
 */
export function omradesFraga(
  omrade: Omrade,
  nu: number,
  av: number,
  niva: Niva = "liten",
): Fraga {
  const medKonsekvens = nu === 1;
  return {
    id: OMRADESNYCKEL.skarm(omrade.id),
    typ: "grupp",
    overrubrik: OMRADESFRAGOR.overrubrik(nu, av, medKonsekvens ? 3 : 2),
    fraga: omrade.namn,
    hjalptext: omrade.exempel,
    delar: [
      {
        id: OMRADESNYCKEL.tid(omrade.id),
        fraga: OMRADESFRAGOR.tid.fraga,
        alternativ: Object.keys(tidsskalaFor(niva)),
        // Bara reaktionerna för den skala som visas.
        reaktioner: Object.fromEntries(
          Object.entries(OMRADESFRAGOR.tid.reaktioner).filter(
            ([alt]) => alt in tidsskalaFor(niva),
          ),
        ),
      },
      {
        id: OMRADESNYCKEL.idag(omrade.id),
        fraga: OMRADESFRAGOR.idag.fraga,
        alternativ: OMRADESFRAGOR.idag.alternativ,
      },
      ...(medKonsekvens
        ? [
            {
              id: OMRADESNYCKEL.konsekvens(omrade.id),
              fraga: OMRADESFRAGOR.konsekvens.fraga,
              alternativ: OMRADESFRAGOR.konsekvens.alternativ,
            },
          ]
        : []),
    ],
  };
}

/**
 * Har de redan sagt att information flyttas mellan system — som mönster
 * eller i spåret om var flödet bryts? Då frågar systemskärmen inte om
 * samma sak igen.
 */
function vetOmDubbelinmatning(svar: Svar): boolean {
  return (
    valdaOmraden(svar).some((o) => o.id === "dubbelregistrering") ||
    aktivaSpar(svar).includes(FRAGA.systembrott)
  );
}

/** Räknar vi pengar för den här branschen? Se INGA_PENGAR_FOR. */
export function pengarGallerFor(bransch: string | undefined): boolean {
  return !INGA_PENGAR_FOR.includes(bransch as Bransch);
}

/** Bygger hela frågelistan utifrån svaren hittills. */
export function byggFragor(svar: Svar): Fraga[] {
  const bransch = branschFor(svar);
  const valda = valdaOmraden(svar);
  const fragor: Fraga[] = [];

  for (const fraga of FRAGOR) {
    if (fraga.id === FRAGA.mal && fraga.typ === "enval") {
      fragor.push({
        ...fraga,
        alternativ: fraga.alternativ.map((a) => (a === MAL.service ? serviceText(bransch) : a)),
      });
      continue;
    }
    if (fraga.id === FRAGA.tidstjuvar) {
      fragor.push(fraga);
      // Specialspåren direkt efter — de gräver i det de nyss pekade ut.
      for (const id of aktivaSpar(svar)) fragor.push(...sparSkarmar(id, svar));
      const niva = nivaFor(svar);
      valda.forEach((o, i) => fragor.push(omradesFraga(o, i + 1, valda.length, niva)));
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
 * - Specialspår som inte längre visas — eller vars svar inte längre finns för
 *   branschen — ska bort, annars styr de förslagen.
 * - Frågor om samtal och kundvärde som inte längre ställs ska bort, annars
 *   ger de en kronsiffra.
 * - Väljer man bort ett område ska dess följdsvar bort, annars räknas de in.
 */
export function sattSvar(svar: Svar, id: string, varde: string | string[]): Svar {
  const nya: Svar = { ...svar, [id]: varde };

  // Byter man bransch byter service-målet ord: "kunder" blir "patienter".
  if (id === FRAGA.bransch && malFor(svar) === "service") {
    nya[FRAGA.mal] = serviceText(branschFor(nya));
  }

  // Spåren beror på varandra (affärsspåret öppnar förfrågningsspåret), så
  // rensa tills inget mer ändras.
  for (let varv = 0; varv < 3; varv++) {
    const aktiva = new Set(aktivaSpar(nya));
    let andrat = false;
    for (const sid of Object.keys(SPECIAL)) {
      const v = nya[sid];
      if (v === undefined) continue;
      const giltiga = aktiva.has(sid) ? SPECIAL[sid].alternativ.map((a) => a.svar) : [];
      if (typeof v !== "string" || !giltiga.includes(v)) {
        delete nya[sid];
        andrat = true;
      }
    }
    if (!andrat) break;
  }

  if (!aktivaSpar(nya).includes(FRAGA.kanaler)) delete nya[FRAGA.svarstid];
  if (!fragaMissade(nya)) delete nya[FRAGA.missadeSamtal];
  if (!fragaKundvarde(nya)) delete nya[FRAGA.kundvarde];

  // Byter man storlek så att tidsskalan byts passar de gamla tidssvaren inte
  // längre — "Mer än 10 h" finns inte för ett företag med 30 anställda.
  if (id === FRAGA.antal && nivaFor(svar) !== nivaFor(nya)) {
    const skala = tidsskalaFor(nivaFor(nya));
    for (const omrade of OMRADEN) {
      const nyckel = OMRADESNYCKEL.tid(omrade.id);
      const gammalt = nya[nyckel];
      if (typeof gammalt === "string" && !(gammalt in skala)) delete nya[nyckel];
    }
  }

  if (vetOmDubbelinmatning(nya)) delete nya[FRAGA.dubbelinmatning];

  // Rensa följdsvar för områden som inte längre är valda — även när ett
  // mönster byter område för att branschen ändrats. Konsekvensen hör bara
  // till det första valda området.
  const valda = valdaOmraden(nya);
  const valdaIds = new Set(valda.map((o) => o.id));
  for (const omrade of OMRADEN) {
    if (omrade.id !== valda[0]?.id) delete nya[OMRADESNYCKEL.konsekvens(omrade.id)];
    if (valdaIds.has(omrade.id)) continue;
    delete nya[OMRADESNYCKEL.tid(omrade.id)];
    delete nya[OMRADESNYCKEL.idag(omrade.id)];
  }

  return nya;
}

// ── localStorage ────────────────────────────────────────────────────────────

// v3: frågorna gjordes om 2026-09-30 (mål, mönster, specialspår). Gamla
// sparade svar passar inte in.
const LAGRINGSNYCKEL = "khyte-kompass-v3";

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
