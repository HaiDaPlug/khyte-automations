// Omförsök av misslyckade mejl. Körs av Vercel Cron, se vercel.json.
// Logiken ligger i src/kompass/server/api/cron-retry.ts.
import { kompassApi } from "@/kompass/server";

export const GET = kompassApi.cronRetry;
