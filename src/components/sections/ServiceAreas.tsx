import Link from "next/link";
import AreaIllustration from "@/components/AreaIllustration";
import CalendlyButton from "@/components/CalendlyButton";
import { facts } from "@/data/facts";
import { areaLink, serviceAreas, type ServiceArea } from "@/data/services";

/**
 * "Vad vi löser" on /tjanster: one tile per thing we solve, each a short line
 * plus a way in to the service page (or a case, until that page exists).
 *
 * Server component on purpose: link resolution reads cases.ts, which should
 * not ship to the browser. Only <AreaIllustration /> runs client-side.
 */

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TILE = "rounded-2xl bg-transparent p-8 lg:p-10 border border-[var(--color-border)]";

function Text({ area, linked }: { area: ServiceArea; linked: boolean }) {
  return (
    <div>
      {area.label && <p className="text-label mb-2">{area.label}</p>}
      <h3
        className={`text-lg md:text-xl font-semibold tracking-[-0.02em] text-[var(--color-text)] leading-[1.2] mb-3 ${
          linked ? "transition-colors duration-300 group-hover:text-[#D4622B]" : ""
        }`}
      >
        {area.title}
      </h3>
      <p className="text-[15px] font-medium text-[var(--color-text-body)] leading-relaxed max-w-[52ch]">
        {area.body}
      </p>
    </div>
  );
}

export default function ServiceAreas() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {serviceAreas.map((area, i) => {
        const link = areaLink(area);
        // Phase-shift each tile's loop so the grid moves as a slow wave.
        const offsetMs = i * 600;

        if (area.wide) {
          return (
            <div
              key={area.id}
              className={`${TILE} md:col-span-2 flex flex-col gap-8 md:grid md:grid-cols-[240px_1fr_auto] md:items-center md:gap-10`}
            >
              <AreaIllustration id={area.id} offsetMs={offsetMs} />
              <Text area={area} linked={false} />
              {area.bookIntro && (
                <CalendlyButton variant="secondary" className="self-start md:self-center">
                  Boka ett intro ({facts.introCall.minutes} min)
                </CalendlyButton>
              )}
            </div>
          );
        }

        const inner = (
          <>
            <AreaIllustration id={area.id} offsetMs={offsetMs} />
            <div className="mt-8 flex-1">
              <Text area={area} linked={!!link} />
            </div>
            {link && (
              <span className="mt-6 inline-flex items-center gap-2 font-display text-sm font-bold tracking-[0.18em] uppercase text-[var(--color-text)] transition-colors duration-300 group-hover:text-[#D4622B]">
                {link.label}
                <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            )}
          </>
        );

        return link ? (
          <Link
            key={area.id}
            href={link.href}
            className={`group ${TILE} flex flex-col transition-colors duration-300 hover:border-[rgba(58,51,48,0.52)]`}
          >
            {inner}
          </Link>
        ) : (
          <div key={area.id} className={`${TILE} flex flex-col`}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
