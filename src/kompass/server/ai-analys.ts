import "server-only";

import { loggaFel } from "@/kompass/server/logg";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { FRAGA, OMRADEN, type Bransch } from "@/kompass/data/kompass";
import { kontrolleraAiAnalys, type AiAnalys } from "@/kompass/lib/ai-typer";
import { byggSammanhang } from "@/kompass/lib/analys";
import { nivaFor, omradenFor } from "@/kompass/lib/flode";
import { raknaUtResultat } from "@/kompass/lib/matchning";
import { formateraTimmar } from "@/kompass/lib/tid";
import type { Svar } from "@/kompass/lib/typer";

/**
 * Den löpande analysen: efter varje skärm läser Claude alla svar hittills,
 * bygger vidare på sin förra analys och formar tre förslag och en plan.
 *
 * Säkerhet och ärlighet:
 *  - Bara svar från fasta alternativ skickas med — ingen fritext, alltså
 *    inget att smyga in instruktioner genom.
 *  - Claude skriver inga siffror. Tid räknas ur besökarens egna svar
 *    (src/lib/analys.ts), och kontrollen slänger förslag med siffror i.
 *  - Går något fel används regelmotorns förslag. Flödet stannar aldrig.
 */

const MODELL = "claude-opus-5";

const omradesIds = OMRADEN.map((o) => o.id) as [string, ...string[]];

const AnalysSchema = z.object({
  hypotes: z.string(),
  forslag: z.array(
    z.object({
      omraden: z.array(z.enum(omradesIds)),
      rubrik: z.string(),
      affarsnytta: z.string(),
      varfor: z.string(),
      steg: z.array(z.string()),
      slipper: z.string(),
      forsta_steget: z.string(),
    }),
  ),
  plan: z.array(z.object({ rubrik: z.string(), text: z.string(), klart_nar: z.string() })),
});

const SYSTEM = `Du är analytikern bakom Khytes Automationskompass. En företagare svarar på korta frågor om sin verksamhet, och efter varje svar bygger du vidare på din bild av företaget och formar förslag på hur Khyte kan hjälpa dem.

Om Khyte Automations: vi automatiserar i princip allt som görs för hand i ett företag, från enkla utskick till stora, sammanhängande flöden genom hela verksamheten. Vi bygger AI som läser mejl och dokument, sorterar ärenden, förbereder svar och fattar enklare beslut. Vi kopplar ihop system (Fortnox, Visma, Google, Microsoft 365, CRM, branschsystem) så att inget skrivs in två gånger. Vi bygger egna portaler, bokningssystem, interna verktyg, säljmotorer och översikter i realtid för ledningen. För små företag bygger vi också hemsidor som tar in förfrågningar — men bara när det visar sig vara det som behövs. Allt byggs efter hur just det företaget jobbar.

Tänk alltid som en företagsledare. Frågan är aldrig bara "vilken uppgift slipper någon" utan "vad betyder det för företaget": fler affärer och vunna offerter, snabbare kassaflöde, kapacitet att ta fler uppdrag utan att anställa, färre fel, nöjdare kunder som kommer tillbaka, mindre beroende av enskilda personer, och beslut på aktuella siffror. Sparad tid är medlet — affären är målet. Det gäller även enmansföretag: de är också ett företag som ska växa och tjäna pengar.

Ditt uppdrag:
- Skriv tre förslag, starkast först. Varje förslag är ett konkret flöde: vad som händer, steg för steg, i deras verksamhet.
- Våga. Nästan allt går att automatisera till en viss nivå. Ett företag med 25 anställda ska känna att vi förstår hela deras verksamhet — inte att vi säljer ett sms-verktyg.
- Skala efter storlek. Litet företag: konkreta, enkla flöden som märks direkt. Mellan och stort: sammanhängande flöden över flera områden och system, AI som sorterar och förbereder, automatisk kontroll och översikter i realtid.
- Det första förslaget ska vara det största: för mellan och stora företag ett flöde som binder ihop flera av deras områden och verktyg från början till slut.
- Förankra allt i deras svar. Nämn deras verktyg vid namn. Använd branschens ord (patienter, gäster, hyresgäster, uppdrag …).
- Bygg vidare. Finns en tidigare analys: behåll det som fortfarande stämmer och ändra bara det som de nya svaren motiverar.
- Det första förslaget ska svara mot det de sagt är viktigast just nu ("Viktigast just nu" i underlaget):
  - Få fler förfrågningar: nivå liten — till exempel att fånga fler förfrågningar och låta ingen bli liggande, att varje förfrågan och offert följs upp, eller att tidigare kunder kommer tillbaka. Föreslå inte en ny hemsida: vi vet inte om de har en, om den har trafik eller var förfrågningarna tappas — det avgörs i samtalet. Nivå mellan och stor — ett systematiskt flöde för prospektering och uppföljning, eller mer affärer ur kundbasen de redan har. Beskriv resultatet, inte metoden: vilka kanaler som passar avgörs i samtalet. Bygg på områden som nya-kunder, marknad, aterkommande eller samtal.
  - Svara kunderna snabbare: samtal och förfrågningar, bokning.
  - Få betalt snabbare: fakturor och betalningar.
  - Minska administrationen: det som tar mest tid.
  Har de angett en flaskhals ("Flaskhals" i underlaget) ska det första förslaget lösa just den — det är deras egen diagnos.
  De valda tidstjuvarna får gärna vara med i de andra förslagen.

Regler:
- Föreslå aldrig chatbot, chatt eller en AI som pratar med kunderna — varken på hemsidan eller någon annanstans. Det ger för lite nytta.
- Föreslå aldrig hemsida om nivån är mellan eller stor. För ett företag i den storleken får det oss att se små ut.
- Inga siffror alls: ingen tid, inga belopp, procent eller antal. Siffrorna räknas fram separat ur deras svar.
- Inga priser, leveranstider eller löften om exakta resultat.
- Nämn bara verktyg som står under "Verktyg" i underlaget — inga andra produkter eller leverantörer.
- Nämn aldrig kunder, case eller företagsnamn. Kundcase läggs till separat.
- Varje område får ingå i högst ett förslag. Samma område i två förslag gör att samma tid visas två gånger.
- Skriv "ni" — eller "du" om de är ensamma i företaget. Svenska, rakt och jordnära, inga modeord.
- rubrik: problemet som en möjlighet, högst tio ord.
- affarsnytta: en mening om vad förslaget betyder för företaget — affärer, kassaflöde, kapacitet, kvalitet eller risk. Det här är det första de läser under rubriken.
- varfor: en eller två meningar som knyter förslaget till deras egna svar.
- steg: fyra eller fem korta meningar, i den ordning det händer.
- slipper: en mening om vad som försvinner ur deras vardag.
- forsta_steget: något konkret de kan göra redan nästa vecka.
- omraden: de områdes-id:n förslaget bygger på, ett till fyra, bara från listan.
- plan: två eller tre faser som går att genomföra, i ordning. Varje fas: en kort rubrik, en mening om vad som görs — med deras valda problem och verktyg — och klart_nar: en mening om vad verksamheten märker när fasen är klar, innan nästa börjar. Ta bara med en tredje fas (t.ex. AI eller överblick) om den verkligen behövs för just dem.
- hypotes: en mening, högst tjugo ord, om vad du ser hittills i deras företag — hur det påverkar affären, inte bara vilka uppgifter som tar tid. Den visas för besökaren medan de svarar, så skriv den till dem.`;

