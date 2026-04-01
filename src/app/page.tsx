import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import AmbientParticles from "@/components/AmbientParticles";
// import TimelineProcess from "@/components/TimelineProcess"; // revert: uncomment
// import Statement from "@/components/sections/Statement"; // revert: archived
// import Container from "@/components/Container"; // revert: needed when Statement restored
import AutomationShowcase from "@/components/sections/AutomationShowcase";
// import EditorialMetrics from "@/components/sections/EditorialMetrics.concept"; // archived — replaced by ROI/COI bands
import ProcessSection from "@/components/sections/ProcessSection";
import CasesSection from "@/components/sections/CasesSection";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata: Metadata = {
  title: "AI-automation för företag – Frigör tid från manuellt arbete",
  description:
    "Vi bygger AI-automationer som eliminerar repetitivt arbete i er verksamhet. Snabb implementering, tydlig process. Se konkreta exempel från säljautomation och research.",
  alternates: {
    canonical: "/",
  },
};


function EspressoBand({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full relative overflow-hidden bg-[#1B1613]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/noise.webp')", backgroundSize: "128px 128px", opacity: 0.055, mixBlendMode: "screen" }} />
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ── */}
      <HeroSection />

      {/*
        NOTE: Statement must stay inside Container.
        Its full-bleed band uses the viewport-escape trick which requires
        a viewport-centered parent (mx-auto). Moving it outside Container breaks it.
      */}
      {/* revert: <Container><Statement /></Container> */}

      {/* Process section */}
      <ProcessSection />

      {/* ── ROI + COI Band ── */}
      <EspressoBand>
        <div className="relative z-10 max-w-[1100px] mx-auto px-6 py-24 md:py-32 flex flex-col gap-24 md:gap-32">

          {/* ROI — copy left, visual right */}
          <div className="relative min-h-[480px] flex items-center">
            <div className="relative z-10 max-w-[500px]">
              <span className="section-eyebrow" style={{ color: "#E8833A" }} >Avkastning</span>
              <h2 className="font-display overflow-visible text-[2.5rem] md:text-[3.5rem] leading-[1.15] tracking-wide uppercase text-white mb-16">
                VAD DU FÅR<br /><span style={{ color: "#E8833A" }}>TILLBAKA.</span>
              </h2>
              <ul className="flex flex-col gap-12">
                {[
                  { num: "3-15h", unit: "/ vecka", body: "Tid över för det viktiga och det som verkligen skapar värde." },
                  { num: "3–6", unit: "månader", body: "Beräknad tid att få tillbaka investerad summa." },
                  { num: "24/7", unit: "utan extra kostnad", body: "Automationen är igång medan du och ditt team sover." },
                ].map(({ num, unit, body }) => (
                  <li key={num} className="border-l border-white/10 pl-8">
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="font-display text-4xl md:text-5xl text-white leading-none tracking-wide uppercase">{num}</span>
                      <span className="text-sm text-white/70 uppercase tracking-widest">{unit}</span>
                    </div>
                    <p className="text-white/70 text-base leading-relaxed max-w-[40ch]">{body}</p>
                  </li>
                ))}
              </ul>
            </div>
            {/* Cloudsleep — circle stage + particles */}
            <div className="hidden md:flex items-center justify-center absolute right-[-140px] top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="absolute rounded-full z-0" style={{ width: 600, height: 600, background: "radial-gradient(ellipse at center, rgba(200,90,20,0.22) 0%, rgba(150,55,10,0.10) 50%, rgba(0,0,0,0) 75%)", filter: "blur(80px)" }} />
              <AmbientParticles width={700} height={700} count={7} colors={["212,98,43","232,131,58","255,200,150"]} className="absolute z-20" />
              <div className="absolute rounded-full bg-[#2E1005] w-[300px] h-[300px] md:w-[380px] md:h-[380px] z-0 translate-y-4" />
              <img src="/visuals/cloudsleep.svg" alt="" aria-hidden="true" className="relative z-10 w-[600px] md:w-[700px] grayscale brightness-125 opacity-90 -translate-y-6" style={{ filter: "grayscale(1) brightness(1.25) drop-shadow(2px 5px 6px rgba(0,0,0,0.55))" }} />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* COI — visual left, copy right */}
          <div className="relative min-h-[480px] flex items-center justify-end">
            {/* Timeslipping — vignette + particles */}
            <div className="hidden md:flex items-center justify-center absolute left-[-200px] top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="absolute rounded-full z-0" style={{ width: 600, height: 600, background: "radial-gradient(ellipse at center, rgba(200,90,20,0.22) 0%, rgba(150,55,10,0.10) 50%, rgba(0,0,0,0) 75%)", filter: "blur(80px)" }} />
              <AmbientParticles width={640} height={640} count={9} colors={["220,220,225","190,195,210","240,238,232"]} className="absolute z-20" />
              <div className="absolute w-[420px] h-[520px] z-0" style={{ background: "radial-gradient(ellipse 60% 55% at 50% 38%, rgba(8,2,0,0.45) 0%, rgba(8,2,0,0.18) 45%, rgba(8,2,0,0) 75%)" }} />
              {/* White glow anchor behind clock */}
              <div className="absolute z-0 rounded-full" style={{ width: 300, height: 300, background: "radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)", filter: "blur(80px)" }} />
              <img src="/visuals/timeslipping.svg" alt="" aria-hidden="true" className="relative z-10 w-[660px] md:w-[780px] opacity-90 translate-x-8" style={{ filter: "grayscale(1) brightness(1.25) drop-shadow(2px 5px 6px rgba(0,0,0,0.55))" }} />
            </div>
            <div className="relative z-10 max-w-[500px]">
              <span className="section-eyebrow" style={{ color: "#E8833A" }}>Kostnaden</span>
              <h2 className="font-display overflow-visible text-[2.5rem] md:text-[3.5rem] leading-[1.15] tracking-wide uppercase text-white mb-16">
                KOSTNADEN AV<br /><span style={{ color: "#E8833A" }}>STILLASTÅENDE.</span>
              </h2>
              <ul className="flex flex-col gap-12">
                {[
                  { num: "3-15h", unit: "/ vecka", body: "Tid som försvinner i manuella uppgifter som aldrig borde ha krävt en människa." },
                  { num: "3x", unit: "längre än det borde", body: "Uppgifter som kan ta minuter, tar istället timmar." },
                  { num: "0", unit: "integrerade system", body: "Era verktyg pratar inte med varandra. Varje manuellt steg som skalas är ett steg bakåt." },
                ].map(({ num, unit, body }) => (
                  <li key={num} className="border-l border-white/10 pl-8">
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="font-display text-4xl md:text-5xl text-white leading-none tracking-wide uppercase">{num}</span>
                      <span className="text-sm text-white/70 uppercase tracking-widest">{unit}</span>
                    </div>
                    <p className="text-white/70 text-base leading-relaxed max-w-[40ch]">{body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </EspressoBand>

      <AutomationShowcase />

      <CasesSection />
      {/* revert: add <TimelineProcess /> here */}

      {/* FAQ */}
      <div className="w-full border-t border-[var(--color-border)]">
        <div className="max-w-[1100px] mx-auto px-6 py-[var(--spacing-section)]">
          <div className="mb-10">
            <span className="section-eyebrow">Vanliga frågor</span>
            <h2 className="font-display overflow-visible text-[2.5rem] md:text-[3.5rem] leading-[1.15] tracking-wide uppercase text-[var(--color-text)]">
              SVAR PÅ DET VI<br /><span style={{ color: "#D4622B" }}>OFTAST FÅR HÖRA.</span>
            </h2>
          </div>

          <FAQAccordion />
        </div>
      </div>

    </div>
  );
}
