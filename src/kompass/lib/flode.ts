/**
 * Flödets ordning.
 *
 * Listan byggs om varje gång svaren ändras: vilka områden som går att välja
 * beror på bransch, och varje valt område får en egen följdskärm. Den som
 * backar och ändrar sig får alltid rätt frågor — inte gamla.
 */

import { BRANSCHTIPS, ordFor } from "@/kompass/data/floden";
import {
  ANTAL_SNABBVAL,
  BRANSCH,
  FLASKHALS,
  FRAGA,
  FRAGOR,
  INGA_PENGAR_FOR,
  MAL,
  MANGA_MISSADE_SAMTAL,
  MAX_TIDSTJUVAR,
  NIVA_FOR_ANTAL,
  OMRADEN,
  OMRADESFRAGOR,
  OMRADESNYCKEL,
  tidsskalaFor,
  type Bransch,
  type Flaskhals,
  type Mal,
  type Niva,
  type Fraga,
  type Omrade,
} from "@/kompass/data/kompass";
import type { Kalla, Svar } from "@/kompass/lib/typer";

/** Storleksnivån. Innan antal är besvarat räknar vi med ett litet företag. */
/** Vad de sagt är viktigast just nu, eller undefined om de inte svarat. */
export function malFor(svar: Svar): Mal | undefined {
  const varde = svar[FRAGA.mal];
  return (Object.keys(MAL) as Mal[]).find((m) => MAL[m] === varde);
}

/** Svaret på följdfrågan efter målet, eller undefined. */
export function flaskhalsFor(svar: Svar): Flaskhals | undefined {
  const mal = malFor(svar);
  if (!mal || mal === "admin") return undefined;
  return FLASKHALS[mal].alternativ.find((a) => a.svar === svar[FRAGA.flaskhals]);
}

/** Följdskärmen efter målet. Ingen för "Minska administrationen". */
function flaskhalsFraga(svar: Svar): Fraga | null {
  const mal = malFor(svar);
  if (!mal || mal === "admin") return null;
  return {
    id: FRAGA.flaskhals,
    typ: "enval",
    fraga: FLASKHALS[mal].fraga,
    alternativ: FLASKHALS[mal].alternativ.map((a) => a.svar),
  };
}

/** Frågar vi om kundvärde? Bara vid många missade samtal — annars används det inte. */
function fragaKundvarde(svar: Svar): boolean {
  const bransch = svar[FRAGA.bransch];
  const missade = svar[FRAGA.missadeSamtal];
  return (
    pengarGallerFor(typeof bransch === "string" ? bransch : undefined) &&
    MANGA_MISSADE_SAMTAL.some((m) => m === missade)
  );
}

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

/** Slår upp ett område på namnet — det är namnet som sparas som svar. */
export function omradeFranNamn(namn: string): Omrade | undefined {
  return OMRADEN.find((o) => o.namn === namn);
}

/** De områden besökaren valt, i den ordning de valdes. */
export function valdaOmraden(svar: Svar): Omrade[] {
  const valda = svar[FRAGA.tidstjuvar];
  if (!Array.isArray(valda)) return [];
  return valda
    .map(omradeFranNamn)
    .filter((o): o is Omrade => o !== undefined)
    .slice(0, MAX_TIDSTJUVAR);
}

/**
 * Följdskärmen för ett valt område: tid i veckan och hur det görs i dag.
 * Tidsvalen följer storleken — större företag mäter i dagar och tjänster.
 */
export function omradesFraga(
  omrade: Omrade,
  nu: number,
  av: number,
  niva: Niva = "liten",
): Fraga {
  return {
    id: OMRADESNYCKEL.skarm(omrade.id),
    typ: "grupp",
    overrubrik: OMRADESFRAGOR.overrubrik(nu, av),
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
    ],
  };
}

/**
 * Snabbvalen på "vilken uppgift vill du slippa?": först det de valt som
 * tidstjuvar, sedan det som är vanligast i deras bransch. Ett tryck i stället
 * för att skriva — fler svarar, och fler får ett personligt förslag.
 */
export function snabbvalFor(svar: Svar): string[] {
  const bransch = svar[FRAGA.bransch];
  const tillgangliga = omradenFor(typeof bransch === "string" ? bransch : undefined);
  const tips = BRANSCHTIPS[(bransch as Bransch) ?? BRANSCH.annat] ?? BRANSCHTIPS[BRANSCH.annat];

  const ordning = [
    ...valdaOmraden(svar),
    ...tips.flatMap((id) => tillgangliga.filter((o) => o.id === id)),
    ...tillgangliga,
  ];

  const unika = [...new Set(ordning.map((o) => o.uppgift))];
  return unika.slice(0, ANTAL_SNABBVAL);
}

