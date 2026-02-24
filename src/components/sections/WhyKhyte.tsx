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
    <section className="section-border mb-[var(--spacing-section)]">
      <div className="mb-10">
        <span className="text-label mb-3 block">Varför Khyte</span>
        <h2 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)] leading-[1.2] tracking-[-0.02em] mb-4">
          Automatisering byggd för drift — inte demo
        </h2>
        <p className="text-[var(--color-text-body)] text-base leading-[1.6] max-w-[56ch]">
          Vi levererar system som faktiskt håller — inte pilotprojekt som samlar damm.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] p-8"
          >
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] mb-4" />
            <p className="font-semibold text-[var(--color-text)] text-base mb-2">
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
