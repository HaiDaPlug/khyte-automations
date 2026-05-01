import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case – Automation som leverar | Khyte",
  description:
    "Automationer vi byggt för riktiga problem hos svenska företag. Konkreta resultat, riktiga flöden.",
  alternates: { canonical: "/case" },
};

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.70' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23g)' opacity='0.18'/%3E%3C/svg%3E")`;

const cases = [
  {
    slug: "lead-engine",
    index: "01",
    company: "JaTack AB",
    problem: "Leadgenerering för listor",
    description: "Automatiserat flöde som identifierar, kvalificerar och levererar varma leads direkt till säljarnas arbetsyta — utan manuellt arbete.",
    gradient: [
      "radial-gradient(ellipse 55% 60% at 78% 18%, rgba(255,235,185,0.72) 0%, rgba(255,235,185,0) 65%)",
      "radial-gradient(ellipse 70% 65% at 28% 52%, rgba(212,98,43,0.90) 0%, rgba(212,98,43,0) 62%)",
      "radial-gradient(ellipse 50% 55% at 8% 88%, rgba(27,8,3,0.88) 0%, rgba(27,8,3,0) 58%)",
      "radial-gradient(ellipse 60% 50% at 18% 10%, rgba(232,131,58,0.65) 0%, rgba(232,131,58,0) 60%)",
      "linear-gradient(145deg, #7A3A18 0%, #C46020 35%, #E8A050 58%, #F5D8A0 80%, #C87030 100%)",
    ].join(", "),
  },
  {
    slug: "lead-lista",
    index: "02",
    company: "Observa Inkasso & Juridik",
    problem: "Automatisk research av befintlig data",
    description: "AI-driven research som scrapar, filtrerar och sammanställer företagsprofiler med kontaktuppgifter — helt utan mänsklig hand.",
    gradient: [
      "radial-gradient(ellipse 45% 55% at 15% 25%, rgba(90,20,8,0.95) 0%, rgba(90,20,8,0) 65%)",
      "radial-gradient(ellipse 60% 50% at 85% 45%, rgba(160,60,20,0.70) 0%, rgba(160,60,20,0) 60%)",
      "radial-gradient(ellipse 55% 60% at 50% 85%, rgba(200,90,30,0.55) 0%, rgba(200,90,30,0) 65%)",
      "radial-gradient(ellipse 40% 35% at 70% 12%, rgba(240,160,80,0.40) 0%, rgba(240,160,80,0) 60%)",
      "linear-gradient(140deg, #0C0402 0%, #2A0A04 30%, #6B2210 58%, #A84020 80%, #5A1A08 100%)",
    ].join(", "),
  },
];

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

  const caseCard = ({ slug, company, problem, description, gradient }: Omit<typeof cases[number], "index">) => (
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
      </div>

      {/* Divider */}
      <div className="h-px bg-[rgba(58,51,48,0.18)]" />

      {/* Text */}
      <div className="flex flex-col flex-1 p-6">
        <h2
          className="font-sans font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors duration-300 mb-2"
          style={{ fontSize: "clamp(1.15rem, 1.8vw, 1.45rem)", lineHeight: 1.15, letterSpacing: "-0.02em" }}
        >
          {company}
        </h2>
        <p className="text-[var(--color-muted)] text-sm font-medium mb-4 leading-snug">
          {problem}
        </p>
        <p className="text-[var(--color-text-body)] text-sm leading-relaxed">
          {description}
        </p>
        <div className="mt-6 pt-5 border-t border-[rgba(58,51,48,0.18)]">
          <span className="flex items-center gap-1.5 text-[var(--color-ink)] text-sm font-bold">
            Läs mer
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
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
