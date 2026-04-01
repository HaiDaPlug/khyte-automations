"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

type DiagonalScrollFadeProps = {
  children: React.ReactNode;
  className?: string;
  angle?: number;
  softness?: number;
  reverse?: boolean;
};

export function DiagonalScrollFade({
  children,
  className,
  angle = 45,
  softness = 0.14,
  reverse = false,
}: DiagonalScrollFadeProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const progress = useTransform(scrollYProgress, [0, 1], reverse ? [1, 0] : [0, 1]);

  const maskImage = useTransform(progress, (v) => {
    if (prefersReduced) return "none";
    const edge = Math.max(0, Math.min(1, v));
    const from = Math.max(0, edge - softness);
    const to = Math.min(1, edge + softness);

    return `linear-gradient(${angle}deg,
      rgba(0,0,0,1) 0%,
      rgba(0,0,0,1) ${(from * 100).toFixed(1)}%,
      rgba(0,0,0,0) ${(to * 100).toFixed(1)}%,
      rgba(0,0,0,0) 100%)`;
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        WebkitMaskImage: maskImage,
        maskImage,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        willChange: "mask-image",
      }}
    >
      {children}
    </motion.div>
  );
}
