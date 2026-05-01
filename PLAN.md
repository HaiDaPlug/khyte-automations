# Statement Zigzag → Process Cards — Implementation Plan

## Constraints Restated
- Mobile navbar gating: UNTOUCHED
- Desktop nav centering: UNTOUCHED
- Footer + PreFooter base-band: UNTOUCHED
- Statement MUST stay inside Container (viewport-escape trick dependency)
- Prefer design tokens + class edits
- Validate with `npm run build && npm run start`

---

## Problem

Statement's zigzag layout forces vertical scrolling through 3 steps that alternate left/right with an SVG path connecting them. This creates a long, article-like reading experience where you can never see all 3 steps at once. For a "process" section, the user should be able to **glance and understand the whole flow** — not scroll through it like a story.

The editorial headline ("Den nya generationen av konsult...") is strong and should stay. The zigzag band below it needs to become something you can absorb in one viewport.

---

## Solution: Horizontal Process Cards

Replace the zigzag with a **3-column card layout** on desktop (stacked on mobile) inside the same full-bleed warm band. Each card represents one step with clear visual hierarchy.

### Design Language

**Card anatomy** (each of 3):
1. **Step number** — large, decorative: `text-[4rem] md:text-[5rem] font-bold`, brand orange, `opacity-20` — top-left of card, creates visual rhythm
2. **Title** — `text-xl md:text-[1.375rem] font-semibold`, color-text, tight leading
3. **Body** — `text-base`, color-text-body, relaxed leading
4. **Top accent line** — 3px wide, `bg-[#D4622B]`, `w-12`, sits at the very top of the card as a branded marker

**Card surface**: `bg-white/60 backdrop-blur-sm` — semi-transparent against the warm band gradient, creating depth without being opaque. Border: `border border-[var(--color-border)]`. Radius: `rounded-xl` (12px — slightly larger than the 4px used elsewhere, giving the process section its own character).

**Connecting arrows** (desktop only): Between cards, a subtle `→` in `text-[var(--color-accent)] opacity-40` — lightweight, indicates flow without dominating. Uses `hidden md:flex` wrapper.

**Layout**:
- Desktop: `grid grid-cols-3 gap-6` with arrow elements between
- Actually: `grid grid-cols-[1fr_auto_1fr_auto_1fr]` to include arrow columns, or simpler: a flex row with arrows as gap elements
- Mobile: `grid grid-cols-1 gap-6` — cards stack, no arrows (the 01/02/03 numbers provide sequence)

**Animation**: Keep scroll-triggered reveal but simplify. Instead of individual x-slide per card:
- All 3 cards fade-in + translateY(12px) → 0 on IntersectionObserver trigger
- Staggered by 100ms per card (i * 0.1 delay)
- `useReducedMotion` guard (same pattern)
- No SVG path animation, no dot position measurement, no ResizeObserver — massive complexity reduction

### What Gets Removed
- `buildPath()` function
- `buildMobilePath()` function
- `dotRefs` ref
- `dotPositions` state
- `containerWidth` state
- `isMobile` state
- The entire SVG block (path + dots)
- The zigzag flex layout with `md:justify-start` / `md:justify-end`
- Watermark numbers (replaced by the new in-card step numbers)
- Center dot anchors
- Left-edge accent bars on old cards
- `ResizeObserver` + `requestAnimationFrame` measurement logic

### What Stays
- `sectionRef` + IntersectionObserver (one-shot, same pattern)
- `isVisible` state
- `prefersReduced` from `useReducedMotion()`
- `STEPS` data array (number, title, body — `anchor` field becomes unused, can remove or leave)
- The editorial headline above the band
- The full-bleed warm band wrapper with its gradient, hairlines, and `max-w-[1100px]` inner container
- The `motion` import (still used for card animations)

