const stats = [
  {
    value: "10–40h",
    label: "sparas per månad",
    disclaimer: "Beror på process och volym",
  },
  {
    value: "Färre fel",
    label: "och mindre stress i vardagen",
    disclaimer: "Automatisering kör korrekt varje gång",
  },
  {
    value: "Kortare tid",
    label: "från lead till stängd affär",
    disclaimer: "Med rätt flöden på plats",
  },
];

export default function ROIBand() {
  return (
    <div className="w-full relative mb-[var(--spacing-section)] isolate overflow-hidden">
      {/* Warm amber gradient base — distinct from page bg but stays in warm palette */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background: [
            "radial-gradient(ellipse 70% 80% at 50% 120%, rgba(212,98,43,0.18) 0%, rgba(212,98,43,0) 65%)",
            "radial-gradient(ellipse 50% 60% at 15% 50%, rgba(232,131,58,0.10) 0%, rgba(232,131,58,0) 70%)",
            "radial-gradient(ellipse 50% 60% at 85% 50%, rgba(232,131,58,0.08) 0%, rgba(232,131,58,0) 70%)",
            "linear-gradient(180deg, #E8E0D4 0%, #DDD4C4 100%)",
          ].join(", "),
        }}
      />
      {/* Top + bottom hairlines */}
      <div className="absolute inset-x-0 top-0 h-px bg-[rgba(58,51,48,0.12)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[rgba(58,51,48,0.12)]" aria-hidden="true" />

      <div className="max-w-[1100px] mx-auto px-6 py-20 md:py-24 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 text-center md:text-left">
        {stats.map((stat, i) => (
          <div
            key={stat.value}
            className={[
              "md:px-10",
              i === 0 ? "md:pl-0" : "",
              i === stats.length - 1 ? "md:pr-0" : "",
              i < stats.length - 1
                ? "md:border-r md:border-[rgba(58,51,48,0.12)]"
                : "",
            ].join(" ")}
          >
            <p className="text-[2.5rem] md:text-[3.5rem] font-bold text-[var(--color-text)] tracking-[-0.03em] mb-2"> {/* revert: text-4xl md:text-5xl */}
              {stat.value}
            </p>
            {/* revert: remove this underline div */}
            <div className="w-10 h-[2px] bg-[var(--color-accent)] opacity-50 mt-3 mb-3 mx-auto md:mx-0" aria-hidden="true" />
            <p className="text-[var(--color-text-body)] text-base mb-1">
              {stat.label}
            </p>
            <p className="text-[var(--color-muted)] text-xs">
              {stat.disclaimer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
