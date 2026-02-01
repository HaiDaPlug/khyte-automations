import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Tjänster & Erbjudande",
  description: "Från förstudie till fullskalig automation. Se våra priser och processer.",
};

// Pricing Constants - Easily adjustable
const AUDIT_PRICE = "{AUDIT_PRICE_SEK}";
const BUILD_PRICE_FROM = "{BUILD_FROM_SEK}";

export default function ServicesPage() {
  return (
    <main className="pt-32 pb-24">
      <Container>

        {/* 1. HERO SECTION */}
        <div className="flex flex-col items-center text-center mb-24 md:mb-32">
          <h1 className="text-hero text-5xl md:text-7xl text-white mb-8 max-w-[800px]">
            Vi bygger bort manuellt arbete.
          </h1>
          <p className="text-xl text-white/60 max-w-[540px] leading-relaxed">
            Från kaotiska processer till självgående system. Välj hur du vill börja samarbetet.
          </p>
        </div>

        {/* 2. TWO OFFERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">

          {/* Card A: Förstudie (Audit) */}
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[4px] p-8 md:p-12 flex flex-col h-full hover:border-white/20 transition-colors duration-300">
            <div className="mb-8">
              <span className="text-label text-white/40 mb-4 block">Insteg</span>
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                Förstudie & Blueprint
              </h2>
              <div className="text-xl text-white font-medium">
                {AUDIT_PRICE} <span className="text-base text-white/40 font-normal">exkl. moms</span>
              </div>
            </div>

            <p className="text-white/60 text-[15px] leading-relaxed mb-8 min-h-[3rem]">
              Vi kartlägger era processer och designar lösningen tekniskt innan vi bygger en enda rad kod.
            </p>

            <ul className="flex flex-col gap-3 mb-10 flex-grow">
              {[
                "Genomgång av nuvarande tech-stack",
                "Identifiering av flaskhalsar",
                "Teknisk lösningsarkitektur (Blueprint)",
                "Fast prisoffert för implementation"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] text-white/80">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-white flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <div className="bg-white/[0.03] border border-white/5 rounded-[4px] p-4 mb-6">
                <p className="text-xs text-white/60 font-medium">
                  <span className="text-white font-bold">Garanti:</span> Beloppet krediteras till 100% om ni väljer att gå vidare med implementationen.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                 {/* Secondary button style to keep audit low-pressure */}
                 <Button variant="secondary" href="/contact" className="w-full sm:w-auto">
                   Boka förstudie
                 </Button>
                 <Link href="/services/audit" className="text-sm text-white/60 hover:text-white underline underline-offset-4 text-center transition-colors duration-200">
                   Läs mer om förstudien →
                 </Link>
              </div>
            </div>
          </div>

          {/* Card B: Implementation (Build) */}
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[4px] p-8 md:p-12 flex flex-col h-full hover:border-white/20 transition-colors duration-300 relative overflow-hidden">
            {/* Subtle "glow" effect for the core offer */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="mb-8 relative z-10">
              <span className="text-label text-white mb-4 block">Kärnaffär</span>
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                Skräddarsydd Automation
              </h2>
              <div className="text-xl text-white font-medium">
                Från {BUILD_PRICE_FROM} <span className="text-base text-white/40 font-normal">beroende på omfattning</span>
              </div>
            </div>

            <p className="text-white/60 text-[15px] leading-relaxed mb-8 min-h-[3rem] relative z-10">
              Vi bygger, testar och driftsätter er infrastruktur. Nyckelfärdigt system som ägs av er.
            </p>

            <ul className="flex flex-col gap-3 mb-10 flex-grow relative z-10">
              {[
                "Utveckling i n8n / Python / AI-modeller",
                "Integrationer mot era system (CRM, ERP)",
                "Omfattande testning & error handling",
                "Överlämning och utbildning"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] text-white/80">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-white flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-auto relative z-10">
              <div className="bg-transparent p-4 mb-6 border border-transparent">
                 {/* Empty spacer to align buttons with left card if guarantee text is long,
                     or generic trust text */}
                 <p className="text-xs text-white/40 font-medium">
                   Alltid fast pris baserat på förstudien. Inga löpande timmar.
                 </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button variant="secondary" href="/cases" className="w-full sm:w-auto">
                  Se nyliga case
                </Button>
                <Link href="/services/custom-build" className="text-sm text-white/60 hover:text-white underline underline-offset-4 text-center transition-colors duration-200">
                  Läs mer om automation →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3. PROCESS SECTION */}
        <div className="border-t border-white/10 pt-24 mb-32">
          <div className="mb-16">
            <h3 className="text-label text-white mb-2">Processen</h3>
            <h2 className="text-3xl font-bold text-white tracking-tight">Så går det till</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative">
            {/* Connecting line (Desktop only) */}
            <div className="hidden md:block absolute top-[2.25rem] left-0 w-full h-[1px] bg-white/10 -z-10" />

            {[
              {
                step: "01",
                title: "Intro",
                desc: "Vi tar ett kort samtal för att se om vi är en bra match tekniskt och kulturellt. (Gratis)"
              },
              {
                step: "02",
                title: "Audit",
                desc: "Vi dyker ner i verksamheten, hittar problemen och ritar kartan för lösningen."
              },
              {
                step: "03",
                title: "Bygge",
                desc: "Vi utvecklar automationerna i iterationer. Ni godkänner varje delsteg."
              },
              {
                step: "04",
                title: "Drift",
                desc: "Systemet överlämnas. Vi säkerställer att teamet förstår hur det används."
              }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-start bg-[var(--color-bg)] pr-4">
                 <div className="text-xs font-bold text-white/30 mb-6 bg-[var(--color-bg)] pr-2">
                   {item.step}
                 </div>
                 <h4 className="text-xl font-bold text-white mb-3">
                   {item.title}
                 </h4>
                 <p className="text-[15px] text-white/60 leading-relaxed">
                   {item.desc}
                 </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. QUALIFICATION / COMPARISON */}
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[4px] p-8 md:p-12 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <h3 className="text-2xl font-bold text-white tracking-tight mb-4">
                Vad ingår i ett samtal?
              </h3>
              <p className="text-white/60 text-[15px] leading-relaxed">
                Vi är måna om att inte sälja på er något ni inte behöver. Därför skiljer vi tydligt på det första samtalet och en betald förstudie.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-2">
              {/* Intro Call */}
              <div>
                <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white/20"></span>
                  Kvalificeringssamtal (0 kr)
                </h4>
                <ul className="space-y-3">
                  <li className="text-[14px] text-white/60">
                    <strong className="text-white/90">Syfte:</strong> Att avgöra om vi kan hjälpa er.
                  </li>
                  <li className="text-[14px] text-white/60">
                    Vi diskuterar era problem på en hög nivå.
                  </li>
                  <li className="text-[14px] text-white/60">
                    Ingen teknisk rådgivning eller lösningsskiss.
                  </li>
                </ul>
              </div>

              {/* Audit */}
              <div>
                <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  Förstudie ({AUDIT_PRICE})
                </h4>
                <ul className="space-y-3">
                  <li className="text-[14px] text-white/60">
                    <strong className="text-white/90">Syfte:</strong> Att designa den exakta lösningen.
                  </li>
                  <li className="text-[14px] text-white/60">
                    Vi går in i era system och analyserar dataflöden.
                  </li>
                  <li className="text-[14px] text-white/60">
                    Levereras som en PDF-blueprint med offert.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 5. CLOSING CTA */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-6">
            Osäker på vad ni behöver?
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Börja med ett intro, så tar vi det därifrån.
          </p>
          <Button href="/contact" variant="primary">
            Boka intro (15 min)
          </Button>
        </div>

      </Container>
    </main>
  );
}
