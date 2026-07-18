# Khyte Automations - Current State (v2.22)

## Tech Stack
- **Next.js** 16.1.1 (App Router)
- **React** 19.2.1
- **TypeScript** 5 (Strict mode)
- **Tailwind CSS** v4 (config via `@theme` in globals.css)
- **Fonts**: Satoshi (Fontshare CDN, body — primary font globally), Barlow Condensed (Google Fonts, display/eyebrows — used in CalendlyDrawer). Barlow Body and Bebas Neue removed — were loaded but unused.
- **GeistSans removed** — was imported from `geist/font/sans`, injected `--font-geist-sans` globally and overrode Satoshi. Fully removed from layout.tsx.
- **GSAP**: `gsap` — installed for animations (ScrollTrigger, timelines, tweens). Core is free. No premium plugins used.
- **Vercel Analytics**: `@vercel/analytics` — `<Analytics />` injected in `layout.tsx`, tracks page views on Vercel deployments

## Project Structure
```
src/
├── app/
│   ├── page.tsx          # Landing (hero + sections) — see Homepage Layout Architecture below
│   ├── om-oss/page.tsx   # About page (was /about, 301 redirect in next.config)
│   ├── case/page.tsx     # Case studies (was /cases, 301 redirect in next.config)
│   ├── kontakt/page.tsx  # Contact form (was /contact, 301 redirect in next.config)
│   ├── integritetspolicy/page.tsx  # Integritetspolicy (legal page)
│   ├── villkor/page.tsx  # Användarvillkor (legal page)
│   ├── tjanster/
│   │   ├── page.tsx      # Services & pricing page (was /services, 301 redirect in next.config)
│   │   ├── audit/page.tsx          # Redirects to /tjanster
│   │   └── custom-build/page.tsx   # Redirects to /tjanster
│   ├── layout.tsx        # Root layout + metadata + Calendly script + CalendlyProvider + Nav
│   ├── globals.css       # Design tokens + animations
│   ├── sitemap.ts        # Dynamic sitemap
│   └── robots.ts         # Robots.txt
├── components/
│   ├── Nav.tsx              # Floating glass capsule nav (Client)
│   ├── Button.tsx           # Primary/secondary/ghostDark variants
│   ├── CalendlyButton.tsx   # Opens CalendlyDrawer via context (Client)
│   ├── CalendlyContext.tsx  # Global context — openCalendly() / closeCalendly() (Client)
│   ├── CalendlyDrawer.tsx   # Slide-in drawer with Calendly inline embed (Client)
│   ├── KhyteMap.leaflet-archived.tsx     # Archived: Leaflet + Stadia tiles map with custom marker + popup
│   ├── KhyteMapClient.leaflet-archived.tsx  # Archived: SSR-safe wrapper for Leaflet map
│   ├── PreFooterCTA.tsx     # Global pre-footer CTA
│   ├── Footer.tsx           # Global footer
│   ├── CaseCard.tsx         # Case card component
│   ├── Container.tsx        # Responsive max-width wrapper — max-w-[1200px] (see below)
│   ├── PageTransition.tsx   # Route-change: scroll-to-top + fade-in (Client)
│   ├── FAQAccordion.tsx     # FAQ accordion — grid-template-rows 0fr→1fr transition, compositor-only (Client) ← ACTIVE
│   ├── DnaWeaveSvg.tsx      # Animated SVG (unused on homepage)
│   ├── TimelineProcess.tsx  # Timeline with scan animation (Client)
│   ├── ToolsTicker.tsx      # Logo ticker (Client)
│   ├── NodeGraph.tsx        # Archived: canvas node graph (replaced by KiteHero)
│   ├── KiteHero.tsx         # Hero right-column: animated kite SVG (Client) ← ACTIVE
│   ├── HeroSection.tsx      # Hero extracted as client component (scroll-safe)
│   ├── AmbientParticles.tsx # Canvas particle emitter — drifting dots around visuals (Client) ← ACTIVE
│   ├── FloatingVisual.tsx   # Archived: sine-wave floating SVG wrapper (not in use)
│   ├── HeroStatementTransition.tsx  # Archived transition overlay (not in use)
│   ├── StatementZone.tsx    # Archived wrapper (not in use)
│   ├── WipeDivider.tsx      # Archived wipe divider (not in use)
│   ├── DiagonalScrollFade.tsx  # Archived diagonal mask wrapper (not in use)
│   ├── DataSweep.tsx        # Archived: chaos→order block sweep canvas (Client)
│   ├── InteractiveGrid.tsx  # Archived: proximity dot field canvas (Client)
│   ├── WorkflowVisual.tsx   # Archived: animated pipeline node row (Client)
│   ├── VisualSection.tsx    # Archived: InteractiveGrid + WorkflowVisual wrapper (Client)
│   └── sections/
│       ├── Statement.tsx    # Editorial headline + conviction cards (Client) — used on Om oss page inside Container (archived from homepage)
      ├── Statement.archived.tsx  # Archived copy of Statement.tsx
      ├── Manifesto.tsx    # Reusable pull-quote blockquote — "Målet är alltid detsamma..." — fade-in on scroll, accent orange highlights (Client)
│       ├── Statement.process-cards.archived.tsx  # Archived: zigzag/process cards variant (git 93819eb)
│       ├── FitCheck.archived.tsx  # Archived: full-bleed split-screen fit check (dark left / light right)
│       ├── AutomationShowcase.tsx  # Bento grid — transparent cards, pain-first copy, Lucide icons ← ACTIVE
│       ├── EditorialMetrics.concept.tsx  # Archived: espresso mesh + count-up metrics (replaced by ROI/COI bands in page.tsx)
│       ├── PainOutcome.tsx  # REMOVED from homepage — archived on disk
│       ├── ROIBand.tsx      # Archived: warm stats band — replaced by inline EspressoBand ROI/COI in page.tsx
│       ├── CasesSection.tsx # Testimonial card + "Läs mer" placeholder — now at page root (not inside Container), owns max-w-[1100px] internally
│       ├── ProcessSection.tsx  # Sticky 2-col process steps (Kartläggning→Pilot→Drift) ← ACTIVE (replaces WhyKhyte)
│       └── WhyKhyte.tsx     # Archived: 2×2 differentiator cards — replaced by ProcessSection
public/
├── khyte-logo-text.svg   # Main logo (white SVG, embedded PNG)
├── icons/                # Tool logos for ticker + social icons
└── *.png                 # Profile images
```

## Design Tokens (globals.css)

