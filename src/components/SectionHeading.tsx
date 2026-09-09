import { ReactNode } from "react";

/**
 * Section heading — the h2 counterpart to PageHeader, same Bebas treatment
 * one step down in scale.
 *
 * Like PageHeader, fontWeight / lineHeight are inline: globals.css sets
 * `.font-display { font-weight: 800; line-height: 1.15 }`, which beats
 * `font-*` and `leading-*` utilities on source order. Bebas ships only
 * weight 400, so 800 is a synthesised faux-bold — the weight comes back
 * via -webkit-text-stroke, which thickens the real outline evenly.
 */
export default function SectionHeading({
  line1,
  line2,
  intro,
  tone = "light",
  className = "",
}: {
  line1: string;
  line2: string;
  intro?: ReactNode;
  /** "dark" for headings sitting on the espresso band. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const isDark = tone === "dark";

  return (
    <div className={className}>
      <h2
        style={{ fontWeight: 400, lineHeight: 0.95, WebkitTextStroke: "0.02em currentColor" }}
        className={`font-display overflow-visible text-[42px] md:text-[52px] tracking-[0.02em] uppercase ${
          isDark ? "text-white" : "text-[var(--color-text)]"
        }`}
      >
        {line1}
        <br />
        <span style={{ color: isDark ? "#E8833A" : "#D4622B" }}>{line2}</span>
      </h2>
      {intro && (
        <p
          className={`text-base font-medium leading-[1.5] mt-3 max-w-[52ch] ${
            isDark ? "text-white/70" : "text-[var(--color-text)]"
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
