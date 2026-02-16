# Khyte Automations - Current State (v1.50)

## Tech Stack
- **Next.js** 16.0.9 (App Router)
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
│   ├── services/
│   │   ├── page.tsx      # Services & pricing page
│   │   ├── audit/page.tsx          # Redirects to /services
│   │   └── custom-build/page.tsx   # Redirects to /services
│   ├── layout.tsx        # Root layout + metadata + Calendly scripts + Nav
│   ├── globals.css       # Design tokens + animations
│   ├── sitemap.ts        # Dynamic sitemap
│   └── robots.ts         # Robots.txt
├── components/
│   ├── Nav.tsx           # Floating glass capsule nav (Client)
│   ├── Button.tsx        # Primary/secondary variants
│   ├── CalendlyButton.tsx # Calendly popup trigger (Client)
│   ├── CaseCard.tsx      # Case card component
│   ├── Container.tsx     # 1100px max-width wrapper
│   ├── DnaWeaveSvg.tsx   # Animated SVG
│   ├── TimelineProcess.tsx # Timeline with scan animation (Client)
│   └── ToolsTicker.tsx   # Logo ticker (Client)
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
--color-warm-text: #1E1A16;        /* Charcoal (primary heading) */
--color-warm-text-muted: #6B5F55;  /* Muted body text */
--color-warm-accent: #E8833A;      /* CTA button background */
--color-warm-accent-hover: #D4622B; /* CTA button hover */
--color-warm-ink: #12100E;         /* Near-black (button text) */
```

### Base Band Gradient (PreFooterCTA + Footer — "Sunset" palette)
```css
--base-band-bg: linear-gradient(
  180deg,
  #F5EDE3 0%,   /* Warm cream (PreFooterCTA top — dark text readable) */
  #F5C070 28%,  /* Golden amber */
  #F0803A 52%,  /* Vivid orange peak */
  #C04010 72%,  /* Deep burnt orange */
  #6A1E06 88%,  /* Dark mahogany */
  #180C06 100%  /* Near-black warm (Footer bottom — white text readable) */
);
```
- `.base-band` is a **centered rounded slab card**: `width: min(1440px, calc(100% - 32px))`, `border-radius: 24px`, `overflow: hidden`, `background: #3A3330` (corner anti-alias fill)
- `::before`: applies gradient + `border: 1px solid rgba(42,31,26,0.18)` + `box-shadow`
- `::after`: subtle radial glow at top (stops at 62% from bottom — stays in PreFooterCTA zone only)
- Footer has `border-t border-white/[0.18]` as mid-card seam divider

## globals.css Utilities, Animations & Overlays
- `.base-band`: Rounded slab card with gradient via `::before`, glow via `::after`, children `z-index: 1`
- `.text-label`: 13px, 700 weight, 0.05em tracking, uppercase, **`color: var(--color-text)`** (overridden to `text-white/80` in Footer)
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
- Primary: `bg-[#D4622B] text-white hover:bg-[#C0541F]`
- Secondary: `bg-transparent border border-[rgba(58,51,48,0.20)] text-[#3A3330] hover:bg-[rgba(58,51,48,0.06)]`

### CalendlyButton.tsx (Client Component)
- Height: `h-12` (48px fixed)
- Padding: `px-8`
- Radius: `rounded-md`
- **Three variants:**
  - `primary`: `bg-[#D4622B] text-white hover:bg-[#C0541F]` (used on light backgrounds — pages, services, etc.)
  - `secondary`: `bg-transparent border border-[rgba(58,51,48,0.20)] text-[#3A3330] hover:bg-[rgba(58,51,48,0.06)]`
  - `warm`: `bg-[var(--color-warm-accent)] text-[var(--color-warm-ink)] hover:bg-[var(--color-warm-accent-hover)]` (for PreFooterCTA — gradient background)
- Triggers Calendly popup via `window.Calendly.initPopupWidget()`

### Nav.tsx (Floating Capsule)
- **Rendered globally** in layout.tsx (single instance across all pages)
- Position: `fixed top-6 left-1/2 -translate-x-1/2`
- Width: `max-w-[94%] md:max-w-[1150px]`
- Glass: `bg-[#f4f1ef]/80 backdrop-blur-md border-[rgba(58,51,48,0.12)]`
- Shape: `rounded-full`
- Layout: `justify-between` with absolutely-centered nav links
- Logo left, CTA right, links centered (desktop)
- Desktop links (4): Case, Om oss, **Tjänster**, Kontakt
  - Active: `text-[#3A3330]`, inactive: `text-[#9C8E82]`, hover: `text-[#3A3330]`
  - **Tjänster**: Simple link to `/services`, active when `pathname.startsWith("/services")`
