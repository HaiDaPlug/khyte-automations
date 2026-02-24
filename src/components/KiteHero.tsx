"use client";

import { motion, useAnimationFrame, useMotionValue, useReducedMotion, type MotionValue } from "motion/react";
import { useRef, useEffect, useState } from "react";

type ParticleConfig = {
  x: MotionValue<number>; y: MotionValue<number>; o: MotionValue<number>;
  baseX: number; baseY: number; speed: number; sway: number; phase: number; opBase: number;
};

/**
 * KiteHero — animated kite illustration
 * Natural orientation: tip at top, wide belly at bottom, tail trails below
 *
 * SVG coordinate system (viewBox 0 0 400 560):
 *   Tip:   200, 60
 *   Left:  100, 220   ← spar crosses here
 *   Right: 300, 220
 *   Belly: 200, 400
 *
 * Tail hangs from belly (200,400), segments spaced ~38px apart downward.
 * Each segment has independent phase offset for organic wave.
 *
 * Environment layer:
 *   - Tether string: bezier from belly off-screen lower-left, sways with kite
 *   - Drop shadow: blurred silhouette offset +14/+18px, same motion.g
 *   - Ember particles: 5 dots rising upward with sine sway, looping fade
 */
export default function KiteHero() {
  const t = useRef(0);
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const particlesRef = useRef<ParticleConfig[] | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Kite body float
  const kiteY   = useMotionValue(0);
  const kiteRot = useMotionValue(0);

  // Each tail segment floats independently — phase cascades downward
  const t1y = useMotionValue(0); const t1x = useMotionValue(0);
  const t2y = useMotionValue(0); const t2x = useMotionValue(0);
  const t3y = useMotionValue(0); const t3x = useMotionValue(0);
  const t4y = useMotionValue(0); const t4x = useMotionValue(0);

  // Ember particle positions + opacity
  const p1x = useMotionValue(170); const p1y = useMotionValue(440); const p1o = useMotionValue(0);
  const p2x = useMotionValue(230); const p2y = useMotionValue(470); const p2o = useMotionValue(0);
  const p3x = useMotionValue(155); const p3y = useMotionValue(500); const p3o = useMotionValue(0);
  const p4x = useMotionValue(248); const p4y = useMotionValue(510); const p4o = useMotionValue(0);
  const p5x = useMotionValue(200); const p5y = useMotionValue(530); const p5o = useMotionValue(0);

  useEffect(() => {
    particlesRef.current = [
      { x: p1x, y: p1y, o: p1o, baseX: 170, baseY: 440, speed: 18, sway: 6,  phase: 0.0,  opBase: 0.30 },
      { x: p2x, y: p2y, o: p2o, baseX: 230, baseY: 470, speed: 22, sway: 8,  phase: 1.1,  opBase: 0.20 },
      { x: p3x, y: p3y, o: p3o, baseX: 155, baseY: 500, speed: 15, sway: 5,  phase: 2.3,  opBase: 0.38 },
      { x: p4x, y: p4y, o: p4o, baseX: 248, baseY: 510, speed: 27, sway: 9,  phase: 0.7,  opBase: 0.15 },
      { x: p5x, y: p5y, o: p5o, baseX: 200, baseY: 530, speed: 20, sway: 7,  phase: 1.8,  opBase: 0.25 },
    ];
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useAnimationFrame((_, delta) => {
    if (prefersReduced || !inView) return;
    t.current += delta / 1000;
    const T = t.current;

    // Kite: slow float + gentle tilt
    kiteY.set(Math.sin(T * 0.55) * 13);
    kiteRot.set(Math.sin(T * 0.38) * 3.2);

    // Tail: phase cascades so wave travels downward
    const SWAY = 2.2;
    const FLOAT_AMP = 13;
    const FLOAT_FREQ = 0.55;

    t1y.set(Math.sin(T * FLOAT_FREQ + 0.30) * FLOAT_AMP);
    t1x.set(Math.sin(T * SWAY + 0.30) * 9);

    t2y.set(Math.sin(T * FLOAT_FREQ + 0.65) * FLOAT_AMP);
    t2x.set(Math.sin(T * SWAY + 0.65) * 14);

    t3y.set(Math.sin(T * FLOAT_FREQ + 1.05) * FLOAT_AMP);
    t3x.set(Math.sin(T * SWAY + 1.05) * 18);

    t4y.set(Math.sin(T * FLOAT_FREQ + 1.50) * FLOAT_AMP);
    t4x.set(Math.sin(T * SWAY + 1.50) * 21);

    // Ember particles — each rises from its base, fades in, fades out, loops
    const particles = particlesRef.current;
    if (particles) {
      for (const p of particles) {
        const RISE = 480; // total pixels each particle travels before looping
        const progress = (T * p.speed + p.phase * 30) % RISE;
        p.y.set(p.baseY - progress);
        p.x.set(p.baseX + Math.sin(T * 0.9 + p.phase) * p.sway);
        const fadeIn  = Math.min(progress / 80, 1);
        const fadeOut = 1 - Math.max(0, (progress - 360) / 120);
        p.o.set(p.opBase * fadeIn * fadeOut);
      }
    }
  });

  // Kite geometry constants
  const TIP    = { x: 200, y:  60 };
  const LEFT   = { x: 100, y: 220 };
  const RIGHT  = { x: 300, y: 220 };
  const BELLY  = { x: 200, y: 400 };
  const CENTER_Y = (TIP.y + BELLY.y) / 2; // rotation origin

  // Tail segments: anchor from BELLY, spaced downward
  const tailSegments = [
    { baseX: 194, baseY: 416, w: 12, h: 26, rx: 4, fill: "#E8833A", opacity: 0.90, tx: t1x, ty: t1y },
    { baseX: 192, baseY: 452, w: 16, h: 24, rx: 4, fill: "#D4622B", opacity: 0.72, tx: t2x, ty: t2y },
    { baseX: 190, baseY: 486, w: 20, h: 22, rx: 4, fill: "#C04010", opacity: 0.52, tx: t3x, ty: t3y },
    { baseX: 188, baseY: 518, w: 24, h: 20, rx: 4, fill: "#9A2C0A", opacity: 0.30, tx: t4x, ty: t4y },
  ];

  // Ember particle render data
  const emberParticles = [
    { x: p1x, y: p1y, o: p1o, r: 3,   fill: "#F0803A" },
    { x: p2x, y: p2y, o: p2o, r: 2,   fill: "#E8833A" },
    { x: p3x, y: p3y, o: p3o, r: 2.5, fill: "#D4622B" },
    { x: p4x, y: p4y, o: p4o, r: 2,   fill: "#F0803A" },
    { x: p5x, y: p5y, o: p5o, r: 3.5, fill: "#E8833A" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative select-none"
      style={{
        width: "100%",
        maxWidth: 400,
        aspectRatio: "3 / 4",
      }}
      aria-hidden="true"
    >
      {/* SVG — natural coordinates, no transform on root */}
      <svg
        viewBox="0 0 400 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          {/* Face A: tip→left upper triangle */}
          <linearGradient id="kFA" x1={TIP.x} y1={TIP.y} x2={LEFT.x} y2={LEFT.y} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F0803A" />
            <stop offset="100%" stopColor="#C04010" />
          </linearGradient>
          {/* Face B: tip→right upper triangle */}
          <linearGradient id="kFB" x1={TIP.x} y1={TIP.y} x2={RIGHT.x} y2={RIGHT.y} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E0701E" />
            <stop offset="100%" stopColor="#A83010" />
          </linearGradient>
          {/* Face C: left→belly lower triangle */}
          <linearGradient id="kFC" x1={LEFT.x} y1={LEFT.y} x2={BELLY.x} y2={BELLY.y} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C84818" />
            <stop offset="100%" stopColor="#7A1E06" />
          </linearGradient>
          {/* Face D: right→belly lower triangle */}
          <linearGradient id="kFD" x1={RIGHT.x} y1={RIGHT.y} x2={BELLY.x} y2={BELLY.y} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#B83A10" />
            <stop offset="100%" stopColor="#6A1808" />
          </linearGradient>
          {/* Spine: tip bright → belly dark */}
          <linearGradient id="kSP" x1={TIP.x} y1={TIP.y} x2={BELLY.x} y2={BELLY.y} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </linearGradient>
        </defs>

        {/* ── TAIL — each segment independent, no shared group ── */}
        {tailSegments.map((seg, i) => (
          <motion.rect
            key={i}
            x={seg.baseX}
            y={seg.baseY}
            width={seg.w}
            height={seg.h}
            rx={seg.rx}
            fill={seg.fill}
            opacity={seg.opacity}
            style={{ x: seg.tx, y: seg.ty }}
          />
        ))}

        {/* ── EMBER PARTICLES — rise upward, looping fade ── */}
        {emberParticles.map((p, i) => (
          <motion.circle
            key={i}
            cx={0}
            cy={0}
            r={p.r}
            fill={p.fill}
            style={{ x: p.x, y: p.y, opacity: p.o }}
          />
        ))}

        {/* ── SHADOW — offset diamond behind kite, no filter ── */}
        <motion.g
          style={{
            y: kiteY,
            rotate: kiteRot,
            originX: `${TIP.x}px`,
            originY: `${CENTER_Y}px`,
          }}
        >
          <path
            d={`M ${TIP.x + 14} ${TIP.y + 22} L ${LEFT.x + 14} ${LEFT.y + 22} L ${BELLY.x + 14} ${BELLY.y + 22} L ${RIGHT.x + 14} ${RIGHT.y + 22} Z`}
            fill="rgba(0,0,0,0.30)"
            opacity={0.6}
          />
        </motion.g>

        {/* ── KITE BODY + STRING ── */}
        <motion.g
          style={{
            y: kiteY,
            rotate: kiteRot,
            originX: `${TIP.x}px`,
            originY: `${CENTER_Y}px`,
          }}
        >

          {/* Upper-left face: tip → left → center-cross */}
          <path
            d={`M ${TIP.x} ${TIP.y} L ${LEFT.x} ${LEFT.y} L ${TIP.x} ${LEFT.y} Z`}
            fill="url(#kFA)"
          />
          {/* Upper-right face: tip → right → center-cross */}
          <path
            d={`M ${TIP.x} ${TIP.y} L ${RIGHT.x} ${RIGHT.y} L ${TIP.x} ${RIGHT.y} Z`}
            fill="url(#kFB)"
          />
          {/* Lower-left face: left → belly → center-cross */}
          <path
            d={`M ${LEFT.x} ${LEFT.y} L ${BELLY.x} ${BELLY.y} L ${TIP.x} ${LEFT.y} Z`}
            fill="url(#kFC)"
          />
          {/* Lower-right face: right → belly → center-cross */}
          <path
            d={`M ${RIGHT.x} ${RIGHT.y} L ${BELLY.x} ${BELLY.y} L ${TIP.x} ${RIGHT.y} Z`}
            fill="url(#kFD)"
          />

          {/* Outline */}
          <path
            d={`M ${TIP.x} ${TIP.y} L ${LEFT.x} ${LEFT.y} L ${BELLY.x} ${BELLY.y} L ${RIGHT.x} ${RIGHT.y} Z`}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.2"
          />

          {/* Spine */}
          <line
            x1={TIP.x} y1={TIP.y} x2={BELLY.x} y2={BELLY.y}
            stroke="url(#kSP)"
            strokeWidth="1.8"
          />

          {/* Spar */}
          <line
            x1={LEFT.x} y1={LEFT.y} x2={RIGHT.x} y2={RIGHT.y}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.4"
          />

          {/* Intersection dots */}
          <circle cx={TIP.x}   cy={LEFT.y}  r={4} fill="rgba(255,255,255,0.55)" />
          <circle cx={TIP.x}   cy={TIP.y}   r={3} fill="rgba(255,255,255,0.45)" />
          <circle cx={LEFT.x}  cy={LEFT.y}  r={3} fill="rgba(255,255,255,0.26)" />
          <circle cx={RIGHT.x} cy={RIGHT.y} r={3} fill="rgba(255,255,255,0.26)" />
          <circle cx={BELLY.x} cy={BELLY.y} r={3} fill="rgba(255,255,255,0.18)" />

          {/* Gloss — upper-left face */}
          <path
            d={`M ${TIP.x} ${TIP.y} L ${LEFT.x + 15} ${LEFT.y - 18} L ${TIP.x} ${LEFT.y - 10} Z`}
            fill="rgba(255,255,255,0.07)"
          />

          {/* Tether string — sags from belly off-screen lower-left, sways with kite */}
          <path
            d={`M ${BELLY.x} ${BELLY.y} C 170 480 80 550 -40 620`}
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="4 6"
          />
        </motion.g>
      </svg>
    </div>
  );
}
