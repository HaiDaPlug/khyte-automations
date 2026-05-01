const FITS = [
    "Företag som fastnat i repetitiva processer och vill skala utan att anställa mer folk",
    "Team som är redo att äga sin egen lösning — ingen vendor lock-in",
    "Verksamheter som värderar hastighet och konkreta, mätbara resultat",
];

const NOT_FITS = [
    "Ni letar efter ett färdigt SaaS-system som löser allt direkt",
    "Ni har otydliga processer som ändras varje vecka",
    "Ni vill ha en evighetskonsult som bygger i år och förvaltar i decennier",
];

export default function FitCheck() {
    return (
        <div className="w-full py-24 md:py-32 px-6 md:px-16 xl:px-20">
            <div className="max-w-[1100px] mx-auto">

                {/* Centered eyebrow headline */}
                <p className="text-label text-[var(--color-muted)] text-center mb-16 md:mb-20">
                    Är vi rätt för varandra?
                </p>

                {/* Asymmetric 2-col grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">

                    {/* Left: floats natively on page bg — open, infinite */}
                    <div className="md:pt-2">
                        <p className="text-label text-[var(--color-accent)] mb-8">Passar för</p>
                        <ul className="flex flex-col gap-7">
                            {FITS.map((item) => (
                                <li key={item} className="flex items-start gap-4">
                                    <span
                                        aria-hidden="true"
                                        className="block mt-[10px] shrink-0 w-4 h-[2px] bg-[var(--color-accent)]"
                                    />
                                    <span className="text-base text-[var(--color-text-body)] leading-relaxed">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right: contained in a soft rounded card — polite footnote */}
                    <div
                        className="rounded-3xl p-10 lg:p-12"
                        style={{ background: "var(--color-card-bg)" }}
                    >
                        <p className="text-label text-[var(--color-muted)] mb-8">Passar inte om</p>
                        <ul className="flex flex-col gap-7">
                            {NOT_FITS.map((item) => (
                                <li key={item} className="flex items-start gap-4">
                                    <span
                                        aria-hidden="true"
                                        className="block mt-[10px] shrink-0 w-4 h-[2px] bg-[var(--color-muted)] opacity-40"
                                    />
                                    <span className="text-base text-[var(--color-text-body)] leading-relaxed opacity-65">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
}
