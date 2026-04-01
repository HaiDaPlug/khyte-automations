const steps = [
  {
    num: "01.",
    title: "Kartläggning",
    body: "Vi går igenom era flöden och strategi. Vad som är manuellt, vart ni tappar tid och vad som går att automatisera så att ni får bra koll nu.",
  },
  {
    num: "02.",
    title: "Implementering",
    body: "Efter kartläggningen kommer det roliga. Vi implementerar snabbt och smalt med fokus på att det fungerar i verkligheten och håller.",
  },
  {
    num: "03.",
    title: "Support & förbättring",
    body: "Automationen är igång - men vi är kvar. Vi övervakar, justerar och förbättrar så att ni slipper jaga felen själva.",
  },
];

export default function ProcessSection() {
  return (
    <section className="bg-[var(--color-bg)] border-t border-[var(--color-border)] pt-12 pb-[var(--spacing-section)] px-6 md:px-12">

      {/* Split header */}
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
        <div>
          <span className="section-eyebrow">Och hur gör vi det?</span>
          <h2 className="font-display overflow-visible text-[3rem] md:text-[4.5rem] leading-[1.15] tracking-wide uppercase text-[var(--color-text)] -mt-1">
            TRE{" "}
            <span style={{ color: "#D4622B" }}>STEG.</span>
          </h2>
          <p className="text-base font-medium text-[var(--color-text)] mt-3 max-w-[34ch] leading-[1.5]">
            Ingen onödig process. Utan bindningstid.
          </p>
        </div>
        <div className="flex items-center mt-6 md:mt-0 shrink-0">
          <a
            href="/om-oss"
            className="font-display text-sm font-bold tracking-[0.18em] uppercase text-[var(--color-text)] hover:text-[#D4622B] transition-colors duration-300 flex items-center gap-2"
          >
            OM OSS
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* Grid with pipeline line */}
      <div className="relative max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Pipeline line — masked by card bg */}
        <div
          className="hidden md:block absolute w-full h-px left-0 z-0"
          style={{ top: "8.5rem", background: "var(--color-border)" }}
          aria-hidden="true"
        />

        {steps.map((step) => (
          <div
            key={step.num}
            className="relative z-10 flex flex-col p-10 md:p-12 rounded-[32px] shadow-none"
            style={{ background: "var(--color-bg)", border: "var(--border-width) solid var(--color-border)" }}
          >
            <span className="block font-display text-[4.5rem] leading-none tracking-wide text-[var(--color-accent)]">
              {step.num}
            </span>
            <h3 className="text-3xl font-bold text-black mt-8 mb-4">
              {step.title}
            </h3>
            <p className="text-neutral-800 text-lg leading-relaxed pr-4">
              {step.body}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}
