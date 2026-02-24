# Khyte Automations - Current State (v1.63)

## Tech Stack
- **Next.js** 16.1.6 (App Router)
- **React** 19.2.1
- **TypeScript** 5 (Strict mode)
- **Tailwind CSS** v4 (config via `@theme` in globals.css)
- **Font**: Geist Sans (`geist` package)

## Project Structure
```
src/
├── app/
│   ├── page.tsx          # Landing (hero + cases + timeline + CTA)
│   ├── about/page.tsx    # About page
│   ├── cases/page.tsx    # Case studies
│   ├── contact/page.tsx  # Contact form
│   ├── integritetspolicy/page.tsx  # Integritetspolicy (legal page)
│   ├── villkor/page.tsx  # Användarvillkor (legal page)
│   ├── services/
│   │   ├── page.tsx      # Services & pricing page
│   │   ├── audit/page.tsx          # Redirects to /services
│   │   └── custom-build/page.tsx   # Redirects to /services
│   ├── layout.tsx        # Root layout + metadata + Calendly scripts + Nav
│   ├── globals.css       # Design tokens + animations
│   ├── sitemap.ts        # Dynamic sitemap
│   └── robots.ts         # Robots.txt
├── components/
│   ├── Nav.tsx              # Floating glass capsule nav (Client)
│   ├── Button.tsx           # Primary/secondary/ghostDark variants
│   ├── CalendlyButton.tsx   # Calendly popup trigger (Client)
│   ├── PreFooterCTA.tsx     # Global pre-footer CTA
│   ├── Footer.tsx           # Global footer
│   ├── CaseCard.tsx         # Case card component
│   ├── Container.tsx        # 1100px max-width wrapper
│   ├── PageTransition.tsx   # Route-change: scroll-to-top + fade-in (Client)
│   ├── DnaWeaveSvg.tsx      # Animated SVG (unused on homepage)
│   ├── TimelineProcess.tsx  # Timeline with scan animation (Client)
│   ├── ToolsTicker.tsx      # Logo ticker (Client)
│   ├── NodeGraph.tsx        # Archived: canvas node graph (replaced by KiteHero)
│   ├── KiteHero.tsx         # Hero right-column: animated kite SVG (Client) ← ACTIVE
│   ├── DataSweep.tsx        # Archived: chaos→order block sweep canvas (Client)
│   ├── InteractiveGrid.tsx  # Archived: proximity dot field canvas (Client)
│   ├── WorkflowVisual.tsx   # Archived: animated pipeline node row (Client)
│   ├── VisualSection.tsx    # Archived: InteractiveGrid + WorkflowVisual wrapper (Client)
│   └── sections/
│       ├── PainOutcome.tsx  # Pain → Outcome 3-col cards
│       ├── ROIBand.tsx      # Full-bleed stats band (3 numbers)
│       ├── CasesSection.tsx # Testimonial card + "Läs mer" placeholder + dot indicator
│       └── WhyKhyte.tsx     # 2×2 differentiator cards
public/
├── khyte-logo-text.svg   # Main logo (white SVG, embedded PNG)
├── icons/                # Tool logos for ticker + social icons
└── *.png                 # Profile images
```

## Design Tokens (globals.css)

### Light Warm Theme (Global)
```css
--color-bg: #f4f1ef;               /* Warm off-white page background */
--color-card-bg: #EDEAE6;          /* Card background (slightly darker) */
--color-text: #3A3330;             /* Warm dark brown (headings) */
--color-text-body: #5A4F48;        /* Medium warm brown (body text) */
--color-muted: #9C8E82;            /* Warm taupe (secondary text, icons) */
--color-accent: #E8833A;           /* Bright orange (highlights, timeline) */
--color-border: rgba(58,51,48,0.12); /* Subtle warm border */
--font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
--radius-sm: 4px;                  /* Cards, inputs */
--spacing-section: 128px;          /* Desktop section spacing */
```

