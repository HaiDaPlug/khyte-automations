const cards = [
  {
    pain: "Manuell admin i mail och Sheets",
    outcome: "Automatiserade flöden som körs korrekt varje gång",
    sub: "e.g. orderhantering, rapporter, påminnelser",
  },
  {
    pain: "Leads som blir liggande utan uppföljning",
    outcome: "Automatisk routing, uppföljning och påminnelser",
    sub: "e.g. CRM-integration, Slack-notiser, e-postsekvenser",
  },
  {
    pain: "Support som tar för lång tid",
    outcome: "Sortering, autosvar och rätt person direkt",
    sub: "e.g. Zendesk, Gmail, formulär",
  },
];

export default function PainOutcome() {
  return (
    <section className="mb-[var(--spacing-section)]">
      <div className="mb-10">
        <span className="text-label mb-3 block">Vad vi löser</span>
        <h2 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)] leading-[1.2] tracking-[-0.02em] mb-4">
          Från manuellt kaos till automatiserat flöde
        </h2>
        <p className="text-[var(--color-text-body)] text-base leading-[1.6] max-w-[56ch]">
          Vi tar bort flaskhalsarna som kostar tid varje dag — och bygger systemen som tar hand om dem åt er.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.pain}
            className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] p-8 flex flex-col gap-4"
          >
            <p className="text-[var(--color-text)] font-medium text-base leading-[1.4]">
              {card.pain}
            </p>

            <div className="flex items-start gap-2">
              <span className="text-[var(--color-accent)] font-semibold leading-[1.4] shrink-0">→</span>
              <p className="text-[var(--color-text-body)] text-base leading-[1.4]">
                {card.outcome}
              </p>
            </div>

            <p className="text-[var(--color-muted)] text-sm leading-[1.5]">
              {card.sub}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
