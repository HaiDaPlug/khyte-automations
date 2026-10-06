"use client";

import { useEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";
import type { ServiceArea } from "@/data/services";

/**
 * Small looping before → after line drawings for the "Vad vi löser" tiles.
 *
 * The motion lives in globals.css (`.area-ill`, keyframes area-gather / -appear /
 * -draw / -dim): one shared 7.5s cycle. Each element here only declares its role
 * (`data-a`), its offsets (`--dx`/`--dy`), its mid-cycle opacity (`--o`) and its
 * stagger. This component's only job is to pause the loop while the tile is off
 * screen, so nothing animates out of view. Deliberately not motion/react: the
 * site is JavaScript-bound on LCP, and CSS keyframes cost no JS at all.
 *
 * Translate/scale on SVG elements are in viewBox units.
 */

const MUTED = "var(--color-muted)";
const ACCENT = "#D4622B";

/** Drawings receive the tile's offset so the five loops don't pulse in unison. */
type DrawingProps = { t: number };

const a = (
  role: "gather" | "appear" | "draw" | "dim",
  delayMs: number,
  vars: { dx?: number; dy?: number; o?: number } = {},
) => ({
  "data-a": role,
  style: {
    animationDelay: `${delayMs}ms`,
    ...(vars.dx !== undefined && { "--dx": `${vars.dx}px` }),
    ...(vars.dy !== undefined && { "--dy": `${vars.dy}px` }),
    ...(vars.o !== undefined && { "--o": String(vars.o) }),
  } as CSSProperties,
});

/** Spreadsheet rows fold down into one summary row. */
function Excel({ t }: DrawingProps) {
  const rows = [10, 30, 50];
  const cells = [8, 66, 124, 182];
  return (
    <>
      {rows.map((y, i) => (
        <g key={y} {...a("gather", t + i * 120, { dy: 70 - y, o: 0 })}>
          {cells.map((x) => (
            <rect key={x} x={x} y={y} width={50} height={14} rx={2} stroke={MUTED} strokeWidth={1.5} />
          ))}
        </g>
      ))}
      {cells.map((x) => (
        <rect key={x} x={x} y={70} width={50} height={14} rx={2} stroke={MUTED} strokeWidth={1.5} />
      ))}
      <rect x={8} y={70} width={224} height={14} rx={2} fill={ACCENT} {...a("appear", t + 200)} />
    </>
  );
}

/** Five repeated steps collapse into one, done. */
function Steg({ t }: DrawingProps) {
  const xs = [24, 72, 120, 168, 216];
  return (
    <>
      {xs.slice(1).map((cx, i) => (
        <g key={cx} {...a("gather", t + (3 - i) * 90, { dx: 24 - cx, o: 0 })}>
          <rect x={cx - 39} y={47} width={30} height={2} fill={MUTED} />
          <circle cx={cx} cy={48} r={9} stroke={MUTED} strokeWidth={1.5} />
        </g>
      ))}
      <circle cx={24} cy={48} r={9} stroke={MUTED} strokeWidth={1.5} />
      <g {...a("appear", t + 250)}>
        <circle cx={24} cy={48} r={9} fill={ACCENT} />
        <path d="M19.5 48.5l3 3 6-6.5" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  );
}

/** Three tools with broken links between them get connected. */
function Verktyg({ t }: DrawingProps) {
  const boxes = [8, 92, 176];
  const gaps = [64, 148];
  return (
    <>
      {boxes.map((x) => (
        <g key={x}>
          <rect x={x} y={28} width={56} height={40} rx={6} stroke={MUTED} strokeWidth={1.5} />
          <rect x={x + 12} y={40} width={32} height={2} fill={MUTED} />
          <rect x={x + 12} y={50} width={20} height={2} fill={MUTED} />
        </g>
      ))}
      {gaps.map((x, i) => (
        <g key={x}>
          <line
            x1={x} y1={48} x2={x + 28} y2={48} stroke={MUTED} strokeWidth={1.5} strokeDasharray="3 4"
            {...a("dim", t + i * 300, { o: 0 })}
          />
          <rect x={x} y={47} width={28} height={2.5} fill={ACCENT} {...a("draw", t + i * 300)} />
        </g>
      ))}
    </>
  );
}

/** Scattered pieces gather into one place. */
function System({ t }: DrawingProps) {
  const pieces: [number, number, number, number][] = [
    // [x, y, targetX, targetY]
    [18, 22, 168, 32],
    [52, 64, 189, 32],
    [30, 82, 210, 32],
    [78, 30, 168, 50],
    [96, 72, 189, 50],
    [64, 12, 210, 50],
    [110, 46, 189, 68],
  ];
  return (
    <>
      <rect x={150} y={14} width={78} height={70} rx={8} stroke={MUTED} strokeWidth={1.5} />
      {pieces.map(([x, y, tx, ty], i) => (
        <circle key={i} cx={x} cy={y} r={4} fill={MUTED} {...a("gather", t + i * 80, { dx: tx - x, dy: ty - y, o: 1 })} />
      ))}
      <rect
        x={150} y={14} width={78} height={70} rx={8} stroke={ACCENT} strokeWidth={2}
        {...a("appear", t + 450)}
      />
    </>
  );
}

/** One path forks three ways; advice picks the one worth taking. */
function Radgivning({ t }: DrawingProps) {
  const ends = [14, 48, 82];
  return (
    <>
      <rect x={8} y={47} width={72} height={2} fill={MUTED} />
      <circle cx={82} cy={48} r={4} fill={MUTED} />
      {ends.map((y) => (
        <g key={y} {...(y === 48 ? {} : a("dim", t, { o: 0.25 }))}>
          <line x1={86} y1={48} x2={222} y2={y} stroke={MUTED} strokeWidth={1.5} />
          <circle cx={228} cy={y} r={5} stroke={MUTED} strokeWidth={1.5} />
        </g>
      ))}
      <rect x={86} y={47} width={136} height={2.5} fill={ACCENT} {...a("draw", t + 150)} />
      <circle cx={228} cy={48} r={5} fill={ACCENT} {...a("appear", t + 400)} />
    </>
  );
}

const DRAWINGS: Record<ServiceArea["id"], ComponentType<DrawingProps>> = {
  excel: Excel,
  steg: Steg,
  verktyg: Verktyg,
  system: System,
  radgivning: Radgivning,
};

export default function AreaIllustration({
  id,
  offsetMs = 0,
}: {
  id: ServiceArea["id"];
  /** Phase offset for this tile's loop. */
  offsetMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  // Run the loop only while the tile is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOn(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Drawing = DRAWINGS[id];

  return (
    <div ref={ref} data-on={on} className="area-ill h-24 w-full max-w-[240px]" aria-hidden="true">
      <svg viewBox="0 0 240 96" fill="none" className="h-full w-full overflow-visible">
        <Drawing t={offsetMs} />
      </svg>
    </div>
  );
}