/** Räknar vi pengar för den här branschen? Se INGA_PENGAR_FOR. */
export function pengarGallerFor(bransch: string | undefined): boolean {
  return !INGA_PENGAR_FOR.includes(bransch as Bransch);
}

/**
 * Kundskärmen i branschens egna ord — "Vad är en ny patient värd?". Frågan om
 * kundvärde kommer bara när de missar många samtal (den används bara till
 * kronorna för missade samtal), och aldrig där vi inte räknar pengar
 * (fastighet, butik). Raden dyker upp när de svarat på missade samtal.
 */
function kundskarm(fraga: Fraga, svar: Svar): Fraga {
  if (fraga.typ !== "grupp") return fraga;
  const bransch = svar[FRAGA.bransch];
  const ord = ordFor(bransch as Bransch | undefined);
  return {
    ...fraga,
    delar: fraga.delar
      .filter((d) => d.id !== FRAGA.kundvarde || fragaKundvarde(svar))
      .map((d) =>
        d.id === FRAGA.kundvarde
          ? {
              ...d,
              fraga: `Vad är en ny ${ord.kund} värd för er?`,
              hjalptext: `Ungefär vad en ny ${ord.kund} köper för under första året.`,
            }
          : d,
      ),
  };
}

/** Bygger hela frågelistan utifrån svaren hittills. */
export function byggFragor(svar: Svar): Fraga[] {
  const bransch = svar[FRAGA.bransch];
  const valda = valdaOmraden(svar);
  const fragor: Fraga[] = [];

  for (const fraga of FRAGOR) {
    if (fraga.id === FRAGA.tidstjuvar && fraga.typ === "flerval") {
      fragor.push({
        ...fraga,
        alternativ: omradenFor(
          typeof bransch === "string" ? bransch : undefined,
        ).map((o) => o.namn),
      });
      const niva = nivaFor(svar);
      valda.forEach((o, i) =>
        fragor.push(omradesFraga(o, i + 1, valda.length, niva)),
      );
      continue;
    }
    if (fraga.typ === "fritext") {
      fragor.push({ ...fraga, snabbval: snabbvalFor(svar) });
      continue;
    }
    if (fraga.id === FRAGA.kunder) {
      fragor.push(kundskarm(fraga, svar));
      continue;
    }
    fragor.push(fraga);
    // Följdfrågan efter målet kommer direkt efter skärmen där målet valdes.
    if (fraga.id === FRAGA.omEr) {
      const flaskhals = flaskhalsFraga(svar);
      if (flaskhals) fragor.push(flaskhals);
    }
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
 * - Byter man bransch kan ett valt område (RUT/ROT) inte längre finnas.
 * - Väljer man bort ett område ska dess följdsvar bort, annars räknas de in.
 */
export function sattSvar(svar: Svar, id: string, varde: string | string[]): Svar {
  const nya: Svar = { ...svar, [id]: varde };

  // Kundvärdet frågas bara vid många missade samtal och där vi räknar
  // pengar — ett gammalt svar ska inte ligga kvar och ge en kronsiffra.
  if (!fragaKundvarde(nya)) delete nya[FRAGA.kundvarde];

  // Byter man mål hör den gamla flaskhalsen till en annan fråga.
  if (id === FRAGA.mal && svar[FRAGA.mal] !== varde) delete nya[FRAGA.flaskhals];

  if (id === FRAGA.bransch && typeof varde === "string") {
    const tillatna = new Set(omradenFor(varde).map((o) => o.namn));
    const valda = nya[FRAGA.tidstjuvar];
    if (Array.isArray(valda)) {
      nya[FRAGA.tidstjuvar] = valda.filter((v) => tillatna.has(v));
    }
  }

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

  // Rensa följdsvar för områden som inte längre är valda.
  const valdaIds = new Set(valdaOmraden(nya).map((o) => o.id));
  for (const omrade of OMRADEN) {
    if (valdaIds.has(omrade.id)) continue;
    delete nya[OMRADESNYCKEL.tid(omrade.id)];
    delete nya[OMRADESNYCKEL.idag(omrade.id)];
  }

  return nya;
}

// ── localStorage ────────────────────────────────────────────────────────────

// v2: frågorna gjordes om 2026-09-23. Gamla sparade svar passar inte in.
const LAGRINGSNYCKEL = "khyte-kompass-v2";

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
