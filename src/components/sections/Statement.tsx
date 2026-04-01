"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLParagraphElement>(null);
  const prefersReduced = useReducedMotion();
  const headlineVisible = useInView(sectionRef, { once: true, margin: "-80px" });
  const manifestoVisible = useInView(manifestoRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} className="mb-0">
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <div className="relative overflow-hidden isolate" style={{ background: "var(--color-bg)" }}>
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[rgba(58,51,48,0.10)]" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[rgba(58,51,48,0.10)]" />

          <div className="max-w-[1280px] mx-auto px-6 pt-24 pb-24 md:pt-32 md:pb-32">

            {/* Editorial headline — locked */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: headlineVisible ? 1 : 0, y: headlineVisible ? 0 : 10 }}
              transition={{ duration: prefersReduced ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2
                className="text-4xl md:text-5xl lg:text-6xl leading-[1.08] tracking-[-0.03em] mb-16 md:mb-20"
                style={{ fontVariantNumeric: "normal" }}
              >
                <span className="block font-bold text-[var(--color-text)] mb-2">
                  Mot en friare framtid.
                </span>
                <span
                  className="block font-medium text-[var(--color-muted)] max-w-[32ch] text-balance"
                  style={{ fontSize: "0.82em" }}
                >
                  Vi hoppar in i din verklighet och automatiserar dina manuella processer.
                </span>
              </h2>
            </motion.div>

            {/* Conviction prose — centered manifesto */}
            <div className="flex justify-center">
              <motion.p
                ref={manifestoRef}
                className="text-3xl md:text-4xl lg:text-5xl font-normal text-[var(--color-text)] leading-[1.3] tracking-[-0.03em] text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: manifestoVisible ? 1 : 0 }}
                transition={{ duration: prefersReduced ? 0 : 0.75, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="block whitespace-nowrap">
                  <span className="underline decoration-[var(--color-accent)] decoration-2 underline-offset-[8px]">Automatisering ska inte vara svårt.</span>
                </span>
                <span className="block max-w-[40ch] mx-auto text-balance mt-1">
                  Vi tror på att övergången till nya arbetssätt ska kännas smidigt, enkelt och tryggt.
                </span>
              </motion.p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
