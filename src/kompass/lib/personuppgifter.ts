/**
 * Tar bort det som ser ut som personuppgifter: mejladresser, personnummer och
 * telefonnummer. Används innan fritext skickas till AI:n och innan felmeddelanden
 * skrivs till loggarna — ingen av dem ska innehålla sådant.
 */

const MEJL = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const PERSONNUMMER = /\b(19|20)?\d{6}[-+ ]?\d{4}\b/g;
const TELEFON = /(\+46|0)[\d\s-]{6,}\d/g;

export function utanPersonuppgifter(text: string, max = 300): string {
  return text
    .replace(MEJL, "[borttaget]")
    .replace(PERSONNUMMER, "[borttaget]")
    .replace(TELEFON, "[borttaget]")
    .slice(0, max);
}
