const cards = [
  {
    title: "Byggt för drift",
    body: "Varje automation inkluderar monitoring och fallback. Inget stannar utan att vi vet om det.",
  },
  {
    title: "Pilot-first",
    body: "Vi startar smalt och itererar snabbt. Ni ser värde inom veckor, inte månader.",
  },
  {
    title: "Tydlig kommunikation",
    body: "Ingen hype, inga buzzwords. Ni vet alltid vad som händer och varför.",
  },
  {
    title: "Svensk leverans",
    body: "Vi är baserade i Sverige och pratar svenska — support och drift på era villkor.",
  },
];

export default function WhyKhyte() {
  return (
    <section className="pt-[var(--spacing-section)] pb-[var(--spacing-section)]">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)] leading-[1.2] tracking-[-0.02em] mb-4">
          Automatisering byggd för drift — inte demo
        </h2>
        <p className="text-base font-medium text-[var(--color-text)] leading-[1.5] max-w-[56ch]">
          Vi levererar system som faktiskt håller — inte pilotprojekt som samlar damm.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <div
            key={card.title}
            className="bg-[var(--color-card-bg)] border border-[var(--color-border)] [border-width:var(--border-width)] rounded-[var(--radius-sm)] p-8 transition-colors duration-200 hover:border-[var(--color-muted)]"
            /* revert: remove (card, i) → (card), remove transition-colors duration-200 hover:border-[var(--color-muted)] */
          >
            {/* revert: replace with <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] mb-4" /> */}
            <span className="text-2xl font-bold text-[var(--color-accent)] opacity-40 block mb-3" aria-hidden="true">0{i + 1}</span>
            <p className="font-semibold text-[var(--color-text)] text-lg mb-2"> {/* revert: text-base */}
              {card.title}
            </p>
            <p className="text-[var(--color-text-body)] text-sm leading-[1.6]">
              {card.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
