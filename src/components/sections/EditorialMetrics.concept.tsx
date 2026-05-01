"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, motion, useReducedMotion } from "motion/react";

const metrics = [
  { value: 15,  suffix: "h",  label: "Sparad administrativ tid per vecka" },
  { value: 80,  suffix: "%",  label: "Kortare svarstid på kundärenden" },
  { value: 0,   suffix: "",   label: "Glömda fakturor eller tappade leads" },
];

function CountUp({ to, suffix, active }: { to: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!active || prefersReduced) { setCount(to); return; }
    if (to === 0) { setCount(0); return; }

    const duration = 1400;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, to, prefersReduced]);

  return <span>{count}{suffix}</span>;
}

export default function EditorialMetrics() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} className="w-full relative overflow-hidden bg-[#1B0803]">

      {/* Gradient — exact base-band recipe */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 70% 55% at 12% 18%, rgba(212,82,28,0.38) 0%, rgba(160,52,18,0.18) 45%, rgba(160,52,18,0) 100%)",
            "radial-gradient(ellipse 55% 60% at 88% 35%, rgba(180,64,20,0.22) 0%, rgba(140,44,14,0.10) 50%, rgba(140,44,14,0) 100%)",
            "radial-gradient(ellipse 80% 45% at 50% 100%, rgba(194,78,30,0.32) 0%, rgba(140,48,16,0.14) 55%, rgba(140,48,16,0) 100%)",
            "radial-gradient(ellipse 45% 50% at 28% 62%, rgba(90,22,8,0.45) 0%, rgba(90,22,8,0) 100%)",
            "radial-gradient(ellipse 40% 30% at 82% 8%, rgba(220,100,40,0.12) 0%, rgba(220,100,40,0) 100%)",
            "linear-gradient(160deg, #0E0401 0%, #1B0803 40%, #1F0904 70%, #2A0D06 100%)",
          ].join(", "),
        }}
      />
      {/* Grain — noise.webp tile, matches base-band */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/noise.webp')",
          backgroundSize: "128px 128px",
          backgroundRepeat: "repeat",
          opacity: 0.055,
          mixBlendMode: "screen",
        }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left — headline */}
          <div className="lg:pt-8">
            <h2 className="text-[2.8rem] md:text-[3.6rem] font-semibold text-white leading-none tracking-[-0.035em]">
              Vi mäter framgång i frigjord tid.
            </h2>
            <p className="mt-6 text-base text-white/60 leading-[1.65] max-w-[38ch]">
              Automatisering utan mätbara resultat är bara teknik för teknikens skull. Vi sätter alltid konkreta mål innan vi bygger.
            </p>
          </div>

          {/* Right — scrolling metric rows */}
          <div className="flex flex-col">
            {metrics.map(({ value, suffix, label }, i) => (
              <motion.div
                key={label}
                className="border-t border-white/20 pt-8 pb-12 last:pb-2"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-[5.5rem] lg:text-[7rem] font-bold leading-none tracking-tight text-white tabular-nums">
                  <CountUp to={value} suffix={suffix} active={inView} />
                </p>
                <p className="mt-4 text-lg text-white/70 font-normal leading-[1.45]">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