### Full Component Structure

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const STEPS = [
  {
    number: "01",
    title: "Kartlägger flödet — vi hittar tidstjuvarna",
    body: "Vi går igenom era processer och identifierar var energin läcker. Vi letar efter upprepning och friktion.",
  },
  {
    number: "02",
    title: "Bygger en prototyp och testar snabbt",
    body: "Inget evighetsplanerande. Vi bygger en fungerande version som vi testar mot verkligheten direkt.",
  },
  {
    number: "03",
    title: "Implementerar skarpt — justerar tills det sitter",
    body: "Vi driftsätter lösningen. Vi finns kvar och trimmar systemet tills det rullar av sig själv.",
  },
];

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="mb-[var(--spacing-section)]">
      {/* Editorial headline — UNCHANGED */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.12] tracking-[-0.025em] mb-16 md:mb-20 max-w-[28ch]"
        style={{ fontVariantNumeric: "normal" }}
      >
        <span className="text-[var(--color-text)]">
          Den nya generationen av konsult.&nbsp;
        </span>
        <span className="text-[var(--color-muted)]">
          Vi hoppar in i din verklighet och automatiserar alla dina manuella processer.
        </span>
      </h2>

      {/* Full-bleed process band */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <div className="relative overflow-hidden isolate">
          {/* Background gradient — same as current */}
          <div aria-hidden="true" className="absolute inset-0 -z-10" style={{
            background: [
              "radial-gradient(ellipse 60% 80% at 50% 110%, rgba(212,98,43,0.12) 0%, rgba(212,98,43,0) 65%)",
              "radial-gradient(ellipse 40% 50% at 20% 40%, rgba(232,131,58,0.07) 0%, rgba(232,131,58,0) 70%)",
              "linear-gradient(180deg, #EDE8E3 0%, #E5DDD4 100%)",
            ].join(", "),
          }} />
          {/* Hairlines — same */}
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[rgba(58,51,48,0.12)]" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[rgba(58,51,48,0.12)]" />

          {/* Inner content */}
          <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-24">

            {/* Process cards — 3 col desktop, 1 col mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 items-stretch">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.number}
                  className="relative bg-white/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl p-8 md:p-7 lg:p-8 flex flex-col"
                  initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : prefersReduced ? 0 : 12,
                  }}
                  transition={{
                    duration: prefersReduced ? 0 : 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: i * 0.1,
                  }}
                >
                  {/* Top accent line */}
                  <div className="w-10 h-[3px] rounded-full bg-[#D4622B] mb-6" aria-hidden="true" />

                  {/* Step number — decorative */}
                  <span className="text-[3.5rem] md:text-[4rem] font-bold leading-none text-[var(--color-accent)] opacity-20 mb-3" aria-hidden="true">
                    {step.number}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl md:text-[1.3rem] font-semibold text-[var(--color-text)] leading-[1.25] tracking-[-0.02em] mb-3">
                    {step.title}
                  </h3>

                  {/* Body */}
                  <p className="text-[var(--color-text-body)] text-base leading-[1.6]">
                    {step.body}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
```

### Design Decisions Explained

**Why `bg-white/60 backdrop-blur-sm` instead of `bg-[var(--color-card-bg)]`?**
The warm band gradient is one of the most distinctive visual elements on the page. Using opaque card-bg would hide it. Semi-transparent white lets the gradient breathe through the cards, creating depth and a frosted quality that feels premium. This is the same design instinct behind the nav's glass capsule (`bg-[#0A0A0A]/72 backdrop-blur-md`).

**Why no connecting arrows between cards?**
Tested mentally: arrows between a 3-col grid feel like a flowchart from a slide deck. The numbered steps (01 → 02 → 03) already communicate sequence. The accent line at the top of each card creates a horizontal rhythm across the row that reads as "progression" without arrows.

**Why rounded-xl (12px) instead of rounded-[var(--radius-sm)] (4px)?**
The process cards need to feel distinct from the data cards (PainOutcome uses 2xl/16px, WhyKhyte uses 4px). 12px is in between — substantial enough to feel like a surface, not just a container. This is a *process showcase* section, not a utility grid.

**Why smaller padding on md (`p-7`)?**
At 3-column with gap-5, each card is roughly 350px wide at max-w-1100px. `p-8` (32px) on both sides leaves only ~286px for content. `p-7` (28px) gives ~294px — enough for the titles to breathe without wrapping excessively. At lg+ where screens are wider, `p-8` takes over.

**Why no watermark behind the card?**
The old zigzag had watermark numbers floating behind each card because the cards were spread across the full width and needed visual anchoring. With cards sitting side by side, the in-card number does the same job more cleanly. Less visual noise = more premium.

---

## Complexity Reduction

| Metric | Before (zigzag) | After (cards) |
|--------|-----------------|---------------|
| Lines of code | ~380 | ~95 |
| State variables | 5 (isVisible, dotPositions, containerWidth, isMobile, prefersReduced) | 2 (isVisible, prefersReduced) |
| Refs | 3 (sectionRef, containerRef, dotRefs[3]) | 1 (sectionRef) |
| Effects | 3 (IO, mobile detect, dot measurement + ResizeObserver) | 1 (IO) |
| SVG elements | path + 6 circles (outer ring + inner fill × 3) | 0 |
| Helper functions | 2 (buildPath, buildMobilePath) | 0 |
| Motion elements | 7 (3 card wrappers + 3 watermarks + path) | 3 (card wrappers) |

---

## File Touch List

| File | Changes |
|------|---------|
| `src/components/sections/Statement.tsx` | Full rewrite of the zigzag band into 3-col process cards. Headline untouched. |
| `docs/current_state.md` | Update Statement section description |

**Files NOT touched**: Everything else. This is a single-component change.

---

## Acceptance Checklist

- [ ] Editorial headline renders identically to current (no changes)
- [ ] Full-bleed warm band renders identically (gradient, hairlines — no changes)
- [ ] 3 process cards render in a horizontal row on md+ screens
- [ ] Cards stack vertically on mobile
- [ ] Cards have frosted glass effect (`bg-white/60 backdrop-blur-sm`) against warm band
- [ ] Step numbers are visible inside each card (01, 02, 03)
- [ ] Orange accent line at top of each card
- [ ] Scroll-triggered staggered fade-in animation works
- [ ] `useReducedMotion` guard works (no animation when prefers-reduced-motion)
- [ ] `npm run build` succeeds
- [ ] `npm run start` — no layout drift, no horizontal overflow
- [ ] Mobile: cards stack cleanly, no text overflow

---

## Risks & Rollback

| Risk | Mitigation |
|------|------------|
| `backdrop-blur-sm` perf on older devices | It's a CSS filter, GPU-composited. If it causes issues, swap to `bg-[#F0EBE5]/90` (opaque with slight transparency) — one class change |
| Cards too narrow at md breakpoint | `gap-5` + `p-7` tested against 1100px max-width = ~350px per card. If titles wrap badly, reduce gap to `gap-4` or title to `text-lg` |
| Loss of the zigzag "wow factor" | The zigzag was technically impressive but served the wrong purpose (scroll journey vs. glanceable overview). The cards are more effective at communicating "3 clear steps" |
| Step content feels thin in card format | The copy is already concise. If cards feel empty, add a small icon or illustration per step later — but start clean |

**Rollback**: The old Statement.tsx is in git history. `git checkout HEAD -- src/components/sections/Statement.tsx` restores it instantly.