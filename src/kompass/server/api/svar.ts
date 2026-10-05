import { NextResponse } from "next/server";
import { loggaFel } from "@/kompass/server/logg";
import { lasIp, slappIgenom } from "@/kompass/server/spamskydd";
import { fraga, sparaSvarsrad } from "@/kompass/server/db";
import { sammanstall } from "@/kompass/lib/sammanstallning";
import { svarSchema } from "@/kompass/lib/validering";

/**
 * Sparar eller uppdaterar ett svar.
 *
 * Klienten anropar efter varje fråga. Samma session_id ger samma rad, så
 * raden växer i takt med svaren och avhoppare finns kvar med det de hann svara.
 * Kontaktuppgifter rörs inte här, de läggs till av /api/kontakt.
 */
export async function POST(request: Request) {
  let kropp: unknown;

  try {
    kropp = await request.json();
  } catch {
    return NextResponse.json(
      { fel: "Kunde inte läsa förfrågan." },
      { status: 400 },
    );
  }

  const tolkat = svarSchema.safeParse(kropp);
  if (!tolkat.success) {
    return NextResponse.json({ fel: "Ogiltiga uppgifter." }, { status: 400 });
  }

  const d = tolkat.data;

  // Nya besök begränsas per IP — annars kan vem som helst fylla databasen.
  // Ett pågående besök sparar fritt: det sparas efter varje skärm.
  try {
    const [finns] = await fraga("select 1 from kompass_svar where session_id = $1", [d.session_id]);
    if (!finns && !(await slappIgenom(lasIp(request), "session"))) {
      return NextResponse.json({ fel: "För många försök." }, { status: 429 });
    }
  } catch (fel) {
    // Spamskyddet får inte stoppa en riktig besökare — gå vidare och spara.
    loggaFel("Kunde inte kontrollera besöket", fel);
  }

  // Förslag och plan sparas inte här: de beror på AI-analysen och sätts när
  // mejl lämnas (/api/kontakt), så att de blir exakt det besökaren såg.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { forslag, plan, ...kolumner } = sammanstall(d.svar);

  try {
    await sparaSvarsrad({
      session_id: d.session_id,
      svar: d.svar,
      // Bransch, områden, summor osv. — egna kolumner så att leads går
      // att sortera och filtrera utan att gräva i jsonb.
      ...kolumner,
      ref: d.ref ?? null,
      // Källan skickas med varje gång och ändras inte under ett besök.
      // Saknas den rör vi inte kolumnerna, så att inget nollas av misstag.
      ...(d.kalla
        ? {
            utm_source: d.kalla.utm_source ?? null,
            utm_medium: d.kalla.utm_medium ?? null,
            utm_campaign: d.kalla.utm_campaign ?? null,
            referrer: d.kalla.referrer ?? null,
            enhet: d.kalla.enhet ?? null,
          }
        : {}),
      senaste_fraga: d.senaste_fraga ?? null,
      // Bara med när det är sant: en upsert rör inte kolumner som saknas,
      // så en klar rad blir aldrig oklar om någon backar i flödet.
      ...(d.klar ? { klar: true } : {}),
    });

    return NextResponse.json({ ok: true });
  } catch (fel) {
    loggaFel("Oväntat fel vid sparande", fel);
    return NextResponse.json(
      { fel: "Kunde inte spara just nu." },
      { status: 500 },
    );
  }
}
