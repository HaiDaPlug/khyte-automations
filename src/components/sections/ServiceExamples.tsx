import Link from "next/link";
import ServiceScene from "@/components/scenes/ServiceScene";
import { exampleCaseHref, type ServiceData } from "@/data/services";

/**
 * The examples on an example-led service page, as a grid of cards: the
 * animated scene on top, then the situation, one or two sentences on what
 * changed, and a text link to the case. All of them are visible at once, so
 * the page reads as "here is the work" before anyone reads a paragraph.
 *
 * The scene only illustrates the card; it is never a link.
 *
 * Desktop (lg): two columns, scenes at a fixed 4:3 so the cards line up.
 * Below lg: one column, scenes as tall as their content.
 */

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ServiceExamples({ service }: { service: ServiceData }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-14 lg:grid-cols-2">
      {(service.examples ?? []).map((ex) => {
        const href = exampleCaseHref(service, ex);

        return (
          <li key={ex.title} className="flex flex-col">
            <ServiceScene id={ex.scene} />

            <div className="mt-6 flex flex-1 flex-col">
              {ex.tag && (
                <span
                  className={`mb-3 self-start rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-[0.05em] ${
                    ex.hypothetical
                      ? "border border-dashed border-[rgba(58,51,48,0.35)] text-[var(--color-text-body)]"
                      : "bg-[#D4622B]/10 text-[#B8521C]"
                  }`}
                >
                  {ex.tag}
                </span>
              )}

              <h3 className="text-xl md:text-2xl font-semibold tracking-[-0.02em] leading-[1.2] text-[var(--color-text)]">
                {ex.title}
              </h3>
              <p className="mt-3 max-w-[52ch] text-[15px] md:text-base font-medium leading-relaxed text-[var(--color-text-body)]">
                {ex.summary}
              </p>

              {href && ex.case && (
                <Link
                  href={href}
                  className="group mt-5 inline-flex items-center gap-2 self-start font-display text-sm font-bold tracking-[0.18em] uppercase text-[var(--color-text)] hover:text-[#D4622B] transition-colors duration-300"
                >
                  {ex.case.linkText}
                  <Arrow />
                </Link>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
