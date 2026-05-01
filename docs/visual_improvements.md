# Visual Improvements — Design System Audit

_Audited: 2026-03-22_

---

## What's Working Well

### Typography
- Clear hierarchy: hero → section h2 → card h3 → body → label
- Consistent section heading pattern across all sections: `text-3xl md:text-4xl font-semibold tracking-[-0.02em]` with `text-[var(--color-text-body)]` subheading
- `.text-label` utility (13px, uppercase, tracked) used consistently for eyebrow labels
- `max-w-[56ch]` on subheadings — good reading width discipline

### Color Tokens
- Comprehensive CSS variable set in `globals.css` under `@theme`
- Warm palette tokens (`--color-warm-*`) are well-scoped to footer/CTA zones
- Dual-theme system (`data-theme="classic"` / `data-theme="espresso"`) cleanly separates modes
- White opacity scale (`white/10` → `white/90`) is a practical pattern for dark surfaces

### Motion
- Consistent easing across components: `cubic-bezier(0.16, 1, 0.3, 1)` (spring-feel)
- `useReducedMotion()` checked in all animated components
- `useInView({ once: true })` for scroll reveals — performant
- Duration progression feels right: 0.32s (page), 0.55s (headline), 0.75s (prose)

### Spacing
- `--spacing-section` CSS var defined (144px desktop / 80px mobile)
- `max-w-[1100px]` container width used across all content sections
- Card internal padding consistent: `p-8 md:p-10` (2–2.5rem)

### Component Patterns
- `<Button>` component has 3 clean variants: `primary`, `secondary`, `ghostDark`
- `<Container>` is used everywhere — no rogue full-bleed content layouts
- `.section-border` utility handles consistent top-border + spacing between sections

---

## Inconsistencies & Issues

### 1. Border Radius — Card Variance

| Component | Border Radius | Token |
|-----------|--------------|-------|
| CasesSection cards | `rounded-2xl` (1rem) | None |
| AutomationShowcase cards | `rounded-2xl` (1rem) | None |
| WhyKhyte cards | `rounded-[var(--radius-sm)]` (4px) | `--radius-sm` |
| ProcessSection steps | `rounded-2xl` (1rem) | None |

**Problem**: WhyKhyte cards feel stiff next to every other card on the page. The 4px radius is a different design language — either use it everywhere or align to 1rem.

**Fix**: Define `--radius-card: 1rem` and apply it to all card surfaces. Retire `--radius-sm` for cards unless intentional.

---

### 2. Hardcoded Color Values — Not Using Design Tokens

Several components bypass CSS variables and use inline hex values:

- `#1B0803` — espresso dark bg (Hero, ROIBand, CasesSection dark gradients)
- `#0A0A0A` — Nav backdrop blur background
- `#2E1005` — intermediate dark brown (gradient stops)
- `rgba(58,51,48,0.06)` — inline rgba (should reference `--color-border`)

**Problem**: If brand colors shift, these won't update. The token system exists — use it.

**Fix**: Add `--color-espresso: #1B0803` and `--color-nav-bg: #0A0A0A` to globals.css. Replace inline hex usage.

---

### 3. Spacing System Inconsistency

Not all sections use `--spacing-section` for vertical rhythm:

| Section | Vertical Spacing |
|---------|-----------------|
| AutomationShowcase | `py-16 md:py-20` — hardcoded |
| ProcessSection | `py-[var(--spacing-section)]` — correct |
| WhyKhyte | `py-[var(--spacing-section)]` — correct |
| CasesSection | `.section-border` + `mb-[var(--spacing-section)]` — correct |
| Statement | `pt-24 pb-24 md:pt-32 md:pb-32` — hardcoded |

**Fix**: Audit `AutomationShowcase` and `Statement` — replace hardcoded py values with `py-[var(--spacing-section)]` on desktop.

---

### 4. Animation Easing — Duplicated Constant

`[0.16, 1, 0.3, 1]` appears 5+ times across components with no shared source:

- `ProcessSection.tsx` — extracted to local `EASE` const (good)
- `Statement.tsx` — inline in each transition object
- `RollingWord.tsx` — inline
- `PageTransition.tsx` — inline

**Fix**: Create `src/lib/motion.ts` exporting shared motion constants:

```ts
export const EASE = [0.16, 1, 0.3, 1] as const;
export const DURATION = { fast: 0.32, mid: 0.55, slow: 0.75 };
```

---

### 5. Gradient Duplication

Similar dark-to-transparent radial gradients appear independently in:

- `HeroSection.tsx` — hero background ambient glow
- `Statement.tsx` — section background atmosphere
- `CasesSection.tsx` — dark section atmosphere
- `AutomationShowcase.tsx` — card background variation
- `ROIBand.tsx` — band background

**Problem**: Values drift slightly across these. Hard to maintain a consistent "feel" for the dark atmospheric effect.

**Fix**: Define reusable gradient utilities in `globals.css`:

```css
.bg-ambient-glow { /* shared radial gradient for dark atmospheric sections */ }
```

---

### 6. Nav Max-Width vs Content Max-Width

| Layer | Max-Width |
|-------|-----------|
| Nav container | `max-w-[1280px]` |
| Content `<Container>` | `max-w-[1100px]` |

**Observation**: The nav is 180px wider than content. This is intentional (nav can "breathe" wider than content) but undocumented. On very wide screens the nav pills can feel disconnected from the content below.

**Recommendation**: Document this as intentional. If visual alignment is desired at large viewports, consider capping nav at `1200px` as a middle ground.

---

### 7. Ghost Numbers — No Scale or Token

Large background decorative numbers in AutomationShowcase and some cards use:

- `text-[8rem]` — hardcoded size
- `opacity-[0.08]` — hardcoded opacity

**Fix**: Define `--ghost-number-size: 8rem` and `--ghost-number-opacity: 0.08` if this motif will be reused (it already is). Or extract to a Tailwind utility `.ghost-number`.

---

## Priority Order for Fixes

| Priority | Issue | Effort |
|----------|-------|--------|
| High | Border radius inconsistency (WhyKhyte vs rest) | Low — 1 file, 1 value |
| High | Spacing — AutomationShowcase hardcoded py | Low — swap values |
| Medium | Color hardcodes → CSS variables | Medium — grep + replace across files |
| Medium | Extract shared motion constants | Low — new file + imports |
| Low | Gradient duplication | Medium — create utilities, refactor |
| Low | Ghost number tokens | Low — 1-2 files |
| Low | Nav max-width documentation | None — just a comment/decision |

---

## Design System Maturity Scorecard

| Dimension | Score | Notes |
|-----------|-------|-------|
| Typography | 4/5 | Strong hierarchy; some revert-comment noise suggests WIP |
| Color Tokens | 3/5 | Good vars, but partial hardcoding undermines the system |
| Spacing | 3/5 | Var defined, not applied everywhere |
| Motion | 4/5 | Sophisticated; easing just needs centralization |
| Components | 3/5 | Button/Container solid; card radius variance is the main gap |
| Responsive | 4/5 | Mobile-first, well executed |
| Accessibility | 3/5 | Good practices; a few aria-hidden gaps on decorative elements |

---

## What Does NOT Need Fixing

- `max-w-[56ch]` on section subheadings — intentional and good
- `border-white/10` through `border-white/20` opacity scale — consistent and readable
- `useInView({ once: true, margin: "-80px" })` — consistent scroll reveal trigger
- `h-12 px-8 rounded-md` button base — consistent across all variants
- Section header `mb-3` / `mb-10` rhythm — consistent throughout
