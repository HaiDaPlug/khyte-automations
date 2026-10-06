import "server-only";

import OpenAI from "openai";
import { loggaFel } from "@/kompass/server/logg";

/**
 * AI:n bakom kompassen: OpenAI, via Responses API. Används av den löpande
 * analysen (ai-analys.ts) och förslaget på besökarens arbetsflöde
 * (forslag.ts).
 *
 * Den billiga modellen räcker: uppgiften är att sortera korta svar och
 * skriva några meningar på svenska, och kontrollerna efteråt slänger det
 * som inte håller. Byt här om kvaliteten inte räcker — samma kod fungerar
 * med OpenAI:s större modeller.
 *
 * Saknas OPENAI_API_KEY används regelmotorn. Flödet stannar aldrig för AI:n.
 */

export const MODELL = "gpt-6-luna";

export function harAi(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

/**
 * Kort tidsgräns: AI:n körs medan besökaren svarar, och hinner den inte
 * bli klar tar regelmotorn över. Hellre det än att låta någon vänta.
 */
export function aiKlient(): OpenAI {
  return new OpenAI({ timeout: 15_000, maxRetries: 1 });
}

export function loggaAiFel(vad: string, fel: unknown): void {
  if (fel instanceof OpenAI.RateLimitError) {
    loggaFel(`${vad}: rate limit hos OpenAI`);
  } else if (fel instanceof OpenAI.APIError) {
    loggaFel(`${vad}: API-fel ${fel.status}`, fel.message);
  } else {
    loggaFel(`${vad}: oväntat fel`, fel);
  }
}
