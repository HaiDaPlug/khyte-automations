import { NextResponse } from "next/server";
import { loggaFel } from "@/kompass/server/logg";
import { analysera } from "@/kompass/server/ai-analys";
import { FRAGA } from "@/kompass/data/kompass";
import { kontrolleraAiAnalys, kontrolleraMotSvar } from "@/kompass/lib/ai-typer";
import { nivaFor } from "@/kompass/lib/flode";
import { lasIp, slappIgenom } from "@/kompass/server/spamskydd";
import { supabase } from "@/kompass/server/supabase";
import type { Svar } from "@/kompass/lib/typer";
import { analysSchema } from "@/kompass/lib/validering";

/** Tak per besök. Ett helt flöde gör runt fem analyser. */
const MAX_ANALYSER_PER_BESOK = 10;

const verktyg = (svar: Svar): string[] => {
  const v = svar[FRAGA.verktyg];
  return Array.isArray(v) ? v : [];
};

/**
 * Kör nästa steg i den löpande analysen.
 *
 * Läser svaren från raden — inte från klienten — och bygger vidare på förra
 * analysen. Svarar alltid 200 med { analys }: blir det ingen ny analys
 * skickas den senaste tillbaka, eller null, och klienten använder reglerna.
 */
export async function POST(request: Request) {
  let kropp: unknown;
  try {
    kropp = await request.json();
  } catch {
    return NextResponse.json({ analys: null }, { status: 400 });
  }

  const tolkat = analysSchema.safeParse(kropp);
  if (!tolkat.success) {
    return NextResponse.json({ analys: null }, { status: 400 });
  }

  const sessionId = tolkat.data.session_id;

  try {
    const { data, error } = await supabase()
      .from("kompass_svar")
      .select("svar, ai_analys, ai_anrop")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (error || !data) return NextResponse.json({ analys: null });

    const tidigare = kontrolleraAiAnalys(data.ai_analys);
    const anrop = Number(data.ai_anrop ?? 0);

    if (anrop >= MAX_ANALYSER_PER_BESOK) {
      return NextResponse.json({ analys: tidigare });
    }
    if (!(await slappIgenom(lasIp(request), "ai"))) {
      return NextResponse.json({ analys: tidigare });
    }

    const svar = (data.svar ?? {}) as Svar;
    const analys = await analysera(svar, tidigare);
    // Hypotesen visas direkt under frågorna — tvätta den mot svaren redan
    // här. Förslagen tvättas där de används (byggForslag).
    const ny = analys
      ? { ...analys, hypotes: kontrolleraMotSvar(analys, verktyg(svar), nivaFor(svar)).hypotes }
      : null;

    const { error: sparfel } = await supabase()
      .from("kompass_svar")
      .update({
        ai_anrop: anrop + 1,
        ...(ny ? { ai_analys: ny } : {}),
      })
      .eq("session_id", sessionId);
    if (sparfel) loggaFel("Kunde inte spara analys", sparfel.message);

    return NextResponse.json({ analys: ny ?? tidigare });
  } catch (fel) {
    loggaFel("Analys misslyckades", fel);
    return NextResponse.json({ analys: null });
  }
}