### Brand Colors (locked palette)
```
Primary orange:  #D4622B  — pulled from logo, warm and grounded (buttons, CTAs)
Accent orange:   #E8833A  — brighter orange (highlights, timeline accent)
Hover primary:   #C0541F  — darker hover for primary buttons
Text:            #3A3330  — warm dark brown, not black
Text body:       #5A4F48  — medium warm brown
Muted:           #9C8E82  — warm taupe gray
Border:          rgba(58,51,48,0.12)
Price card border: rgba(58,51,48,0.25)  — heavier, signals hierarchy
```

### Warm Palette (PreFooterCTA — top zone of base-band)
```css
/* Default (classic) */
--color-warm-text: #1E1A16;
--color-warm-text-muted: #6B5F55;
--color-warm-accent: #E8833A;
--color-warm-accent-hover: #D4622B;
--color-warm-ink: #12100E;

/* Active concept in layout.tsx: data-theme="espresso" */
--color-warm-text: #F4F1EF;
--color-warm-text-muted: rgba(244,241,239,0.78);
--color-cta-primary: #1B0803;
--color-cta-primary-hover: #5E1E10;
--color-cta-text: #F4F1EF;
```

### Base Band Gradient (PreFooterCTA + Footer — Espresso layered surface)
```css
--base-band-bg:
  radial-gradient(112% 72% at 50% 106%, rgba(212,98,43,0.65) 0%, rgba(212,98,43,0) 50%),
  radial-gradient(90% 70% at 18% -10%, rgba(244,241,239,0.10) 0%, rgba(244,241,239,0) 60%),
  radial-gradient(90% 70% at 88% 0%, rgba(244,241,239,0.06) 0%, rgba(244,241,239,0) 65%),
  linear-gradient(180deg, #1B0803 0%, #1B0803 34%, #5E1E10 85%, #D4622B 100%);
```
- `.base-band` is a **centered rounded slab card**: `width: min(1440px, calc(100% - 32px))`, `margin: clamp(28px, 5vw, 64px) auto clamp(14px, 3vw, 28px)`, `border-radius: 24px`, `overflow: hidden`.
- `::before`: applies layered gradient + `border: 1px solid var(--base-band-border)` + warm shadow/highlight tokens.
- `::after`: subtle grain overlay (not top glow) via repeating-linear-gradient.
- Footer seam uses tokenized color: `--color-footer-seam: rgba(244,241,239,0.12)`.

## globals.css Utilities, Animations & Overlays
- `.base-band`: Rounded slab card with layered gradient via `::before`, grain overlay via `::after`, children `z-index: 1`
- `.text-label`: 13px, 700 weight, 0.05em tracking, uppercase, **`color: var(--color-text)`** (overridden in footer with `!text-white/95`)
- `.btn-cta`: Primary CTA gradient — `linear-gradient(180deg, #C96A24 0%, #B8521C 100%)`, white text, inset highlight/shadow, `brightness(1.10)` on hover with orange glow. Applied to `primary` + `warm` variants in Button + CalendlyButton, and Nav CTAs.
- `.page-enter`: Page fade-in animation — `pageFadeIn` keyframe, `opacity: 0 + translateY(6px)` → natural, 0.32s expo-out. Triggered on every route change via `PageTransition`.
- `slideDown` (150ms ease-out): fires on `details[open] > div` — FAQ accordion. Reduced-motion guard included.
- `.faq-chevron`: rotates 180° on `details[open] > summary .faq-chevron`.

## Typography Utilities
- `.text-hero`: 700 weight, -0.03em tracking, 1.1 leading
- `.text-label`: 13px, 700 weight, 0.05em tracking, uppercase, `color: var(--color-text)`

## Component Standards

### Button.tsx
- Height: `h-12` (48px fixed)
- Padding: `px-8`
- Radius: `rounded-md`
- Primary: `btn-cta` utility class (gradient, see globals.css)
- Secondary: `bg-transparent border border-[rgba(58,51,48,0.20)] text-[#3A3330] hover:bg-[rgba(58,51,48,0.06)]`
- **ghostDark** *(hero-only)*: `bg-white/5 border border-white/25 text-white hover:bg-white/10 hover:border-white/35` — for use on dark hero backgrounds only (currently: homepage hero secondary CTA)

