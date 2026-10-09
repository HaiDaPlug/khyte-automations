"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { SceneControl } from "@/components/scenes/SceneStage";

/**
 * The examples on an example-led service page, told one at a time as the
 * visitor scrolls.
 *
 * Desktop (lg): a tall track with a sticky panel. Left, the examples on a
 * connecting rail: the active one is expanded with its summary and case link,
 * the rest show only their title. Right, one large stage where the active
 * example's scene builds itself from the first step. Scroll progress through
 * the track picks the active example; clicking a title scrolls to it.
 *
 * Desktop scrolling snaps (gently, "proximity") to the middle of each
 * example's slice, so a stop in the section always lands on one example. The
 * snap points are the .snap-point markers in the track; see
 * [data-snap-track] in globals.css.
 *
 * Mobile: the same rail runs down the page, every example open, each with its
 * scene inline under the text.
 *
 * All text is in the server-rendered HTML; the stage and scenes only
 * illustrate it and are never links.
 */

export interface ScrollerExample {
  title: string;
  summary: string;
  tag?: string;
  hypothetical?: boolean;
  /** The case link, if the example comes from a delivered case. */
  link: { href: string; text: string } | null;
}

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const pad = (n: number) => String(n).padStart(2, "0");

export default function ExampleScroller({
  heading,
  examples,
  stageScenes,
  inlineScenes,
}: {
  heading: ReactNode;
  examples: ScrollerExample[];
  /** One scene per example, sized to fill the sticky stage (desktop). */
  stageScenes: ReactNode[];
  /** One scene per example, as an inline card (mobile). */
  inlineScenes: ReactNode[];
}) {
  const n = examples.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [desktop, setDesktop] = useState(false);

  // Where the sticky panel is in the track, as 0–1. The active example is the
  // slice of that range the visitor has scrolled to.
  const measure = useCallback(() => {
    const track = trackRef.current;
    const panel = panelRef.current;
    if (!track || !panel) return null;
    const top = parseFloat(getComputedStyle(panel).top) || 0;
    const rect = track.getBoundingClientRect();
    return { top, rect, range: rect.height - panel.offsetHeight };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    let frame = 0;

    const update = () => {
      frame = 0;
      setDesktop(mq.matches);
      if (!mq.matches) return;
      const m = measure();
      if (!m || m.range <= 0) return;
      const progress = Math.min(Math.max((m.top - m.rect.top) / m.range, 0), 0.9999);
      // --p drives the rail fill and the stage's progress line straight from
      // CSS, so following the scroll costs no re-render.
      trackRef.current?.style.setProperty("--p", String(progress));
      setActive(Math.floor(progress * n));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    mq.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mq.removeEventListener("change", schedule);
    };
  }, [measure, n]);

  /** Desktop: scroll to the middle of example i's slice. Mobile: bring it into view. */
  const go = (i: number) => {
    const m = measure();
    if (desktop && m && m.range > 0) {
      window.scrollTo({ top: window.scrollY + m.rect.top - m.top + (m.range * (i + 0.5)) / n });
    } else {
      itemRefs.current[i]?.scrollIntoView({ block: "start" });
    }
  };

  return (
    <>
      {heading && <div className="mb-10 lg:mb-4">{heading}</div>}

      {/* --slice: scroll per example. --panel: the sticky panel's height.
          --stick: where it sticks (clears the nav); the snap points use it too. */}
      <div
        ref={trackRef}
        data-snap-track
        className="relative lg:h-[calc(var(--n)*var(--slice))]"
        style={{ "--n": n, "--slice": "85vh", "--panel": "calc(100svh - 7rem)", "--stick": "6rem" } as CSSProperties}
      >
        {/* Snap points: the middle of each example's slice, where go() scrolls to. */}
        {examples.map((ex, i) => (
          <span
            key={ex.title}
            aria-hidden="true"
            className="snap-point pointer-events-none absolute left-0 hidden h-px w-px lg:block"
            style={{ top: `calc((var(--n) * var(--slice) - var(--panel)) * ${(i + 0.5) / n})` }}
          />
        ))}

        <div
          ref={panelRef}
          className="lg:sticky lg:top-[var(--stick)] lg:grid lg:h-[var(--panel)] lg:grid-cols-12 lg:items-center lg:gap-12"
        >
          <div className="lg:col-span-4">
            <ol>
              {examples.map((ex, i) => {
                const isActive = i === active;
                const done = i < active;
                return (
                  <li
                    key={ex.title}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    className="relative scroll-mt-28 pb-14 pl-10 last:pb-0 lg:pb-7"
                  >
                    {/* The rail: a segment down to the next example. On desktop it fills
                        with the scroll, so it reaches the next dot as that example opens. */}
                    {i < n - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute left-[7px] top-6 -bottom-1 w-[2px] overflow-hidden rounded-full bg-[rgba(58,51,48,0.14)]"
                      >
                        <span
                          className="hidden h-full w-full origin-top bg-[#D4622B] lg:block"
                          style={{ transform: `scaleY(clamp(0, calc(var(--p, 0) * var(--n) - ${i}), 1))` }}
                        />
                      </span>
                    )}
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-[0.3rem] h-4 w-4 rounded-full border-2 border-[#D4622B] bg-[#D4622B] transition-[background-color,border-color,box-shadow] duration-500 motion-reduce:transition-none ${
                        isActive
                          ? "lg:shadow-[0_0_0_5px_rgba(212,98,43,0.16)]"
                          : done
                            ? ""
                            : "lg:border-[rgba(58,51,48,0.3)] lg:bg-[var(--color-bg)]"
                      }`}
                    />

                    {ex.tag && (
                      <span
                        className={`mb-2 inline-block whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.05em] ${
                          ex.hypothetical
                            ? "border border-dashed border-[rgba(58,51,48,0.35)] text-[var(--color-text-body)]"
                            : "bg-[#D4622B]/10 text-[#B8521C]"
                        }`}
                      >
                        {ex.tag}
                      </span>
                    )}

                    <h3>
                      <button
                        type="button"
                        onClick={() => go(i)}
                        aria-current={desktop && isActive ? "step" : undefined}
                        className={`text-left text-xl font-semibold tracking-[-0.02em] leading-[1.25] transition-colors duration-300 hover:text-[#D4622B] text-[var(--color-text)] ${
                          isActive ? "" : "lg:text-[var(--color-text-body)]"
                        }`}
                      >
                        {ex.title}
                      </button>
                    </h3>

                    {/* Open on mobile; on desktop only the active example is. */}
                    <div
                      className={`grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
                        isActive ? "lg:grid-rows-[1fr]" : "lg:grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="pt-3 text-[15px] md:text-base font-medium leading-relaxed text-[var(--color-text-body)]">
                          {ex.summary}
                        </p>
                        {ex.link && (
                          <Link
                            href={ex.link.href}
                            tabIndex={desktop && !isActive ? -1 : undefined}
                            className="group mt-4 inline-flex items-center gap-2 font-display text-sm font-bold tracking-[0.18em] uppercase text-[var(--color-text)] hover:text-[#D4622B] transition-colors duration-300"
                          >
                            {ex.link.text}
                            <Arrow />
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 -ml-10 lg:hidden">{inlineScenes[i]}</div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* The stage: one window, the active example's scene building inside it. */}
          <div className="hidden lg:col-span-8 lg:flex lg:aspect-[4/3] lg:max-h-full lg:w-full lg:flex-col overflow-hidden rounded-2xl bg-[#1B1613] shadow-[0_30px_80px_-30px_rgba(27,22,19,0.55)]">
            <div aria-hidden="true" className="relative flex h-11 shrink-0 items-center gap-2 border-b border-white/[0.06] px-5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span
                className={`ml-auto flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/40 transition-opacity duration-500 ${
                  active < n - 1 ? "opacity-100" : "opacity-0"
                }`}
              >
                Scrolla
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="motion-safe:animate-bounce">
                  <path d="M6 2v7M3 6.5 6 9.5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="ml-4 font-display text-sm tracking-[0.18em] text-white/50">
                {pad(active + 1)} / {pad(n)}
              </span>
              {/* How far through the examples the visitor has scrolled. */}
              <span
                className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-[#D4622B]"
                style={{ transform: "scaleX(var(--p, 0))" }}
              />
            </div>
            <div className="relative flex-1">
              {stageScenes.map((scene, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${
                    i === active ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  <SceneControl.Provider value={{ active: i === active }}>{scene}</SceneControl.Provider>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
