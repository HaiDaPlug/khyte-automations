/**
 * Tolkar Claudes förslag till samma form som våra egna flöden: en mening om
 * vad lösningen gör, följd av stegen. Används både på sidan och i mejlet.
 *
 * Claude ombeds skriva stegen som rader som börjar med "- ". Följer svaret
 * inte formatet blir hela texten sammanfattningen och stegen tomma — kortet
 * visar då bara texten, vilket fortfarande fungerar.
 */

const STEGRAD = /^[-–•*]\s+|^\d+[.)]\s+/;

export function tolkaForslag(text: string): {
  sammanfattning: string;
  steg: string[];
} {
  const rader = text
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);

  const steg = rader
    .filter((r) => STEGRAD.test(r))
    .map((r) => r.replace(STEGRAD, ""));
  const sammanfattning = rader.filter((r) => !STEGRAD.test(r)).join(" ");

  return { sammanfattning, steg };
}
