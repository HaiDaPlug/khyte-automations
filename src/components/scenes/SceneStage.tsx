"use client";

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Lets a parent decide when a scene plays. <ExampleScroller> wraps each scene
 * in its sticky stage with this: only the active scene plays, and it starts
 * from the first step each time it becomes active, so the workflows reveal
 * themselves one by one. Without a provider a scene plays on its own.
 */
export const SceneControl = createContext<{ active: boolean } | null>(null);

/**
 * Plays a scene as a sequence of steps while it is on screen.
 *
 * The scene itself is plain server-rendered markup. Each element says at which
 * step it appears (--at) and, if it leaves again, at which step (--until);
 * `.scene` in globals.css turns the current --step into opacity and movement
 * with CSS transitions. This component only advances --step on a timer, so the
 * animation costs one timeout per step and no animation library.
 *
 * It starts on the last step, the finished state, so crawlers and no-JS
 * visitors see the whole example. On its own, in view, it holds that state,
 * rewinds and plays on a loop. Under a SceneControl it rewinds when it becomes
 * active and plays only while active. With reduced motion it never moves; off
 * screen it pauses where it is.
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
  const control = useContext(SceneControl);
  const active = control?.active;
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(true);
  const [step, setStep] = useState(last);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || reducedMotion.current) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Under a SceneControl: rewind whenever the scene becomes active.
  useEffect(() => {
    if (active && !reducedMotion.current) setStep(0);
  }, [active]);

  const playing = inView && active !== false;

  useEffect(() => {
    if (!playing) return;
    // Controlled scenes build once and hold the finished state; free ones loop.
    if (active && step >= last) return;
    const timer = setTimeout(() => setStep((s) => (s >= last ? 0 : s + 1)), durations[step]);
    return () => clearTimeout(timer);
  }, [playing, active, step, durations, last]);

  return (
    <div ref={ref} aria-hidden="true" className={`scene-stage ${className}`}>
      <div className={`scene ${sceneClassName}`} style={{ "--step": step } as CSSProperties}>
        {children}
      </div>
    </div>
  );
}
