import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { cases, getCaseBySlug } from "@/data/cases";

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.70' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23g)' opacity='0.18'/%3E%3C/svg%3E")`;

type Params = { slug: string };

export async function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) return {};
  return {
    title: `${c.company} — ${c.problem} | Khyte`,
    description: c.hook,
    alternates: { canonical: `/case/${slug}` },
  };
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) notFound();

  const nextCase = c.nextSlug ? cases.find((x) => x.slug === c.nextSlug) : null;

  return (
    <div className="page-enter">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "62vh" }}>
        <div className="absolute inset-0" style={{ background: c.gradient }} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: GRAIN, backgroundSize: "160px 160px", mixBlendMode: "overlay" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-44 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, var(--color-bg))" }}
        />

        {/* Ghost index — editorial folio mark */}
        <span
          className="absolute right-0 top-0 font-display text-white pointer-events-none select-none"
          style={{ fontSize: "clamp(9rem, 24vw, 20rem)", fontWeight: 800, lineHeight: 0.85, opacity: 0.09, letterSpacing: "-0.03em" }}
          aria-hidden="true"
        >
          {c.index}
        </span>

        <div
          className="relative z-10 max-w-[1200px] mx-auto px-6 flex flex-col justify-between"
          style={{ minHeight: "62vh" }}
        >
          {/* Back link */}
          <div className="pt-36 md:pt-40">
            <Link
              href="/case"
              className="inline-flex items-center gap-2 text-white/65 hover:text-white transition-colors duration-200"
              style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M8.5 1.5L3.5 6.5l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Case
            </Link>
          </div>

          {/* Company + hook */}
          <div className="pb-14 md:pb-18">
            <p
              className="text-white/55 mb-3"
              style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}
            >
              {c.category}
            </p>
            <h1
              className="font-display text-white"
              style={{ fontSize: "clamp(2.75rem, 6.5vw, 5.5rem)", fontWeight: 800, lineHeight: 0.9, letterSpacing: "-0.01em" }}
            >
              {c.company}
            </h1>
            <p
              className="text-white/70 font-medium mt-5 leading-relaxed"
              style={{ fontSize: "clamp(1rem, 1.4vw, 1.15rem)", maxWidth: "44ch" }}
            >
              {c.hook}
            </p>
          </div>
        </div>
      </section>

      {/* ── Metadata strip ── */}
      <div className="border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-[1200px] mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-0 md:divide-x" style={{ "--tw-divide-opacity": "1" } as React.CSSProperties}>
          <div className="md:pr-10">
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-muted)", marginBottom: "5px" }}>
              Kategori
            </p>
            <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>{c.category}</p>
          </div>
          <div className="md:px-10" style={{ borderColor: "var(--color-border)" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-muted)", marginBottom: "5px" }}>
              Kund
            </p>
            <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>{c.company}</p>
          </div>
          <div className="md:pl-10 col-span-2 md:col-span-1" style={{ borderColor: "var(--color-border)" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-muted)", marginBottom: "5px" }}>
              Case
            </p>
            <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>{c.index} av {cases.length}</p>
          </div>
        </div>
      </div>

      {/* ── Challenge + Solution ── */}
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Challenge */}
        <section className="pt-12 pb-14 md:pt-14 md:pb-16 border-b" style={{ borderColor: "var(--color-border)" }}>
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-16 items-start">
            <div className="md:pt-1">
              <p
                style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-accent)" }}
              >
                Utmaningen
              </p>
            </div>
            <p
              className="font-medium leading-relaxed"
              style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", color: "var(--color-text)" }}
            >
              {c.challenge}
            </p>
          </div>
        </section>

        {/* Solution */}
        <section className="py-14 md:py-20 border-b" style={{ borderColor: "var(--color-border)" }}>
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-16 items-start">
            <div className="md:pt-1">
              <p
                style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-accent)" }}
              >
                Lösningen
              </p>
            </div>
            <div>
              <p
                className="font-medium leading-relaxed mb-10"
                style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", color: "var(--color-text)" }}
              >
                {c.solution}
              </p>

              {/* Steps */}
              <div className="flex flex-col">
                {c.steps.map((step, i) => (
                  <div
                    key={i}
                    className="flex gap-6 py-5 border-t"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <span
                      className="font-display shrink-0"
                      style={{ fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.1em", color: "var(--color-accent)", paddingTop: "2px", minWidth: "26px" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p
                        className="font-semibold mb-1.5"
                        style={{ fontSize: "1rem", color: "var(--color-text)", lineHeight: 1.3 }}
                      >
                        {step.label}
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--color-text-body)" }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Metrics band ── */}
      <section className="relative overflow-hidden" style={{ background: "#1B0803" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: GRAIN, backgroundSize: "160px 160px", mixBlendMode: "screen", opacity: 0.055 }}
        />
        <div className="relative max-w-[1200px] mx-auto px-6 py-16 md:py-24">
          <p
            className="mb-12 md:mb-16"
            style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}
          >
            Resultat
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {c.metrics.map((m, i) => (
              <div
                key={i}
                className={i > 0 ? "md:pl-12" : ""}
                style={i > 0 ? { borderLeft: "1px solid rgba(255,255,255,0.10)" } : undefined}
              >
                <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                  <span
                    className="font-display text-white"
                    style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}
                  >
                    {m.value}
                  </span>
                  <span
                    className="font-display"
                    style={{ fontSize: "clamp(0.7rem, 1.1vw, 0.85rem)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.40)" }}
                  >
                    {m.unit}
                  </span>
                </div>
                <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.50)" }}>
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      {c.testimonial && (
        <div className="max-w-[1200px] mx-auto px-6 py-14 md:py-20 border-b" style={{ borderColor: "var(--color-border)" }}>
          <figure
            className="rounded-2xl p-8 md:p-10"
            style={{ background: "var(--color-card-bg)", maxWidth: "680px", border: "1px solid var(--color-border)" }}
          >
            <blockquote>
              <p
                className="font-medium italic leading-relaxed mb-8"
                style={{ fontSize: "clamp(1.05rem, 1.8vw, 1.35rem)", color: "var(--color-text)" }}
              >
                &ldquo;{c.testimonial.quote}&rdquo;
              </p>
            </blockquote>
            <figcaption className="flex items-center gap-4">
              <div
                className="shrink-0"
                style={{ width: "2px", height: "32px", background: "var(--color-accent)" }}
              />
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                  {c.testimonial.name}
                </p>
                <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                  {c.testimonial.role}
                </p>
              </div>
            </figcaption>
          </figure>
        </div>
      )}

      {/* ── Back / Next ── */}
      <div className="border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-[1200px] mx-auto px-6 py-10 flex items-center justify-between">
          <Link
            href="/case"
            className="inline-flex items-center gap-2 transition-colors duration-200 text-[var(--color-text-body)] hover:text-[var(--color-text)]"
            style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M8.5 1.5L3.5 6.5l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Alla case
          </Link>

          {nextCase && (
            <Link
              href={`/case/${nextCase.slug}`}
              className="inline-flex items-center gap-3 transition-colors duration-200 text-[var(--color-text-body)] hover:text-[var(--color-text)] text-right"
              style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}
            >
              <span className="flex flex-col items-end gap-0.5">
                <span style={{ color: "var(--color-muted)", fontWeight: 600 }}>Nästa case</span>
                <span style={{ color: "inherit" }}>{nextCase.company}</span>
              </span>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M4.5 1.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
        </div>
      </div>

    </div>
  );
}
