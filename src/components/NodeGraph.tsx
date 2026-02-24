"use client";

import { useRef, useEffect } from "react";
import { useReducedMotion } from "motion/react";

/**
 * NodeGraph — living automation node graph
 * Canvas-based. Zero DOM nodes per graph element.
 *
 * Nodes float slowly with independent sine phases.
 * Edges are bezier curves between nodes.
 * Packets travel along edges — one per edge, staggered offsets.
 * New connections occasionally form and fade in.
 *
 * Palette: dark glass card surface, orange accents, white/muted nodes
 */

// ─── Types ───────────────────────────────────────────────────────────────────

interface Node {
  id: number;
  // Resting position (centre of card, normalised 0–1)
  nx: number; ny: number;
  // Current canvas position (lerped from resting + sine float)
  x: number; y: number;
  // Float params
  floatAmpX: number; floatAmpY: number;
  floatPhaseX: number; floatPhaseY: number;
  floatFreqX: number; floatFreqY: number;
  // Visual
  r: number;          // radius px
  alpha: number;
  accent: boolean;    // orange vs white
  label: string;
}

interface Edge {
  from: number; to: number;
  // Packet state
  packetT: number;    // 0→1 progress along edge
  packetSpeed: number;
  packetPhase: number; // stagger start offset
  alpha: number;      // edge opacity (fades in on spawn)
}

// ─── Graph topology ──────────────────────────────────────────────────────────
// Positions are normalised (0–1) within the card.
// Layout: hub in centre, spokes radiating out, a few inter-spoke connections.

const NODE_DEFS: Omit<Node, "x" | "y">[] = [
  // Hub
  { id: 0, nx: 0.50, ny: 0.46, r: 10, alpha: 1,    accent: true,  label: "Khyte",    floatAmpX: 3,  floatAmpY: 4,  floatPhaseX: 0.0,  floatPhaseY: 0.4,  floatFreqX: 0.42, floatFreqY: 0.38 },
  // Inner ring
  { id: 1, nx: 0.22, ny: 0.28, r: 6,  alpha: 0.85, accent: false, label: "CRM",      floatAmpX: 5,  floatAmpY: 6,  floatPhaseX: 1.1,  floatPhaseY: 0.7,  floatFreqX: 0.55, floatFreqY: 0.48 },
  { id: 2, nx: 0.78, ny: 0.28, r: 6,  alpha: 0.85, accent: false, label: "Allabolag",floatAmpX: 4,  floatAmpY: 5,  floatPhaseX: 2.3,  floatPhaseY: 1.5,  floatFreqX: 0.50, floatFreqY: 0.44 },
  { id: 3, nx: 0.82, ny: 0.65, r: 6,  alpha: 0.85, accent: false, label: "Email",    floatAmpX: 5,  floatAmpY: 4,  floatPhaseX: 0.8,  floatPhaseY: 2.1,  floatFreqX: 0.46, floatFreqY: 0.52 },
  { id: 4, nx: 0.50, ny: 0.82, r: 6,  alpha: 0.85, accent: false, label: "Sheets",   floatAmpX: 6,  floatAmpY: 3,  floatPhaseX: 3.1,  floatPhaseY: 0.3,  floatFreqX: 0.53, floatFreqY: 0.40 },
  { id: 5, nx: 0.18, ny: 0.65, r: 6,  alpha: 0.85, accent: false, label: "Slack",    floatAmpX: 4,  floatAmpY: 6,  floatPhaseX: 1.7,  floatPhaseY: 1.0,  floatFreqX: 0.48, floatFreqY: 0.56 },
  // Outer
  { id: 6, nx: 0.14, ny: 0.44, r: 4,  alpha: 0.60, accent: true,  label: "AI",       floatAmpX: 7,  floatAmpY: 5,  floatPhaseX: 0.5,  floatPhaseY: 2.8,  floatFreqX: 0.60, floatFreqY: 0.44 },
  { id: 7, nx: 0.86, ny: 0.44, r: 4,  alpha: 0.60, accent: true,  label: "GPT",      floatAmpX: 6,  floatAmpY: 7,  floatPhaseX: 2.0,  floatPhaseY: 0.6,  floatFreqX: 0.58, floatFreqY: 0.50 },
  { id: 8, nx: 0.32, ny: 0.12, r: 4,  alpha: 0.55, accent: false, label: "Forms",    floatAmpX: 5,  floatAmpY: 4,  floatPhaseX: 1.4,  floatPhaseY: 1.9,  floatFreqX: 0.52, floatFreqY: 0.46 },
  { id: 9, nx: 0.68, ny: 0.12, r: 4,  alpha: 0.55, accent: false, label: "API",      floatAmpX: 4,  floatAmpY: 6,  floatPhaseX: 0.9,  floatPhaseY: 0.2,  floatFreqX: 0.56, floatFreqY: 0.42 },
];

