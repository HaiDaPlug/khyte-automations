import Link from "next/link";

export default function CasesSection() {
  return (
    <section className="section-border mb-[var(--spacing-section)]">
      {/* Header */}
      <div className="flex items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-label mb-3 block">Senaste projekt</span>
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)] leading-[1.2] tracking-[-0.02em]">
            Vad vi faktiskt levererat
          </h2>
        </div>
        <Link
          href="/cases"
          className="hidden sm:inline-flex shrink-0 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors underline underline-offset-4"
        >
          Se alla case →
        </Link>
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Testimonial card — image + quote + attribution */}
        <div className="bg-[var(--color-card-bg)] rounded-2xl overflow-hidden flex flex-col">
          {/* Image area — amber/caramel gradient texture matching brand warmth */}
          <div
            aria-hidden="true"
            className="relative w-full aspect-[16/9] shrink-0 overflow-hidden"
          >
            {/* Base: deep espresso → amber → warm cream — replicates the swirl photo palette */}
            <div
              className="absolute inset-0"
              style={{
                background: [
                  /* cream highlight, upper-right */
                  "radial-gradient(ellipse 55% 60% at 78% 18%, rgba(255,235,185,0.72) 0%, rgba(255,235,185,0) 65%)",
                  /* hot amber core, centre-left */
                  "radial-gradient(ellipse 70% 65% at 28% 52%, rgba(212,98,43,0.90) 0%, rgba(212,98,43,0) 62%)",
                  /* deep espresso shadow, lower-left corner */
                  "radial-gradient(ellipse 50% 55% at 8% 88%, rgba(27,8,3,0.88) 0%, rgba(27,8,3,0) 58%)",
                  /* warm gold sweep, top-left */
                  "radial-gradient(ellipse 60% 50% at 18% 10%, rgba(232,131,58,0.65) 0%, rgba(232,131,58,0) 60%)",
                  /* rich brown base */
                  "linear-gradient(145deg, #7A3A18 0%, #C46020 35%, #E8A050 58%, #F5D8A0 80%, #C87030 100%)",
                ].join(", "),
              }}
            />
            {/* Fine grain overlay for tactile depth */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.70' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23g)' opacity='0.18'/%3E%3C/svg%3E")`,
                backgroundSize: "160px 160px",
                mixBlendMode: "overlay",
              }}
            />

            {/* Collab lockup — stacked, centered, editorial scale */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                {/* Client name — large, Geist Sans, white */}
                <span
                  className="block leading-none whitespace-nowrap"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "32px",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "rgba(255,255,255,0.96)",
                    textShadow: "0 2px 24px rgba(0,0,0,0.45)",
                  }}
                >
                  JaTack AB
                </span>

                {/* × — recedes, generous spacing */}
                <span
                  className="block leading-none select-none"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "20px",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.45)",
                    textShadow: "0 1px 8px rgba(0,0,0,0.30)",
                  }}
                  aria-hidden="true"
                >
                  ×
                </span>

                {/* Khyte logo — tinted brand orange via CSS filter */}
                <img
                  src="/khyte-logo-text.svg"
                  alt="Khyte"
                  className="block w-auto"
                  style={{
                    height: "32px",
                    /*
                     * Filter chain: black source → brand orange #E8833A (HSL ~25°, 79%, 57%)
                     * brightness(0)        → force to black
                     * saturate(0)          → ensure greyscale
                     * invert(1)            → white
                     * sepia(1)             → warm sepia base (~#704214)
                     * saturate(4)          → punch saturation up toward vivid orange
                     * hue-rotate(340deg)   → shift sepia hue (~35°) back to 25° orange target
                     * brightness(1.15)     → lift to match L≈57%
                     */
                    filter:
                      "brightness(0) saturate(0) invert(1) sepia(1) saturate(4) hue-rotate(340deg) brightness(1.15) drop-shadow(0 2px 12px rgba(0,0,0,0.40))",
                    opacity: 0.97,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between gap-8 p-8 md:p-10 flex-1">
            <div>
              <span className="font-mono text-[12px] text-[var(--color-muted)] tracking-[0.06em] uppercase mb-4 block">
                Automatiserad informationsförädling
              </span>
              <p className="text-[var(--color-text)] text-lg md:text-xl font-medium leading-[1.5] tracking-[-0.01em]">
                Det här sparar oss minst ett par timmar varje dag. Vi kände direkt att det var byggt av folk som förstår hur vi jobbar.
              </p>
            </div>

            {/* Divider + attribution */}
            <div>
              <div className="h-px bg-[rgba(58,51,48,0.10)] mb-6" />
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[rgba(58,51,48,0.10)] flex items-center justify-center shrink-0">
                  <span className="text-[13px] font-semibold text-[var(--color-muted)]">K</span>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[var(--color-text)] leading-[1.3]">Kund</p>
                  <p className="text-[13px] text-[var(--color-muted)] leading-[1.3]">Ekonomiavdelningen</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder — "Läs mer" card */}
        <Link
          href="/cases"
          className="group rounded-2xl p-8 md:p-10 flex flex-col items-center justify-center gap-5 text-center border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-muted)] hover:bg-[var(--color-card-bg)] transition-all duration-300"
          style={{ minHeight: "100%" }}
        >
          <div className="w-11 h-11 rounded-full bg-[var(--color-card-bg)] group-hover:bg-[rgba(58,51,48,0.08)] flex items-center justify-center transition-colors duration-300">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3.5 9h11M10 4.5l4.5 4.5L10 13.5" stroke="var(--color-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-[var(--color-text)] font-semibold text-base mb-1">
              Läs mer om våra case
            </p>
            <p className="text-[var(--color-muted)] text-sm leading-[1.5]">
              Fler projekt och konkreta exempel på vad vi byggt
            </p>
          </div>
        </Link>

      </div>

      {/* Dot indicator */}
      <div className="flex items-center justify-center gap-2 mt-8">
        <div className="w-[6px] h-[6px] rounded-full bg-[var(--color-text)]" />
        <div className="w-[6px] h-[6px] rounded-full bg-[var(--color-border)]" />
      </div>

      {/* Mobile link */}
      <div className="sm:hidden text-center mt-6">
        <Link
          href="/cases"
          className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors underline underline-offset-4"
        >
          Se alla case →
        </Link>
      </div>
    </section>
  );
}