### CalendlyButton.tsx (Client Component)
- Height: `h-12` (48px fixed)
- Padding: `px-8`
- Radius: `rounded-md`
- **Three variants:**
  - `primary`: `btn-cta` utility class (gradient, see globals.css)
  - `secondary`: `bg-transparent border border-[rgba(58,51,48,0.20)] text-[#3A3330] hover:bg-[rgba(58,51,48,0.06)]`
  - `warm`: `btn-cta` utility class (same gradient, works on dark espresso base-band)
- Triggers Calendly popup via `window.Calendly.initPopupWidget()`

### Nav.tsx (Floating Capsule)
- **Rendered globally** in layout.tsx (single instance across all pages)
- Position: `fixed top-6 left-1/2 -translate-x-1/2`
- Width: `max-w-[96%] md:max-w-[1280px] xl:max-w-[1400px]`
- Glass: `bg-[#0A0A0A]/72 backdrop-blur-md border-white/10`
- Shape: `rounded-full`
- Layout: `justify-between` with absolutely-centered nav links
- Logo left, CTA right, links centered (desktop)
- Desktop links (4): Case, Om oss, **Tjänster**, Kontakt
  - Active: `text-white`, inactive: `text-white/65`, hover: `text-white`
  - **Tjänster**: Simple link to `/services`, active when `pathname.startsWith("/services")`
- Desktop CTA: tokenized (`--color-cta-primary`, `--color-cta-text`) and rounded-full
- Mobile drawer: dark (`bg-[#0A0A0A]/95`) with white text hierarchy
- Mobile backdrop: `bg-black/60`

### Base Band (Shared Background Wrapper)
- **Wrapper in layout.tsx**: `<div className="base-band">` wraps both PreFooterCTA + Footer
- **Shape**: Centered rounded slab card (`max-w: 1440px`, `border-radius: 24px`)
- **Theme switch**: `layout.tsx` sets `data-theme="espresso"` (reversible with `classic`)
- **Gradient**: layered espresso surface (dark top + controlled orange bottom glow)
- **Seam**: `border-t border-[var(--color-footer-seam)]` on Footer's inner div
- **Corner fill**: `background: var(--base-band-fill)`

### PreFooterCTA.tsx (Global)
- **Rendered globally** inside `.base-band` wrapper in layout.tsx
- Server component (CalendlyButton handles client interactions)
- Design: Centered CTA block with heading, subtext, and Calendly button
- Copy: "Visa oss en process - vi visar vad som går att automatisera"
- **Compact rhythm**: `py-14 md:py-16`, heading `text-4xl md:text-5xl`, body `max-w-[60ch]`
- **Transparent background**: gradient from `.base-band` shows through (espresso mode = light text)
  - Heading: `text-[var(--color-warm-text)]` (espresso active: `#F4F1EF`)
  - Body: `text-[var(--color-warm-text-muted)]`
  - Button: `CalendlyButton variant="warm"` with custom dark pill + subtle border/shadow

### Footer.tsx
- **Rendered globally** inside `.base-band` wrapper in layout.tsx
- Structure: Left brand/contact block + two link columns (Utforska, Företag)
- Brand block: Logo (`h-16 w-auto`) + **Kontakt** details (phone + email) + LinkedIn icon (`h-7 w-7`)
- **Transparent background**: gradient from `.base-band` shows through (espresso bottom)
- All text uses `text-white/*` opacity — intentional, sits on dark lower gradient
  - Column headings: `text-label !text-white/95`
  - Links: `text-white/90 hover:text-white`
  - Copyright: `text-white/66`
- Top seam: `border-t border-[var(--color-footer-seam)]`
- Bottom bar: `border-t border-[var(--color-footer-seam-soft)]`
- Bottom bar legal links:
  - `Användarvillkor` → `/villkor`
  - `Integritetspolicy` → `/integritetspolicy`

