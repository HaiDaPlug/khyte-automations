"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Plays a scene as a sequence of steps while it is on screen.
 *
 * The scene itself is plain server-rendered markup. Each element says at which
 * step it appears (--at) and, if it leaves again, at which step (--until);
 * `.scene` in globals.css turns the current --step into opacity and movement
 * with CSS transitions. This component only advances --step on a timer, so the
 * animation costs one timeout per step and no animation library.
 *
 * It starts on the last step, the finished state, so a visitor always sees
 * what the example is before it moves; crawlers and no-JS visitors see the
 * same. In view, it holds that state, rewinds and plays the steps on a loop.
 * With reduced motion it never moves. Off screen it pauses where it is.
 */
export default function SceneStage({
  durations,
  children,
  className = "",
  sceneClassName = "",
}: {
  /** How long each step is held, in ms. The last step is the finished state. */
  durations: number[];
  children: ReactNode;
  /** The frame (the container that scene sizes are measured against). */
  className?: string;
  /** Layout of the scene inside the frame. */
  sceneClassName?: string;
}) {
  const last = durations.length - 1;
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(last);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => setStep((s) => (s >= last ? 0 : s + 1)), durations[step]);
    return () => clearTimeout(timer);
  }, [inView, step, durations, last]);

  return (
    <div ref={ref} aria-hidden="true" className={`scene-stage ${className}`}>
      <div className={`scene ${sceneClassName}`} style={{ "--step": step } as CSSProperties}>
        {children}
      </div>
    </div>
  );
}
