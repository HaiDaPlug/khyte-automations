import { NextResponse } from "next/server";
import { loggaFel } from "@/kompass/server/logg";
import { TEXT } from "@/kompass/data/kompass";
import { skickaKompletteringsnotis } from "@/kompass/server/mail";
import { uppdateraSvarsrad } from "@/kompass/server/db";
import { kompletteraSchema } from "@/kompass/lib/validering";

/**
 * Tar emot det frivilliga på tacksidan: namn, företag, telefon, ort, tips,
 * roll och när de vill komma igång.
 *
 * Går bara för rader som redan har mejl — alltså bara efter /api/kontakt —
 * och bara en gång per rad. Det räcker som skydd: antalet rader med mejl
 * begränsas redan av spamskyddet i kontaktrutten.
 */
export async function POST(request: Request) {
  let kropp: unknown;
  try {
    kropp = await request.json();
  } catch {
    return NextResponse.json({ fel: TEXT.komplettera.fel }, { status: 400 });
  }

  const tolkat = kompletteraSchema.safeParse(kropp);
  if (!tolkat.success) {
    return NextResponse.json({ fel: TEXT.komplettera.fel }, { status: 400 });
  }

  const d = tolkat.data;
  const tvattat = (v: string) => v.trim() || null;

  const uppgifter = {
    kontakt_namn: tvattat(d.kontakt_namn),
    foretag: tvattat(d.foretag),
    telefon: tvattat(d.telefon),
    ort: tvattat(d.ort),
    tips_namn: tvattat(d.tips_namn),
    tips_kontakt: tvattat(d.tips_kontakt),
    roll: tvattat(d.roll),
    tidshorisont: tvattat(d.tidshorisont),
  };

  if (!Object.values(uppgifter).some(Boolean)) {
    return NextResponse.json({ fel: TEXT.komplettera.fel }, { status: 400 });
  }

  try {
    // Villkoren i själva uppdateringen gör den atomär: två snabba inskick kan
    // inte båda gå igenom.
    type Kompletterad = Parameters<typeof skickaKompletteringsnotis>[0];
    let data: Kompletterad | undefined;
    try {
      [data] = await uppdateraSvarsrad<Kompletterad>(
        { ...uppgifter, kompletterad_at: new Date().toISOString() },
        "session_id = $1 and mejl is not null and kompletterad_at is null",
        [d.session_id],
        "mejl, kontakt_namn, foretag, telefon, ort, tips_namn, tips_kontakt, roll, tidshorisont",
      );
    } catch (fel) {
      loggaFel("Kunde inte komplettera", fel);
      return NextResponse.json({ fel: TEXT.komplettera.fel }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { fel: TEXT.komplettera.redanSkickat },
        { status: 409 },
      );
    }

    // Uppgifterna är sparade. Notisen är ett tillägg — går den inte iväg finns
    // allt ändå på raden, så besökaren ska inte få något fel för det.
    try {
      await skickaKompletteringsnotis(data);
    } catch (fel) {
      loggaFel(`Kompletteringsnotis misslyckades för ${d.session_id}`, fel);
    }

    return NextResponse.json({ ok: true });
  } catch (fel) {
    loggaFel("Oväntat fel vid komplettering", fel);
    return NextResponse.json({ fel: TEXT.komplettera.fel }, { status: 500 });
  }
}