- Desktop CTA: `bg-[#D4622B] text-white hover:bg-[#C0541F] rounded-full`
- Mobile drawer: `bg-[#f4f1ef]/95`, warm borders, same link colors, orange CTA
- Mobile backdrop: `bg-[rgba(58,51,48,0.40)]`

### Base Band (Shared Background Wrapper)
- **Wrapper in layout.tsx**: `<div className="base-band">` wraps both PreFooterCTA + Footer
- **Shape**: Centered rounded slab card (`max-w: 1440px`, `border-radius: 24px`)
- **Gradient**: Sunset — cream → golden → orange → burnt orange → mahogany → near-black warm
- **Seam**: `border-t border-white/[0.18]` on Footer's inner div (subtle divider between sections)
- **Corner fill**: `background: #3A3330` on `.base-band` prevents sub-pixel fringe at rounded corners

### PreFooterCTA.tsx (Global)
- **Rendered globally** inside `.base-band` wrapper in layout.tsx
- Server component (CalendlyButton handles client interactions)
- Design: Centered CTA block with heading, subtext, and Calendly button
- Copy: "Visa oss en process – vi visar vad som går att automatisera"
- **Transparent background**: gradient from `.base-band` shows through (top zone = cream)
  - Heading: `text-[var(--color-warm-text)]` (charcoal #1E1A16)
  - Body: `text-[var(--color-warm-text-muted)]` (muted #6B5F55)
  - Button: `CalendlyButton variant="warm"` with `className` override for dark pill (`bg-[#3A3330] text-white hover:bg-[#2A2320]`)

### Footer.tsx
- **Rendered globally** inside `.base-band` wrapper in layout.tsx
- Structure: Left brand block + three link columns (Utforska, Företag, Juridik)
- Brand: Logo (`h-18 w-auto`) + LinkedIn icon underneath (`h-8 w-8`, opacity 80%→100%)
- **Transparent background**: gradient from `.base-band` shows through (bottom zone = near-black warm)
- All text uses `text-white/*` opacity — intentional, sits on dark lower gradient
  - Column headings: `text-label text-white/80`
  - Links: `text-white/85 hover:text-white`
  - Copyright: `text-white/60`
- Top seam: `border-t border-white/[0.18]`
- Bottom bar: `border-t border-white/[0.12]`

### About Page People Cards
- Layout: 2-column grid (1 col mobile, 2 cols lg+)
- Each card includes profile image (5:6), name (h3), role (.text-label), description, contact details, LinkedIn icon
- Contact details: `text-sm text-[var(--color-text-body)]`, links `hover:text-[var(--color-text)]`
- LinkedIn icon: `absolute bottom-8 right-8`, h-6 w-6, opacity 80%→100%

### Services Page (Consolidated)
**Route**: `/services` (accessible via "Tjänster" link in nav)
- **Launch-ready**: 9 sections — Hero, Vad vi automatiserar, Så jobbar vi, Skräddarsydd automation, Support, Automationsresa, Resultat, FAQ, CTA
- Price card: `border border-[rgba(58,51,48,0.25)]` (heavier border signals hierarchy)
- Step numbers: `text-[var(--color-muted)]`
- FAQ: native `<details>`/`<summary>`, `focus-visible:ring-[rgba(58,51,48,0.30)]`
- CTA hierarchy: Tier 1 = `CalendlyButton primary` (book now). Tier 2 = underline `<Link>` to /contact.
- Anchor links use `text-[var(--color-muted)] hover:text-[var(--color-text)]`

**Subpage Redirects**: `/services/audit` and `/services/custom-build` → redirect to `/services`

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
4. **Sunset gradient** - cream (#F5EDE3) → golden → vivid orange (#F0803A) → mahogany → near-black warm (#180C06)
5. **Footer text stays white** — sits on dark lower gradient; do NOT change `text-white/*` values in Footer
6. **`.text-label` is `var(--color-text)`** — dark on page sections; Footer overrides with `text-white/80`
7. All pages use `pt-32` for fixed nav clearance
8. Swedish language throughout (`lang="sv"`)
9. No tailwind.config.ts — all config in globals.css `@theme`
10. Nav uses absolute positioning for centered links (requires `relative` on parent)
11. Small SVG icons use plain `<img>` instead of Next Image for simplicity
12. Pricing on /services: "25 000–120 000 kr, fast pris efter scope". Exact number set in förstudie.

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
