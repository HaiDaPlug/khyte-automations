"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

const steps = [
  {
    num: "01.",
    title: "Kartläggning",
    body: "Vi går igenom era flöden och strategi. Vad som är manuellt, vart ni tappar tid och vad som går att automatisera så att ni får bra koll nu.",
  },
  {
    num: "02.",
    title: "Implementering",
    body: "Efter kartläggningen kommer det roliga. Vi implementerar snabbt och smalt med fokus på att det fungerar i verkligheten och håller.",
  },
  {
    num: "03.",
    title: "Support & förbättring",
    body: "Automationen är igång - men vi är kvar. Vi övervakar, justerar och förbättrar så att ni slipper jaga felen själva.",
  },
];

function ProgressDots({
  scrollYProgress,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const dot0 = useTransform(scrollYProgress, [0, 0.32, 0.34], [1, 1, 0.25]);
  const dot1 = useTransform(scrollYProgress, [0.32, 0.34, 0.65, 0.67], [0.25, 1, 1, 0.25]);
  const dot2 = useTransform(scrollYProgress, [0.65, 0.67, 1], [0.25, 1, 1]);
  const opacities = [dot0, dot1, dot2];

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {steps.map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full bg-[var(--color-accent)]"
          style={{ width: 6, height: 6, opacity: opacities[i] }}
        />
      ))}
    </div>
  );
}

