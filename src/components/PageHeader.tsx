import { ReactNode } from "react";

/**
 * Shared page header — the two-line Bebas display treatment used across
 * /tjanster, /case and /om-oss.
 *
 * `overflow-visible` matters: Bebas sits tight in its em box and the Swedish
 * ring/umlaut diacritics (Å, Ä, Ö) clip without it.
 *
 * Pass CTAs or anything else as children; they render under the intro.
 */
export default function PageHeader({
  line1,
  line2,
  intro,
  children,
  divider = false,
  oneLine = false,
  className = "",
}: {
  line1: string;
  line2: string;
  intro?: ReactNode;
  children?: ReactNode;
  /**
   * Rule under the header. Leave off where the following section already
   * draws its own `border-t` (as /tjanster does) — otherwise you get two.
   */
  divider?: boolean;
  /** Render both words on one line instead of stacking them. */
  oneLine?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`${divider ? "border-b border-[var(--color-border)] pb-10" : ""} ${className}`.trim()}
    >
      {/*
        fontWeight 400: globals.css sets `.font-display { font-weight: 800 }`, but
        Bebas Neue ships only 400 — 800 makes the browser synthesise a faux-bold,
        which smears horizontally. `.font-display` also sets line-height: 1.15,
        which likewise beats a `leading-*` utility — so lineHeight is set here too.
        Inline beats the class on source order.

        The weight comes back via -webkit-text-stroke instead: it thickens the
        real outline evenly on all sides, and being in em it scales with the
        font-size across breakpoints.
      */}
      <h1
        style={{ fontWeight: 400, lineHeight: 0.95, WebkitTextStroke: "0.02em currentColor" }}
        className="font-display overflow-visible text-[58px] md:text-[85px] tracking-[0.02em] uppercase text-[var(--color-text)]"
      >
        {line1}
        {oneLine ? " " : <br />}
        <span style={{ color: "#D4622B" }}>{line2}</span>
      </h1>
      {intro && (
        <p className="text-lg md:text-xl font-medium text-[var(--color-text-body)] leading-[1.5] mt-3 max-w-[52ch]">
          {intro}
        </p>
      )}
      {children}
    </div>
  );
}
