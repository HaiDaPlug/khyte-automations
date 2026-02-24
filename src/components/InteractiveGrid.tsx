"use client";

import { useRef, useEffect, useCallback, RefObject } from "react";
import { useReducedMotion } from "motion/react";

/**
 * InteractiveGrid — proximity-responsive dot field
 * Canvas-based, zero DOM nodes per dot, 60fps.
 *
 * Mouse tracking is owned by the PARENT via containerRef so the canvas
 * can sit behind z-index overlays without losing pointer events.
 *
 * Palette: muted taupe at rest → brand orange (#E8833A) at cursor
 */

interface Dot {
  x: number;
  y: number;
  baseR: number;
  r: number;
  baseAlpha: number;
  alpha: number;
}

interface Props {
  /** Ref to the container element that owns mousemove/mouseleave */
  containerRef: RefObject<HTMLElement | null>;
  gap?: number;
  dotRadius?: number;
  maxScale?: number;
  influence?: number;
  className?: string;
}

export default function InteractiveGrid({
  containerRef,
  gap = 34,
  dotRadius = 2,
  maxScale = 5,
  influence = 130,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);
  const prefersReduced = useReducedMotion();

  const buildGrid = useCallback((w: number, h: number) => {
    const cols = Math.ceil(w / gap) + 1;
    const rows = Math.ceil(h / gap) + 1;
    const offsetX = (w - (cols - 1) * gap) / 2;
    const offsetY = (h - (rows - 1) * gap) / 2;
    const dots: Dot[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dots.push({
          x: offsetX + col * gap,
          y: offsetY + row * gap,
          baseR: dotRadius,
          r: dotRadius,
          baseAlpha: 0.20,
          alpha: 0.20,
        });
      }
    }
    dotsRef.current = dots;
  }, [gap, dotRadius]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Resize ──────────────────────────────────────────────────────────────
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = devicePixelRatio;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid(rect.width, rect.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // ── Mouse tracking on CONTAINER (sits above canvas in z-stack) ──────────
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const onLeave = () => { mouseRef.current = null; };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);

    // ── Draw loop ────────────────────────────────────────────────────────────
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const draw = () => {
      const w = canvas.width / devicePixelRatio;
      const h = canvas.height / devicePixelRatio;
      ctx.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;
      const dots = dotsRef.current;
      const speed = prefersReduced ? 1 : 0.11;

      for (const dot of dots) {
        let targetR = dot.baseR;
        let targetAlpha = dot.baseAlpha;

        if (mouse && !prefersReduced) {
          const dx = dot.x - mouse.x;
          const dy = dot.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < influence) {
            const t = 1 - dist / influence;
            const eased = t * t * (3 - 2 * t); // smoothstep
            targetR = dot.baseR + dot.baseR * (maxScale - 1) * eased;
            targetAlpha = lerp(dot.baseAlpha, 0.88, eased);
          }
        }

        dot.r = lerp(dot.r, targetR, speed);
        dot.alpha = lerp(dot.alpha, targetAlpha, speed);

        // Colour lerp: taupe (#9C8E82) → orange (#E8833A)
        const tCol = Math.max(0, (dot.r - dot.baseR) / (dot.baseR * (maxScale - 1)));
        const r = Math.round(lerp(156, 232, tCol));
        const g = Math.round(lerp(142, 131, tCol));
        const b = Math.round(lerp(130, 58, tCol));

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${dot.alpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
    };
  }, [buildGrid, containerRef, influence, maxScale, prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