### Light Warm Theme (Global)
```css
--color-bg: #F8F6F3;               /* Warm off-white page background (cleaner, less grey) */
--color-card-bg: #F0EDE9;          /* Card background (slightly darker) */
--color-text: #3A3330;             /* Warm dark brown (headings) */
--color-text-body: #5A4F48;        /* Medium warm brown (body text) */
--color-muted: #9C8E82;            /* Warm taupe (secondary text, icons) */
--color-accent: #E8833A;           /* Bright orange (highlights, timeline) */
--color-border: rgba(58,51,48,0.12); /* Subtle warm border */
--font-sans: "Satoshi", var(--font-barlow-body), ui-sans-serif, system-ui, sans-serif;
--font-display: var(--font-barlow), sans-serif;  /* Barlow Condensed 700/800 — headings, eyebrows */
--font-bebas: var(--font-bebas), sans-serif;      /* Bebas Neue — available for lockups */
--border-width: 2px;               /* Content-facing card/input border thickness — change once, updates everywhere */
--radius-sm: 4px;                  /* Cards, inputs */
--spacing-section: 144px;          /* Desktop section spacing */
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

### Base Band Gradient (PreFooterCTA + Footer — Espresso mesh surface)
```css
--base-band-bg:
  /* blob A — large burnt orange, top-left, main anchor */
  radial-gradient(ellipse 70% 55% at 12% 18%, rgba(212,82,28,0.38) 0%, rgba(160,52,18,0.18) 45%, rgba(160,52,18,0) 100%),
  /* blob B — deep amber, center-right, sweeps inward */
  radial-gradient(ellipse 55% 60% at 88% 35%, rgba(180,64,20,0.22) 0%, rgba(140,44,14,0.10) 50%, rgba(140,44,14,0) 100%),
  /* blob C — warm copper, bottom-center, rises up */
  radial-gradient(ellipse 80% 45% at 50% 100%, rgba(194,78,30,0.32) 0%, rgba(140,48,16,0.14) 55%, rgba(140,48,16,0) 100%),
  /* blob D — dark sienna mid-left, depth shadow cavity */
  radial-gradient(ellipse 45% 50% at 28% 62%, rgba(90,22,8,0.45) 0%, rgba(90,22,8,0) 100%),
  /* blob E — faint amber glint, top-right corner */
  radial-gradient(ellipse 40% 30% at 82% 8%, rgba(220,100,40,0.12) 0%, rgba(220,100,40,0) 100%),
  /* base — espresso field */
  linear-gradient(160deg, #0E0401 0%, #1B0803 40%, #1F0904 70%, #2A0D06 100%);
```
- `.base-band` is a **centered rounded slab card**: `width: min(1440px, calc(100% - 32px))`, `margin: clamp(28px, 5vw, 64px) auto clamp(14px, 3vw, 28px)`, `border-radius: 24px`, `overflow: hidden`.
- `::before`: applies layered mesh gradient + `border: 1px solid var(--base-band-border)` + warm shadow/highlight tokens.
- `::after`: real film grain — `url('/noise.webp')` 128×128 tile, `opacity: 0.055`, `mix-blend-mode: screen`. Matches hero grain recipe.
- Footer seam uses tokenized color: `--color-footer-seam: rgba(244,241,239,0.12)`.

## Claude Skills System
Skills live in `~/.claude/skills/` and are invoked via `/skill-name` or triggered automatically. Each skill is a `skill.md` file with frontmatter (`name`, `description`) and a full instruction prompt.

- **`frontend-design`** — UI/component work. Enforces design quality, distinctive aesthetics, no generic AI-slop patterns.
- **`copywriting`** — Writing/rewriting copy for the site. Prioritizes clarity over cleverness, concrete over abstract, Swedish directness. No em dashes, no buzzwords, no filler openers.
- **`capture-intent`** — Captures ideas and intentions as lightweight INTENTIONS.md entries.
- **`simplify`** — Post-implementation code review. Finds and fixes duplication, dead code, over-engineering, and naming issues. Run after any significant implementation.
- **`framer-motion`** — Declarative React animations: entrances, layout transitions, scroll-triggered reveals, hover/tap, AnimatePresence mount/unmount. Includes when-to-use-vs-GSAP guidance.
- **`gsap`** — Imperative animation for complex timelines, ScrollTrigger scroll-scrubbed effects, SVG paths, and canvas. Next.js pattern: gsap.context() + ctx.revert() for cleanup.

**Copywriting conventions established:**
- No em dashes anywhere in site copy
- Body / subtitle text: `text-base font-medium color-text` (not muted, not small)
- Swedish copy: short punchy sentences, understatement over superlatives

## globals.css Utilities, Animations & Overlays
- **Global grain overlay**: `body::after` — `position: fixed, inset: 0, z-index: 9999, pointer-events: none, opacity: 0.04, mix-blend-mode: multiply`. Uses pre-baked `noise.webp` 128×128 tile (no live SVG filter). Hidden SVG grain filter removed from `layout.tsx`. Bitmap tile eliminates per-frame rasterization cost of live `feTurbulence`.
- `.base-band`: Rounded slab card with fluid mesh gradient via `::before`, real `noise.webp` film grain via `::after`, children `z-index: 1`
- `.text-label`: 13px, 700 weight, 0.05em tracking, uppercase, **`color: var(--color-text)`** (overridden in footer with `!text-white/95`)
- `.btn-cta`: Primary CTA gradient — `linear-gradient(180deg, #C96A24 0%, #B8521C 100%)`, white text, inset highlight/shadow, `brightness(1.10)` on hover with orange glow. Applied to `primary` + `warm` variants in Button + CalendlyButton, and Nav CTAs.
- `.page-enter`: Page fade-in animation — `pageFadeIn` keyframe, `opacity: 0 + translateY(6px)` → natural, 0.32s expo-out. Triggered on every route change via `PageTransition`.
- FAQ accordion is a React client component (`FAQAccordion.tsx`) — uses `grid-template-rows: 0fr→1fr` for expand/collapse (compositor-only, zero layout thrash). Easing: `220ms cubic-bezier(0.16,1,0.3,1)` row, `200ms` chevron. No `details`/`summary` — uses `button` + controlled grid wrapper. `useRef`/`scrollHeight` removed.
- `slideDown` keyframe still in globals.css but no longer used by FAQ.

## Typography System
- **Body**: Satoshi via Fontshare CDN — `font-weight: 500`, `font-size: 19px` base, `letter-spacing: -0.01em`, `subpixel-antialiased`
- **Display/Headings**: Barlow Condensed 700/800 via `--font-display` — used on most h1/h2 headings and eyebrow labels. Cases page uses `font-sans` (Satoshi) for headings instead — intentional per-page choice.
- **Bebas Neue**: loaded as `--font-bebas`, available for special lockups
- `.text-hero`: 600 weight, -0.035em tracking, 1.08 leading
- `.text-label`: 13px, 700 weight, 0.05em tracking, uppercase, `color: var(--color-text)`

## Component Standards

### Container.tsx
- **Fixed max-width**: `max-w-[1200px]` — flat across all breakpoints, no xl/2xl scaling. Standalone pages (case, kontakt) also use `max-w-[1200px]` directly.
- **Padding**: flat `px-6`
- **Always `mx-auto`** — centered on viewport. On ultrawide screens the whitespace is intentional (readable line length, premium feel).
- **CRITICAL**: Full-bleed sections (`w-screen`, viewport-escape trick) must NOT be children of Container. They must sit at page root. Statement is the one exception — its escape trick depends on Container being centered. See Homepage Layout Architecture.

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

### Nav.tsx (Floating Capsule + Hero Morph)
- **Rendered globally** in layout.tsx (single instance across all pages)
- **Homepage morph**: at `scrollY ≤ 80px`, nav expands to full-width transparent bar flush to top. On scroll it compresses into the floating pill. CSS transitions only — `0.7s cubic-bezier(0.16,1,0.3,1)` on all morphing properties. No morph on other pages.
  - Expanded state: `top: 0, width: 100%, max-width: 100%, border-radius: 0, background: transparent, backdrop-filter: none, border: transparent, box-shadow: none, padding: 20px 32px`
  - Compressed (pill) state: `top: 24px, width: 96%, max-width: 1400px, border-radius: 9999px, background: rgba(10,10,10,0.72), backdrop-filter: blur(12px), border: rgba(255,255,255,0.10), box-shadow: none, padding: 12px 32px` — shadow removed
  - Centering: `fixed left-0 right-0 mx-auto` (not `left-1/2 -translate-x-1/2` — required for clean width transition)
  - Scroll detection: boolean `scrolled` state, `useEffect` scroll listener with `{ passive: true }`, `isHome` guard
  - **Morph timing**: all transition properties at `0.5s cubic-bezier(0.16,1,0.3,1)` — tightened from 0.7s for a snappier feel without losing smoothness. No staggering between properties.
- **Pill state** (all other pages + scrolled homepage):
  - Glass: `bg-[#0A0A0A]/72 backdrop-blur-md border-white/10`
  - Shape: `rounded-full`
- Layout: `justify-between` with absolutely-centered nav links
- Logo left, CTA right, links centered (desktop)
- Desktop links (4): Case, Om oss, **Tjänster**, Kontakt — rendered via `.map()` array
  - Active: `text-white active` class + full-width orange underline sweep (`#D4622B`, 1.5px, `-bottom-[7px]`)
  - Hover: orange underline sweeps in left→right via `.nav-link span[aria-hidden]` CSS (`width: 0 → 100%`, `0.25s cubic-bezier(0.16,1,0.3,1)`) — defined in `globals.css`
  - Inactive: `text-white/65`, hover: `text-white`
  - **Tjänster**: Link to `/tjanster`, active when `pathname.startsWith("/tjanster")`
- Desktop CTA: `btn-cta` rounded-full
- Mobile drawer: dark (`bg-[#0A0A0A]/95`) with white text hierarchy, slide-in animation (`drawerSlideIn` 280ms cubic-bezier, respects `prefers-reduced-motion`) — **unchanged by morph logic**
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

### About Page (`/om-oss`)
- **Files**: `src/app/om-oss/page.tsx` (server — metadata only) + `src/app/om-oss/AboutContent.tsx` (client — all layout)
- **Hero**: Barlow Condensed bold (`font-display`) `clamp(3.125rem, 8.5vw, 7.125rem)`, "story." in accent orange, subtitle right, `border-b pb-10`. H1: "Vår story."
- **Structure**: Hero → Section 1 → Section 2 → Section 3 → Section 4 → Manifesto
  - **Section 1 — Ursprunget**: "Vart allt började." — full-width heading + lead paragraph (3 lines via `<br />`). Kicker line "Simpelt och utan onödigt strul." has a hand-drawn animated underline (SVG `motion.path`, draws left→right on scroll reveal, 0.6s ease-out, accent orange, `strokeWidth: 1.5`)
  - **Section 2 — Teamet**: "Och vilka är vi egentligen?" — 2-col grid, text left + photo right (`aspect-[4/5]`). Photo: `/pics/Hai & Abdi.jpeg`, `object-cover`
  - **Section 3 — Vad vi gör**: "Vad vi gör." — heading + concrete description of what Khyte builds and delivers
  - **Section 4 — Övertygelsen**: "Vad står vi för och varför?" — heading + conviction statement paragraph
  - **Manifesto**: pull-quote close (`py-10 md:py-14`)
- **Body text standard**: all paragraphs unified — `text-[1.2rem] leading-[1.7] text-[var(--color-text-body)] max-w-[60ch]`. No exceptions.
- **Animations**: scroll-triggered `whileInView` reveals on all headings + paragraphs, staggered by 80ms, `useReducedMotion` guard. `Reveal` wrapper component defined locally in `AboutContent.tsx`.
- **Section headings**: Barlow Condensed (`font-display`), fully `--color-text` (no orange splits), `clamp(2rem, 4.5vw, 3.5rem)`. No eyebrow labels.
- **Borders**: `border-b border-[rgba(58,51,48,0.18)]` between all sections
- **SEO notes**: canonical set, metadata title/description present, heading hierarchy correct. Missing: JSON-LD Person schema for Hai + Abdi (homepage has it, about page should reinforce). Metadata description could include "AI-automatisering" or "n8n" keyword. `aria-label` on `<section>` elements would help screen readers.

### Kontakt Page (`/kontakt`)
- **No Container wrapper** — uses `max-w-[1200px] mx-auto px-6` directly
- **No form** — direct contact info + map
- **Top block**: `grid-cols-[5fr_7fr]`, `min-height: 420px`, `border-t border-b border-[var(--color-border)]`
  - Left: h1 "Khyte Automations" (Barlow Condensed 700, `clamp(2.4rem, 4.5vw, 3.6rem)`), two eyebrow-labeled blocks — "Kontor" (address) and "Kontakt" (phone + email, underlined). LinkedIn icon below as standalone link, `h-6 w-6` black PNG. No border between left and right.
  - Right: Google Maps iframe — `p-6 md:p-10`, `rounded-xl` with border, `height: 300px`, `filter: grayscale(1) contrast(1.1) opacity(0.9)`
  - Eyebrow labels: `text-[12px] tracking-[0.16em] uppercase`, Barlow Condensed 600, `color-muted`
  - Phone + email: `text-base font-semibold`, underlined with `rgba(58,51,48,0.2)` decoration color
- **Team section**: "Vi bakom Khyte" h2 (Barlow Condensed 700, same size as h1), `pt-8 pb-24`, `mb-5` gap below heading
  - Cards: `rounded-2xl border border-[var(--color-border)]`, transparent bg (no fill class)
  - Image container: `aspect-[4/4]`, gradient `linear-gradient(160deg, #2C1A10→#4A2010→#8B3A12→#C8581A→#E89050→#F0A868)` — espresso-to-warm-orange diagonal
  - LinkedIn icons: `black-linkedin-icon.png`, `h-6 w-6`, `absolute bottom-8 right-8`, full opacity, fades on hover
  - Category labels (role): `color: var(--color-accent)`
  - Stat labels (Favorit-, Mobil:, Mejl:): `color: var(--color-text)` — darker than surrounding body text

### Cases Page (`/case`)
- **Layout**: 2-column card grid. Hero lockup above, cards below.
- **Hero**: `border-b pb-10 mb-10`, h1 Satoshi bold `clamp(3.5rem, 9vw, 7.5rem)` with "levererar." in accent orange. No eyebrow. Sub-copy inline (no forced `<br>`). Border uses `rgba(58,51,48,0.18)`.
- **Grid logic** (auto-adapts, no manual changes needed):
  - Total items = `cases.length + 1` (placeholder always appended)
  - **Odd total** → real cases in 2-col grid, placeholder centered at `max-w-[calc(50%-10px)]` below
  - **Even total** → all items including placeholder in full 2-col grid
  - Currently: 2 cases → total 3 (odd) → placeholder centered. Add 3rd case → total 4 (even) → 2×2 grid.
- **Case cards**: `rounded-2xl`, border `rgba(58,51,48,0.18)`, hover border+shadow `rgba(58,51,48,0.52)` (double-border effect via `box-shadow`). No background fill — page bg shows through. Transition on `border-color` + `box-shadow`.
  - Visual: `aspect-[16/10]`, gradient + grain overlay, scales `1.04` on hover
  - Divider: `1px` line between visual and text panel
  - Text panel: `p-6`, Satoshi bold company name, muted problem label, body description, "Läs mer" + arrow always visible in `--color-ink`
  - No index numbers shown
- **Placeholder card**: Mirrors real card structure exactly — `aspect-[16/10]` top area with "Under arbete" centered, divider, text panel with "Kommer snart". Dashed border. No background fill.
- **Active cases**: JaTack AB (Leadgenerering för listor), Observa Inkasso & Juridik (Automatisk research av befintlig data)
- **Archived layout** (Option B — alternating rows): preserved as JS block comment above `export default` in `case/page.tsx`. Uncomment to restore zigzag layout.

### Services Page (Consolidated)
**Route**: `/tjanster` (accessible via "Tjänster" link in nav; 301 redirect from `/services`)
- **Launch-ready**: 9 sections — Hero, Vad vi automatiserar, Så jobbar vi, Skräddarsydd automation, Support, Automationsresa, Resultat, FAQ, CTA
- Price card: `border border-[rgba(58,51,48,0.25)]` (heavier border signals hierarchy)
- Step numbers: `text-[var(--color-muted)]`
- FAQ: native `<details>`/`<summary>`, `focus-visible:ring-[rgba(58,51,48,0.30)]`
- CTA hierarchy: Tier 1 = `CalendlyButton primary` (book now). Tier 2 = underline `<Link>` to /kontakt.
- Anchor links use `text-[var(--color-muted)] hover:text-[var(--color-text)]`

**Subpage Redirects**: `/tjanster/audit` and `/tjanster/custom-build` → redirect to `/tjanster`

## Homepage Layout Architecture

The homepage (`src/app/page.tsx`) uses an **alternating root/Container pattern** — full-bleed sections sit directly at the page root, content-width sections are wrapped in `<Container>`. The root `<div>` has `overflow-x-hidden` as a Windows scrollbar safety net.

**Section order**: Hero → Process → ROI Band → COI Band → Automation Showcase → Cases → FAQ
*(Statement archived — revert comment in page.tsx)*

```
<div overflow-x-hidden>                     ← page root (Hero only)

  <section w-screen>                        ← 1. Hero (full-bleed, at root)

</div>

<ProcessSection />                          ← 2. Process — OUTSIDE overflow-x-hidden (sticky requires it)
                                               Desktop: 3-col card grid
                                               Mobile: 300vh scroll-driven stacked card deck, sticky panel

<div overflow-x-hidden>                     ← resumes for remaining sections

  <EspressoBand>                            ← 4. ROI + COI — single espresso band, two stacked sections
                                               ROI: copy left / cloudsleep visual right (circle stage + orange particles)
                                               COI: timeslipping visual left / copy right (shadow vignette + silver particles)
                                               Split-metric typography: huge num + tiny muted unit
                                               Stats: 3-15h/vecka · 3-6 månader · 0kr driftstopp (ROI)
                                                      3-15h/vecka · 4 av 10 leads · 365 dagar/år (COI)

  <AutomationShowcase />                    ← 5. Bento grid — transparent cards, pain-first copy, Lucide icons
                                               max-w-[1100px] container inside component

  <CasesSection />                          ← 6. Testimonials — at page root, owns max-w-[1100px] internally, id="cases"

  <div w-full border-t>                     ← 7. FAQ — FAQAccordion client component, real height transition
    <div max-w-[1100px]>
```

**EspressoBand**: local server component in `page.tsx` — wraps children with `bg-[#1B1613]` warm espresso charcoal base + `noise.webp` grain (`opacity: 0.055 mix-blend-mode: screen`). Previously used `bg-[#1B0803]` + `hero-gradient-v1.webp` — hero webp removed, replaced with per-visual burnt-orange radial atmosphere blobs. Eliminates gradient/grain duplication between ROI and COI.

**Why this structure:**
- The viewport-escape trick (`-ml-[50vw] -mr-[50vw] w-screen`) only works when the parent is centered on the viewport with zero horizontal offset. Nesting full-bleed sections inside Container (especially with padding) shifts `left: 50%` from viewport center to container center — causing sideways drift at large viewports.
- Exception: `Statement` uses the escape trick for its inner band and stays inside Container. Container's `mx-auto` keeps it viewport-centered, making the escape math correct. **Do not move Statement outside Container.**

### Hero (current state)
- **Full-bleed `<section>`** at page root — `w-screen`, no Container, no escape trick
- **BG layers**: 4 divs with `absolute inset-0` (not `inset-y-0 left-1/2 w-screen` — that was only needed when hero was inside Container)
  1. WebP base — `hero-gradient-v1.webp`, `backgroundSize: cover`, `backgroundColor: "#1B0803"` fallback
  2. Vignette — radial crushes corners + linear darkens left/right edges
  3. Warm glow — radial at `28% 42%`, `rgba(212,98,43,0.22)` (behind h1)
  4. Noise tile — `noise.webp` 128×128, `opacity: 0.045`, `mixBlendMode: screen`
- **Hero grid**: `max-w-[1100px] 2xl:max-w-[1320px] mx-auto px-4 md:px-6 xl:px-12`
  - Matches Container base width; only scales at 2xl (1536px+) for modest ultrawide breathing room
  - Gap: `gap-10 md:gap-12` (tighter than before — copy and kite closer together for better hierarchy)
  - Left: h1 + body + CTAs
  - Right: KiteHero (`hidden md:flex`)
- **H1**: `text-[2.25rem] md:text-[3.25rem] lg:text-6xl xl:text-[3.6rem] 2xl:text-[4rem]`, `.text-hero` (600 weight, -0.035em, 1.08 lh)
- **H1 rolling word**: `<RollingWord />` — italic + `font-bold` gradient span; cycles "manuellt arbete" → "repetitivt arbete" → "det manuella" → "det onödiga"
- **Subheadline**: `text-lg md:text-xl text-white/85 font-medium max-w-[480px] leading-relaxed`
- **Mobile accent**: 3 cascading orange dots (`md:hidden`) below CTAs
- **CTAs**: `primary` (Kontakta oss) + `ghostDark` (Se hur det funkar)
- **Trust strip**: above ToolsTicker — `mt-20`, centered eyebrow text + `bg-white/15` hairlines

### Statement.tsx (Client Component)
- **Full-bleed white band** — pure `#ffffff` background, hairlines top/bottom.
- **DEPENDENCY**: Must stay inside `<Container>`. Viewport-escape trick (`-ml-[50vw] -mr-[50vw] w-screen`) requires a viewport-centered parent.
- **Editorial headline** (locked, left-aligned): `text-4xl/5xl/6xl`, two-tone — `font-bold text-[var(--color-text)]` first line, `font-medium text-[var(--color-muted)]` second. `leading-[1.08]`, `tracking-[-0.03em]`. Fades in with `y: 10` on scroll entry.
- **Manifesto block** (centered, below headline):
  - `text-3xl md:text-4xl lg:text-5xl font-normal text-[var(--color-text)]`, `leading-[1.3]`, `tracking-[-0.03em]`, `text-center`
  - First sentence: `whitespace-nowrap` — never wraps. Accent underline: `underline decoration-[var(--color-accent)] decoration-2 underline-offset-[8px]`
  - Second sentence: `max-w-[40ch] text-balance mt-1` — wraps naturally
  - Both sentences unified color — no color split between them
  - Animation: `useInView` trigger, pure opacity fade (`once: true, margin: "-80px"`), `useReducedMotion` guard
- **Inner content**: `max-w-[1280px]`, `pt-24/pt-32`, `pb-20/pb-28`
- `"use client"` required — motion/react, useInView

### ROI + COI Band (inline in page.tsx — ACTIVE, single EspressoBand)
- **`EspressoBand`** — `bg-[#1B1613]` warm espresso charcoal + `noise.webp` grain only (hero webp removed).
- **Single band** — ROI and COI stacked inside one `EspressoBand`, separated by `border-t border-white/10`.
- **Layout**: each row is `relative min-h-[480px] flex items-center` — copy block (`max-w-[500px] z-10`), visuals `absolute` positioned outside grid constraints.
- **Split-metric typography**: huge number (`font-display text-4xl md:text-5xl text-white tracking-wide uppercase`) + unit (`text-sm text-white/70 uppercase tracking-widest`). H2 `text-2xl md:text-3xl text-white/70 mb-16` (muted, creates hierarchy gap). Metrics `gap-12`, left-rail `border-l border-white/10 pl-8`.
- **ROI**: copy left, `cloudsleep.svg` absolute `right-[-140px]` (desktop) — burnt-orange radial atmosphere blob + `AmbientParticlesLazy` (warm orange, count 7) + dark rust circle stage. SVG `w-[600px] md:w-[700px] -translate-y-6`. **Mobile**: SVG shown below copy in `h-[260px]` strip with radial glow, `w-[320px] opacity-80`.
- **COI**: copy right, `timeslipping.svg` absolute `left-[-200px]` (desktop) — same blob + `AmbientParticlesLazy` (silver, count 9) + white radial glow anchor. SVG `w-[660px] md:w-[780px] translate-x-8`. **Mobile**: SVG shown below copy in `h-[260px]` strip, `w-[320px] opacity-75`.
- **Both visuals**: `filter: grayscale(1) brightness(1.25) drop-shadow(2px 5px 6px rgba(0,0,0,0.55))`. Mobile versions use `brightness(1.3)`.
- **`AmbientParticles` hidden on mobile** — both instances remain `hidden md:flex`.
- **ROIBand.tsx**: archived on disk, no longer used

### ROIBand.tsx (Archived)
- Replaced by inline EspressoBand ROI/COI in `page.tsx`

### CasesSection.tsx
- **Header**: h2 big (`text-3xl/4xl`) on top, `.text-label` eyebrow below — reversed from standard pattern
- **Layout**: 2-col grid — testimonial card (left) + "Läs mer" placeholder (right), matched height
- **Testimonial card**: `bg-[var(--color-card-bg)] rounded-2xl overflow-hidden flex flex-col`
  - **Image area** (top): `aspect-[16/9]`, 5-layer radial gradient (espresso → amber → cream) + grain overlay (`mixBlendMode: overlay, opacity 0.18`)
  - **Collab lockup** (centered over image): "JaTack AB" (`clamp(28px,5vw,42px)`, weight 700, white, `-0.04em` tracking, text-shadow) → SVG `×` cross (14×14, diagonal lines, `opacity 0.40`) → Khyte logo (`height 64px`, white, `drop-shadow`)
  - **Note**: `khyte-logo-text.svg` bakes white pixels internally via `feColorMatrix` — CSS filter recoloring does not work reliably; keep white + drop-shadow for legibility
  - **Content area**: mono category label + real testimonial quote (Sebastian Andersson, JaTack AB)
  - **Attribution**: hairline divider + `sebastian.jpg` avatar (`w-14 h-14`, `object-cover`, `object-position: center top`) + name/role
- **Placeholder card**: `rounded-2xl border-2 border-dashed border-[var(--color-border)]` — arrow icon + "Läs mer om våra case", links to `/case`
- **Dot indicator**: removed
- **Outside links**: removed — "SE ALLA CASE" desktop header link and mobile link both removed.
- **Swap image**: replace gradient `<div>` with `<img src="/case-photo.jpg" className="w-full aspect-[16/9] object-cover shrink-0" />` when real photo is ready

### Case Overview Page (`/case`)
- **Full rebuild** — replaced flat Problem/Build/Result card grid with editorial overview
- **Hero**: Barlow `font-display` uppercase headline "ARBETE SOM / FAKTISKT / LEVERERAR." (`clamp(2.75rem,6vw,5rem)`, `lineHeight: 0.95`) left + short descriptor right on desktop. `section-eyebrow` above. Separated from grid by `border-b border-[var(--color-border)]`.
- **Grid**: 3-column `md:grid-cols-3 gap-x-8`, `items-start`. Middle card staggered down via `md:mt-24` — editorial rhythm from reference (Design 2 / Kinetic Volumes).
- **Card anatomy**: `aspect-[4/5]` portrait visual + `section-eyebrow` (index — category) + `font-display` title + one-liner hook. Arrow icon fades in on hover. Hover: gradient scales `1.04` via `transition-transform duration-700`.
- **Gradients** (abstract, placeholder until real screenshots):
  - Card 1 (Lead Engine): warm orange-amber — matches CasesSection testimonial palette
  - Card 2 (Lead-lista): deep espresso-to-copper — clearly distinct, darker
  - Card 3 (Inbox Zero): muted gray, `opacity-45`, `cursor-default`, "Kommer snart" overlay — non-interactive placeholder
- **Grain overlay**: inline SVG `feTurbulence` data URI on each card visual, `mixBlendMode: overlay`
- **Cases** (2 live + 1 placeholder):
  - `/case/lead-engine` — "Lead Engine" — Sälj & Prospektering — "Säljteamet öppnar ett Sheet. Listan är redan där."
  - `/case/lead-lista` — "Lead-lista" — Research & Analys — "Research som tog en fredag görs nu på ett par minuter."
  - Placeholder: "Inbox Zero" — E-post & Uppföljning — "E-post som följer upp sig självt."
- **Bottom CTA**: `border-t` divider, left copy + right arrow link to `/kontakt`
- **Slugs**: `/case/lead-engine` and `/case/lead-lista` — wired as placeholders, individual article pages not yet built
- **Swap visuals**: replace gradient `<div>` with `<img>` screenshot when ready — same `aspect-[4/5]` container

### PainOutcome.tsx
- `mb-24 md:mb-32` (tighter than `--spacing-section` — pulls closer to ROIBand thematically)
- "Med Khyte" column: `md:border-l-2 md:border-l-[var(--color-accent)]` orange accent bar + `md:bg-[rgba(232,131,58,0.04)]` warm tint

### WhyKhyte.tsx (Archived — replaced by ProcessSection)
- Replaced by `ProcessSection.tsx` in homepage
- File on disk, not rendered

### ProcessSection.tsx (Homepage process steps — ACTIVE)
- **`"use client"`** — requires Framer Motion hooks
- **Desktop**: unchanged 3-col card grid on `bg-[var(--color-bg)]`, `hidden md:grid`, `max-w-[1600px] mx-auto`
- **Mobile**: scroll-driven card deck (`MobileCardDeck` component) — `300vh` tall scroll container, `sticky top-[72px]` panel that pins header + cards + dots + Om oss link. Cards are absolutely stacked; scroll progress (`useScroll` target) drives `useTransform` x/rotate/opacity to deal each card off to the right.
  - Card 0 exits during scroll 0→33%, card 1 during 33→66%, card 3 revealed at rest
  - Stack depth: cards 1+2 inset via `top/left/right` offsets (not translateY) to stay within container bounds
  - Progress dots: `ProgressDots` component takes `scrollYProgress`, derives per-dot opacity via `useTransform`
  - `useReducedMotion` guard — static stack fallback
  - Sticky panel offset: `top-[72px]`, `height: calc(100vh - 72px)` — clears the fixed nav pill
- **IMPORTANT**: ProcessSection must sit **outside** any `overflow-x-hidden` parent — that CSS property breaks `position: sticky`. In `page.tsx` it sits between two separate `overflow-x-hidden` divs.
- **Split header**: H2 `font-display text-[3rem] md:text-[4.5rem]` — `TRE` dark + `STEG.` `#D4622B`. Desktop: "OM OSS →" link right-aligned. Mobile: "OM OSS →" below cards inside sticky panel.
- **Cards**: `rounded-[28px] p-6`, `bg-[var(--color-bg)]`, `border: var(--border-width) solid var(--color-border)`
- **Steps**: Kartläggning → Implementering → Support & förbättring

### Weaponized Typography System (ACTIVE)
- **Font**: `Barlow_Condensed` weight 700+800, `latin-ext` subset — imported via `next/font/google`, variable `--font-barlow`, Tailwind utility `.font-display` (`font-weight: 800, line-height: 1.15`)
- **Eyebrow**: `.section-eyebrow` — `inline-flex`, 6×6px `currentColor` **dot** (circle, `border-radius: 50%`) + 11px tracked amber caps (`#D4622B`), `margin-bottom: 0` (flush to h2)
- **Section h2 size**: `text-[2.5rem] md:text-[3.5rem]` across AutomationShowcase, CasesSection, ROI/COI bands, FAQ
- **Two-line pattern**: first line solid (white on dark, `--color-text` on light), second line in orange (`#D4622B` on light, `#E8833A` on dark)
- **Orange split**: `STEG.` is `color: #D4622B` — same two-line orange pattern as other sections. `TRE` is solid `text-[var(--color-text)]`.
- **Hydration fix**: `RollingWord` renders static `WORDS[0]` on SSR, swaps to animated `AnimatePresence` after mount via `useState(false)` + `useEffect`

### FAQ (inline in page.tsx — ACTIVE)
- Own `w-full border-t border-[var(--color-border)]` section on `var(--color-bg)`, `py-[--spacing-section]`
- **Header**: `.section-eyebrow` + `.font-display` h2 two-line, orange second line
- **Accordion**: `<FAQAccordion />` client component — `bg-transparent rounded-2xl` cards, `border-[var(--color-border)]`, `gap-2`
- **Animation**: `grid-template-rows: 0fr→1fr`, `380ms cubic-bezier(0.16,1,0.3,1)`. Chevron same curve. Answer text: `color-text-body font-medium`. Question text: Geist `font-semibold tracking-[-0.01em]`
- **Animation**: `grid-template-rows: 0fr→1fr`, `220ms cubic-bezier(0.16,1,0.3,1)`. Chevron `200ms` same curve.
- **Questions (4)**: Vad kostar det? / Hur lång tid tar det? / Behöver vi ändra hur vi jobbar? / Kan ni integrera med vårt system?

### FitCheck.tsx (Homepage fit check — ACTIVE)
- **Full-bleed split-screen** at page root (outside Container) — `w-full flex flex-col md:flex-row`
- **Left half** (`flex-1 bg-[#1B0803]`): espresso dark, white text, orange accent dashes. Content right-aligned via `md:justify-end` + `max-w-[460px]` — pulls toward center divide.
- **Right half** (`flex-1 bg-[var(--color-card-bg)]`): warm light, `text-body` text, muted dashes at `opacity-50`. Content left-aligned via `md:justify-start` + `max-w-[460px]`.
- **Typography**: `.text-label` eyebrows, `text-base leading-relaxed` bullets, `py-20 md:py-24 px-8 md:px-16 xl:px-20`.
- **Bullets**: `<span block w-4 h-[2px]>` geometric bars (no rounded corners) — orange on left, muted on right.
- Server Component — no `"use client"` needed.

### EditorialMetrics.concept.tsx (Archived)
- Replaced by ROI + COI `EspressoBand` sections inline in `page.tsx`
- File on disk, import commented out — revert: uncomment `import EditorialMetrics` and add `<EditorialMetrics />` after Statement

### AutomationShowcase.tsx (Homepage bento grid — ACTIVE)
- **Full-width divider**: `border-t border-[var(--color-border)]` on section
- **Brutalist CTA**: bottom-right "UTFORSKA VÅRA CASES →" link to `#cases` — `font-display text-sm font-bold tracking-[0.2em] uppercase`
- **Transparent cards** (`bg-transparent`) with `border border-[var(--color-border)]` — page grain flows through, "drawn on" feel
- **Self-contained** — `max-w-[1100px] mx-auto px-6` inside the component (sits at page root, not in Container)
- **Section header**: eyebrow "AUTOMATISERING", H2 "SLUTA SLÖSA TID. / PÅ DET SOM GÅR ATT AUTOMATISERA." (font-display, orange second line), subline below
- **Bento grid**: `grid-cols-1 md:grid-cols-2 gap-3` — Card 01 full-width (`md:col-span-2`), Cards 02+03 half-width
- **Card anatomy**: Lucide icon inline with title (`w-5 h-5 text-[var(--color-muted)]` strokeWidth 2) → body text. Step numbers removed.
- **Lucide icons**: `RefreshCw` (dataöverföring), `Inbox` (ärendehantering), `BarChart3` (rapporter) — naked, no background shapes
- **Content**: pain-first framing — "Samma data, tre system, varje dag", "Ärenden som ingen äger", "Rapporten som tar hela fredagen". Rewritten copy: concrete, direct, no em dashes. Body text: `text-base font-medium color-text`. No metrics (reserved for case pages).
- **Deliberate void**: top card right side left empty — asymmetrical negative space as editorial choice
- Server Component — no `"use client"` needed. Depends on `lucide-react`.

### TimelineProcess.tsx (Archived from homepage)
- Component file on disk, not rendered on `page.tsx`. Still used on other pages if needed.

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
- **Perf (patched)**: ember `PARTICLES` array moved to `particlesRef`, init once in `useEffect([])` — no per-frame allocation

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
Email: hai@khyte.se / abdi@khyte.se
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
- `AmbientParticles.tsx` - canvas rAF loop, drifting particles around visuals ← ACTIVE
- `AmbientParticlesLazy.tsx` - thin `"use client"` wrapper for `dynamic(() => import AmbientParticles, { ssr: false })` — required because page.tsx is a Server Component ← ACTIVE
- `NoiseTexture.tsx` - SVG `feTurbulence` fractal noise component (unused — all noise overlays use `noise.webp` 128×128 tile for perf)
- `RollingWord.tsx` - AnimatePresence word cycle, useReducedMotion guard ← ACTIVE
- `PageTransition.tsx` - usePathname route watcher, scroll-to-top on nav (skips first render) + fade-in ← ACTIVE
- `FAQAccordion.tsx` - useState open toggle, grid-template-rows animation ← ACTIVE
- `Statement.tsx` - motion animations, useInView ← used on Om oss page
- `Manifesto.tsx` - motion/react, useInView ← reusable pull-quote, used on Om oss page
- `DataSweep.tsx` - rAF canvas loop (archived)
- `InteractiveGrid.tsx` - rAF canvas loop (archived)
- `WorkflowVisual.tsx` - motion/react + IntersectionObserver (archived)
- `VisualSection.tsx` - useRef for mouse tracking (archived)

## Motion Library
- Package: `motion` v12.34.3
- Import: `from "motion/react"` (always — no other path)
- Design rules: see `.claude/motion-design.md`

## Scroll & Performance
- **Scroll restoration**: minimal inline script in `<head>` sets `history.scrollRestoration='manual'` and `window.scrollTo(0,0)` — ensures top-of-page on hard refresh with no sessionStorage I/O. No scroll listener. `PageTransition.tsx` handles scroll-to-top on client-side route changes.
- **Lenis removed** — native scroll only. Faster, zero JS overhead on wheel events.
- **KiteHero** pauses animation via `IntersectionObserver` when off-screen (`inView` state guard in `useAnimationFrame`)
- Hero bg divs: `absolute inset-0` — GPU-promoted, zero layout cost
- `html/body` baseline: `background-color: var(--color-bg)` set in globals.css to prevent white flash on first paint

## SEO Setup
- `metadataBase`: `https://khyteautomations.com`
- Title template: `"%s | Khyte Automations"`
- Canonical URLs per page (Swedish routes: `/`, `/tjanster`, `/case`, `/om-oss`, `/kontakt`, `/integritetspolicy`, `/villkor`)
- JSON-LD: Organization, ProfessionalService (LocalBusiness w/ Borås address, geo, areaServed, priceRange, openingHours), WebSite, Person, FAQPage (5 Q&As) schemas
- Sitemap: `/sitemap.xml` — 7 routes (was 4; added `/tjanster`, `/integritetspolicy`, `/villkor`)
- Robots: `/robots.txt`
- 301 redirects: `/services→/tjanster`, `/cases→/case`, `/about→/om-oss`, `/contact→/kontakt`, `/automations→/` (in `next.config.ts`)

## Calendly Integration
- **Script loaded on-demand** — injected by `CalendlyDrawer` on first drawer open, not in layout.tsx
- Widget initialised via `window.Calendly.initInlineWidget({ url, parentElement })` inside the drawer
- Trigger: `openCalendly()` from `CalendlyContext` — used in Nav CTA, PreFooterCTA, CalendlyButton
- `CalendlyProvider` wraps the full app in layout.tsx; `CalendlyDrawer` renders globally alongside Nav

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
12. Pricing on /tjanster: "25 000–120 000 kr, fast pris efter scope". Exact number set in förstudie.
13. Legal pages are live at `/integritetspolicy` and `/villkor`.
14. **Full-bleed sections belong at page root** — never nest `w-screen` / viewport-escape sections inside `<Container>`. Statement is the one exception (see Homepage Layout Architecture).
15. **ROIBand needs `relative`** — its inner `absolute inset-0` gradient anchors to it; removing `relative` causes the gradient to escape to the nearest positioned ancestor.

## Visuals
| File | Used in |
|------|---------|
| `public/visuals/cloudsleep.svg` | ROI band — man sleeping on cloud, right side |
| `public/visuals/timeslipping.svg` | COI band — melting clock, left side |
| `public/visuals/freedom.svg` | Archived (replaced by cloudsleep) |
| `public/visuals/timeonside.svg` | Unused |

## Files to Know
| Purpose | File |
|---------|------|
| Design tokens | `src/app/globals.css` |
| Global metadata + layout | `src/app/layout.tsx` |
| Homepage | `src/app/page.tsx` |
| Services (consolidated) | `src/app/tjanster/page.tsx` |
| Navigation | `src/components/Nav.tsx` |
| Global pre-footer CTA | `src/components/PreFooterCTA.tsx` |
| Global footer | `src/components/Footer.tsx` |
| Buttons | `src/components/Button.tsx` |
| Calendly button | `src/components/CalendlyButton.tsx` |
| Responsive content wrapper | `src/components/Container.tsx` |
| Hero background (active) | `public/gradients/hero-gradient-v1.webp` |
| Hero gradient source SVG | `public/gradients/hero-gradient-v1.svg` |
| Noise tile | `public/noise.webp` |
| Hero right visual | `src/components/KiteHero.tsx` |
| Hero rolling word | `src/components/RollingWord.tsx` |
| Editorial statement + conviction cards | `src/components/sections/Statement.tsx` |
| Pull-quote manifesto (reusable) | `src/components/sections/Manifesto.tsx` |
| Process steps (sticky 2-col) | `src/components/sections/ProcessSection.tsx` |
| Ambient particles (visuals) | `src/components/AmbientParticles.tsx` |
| Fit check split-screen | `src/components/sections/FitCheck.tsx` |
| Automation showcase (sticky layout) | `src/components/sections/AutomationShowcase.tsx` |
| Motion design rules | `.claude/motion-design.md` |
| Page transition | `src/components/PageTransition.tsx` |
| Client photo (Sebastian) | `public/sebastian.jpg` |
| Archived — node graph | `src/components/NodeGraph.tsx` |
| Archived — chaos→order sweep | `src/components/DataSweep.tsx` |
| Archived — interactive dot grid | `src/components/InteractiveGrid.tsx` |
| Archived — pipeline node row | `src/components/WorkflowVisual.tsx` |

## Performance Notes (v2.22)
- **Lenis removed** — native scroll, no JS on wheel events
- **Hero background**: WebP bitmap (`hero-gradient-v1.webp`) — zero SMIL, zero SVG filters, zero per-frame paint. BG layers use `absolute inset-0`. Preloaded via `<link rel="preload" as="image">` in layout.tsx head.
- **KiteHero**: `particlesRef` init once in `useEffect([])`. Uses `useAnimationFrame` + `useMotionValue` (motion/react) for continuous sine-driven float. RAF pauses when off-screen via `IntersectionObserver` + `inView` state guard. `motion/react` import retained — CSS keyframes were tried but produced choppy mechanical motion vs smooth sine.
- **TimelineProcess**: `useEffect` deps `[]` + `observer.disconnect()` — one-shot IO, no re-registration
- **globals.css `@keyframes timelineScan`**: `left` → `translateX(350%)` — GPU-composited, no layout reflow
- **body::after grain**: no `transform`/`isolation` — kept simple to avoid breaking `position: fixed` on nav
- **`.main-wrapper`**: no `contain: paint` — removed because it breaks `position: fixed` on nav (creates containing block)
- **ToolsTicker**: `TICKER_ROW` at module scope — never recreated on re-render. Repeats reduced 10→4, duration recalculated to 192s (same px/s speed). Explicit `width={48} height={48}` on logos for CLS prevention.
- **Statement**: pure `useInView` scroll trigger — no ResizeObserver, no dot positions.
- **sebastian.jpg**: resized 800×800 → 112×112 (95KB → 2.9KB), displayed at 56×56 with 2× retina density. Explicit `width`/`height` on `<img>`.
- **noise.webp**: recompressed 9.9KB → 5.4KB (quality 10, grain overlay at 12% opacity)
- **Calendly script**: injected on-demand in `CalendlyDrawer` on first drawer open — not loaded globally. Saves ~100KB+ parse/eval on every page load for users who never open the drawer.
- **Fontshare CSS**: `rel="stylesheet"` (blocking) — Satoshi is above-fold primary font; async swap causes visible FOUT. `preconnect crossOrigin="anonymous"` for CORS reuse. `dns-prefetch` on `cdn.fontshare.com`.
- **Khyte logo**: preloaded via `<link rel="preload" as="image" fetchPriority="high">` — logo is LCP element on mobile.
- **GTM**: `strategy="lazyOnload"` — fires at browser idle. TBT dropped 570ms → 90ms.
- **AmbientParticles**: RAF fully cancels (`cancelAnimationFrame`) when off-screen — no idle spinning. Per-frame `createRadialGradient` replaced with pre-baked offscreen canvas sprites stamped via `drawImage`. Delta capped at 50ms to prevent spike after tab switch.
- **Dead deps removed**: `lenis`, `leaflet`, `react-leaflet`, `@types/leaflet`, `geist`, `claude`, `DM_Serif_Display` font — all removed.
- **Barlow fallback weights**: trimmed 5→2 (400+500 only) — fallback for Satoshi, not primary font.
- **SVG visuals**: `cloudsleep.svg` + `timeslipping.svg` have explicit `width`/`height` + `loading="lazy"` (below-fold, desktop-only).
- **html font-size**: `19px` set as bare unlayered rule (outside `@layer`) — previously `18px` inside `@layer utilities` was silently overridden by the unlayered cascade and never applied.
- **browserslist**: `package.json` targets last 2 versions of Chrome/Firefox/Safari/Edge. Note: Turbopack may not fully apply this yet (open Next.js issues).
- **RollingWord**: lazy-loaded via `dynamic()` in `HeroSection` (no `ssr: false` — component has own `mounted` guard). Splits it from critical JS bundle.
- **AmbientParticles**: lazy-loaded via `AmbientParticlesLazy.tsx` client wrapper with `ssr: false` — canvas APIs not available on server. Used on homepage ROI/COI band (desktop only).
- **KiteHero**: direct import (not lazy) — desktop-only, Framer Motion already in bundle, eager render avoids visible pop-in on refresh.
- **cdn.fontshare.com preconnect**: added alongside existing `api.fontshare.com` preconnect — font files served from CDN subdomain, saves ~80ms LCP on mobile.
- **viewport-fit=cover**: `export const viewport: Viewport` in layout.tsx — removes iOS Safari white status bar gap above hero.
- **JSON-LD unicode escaping**: `JSON.stringify(structuredData).replace(/[-￿]/g, ...)` — escapes chars > U+00FF to avoid ByteString error from em/en dashes in structured data strings.

## Priorities & Vision

Moved to `docs/INTENTIONS.md` — the living log for ideas, directions, and things to act on.

### Backlog (minor)
- KiteHero: particle count / speed tuning (optional)
- String control point tuning for more natural sag at different viewport sizes
