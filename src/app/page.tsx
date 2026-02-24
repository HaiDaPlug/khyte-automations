import type { Metadata } from "next";
import Button from "@/components/Button";
import Container from "@/components/Container";
import KiteHero from "@/components/KiteHero";
import RollingWord from "@/components/RollingWord";
import TimelineProcess from "@/components/TimelineProcess";
import ToolsTicker from "@/components/ToolsTicker";
import PainOutcome from "@/components/sections/PainOutcome";
import ROIBand from "@/components/sections/ROIBand";
import WhyKhyte from "@/components/sections/WhyKhyte";
import CasesSection from "@/components/sections/CasesSection";

export const metadata: Metadata = {
  title: "AI-automation för företag – Frigör tid från manuellt arbete",
  description:
    "Vi bygger AI-automationer som eliminerar repetitivt arbete i er verksamhet. Snabb implementering, tydlig process. Se konkreta exempel från säljautomation och research.",
  alternates: {
    canonical: "/",
  },
};


export default function Home() {
  return (
    <div>
      <Container>
        {/* Hero Section */}
        <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen min-h-[100dvh] flex flex-col justify-center items-center pt-32 pb-20 px-4 overflow-hidden isolate">
          {/* Base gradient */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen -z-10 pointer-events-none"
            style={{
              backgroundImage: `url("/gradients/hero-gradient-v1.webp")`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              backgroundRepeat: "no-repeat",
              backgroundColor: "#1B0803",
            }}
          />
          {/* Vignette: darkens corners + edges, hides banding at perimeter */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen -z-10 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(11,4,2,0.55) 100%),
                linear-gradient(to right, rgba(11,4,2,0.45) 0%, transparent 18%, transparent 82%, rgba(11,4,2,0.45) 100%)
              `,
            }}
          />
          {/* Warm glow behind headline — left-center bloom */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen -z-10 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 55% 60% at 28% 42%, rgba(212,98,43,0.22) 0%, transparent 70%)`,
            }}
          />
          {/* Noise overlay — tiled static grain, hides WebP compression banding */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen -z-10 pointer-events-none"
            style={{
              backgroundImage: `url("/noise.webp")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px 128px",
              opacity: 0.045,
              mixBlendMode: "screen",
            }}
          />

          <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left: copy */}
            <div className="flex flex-col items-start text-left">
              <h1 className="text-hero text-5xl md:text-7xl mb-8 drop-shadow-sm text-white">
                Automatisering som tar bort{" "}
                <RollingWord />{" "}
                - utan onödigt strul.
              </h1>

              <p className="text-xl text-white/85 font-medium max-w-[520px] leading-relaxed mb-10">
                Vi eliminerar manuella fel och frigör tid för det som faktiskt skapar värde. Kundnära, effektivt och byggt för att hålla.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Button variant="primary" href="/contact">
                  Kontakta oss
                </Button>
                <Button variant="ghostDark" href="/cases">
                  Se hur det funkar
                </Button>
              </div>
            </div>

            {/* Right: kite illustration — hidden on mobile */}
            <div aria-hidden="true" className="hidden md:flex items-center justify-end">
              <KiteHero />
            </div>
          </div>

          {/* Trust strip + Tools Ticker */}
          <div className="mt-20 w-full">
            <div className="flex items-center gap-4 mb-6 px-4 max-w-[520px] mx-auto">
              <div className="flex-1 h-px bg-white/15" />
              <span className="shrink-0 text-[11px] font-semibold tracking-[0.10em] uppercase text-white/45 whitespace-nowrap">
                Bygger och integrerar med era verktyg
              </span>
              <div className="flex-1 h-px bg-white/15" />
            </div>
            <ToolsTicker />
          </div>

          {/* Scroll cue chevron */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full border border-[var(--color-border)] bg-[var(--color-card-bg)] opacity-70 hover:opacity-100 transition flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="var(--color-muted)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </section>

        {/* Full-width divider */}
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen border-b border-[var(--color-border)]"></div>

        {/* Spacer */}
        <div className="h-12 md:h-16"></div>

        <PainOutcome />
        <ROIBand />

        <CasesSection />

        {/* Process Section */}
        <TimelineProcess />

        <WhyKhyte />

      </Container>
    </div>
  );
}
