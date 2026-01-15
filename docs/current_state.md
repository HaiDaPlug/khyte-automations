# Khyte Automations - Current State (v1.30)

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
│   ├── layout.tsx        # Root layout + metadata + Calendly scripts
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
├── khyte-logo.svg        # Main logo
├── icons/                # Tool logos for ticker
└── *.png                 # Profile images
```

## Design Tokens (globals.css)
```css
--color-bg: #0A0A0A;           /* OLED-safe black */
--color-card-bg: #121212;      /* Card background */
--color-text: #FFFFFF;         /* Headings (pure white) */
--color-text-body: rgba(255,255,255,0.85); /* Body text */
--color-muted: rgba(255,255,255,0.50);     /* Secondary text */
--color-border: rgba(255,255,255,0.15);    /* Borders */
--font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
--radius-sm: 4px;              /* Cards, inputs */
--spacing-section: 128px;      /* Desktop section spacing */
```

## Typography Utilities
- `.text-hero`: 700 weight, -0.03em tracking, 1.1 leading
- `.text-label`: 13px, 700 weight, 0.05em tracking, uppercase, white

## Component Standards

### Button.tsx
- Height: `h-12` (48px fixed)
- Padding: `px-8`
- Radius: `rounded-md` (6px - actions vs 4px for data)
- Primary: `bg-white text-black`
- Secondary: `border border-white/20 bg-transparent`

### Nav.tsx (Floating Capsule)
- Position: `fixed top-6 left-1/2 -translate-x-1/2`
- Width: `max-w-[94%] md:max-w-[1150px]`
- Glass: `bg-[#0A0A0A]/60 backdrop-blur-md border-white/10`
- Shape: `rounded-full`
- CTA triggers Calendly popup

### Form Inputs
- Height: `h-12` (matches buttons)
- Background: `var(--color-card-bg)` (inlaid effect)
- Border: `var(--color-border)`
- Radius: 4px

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
- Used in: Nav CTA, Footer CTA, Cases CTA, Contact page

## Development
```bash
npm run build && npm run start  # Production (recommended)
npm run dev                     # Dev mode (Turbopack bug exists)
```

## Key Implementation Notes
1. All pages need `pt-32` for fixed nav clearance
2. Hero uses `min-h-[100dvh]` (dynamic viewport height)
3. Ticker uses CSS-only animation (240s loop, translate3d)
4. Swedish language throughout (`lang="sv"`)
5. No tailwind.config.ts - all config in globals.css `@theme`

## Files to Know
| Purpose | File |
|---------|------|
| Design tokens | `src/app/globals.css` |
| Global metadata | `src/app/layout.tsx` |
| Homepage | `src/app/page.tsx` |
| Navigation | `src/components/Nav.tsx` |
| Buttons | `src/components/Button.tsx` |
