const rows = [
  {
    pain: "Manuell admin i mail och Sheets",
    outcome: "Automatiserade flöden som körs korrekt varje gång",
    sub: "Orderhantering, rapporter, påminnelser",
  },
  {
    pain: "Leads som blir liggande utan uppföljning",
    outcome: "Automatisk routing, uppföljning och påminnelser",
    sub: "CRM-integration, Slack-notiser, e-postsekvenser",
  },
  {
    pain: "Support som tar för lång tid",
    outcome: "Sortering, autosvar och rätt person direkt",
    sub: "Zendesk, Gmail, formulär",
  },
];

export default function PainOutcome() {
  return (
    <section className="py-24 md:py-32">
      <div className="mb-14">
        <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/60 mb-3 block">
          Vad vi löser
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold text-white leading-[1.15] tracking-[-0.02em] mb-4">
          Från manuellt kaos till automatiserat flöde
        </h2>
        <p className="text-white/70 text-base leading-[1.6] max-w-[56ch]">
          Vi tar bort flaskhalsarna som kostar tid varje dag — och bygger systemen som tar hand om dem åt er.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <div
            key={row.pain}
            className="bg-white/10 border border-white/15 rounded-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center">
              {/* Before */}
              <div className="px-8 py-7 md:py-8">
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/50 mb-2">
                  Idag
                </p>
                <p className="text-white/75 text-base md:text-lg leading-[1.4]">
                  {row.pain}
                </p>
              </div>

              {/* Arrow pivot */}
              <div className="hidden md:flex items-center justify-center px-2">
                <span
                  className="text-white/50 select-none"
                  style={{ fontSize: "22px", lineHeight: 1 }}
                  aria-hidden="true"
                >
                  →
                </span>
              </div>

              {/* After */}
              <div className="px-8 py-7 md:py-8 md:border-l border-t md:border-t-0 border-white/15 bg-white/10">
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white mb-2">
                  Med Khyte
                </p>
                <p className="text-white font-semibold text-base md:text-lg leading-[1.4] mb-1.5">
                  {row.outcome}
                </p>
                <p className="text-white/55 text-sm leading-[1.5]">
                  {row.sub}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
