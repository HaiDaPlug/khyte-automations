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
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mb-[var(--spacing-section)] isolate overflow-hidden">
      {/* Espresso base */}
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "#1B0803" }}
        aria-hidden="true"
      />
      {/* Warm orange glow — radiates from centre-bottom */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 120% at 50% 110%, rgba(212,98,43,0.55) 0%, rgba(212,98,43,0) 60%)",
        }}
      />
      {/* Subtle top highlight */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(244,241,239,0.07) 0%, rgba(244,241,239,0) 70%)",
        }}
      />

      <div className="max-w-[1100px] mx-auto px-6 py-20 md:py-24 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center md:text-left">
        {stats.map((stat, i) => (
          <div
            key={stat.value}
            className={
              i < stats.length - 1
                ? "md:border-r md:border-[rgba(244,241,239,0.10)] md:pr-8"
                : ""
            }
          >
            <p className="text-4xl md:text-5xl font-bold text-[#F4F1EF] tracking-[-0.03em] mb-2">
              {stat.value}
            </p>
            <p className="text-[rgba(244,241,239,0.75)] text-base mb-1">
              {stat.label}
            </p>
            <p className="text-[rgba(244,241,239,0.38)] text-xs">
              {stat.disclaimer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
