/**
 * Meningen överst på resultatsidan.
 *
 * Företagsperspektivet först: den börjar med vad det kostar affären, sedan
 * var tiden går, och sist vad en automatisering frigör. Byggs av användarens
 * egna svar — inga påståenden som inte går att härleda ur det de svarat.
 */

import { FRAGA, MANGA_MISSADE_SAMTAL, TEXT } from "@/kompass/data/kompass";
import { KEDJOR } from "@/kompass/data/floden";
import type { Forslag, Resultat, Svar } from "@/kompass/lib/typer";

/**
 * Konsekvensen av det starkaste förslaget: kedjans, annars det första
 * områdets. Förslag utan egna svar (branschens vanligaste) och önskemålet
 * ger ingen konsekvensmening — den vore en gissning.
 */
function konsekvens(forslag: Forslag | undefined): string | null {
  if (!forslag || forslag.kalla === "bransch" || forslag.kalla === "onskemal") return null;
  if (forslag.id.startsWith("kedja-")) {
    return KEDJOR.find((k) => `kedja-${k.id}` === forslag.id)?.konsekvens ?? null;
  }
  return (forslag.omrade ?? forslag.omraden?.[0])?.konsekvens ?? null;
}

/**
 * Kort: konsekvensen för affären, och om de missar många samtal en mening om
 * det. Var tiden går och vad som kan sparas står redan i rutorna och
 * tidskartan direkt under — det upprepas inte här.
 *
 * Exempel: «Varje överlämning mellan offert, planering och faktura gör att
 * affärer tar längre tid att vinna och att pengarna kommer in senare.
 * Dessutom missar ni 6–15 samtal i veckan.»
 *
 * Saknar det ledande förslaget en konsekvens (t.ex. en tillväxtidé) används
 * målets konsekvens — rubriken ovanför bär redan målet.
 */
export function byggSammanfattning(resultat: Resultat, svar: Svar): string {
  const meningar: string[] = [];
  const inledning = konsekvens(resultat.forslag[0]);
  const [storst] = resultat.omraden.filter((o) => !o.foreslaget);

  const malKonsekvens = resultat.mal ? TEXT.resultat.malKonsekvens[resultat.mal] : undefined;

  if (inledning) meningar.push(inledning);
  else if (malKonsekvens) meningar.push(malKonsekvens);
  // Saknas en konsekvens (starkaste förslaget bygger inte på egna svar):
  // säg åtminstone var mest tid går.
  else if (storst) meningar.push(`Mest tid går i dag ${storst.omrade.varTiden}.`);

  const missade = svar[FRAGA.missadeSamtal];
  if (
    typeof missade === "string" &&
    MANGA_MISSADE_SAMTAL.some((m) => m === missade)
  ) {
    meningar.push(
      `${meningar.length ? "Dessutom missar ni" : "Ni missar"} ${missade.toLowerCase()} samtal i veckan.`,
    );
  }

  return meningar.join(" ");
}
