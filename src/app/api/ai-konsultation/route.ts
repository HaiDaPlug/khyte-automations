import { NextResponse } from "next/server";
import { facts } from "@/data/facts";
import { bokningSchema, MINSTA_TID_MS, skickaBokning } from "@/server/konsultation";
import { lasIp, slappIgenom } from "@/server/spamskydd";

/** Logs the error's name and message only: never the request, which holds personal data. */
function loggaFel(vad: string, fel?: unknown) {
  console.error(`[ai-konsultation] ${vad}${fel instanceof Error ? `: ${fel.name}: ${fel.message}` : ""}`);
}

/**
 * POST /api/ai-konsultation — a booking request from /tjanster/ai-konsultation.
 *
 * Validates, filters bots quietly (honeypot, a minimum fill time), applies a
 * per-IP limit, and sends the notification and the confirmation.
 * Bots get { ok: true } so they learn nothing.
 */
export async function POST(request: Request) {
  let kropp: unknown;
  try {
    kropp = await request.json();
  } catch {
    return NextResponse.json({ fel: "Kunde inte läsa förfrågan." }, { status: 400 });
  }

  const tolkat = bokningSchema.safeParse(kropp);
  if (!tolkat.success) {
    return NextResponse.json(
      { fel: "Några uppgifter saknas eller ser fel ut. Kontrollera och försök igen." },
      { status: 400 },
    );
  }
  const b = tolkat.data;

  if (b.webbplats.trim() || Date.now() - b.startad < MINSTA_TID_MS) {
    return NextResponse.json({ ok: true });
  }

  if (!slappIgenom(lasIp(request))) {
    return NextResponse.json(
      { fel: "Du har skickat flera förfrågningar på kort tid. Vänta en stund och försök igen." },
      { status: 429 },
    );
  }

  try {
    const { kvittoSkickat } = await skickaBokning(b);
    if (!kvittoSkickat) loggaFel("kvittot till kunden gick inte att skicka");
    return NextResponse.json({ ok: true });
  } catch (fel) {
    loggaFel("bokningsförfrågan gick inte att skicka", fel);
    return NextResponse.json(
      { fel: `Förfrågan kunde inte skickas just nu. Försök igen om en stund, eller mejla oss på ${facts.email}.` },
      { status: 502 },
    );
  }
}
