"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const STEPS = [
  {
    number: "01",
    title: "Kartläggning.",
    body: "Vi går igenom era processer och identifierar var energin läcker. Vi letar efter upprepning och friktion.",
  },
  {
    number: "02",
    title: "Implementation.",
    body: "Inget evighetsplanerande. Vi bygger en fungerande version som vi testar mot verkligheten direkt.",
  },
  {
    number: "03",
    title: "Driftsättning.",
    body: "Vi driftsätter lösningen. Vi finns kvar och trimmar systemet tills det rullar av sig själv.",
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
                Vi hoppar in i din verklighet och automatiserar alla dina manuella
                processer.
              </span>
            </h2>

            {/* Process cards — 3 col desktop, 1 col mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.number}
                  className="relative flex flex-col rounded-2xl p-10 lg:p-12"
                  style={{
                    background: "#ffffff",
                    boxShadow: [
                      "0 0 0 1px rgba(58,51,48,0.14)",          // soft warm border ring
                      "0 0 0 4px rgba(212,98,43,0.05)",         // faint orange glow halo
                      "0 1px 0 0 rgba(255,255,255,0.90) inset", // top-edge light catch
                      "0 -1px 0 0 rgba(58,51,48,0.06) inset",  // bottom-edge depth
                      "0 2px 12px rgba(58,51,48,0.06)",
                      "0 8px 32px rgba(58,51,48,0.05)",
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
                >
                  {/* Top accent line */}
                  <div
                    className="w-12 h-[3px] rounded-full mb-8"
                    style={{ background: "linear-gradient(90deg, #D4622B 0%, #E8833A 100%)" }}
                    aria-hidden="true"
                  />

                  {/* Step number — decorative */}
                  <span
                    className="text-[4.5rem] md:text-[5rem] font-bold leading-none mb-5"
                    style={{ color: "#D4622B", opacity: 0.40 }}
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>

                  {/* Title */}
                  <h3 className="text-[1.25rem] md:text-[1.375rem] font-semibold text-[var(--color-text)] leading-[1.22] tracking-[-0.02em] mb-4">
                    {step.title}
                  </h3>

                  {/* Body */}
                  <p className="text-[var(--color-text-body)] text-base leading-[1.65] mt-auto pt-4 border-t border-[rgba(58,51,48,0.08)]">
                    {step.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
