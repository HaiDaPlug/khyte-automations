"use client";

import { useRef } from "react";
import InteractiveGrid from "@/components/InteractiveGrid";
import WorkflowVisual from "@/components/WorkflowVisual";

/**
 * VisualSection — owns the sectionRef so InteractiveGrid can track
 * mouse events across the full section (including the z-10 overlay).
 */
export default function VisualSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-[var(--color-border)] overflow-hidden"
      style={{ minHeight: 420 }}
    >
      {/* Dot grid — pointer-events:none on canvas, tracking on section */}
      <div className="absolute inset-0">
        <InteractiveGrid
          containerRef={sectionRef}
          influence={140}
          maxScale={5}
          gap={34}
          dotRadius={2}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center text-center py-[100px] px-4">
        <span className="text-label mb-5">Så ser ett flöde ut</span>
        <h2 className="text-5xl md:text-6xl font-semibold mb-4 text-[var(--color-text)] tracking-[-0.01em] leading-[1.2]">
          Från trigger till resultat
        </h2>
        <p className="text-[var(--color-text-body)] text-base leading-[1.6] mb-14 max-w-xl">
          Vi bygger automationer som körs helt utan mänsklig inblandning — från att data samlas in till att rapporten landar i rätt inkorg.
        </p>
        <WorkflowVisual />
      </div>
    </section>
  );
}
