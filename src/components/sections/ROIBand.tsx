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
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen border-y border-[var(--color-border)] bg-[var(--color-card-bg)] mb-[var(--spacing-section)]">
      <div className="max-w-[1100px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        {stats.map((stat) => (
          <div key={stat.value}>
            <p className="text-4xl md:text-5xl font-bold text-[var(--color-text)] tracking-[-0.03em]">
              {stat.value}
            </p>
            <p className="text-[var(--color-text-body)] text-base mt-2">
              {stat.label}
            </p>
            <p className="text-[var(--color-muted)] text-xs mt-1">
              {stat.disclaimer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
