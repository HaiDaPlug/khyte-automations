import "server-only";

import { utanPersonuppgifter } from "@/kompass/lib/personuppgifter";

/**
 * All felloggning går hit. Skriver bara felets namn och meddelande — aldrig
 * hela felobjekt, som kan bära med sig anropets data — och tvättar bort
 * mejladresser, telefonnummer och personnummer. Nycklar loggas aldrig: inget
 * här läser process.env.
 */
export function loggaFel(vad: string, fel?: unknown): void {
  const text =
    fel === undefined || fel === null
      ? ""
      : fel instanceof Error
        ? `${fel.name}: ${fel.message}`
        : typeof fel === "string"
          ? fel
          : typeof fel === "object" && "message" in fel
            ? String((fel as { message: unknown }).message)
            : "okänt fel";

  console.error(`[kompass] ${vad}${text ? `: ${utanPersonuppgifter(text, 300)}` : ""}`);
}

/** Samma tvätt för text som sparas, t.ex. felorsaken i leverans_status. */
export const tvattadFeltext = (text: string) => utanPersonuppgifter(text, 300);
