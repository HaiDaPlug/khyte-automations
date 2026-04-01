"use client";

import { useScroll, useTransform, motion, useReducedMotion } from "motion/react";

export function HeroStatementTransition() {
  const prefersReduced = useReducedMotion();

  // Track page scroll in pixels
  const { scrollY } = useScroll();

  // Assume hero is 100dvh. Transition fires as you scroll from 40vh to 140vh.
  // Adjust these if your hero height differs.
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const start = vh * 0.4;
  const peak  = vh * 0.9;
  const end   = vh * 1.4;

  // Veil drifts diagonally across viewport
  const x = useTransform(scrollY, [start, end], prefersReduced ? ["0%", "0%"] : ["-50%", "50%"]);
  const y = useTransform(scrollY, [start, end], prefersReduced ? ["0%", "0%"] : ["30%", "-30%"]);

  // Peaks at midpoint, gone before/after
  const opacity = useTransform(
    scrollY,
    [start, peak * 0.7, peak, end * 0.85, end],
    prefersReduced ? [0, 0, 0, 0, 0] : [0, 0.32, 0.32, 0.32, 0]
  );

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      style={{ opacity }}
    >
      <motion.div
        style={{
          x,
          y,
          position: "absolute",
          width: "180%",
          height: "180%",
          top: "-40%",
          left: "-40%",
          background: `radial-gradient(ellipse 50% 38% at 50% 50%,
            rgba(212,98,43,0.22) 0%,
            rgba(232,131,58,0.10) 40%,
            transparent 70%
          )`,
        }}
      />
    </motion.div>
  );
}
