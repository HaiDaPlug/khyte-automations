"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const WORDS = [
  "manuellt arbete",
  "repetitivt arbete",
  "det manuella",
  "det onödiga",
];

const INTERVAL = 4000; // ms per word (4s)

const GRADIENT =
  "linear-gradient(95deg, #E8833A 0%, #F5A05A 45%, #D4622B 100%)";

// Transition shared between enter and exit
const TRANSITION = {
  y: { duration: 0.36, ease: [0.16, 1, 0.3, 1] as const },
  opacity: { duration: 0.24, ease: "easeOut" as const },
};

export default function RollingWord() {
  const prefersReduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [prefersReduced]);

  return (
    /*
     * Outer span: inline-block clipping window.
     * overflow-hidden clips the entering/exiting words.
     * min-width keeps the h1 from reflowing when shorter words show.
     * vertical-align: bottom keeps baseline aligned with surrounding text.
     */
    <span
      className="relative inline-block overflow-hidden align-bottom"
      style={{ minWidth: "14ch" }}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Accessible label for screen readers */}
      <span className="sr-only">{WORDS[index]}</span>

      {/* mode="wait" — exit fully completes before enter starts; no layout measurement overhead */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          aria-hidden="true"
          className="italic bg-clip-text text-transparent inline-block py-1 -my-1 px-1 -mx-1"
          style={{ backgroundImage: GRADIENT, willChange: "transform" }}
          initial={{ y: "35%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-35%", opacity: 0 }}
          transition={TRANSITION}
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
