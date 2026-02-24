# Motion Design — Best Practices

## Import (always this exact path)
```ts
import { motion, useMotionValue, useTransform, useAnimationFrame, animate } from "motion/react"
```

---

## The Four Tools

### 1. `<motion.div animate={...}>` — declarative, state-driven
Use for: mount/unmount transitions, hover/tap states, toggled UI.
```tsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
/>
```

### 2. `useMotionValue` + `useTransform` — reactive, zero-rerender
Use for: scroll-linked, drag, continuous reactive transforms.
```tsx
const scrollY = useMotionValue(0)
const opacity = useTransform(scrollY, [0, 200], [1, 0])
// Pass directly to style — never useState
<motion.div style={{ opacity }} />
```

### 3. `useAnimationFrame` — frame loop
Use for: sine waves, physics loops, clock-driven animations.
```tsx
const y = useMotionValue(0)
const t = useRef(0)
useAnimationFrame((_, delta) => {
  t.current += delta / 1000
  y.set(Math.sin(t.current * 0.8) * 20)
})
<motion.div style={{ y }} />
```
Rule: always accumulate time with `delta`, never with raw `time` arg (avoids tab-inactive jump).

### 4. `animate()` imperative — sequenced, one-shot
Use for: triggered sequences, stagger chains, after user events.
```tsx
await animate("#el", { x: 100 }, { duration: 0.4 })
await animate("#el", { opacity: 0 }, { duration: 0.2 })
```

---

## Performance Rules (non-negotiable)

### Always animate transform props
```
x, y, z, rotate, rotateX, rotateY, scale, scaleX, scaleY, skewX, skewY
```
These are GPU-composited. They never cause layout or paint.

### Never animate layout props during motion
```
width, height, top, left, margin, padding, border-width
```
These trigger full layout recalculation on every frame — causes jank.

### Exception: `layout` prop
If you must animate size/position, use the `layout` prop — Motion batches and optimizes it:
```tsx
<motion.div layout />
```
Still use sparingly. Don't put it on large container trees.

### MotionValues bypass React
- Pass MotionValues directly to `style={{ y: motionVal }}` — this skips React's reconciler
- Never call `.get()` inside render and pass to state
- Never put a MotionValue into `useState`

---

## Easing & Timing Guide

### Feel vocabulary
| Feel | Curve | Duration |
|---|---|---|
| Snappy UI (button, tooltip) | `[0.25, 0.1, 0.25, 1]` | 150–250ms |
| Smooth enter | `[0.0, 0.0, 0.2, 1]` (ease-out) | 300–400ms |
| Elegant exit | `[0.4, 0.0, 1, 1]` (ease-in) | 200–300ms |
| Expressive (hero, reveal) | `[0.16, 1, 0.3, 1]` (expo-out) | 500–700ms |
| Physical / spring | `type: "spring", stiffness: 280, damping: 26` | — |

### Spring presets
```ts
// Responsive (buttons, cards)
{ type: "spring", stiffness: 400, damping: 30 }

// Floaty (kite, illustration)
{ type: "spring", stiffness: 80, damping: 14 }

// Snappy (drawer, sheet)
{ type: "spring", stiffness: 500, damping: 35 }
```

---

## Visual Design Principles

### 1. One thing moves at a time (focal point)
Don't animate 6 elements simultaneously. Stagger reveals — the eye needs a leader.

### 2. Enter ≠ exit
Enter: ease-out (fast start, graceful settle).
Exit: ease-in (starts gentle, ends decisively).

### 3. Amplitude matters more than duration
A 20px float at 18s period reads as "breathing". 4px at 18s is imperceptible. 60px is seasick. For hero illustrations: 12–24px vertical float is the sweet spot.

### 4. Phase offsets create life
Multiple elements with the same sine wave look mechanical. Offset phases by 0.3–0.8 radians per element.

### 5. Stagger reveals
```tsx
// Children stagger — don't hardcode delays inline
<motion.ul>
  {items.map((item, i) => (
    <motion.li
      key={item.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.07, duration: 0.4, ease: [0.0, 0.0, 0.2, 1] }}
    />
  ))}
</motion.ul>
```

### 6. Reduced motion — always guard
```tsx
import { useReducedMotion } from "motion/react"

const prefersReduced = useReducedMotion()

useAnimationFrame((_, delta) => {
  if (prefersReduced) return
  // ...
})
```
Or in CSS: `@media (prefers-reduced-motion: reduce)` — disable keyframe animations.

---

## Brand-Specific Rules (Khyte)

- **Float amplitude**: 12–18px for hero illustrations
- **Float period**: 16–28s (slow, considered — not playful SaaS)
- **Rotation drift**: ±2–4° max on illustrations
- **Tail / ribbon cascades**: phase offset 0.4–0.6 rad per segment
- **Fade-in reveals**: `opacity: 0 → 1`, `y: 16 → 0`, 380ms, ease-out — consistent across all page sections
- **Spring for interactive**: buttons and cards use spring on hover (`scale: 1.02`)
- **No bounce on UI chrome**: spring with high damping only — nav, drawers, modals never bounce

---

## `"use client"` Requirement
Any file using motion hooks or `<motion.*>` must be a Client Component:
```tsx
"use client"
import { motion } from "motion/react"
```
Server Components cannot use any motion primitives.

---

## Anti-patterns

| Don't | Do instead |
|---|---|
| `useState` for animation values | `useMotionValue` |
| `left`/`top` in animate | `x`/`y` |
| Same phase on all looping elements | Offset by 0.4+ rad |
| `will-change: transform` globally | Only on actively animating elements |
| Animate on every scroll event | `useScroll` + `useTransform` |
| `setTimeout` for stagger | `transition.delay` or `animate()` sequences |
