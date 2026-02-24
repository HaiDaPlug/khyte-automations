"use client";

import { useRef, useEffect } from "react";
import { useReducedMotion } from "motion/react";

/**
 * DataSweep — animated canvas scene
 *
 * Loop:
 *   1. CHAOS   — blocks scattered, rotated, dim (2s hold)
 *   2. SWEEP   — kite descends, blocks align left→right as kite passes
 *   3. HOLD    — ordered grid, kite idles at top (1.5s hold)
 *   4. RESET   — blocks dissolve back to chaos, kite exits upward
 *
 * All drawing on a single <canvas>. Zero motion/react in the loop —
 * pure rAF + lerp for performance.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

interface Block {
  // Chaos target
  cx: number; cy: number; cw: number; ch: number; crot: number; cAlpha: number;
  // Order target
  ox: number; oy: number; ow: number; oh: number; orot: number; oAlpha: number;
  // Current (lerped)
  x: number; y: number; w: number; h: number; rot: number; alpha: number;
  // Per-block alignment delay (0–1, normalised sweep progress)
  alignAt: number;
}

type Phase = "chaos" | "sweep" | "hold" | "reset";

// ─── Constants ──────────────────────────────────────────────────────────────

const COLS = 6;
const ROWS = 3;
const BLOCK_W = 64;
const BLOCK_H = 36;
const GRID_GAP_X = 20;
const GRID_GAP_Y = 16;

const CHAOS_HOLD   = 1.8;  // seconds
const SWEEP_DUR    = 2.6;  // kite travel duration
const HOLD_DUR     = 1.6;
const RESET_DUR    = 1.0;

// Brand palette
const COL_ACCENT   = { r: 212, g: 98,  b: 43  }; // #D4622B
const COL_MUTED    = { r: 156, g: 142, b: 130 }; // #9C8E82
const COL_BORDER   = "rgba(58,51,48,0.18)";
const COL_BG_BLOCK = "rgba(237,234,230,0.92)";   // --color-card-bg

// ─── Helpers ────────────────────────────────────────────────────────────────

const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const ease  = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t; // ease-in-out quad

function seededRand(seed: number) {
  // Simple LCG — deterministic so SSR/CSR match
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ─── Build blocks ────────────────────────────────────────────────────────────

function buildBlocks(W: number, H: number): Block[] {
  const rand = seededRand(42);

  // Grid layout — centred
  const gridW = COLS * BLOCK_W + (COLS - 1) * GRID_GAP_X;
  const gridH = ROWS * BLOCK_H + (ROWS - 1) * GRID_GAP_Y;
  const gridLeft = (W - gridW) / 2;
  const gridTop  = (H - gridH) / 2 + 30; // slight offset downward

  const blocks: Block[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const ox = gridLeft + col * (BLOCK_W + GRID_GAP_X) + BLOCK_W / 2;
      const oy = gridTop  + row * (BLOCK_H + GRID_GAP_Y) + BLOCK_H / 2;

      // Chaos: random position, rotation, size variance
      const cx = W * 0.08 + rand() * W * 0.84;
      const cy = H * 0.08 + rand() * H * 0.82;
      const crot = (rand() - 0.5) * 60; // ±30°
      const cw = BLOCK_W * (0.6 + rand() * 0.9);
      const ch = BLOCK_H * (0.6 + rand() * 0.9);

      // alignAt: normalised progress [0,1] at which this block snaps
      // Left columns align earlier than right — left→right wave
      const alignAt = (col / (COLS - 1)) * 0.7 + rand() * 0.15;

      blocks.push({
        cx, cy, cw, ch, crot, cAlpha: 0.35 + rand() * 0.45,
        ox, oy, ow: BLOCK_W, oh: BLOCK_H, orot: 0, oAlpha: 0.92,
        x: cx, y: cy, w: cw, h: ch, rot: crot, alpha: 0.35 + rand() * 0.45,
        alignAt,
      });
    }
  }
  return blocks;
}

// ─── Draw kite ───────────────────────────────────────────────────────────────

function drawKite(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  scale: number, alpha: number
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Kite diamond — tip up, belly down
  // Tip: (0,-50), Left: (-55,-10), Belly: (0,50), Right: (55,-10)
  const T  = { x: 0,    y: -50 };
  const L  = { x: -55,  y: -10 };
  const B  = { x: 0,    y:  50 };
  const R  = { x: 55,   y: -10 };
  const CY = -10; // spar y

  // Face A top-left
  const gA = ctx.createLinearGradient(T.x, T.y, L.x, CY);
  gA.addColorStop(0, `rgba(${COL_ACCENT.r+28},${COL_ACCENT.g+30},${COL_ACCENT.b},1)`);
  gA.addColorStop(1, `rgba(${COL_ACCENT.r},${COL_ACCENT.g},${COL_ACCENT.b},1)`);
  ctx.beginPath(); ctx.moveTo(T.x, T.y); ctx.lineTo(L.x, L.y); ctx.lineTo(0, CY); ctx.closePath();
  ctx.fillStyle = gA; ctx.fill();

  // Face B top-right
  const gB = ctx.createLinearGradient(T.x, T.y, R.x, CY);
  gB.addColorStop(0, `rgba(${COL_ACCENT.r+18},${COL_ACCENT.g+18},${COL_ACCENT.b},1)`);
  gB.addColorStop(1, `rgba(${COL_ACCENT.r-10},${COL_ACCENT.g-10},${COL_ACCENT.b},1)`);
  ctx.beginPath(); ctx.moveTo(T.x, T.y); ctx.lineTo(R.x, R.y); ctx.lineTo(0, CY); ctx.closePath();
  ctx.fillStyle = gB; ctx.fill();

  // Face C bottom-left
  const gC = ctx.createLinearGradient(L.x, CY, B.x, B.y);
  gC.addColorStop(0, `rgba(${COL_ACCENT.r},${COL_ACCENT.g},${COL_ACCENT.b},1)`);
  gC.addColorStop(1, `rgba(${COL_ACCENT.r-40},${COL_ACCENT.g-40},${COL_ACCENT.b-20},1)`);
  ctx.beginPath(); ctx.moveTo(L.x, L.y); ctx.lineTo(B.x, B.y); ctx.lineTo(0, CY); ctx.closePath();
  ctx.fillStyle = gC; ctx.fill();

  // Face D bottom-right
  const gD = ctx.createLinearGradient(R.x, CY, B.x, B.y);
  gD.addColorStop(0, `rgba(${COL_ACCENT.r-10},${COL_ACCENT.g-10},${COL_ACCENT.b},1)`);
  gD.addColorStop(1, `rgba(${COL_ACCENT.r-50},${COL_ACCENT.g-50},${COL_ACCENT.b-20},1)`);
  ctx.beginPath(); ctx.moveTo(R.x, R.y); ctx.lineTo(B.x, B.y); ctx.lineTo(0, CY); ctx.closePath();
  ctx.fillStyle = gD; ctx.fill();

  // Outline
  ctx.beginPath();
  ctx.moveTo(T.x, T.y); ctx.lineTo(L.x, L.y); ctx.lineTo(B.x, B.y); ctx.lineTo(R.x, R.y);
  ctx.closePath();
  ctx.strokeStyle = "rgba(255,255,255,0.20)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Spine
  ctx.beginPath(); ctx.moveTo(T.x, T.y); ctx.lineTo(B.x, B.y);
  ctx.strokeStyle = "rgba(255,255,255,0.40)";
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Spar
  ctx.beginPath(); ctx.moveTo(L.x, L.y); ctx.lineTo(R.x, R.y);
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1.1;
  ctx.stroke();

  // Tail — 4 segments below belly, flutter offset baked as static for canvas perf
  const tailSegs = [
    { dy: 18, dx:  4, w: 8,  h: 16, alpha: 0.80 },
    { dy: 42, dx: -5, w: 10, h: 14, alpha: 0.60 },
    { dy: 64, dx:  6, w: 13, h: 13, alpha: 0.42 },
    { dy: 84, dx: -3, w: 15, h: 11, alpha: 0.24 },
  ];
  for (const s of tailSegs) {
    ctx.save();
    ctx.globalAlpha = alpha * s.alpha;
    ctx.fillStyle = `rgba(${COL_ACCENT.r},${COL_ACCENT.g},${COL_ACCENT.b},1)`;
    ctx.beginPath();
    ctx.roundRect(B.x + s.dx - s.w / 2, B.y + s.dy, s.w, s.h, 3);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

// ─── Draw block ──────────────────────────────────────────────────────────────

function drawBlock(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  rot: number, alpha: number,
  ordered: number // 0=chaos, 1=ordered — blends colour
) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate((rot * Math.PI) / 180);

  const rx = 6;

  // Fill — blends from muted chaos to clean card-bg
  const r = Math.round(lerp(COL_MUTED.r, 237, ordered));
  const g = Math.round(lerp(COL_MUTED.g, 234, ordered));
  const b = Math.round(lerp(COL_MUTED.b, 230, ordered));
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, rx);
  ctx.fill();

  // Border
  ctx.strokeStyle = ordered > 0.5 ? COL_BORDER : "rgba(156,142,130,0.25)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Ordered state: subtle inner accent stripe on left edge
  if (ordered > 0.3) {
    ctx.globalAlpha = alpha * ordered * 0.7;
    ctx.fillStyle = `rgba(${COL_ACCENT.r},${COL_ACCENT.g},${COL_ACCENT.b},1)`;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, 3, h, [rx, 0, 0, rx]);
    ctx.fill();
  }

  ctx.restore();
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DataSweep() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let blocks: Block[] = [];

    // Phase state
    let phase: Phase = "chaos";
    let phaseT = 0;   // elapsed seconds in current phase
    let lastTs = -1;

    // Kite position (canvas px, logical)
    let kiteX = 0;
    let kiteY = 0;
    let kiteAlpha = 0;

    const dpr = devicePixelRatio;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const W = rect.width;
      const H = rect.height;
      blocks = buildBlocks(W, H);
      // Reset positions to chaos
      for (const b of blocks) { b.x = b.cx; b.y = b.cy; b.w = b.cw; b.h = b.ch; b.rot = b.crot; b.alpha = b.cAlpha; }
      kiteX = W / 2;
      kiteY = -80;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const tick = (ts: number) => {
      if (lastTs < 0) lastTs = ts;
      const delta = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;

      const W = canvas.width  / dpr;
      const H = canvas.height / dpr;

      phaseT += delta;

      // ── Phase transitions ───────────────────────────────────────────────
      if (phase === "chaos" && phaseT >= CHAOS_HOLD) {
        phase = "sweep"; phaseT = 0;
        kiteX = W / 2;
        kiteY = -80;
        kiteAlpha = 0;
      }
      if (phase === "sweep" && phaseT >= SWEEP_DUR) {
        phase = "hold"; phaseT = 0;
      }
      if (phase === "hold" && phaseT >= HOLD_DUR) {
        phase = "reset"; phaseT = 0;
      }
      if (phase === "reset" && phaseT >= RESET_DUR) {
        phase = "chaos"; phaseT = 0;
        // Snap blocks back to chaos targets immediately
        for (const b of blocks) { b.x = b.cx; b.y = b.cy; b.w = b.cw; b.h = b.ch; b.rot = b.crot; b.alpha = b.cAlpha; }
      }

      // ── Per-phase logic ─────────────────────────────────────────────────
      const sweepP = clamp(phaseT / SWEEP_DUR, 0, 1); // 0→1 during sweep

      if (phase === "sweep" || phase === "hold") {
        // Kite descends from top to resting position above grid
        const kiteRestY = H * 0.22;
        const kiteEased = ease(clamp(phaseT / (SWEEP_DUR * 0.55), 0, 1));
        kiteY    = lerp(-80, kiteRestY, kiteEased);
        kiteAlpha = clamp(phaseT / 0.4, 0, 1);
      }

      if (phase === "hold") {
        // Gentle idle float
        kiteY += Math.sin(phaseT * 2.2) * 0.4;
        kiteAlpha = 1;
      }

      if (phase === "reset") {
        // Kite exits upward
        const exitP = ease(phaseT / RESET_DUR);
        kiteY = lerp(H * 0.22, -80, exitP);
        kiteAlpha = 1 - exitP;
      }

      // ── Block lerp ──────────────────────────────────────────────────────
      for (const b of blocks) {
        let tx = b.cx, ty = b.cy, tw = b.cw, th = b.ch, trot = b.crot, talpha = b.cAlpha;

        if (phase === "sweep") {
          // Block aligns once sweepP passes its alignAt threshold
          if (sweepP > b.alignAt) {
            const localP = clamp((sweepP - b.alignAt) / (1 - b.alignAt + 0.01), 0, 1);
            const ep = ease(localP);
            tx = lerp(b.cx, b.ox, ep);
            ty = lerp(b.cy, b.oy, ep);
            tw = lerp(b.cw, b.ow, ep);
            th = lerp(b.ch, b.oh, ep);
            trot   = lerp(b.crot, 0, ep);
            talpha = lerp(b.cAlpha, b.oAlpha, ep);
          }
        } else if (phase === "hold") {
          tx = b.ox; ty = b.oy; tw = b.ow; th = b.oh; trot = 0; talpha = b.oAlpha;
        } else if (phase === "reset") {
          // Dissolve back
          const ep = ease(phaseT / RESET_DUR);
          tx = lerp(b.ox, b.cx, ep);
          ty = lerp(b.oy, b.cy, ep);
          tw = lerp(b.ow, b.cw, ep);
          th = lerp(b.oh, b.ch, ep);
          trot   = lerp(0, b.crot, ep);
          talpha = lerp(b.oAlpha, b.cAlpha, ep);
        }

        const speed = prefersReduced ? 1 : 0.18;
        b.x     = lerp(b.x, tx, speed);
        b.y     = lerp(b.y, ty, speed);
        b.w     = lerp(b.w, tw, speed);
        b.h     = lerp(b.h, th, speed);
        b.rot   = lerp(b.rot, trot, speed);
        b.alpha = lerp(b.alpha, talpha, speed);
      }

      // ── Draw ────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);

      // "ordered" value per block: how close to ordered state
      for (const b of blocks) {
        let ordered = 0;
        if (phase === "sweep") {
          if (sweepP > b.alignAt) {
            ordered = ease(clamp((sweepP - b.alignAt) / (1 - b.alignAt + 0.01), 0, 1));
          }
        } else if (phase === "hold") {
          ordered = 1;
        } else if (phase === "reset") {
          ordered = 1 - ease(phaseT / RESET_DUR);
        }
        drawBlock(ctx, b.x, b.y, b.w, b.h, b.rot, b.alpha, ordered);
      }

      // Draw kite sweep indicator — faint vertical line under kite during sweep
      if (phase === "sweep") {
        ctx.save();
        ctx.globalAlpha = 0.12 * (1 - sweepP);
        ctx.strokeStyle = `rgb(${COL_ACCENT.r},${COL_ACCENT.g},${COL_ACCENT.b})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(kiteX, kiteY + 60);
        ctx.lineTo(kiteX, H);
        ctx.stroke();
        ctx.restore();
      }

      // Draw kite
      if (phase === "sweep" || phase === "hold" || phase === "reset") {
        drawKite(ctx, kiteX, kiteY, 0.72, kiteAlpha);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
