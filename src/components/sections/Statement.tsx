"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const CONVICTIONS = [
  {
    headline: "Automatisering ska inte kräva en IT-avdelning.",
    body: "Vi hoppar in, lär oss era processer och bygger — utan att ni behöver förstå tekniken bakom.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="6.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="14" cy="14" r="2.5" fill="currentColor" opacity="0.5" />
        <path d="M14 6V4M14 24v-2M6 14H4M24 14h-2M8.34 8.34 6.93 6.93M21.07 21.07l-1.41-1.41M8.34 19.66l-1.41 1.41M21.07 6.93l-1.41 1.41" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M20 22l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
        <circle cx="28" cy="30" r="1.5" fill="currentColor" opacity="0.35" />
      </svg>
    ),
  },
  {
    headline: "Vi bygger det, testar det, driftsätter det. Ni äger det.",
    body: "Ingen vendor lock-in. All kod, alla inloggningar, all dokumentation — era för alltid.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <rect x="8" y="16" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M13 16v-4a7 7 0 0 1 14 0v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="18" cy="23" r="2.5" fill="currentColor" opacity="0.5" />
        <path d="M18 25.5V28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
  {
    headline: "Resultat på veckor, inte månader.",
    body: "Inget evighetsplanerande. En fungerande lösning i produktion är alltid bättre än en perfekt plan.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <path d="M21 4L8 20h10l-3 12 15-18H20L21 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="mb-[var(--spacing-section)]">
      {/* Full-bleed band — pure white */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <div className="relative overflow-hidden isolate" style={{ background: "#ffffff" }}>
          {/* Hairlines */}
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[rgba(58,51,48,0.10)]" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[rgba(58,51,48,0.10)]" />

          {/* Inner content */}
          <div className="max-w-[1280px] mx-auto px-6 pt-20 pb-20 md:pt-28 md:pb-28">

            {/* Editorial headline */}
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-[-0.03em] mb-16 md:mb-20"
              style={{ fontVariantNumeric: "normal" }}
            >
              <span className="text-[var(--color-text)]">
                Den nya generationen av konsult.&nbsp;
              </span>
              <span className="text-[var(--color-muted)]">
                Vi hoppar in i din verklighet och automatiserar alla dina manuella processer.
              </span>
            </h2>

            {/* Conviction cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {CONVICTIONS.map((item, i) => {
                const featured = i === 2;
                return (
                <motion.div
                  key={i}
                  className="relative flex flex-col rounded-2xl p-8"
                  style={{
                    background: featured ? "#FDF8F5" : "#FAFAF8",
                    boxShadow: featured ? [
                      "0 0 0 1.5px rgba(212,98,43,0.35)",
                      "0 0 0 5px rgba(212,98,43,0.07)",
                      "0 1px 0 0 rgba(255,255,255,0.90) inset",
                      "0 -1px 0 0 rgba(58,51,48,0.05) inset",
                      "0 4px 20px rgba(212,98,43,0.10)",
                      "0 10px 40px rgba(58,51,48,0.07)",
                    ].join(", ") : [
                      "0 0 0 1px rgba(58,51,48,0.12)",
                      "0 0 0 4px rgba(212,98,43,0.04)",
                      "0 1px 0 0 rgba(255,255,255,0.90) inset",
                      "0 -1px 0 0 rgba(58,51,48,0.05) inset",
                      "0 2px 12px rgba(58,51,48,0.05)",
                      "0 8px 32px rgba(58,51,48,0.04)",
                    ].join(", "),
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : 12,
                  }}
                  transition={{
                    duration: prefersReduced ? 0 : 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: prefersReduced ? 0 : i * 0.1,
                  }}
                  whileHover={prefersReduced ? {} : {
                    boxShadow: [
                      "0 0 0 1.5px rgba(212,98,43,0.35)",
                      "0 0 0 5px rgba(212,98,43,0.07)",
                      "0 1px 0 0 rgba(255,255,255,0.90) inset",
                      "0 -1px 0 0 rgba(58,51,48,0.05) inset",
                      "0 4px 20px rgba(212,98,43,0.12)",
                      "0 12px 40px rgba(58,51,48,0.08)",
                    ].join(", "),
                  }}
                >
                  {/* Icon badge — 40px, aligned */}
                  <div
                    className="mb-7 w-10 h-10 flex items-center justify-center rounded-xl shrink-0"
                    style={{
                      color: "#D4622B",
                      background: "rgba(212,98,43,0.08)",
                      border: "1px solid rgba(212,98,43,0.14)",
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Conviction headline */}
                  <h3 className="text-xl md:text-2xl font-semibold text-[var(--color-text)] leading-[1.22] tracking-[-0.02em] mb-4 flex-1">
                    {item.headline}
                  </h3>

                  {/* Fade divider */}
                  <div
                    className="h-px mb-4"
                    style={{ background: "linear-gradient(90deg, rgba(58,51,48,0.12) 0%, rgba(58,51,48,0) 100%)" }}
                    aria-hidden="true"
                  />

                  {/* Supporting detail */}
                  <p className="text-[var(--color-text-body)] text-base leading-[1.65]">
                    {item.body}
                  </p>
                </motion.div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
