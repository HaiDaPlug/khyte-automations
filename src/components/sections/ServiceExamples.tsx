import Link from "next/link";
import ServiceScene from "@/components/scenes/ServiceScene";
import { exampleCaseHref, type ServiceData } from "@/data/services";

/**
 * The examples on an example-led service page: each one is the situation in
 * the buyer's words, how it was done before, what we built, and a text link to
 * the case. The scene beside it only illustrates the text; it is never a link.
 *
 * Before and after are told apart by their rule (muted vs. orange), not by
 * extra labels, so the text stays as short as the copy.
 *
 * Desktop: text and scene side by side, swapping sides on every other example.
 * Mobile: text first, then the scene.
 */

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ServiceExamples({ service }: { service: ServiceData }) {
  const examples = service.examples ?? [];

  return (
    <ol className="flex flex-col gap-16 md:gap-24">
      {examples.map((ex, i) => {
        const href = exampleCaseHref(service, ex);
        const flip = i % 2 === 1;

        return (
          <li key={ex.title} className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12">
            <div className={`md:col-span-5 md:row-start-1 ${flip ? "md:col-start-8" : "md:col-start-1"}`}>
              <span className="block font-display text-[2.5rem] leading-none tracking-wide text-[var(--color-accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>

              <p className="mt-5 flex flex-wrap items-center gap-2">
                {ex.hypothetical ? (
                  <span className="rounded-full border border-dashed border-[rgba(58,51,48,0.35)] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.05em] text-[var(--color-text-body)]">
                    {ex.label}
                  </span>
                ) : (
                  <span className="text-label">{ex.label}</span>
                )}
                {ex.tag && (
                  <span className="rounded-full bg-[#D4622B]/10 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.05em] text-[#B8521C]">
                    {ex.tag}
                  </span>
                )}
              </p>

              <h3 className="mt-3 text-2xl md:text-[1.75rem] font-semibold tracking-[-0.02em] leading-[1.15] text-[var(--color-text)]">
                {ex.title}
              </h3>

              <p className="mt-5 border-l-2 border-[rgba(58,51,48,0.18)] pl-4 text-[15px] md:text-base font-medium leading-relaxed text-[var(--color-text-body)]">
                {ex.before}
              </p>
              <p className="mt-4 border-l-2 border-[#D4622B] pl-4 text-[15px] md:text-base font-medium leading-relaxed text-[var(--color-text)]">
                {ex.after}
              </p>

              {href && ex.case && (
                <Link
                  href={href}
                  className="group mt-6 inline-flex items-center gap-2 font-display text-sm font-bold tracking-[0.18em] uppercase text-[var(--color-text)] hover:text-[#D4622B] transition-colors duration-300"
                >
                  {ex.case.linkText}
                  <Arrow />
                </Link>
              )}
            </div>

            <div className={`md:col-span-7 md:row-start-1 ${flip ? "md:col-start-1" : "md:col-start-6"}`}>
              <ServiceScene id={ex.scene} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
