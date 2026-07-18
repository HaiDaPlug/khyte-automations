import type { Metadata } from "next";
import Link from "next/link";
import type { CaseData } from "@/data/cases";
import { cases } from "@/data/cases";

export const metadata: Metadata = {
  title: "Case – Automation som leverar | Khyte",
  description:
    "Automationer vi byggt för riktiga problem hos svenska företag. Konkreta resultat, riktiga flöden.",
  alternates: { canonical: "/case" },
};

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.70' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23g)' opacity='0.18'/%3E%3C/svg%3E")`;

/*
  ══════════════════════════════════════════════════════════════════════════════
  OPTION B — Alternating editorial rows (archived, for future use)
  Case 01: visual left, text right. Case 02: text left, visual right.
  Best with 2–3 cases. Swap back in by replacing the grid section below.

  {cases.map(({ slug, index, category, title, hook, description, metric, metricLabel, gradient }, i) => {
    const reversed = i % 2 === 1;
    return (
      <Link key={slug} href={`/case/${slug}`}
        className={`group grid grid-cols-1 md:grid-cols-2 gap-0 border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-[var(--color-muted)] transition-colors duration-300 ${reversed ? "md:[direction:rtl]" : ""}`}
      >
        <div className={`relative overflow-hidden ${reversed ? "md:[direction:ltr]" : ""}`}>
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]" style={{ background: gradient }} />
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: GRAIN, backgroundSize: "160px 160px", mixBlendMode: "overlay" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          <div className="aspect-[4/3] md:aspect-auto md:h-full md:min-h-[360px]" />
        </div>
        <div className={`flex flex-col justify-between p-8 md:p-10 bg-[var(--color-card-bg)] ${reversed ? "md:[direction:ltr]" : ""}`}>
          ...
        </div>
      </Link>
    );
  })}
  ══════════════════════════════════════════════════════════════════════════════
*/


export default function Cases() {
  const totalIsOdd = (cases.length + 1) % 2 !== 0;

  const caseCard = ({ slug, index, company, problem, description, gradient, metrics }: Pick<CaseData, "slug" | "index" | "company" | "problem" | "description" | "gradient" | "metrics">) => (
    <Link
      key={slug}
      href={`/case/${slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden transition-[border-color,box-shadow] duration-300 border border-[rgba(58,51,48,0.18)] hover:border-[rgba(58,51,48,0.52)] hover:shadow-[0_0_0_1px_rgba(58,51,48,0.52)]"
    >
      {/* Visual */}
      <div className="relative overflow-hidden aspect-[16/10] shrink-0">
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          style={{ background: gradient }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: GRAIN, backgroundSize: "160px 160px", mixBlendMode: "overlay" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      </div>

      {/* Text */}
      <div className="flex flex-col flex-1 p-6 pt-5">

        {/* Top block */}
        <div className="flex-1">
          <p
            className="mb-2 font-medium"
            style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-muted)" }}
          >
            {problem}
          </p>
          <h2
            className="font-display text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors duration-300 mb-3"
            style={{ fontSize: "clamp(1.25rem, 1.9vw, 1.55rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.01em" }}
          >
            {company}
          </h2>
          <p className="text-[var(--color-text-body)] text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Key metric */}
        <div className="mt-6 pt-5 border-t border-[rgba(58,51,48,0.12)]">
          <p
            className="font-display text-[var(--color-text)] mb-1"
            style={{ fontSize: "clamp(1.5rem, 2.4vw, 2rem)", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}
          >
            {metrics[0].value}
            <span
              className="font-display text-[var(--color-muted)] ml-1"
              style={{ fontSize: "0.85em", fontWeight: 700, letterSpacing: "0" }}
            >
              {metrics[0].unit}
            </span>
          </p>
          <p className="text-[var(--color-muted)] text-xs font-medium">
            {metrics[0].label}
          </p>
        </div>

        {/* Läs mer */}
        <div className="mt-4 pt-4 border-t border-[rgba(58,51,48,0.12)]">
          <span className="flex items-center gap-1.5 text-[var(--color-text)] text-sm font-semibold">
            Läs mer
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );

  const placeholder = (
    <div
      key="placeholder"
      className="flex flex-col rounded-2xl overflow-hidden cursor-default select-none border border-dashed border-[rgba(58,51,48,0.45)]"
    >
      {/* Fill to match real card height */}
      <div className="flex flex-col flex-1 min-h-[420px] p-6 items-center justify-center text-center">
        <h2
          className="font-sans font-bold text-[var(--color-text)] mb-2"
          style={{ fontSize: "clamp(1.15rem, 1.8vw, 1.45rem)", lineHeight: 1.15, letterSpacing: "-0.02em" }}
        >
          Kommer snart
        </h2>
        <p className="text-[var(--color-muted)] text-sm font-medium leading-snug">Nästa case är under arbete</p>
      </div>
    </div>
  );

  return (
    <div className="page-enter">
      <div className="max-w-[1200px] mx-auto px-6">
        <main className="pt-32 pb-10">

          {/* ── Hero ── */}
          <div className="pb-10 mb-10 border-b border-[rgba(58,51,48,0.18)]">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h1
                className="font-sans font-bold text-[var(--color-text)] leading-[0.92] tracking-[-0.03em]"
                style={{ fontSize: "clamp(3.125rem, 8.5vw, 7.125rem)" }}
              >
                Arbete som{" "}
                <span style={{ color: "var(--color-accent)" }}>levererar.</span>
              </h1>
              <p className="text-base text-[var(--color-text-body)] max-w-[32ch] leading-relaxed md:pb-2 shrink-0">
                Automationer vi byggt för riktiga problem.<br />Resultaten talar för sig själva.
              </p>
            </div>
          </div>

          {/* ── Case grid ──
               Total = cases + 1 placeholder.
               Odd total  → cases in grid, placeholder centered at half-width below.
               Even total → all items in 2-col grid.
               Add a 3rd case → total 4 (even) → clean 2×2 grid.
          ── */}
          {totalIsOdd ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {cases.map((c) => caseCard(c))}
              </div>
              <div className="flex justify-center mt-5">
                <div className="w-full md:max-w-[calc(50%-10px)]">
                  {placeholder}
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {cases.map((c) => caseCard(c))}
              {placeholder}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
