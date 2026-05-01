"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const steps = [
  {
    num: "01",
    title: "Kartläggning",
    body: "Vi går igenom era flöden tillsammans — vad som görs manuellt, var tid försvinner, vad som faktiskt går att automatisera. Ni får en tydlig bild av vad som är möjligt innan ni bestämmer er för något.",
    detail: "1–2 arbetsdagar",
  },
  {
    num: "02",
    title: "Pilot",
    body: "Vi börjar smalt. Ett flöde, ett team, mätbart resultat inom veckor. Ingen stor investering innan ni sett det fungera på riktigt — i er miljö, med era system.",
    detail: "2–3 veckor",
  },
  {
    num: "03",
    title: "Drift & förbättring",
    body: "Automationen körs, monitoreras och förbättras löpande. Monitoring och fallback ingår från dag ett — ni märker inte av felen, vi löser dem innan de syns.",
    detail: "Kontinuerligt",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ProcessSection() {
  const prefersReduced = useReducedMotion();

  // Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const row0Ref = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const rowRefs = [row0Ref, row1Ref, row2Ref];

  // Reveal (once)
  const headerVisible = useInView(headerRef, { once: true, margin: "-100px" });
  const row0Entered = useInView(row0Ref, { once: true, margin: "-60px" });
  const row1Entered = useInView(row1Ref, { once: true, margin: "-60px" });
  const row2Entered = useInView(row2Ref, { once: true, margin: "-60px" });
  const rowsEntered = [row0Entered, row1Entered, row2Entered];

  // Active emphasis (live)
  const row0Active = useInView(row0Ref, { once: false, margin: "-30% 0px -50% 0px" });
  const row1Active = useInView(row1Ref, { once: false, margin: "-30% 0px -50% 0px" });
  const row2Active = useInView(row2Ref, { once: false, margin: "-30% 0px -50% 0px" });
  const rowsActive = [row0Active, row1Active, row2Active];

  // Progress fill height
  const activeIndex = row2Active ? 2 : row1Active ? 1 : row0Active ? 0 : -1;
  const fillHeight = activeIndex === -1 ? "0%" : `${((activeIndex + 1) / 3) * 100}%`;

  return (
    <section className="pt-[var(--spacing-section)] pb-[var(--spacing-section)]">
      <div className="flex flex-col md:flex-row gap-16 md:gap-24">

        {/* Left — sticky */}
        <div className="md:w-[340px] shrink-0">
          <motion.div
            ref={headerRef}
            className="md:sticky md:top-32"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: headerVisible ? 1 : 0, y: headerVisible ? 0 : 10 }}
            transition={{ duration: prefersReduced ? 0 : 0.6, ease: EASE }}
          >
            <span className="block mb-5 text-xs tracking-widest uppercase font-bold text-[var(--color-muted)]">
              · Hur vi jobbar
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)] leading-[1.05] tracking-tight mb-5">
              Från idé till automation som faktiskt håller.
            </h2>
            <p className="text-[var(--color-text-body)] text-base leading-[1.6] max-w-[36ch]">
              Tre steg. Ingen onödig process, ingen vendor lock-in — bara ett system som rullar.
            </p>
          </motion.div>
        </div>

        {/* Right — scrolling steps with progress rail */}
        <div className="flex-1 relative">
          {/* Rail base */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--color-border)]" aria-hidden="true" />
          {/* Rail accent fill */}
          <div
            className="absolute left-0 top-0 w-px bg-[var(--color-accent)]"
            style={{ height: fillHeight, transition: prefersReduced ? "none" : "height 0.4s ease" }}
            aria-hidden="true"
          />

          <div className="flex flex-col pl-6">
            {steps.map((step, i) => {
              const entered = rowsEntered[i];
              const active = rowsActive[i];

              return (
                <motion.div
                  key={step.num}
                  ref={rowRefs[i]}
                  className={`relative py-20 ${i !== steps.length - 1 ? "border-b border-[var(--color-border)]" : ""}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 12 }}
                  transition={{ duration: prefersReduced ? 0 : 0.55, ease: EASE }}
                >
                  {/* Ghost number — right-anchored */}
                  <motion.span
                    aria-hidden="true"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[9rem] font-bold leading-none select-none pointer-events-none"
                    style={{ color: "var(--color-text)", letterSpacing: "-0.04em" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: entered ? 0.055 : 0 }}
                    transition={{ duration: prefersReduced ? 0 : 0.8, ease: EASE, delay: prefersReduced ? 0 : 0.1 }}
                  >
                    {step.num}
                  </motion.span>

                  {/* Content — sits on top of ghost number */}
                  <div
                    className="relative"
                    style={{
                      opacity: entered ? (active ? 1 : 0.55) : 0,
                      transform: entered ? "none" : "translateY(6px)",
                      transition: prefersReduced ? "none" : "opacity 0.35s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1)",
                      transitionDelay: prefersReduced ? "0s" : "0.06s",
                    }}
                  >
                    <h3 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] tracking-[-0.02em] mb-4">
                      {step.title}
                    </h3>
                    <p className="text-[var(--color-text-body)] text-base leading-[1.7] max-w-[52ch]">
                      {step.body}
                    </p>
                    <span className="inline-block mt-6 text-xs font-semibold tracking-[0.10em] uppercase text-[var(--color-muted)]">
                      {step.detail}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
