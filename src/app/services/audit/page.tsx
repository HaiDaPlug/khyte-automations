import type { Metadata } from "next";
import Container from "@/components/Container";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Förstudie & Blueprint | Khyte Automations",
  description: "Vi kartlägger era processer, identifierar flaskhalsar och levererar en teknisk blueprint med fast pris för implementation.",
  alternates: {
    canonical: "/services/audit",
  },
};

const AUDIT_PRICE_SEK = "15 000 kr";
const CREDIT_WINDOW_DAYS = "30";
const AUDIT_TIMELINE_DAYS = "5-10";

export default function AuditPage() {
  return (
    <main className="pt-32 pb-24">
      <Container>
        {/* 1. HERO */}
        <div className="flex flex-col items-center text-center mb-24 md:mb-32">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-8 max-w-[800px]">
            Förstudie & Blueprint
          </h1>
          <p className="text-xl text-white/60 max-w-[600px] leading-relaxed mb-10">
            Från gissningar till en exakt plan. Vi kartlägger era processer och designar den tekniska lösningen innan vi skriver en rad kod.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <Button href="/contact" variant="primary">
              Boka kvalificeringssamtal
            </Button>
            <Button href="/services" variant="secondary">
              Tillbaka till tjänster
            </Button>
          </div>

          <p className="text-sm text-white/40 max-w-md">
            Intro-samtalet är kostnadsfritt (15 min) och avgör om vi är en bra match. Förstudien är ett betalt arbete med leverans.
          </p>
        </div>

        {/* 2. DELIVERABLES (ARTIFACT FEEL) */}
        <section className="mb-32">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-8 gap-4">
            <h2 className="text-2xl font-semibold text-white tracking-tight">
              Det här får ni
            </h2>
            <span className="text-sm font-mono text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              Leveransformat: PDF / Notion + Flödesskiss
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Flödeskarta", desc: "Visuell kartläggning av processen: Nuvarande läge → Framtida automatiserat läge." },
              { title: "Systeminventering", desc: "Dokumentation av fält, datakällor, API-begränsningar och ägarskap." },
              { title: "Lösningsarkitektur", desc: "Konkret plan för vilka verktyg (n8n, Python, AI) som ska användas." },
              { title: "Riskanalys", desc: "Identifiering av edge cases och manuella undantag som kräver hantering." },
              { title: "Fast pris & Tid", desc: "Offert med fast pris för implementation och estimerad tidslinje." },
              { title: "Prioritering", desc: "Rekommendation om vad som bör byggas först för högst ROI." },
            ].map((item, i) => (
              <div key={i} className="bg-[var(--color-card-bg)] border border-white/10 p-6 rounded-[4px] hover:border-white/20 transition-colors">
                <h3 className="text-white font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. WHO IT IS FOR / NOT FOR */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 border-t border-white/10 pt-24">
          <div>
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500/80"></span>
              Passar er som
            </h2>
            <ul className="space-y-4">
              {[
                "Har en manuell process som stjäl tid från teamet varje vecka.",
                "Vill ha en robust lösning, inte ett snabbt plåster på såren.",
                "Har budget för implementation men behöver veta exakt kostnad först."
              ].map((item, i) => (
                <li key={i} className="text-white/70 text-sm leading-relaxed flex items-start gap-3">
                  <span className="text-emerald-500/60 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500/80"></span>
              Passar inte er som
            </h2>
            <ul className="space-y-4">
              {[
                "Söker en 'quick fix' utan att se över underliggande processer.",
                "Inte har tillgång till eller ägarskap över era egna system.",
                "Är osäkra på om problemet är värt att lösa just nu."
              ].map((item, i) => (
                <li key={i} className="text-white/70 text-sm leading-relaxed flex items-start gap-3">
                  <span className="text-rose-500/60 mt-0.5">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. TIMELINE & PRICE */}
        <section className="mb-32">
          <div className="bg-[var(--color-card-bg)] border border-white/10 rounded-[4px] p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Investering</h2>
                <div className="text-4xl font-bold text-white mb-2 mt-4">
                  {AUDIT_PRICE_SEK} <span className="text-lg font-normal text-white/40">exkl. moms</span>
                </div>
                <p className="text-white/60 text-sm mb-8">
                  Fast pris för hela förstudien. Faktureras vid start.
                </p>

                <div className="bg-white/[0.03] border border-white/10 rounded p-4 inline-block">
                  <p className="text-sm text-white/80 font-medium">
                    <span className="text-emerald-400">Garanti:</span> 100% av beloppet krediteras om ni väljer att gå vidare med implementationen inom {CREDIT_WINDOW_DAYS} dagar.
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-12">
                <h3 className="text-white font-medium mb-4">Tidslinje</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-white/20"></div>
                      <div className="w-px h-full bg-white/10 my-1"></div>
                    </div>
                    <div>
                      <span className="text-white text-sm block font-medium">Uppstart (Workshop)</span>
                      <span className="text-white/40 text-xs">Vi samlar in data och krav.</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-white/20"></div>
                      <div className="w-px h-full bg-white/10 my-1"></div>
                    </div>
                    <div>
                      <span className="text-white text-sm block font-medium">Analys & Design</span>
                      <span className="text-white/40 text-xs">Vi ritar blueprinten.</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                    <div>
                      <span className="text-white text-sm block font-medium">Leverans & Offert</span>
                      <span className="text-white/40 text-xs">{AUDIT_TIMELINE_DAYS} dagar från start.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FAQ */}
        <section className="mb-32 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white tracking-tight mb-10 text-center">
            Vanliga frågor
          </h2>
          <dl className="space-y-8">
            {[
              {
                q: "Varför betald förstudie när ni erbjuder ett gratis intro?",
                a: "Introt är till för att se om vi passar ihop. Förstudien är ett djupt arbete där vi går in i era system, kartlägger detaljer och designar en hållbar teknisk arkitektur. Det är ett värdefullt beslutsunderlag oavsett om ni väljer att bygga med oss eller någon annan."
              },
              {
                q: "Vad får vi konkret levererat?",
                a: "Ni får en PDF-rapport och en visuell flödesskiss (ofta i Miro eller Figma). Dokumentet innehåller teknisk specifikation, riskanalys och en exakt offert för bygget."
              },
              {
                q: "Vad händer om det inte är värt att automatisera?",
                a: "Då säger vi det. En viktig del av förstudien är att räkna på ROI. Om processen är för komplex eller sparar för lite tid, avråder vi från att bygga. Ni betalar då endast för förstudien och undviker en dyr felinvestering."
              },
              {
                q: "Vilka system kan ni jobba med?",
                a: "Vi jobbar med moderna API-baserade system (HubSpot, Fortnox, Shopify, etc.) men kan även bygga lösningar för äldre system via Python-script eller RPA om nödvändigt."
              },
              {
                q: "Hur snabbt kan vi starta?",
                a: "Vi bokar vanligtvis in uppstartsworkshopen inom en vecka efter godkänd offert för förstudien."
              }
            ].map((item, i) => (
              <div key={i} className="border-b border-white/10 pb-6 last:border-0">
                <dt className="text-white font-medium mb-2">{item.q}</dt>
                <dd className="text-white/60 text-sm leading-relaxed">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 6. CLOSING CTA */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-6">
            Redo att ta kontroll över era processer?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl">
            Boka ett första intro så ser vi om en förstudie är rätt väg framåt för er.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button href="/contact" variant="primary">
              Kontakta oss
            </Button>
            <Button href="/services" variant="secondary">
              Se alla tjänster
            </Button>
          </div>
          <p className="text-sm text-white/40 mt-6">
            Eller läs mer om <a href="/services/custom-build" className="underline hover:text-white/60 transition-colors">skräddarsydd automation</a>
          </p>
        </div>

      </Container>
    </main>
  );
}