/** Underlaget till Claude: fasta svar, uträknad tid och områdena att välja bland. */
function underlag(svar: Svar, tidigare: AiAnalys | null): string {
  const r = raknaUtResultat(svar);
  const k = byggSammanhang(svar);
  const niva = nivaFor(svar);
  const v = (id: string) => {
    const x = svar[id];
    return Array.isArray(x) ? x.join(", ") : typeof x === "string" ? x : "ej besvarat ännu";
  };

  const tidstjuvar = r.omraden
    .map((o) =>
      o.foreslaget
        ? `- ${o.omrade.id} (${o.omrade.namn}): inte valt, men svaren pekar dit. ${o.skal ?? ""}`
        : `- ${o.omrade.id} (${o.omrade.namn}): ${o.lagt ? formateraTimmar(o.lagt) + " i veckan" : "tid ej angiven"}, ${o.idag?.toLowerCase() ?? "hur det görs i dag ej angivet"}.`,
    )
    .join("\n");

  const valbara = omradenFor(svar[FRAGA.bransch] as Bransch | undefined)
    .map((o) => `- ${o.id}: ${o.namn} (${o.exempel})`)
    .join("\n");

  return [
    "<foretaget>",
    `Bransch: ${v(FRAGA.bransch)}`,
    `Antal i företaget: ${v(FRAGA.antal)} (nivå: ${niva})`,
    `Viktigast just nu: ${v(FRAGA.mal)}`,
    `Flaskhals: ${v(FRAGA.flaskhals)}`,
    `Missade samtal per vecka: ${v(FRAGA.missadeSamtal)}`,
    `Svarstid på förfrågningar: ${v(FRAGA.svarstid)}`,
    `Värde av en ny kund: ${v(FRAGA.kundvarde)}`,
    `Verktyg: ${v(FRAGA.verktyg)}`,
    `Skriv till dem i ${k.du ? "du" : "ni"}-form. Branschens ord för kund: ${k.ord.kund}/${k.ord.kunder}.`,
    "</foretaget>",
    "",
    "<tidstjuvar>",
    tidstjuvar || "Inga valda ännu.",
    "</tidstjuvar>",
    "",
    "<omraden_att_valja_bland>",
    valbara,
    "</omraden_att_valja_bland>",
    "",
    "<tidigare_analys>",
    tidigare ? JSON.stringify(tidigare) : "Ingen — det här är första analysen.",
    "</tidigare_analys>",
  ].join("\n");
}

/** Kör en analys. Returnerar null om det inte blir någon — då gäller reglerna. */
export async function analysera(
  svar: Svar,
  tidigare: AiAnalys | null,
): Promise<AiAnalys | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  // Kort tidsgräns: analysen körs i bakgrunden medan besökaren svarar, och
  // hinner den inte bli klar tar regelmotorn över. Hellre det än att vänta.
  const klient = new Anthropic({ timeout: 15_000, maxRetries: 1 });

  try {
    const svaret = await klient.beta.messages.parse({
      model: MODELL,
      max_tokens: 8000,
      // Låg ansträngning: analysen körs efter varje skärm och ska hinna klart
      // innan nästa. Kvaliteten sitter i underlaget och reglerna.
      output_config: { effort: "low", format: betaZodOutputFormat(AnalysSchema) },
      // Om modellen avböjer tar en annan modell över i samma anrop.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM,
      messages: [{ role: "user", content: underlag(svar, tidigare) }],
    });

    if (svaret.stop_reason === "refusal") return null;
    return kontrolleraAiAnalys(svaret.parsed_output);
  } catch (fel) {
    if (fel instanceof Anthropic.RateLimitError) {
      loggaFel("Analys: rate limit hos Anthropic");
    } else if (fel instanceof Anthropic.APIError) {
      loggaFel(`Analys: API-fel ${fel.status}`, fel.message);
    } else {
      loggaFel("Analys: oväntat fel", fel);
    }
    return null;
  }
}
