/**
 * Formatering och summering av tider och belopp.
 *
 * Regeln för hela kompassen: ingen siffra får existera som inte går att
 * härleda ur ett svar plus en konstant i src/data/kompass.ts.
 */

import { VECKOR_PER_MANAD } from "@/kompass/data/kompass";
import type { Intervall } from "@/kompass/lib/typer";

/** Avrundar till en decimal. 0,3333 → 0,3. */
export function avrunda(tal: number): number {
  return Math.round(tal * 10) / 10;
}

/** Avrundar till närmaste halvtimme. Exaktare än så kan vi inte vara. */
export function avrundaHalvtimme(timmar: number): number {
  return Math.round(timmar * 2) / 2;
}

/**
 * Veckotid som tid per månad, avrundad till hela timmar — exaktare än så är
 * den inte. 1–3 h i veckan → 4–13 h i månaden.
 */
export function perManad(intervall: Intervall): Intervall {
  const hel = (h: number) => Math.round(h * VECKOR_PER_MANAD);
  return { min: hel(intervall.min), max: hel(intervall.max) };
}

export function summera(intervall: Intervall[]): Intervall {
  return intervall.reduce<Intervall>(
    (summa, i) => ({
      min: avrunda(summa.min + i.min),
      max: avrunda(summa.max + i.max),
    }),
    { min: 0, max: 0 },
  );
}

/**
 * Formaterar ett intervall på svenska, med komma som decimaltecken.
 * Är min och max lika visas bara en siffra.
 */
export function formateraTimmar(intervall: Intervall): string {
  const min = formateraTal(intervall.min);
  const max = formateraTal(intervall.max);

  if (min === max) {
    return `${min} ${intervall.max === 1 ? "timme" : "timmar"}`;
  }

  return `${min}–${max} timmar`;
}

/** Kort form för statistikrutor: "3–6 h". */
export function formateraTimmarKort(intervall: Intervall): string {
  const min = formateraTal(intervall.min);
  const max = formateraTal(intervall.max);
  return min === max ? `${min} h` : `${min}–${max} h`;
}

/** 0.5 → "0,5". 2 → "2". */
export function formateraTal(tal: number): string {
  return String(avrunda(tal)).replace(".", ",");
}

/** 21500 → "21 500". Mellanslag som tusentalsavgränsare, som i svensk text. */
function tusental(tal: number): string {
  return String(Math.round(tal)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** Avrundar kronor så att de inte ser exaktare ut än de är. */
export function avrundaKronor(kr: number): number {
  if (kr < 10000) return Math.round(kr / 500) * 500;
  return Math.round(kr / 1000) * 1000;
}

/** {21000, 43000} → "21 000–43 000 kr". */
export function formateraKronor(intervall: Intervall): string {
  const min = tusental(intervall.min);
  const max = tusental(intervall.max);
  return min === max ? `${min} kr` : `${min}–${max} kr`;
}
