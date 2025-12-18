"use client";

import { useEffect, useRef, useState } from "react";
import TimelineCircles from "./TimelineCircles";

export default function TimelineProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);

            // Only measure on desktop (line is hidden on mobile)
            if (!window.matchMedia("(min-width: 768px)").matches) return;

            // Measure geometry after next paint
            requestAnimationFrame(() => {
              if (!trackRef.current) return;

              // Scope queries to track wrapper (where SVG is inset-0)
              const line = trackRef.current.querySelector('.timeline-line');
              const circles = trackRef.current.querySelectorAll('.timeline-circle');

              if (!line || circles.length === 0) return;

              const lineRect = line.getBoundingClientRect();
              const scanTravel = lineRect.width * 0.8; // matches 80% animation

              circles.forEach((circle, i) => {
                const circleRect = circle.getBoundingClientRect();
                const circleCenter = circleRect.left + circleRect.width / 2 - lineRect.left;

                // Clamp ratio to prevent negative/overshoot delays
                const ratio = Math.min(1, Math.max(0, circleCenter / scanTravel));
                const hitMs = Math.round(ratio * 3640); // 3640ms = scan duration

                // FIXED: Compute circle center positions relative to track wrapper (not section)
                const trackRect = trackRef.current!.getBoundingClientRect();
                const circleCenterX = circleRect.left + circleRect.width / 2 - trackRect.left;
                const circleCenterY = circleRect.top + circleRect.height / 2 - trackRect.top;

                // Set all vars on track wrapper (where SVG is inset-0)
                trackRef.current?.style.setProperty(
                  `--timeline-hit-${i + 1}`,
                  `${hitMs}ms`
                );
                trackRef.current?.style.setProperty(
                  `--timeline-cx-${i + 1}`,
                  `${Math.round(circleCenterX)}px`
                );
                trackRef.current?.style.setProperty(
                  `--timeline-cy-${i + 1}`,
                  `${Math.round(circleCenterY)}px`
                );

                // Debug logging (remove after testing)
                console.log(`Circle ${i + 1} - hit: ${hitMs}ms, cx: ${Math.round(circleCenterX)}px, cy: ${Math.round(circleCenterY)}px`);
              });
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="section-border mb-[var(--spacing-section)]"
    >
      <div className="max-w-[600px] mb-16">
        <h2 className="text-2xl font-medium text-[var(--color-text)] mb-3">
          Så jobbar vi
        </h2>
        <p className="text-[var(--color-muted)] text-[15px] leading-[1.6]">
          En simpel process utan onödigt skit. Från problem till lösning på
          kortast möjliga tid.
        </p>
      </div>

      <div ref={trackRef} data-timeline-track="true" className="relative">
        {/* Timeline connecting line - only visible on desktop */}
        <div
          className={`hidden md:block absolute top-6 left-6 right-6 h-[2px] bg-[var(--color-border)] z-0 timeline-line ${
            isVisible ? "timeline-animate" : ""
          }`}
        />

        {/* SVG circle overlays wrapper - receives CSS vars from parent section */}
        <div
          className={`hidden md:block absolute inset-0 pointer-events-none z-0 timeline-svg-wrapper ${
            isVisible ? "timeline-animate" : ""
          }`}
        >
          <TimelineCircles isVisible={isVisible} />
        </div>

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
          <h3 className="text-lg font-medium mb-4 text-[var(--color-text)]">
            Kartlägger flödet - vi hittar tidstjuvarna
          </h3>
          <p className="text-[var(--color-muted)] text-[15px] leading-[1.6]">
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
          <h3 className="text-lg font-medium mb-4 text-[var(--color-text)]">
            Bygger en prototyp och testar snabbt
          </h3>
          <p className="text-[var(--color-muted)] text-[15px] leading-[1.6]">
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
          <h3 className="text-lg font-medium mb-4 text-[var(--color-text)]">
            Implementerar skarpt - justerar tills det sitter
          </h3>
          <p className="text-[var(--color-muted)] text-[15px] leading-[1.6]">
            Vi driftsätter lösningen. Jag finns kvar och trimmar systemet tills
            det rullar av sig själv.
          </p>
        </div>
      </div>
      </div>
    </section>
  );
}
