"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";

export default function Manifesto() {
  const ref = useRef<HTMLQuoteElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <section className="py-10 md:py-14">
      <motion.blockquote
        ref={ref}
        className="font-sans font-bold text-[var(--color-text)] leading-[1.1] tracking-[-0.03em]"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
        initial={{ opacity: 0, y: reduced ? 0 : 12 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 12 }}
        transition={{ duration: reduced ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        "Målet är alltid detsamma:{" "}
        <span style={{ color: "var(--color-accent)" }}>mindre friktion,</span>{" "}
        färre fel och mer tid för det som faktiskt{" "}
        <span style={{ color: "var(--color-accent)" }}>betyder något."</span>
      </motion.blockquote>
    </section>
  );
}
