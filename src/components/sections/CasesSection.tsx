import Link from "next/link";

export default function CasesSection() {
  return (
    <section id="cases" className="section-border mb-[var(--spacing-section)]">
      <div className="max-w-[1100px] mx-auto px-6">
      {/* Header */}
      <div className="flex items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="font-display overflow-visible text-[2.5rem] md:text-[3.5rem] leading-[1.15] tracking-wide uppercase text-[var(--color-text)]">
            TA INTE BARA<br /><span style={{ color: "#D4622B" }}>VÅRT ORD.</span>
          </h2>
        </div>
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Card 1 — JaTack AB */}
        <Link
          href="/case/lead-engine"
          className="bg-[var(--color-card-bg)] rounded-2xl overflow-hidden flex flex-col"
        >
          <div
            aria-hidden="true"
            className="relative w-full aspect-[16/9] shrink-0 overflow-hidden"
          >
            <img
              src="/case-images/1.png"
              alt="JaTack AB x Khyte Automations"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between gap-8 p-8 md:p-10 flex-1">
            <div>
              <span className="font-mono text-[12px] text-[var(--color-muted)] tracking-[0.06em] uppercase mb-4 block">
                Automatiserad informationsförädling
              </span>
              <p className="text-[var(--color-text)] text-lg md:text-xl font-medium leading-[1.5] tracking-[-0.01em]">
                Hai har hjälpt mig att automatisera en del av min prospekteringsprocess genom att lyssna till mina behov. Nu kan jag jobba snabbare och effektivare, vilket skapar fler affärer!
              </p>
            </div>
            <div>
              <div className="h-px bg-[rgba(58,51,48,0.10)] mb-6" />
              <div className="flex items-center gap-4">
                <img
                  src="/sebastian.jpg"
                  alt="Sebastian Andersson"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover shrink-0"
                  style={{ objectPosition: "center top" }}
                />
                <div>
                  <p className="text-[15px] font-semibold text-[var(--color-text)] leading-[1.3]">Sebastian Andersson</p>
                  <p className="text-[14px] text-[var(--color-muted)] leading-[1.3]">Grundare, JaTack AB</p>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Card 2 — Osteopaticentrum */}
        <Link
          href="/case/osteopaticentrum"
          className="bg-[var(--color-card-bg)] rounded-2xl overflow-hidden flex flex-col"
        >
          <div
            aria-hidden="true"
            className="relative w-full aspect-[16/9] shrink-0 overflow-hidden"
          >
            <img
              src="/case-images/3.png"
              alt="Osteopaticentrum x Khyte Automations"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between gap-8 p-8 md:p-10 flex-1">
            <div>
              <span className="font-mono text-[12px] text-[var(--color-muted)] tracking-[0.06em] uppercase mb-4 block">
                Kunduppföljning & SMS
              </span>
              <p className="text-[var(--color-text)] text-lg md:text-xl font-medium leading-[1.5] tracking-[-0.01em]">
                Khyte har lyssnat på min verksamhets behov och skräddarsytt lösningen för att matcha dem. Jag är mycket nöjd med det professionella bemötande och utförandet!
              </p>
            </div>
            <div>
              <div className="h-px bg-[rgba(58,51,48,0.10)] mb-6" />
              <div className="flex items-center gap-4">
                <img
                  src="/mattiashietala.jpg"
                  alt="Mattias Hietala"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover shrink-0"
                  style={{ objectPosition: "center top" }}
                />
                <div>
                  <p className="text-[15px] font-semibold text-[var(--color-text)] leading-[1.3]">Mattias Hietala</p>
                  <p className="text-[14px] text-[var(--color-muted)] leading-[1.3]">Grundare, Osteopaticentrum</p>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Placeholder — "Läs mer" card */}
        <Link
          href="/case"
          className="group rounded-2xl p-8 md:p-10 flex flex-col items-center justify-center gap-5 text-center border-dashed border-[var(--color-border)] [border-width:var(--border-width)] hover:border-[var(--color-muted)] hover:bg-[var(--color-card-bg)] transition-all duration-300"
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

      </div>
    </section>
  );
}
