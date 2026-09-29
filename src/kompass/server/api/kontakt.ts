import { NextResponse } from "next/server";
import { loggaFel } from "@/kompass/server/logg";
import { TEXT } from "@/kompass/data/kompass";
import { supabase } from "@/kompass/server/supabase";
import { kontrolleraAiAnalys } from "@/kompass/lib/ai-typer";
import { hamtaForslag } from "@/kompass/server/forslag";
import { sammanstall } from "@/kompass/lib/sammanstallning";
import type { Svar } from "@/kompass/lib/typer";
import {
  korEftersteg,
  larmaOmUppgivnaSteg,
  sparaStatus,
} from "@/kompass/server/leverans";
import { RAD_KOLUMNER, type SvarsRad } from "@/kompass/server/rad";
import { lasIp, slappIgenom } from "@/kompass/server/spamskydd";
import {
  harKontaktvag,
  kontaktSchema,
  serUtSomMejl,
} from "@/kompass/lib/validering";

/**
 * Tar emot kontaktuppgifter, uppdaterar raden och kör eftersteg.
 *
 * Ordningen är viktig: raden sparas FÖRST. Misslyckas ett eftersteg är
 * uppgifterna ändå kvar, och cron-jobbet kan försöka igen.
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

  const tolkat = kontaktSchema.safeParse(kropp);
  if (!tolkat.success) {
    return NextResponse.json(
      { fel: "Några uppgifter såg fel ut. Kontrollera och försök igen." },
      { status: 400 },
    );
  }

  const d = tolkat.data;

  // Honeypot. En robot fyller i fältet, en människa ser det aldrig.
  // Vi svarar ok för att inte avslöja att inskicket kastades.
  if (d.webbplats.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (!harKontaktvag(d)) {
    return NextResponse.json({ fel: TEXT.kontakt.minstEtt }, { status: 400 });
  }

  if (d.mejl.trim() && !serUtSomMejl(d.mejl)) {
    return NextResponse.json(
      { fel: "Mejladressen ser inte riktig ut. Kontrollera stavningen." },
      { status: 400 },
    );
  }

  if (!(await slappIgenom(lasIp(request)))) {
    return NextResponse.json(
      { fel: TEXT.fel.forMangaForsok },
      { status: 429 },
    );
  }

  // ── Spara uppgifterna ──────────────────────────────────────────────────
  let rad: SvarsRad;

  try {
    const { data, error } = await supabase()
      .from("kompass_svar")
      .update({
        kontakt_namn: d.kontakt_namn.trim() || null,
        foretag: d.foretag.trim() || null,
        telefon: d.telefon.trim() || null,
        mejl: d.mejl.trim() || null,
        ort: d.ort.trim() || null,
        skicka_resultat: d.skicka_resultat,
        tips_namn: d.tips_namn.trim() || null,
        tips_kontakt: d.tips_kontakt.trim() || null,
        kontakt_at: new Date().toISOString(),
      })
      .eq("session_id", d.session_id)
      // Idempotent: bara första inskicket för ett besök går igenom. Ett
      // dubbelklick eller ett nytt försök från webbläsaren träffar ingen rad
      // här — och då skickas inga mejl en gång till.
      .is("kontakt_at", null)
      .select(RAD_KOLUMNER)
      .maybeSingle();

    if (!error && !data) {
      const { data: finns } = await supabase()
        .from("kompass_svar")
        .select("kontakt_at")
        .eq("session_id", d.session_id)
        .maybeSingle();
      if (finns?.kontakt_at) {
        // Redan mottaget. Svara ok, så att besökaren kommer till tacksidan.
        return NextResponse.json({ ok: true, redanMottaget: true });
      }
    }

    if (error || !data) {
      loggaFel("Kunde inte spara kontaktuppgifter", error?.message);
      return NextResponse.json(
        { fel: TEXT.fel.kontaktMisslyckades },
        { status: 500 },
      );
    }

    rad = data as unknown as SvarsRad;
  } catch (fel) {
    loggaFel("Oväntat fel vid kontaktsparande", fel);
    return NextResponse.json(
      { fel: TEXT.fel.kontaktMisslyckades },
      { status: 500 },
    );
  }

  // ── Förslag och plan ───────────────────────────────────────────────────
  // Räknas fram med AI-analysen, så att mejlen visar exakt det besökaren såg
  // på sidan. Sparas på raden — det här är vad leadet faktiskt fick.
  try {
    const { forslag, plan } = sammanstall(
      (rad.svar ?? {}) as Svar,
      kontrolleraAiAnalys(rad.ai_analys),
    );
    rad = { ...rad, forslag, plan };
    const { error } = await supabase()
      .from("kompass_svar")
      .update({ forslag, plan })
      .eq("session_id", d.session_id);
    if (error) loggaFel("Kunde inte spara förslag", error.message);
  } catch (fel) {
    loggaFel(`Kunde inte räkna fram förslag för ${d.session_id}`, fel);
  }

  // ── Eftersteg ──────────────────────────────────────────────────────────
  // Härifrån och ner får inget fel nå användaren: uppgifterna ÄR sparade.
  // Går ett steg fel plockar cron-jobbet upp det.
  try {
    // Förslaget tas oftast fram redan när resultatet visas. Hann det inte bli
    // klart görs det här, så att det kommer med i mejlen.
    if (!rad.ai_forslag && rad.fritext?.trim()) {
      rad = { ...rad, ai_forslag: await hamtaForslag(rad) };
    }

    const innan = rad.leverans_status ?? {};
    const efter = await korEftersteg(rad);

    await sparaStatus(d.session_id, efter);
    await larmaOmUppgivnaSteg(d.session_id, innan, efter);
  } catch (fel) {
    loggaFel(`Eftersteg misslyckades för ${d.session_id}`, fel);
  }

  return NextResponse.json({ ok: true });
}
