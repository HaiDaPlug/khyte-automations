"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type Props = {
  /** Drar iväg uppåt och ut — spelas när besökaren trycker "Kör igång". */
  flyger?: boolean;
  className?: string;
};

/**
 * Draken från khyte.se — samma form, färger och rörelse, men byggd med
 * CSS-animationer i stället för JavaScript, så att den inte kostar något.
 *
 * Den svävar, svansen gungar, små partiklar driver förbi och linan rör sig
 * som i vind. På dator lutar den sig lätt mot muspekaren. Allt stängs av för
 * den som valt reducerad rörelse (se globals.css).
 */
export default function Drake({ flyger = false, className = "" }: Props) {
  const ytterRef = useRef<HTMLDivElement>(null);

  // Lutar sig mot pekaren. Bara med mus (hover), aldrig på touch, och inte
  // alls med reducerad rörelse.
  useEffect(() => {
    const ytter = ytterRef.current;
    if (!ytter) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ram = 0;
    function flytta(e: PointerEvent) {
      cancelAnimationFrame(ram);
      ram = requestAnimationFrame(() => {
        if (!ytter) return;
        const b = ytter.getBoundingClientRect();
        // -1 till 1 från drakens mitt, klämt så att den aldrig tippar över.
        const x = Math.max(-1, Math.min(1, (e.clientX - (b.left + b.width / 2)) / 500));
        const y = Math.max(-1, Math.min(1, (e.clientY - (b.top + b.height / 2)) / 500));
        ytter.style.setProperty("--k-luta-x", `${x * 10}px`);
        ytter.style.setProperty("--k-luta-y", `${y * 8}px`);
        ytter.style.setProperty("--k-luta-rot", `${x * 5}deg`);
      });
    }

    window.addEventListener("pointermove", flytta);
    return () => {
      window.removeEventListener("pointermove", flytta);
      cancelAnimationFrame(ram);
    };
  }, []);

  return (
    <div
      ref={ytterRef}
      aria-hidden="true"
      className={`k-drake ${flyger ? "k-drake-flyger" : ""} ${className}`}
    >
      {/* Intoningen ligger på svg:n, inte på yttre diven — annars skulle
          animationen låsa transformen som lutningen och avfärden använder. */}
      <svg viewBox="0 0 400 560" fill="none" className="k-drake-in h-full w-full overflow-visible">
        <defs>
          <linearGradient id="kFA" x1="200" y1="60" x2="100" y2="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F0803A" />
            <stop offset="100%" stopColor="#C04010" />
          </linearGradient>
          <linearGradient id="kFB" x1="200" y1="60" x2="300" y2="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E0701E" />
            <stop offset="100%" stopColor="#A83010" />
          </linearGradient>
          <linearGradient id="kFC" x1="100" y1="220" x2="200" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C84818" />
            <stop offset="100%" stopColor="#7A1E06" />
          </linearGradient>
          <linearGradient id="kFD" x1="300" y1="220" x2="200" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#B83A10" />
            <stop offset="100%" stopColor="#6A1808" />
          </linearGradient>
          <linearGradient id="kSP" x1="200" y1="60" x2="200" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </linearGradient>
        </defs>

        {/* Linan — ritas först så att den hamnar bakom allt annat. */}
        <g className="k-drake-kropp">
          <path
            className="k-drake-lina"
            d="M 200 400 C 170 480 80 550 -40 620"
            stroke="rgba(192,94,32,0.45)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="4 6"
          />
        </g>

        {/* Svansen: fyra rutor som gungar, allt mer ju längre ner. Den sitter
            fast i draken, så gruppen svävar med kroppen. */}
        <g className="k-drake-kropp">
          {[
            { x: 194, y: 416, w: 12, h: 26, fill: "#E8833A", op: 0.9 },
            { x: 192, y: 452, w: 16, h: 24, fill: "#D4622B", op: 0.72 },
            { x: 190, y: 486, w: 20, h: 22, fill: "#C04010", op: 0.52 },
            { x: 188, y: 518, w: 24, h: 20, fill: "#9A2C0A", op: 0.3 },
          ].map((r, i) => (
            <rect
              key={i}
              className="k-drake-svans"
              style={{ "--i": i } as CSSProperties}
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              rx="4"
              fill={r.fill}
              opacity={r.op}
            />
          ))}
        </g>

        {/* Små partiklar som driver uppåt från svansen. */}
        {[
          { x: 175, y: 440, r: 3, d: 0 },
          { x: 237, y: 430, r: 2, d: 1.4 },
          { x: 155, y: 425, r: 2.5, d: 2.6 },
          { x: 257, y: 470, r: 2, d: 0.8 },
          { x: 210, y: 470, r: 3.5, d: 3.4 },
        ].map((p, i) => (
          <circle
            key={i}
            className="k-drake-partikel"
            style={{ animationDelay: `${p.d}s` } as CSSProperties}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill={i % 2 ? "#E8833A" : "#F0803A"}
          />
        ))}

        {/* Skuggan följer med draken, förskjuten snett nedåt. */}
        <g className="k-drake-kropp">
          <path d="M 214 82 L 114 242 L 214 422 L 314 242 Z" fill="rgba(90,40,10,0.14)" />
        </g>

        {/* Själva draken: fyra facetter, ram, spröt och ledpunkter. */}
        <g className="k-drake-kropp">
          <path d="M 200 60 L 100 220 L 200 220 Z" fill="url(#kFA)" />
          <path d="M 200 60 L 300 220 L 200 220 Z" fill="url(#kFB)" />
          <path d="M 100 220 L 200 400 L 200 220 Z" fill="url(#kFC)" />
          <path d="M 300 220 L 200 400 L 200 220 Z" fill="url(#kFD)" />
          <path
            d="M 200 60 L 100 220 L 200 400 L 300 220 Z"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.2"
          />
          <line x1="200" y1="60" x2="200" y2="400" stroke="url(#kSP)" strokeWidth="1.8" />
          <line x1="100" y1="220" x2="300" y2="220" stroke="rgba(255,255,255,0.18)" strokeWidth="1.4" />
          <circle cx="200" cy="220" r="4" fill="rgba(255,255,255,0.55)" />
          <circle cx="200" cy="60" r="3" fill="rgba(255,255,255,0.45)" />
          <circle cx="100" cy="220" r="3" fill="rgba(255,255,255,0.26)" />
          <circle cx="300" cy="220" r="3" fill="rgba(255,255,255,0.26)" />
          <circle cx="200" cy="400" r="3" fill="rgba(255,255,255,0.18)" />
          {/* Ljusreflex på övre vänstra facetten. */}
          <path className="k-drake-glans" d="M 200 60 L 115 202 L 200 210 Z" fill="rgba(255,255,255,0.07)" />
        </g>
      </svg>
    </div>
  );
}
