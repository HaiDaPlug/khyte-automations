"use client";

import { useAnimationFrame, useMotionValue, motion, useReducedMotion } from "motion/react";
import { useRef } from "react";

/**
 * MistGradient — animated blob/mesh gradient hero background
 * Technique: large blurred orbs with mix-blend-mode:hard-light over dark espresso base
 * Each orb drifts on independent sine paths — slow, considered, premium
 * Khyte brand palette: burnt orange, deep amber, dark ember, muted rust
 */
export default function MistGradient() {
  const t = useRef(0);
  const prefersReduced = useReducedMotion();

  // Each orb: x and y MotionValues for GPU-composited drift
  const o1x = useMotionValue(30);  const o1y = useMotionValue(35);
  const o2x = useMotionValue(68);  const o2y = useMotionValue(55);
  const o3x = useMotionValue(50);  const o3y = useMotionValue(20);
  const o4x = useMotionValue(20);  const o4y = useMotionValue(70);
  const o5x = useMotionValue(78);  const o5y = useMotionValue(25);

  useAnimationFrame((_, delta) => {
    if (prefersReduced) return;
    t.current += delta / 1000;
    const T = t.current;

    // Slow, offset sine drift — amplitude in % of container
    o1x.set(30 + Math.sin(T * 0.18) * 12 + Math.sin(T * 0.07) * 6);
    o1y.set(35 + Math.sin(T * 0.14 + 1.0) * 14);

    o2x.set(68 + Math.sin(T * 0.13 + 2.1) * 10 + Math.sin(T * 0.09) * 5);
    o2y.set(55 + Math.sin(T * 0.17 + 0.5) * 16);

    o3x.set(50 + Math.sin(T * 0.22 + 3.5) * 18 + Math.sin(T * 0.06) * 7);
    o3y.set(20 + Math.sin(T * 0.11 + 1.8) * 20);

    o4x.set(20 + Math.sin(T * 0.16 + 0.8) * 14);
    o4y.set(70 + Math.sin(T * 0.20 + 2.7) * 12);

    o5x.set(78 + Math.sin(T * 0.12 + 4.2) * 9);
    o5y.set(25 + Math.sin(T * 0.19 + 1.3) * 18);
  });

  const orbs = [
    // Primary orange — dominant warm bloom, center-left
    { x: o1x, y: o1y, size: "70vw", color: "#C4501C", opacity: 0.90, blur: "100px" },
    // Deep amber — right side counterweight
    { x: o2x, y: o2y, size: "55vw", color: "#8B2E08", opacity: 0.85, blur: "90px"  },
    // Bright ember — upper accent, keeps crown alive
    { x: o3x, y: o3y, size: "50vw", color: "#E8733A", opacity: 0.70, blur: "110px" },
    // Dark rust — lower anchor, prevents it going too bright
    { x: o4x, y: o4y, size: "45vw", color: "#6A1A04", opacity: 0.95, blur: "80px"  },
    // Soft amber highlight — upper-right warmth
    { x: o5x, y: o5y, size: "40vw", color: "#D4622B", opacity: 0.65, blur: "95px"  },
  ];

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ background: "#1B0803", zIndex: -1 }}
    >
      {/* Blend layer — all orbs composite here with hard-light */}
      <div className="absolute inset-0" style={{ isolation: "isolate" }}>
        {orbs.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              background: orb.color,
              opacity: orb.opacity,
              filter: `blur(${orb.blur})`,
              mixBlendMode: "hard-light",
              // Position via left/top driven by MotionValues (%)
              left: orb.x,
              top: orb.y,
              x: "-50%",
              y: "-50%",
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* Top vignette — keeps nav area readable */}
      <div
        className="absolute inset-x-0 top-0 h-[35%] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(10,2,0,0.72) 0%, transparent 100%)",
        }}
      />

      {/* Bottom vignette */}
      <div
        className="absolute inset-x-0 bottom-0 h-[30%] pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(10,2,0,0.65) 0%, transparent 100%)",
        }}
      />

      {/* Edge bars — horizontal crush */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to right, rgba(10,2,0,0.55) 0%, transparent 14%, transparent 86%, rgba(10,2,0,0.48) 100%)",
        }}
      />

      {/* Grain overlay — matches existing SVG grain texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72 0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "220px 220px",
          opacity: 0.18,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}
