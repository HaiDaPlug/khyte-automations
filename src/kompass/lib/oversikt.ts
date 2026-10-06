/**
 * Uträkningarna bakom den interna översikten (/internal/kompass).
 *
 * Rena funktioner utan databas — servern hämtar raderna (server/oversikt.ts)
 * och räknar här. Allt räknas per besök (session_id), inte per händelse: den
 * som backar och svarar igen ska inte räknas två gånger.
 */

import { FRAGA } from "@/kompass/data/kompass";

/** Skärmarna i flödets ordning, med namn för översikten. */
const STEG: readonly [id: string, namn: string][] = [
  [FRAGA.omEr, "Om er"],
  [FRAGA.mal, "Mål"],
  [FRAGA.tidstjuvar, "Görs för hand"],
  [FRAGA.affarer, "Följdfråga: affärer"],
  [`skarm_${FRAGA.affarer}`, "Följdfråga: affärer"],
  [FRAGA.kanaler, "Följdfråga: förfrågningar"],
  [`skarm_${FRAGA.kanaler}`, "Följdfråga: förfrågningar"],
  [FRAGA.systembrott, "Följdfråga: system"],
  [FRAGA.produktion, "Följdfråga: produktion"],
  [FRAGA.tid, "Tid och konsekvens"],
  [FRAGA.slutet, "System"],
  [FRAGA.fritext, "Arbetsflöde"],
];

const NAMN = new Map(STEG);
const ORDNING = [...new Set(STEG.map(([, namn]) => namn))];

/** Skärmens namn. Okända id:n kommer från en äldre version av kompassen. */
export function stegNamn(id: string | null | undefined): string {
  if (!id) return "Före första frågan";
  return NAMN.get(id) ?? `${id} (äldre version)`;
}

/** Sorterar efter flödets ordning; okända sist, i bokstavsordning. */
function iOrdning<T extends { namn: string }>(rader: T[]): T[] {
  const plats = (namn: string) => {
    const i = ORDNING.indexOf(namn);
    return i === -1 ? ORDNING.length : i;
  };
  return [...rader].sort((a, b) => plats(a.namn) - plats(b.namn) || a.namn.localeCompare(b.namn, "sv"));
}

export type Handelse = { session_id: string; handelse: string; steg: string | null };

export type Tratt = {
  startade: number;
  resultat: number;
  leads: number;
  mote: number;
  /** Besök som besvarat varje skärm, i flödets ordning. */
  steg: { namn: string; antal: number }[];
};

/**
 * Antal olika besök per händelse och per besvarad skärm — bara för besök som
 * startade under perioden. Den som startade innan och blev klar inuti räknas
 * inte alls; annars jämförs olika besök och andelarna kan gå över 100 %.
 */
export function raknaTratt(handelser: readonly Handelse[]): Tratt {
  const kohort = new Set(handelser.filter((h) => h.handelse === "start").map((h) => h.session_id));
  const iKohort = handelser.filter((h) => kohort.has(h.session_id));
  const besok = (handelse: string) =>
    new Set(iKohort.filter((h) => h.handelse === handelse).map((h) => h.session_id)).size;

  const perSteg = new Map<string, Set<string>>();
  for (const h of iKohort) {
    if (h.handelse !== "fraga_besvarad") continue;
    const namn = stegNamn(h.steg);
    const set = perSteg.get(namn) ?? new Set<string>();
    set.add(h.session_id);
    perSteg.set(namn, set);
  }

  return {
    startade: besok("start"),
    resultat: besok("resultat_visat"),
    leads: besok("kontakt_lamnad"),
    mote: besok("mote_klick"),
    steg: iOrdning([...perSteg].map(([namn, set]) => ({ namn, antal: set.size }))),
  };
}

/** Besöken som inte nådde resultatet, efter var de slutade. */
export function raknaAvhopp(
  rader: readonly { senaste_fraga: string | null; klar: boolean }[],
): { namn: string; antal: number }[] {
  const antal = new Map<string, number>();
  for (const r of rader) {
    if (r.klar) continue;
    const namn = stegNamn(r.senaste_fraga);
    antal.set(namn, (antal.get(namn) ?? 0) + 1);
  }
  return iOrdning([...antal].map(([namn, n]) => ({ namn, antal: n })));
}

/** "43 %", eller "–" när det inte finns något att räkna på. */
export function andel(del: number, av: number): string {
  if (!av) return "–";
  return `${Math.round((del / av) * 100)} %`;
}

type StegStatus = { status?: string };

/**
 * Leveransen i en rad: "Sälj ✓ · Resultat ✓". Misslyckade steg markeras med
 * ✗, väntande med …, och CRM (som inte är uppsatt) visas inte.
 */
export function leveransText(status: Record<string, StegStatus> | null | undefined): string {
  const tecken = (s?: StegStatus) =>
    s?.status === "skickad" ? "✓" : s?.status === "misslyckad" ? "✗" : "…";
  return `Sälj ${tecken(status?.saljmejl)} · Resultat ${tecken(status?.resultatmejl)}`;
}
