"use client";

import { useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";
import { useRef } from "react";
import Image from "next/image";

interface FloatingVisualProps {
  src: string;
  alt?: string;
  className?: string;
  /** Phase offset in radians — use different values per instance so they don't mirror */
  phase?: number;
  /** Float amplitude in px (default 9) */
  amplitude?: number;
  /** Rotation amplitude in degrees (default 2) */
  rotAmplitude?: number;
  /** Float frequency in Hz (default 0.45) */
  freq?: number;
}

export default function FloatingVisual({
  src,
  alt = "",
  className = "",
  phase = 0,
  amplitude = 9,
  rotAmplitude = 2,
  freq = 0.45,
}: FloatingVisualProps) {
  const t = useRef(0);
  const y = useMotionValue(0);
  const rot = useMotionValue(0);
  const shouldReduce = useReducedMotion();

  useAnimationFrame((_, delta) => {
    if (shouldReduce) return;
    t.current += delta / 1000;
    const angle = t.current * freq * Math.PI * 2 + phase;
    y.set(Math.sin(angle) * amplitude);
    rot.set(Math.sin(angle * 0.7 + phase) * rotAmplitude);
  });

  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      className={className}
      style={{
        transform: `translateY(${y.get()}px) rotate(${rot.get()}deg)`,
        willChange: "transform",
      }}
      ref={(el) => {
        if (!el || shouldReduce) return;
        // Drive inline style directly to avoid React re-renders
        const unsubY = y.on("change", (v) => {
          el.style.transform = `translateY(${v}px) rotate(${rot.get()}deg)`;
        });
        const unsubRot = rot.on("change", (v) => {
          el.style.transform = `translateY(${y.get()}px) rotate(${v}deg)`;
        });
        // Cleanup stored on element to avoid closure leak
        (el as HTMLImageElement & { _unsub?: () => void })._unsub = () => {
          unsubY();
          unsubRot();
        };
      }}
    />
  );
}
