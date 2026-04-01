"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  r: number;
  speed: number;
  sway: number;
  phase: number;
  opBase: number;
  op: number;
  progress: number;
}

interface AmbientParticlesProps {
  /** Width of the canvas in px */
  width?: number;
  /** Height of the canvas in px */
  height?: number;
  /** Number of particles */
  count?: number;
  className?: string;
  /** RGB color bases e.g. ["212,98,43", "232,131,58"] */
  colors?: string[];
}

const WARM_COLORS = [
  "212,98,43",   // brand orange
  "232,131,58",  // accent orange
  "255,200,150", // warm highlight
];

const COOL_COLORS = [
  "220,220,225", // silver white
  "190,195,210", // cool grey
  "240,238,232", // near white warm
];

export default function AmbientParticles({
  width = 600,
  height = 600,
  count = 7,
  className = "",
  colors = WARM_COLORS,
}: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (shouldReduce) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Init particles scattered across the canvas
    particlesRef.current = Array.from({ length: count }, (_, i) => ({
      x: (width * (i + 0.5)) / count + (Math.random() - 0.5) * 80,
      y: height * 0.4 + Math.random() * height * 0.4,
      baseX: (width * (i + 0.5)) / count + (Math.random() - 0.5) * 80,
      baseY: height * 0.4 + Math.random() * height * 0.4,
      r: 1.2 + Math.random() * 1.4,
      speed: 14 + Math.random() * 18,
      sway: 4 + Math.random() * 7,
      phase: (i / count) * Math.PI * 2,
      opBase: 0.12 + Math.random() * 0.18,
      op: 0,
      progress: Math.random(), // stagger start
    }));

    let last = performance.now();

    const tick = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      tRef.current += delta;
      const T = tRef.current;

      ctx.clearRect(0, 0, width, height);

      for (const p of particlesRef.current) {
        p.progress += delta / p.speed;
        if (p.progress > 1) {
          // Reset — new random base position
          p.progress = 0;
          p.baseX = width * 0.15 + Math.random() * width * 0.7;
          p.baseY = height * 0.55 + Math.random() * height * 0.3;
          p.x = p.baseX;
          p.y = p.baseY;
        }

        // Rise upward with sine sway
        const traveled = p.progress * p.speed;
        p.x = p.baseX + Math.sin(T * 0.6 + p.phase) * p.sway;
        p.y = p.baseY - traveled * 6;

        // Fade in then out
        const fade = p.progress < 0.2
          ? p.progress / 0.2
          : p.progress > 0.7
          ? 1 - (p.progress - 0.7) / 0.3
          : 1;
        p.op = p.opBase * fade;

        const colorBase = colors[Math.floor(p.phase * 10) % colors.length];
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
        grad.addColorStop(0, `rgba(${colorBase},${p.op})`);
        grad.addColorStop(1, `rgba(${colorBase},0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [shouldReduce, width, height, count, colors]);

  if (shouldReduce) return null;

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      aria-hidden="true"
      className={className}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
