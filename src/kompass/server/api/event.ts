import { NextResponse } from "next/server";
import { loggaFel } from "@/kompass/server/logg";
import { lasIp, slappIgenom } from "@/kompass/server/spamskydd";
import { fraga } from "@/kompass/server/db";
import { eventSchema } from "@/kompass/lib/validering";

/**
 * Loggar en händelse i flödet, så att vi ser var folk hoppar av.
 *
 * Ingen tredjepartsspårare, inga cookies. Bara session_id, steg och händelse.
 * Svarar alltid 204 — mätning får aldrig märkas av användaren.
 */
export async function POST(request: Request) {
  try {
    const kropp = await request.json();
    const tolkat = eventSchema.safeParse(kropp);

    // Begränsat per IP. Mätning är inte viktig nog att få fylla databasen.
    if (tolkat.success && (await slappIgenom(lasIp(request), "event"))) {
      const d = tolkat.data;
      await fraga(
        "insert into kompass_events (session_id, handelse, steg) values ($1, $2, $3)",
        [d.session_id, d.handelse, d.steg ?? null],
      );
    }
  } catch (fel) {
    // Loggas för felsökning, men användaren ska aldrig märka något.
    loggaFel("Kunde inte logga händelse", fel);
  }

  return new NextResponse(null, { status: 204 });
}
