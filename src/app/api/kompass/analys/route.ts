// Kompassens API — logiken ligger i src/kompass/server/api/analys.ts.
import { kompassApi } from "@/kompass/server";

export const POST = kompassApi.analys;

// AI-anropen har egna tidsgränser (15 s, ett nytt försök). Det här är taket
// för hela rutten, så att den aldrig hänger längre än så.
export const maxDuration = 45;
