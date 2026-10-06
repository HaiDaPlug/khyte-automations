/**
 * Validering av allt som kommer in till serverfunktionerna.
 *
 * Inget som klienten skickar litar vi på. Längdgränserna är satta så att en
 * ärlig användare aldrig slår i dem, men en robot inte kan fylla databasen.
 */

import { z } from "zod";
import { FRAGA, MAX_FRITEXT, ROLLER, TIDSHORISONTER } from "@/kompass/data/kompass";

/** Ett svar är antingen en sträng eller en lista av strängar. */
const svarsVarde = z.union([
  z.string().max(2000),
  z.array(z.string().max(500)).max(20),
]);

/**
 * Klienten skickar bara råsvaren. Resultat och summor räknar servern ut själv,
 * så att ingen kan skicka in påhittade siffror.
 */
export const svarSchema = z.object({
  session_id: z.string().min(8).max(100),
  svar: z
    .record(z.string().max(80), svarsVarde)
    // Fritexten når AI:n — den hålls kort, även om någon går förbi fältet.
    // Samma gräns för svaret på kontrollfrågan.
    .refine((s) => {
      const langd = (id: string) => {
        const f = s[id];
        return typeof f === "string" ? f.length : 0;
      };
      return langd(FRAGA.fritext) <= MAX_FRITEXT && langd(FRAGA.bekraftelseText) <= MAX_FRITEXT;
    }, "Fritexten är för lång."),
  ref: z.string().max(100).optional(),
  kalla: z
    .object({
      utm_source: z.string().max(100).optional(),
      utm_medium: z.string().max(100).optional(),
      utm_campaign: z.string().max(100).optional(),
      referrer: z.string().max(200).optional(),
      enhet: z.enum(["mobil", "surfplatta", "dator"]).optional(),
    })
    .optional(),
  senaste_fraga: z.string().max(80).optional(),
  klar: z.literal(true).optional(),
});

export const analysSchema = z.object({
  session_id: z.string().min(8).max(100),
});

export const forslagSchema = z.object({
  session_id: z.string().min(8).max(100),
});

export const kontaktSchema = z.object({
  session_id: z.string().min(8).max(100),
  kontakt_namn: z.string().max(200),
  foretag: z.string().max(200),
  telefon: z.string().max(60),
  mejl: z.string().max(200),
  ort: z.string().max(120),
  skicka_resultat: z.boolean(),
  tips_namn: z.string().max(200),
  tips_kontakt: z.string().max(200),
  /** Honeypot. Ska alltid vara tom — är den ifylld är det en robot. */
  webbplats: z.string().max(200),
});

export const kompletteraSchema = z.object({
  session_id: z.string().min(8).max(100),
  kontakt_namn: z.string().max(200),
  foretag: z.string().max(200),
  telefon: z.string().max(60),
  ort: z.string().max(120),
  tips_namn: z.string().max(200),
  tips_kontakt: z.string().max(200),
  // Bara de fasta alternativen, eller tomt.
  roll: z.enum(["", ...ROLLER]).default(""),
  tidshorisont: z.enum(["", ...TIDSHORISONTER]).default(""),
});

export const eventSchema = z.object({
  session_id: z.string().min(8).max(100),
  handelse: z.enum([
    "start",
    "fraga_besvarad",
    "resultat_visat",
    "delning",
    "kontakt_lamnad",
    "mote_klick",
  ]),
  steg: z.string().max(80).optional(),
});

export type SvarIndata = z.infer<typeof svarSchema>;
export type KontaktIndata = z.infer<typeof kontaktSchema>;
export type EventIndata = z.infer<typeof eventSchema>;

/**
 * Enkel mejlkontroll. Avsiktligt tillåtande — vi vill inte avvisa en riktig
 * kund för att adressen ser ovanlig ut. Servern kontrollerar bara att det
 * finns något som liknar en adress.
 */
export function serUtSomMejl(varde: string): boolean {
  const rensat = varde.trim();
  return rensat.length >= 5 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rensat);
}

/** Mejl krävs — resultatet skickas dit. Telefon är ett tillägg. */
export function harKontaktvag(indata: KontaktIndata): boolean {
  return indata.mejl.trim().length > 0;
}
