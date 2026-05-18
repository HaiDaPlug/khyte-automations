"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

interface Particle {
  x: number; y: number;
  baseX: number; baseY: number;
  r: number; speed: number; sway: number;
  phase: number; opBase: number; op: number;
  progress: number;
  colorIdx: number;
}

interface AmbientParticlesProps {
  width?: number;
  height?: number;
  count?: number;
  className?: string;
  colors?: string[];
}

const WARM_COLORS = ["212,98,43", "232,131,58", "255,200,150"];

export default function AmbientParticles({
  width = 600,
  height = 600,
  count = 7,
  className = "",
  colors = WARM_COLORS,
}: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (shouldReduce) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Pre-bake one radial gradient sprite per color — reused every frame
    const SPRITE_R = 14; // px, generous so it looks soft
    const SPRITE_SIZE = SPRITE_R * 2;
    const sprites = colors.map((rgb) => {
      const oc = document.createElement("canvas");
      oc.width = SPRITE_SIZE;
      oc.height = SPRITE_SIZE;
      const octx = oc.getContext("2d")!;
      const grad = octx.createRadialGradient(SPRITE_R, SPRITE_R, 0, SPRITE_R, SPRITE_R, SPRITE_R);
      grad.addColorStop(0, `rgba(${rgb},1)`);
      grad.addColorStop(1, `rgba(${rgb},0)`);
      octx.beginPath();
      octx.arc(SPRITE_R, SPRITE_R, SPRITE_R, 0, Math.PI * 2);
      octx.fillStyle = grad;
      octx.fill();
      return oc;
    });

    const particles: Particle[] = Array.from({ length: count }, (_, i) => ({
      x:        (width * (i + 0.5)) / count + (Math.random() - 0.5) * 80,
      y:        height * 0.4 + Math.random() * height * 0.4,
      baseX:    (width * (i + 0.5)) / count + (Math.random() - 0.5) * 80,
      baseY:    height * 0.4 + Math.random() * height * 0.4,
      r:        1.2 + Math.random() * 1.4,
      speed:    14 + Math.random() * 18,
      sway:     4 + Math.random() * 7,
      phase:    (i / count) * Math.PI * 2,
      opBase:   0.12 + Math.random() * 0.18,
      op:       0,
      progress: Math.random(),
      colorIdx: i % colors.length,
    }));

    let last = performance.now();
    let running = true;

    const tick = (now: number) => {
      if (!running) return;

      const delta = Math.min((now - last) / 1000, 0.05); // cap delta to avoid spike after tab switch
      last = now;
      tRef.current += delta;
      const T = tRef.current;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.progress += delta / p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          p.baseX = width * 0.15 + Math.random() * width * 0.7;
          p.baseY = height * 0.55 + Math.random() * height * 0.3;
        }

        const traveled = p.progress * p.speed;
        p.x = p.baseX + Math.sin(T * 0.6 + p.phase) * p.sway;
        p.y = p.baseY - traveled * 6;

        const fade = p.progress < 0.2
          ? p.progress / 0.2
          : p.progress > 0.7
          ? 1 - (p.progress - 0.7) / 0.3
          : 1;
        p.op = p.opBase * fade;

        // Stamp pre-baked sprite — no per-frame gradient allocation
        const scale = (p.r * 2.5) / SPRITE_R;
        const drawW = SPRITE_SIZE * scale;
        ctx.globalAlpha = p.op;
        ctx.drawImage(sprites[p.colorIdx], p.x - drawW / 2, p.y - drawW / 2, drawW, drawW);
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(tick);
    };

    // Use IntersectionObserver to fully cancel RAF when off-screen
    let lastVisible = performance.now();
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!running) {
          running = true;
          lastVisible = performance.now();
          last = lastVisible;
          rafRef.current = requestAnimationFrame(tick);
        }
      } else {
        running = false;
        cancelAnimationFrame(rafRef.current);
      }
    }, { threshold: 0 });

    observer.observe(canvas);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [shouldReduce, width, height, count, colors]); // eslint-disable-line react-hooks/exhaustive-deps

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
