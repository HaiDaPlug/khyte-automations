import { NextResponse } from "next/server";
import { LAGRING } from "@/kompass/data/kompass";
import { loggaFel } from "@/kompass/server/logg";
import { RAD_KOLUMNER, type SvarsRad } from "@/kompass/server/rad";
import { fraga } from "@/kompass/server/db";
import {
  behoverForsok,
  behoverKoras,
  korEftersteg,
  larmaOmUppgivnaSteg,
  sparaStatus,
  taRad,
} from "@/kompass/server/leverans";

/**
 * Cron-jobb som försöker om misslyckade eftersteg.
 *
 * Körs en gång per dygn, någon gång under timmen efter 05 UTC (vercel.json;
 * gratisplanen garanterar inte minuten och tillåter inte tätare). Första
 * försöket görs direkt när mejlen lämnas; cron gör försök två och tre, så
 * larmet till admin går vid andra körningen efter ett misslyckande — inom
 * ungefär två dygn. Skyddat av CRON_SECRET — utan rätt nyckel händer
 * ingenting.
 */

/** Hur många rader vi tar per körning, så att en körning inte drar iväg. */
const MAX_RADER_PER_KORNING = 25;

/**
 * Rensar data som inte ska sparas längre än nödvändigt — se LAGRING.
 * Avbrutna svar utan mejl, gamla mätningshändelser och spamskyddets
 * IP-räkning. Leads med mejl rörs inte. Ett fel här stoppar aldrig
 * omförsöken av mejl.
 */
async function rensaGammalData(): Promise<Record<string, number | null>> {
  const resultat: Record<string, number | null> = {};

  // Tabell, villkor och antal dagar. Antal dagar skickas som parameter.
  const jobb: [string, string, string, number][] = [
    ["avbrutna", "kompass_svar", "mejl is null and updated_at", LAGRING.avbrutnaDagar],
    ["handelser", "kompass_events", "created_at", LAGRING.handelserDagar],
    ["spamskydd", "kompass_inskick", "created_at", LAGRING.spamskyddDagar],
  ];

  for (const [namn, tabell, villkor, dagar] of jobb) {
    try {
      const [{ antal }] = await fraga<{ antal: number }>(
        `with borttagna as (
           delete from ${tabell} where ${villkor} < now() - make_interval(days => $1) returning 1
         ) select count(*)::int as antal from borttagna`,
        [dagar],
      );
      resultat[namn] = antal;
    } catch (fel) {
      loggaFel(`Kunde inte rensa ${namn}`, fel);
      resultat[namn] = null;
    }
  }
  return resultat;
}

export async function GET(request: Request) {
  const hemlighet = process.env.CRON_SECRET;

  if (!hemlighet) {
    loggaFel("CRON_SECRET saknas — cron-jobbet kan inte köras.");
    return NextResponse.json({ fel: "Inte konfigurerat." }, { status: 500 });
  }

  // Vercel Cron skickar Authorization: Bearer <CRON_SECRET>.
  const auktorisering = request.headers.get("authorization");
  if (auktorisering !== `Bearer ${hemlighet}`) {
    return NextResponse.json({ fel: "Nekad." }, { status: 401 });
  }

  try {
    // Bara rader som faktiskt väntar på ett nytt försök. Tidigare filtrerades
    // det bort i efterhand bland de 25 äldsta raderna — med fler än 25 lyckade
    // rader nåddes de misslyckade aldrig. Och kontakt_namn användes som villkor,
    // men de flesta leads lämnar bara mejl.
    let rader: SvarsRad[];
    try {
      rader = await fraga<SvarsRad>(
        `select ${RAD_KOLUMNER} from kompass_svar
         where behover_forsok and mejl is not null
         order by updated_at asc
         limit $1`,
        [MAX_RADER_PER_KORNING],
      );
    } catch (fel) {
      loggaFel("Cron kunde inte hämta rader", fel);
      return NextResponse.json({ fel: "Kunde inte hämta." }, { status: 500 });
    }
    // Dubbelkontroll mot själva statusen, om kolumnen och statusen skulle
    // glida isär. Ett lead vars status aldrig sparades körs från början —
    // samma idempotensnycklar som första gången, så Resend skickar inte om
    // ett mejl som faktiskt gick ut (nycklarna gäller i 24 timmar).
    const attForsoka = rader.filter((r) => behoverKoras(r.leverans_status));

    let lyckade = 0;
    let kvar = 0;
    let upptagna = 0;

    for (const rad of attForsoka) {
      // Vercel kan köra samma cron-jobb två gånger. Den körning som inte får
      // låset hoppar över raden — annars kunde en lead få två mejl.
      if (!(await taRad(rad.session_id))) {
        upptagna += 1;
        continue;
      }
      const innan = rad.leverans_status ?? {};
      const efter = await korEftersteg(rad);

      await sparaStatus(rad.session_id, efter);
      await larmaOmUppgivnaSteg(rad.session_id, innan, efter);

      if (behoverForsok(efter)) {
        kvar += 1;
      } else {
        lyckade += 1;
      }
    }

    const rensat = await rensaGammalData();

    return NextResponse.json({
      ok: true,
      rensat,
      granskade: rader.length,
      forsokta: attForsoka.length,
      lyckade,
      kvar,
      upptagna,
    });
  } catch (fel) {
    loggaFel("Oväntat fel i cron-jobbet", fel);
    return NextResponse.json({ fel: "Oväntat fel." }, { status: 500 });
  }
}
