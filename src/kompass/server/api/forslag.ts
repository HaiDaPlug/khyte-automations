import { NextResponse } from "next/server";
import { loggaFel } from "@/kompass/server/logg";
import { hamtaForslag } from "@/kompass/server/forslag";
import { RAD_KOLUMNER, type SvarsRad } from "@/kompass/server/rad";
import { lasIp, slappIgenom } from "@/kompass/server/spamskydd";
import { fraga } from "@/kompass/server/db";
import { forslagSchema } from "@/kompass/lib/validering";

/**
 * Tar fram Claudes förslag på det besökaren helst vill slippa.
 *
 * Anropas när resultatet visas, så att förslaget hinner bli klart innan
 * besökaren lämnar mejl. Förslaget sparas på raden — ett andra anrop för samma
 * session kostar ingenting. Svarar alltid 200 med { forslag: string | null }:
 * ett uteblivet förslag är inget fel för besökaren.
 */
export async function POST(request: Request) {
  let kropp: unknown;
  try {
    kropp = await request.json();
  } catch {
    return NextResponse.json({ forslag: null }, { status: 400 });
  }

  const tolkat = forslagSchema.safeParse(kropp);
  if (!tolkat.success) {
    return NextResponse.json({ forslag: null }, { status: 400 });
  }

  try {
    // Bara rader där resultatet visats — inte halvfärdiga eller påhittade.
    const [rad] = await fraga<SvarsRad>(
      `select ${RAD_KOLUMNER} from kompass_svar where session_id = $1 and klar`,
      [tolkat.data.session_id],
    );

    if (!rad) return NextResponse.json({ forslag: null });

    if (rad.ai_forslag) return NextResponse.json({ forslag: rad.ai_forslag });
    if (!rad.fritext?.trim()) return NextResponse.json({ forslag: null });

    // Varje nytt förslag kostar ett anrop till Claude. AI-gränsen per IP
    // håller kostnaden nere om någon försöker missbruka.
    if (!(await slappIgenom(lasIp(request), "ai"))) {
      return NextResponse.json({ forslag: null });
    }

    return NextResponse.json({ forslag: await hamtaForslag(rad) });
  } catch (fel) {
    loggaFel("Förslag misslyckades", fel);
    return NextResponse.json({ forslag: null });
  }
}