### About Page People Cards
- Layout: 2-column grid (1 col mobile, 2 cols lg+)
- Card class `.profile-card` (globals.css): warm parchment gradient surface `#F0EBE5→#E8E0D8→#DDD4C8` (160°), layered shadow system, orange border bloom on hover (`rgba(212,98,43,0.22)`)
- Profile images: `/1.svg` (Hai), `/2.svg` (Abdi) — SVGs are transparent (no white bg)
- Image container: `aspect-[4/4]` square, `overflow-hidden`, layered orange gradient background (radial bottom bloom + linear `#C8B8A8→#D4A882→#D4622B→#A03A18`)
- Image rendering: `object-contain object-bottom scale-[1.32–1.35] origin-bottom` — subjects scaled up from bottom anchor, no crop risk; hover bumps scale slightly
- Name `h3`: `color: #1A120E` (near-black espresso, darker than body text)
- Role `.text-label`: `color: var(--color-accent)` orange — brand hierarchy anchor
- Hairline divider between bio and contact details: `rgba(58,51,48,0.10)`
- Contact details: `text-sm text-[var(--color-text-body)]`, links `hover:text-[var(--color-text)]`
- LinkedIn icon: `absolute bottom-8 right-8`, h-6 w-6, opacity 50%→90%

### Services Page (Consolidated)
**Route**: `/services` (accessible via "Tjänster" link in nav)
- **Launch-ready**: 9 sections — Hero, Vad vi automatiserar, Så jobbar vi, Skräddarsydd automation, Support, Automationsresa, Resultat, FAQ, CTA
- Price card: `border border-[rgba(58,51,48,0.25)]` (heavier border signals hierarchy)
- Step numbers: `text-[var(--color-muted)]`
- FAQ: native `<details>`/`<summary>`, `focus-visible:ring-[rgba(58,51,48,0.30)]`
- CTA hierarchy: Tier 1 = `CalendlyButton primary` (book now). Tier 2 = underline `<Link>` to /contact.
- Anchor links use `text-[var(--color-muted)] hover:text-[var(--color-text)]`

**Subpage Redirects**: `/services/audit` and `/services/custom-build` → redirect to `/services`

### Homepage Hero (current state)
- **Full-bleed section**: `<section>` uses viewport-escape trick (`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen`) — not container-clipped
- **Layout**: 2-column split — `max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center`
  - Left: copy (h1, body, CTAs) — `items-start text-left`
  - Right: KiteHero — `hidden md:flex items-center justify-end` (no card wrapper — bare on gradient)
- **Background**: `HERO_BG = "hero-gradient-v1"` — absolute `inset-y-0`, `w-screen`, `background-size: cover`, `background-position: center top`
- **Text colors**: h1 `text-white`, body `text-white/85 font-medium`
- **H1 rolling word**: animated gradient span replaced by `<RollingWord />` (Client Component)
  - Cycles: "manuellt arbete" → "repetitivt arbete" → "det manuella" → "det onödiga" — 4s per word
  - `AnimatePresence mode="wait"` — `y: 35%→0%→-35%`, `opacity: 0→1→0`
  - Transition: `y` 0.36s expo-out `[0.16,1,0.3,1]`, `opacity` 0.24s ease-out
  - Clip container: `inline-block overflow-hidden align-bottom min-width: 14ch` — h1 never reflows
  - Gradient: `linear-gradient(95deg, #E8833A 0%, #F5A05A 45%, #D4622B 100%)`
  - `useReducedMotion` guard — static "manuellt arbete" when reduced motion preferred
- **CTAs**: primary (`Kontakta oss`) + `ghostDark` variant (`Se hur det funkar`)
- **Trust strip**: above ToolsTicker — centered eyebrow text flanked by `bg-white/15` hairlines, `text-white/45`

### Homepage Section Order (below hero)
PainOutcome → ROIBand → CasesSection → TimelineProcess → WhyKhyte

### CasesSection.tsx
- **Layout**: 2-col grid — testimonial card (left) + "Läs mer" placeholder (right), matched height
- **Testimonial card**: `bg-[var(--color-card-bg)] rounded-2xl overflow-hidden flex flex-col`
  - **Image area** (top): `aspect-[16/9]`, 5-layer radial gradient (espresso → amber → cream) + grain overlay (`mixBlendMode: overlay, opacity 0.18`)
  - **Collab lockup** (centered over image): "JaTack AB" (`clamp(28px,5vw,42px)`, weight 700, white, `-0.04em` tracking, text-shadow) → SVG `×` cross (14×14, diagonal lines, `opacity 0.40`) → Khyte logo (`height 64px`, white, `drop-shadow`)
  - **Note**: `khyte-logo-text.svg` bakes white pixels internally via `feColorMatrix` — CSS filter recoloring does not work reliably; keep white + drop-shadow for legibility
  - **Content area**: mono category label + real testimonial quote (Sebastian Andersson, JaTack AB)
  - **Attribution**: hairline divider + `sebastian.jpg` avatar (`w-14 h-14`, `object-cover`, `object-position: center top`) + name/role