const EDGE_DEFS: Pick<Edge, "from" | "to">[] = [
  // Hub spokes
  { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
  { from: 0, to: 4 }, { from: 0, to: 5 },
  // Inner ring cross-links
  { from: 1, to: 6 }, { from: 2, to: 7 },
  { from: 1, to: 8 }, { from: 2, to: 9 },
  // Outer inter-connections
  { from: 6, to: 5 }, { from: 7, to: 3 },
  { from: 8, to: 9 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Cubic bezier control point — perpendicular offset for curved edges
function ctrlPoint(
  ax: number, ay: number, bx: number, by: number, bend: number
): [number, number] {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  // Perpendicular
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return [mx + (-dy / len) * bend, my + (dx / len) * bend];
}

// Point along quadratic bezier at t
function bezierPoint(
  ax: number, ay: number,
  cx: number, cy: number,
  bx: number, by: number,
  t: number
): [number, number] {
  const x = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * cx + t * t * bx;
  const y = (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * cy + t * t * by;
  return [x, y];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NodeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let W = 0, H = 0;
    const dpr = devicePixelRatio;

    // Initialise nodes
    const nodes: Node[] = NODE_DEFS.map(def => ({
      ...def,
      x: 0, y: 0,
    }));

    // Initialise edges with staggered packet starts
    const edges: Edge[] = EDGE_DEFS.map((def, i) => ({
      ...def,
      packetT: (i / EDGE_DEFS.length),
      packetSpeed: 0.28 + Math.random() * 0.18,
      packetPhase: i * 0.55,
      alpha: 1,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let t = 0;
    let last = -1;

    const draw = (ts: number) => {
      if (last < 0) last = ts;
      const delta = Math.min((ts - last) / 1000, 0.05);
      last = ts;
      if (!prefersReduced) t += delta;

      ctx.clearRect(0, 0, W, H);

      // ── Update node positions ────────────────────────────────────────────
      for (const n of nodes) {
        const bx = n.nx * W;
        const by = n.ny * H;
        n.x = bx + Math.sin(t * n.floatFreqX + n.floatPhaseX) * n.floatAmpX;
        n.y = by + Math.sin(t * n.floatFreqY + n.floatPhaseY) * n.floatAmpY;
      }

      // ── Draw edges ───────────────────────────────────────────────────────
      for (const e of edges) {
        const a = nodes[e.from];
        const b = nodes[e.to];
        if (!a || !b) continue;

        // Gentle bend — varies per edge based on index
        const bendAmt = 18 + (e.from + e.to) * 3.7;
        const [cx, cy] = ctrlPoint(a.x, a.y, b.x, b.y, bendAmt % 2 === 0 ? bendAmt : -bendAmt);

        // Edge line
        ctx.save();
        ctx.globalAlpha = e.alpha * 0.22;
        ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(cx, cy, b.x, b.y);
        ctx.stroke();
        ctx.restore();

        // ── Packet ──────────────────────────────────────────────────────────
        if (!prefersReduced) {
          e.packetT = (e.packetT + delta * e.packetSpeed) % 1;
          const [px, py] = bezierPoint(a.x, a.y, cx, cy, b.x, b.y, e.packetT);

          // Glow
          const grad = ctx.createRadialGradient(px, py, 0, px, py, 7);
          grad.addColorStop(0, "rgba(232,131,58,0.90)");
          grad.addColorStop(0.4, "rgba(212,98,43,0.40)");
          grad.addColorStop(1, "rgba(212,98,43,0)");
          ctx.save();
          ctx.globalAlpha = e.alpha;
          ctx.beginPath();
          ctx.arc(px, py, 7, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
          // Core dot
          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "#F0803A";
          ctx.fill();
          ctx.restore();
        }
      }

      // ── Draw nodes ───────────────────────────────────────────────────────
      for (const n of nodes) {
        // Outer glow ring
        if (n.accent) {
          const glow = ctx.createRadialGradient(n.x, n.y, n.r * 0.5, n.x, n.y, n.r * 3);
          glow.addColorStop(0, "rgba(212,98,43,0.28)");
          glow.addColorStop(1, "rgba(212,98,43,0)");
          ctx.save();
          ctx.globalAlpha = n.alpha * 0.8;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
          ctx.restore();
        }

        // Node body
        ctx.save();
        ctx.globalAlpha = n.alpha;

        if (n.accent) {
          // Orange filled node
          const bodyGrad = ctx.createRadialGradient(
            n.x - n.r * 0.3, n.y - n.r * 0.3, 0,
            n.x, n.y, n.r
          );
          bodyGrad.addColorStop(0, "#F0803A");
          bodyGrad.addColorStop(1, "#A83010");
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = bodyGrad;
          ctx.fill();
          // Rim
          ctx.strokeStyle = "rgba(255,255,255,0.30)";
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          // White/glass node
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.12)";
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.32)";
          ctx.lineWidth = 1;
          ctx.stroke();
          // Inner dot
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 0.38, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.55)";
          ctx.fill();
        }

        ctx.restore();

        // Label
        ctx.save();
        ctx.globalAlpha = n.alpha * 0.65;
        ctx.fillStyle = "#ffffff";
        ctx.font = `500 ${n.r < 5 ? 9 : 10}px ui-sans-serif, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(n.label, n.x, n.y + n.r + 5);
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%", pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
