// Omförsök av misslyckade mejl och rensning av gammal data. Körs av Vercel
// Cron en gång per dygn, se vercel.json.
// Logiken ligger i src/kompass/server/api/cron-retry.ts.
import { kompassApi } from "@/kompass/server";

export const GET = kompassApi.cronRetry;
