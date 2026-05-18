"use client";

import Container from "@/components/Container";
import Manifesto from "@/components/sections/Manifesto";
import { motion, useReducedMotion } from "motion/react";

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: reduced ? 0 : 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default function AboutContent() {
  return (
    <div>
      {/* ── Hero ── */}
      <Container>
        <header className="pt-32 pb-10 border-b border-[rgba(58,51,48,0.18)]">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h1
              className="font-sans font-bold text-[var(--color-text)] leading-[0.92] tracking-[-0.03em]"
              style={{ fontSize: "clamp(3.125rem, 8.5vw, 7.125rem)" }}
            >
              Vår{" "}
              <span style={{ color: "var(--color-accent)" }}>story.</span>
            </h1>
            <p className="text-base text-[var(--color-text-body)] max-w-[32ch] leading-relaxed md:pb-2 shrink-0">
              Vilka vi är, vad vi står för och varför.
            </p>
          </div>
        </header>
      </Container>

      {/* ── Section 1: Origin ── */}
      <Container>
        <section className="py-20 md:py-28 border-b border-[rgba(58,51,48,0.18)]">
          <Reveal delay={0.08}>
            <h2
              className="font-display text-[var(--color-text)] leading-[1.0] tracking-[-0.02em] mb-8"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
            >
              Vart allt började.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-[1.2rem] leading-[1.7] text-[var(--color-text-body)] max-w-[60ch]">
              Allt tog sin början i november 2025, när Hai insåg kraften i AI och automation. Hai insåg snabbt att alla pratar om att de sysslar med AI-automatiseringar, men att själva ordet är diffust.<br />
              Med den tanken drev det honom till att starta Khyte Automations, för att hjälpa företag att implementera och använda sig av den kraften.<br />
              <span className="relative inline-block font-semibold">
                Simpelt och utan onödigt strul.
                <svg
                  aria-hidden="true"
                  className="absolute left-0 w-full overflow-visible pointer-events-none"
                  style={{ bottom: "-6px", height: "8px" }}
                  preserveAspectRatio="none"
                  viewBox="0 0 200 8"
                >
                  <path
                    d="M0,4 C10,0 20,8 30,4 C40,0 50,8 60,4 C70,0 80,8 90,4 C100,0 110,8 120,4 C130,0 140,8 150,4 C160,0 170,8 180,4 C190,0 200,8 200,4"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </p>
          </Reveal>
        </section>
      </Container>

      {/* ── Section 2: Who we are ── */}
      <Container>
        <section className="py-20 md:py-28 border-b border-[rgba(58,51,48,0.18)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Text */}
            <div>
              <Reveal delay={0.08}>
                <h2
                  className="font-display text-[var(--color-text)] leading-[1.0] tracking-[-0.02em] mb-8"
                  style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
                >
                  Och vilka är vi egentligen?
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="text-[1.2rem] leading-[1.7] text-[var(--color-text-body)] max-w-[52ch]">
                 Vi är två likasinnade killar som ser samma behov. Hai hann tjuvstarta innan Abdi men fick med han på resan en månad efter. Detta var däremot inte första gången Hai och Abdi träffades. De har spelat basket ihop sen 2022, och 2024 var året de växte ihop mycket närmare. Att slå ihop våra hjärnor var något självklart och oundvikligt. Idag har vi förmånen att driva ett företag och lösa problem tillsammans.
                </p>
              </Reveal>
            </div>

            {/* Photo */}
            <Reveal delay={0.12} className="w-full">
              <div className="relative w-full aspect-[4/5] rounded-[4px] overflow-hidden bg-[var(--color-card-bg)] border border-[rgba(58,51,48,0.10)]">
                <img
                  src="/pics/Hai & Abdi.jpeg"
                  className="w-full h-full object-cover"
                  alt="Hai och Abdi"
                />
              </div>
            </Reveal>
          </div>
        </section>
      </Container>

      {/* ── Section 3: What we stand for ── */}
      <Container>
        <section className="py-20 md:py-28 border-b border-[rgba(58,51,48,0.18)]">
          <Reveal delay={0.08}>
            <h2
              className="font-display text-[var(--color-text)] leading-[1.0] tracking-[-0.02em] mb-12"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
            >
              Vad står vi för och varför?
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-[1.35rem] leading-[1.65] text-[var(--color-text)] font-medium max-w-[55ch]">
            I denna snabbt rörliga värld, ska övergången vara så smidig, simpel och bra som möjligt. Vi kommer alltid vara transparenta och aldrig sälja er något som inte passar. Vårt mål är att våra lösningar ska ge tilbaka lika mycket "hårda" värden, som "mjuka", och ge tillbaka en eftermiddag i taget.
            </p>
          </Reveal>
        </section>
      </Container>

      {/* ── Section 4: What we do ── */}
      <Container>
        <section className="py-20 md:py-28 border-b border-[rgba(58,51,48,0.18)]">
          <Reveal delay={0.08}>
            <h2
              className="font-display text-[var(--color-text)] leading-[1.0] tracking-[-0.02em] mb-8"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
            >
              Vad vi gör.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-[1.2rem] leading-[1.7] text-[var(--color-text-body)] max-w-[60ch]">
              [Placeholder — konkret beskrivning av vad Khyte faktiskt bygger
              och levererar. Inte buzzwords. Vad händer från första möte till
              färdig automation? Vad äger kunden när ni är klara?]Vi hoppar in i företagets vardag och automatiserar återkommande arbete. Detta kan se ut som en integration, rådgivning eller koda mjukvara från scratch. Detta gör vi för att skapa mer rum för det viktiga, slippa ha allt i huvudet och kunna göra mer på mindre tid.
            </p>
          </Reveal>
        </section>
      </Container>

      {/* ── Manifesto close ── */}
      <Container>
        <Manifesto />
      </Container>
    </div>
  );
}
