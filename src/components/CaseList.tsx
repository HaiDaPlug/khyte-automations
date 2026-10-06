import Link from "next/link";
import type { CaseData } from "@/data/cases";

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * One row per case (number, company, what was built, arrow), each linking to
 * the case page. Used on /tjanster for every case and on service pages for the
 * cases behind that service.
 *
 * Rows are numbered by position in this list, not by the case's own index, so
 * a service page showing three cases reads 01–03 rather than 02–04.
 *
 * Mobile: number, name and arrow on the first row, the description beneath.
 */
export default function CaseList({ items }: { items: CaseData[] }) {
  return (
    <ul className="border-t border-[var(--color-border)]">
      {items.map((c, i) => (
        <li key={c.slug} className="border-b border-[var(--color-border)]">
          <Link
            href={`/case/${c.slug}`}
            className="group grid grid-cols-[2.75rem_1fr_auto] md:grid-cols-[3.5rem_13rem_1fr_auto] lg:grid-cols-[4rem_16rem_1fr_auto] items-baseline gap-x-4 md:gap-x-8 gap-y-1 py-6 md:py-7"
          >
            <span className="col-start-1 row-start-1 font-display text-[1.75rem] leading-none tracking-wide text-[var(--color-accent)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="col-start-2 row-start-1 text-lg md:text-xl font-semibold tracking-[-0.02em] leading-[1.2] text-[var(--color-text)] transition-colors duration-300 group-hover:text-[#D4622B]">
              {c.company}
            </span>
            <span className="col-start-2 row-start-2 md:col-start-3 md:row-start-1 text-base font-medium leading-relaxed text-[var(--color-text-body)]">
              {c.problem}
            </span>
            <Arrow className="col-start-3 row-start-1 md:col-start-4 self-center text-[var(--color-text)] transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-[#D4622B]" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
