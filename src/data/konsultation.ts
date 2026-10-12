/**
 * The booking request for /tjanster/ai-konsultation: the answer options, in
 * one place for the form (src/components/sections/KonsultationForm.tsx), the
 * server's validation and the notification mail (src/server/konsultation.ts).
 *
 * Every question is there because Hai needs it to prepare the session: how
 * far along the person is, what they actually have access to, whether the
 * company has rules for AI (that decides which tools and data are fair game),
 * what to focus on, and what a good outcome looks like for them.
 */

export const AI_VANA = [
  { id: "inte-alls", label: "Inte alls än" },
  { id: "testat", label: "Har testat lite" },
  { id: "varje-vecka", label: "Varje vecka" },
  { id: "dagligen", label: "Dagligen" },
] as const;

export const VERKTYG = [
  { id: "chatgpt", label: "ChatGPT" },
  { id: "copilot", label: "Microsoft Copilot" },
  { id: "gemini", label: "Google Gemini" },
  { id: "claude", label: "Claude" },
  { id: "annat", label: "Annat" },
  { id: "inga", label: "Inga än" },
] as const;

export const POLICY = [
  { id: "ja", label: "Ja" },
  { id: "nej", label: "Nej" },
  { id: "vet-inte", label: "Vet inte" },
] as const;

export const FOKUS = [
  { id: "komma-igang", label: "Komma igång och välja rätt verktyg" },
  { id: "prompter", label: "Få bättre svar från AI" },
  { id: "texter", label: "Mejl, texter och dokument" },
  { id: "data", label: "Excel, data och analys" },
  { id: "moten", label: "Möten och anteckningar" },
  { id: "agenter", label: "AI-agenter och automation" },
  { id: "sakerhet", label: "Säkerhet och vad man får dela" },
] as const;

export const FORMAT = [
  { id: "distans", label: "På distans", hint: "Via video" },
  { id: "plats", label: "På plats", hint: "Vi kommer överens om var" },
] as const;

export const TIDER = [
  { id: "formiddag", label: "Förmiddag" },
  { id: "eftermiddag", label: "Eftermiddag" },
] as const;

type Id<T extends readonly { id: string }[]> = T[number]["id"];

/** What the form sends. Ids, not labels, so the wording can change freely. */
export interface Bokning {
  namn: string;
  mejl: string;
  telefon: string;
  foretag: string;
  roll: string;
  arbete: string;
  aiVana: Id<typeof AI_VANA> | "";
  verktyg: Id<typeof VERKTYG>[];
  policy: Id<typeof POLICY> | "";
  fokus: Id<typeof FOKUS>[];
  fragor: string;
  mal: string;
  format: Id<typeof FORMAT> | "";
  plats: string;
  tider: Id<typeof TIDER>[];
  tidNotis: string;
}

/** The label for an id, for showing an answer back. */
export function etikett(lista: readonly { id: string; label: string }[], id: string): string {
  return lista.find((x) => x.id === id)?.label ?? id;
}