- **Placeholder card**: `rounded-2xl border-2 border-dashed border-[var(--color-border)]` — arrow icon + "Läs mer om våra case", links to `/cases`
- **Dot indicator**: 2 dots below cards — active `bg-[var(--color-text)]`, inactive `bg-[var(--color-border)]`
- **Swap image**: replace gradient `<div>` with `<img src="/case-photo.jpg" className="w-full aspect-[16/9] object-cover shrink-0" />` when real photo is ready
- **Hero background**: `public/gradients/hero-gradient-v1.webp` (14KB) — bitmapped, zero paint cost
  - Source SVG preserved at `public/gradients/hero-gradient-v1.svg` (static, no SMIL/filters) — re-export with sharp if needed
  - **Layer stack in page.tsx** (all `aria-hidden`, `absolute`, `-z-10`, `pointer-events-none`):
    1. WebP base — `backgroundImage: url("/gradients/hero-gradient-v1.webp")`, `backgroundSize: cover`
    2. Vignette — `radial-gradient` crushes corners + `linear-gradient` darkens left/right edges
    3. Warm glow — `radial-gradient` ellipse at `28% 42%` (behind h1), `rgba(212,98,43,0.22)`
    4. Noise tile — `public/noise.webp` (128×128, 10KB), tiled `repeat`, `opacity: 0.045`, `mixBlendMode: screen`
  - **Performance**: SMIL animations removed, `feTurbulence` filters removed, no `willChange`/`contain` needed
  - **Re-export command**: `node -e "require('sharp')(fs.readFileSync('public/gradients/hero-gradient-v1.svg')).resize(1440,810).webp({quality:90}).toFile('public/gradients/hero-gradient-v1.webp', cb)"`

### KiteHero.tsx (Hero right column visual — ACTIVE)
- **SVG-based** — motion/react `motion.g` groups, `useAnimationFrame` loop, `useReducedMotion` guard
- **Geometry** (viewBox 0 0 400 560): Tip (200,60), Left (100,220), Right (300,220), Belly (200,400)
- **4 face panels**: each a triangle with independent linearGradient (orange top → dark espresso bottom)
- **Spar + spine**: white opacity lines; intersection dots at all 5 vertices
- **Tail**: 4 `motion.rect` segments hanging from belly, width/opacity cascade downward, independent x+y sine float (phase 0.30→1.50)
- **Tether string**: dashed bezier `M 200 400 C 170 480 80 550 -40 620` — sways inside main `motion.g`
- **Drop shadow**: separate `motion.g` (same MotionValues, same origin) — offset diamond `+14/+22px`, `rgba(0,0,0,0.30)` opacity 0.6, no filter
- **5 ember particles**: `motion.circle` rising upward from below kite, looping fade-in/out via modulo progress, independent sine sway, brand orange palette
- **Float**: kite body sin float ±13px @ 0.55 Hz, rotation ±3.2° @ 0.38 Hz
- **Reduced motion**: `useReducedMotion()` — early return in loop, static kite visible
- **No card wrapper** — bare SVG floats directly on hero gradient
- Mobile: `hidden md:flex` — not rendered on mobile
- **Perf (patched)**: ember `PARTICLES` array moved to `particlesRef` (init in `useEffect([])`), no per-frame allocation

### NodeGraph.tsx (Archived — replaced by KiteHero)
- Canvas-based node graph — see git history for details
- Still on disk at `src/components/NodeGraph.tsx`

### Form Inputs
- Height: `h-12` (matches buttons)
- Background: `var(--color-card-bg)`
- Border: `var(--color-border)`
- Radius: 4px
- Focus: `focus:ring-2 focus:ring-[var(--color-accent)]`

