"use client";

import { useEffect, useRef, useState } from "react";

export default function TimelineProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-border mb-[var(--spacing-section)]"
    >
      <div className="max-w-[600px] mb-16">
        <h2 className="text-2xl font-medium text-[var(--color-text)] mb-3">
          Så jobbar vi
        </h2>
        <p className="text-[var(--color-text-body)] text-base leading-[1.6] max-w-[65ch]">
          En simpel process utan onödigt skit. Från problem till lösning på
          kortast möjliga tid.
        </p>
      </div>

      <div className="relative">
        {/* Timeline connecting line - only visible on desktop */}
        <div
          className={`hidden md:block absolute top-6 left-6 right-6 h-[2px] bg-[var(--color-border)] z-0 timeline-line ${
            isVisible ? "timeline-animate" : ""
          }`}
        />

        {/* Grid with steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative overflow-visible z-10">

        {/* Step 1 */}
        <div
          className={`relative z-10 timeline-step timeline-step--1 overflow-visible ${
            isVisible ? "timeline-animate" : ""
          }`}
        >
          <div className="timeline-circle w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold mb-6 bg-[var(--color-accent)] text-[var(--color-bg)]">
            1
          </div>
          <h3 className="text-[1.5rem] font-medium mb-4 text-[var(--color-text)] leading-[1.3]">
            Kartlägger flödet - vi hittar tidstjuvarna
          </h3>
          <p className="text-[var(--color-text-body)] text-base leading-[1.5] max-w-[460px]">
            Vi går igenom era processer och identifierar var energin läcker. Vi
            letar efter upprepning och friktion.
          </p>
        </div>

        {/* Step 2 */}
        <div
          className={`relative z-10 timeline-step timeline-step--2 overflow-visible ${
            isVisible ? "timeline-animate" : ""
          }`}
        >
          <div className="timeline-circle w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold mb-6 bg-[var(--color-bg)] border-2 border-[var(--color-accent)] text-[var(--color-accent)]">
            2
          </div>
          <h3 className="text-[1.5rem] font-medium mb-4 text-[var(--color-text)] leading-[1.3]">
            Bygger en prototyp och testar snabbt
          </h3>
          <p className="text-[var(--color-text-body)] text-base leading-[1.5] max-w-[460px]">
            Inget evighetsplanerande. Vi bygger en fungerande version som vi
            testar mot verkligheten direkt.
          </p>
        </div>

        {/* Step 3 */}
        <div
          className={`relative z-10 timeline-step timeline-step--3 overflow-visible ${
            isVisible ? "timeline-animate" : ""
          }`}
        >
          <div className="timeline-circle w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold mb-6 bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)]">
            3
          </div>
          <h3 className="text-[1.5rem] font-medium mb-4 text-[var(--color-text)] leading-[1.3]">
            Implementerar skarpt - justerar tills det sitter
          </h3>
          <p className="text-[var(--color-text-body)] text-base leading-[1.5] max-w-[460px]">
            Vi driftsätter lösningen. Jag finns kvar och trimmar systemet tills
            det rullar av sig själv.
          </p>
        </div>
      </div>
      </div>
    </section>
  );
}
