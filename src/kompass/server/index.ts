import "server-only";

import { POST as analys } from "@/kompass/server/api/analys";
import { GET as cronRetry } from "@/kompass/server/api/cron-retry";
import { POST as event } from "@/kompass/server/api/event";
import { POST as forslag } from "@/kompass/server/api/forslag";
import { POST as komplettera } from "@/kompass/server/api/komplettera";
import { POST as kontakt } from "@/kompass/server/api/kontakt";
import { POST as svar } from "@/kompass/server/api/svar";

/**
 * Kompassens API — det enda appen behöver från serversidan.
 *
 * Varje rutt i appen är en rad: src/app/api/kompass/svar/route.ts innehåller
 * `export const POST = kompassApi.svar;` och inget annat. Så går det att
 * flytta kompassen mellan appar utan att röra logiken.
 */
export const kompassApi = {
  svar,
  kontakt,
  komplettera,
  forslag,
  analys,
  event,
  /** GET, anropas av Vercel Cron en gång per dygn (se vercel.json). */
  cronRetry,
} as const;

/** Den interna översikten på /internal/kompass. Personuppgifter — bara bakom inloggning. */
export { hamtaOversikt, PERIODER, type Oversikt, type Period } from "@/kompass/server/oversikt";
