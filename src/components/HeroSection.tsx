"use client";

import Button from "@/components/Button";
import KiteHero from "@/components/KiteHero";
import RollingWord from "@/components/RollingWord";
import ToolsTicker from "@/components/ToolsTicker";

export default function HeroSection() {
  return (
    <section className="relative w-screen min-h-[100dvh] flex flex-col justify-center items-center pt-32 pb-8 overflow-hidden isolate">
      {/* Base gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: `url("/gradients/hero-gradient-v1.webp")`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#1B0803",
        }}
      />
      {/* Vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(11,4,2,0.55) 100%),
            linear-gradient(to right, rgba(11,4,2,0.45) 0%, transparent 18%, transparent 82%, rgba(11,4,2,0.45) 100%)
          `,
        }}
      />
      {/* Warm glow behind headline */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 55% 60% at 28% 42%, rgba(212,98,43,0.22) 0%, transparent 70%)`,
        }}
      />
      {/* Noise overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: `url("/noise.webp")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: 0.045,
          mixBlendMode: "screen",
        }}
      />

      {/* Hero content grid */}
      <div className="w-full max-w-[1100px] 2xl:max-w-[1320px] mx-auto px-4 md:px-6 xl:px-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
        {/* Left: copy */}
        <div className="flex flex-col items-start text-left">
          <h1 className="text-hero text-[2.25rem] md:text-[3.25rem] lg:text-6xl mb-8 drop-shadow-sm text-white"> {/* revert: text-5xl md:text-7xl */}
            Automatisering som tar bort{" "}
            <RollingWord />{" "}
            - utan onödigt strul.
          </h1>

          <p className="text-lg md:text-xl text-white/85 font-medium max-w-[480px] leading-relaxed mb-10">
            Vi eliminerar manuella fel och frigör tid för det som faktiskt skapar värde. Kundnära, effektivt och byggt för att hålla.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Button variant="primary" href="/kontakt">
              Kontakta oss
            </Button>
            <Button variant="ghostDark" href="/case">
              Se hur det funkar
            </Button>
          </div>

          {/* Mobile accent dots — revert: remove this div */}
          <div className="md:hidden mt-10 flex items-center gap-1.5" aria-hidden="true">
            <div className="w-1 h-1 rounded-full bg-[#E8833A] opacity-60" />
            <div className="w-1 h-1 rounded-full bg-[#E8833A] opacity-40" />
            <div className="w-1 h-1 rounded-full bg-[#E8833A] opacity-20" />
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

    </section>
  );
}
