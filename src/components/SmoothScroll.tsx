"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { frame } from "motion/react";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Tick Lenis inside Motion's RAF scheduler so both share one frame budget
    // instead of running two independent requestAnimationFrame loops.
    function update({ timestamp }: { timestamp: number }) {
      lenis.raf(timestamp);
    }

    frame.update(update, true);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
