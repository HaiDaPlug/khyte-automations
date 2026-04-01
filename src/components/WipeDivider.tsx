"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

export default function WipeDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Blanket slides upward off the screen as you scroll through the divider zone
  const y = useTransform(scrollYProgress, [0, 1], prefersReduced ? ["0%", "0%"] : ["0%", "-100%"]);

  return (
    <div ref={ref} className="relative w-full h-[30vh] overflow-hidden pointer-events-none" aria-hidden="true">
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          y,
          background: "linear-gradient(to bottom, #1B0803 0%, #2a1a0f 100%)",
        }}
      />
    </div>
  );
}