function MobileCardDeck() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Track scroll of the tall container
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  // Card 0 exits first third
  const x0     = useTransform(scrollYProgress, [0, 0.33], ["0%", "120%"]);
  const rot0   = useTransform(scrollYProgress, [0, 0.33], [0, 14]);
  const op0    = useTransform(scrollYProgress, [0.22, 0.33], [1, 0]);

  // Card 1 exits second third
  const x1     = useTransform(scrollYProgress, [0.33, 0.66], ["0%", "120%"]);
  const rot1   = useTransform(scrollYProgress, [0.33, 0.66], [0, 14]);
  const op1    = useTransform(scrollYProgress, [0.55, 0.66], [1, 0]);

  return (
    // 300vh tall — gives the sticky block room to "hold" while user scrolls through cards
    <div ref={scrollRef} className="relative h-[300vh]">
      {/* Sticky panel — offset by nav height so header stays visible */}
      <div className="sticky top-[72px] flex flex-col bg-[var(--color-bg)] px-6 pt-8 pb-10 overflow-hidden" style={{ height: "calc(100vh - 72px)" }}>

        {/* Header (duplicated inside sticky so it pins with the cards) */}
        <div className="mb-10 flex-shrink-0">
          <h2 className="font-display overflow-visible text-[3rem] leading-[1.15] tracking-wide uppercase text-[var(--color-text)] -mt-1">
            TRE <span style={{ color: "#D4622B" }}>STEG.</span>
          </h2>
          <p className="text-base font-medium text-[var(--color-text)] mt-3 max-w-[34ch] leading-[1.5]">
            Ingen onödig process. Utan bindningstid.
          </p>
        </div>

        {/* Card stack — min-height so body text never clips on small phones */}
        <div className="relative" style={{ minHeight: 340, height: 340 }}>
          {/* Card 2 — bottom of deck, inset so it peeks as a shadow */}
          <div
            className="absolute flex flex-col p-6 rounded-[28px]"
            style={{
              background: "var(--color-bg)",
              border: "var(--border-width) solid var(--color-border)",
              inset: 0,
              top: 12,
              left: 8,
              right: 8,
              transformOrigin: "top center",
              zIndex: 1,
            }}
          >
            <span className="block font-display text-[2.5rem] leading-none tracking-wide text-[var(--color-accent)]">
              {steps[2].num}
            </span>
            <h3 className="text-xl font-bold text-black mt-3 mb-2">{steps[2].title}</h3>
            <p className="text-neutral-800 text-base leading-snug">{steps[2].body}</p>
          </div>

          {/* Card 1 — middle */}
          <motion.div
            className="absolute flex flex-col p-6 rounded-[28px]"
            style={{
              background: "var(--color-bg)",
              border: "var(--border-width) solid var(--color-border)",
              inset: 0,
              top: 6,
              left: 4,
              right: 4,
              x: prefersReduced ? 0 : x1,
              rotate: prefersReduced ? 0 : rot1,
              opacity: prefersReduced ? 1 : op1,
              transformOrigin: "top center",
              zIndex: 2,
            }}
          >
            <span className="block font-display text-[2.5rem] leading-none tracking-wide text-[var(--color-accent)]">
              {steps[1].num}
            </span>
            <h3 className="text-xl font-bold text-black mt-3 mb-2">{steps[1].title}</h3>
            <p className="text-neutral-800 text-sm leading-relaxed">{steps[1].body}</p>
          </motion.div>

          {/* Card 0 — top */}
          <motion.div
            className="absolute inset-0 flex flex-col p-6 rounded-[28px]"
            style={{
              background: "var(--color-bg)",
              border: "var(--border-width) solid var(--color-border)",
              x: prefersReduced ? 0 : x0,
              rotate: prefersReduced ? 0 : rot0,
              opacity: prefersReduced ? 1 : op0,
              zIndex: 3,
            }}
          >
            <span className="block font-display text-[2.5rem] leading-none tracking-wide text-[var(--color-accent)]">
              {steps[0].num}
            </span>
            <h3 className="text-xl font-bold text-black mt-3 mb-2">{steps[0].title}</h3>
            <p className="text-neutral-800 text-sm leading-relaxed">{steps[0].body}</p>
          </motion.div>
        </div>

        <ProgressDots scrollYProgress={scrollYProgress} />

        {/* Om oss link at bottom of sticky panel */}
        <div className="flex items-center mt-6 flex-shrink-0">
          <a
            href="/om-oss"
            className="font-display text-sm font-bold tracking-[0.18em] uppercase text-[var(--color-text)] hover:text-[#D4622B] transition-colors duration-300 flex items-center gap-2"
          >
            OM OSS
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ProcessSection() {
  return (
    <>
      {/* ── Mobile: full-screen pinned card deck ── */}
      <div className="md:hidden border-t border-[var(--color-border)]">
        <MobileCardDeck />
      </div>

      {/* ── Desktop: original section, unchanged ── */}
      <section className="hidden md:block bg-[var(--color-bg)] border-t border-[var(--color-border)] pt-12 pb-[var(--spacing-section)] px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <div>
            <h2 className="font-display overflow-visible text-[3rem] md:text-[4.5rem] leading-[1.15] tracking-wide uppercase text-[var(--color-text)] -mt-1">
              TRE <span style={{ color: "#D4622B" }}>STEG.</span>
            </h2>
            <p className="text-base font-medium text-[var(--color-text)] mt-3 max-w-[34ch] leading-[1.5]">
              Ingen onödig process. Utan bindningstid.
            </p>
          </div>
          <div className="flex items-center mt-6 md:mt-0 shrink-0">
            <a
              href="/om-oss"
              className="font-display text-sm font-bold tracking-[0.18em] uppercase text-[var(--color-text)] hover:text-[#D4622B] transition-colors duration-300 flex items-center gap-2"
            >
              OM OSS
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
        <div className="max-w-[1600px] mx-auto grid grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative z-10 flex flex-col p-10 md:p-12 rounded-[32px]"
              style={{ background: "var(--color-bg)", border: "var(--border-width) solid var(--color-border)" }}
            >
              <span className="block font-display text-[4.5rem] leading-none tracking-wide text-[var(--color-accent)]">
                {step.num}
              </span>
              <h3 className="text-3xl font-bold text-black mt-8 mb-4">{step.title}</h3>
              <p className="text-neutral-800 text-lg leading-relaxed pr-4">{step.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