## Critical Production Data ⚠️
```
Email: hai@khyteteam.com
Phone: 070-099 68 38
Calendly: https://calendly.com/hai-khyteteam/30min
Formspree: https://formspree.io/f/xzznjaly
Domain: https://khyteautomations.com
```

## Client Components
Components requiring `"use client"`:
- `Nav.tsx` - usePathname, Calendly click
- `CalendlyButton.tsx` - Calendly popup
- `TimelineProcess.tsx` - IntersectionObserver
- `ToolsTicker.tsx` - Animation
- `NodeGraph.tsx` - rAF canvas loop (archived — replaced by KiteHero)
- `KiteHero.tsx` - motion/react hooks + useAnimationFrame ← ACTIVE
- `RollingWord.tsx` - AnimatePresence word cycle, useReducedMotion guard ← ACTIVE
- `PageTransition.tsx` - usePathname route watcher, scroll-to-top + fade-in ← ACTIVE
- `DataSweep.tsx` - rAF canvas loop (archived)
- `InteractiveGrid.tsx` - rAF canvas loop (archived)
- `WorkflowVisual.tsx` - motion/react + IntersectionObserver (archived)
- `VisualSection.tsx` - useRef for mouse tracking (archived)

## Motion Library
- Package: `motion` v12.34.3
- Import: `from "motion/react"` (always — no other path)
- Design rules: see `.claude/motion-design.md`

## Scroll & Performance
- **Lenis** v1.3.17 — smooth scroll, mounted globally via `src/components/SmoothScroll.tsx` (Client, renders null)
- Lenis ticks inside Motion's `frame.update` scheduler (`frame` from `motion/react`) — shares one RAF loop with KiteHero, no competing `requestAnimationFrame` calls
- **SmoothScroll cleanup**: `frame.cancelUpdate` / `frame.cancel` do not exist on `Batcher` type — cleanup is `lenis.destroy()` only (safe; Lenis handles its own RAF teardown)
- **KiteHero** pauses animation via `IntersectionObserver` when off-screen (`inView` state guard in `useAnimationFrame`)
- Hero bg div: `backgroundColor: "#1B0803"` fallback + `willChange: transform` + `translateZ(0)` for GPU promotion
- `html/body` baseline: `background-color: var(--color-bg)` set in globals.css to prevent white flash on first paint

## SEO Setup
- `metadataBase`: `https://khyteautomations.com`
- Title template: `"%s | Khyte Automations"`
- Canonical URLs per page
- JSON-LD: Organization, WebSite, Person schemas
- Sitemap: `/sitemap.xml`
- Robots: `/robots.txt`

## Calendly Integration
- CSS/JS loaded in layout.tsx (global)
- Trigger: `window.Calendly.initPopupWidget({ url })`
- Used in: Nav CTA, PreFooterCTA, Services page, Contact page

## Development
```bash
npm run build && npm run start  # Production (recommended)
npm run dev                     # Dev mode (Turbopack bug exists)
```

## Key Implementation Notes
1. **Nav is global** - rendered once in layout.tsx, no per-page `<Nav />` needed
2. **Base Band wrapper is global** - `<div className="base-band">` wraps PreFooterCTA + Footer in layout.tsx
3. **PreFooterCTA + Footer share one background** - both `bg-transparent`, gradient from `.base-band` shows through
4. **Theme mode is explicit** - `<html data-theme="espresso">` is set in layout.tsx (reversible to `classic`)
5. **Base-band is layered** - dark espresso top + controlled orange glow bottom + subtle grain overlay
6. **Footer text stays white** — sits on dark lower gradient; footer labels currently use `!text-white/95`
7. All pages use `pt-32` for fixed nav clearance
8. Swedish language throughout (`lang="sv"`)
9. No tailwind.config.ts — all config in globals.css `@theme`
10. Nav uses absolute positioning for centered links (requires `relative` on parent)
11. Small SVG icons use plain `<img>` instead of Next Image for simplicity
12. Pricing on /services: "25 000–120 000 kr, fast pris efter scope". Exact number set in förstudie.
13. Legal pages are live at `/integritetspolicy` and `/villkor`.

## Files to Know
| Purpose | File |
|---------|------|
| Design tokens | `src/app/globals.css` |
| Global metadata + layout | `src/app/layout.tsx` |
| Homepage | `src/app/page.tsx` |
| Services (consolidated) | `src/app/services/page.tsx` |
| Navigation | `src/components/Nav.tsx` |
| Global pre-footer CTA | `src/components/PreFooterCTA.tsx` |
| Global footer | `src/components/Footer.tsx` |
| Buttons | `src/components/Button.tsx` |
| Calendly button | `src/components/CalendlyButton.tsx` |
| Hero background (active) | `public/gradients/hero-gradient-v1.webp` |
| Hero gradient source SVG | `public/gradients/hero-gradient-v1.svg` |
| Noise tile | `public/noise.webp` |
| Hero right visual | `src/components/KiteHero.tsx` |
| Hero rolling word | `src/components/RollingWord.tsx` |
| Motion design rules | `.claude/motion-design.md` |
| Page transition | `src/components/PageTransition.tsx` |
| Client photo (Sebastian) | `public/sebastian.jpg` |
| Archived — node graph | `src/components/NodeGraph.tsx` |
| Archived — chaos→order sweep | `src/components/DataSweep.tsx` |
| Archived — interactive dot grid | `src/components/InteractiveGrid.tsx` |
| Archived — pipeline node row | `src/components/WorkflowVisual.tsx` |

## Performance Notes (v1.62)
- **Hero background**: WebP bitmap (`hero-gradient-v1.webp`) — zero SMIL, zero SVG filters, zero per-frame paint
- **KiteHero**: ember `PARTICLES` moved to `particlesRef`, init once in `useEffect([])` — no per-frame allocation
- **TimelineProcess**: `useEffect` deps `[]` + `observer.disconnect()` — one-shot IO, no re-registration
- **globals.css `@keyframes timelineScan`**: `left` → `translateX(350%)` — GPU-composited, no layout reflow
- **ToolsTicker**: `TICKER_ROW` at module scope — never recreated on re-render
- **Lenis**: single RAF loop via `frame.update` — verified correct, no duplicate schedulers

## Priorities (next up)

### P1 — World-class layout on all pages — make the design OURS
- Full visual pass: every page should feel unmistakably Khyte (warm espresso palette, tight typography, editorial spacing)
- Homepage: hero, sections, cards — all cohesive and premium
- Services, About, Cases, Contact: apply design system consistently, no generic patterns
- Replace any remaining placeholder UI, lorem spacing, or off-brand elements
- CasesSection: swap gradient image for real case photo when available (`/case-photo.jpg`)

### P2 — Add FAQ + social proof (COI) to homepage
- **FAQ section**: expandable `<details>` accordion (reuse Services FAQ pattern), Swedish copy, placed after WhyKhyte
- **COI / trust indicators**: logos, stats, or trust strip that signals credibility (client logos, numbers, badges)
- Ensure both sections feel native to the homepage rhythm — not bolted on

### P3 — Sharpen every page with our design system
- Services, About, Cases, Contact: audit against design tokens (colors, spacing, typography, button variants)
- Verify `.btn-cta` is on all primary actions, `text-label` on all eyebrows, section spacing consistent
- Eliminate any one-off inline styles that should be tokenized
- Mobile pass on all pages

### P4 — Nail our communication on the website
- Audit all copy for clarity, directness, and brand voice (confident, no hype, results-oriented)
- Hero h1, subheadline, section headers, CTA labels — all should feel earned and specific
- Replace placeholder/generic copy with real differentiators
- Ensure Swedish is natural and professional throughout

### P5 — CasesSection: real photo + Cases page
- Replace gradient image area with real case photo (`/case-photo.jpg`, `object-cover`)
- Cases page refinement to match CasesSection visual language

### P6 — "Vår vision" page
- New route `/vision` — standalone page communicating the long-term mission and values of Khyte
- Should feel editorial and personal, not corporate — who we are, why we do this, where we're going
- Add to nav or footer link as appropriate once live

### Backlog
- KiteHero: particle count / speed tuning (optional)
- String control point tuning for more natural sag at different viewport sizes
