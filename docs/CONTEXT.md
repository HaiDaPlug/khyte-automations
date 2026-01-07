# Khyte Automations - Project Context Summary

## Project Overview

**Khyte Automations** is a Swedish-language marketing website for an AI consulting business that helps small to medium-sized companies automate workflows and eliminate time-wasting manual tasks.

## Tech Stack

- **Framework**: Next.js 16.0.9 (App Router)
- **React**: 19.2.1
- **TypeScript**: 5 (Strict mode enabled)
- **Styling**: Tailwind CSS v4 with PostCSS
- **Deployment**: Static export ready
- **Build Tool**: Turbopack (production builds work; dev mode has known bug)

## Project Structure

```
khyte-automations/
├── src/
│   ├── app/
│   │   ├── about/
│   │   │   └── page.tsx          # About page (company purpose, philosophy, team)
│   │   ├── automations/
│   │   │   └── page.tsx          # Redirects to /
│   │   ├── cases/
│   │   │   └── page.tsx          # Cases page (3 case cards)
│   │   ├── contact/
│   │   │   └── page.tsx          # Contact page (Formspree form)
│   │   ├── page.tsx               # Landing page (hero + timeline + CTA)
│   │   ├── layout.tsx             # Root layout (global metadata, Swedish lang)
│   │   ├── sitemap.ts             # Dynamic sitemap generation
│   │   ├── robots.ts              # Robots.txt generation
│   │   └── globals.css            # Design tokens + animations
│   └── components/
│       ├── Nav.tsx                # Navigation with active state (logo + Case/Om/Kontakt)
│       ├── Button.tsx             # Primary/secondary button variants
│       ├── CaseCard.tsx           # Reusable case card
│       ├── Container.tsx          # Layout wrapper (1100px max-width)
│       └── DnaWeaveSvg.tsx        # Animated DNA weave SVG component
├── docs/
│   └── CONTEXT.md                 # This file
├── public/
│   ├── Hai Bui 2.png              # Profile image for Hai Bui (cropped version, 1414x2000)
│   ├── Abdi 2.png                 # Profile image for Abdimajiid Mohamud (cropped version, 1414x2000)
│   ├── Hai Bui.png                # Backup: original Hai Bui image (898KB)
│   ├── Abdi.png                   # Backup: original Abdi image
│   └── dna-weave.gif              # DNA weave animation (footer CTA)
├── opus4.5-merged.html            # HTML v1 reference (design source)
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── next.config.ts
└── eslint.config.mjs
```

## Key Implementation Details

### Tailwind CSS v4 Configuration

**Critical**: This project uses Tailwind CSS v4, which has a different configuration approach than v3:

- **No `tailwind.config.ts`** - Configuration is done via CSS `@theme` blocks
- **Location**: All Tailwind config is in `src/app/globals.css`
- **Syntax**: Uses `@theme inline { ... }` directive

#### Design Tokens (v1.17 - Obsidian System)

```css
@theme inline {
  --color-bg: #0A0A0A;              /* OLED-safe black */
  --color-card-bg: #121212;         /* Softer card background */
  --color-text: #FFFFFF;            /* Pure white (headings) */
  --color-text-body: rgba(255, 255, 255, 0.85); /* Body text (85% opacity) */
  --color-muted: rgba(255, 255, 255, 0.50);     /* Muted/labels (50% opacity) */
  --color-accent: #FFFFFF;          /* Pure white accent */
  --color-border: rgba(255, 255, 255, 0.15);    /* Opacity-based border */

  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;

  --radius-sm: 4px;                 /* Small border radius */
  --shadow-soft: 0 18px 45px rgba(0, 0, 0, 0.08);
}

@layer utilities {
  .text-hero {
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  .text-label {
    font-size: 0.8125rem; /* 13px */
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #FFFFFF;
  }
}

:root {
  --spacing-section: 128px;         /* Section spacing (desktop) */
}

@media (max-width: 768px) {
  :root {
    --spacing-section: 80px;        /* Section spacing (mobile) */
  }
}
```

**Usage**: All components use CSS variables via `var(--color-*)` or Tailwind arbitrary values like `text-[var(--color-text)]`

**Design Philosophy**: Monochrome color scheme (white accent on charcoal) for a premium, minimal aesthetic.

### Typography

- **Font**: Geist Sans (Linear-like premium aesthetic)
- **Implementation**: Next.js font optimization with CSS variable `--font-geist-sans`
- **Hero H1**: `text-5xl md:text-7xl` (48px → 72px) with `.text-hero` utility (700 weight, -0.03em tracking, 1.1 leading)
- **Body Text**: 16px with line-height 1.5, uses `--color-text-body` (85% opacity white)
- **Labels**: 13px uppercase, 700 weight, 0.05em tracking via `.text-label` utility

### Shared Components (v1.3)

**1. Container.tsx** - Layout wrapper
- Max-width: 1100px
- Responsive padding: 24px (px-6)
- Centers content horizontally

**2. Button.tsx** - CTA buttons
- **Primary**: White background, dark text, hover to #ccc
- **Secondary**: Transparent background, border, hover border change
- Props: `variant`, `href`, `children`, `className`
- Border radius: 4px (matches HTML v1)
- Padding: 16px/32px

**3. CaseCard.tsx** - Case study cards
- Card background: `#18181B`
- Border: 1px solid `#27272A`
- Padding: 40px
- Border radius: 4px
- Hover: Border color changes to muted
- Sections: Problem badge (monospace, 13px) + Title (20px) + Description (15px, muted)

**4. Nav.tsx** - Fixed site navigation (Client Component)
- **Position**: Fixed at top (sticky header with backdrop blur)
- **Styling**: `z-50`, `backdrop-blur-sm`, `bg-opacity-95`
- **Active State**: Uses `usePathname()` to highlight current page
- Logo: "Khyte" (uppercase, bold, tracking 0.05em, links to `/`)
- Links: Case, Om, Kontakt (no "Hem" link)
- Font size: 14px
- Link color: Active page = `text-[var(--color-text)]`, Inactive = `text-[var(--color-muted)]`
- Hover: All links transition to `text-[var(--color-text)]`
- Spacing: 32px between links (gap-8)
- **Note**: Pages need `pt-32` to account for fixed nav height

**5. DnaWeaveSvg.tsx** - Animated DNA weave component
- **Type**: SVG component with CSS animations
- **ViewBox**: `0 0 800 200` (horizontal aspect ratio)
- **Animation**: Horizontal slide (16s linear infinite loop)
- **Styling**: Uses `currentColor` for theme-aware stroke
- **Props**: Accepts standard `React.SVGProps<SVGSVGElement>`
- **Usage**: Footer CTA decoration with `opacity-[0.18]` and `var(--color-muted)`
- **Performance**: Inline SVG (no HTTP request), scalable at any resolution
- Border radius: 4px (consistent with design system)

### Contact Information (Production Data)

⚠️ **CRITICAL - Do Not Change Without Authorization**

- **Email**: `hai@khyteteam.com`
- **Phone**: `070-099 68 38`
- **Calendly**: `https://calendly.com/hai-khyteteam/30min`
- **Formspree Endpoint**: `https://formspree.io/f/xzznjaly`

### CSS Animations

Lightweight CSS-only animations (keep from v1.2):

```css
@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
```

**Classes**: `.animate-gradient`, `.animate-float`, `.animate-float-delayed`

### Form Implementation

The contact form at `/contact` uses **Formspree** for submissions:

```tsx
<form action="https://formspree.io/f/xzznjaly" method="POST">
  <input type="text" name="name" required />
  <input type="text" name="company" />
  <input type="tel" name="phone" />
  <input type="email" name="email" required />
  <textarea name="message" required></textarea>
  <Button variant="primary">Skicka förfrågan</Button>
</form>
```

**Important**:
- All inputs must have `name` attributes
- No custom JavaScript needed - Formspree handles submission
- User is redirected to Formspree's thank-you page after submission
- Styled with 4px border radius, exact token colors

## Site Structure (v1.3 - Pixel-Perfect HTML v1)

### `/` - Landing Page

1. **Navigation** (Fixed header with active state)
   - Logo: "Khyte" (links to `/`)
   - Links: Case, Om, Kontakt
   - Position: Fixed at top with backdrop blur
   - Active state highlights current page

2. **Hero Section** (85vh min-height)
   - H1: "AI som tar hand om jobbet som du inte behöver göra."
   - Subtext: "Vi bygger automationer som tar bort friktion i vardagen - kundnära effektivt, med fungerande workflows."
   - CTA buttons: "Boka ett samtal" (primary) + "Se hur det funkar" (secondary)
   - Max-width: 900px

3. **Cases Section** ("Nyliga projekt")
   - Section header: Uppercase, 14px, tracking 0.05em
   - **Exactly 2 case previews** (data-driven, expandable via array)
   - Cases:
     1. Automatiserad informationsförädling (allabolag.se automation)
     2. AI-driven inbox triage
   - Uses CaseCard component

4. **Process Section** ("Så jobbar vi")
   - Border top + padding top (120px spacing)
   - Intro text: "En simpel process utan onödigt skit. Från problem till lösning på kortast möjliga tid." (max-width 600px)
   - **Timeline with connecting line**:
     - 3-column grid (responsive to 1-column mobile)
     - Horizontal line connecting circles (desktop only)
     - Step 1: Solid white circle, dark text
     - Step 2: White outline (2px border), white text
     - Step 3: Grey outline (1px border), muted text
   - Step titles: 18px, weight 500
   - Step descriptions: 15px, muted, line-height 1.6

5. **Footer CTA** (centered single-column layout)
   - Heading: "Redo att automatisera bort tråkiga uppgifter?" (clamp 2rem to 2.5rem)
   - Subtext: max-width 2xl for readability
   - CTA button: "Boka ett samtal" (primary variant)
   - DNA weave SVG animation below CTA (DnaWeaveSvg component)
   - Animation: Horizontal slide only (16s), opacity 0.24, color var(--color-muted)
   - Spacing: mt-6 (24px) between button and animation
   - Max height: 320px (80 on mobile), 4px border radius
   - Padding: 100px vertical, border-top

### `/cases` - Cases List Page

1. **Navigation** (shared Nav component - fixed header)
2. **Page Header** - Large H1 "Case" (2.5rem) with descriptive subtitle
   - Spacing: `pt-32` to account for fixed nav
3. **Cases Grid** - Exactly 3 case cards
   - Prospektmotor för sälj
   - Research-motor för byrå
   - Interna admin-flöden
4. **Format**: Problem → Build → Result (each with white accent label)
5. **Bottom CTA** - "Vill du ha en liknande lösning?" + Contact button

### `/contact` - Contact Page

1. **Navigation** (shared Nav component - fixed header)
2. **Page Header** - Large H1 "Kontakt" (2.5rem) with descriptive subtitle
   - Spacing: `pt-32` to account for fixed nav
3. **2-Column Layout**:
   - Left: Formspree form (5 fields: name, company, phone, email, message)
   - Right: Direct contact options (email, phone, Calendly)
4. **Form Styling**: 4px border radius, token colors, focus ring on accent
5. **Direct Contact Options**: Email (hai@khyteteam.com), Phone (070-099 68 38), Calendly link
6. **Calendly Button**: Uses `<a>` tag (not next/link) with `target="_blank"`

### `/about` - About Page

1. **Navigation** (shared Nav component - fixed header with active state)
2. **Page Header** - Large H1 "Om Khyte" (2.5rem)
   - Spacing: `pt-32` to account for fixed nav
3. **Section 1: Varför Khyte finns** (Why Khyte exists)
   - Two-column grid layout (stacks on mobile)
   - Left: Company purpose copy with typographic Swedish quotes
   - Right: Placeholder image block (card-style frame with border)
   - Grid gap: 64px (gap-16)
4. **Section 2: Hur vi tänker & vad du kan förvänta dig** (Philosophy & expectations)
   - Single prominent card (same styling as case cards)
   - Intro paragraph + lead-in text
   - 5-item bulleted list with em-dash bullets
   - Closing paragraph
   - All text uses standard 15px sizing with 1.6 line-height
5. **Section 3: Vi bakom Khyte** (Team profiles)
   - Section H2: "Vi bakom Khyte" (24px, medium weight)
   - Two profile cards in grid layout (stacks on mobile)
   - Each card includes:
     - Profile image (5:6 aspect ratio, card-style frame)
       - Hai: Uses /Hai Bui 2.png (1414x2000, cropped version, Next.js Image component)
       - Abdi: Uses /Abdi 2.png (1414x2000, cropped version, Next.js Image component)
     - Name (H3, 20px)
     - Role (small, muted text)
     - Description paragraph (15px, muted)
     - Contact info (email link for both Hai and Abdi)
   - Card padding: `pt-6 px-10 pb-10` (reduced top padding for tighter layout)
   - Grid gap: 48px (gap-12)
6. **Spacing**: `mb-20` between major sections for consistent rhythm

### `/automations` - Redirect

Server-side redirect to `/` using Next.js `redirect()` function

## Design System (v1.3)

### Color Palette (Monochrome Scheme)

- **Background**: Deep charcoal (#0F0F10) - solid, no gradient
- **Card Background**: #18181B (slightly lighter for depth)
- **Accent**: Pure white (#FFFFFF) for CTAs and highlights
- **Text**: Off-white (#EDEDEF) for primary text
- **Muted**: Grey (#A1A1AA) for secondary text
- **Border**: Dark grey (#27272A) for subtle dividers

### Spacing System

- **Section Spacing**: 120px (desktop) / 80px (mobile) via `--spacing-section`
- **Utility Classes**: `.section`, `.section-border`, `.section-header`
- **Container**: 1100px max-width, 24px horizontal padding

### Border Radius

- **All Elements**: 4px (consistent with HTML v1)
- **No Rounded Variants**: No `rounded-xl` or `rounded-2xl`

### Key Features

- Pixel-perfect match to HTML v1 (opus4.5-merged.html)
- Data-driven architecture (case previews expandable via array)
- Zero hard-coded hex values (all via CSS variables)
- Responsive grid layouts (3-col → 1-col on mobile)
- Smooth anchor navigation (`scroll-behavior: smooth`)
- Timeline with connecting line (desktop only)

## Content Language

**All user-facing content is in Swedish** (`lang="sv"` in HTML)

**Swedish Terminology Used**:
- "Nyliga projekt" (Recent projects)
- "Så jobbar jag" (How I work)
- "Case" (Cases)
- "Kontakt" (Contact)
- "Skicka förfrågan" (Send inquiry)
- "Boka ett samtal" (Book a call)

## Known Issues & Workarounds

### Turbopack Dev Mode Bug

**Issue**: Next.js 16.0.9's Turbopack has a panic error when compiling `/automations/page`

**Root Cause**: Internal Turbopack bug (not related to our code)

**Workarounds**:
1. **Production mode** (recommended for testing):
   ```bash
   npm run build
   npm run start
   ```
2. **Wait for Next.js update** that fixes the Turbopack bug

**Verification**: Production builds work perfectly - the code is valid.

## Development Workflow

### Local Development

```bash
# Production mode (works reliably)
npm run build
npm run start
# Visit: http://localhost:3000

# Dev mode (currently broken due to Turbopack bug)
npm run dev
# Note: Will show Turbopack panic error
```

### Build Output

```
Route (app)
├── / (landing page - hero + timeline + footer CTA)
├── /_not-found
├── /about (company purpose, philosophy, team profiles)
├── /automations (redirects to /)
├── /cases (3 case cards with Problem/Build/Result)
└── /contact (Formspree form + direct contact)

○ (Static) - All routes prerendered as static content
```

## File Modification History

### v1.5 (2025-12-15) - About Page Implementation

**New Page:**
1. **src/app/about/page.tsx** (new file) - About page with 3 sections:
   - Section 1: Two-column layout (company purpose + placeholder image)
   - Section 2: Philosophy card with 5-item bullet list
   - Section 3: Team profile cards (Hai Bui & Abdi)
   - Uses typographic Swedish quotes ("") for premium appearance
   - Placeholder images with card-style framing (border + background)
   - All responsive grids stack properly on mobile

**Updated Components:**
1. **src/components/Nav.tsx**:
   - Converted to client component with `"use client"`
   - Added `usePathname()` hook from `next/navigation`
   - Added "Om" link between "Case" and "Kontakt"
   - Implemented active state highlighting (current page shows text color)
   - All links transition to text color on hover

**Routes Added:**
- `/about` - Static route for About page

### v1.8 (2025-12-17) - Profile Image & Case Preview Updates

**New Assets:**
1. **public/Hai Bui.png** (new file) - Profile photo for Hai Bui (1414x2000px)

**Updated Pages:**
1. **src/app/about/page.tsx**:
   - Added Next.js Image component import
   - Replaced Hai's profile placeholder with actual profile image
   - Image uses full resolution (1414x2000) with 4:5 aspect ratio display
   - Maintains card-style border and overflow-hidden for proper cropping

2. **src/app/page.tsx**:
   - Updated first case preview copy
   - Changed from "Automatiserad orderhantering" to "Automatiserad informationsförädling"
   - Updated problem statement: "Jag jobbar mycket med allabolag."
   - Updated description to reference allabolag.se automation workflow
   - Increased DNA weave opacity from 0.18 to 0.24 for better visibility

### v1.7 (2025-12-15) - Contact Form Phone Field & Landing Page Copy Updates

**Updated Pages:**
1. **src/app/contact/page.tsx**:
   - Added phone number field (Telefon) to Formspree contact form
   - Phone field positioned between Company and Email fields
   - Input type: `tel` for mobile keyboard optimization
   - Optional field (not required)
   - Added phone number (070-099 68 38) to direct contact options
   - Phone displays between Email and "Boka möte" with tel: link for click-to-call

2. **src/app/page.tsx**:
   - Updated hero H1: "vill göra" → "behöver göra"
   - Changed voice from singular to plural: "Jag bygger" → "Vi bygger"
   - Updated subtext: Added "kundnära effektivt" messaging
   - Process section header: "Så jobbar jag" → "Så jobbar vi"
   - Process intro: "rak process utan onödiga möten" → "simpel process utan onödigt skit"
   - Replaced em-dashes with hyphens in step titles for consistency
   - Added "och" in step 2 title for better flow

**Contact Information Added:**
- Phone: 070-099 68 38 (clickable tel: link)

### v1.6 (2025-12-15) - DNA Weave SVG Component & Footer CTA Redesign

**New Components:**
1. **src/components/DnaWeaveSvg.tsx** (new file) - Animated DNA weave SVG:
   - Horizontal slide animation (16s linear infinite loop)
   - ViewBox: `0 0 800 200` (horizontal aspect ratio)
   - Theme-aware using `currentColor` for stroke
   - Accepts standard `React.SVGProps<SVGSVGElement>` props
   - No vertical movement (removed gentleWave animation)
   - Optimized for performance (inline SVG, no HTTP request)

**Updated Pages:**
1. **src/app/page.tsx**:
   - Imported DnaWeaveSvg component
   - Redesigned footer CTA from 2-column grid to centered single-column layout
   - Moved DNA weave animation below CTA button
   - Applied opacity-[0.18] and color var(--color-muted) to animation
   - Spacing: mt-6 (24px) between button and animation
   - Removed old GIF image reference

**Visual Changes:**
- Footer CTA now fully centered with animation as decorative element below
- DNA weave appears more subtle with lower opacity
- Animation positioned closer to button for tighter visual grouping

### v1.4 (2025-12-15) - Fixed Navigation & Page Header Refinements

**Updated Components:**
1. **src/components/Nav.tsx**:
   - Changed from inline to fixed positioning
   - Added backdrop blur effect
   - Moved outside Container for proper fixed behavior

**Updated Pages:**
1. **src/app/cases/page.tsx**:
   - Added `pt-32` spacing for fixed nav
   - Larger H1 typography (2.5rem)
   - Enhanced subtitle typography (17px)

2. **src/app/contact/page.tsx**:
   - Added `pt-32` spacing for fixed nav
   - Larger H1 typography (2.5rem)
   - Enhanced subtitle typography (17px)

3. **src/app/page.tsx**:
   - Updated footer CTA with DNA weave GIF
   - Improved visual hierarchy

**Assets Added:**
- **public/dna-weave.gif** - DNA weave animation for footer

### v1.3 (2025-12-14) - HTML v1 Pixel-Perfect Migration

**Design System Overhaul:**
- Replaced color scheme: Sky blue (#38bdf8) → Pure white (#FFFFFF) accent
- Updated background: Dark blue (#0f172a) → Deep charcoal (#0F0F10)
- Added card background token: #18181B
- Changed border radius: 12-20px → 4px (all elements)
- Updated spacing: 96px → 120px section spacing

**New Components:**
1. **src/components/Container.tsx** - Layout wrapper (1100px max-width)
2. **src/components/Button.tsx** - Primary/secondary variants (4px radius)
3. **src/components/CaseCard.tsx** - Reusable case card (Problem/Title/Description)

**Rebuilt Pages:**
1. **src/app/page.tsx** - Complete rebuild:
   - Data-driven case previews (2 shown, expandable to 3+)
   - Process timeline with connecting line + 3 circle styles
   - Footer CTA with 2-column layout + image
   - Max-width 900px hero section

2. **src/app/cases/page.tsx** - Updated styling:
   - 3 case cards with Problem/Build/Result format
   - Uses new CaseCard component structure
   - Uppercase section headers

3. **src/app/contact/page.tsx** - Updated styling:
   - Form inputs with 4px radius
   - Button component for submit
   - Consistent token usage

**Updated Components:**
1. **src/components/Nav.tsx**:
   - Added "Khyte" logo (links to `/`)
   - Removed "Hem" link
   - Matched HTML v1 styling exactly

**Global Changes:**
1. **src/app/globals.css**:
   - Complete token replacement (monochrome scheme)
   - Added spacing tokens (--spacing-section)
   - Added utility classes (.section-header, .section-border)
   - Removed gradient background

2. **src/app/layout.tsx**:
   - Updated title: "KHYTE AUTOMATIONS | No Hype, Just Workflows"
   - Updated description to match hero copy
   - Kept Swedish lang attribute

### v1.2 (2025-12-12) - Multi-Page Redesign

- Replaced single-page site with multi-page structure
- **New pages**: `/` (hero-first landing), `/cases` (3 cards), `/contact` (Formspree form)
- **Redirect**: `/automations` now redirects to `/`
- **Components**: Created shared `Nav.tsx` component (Hem/Case/Kontakt)
- **Animations**: Added lightweight CSS animations (gradient shift, floating shapes)
- **Design**: Minimal, premium look with consistent navigation across all pages

### v1.1 (2025-12-12) - Root Page Redirect

- Replaced default Next.js template with redirect to `/automations`
- Root page (`/`) automatically redirects to main marketing site
- Simplified user experience - single entry point

### v1.0 (2025-12-10) - Initial Implementation

- Created Swedish marketing site at `/automations`
- Implemented Tailwind v4 configuration
- Integrated Formspree contact form
- Production build working (dev mode has Turbopack bug)

## Metadata & SEO

```typescript
{
  title: "KHYTE AUTOMATIONS | No Hype, Just Workflows",
  description: "Jag bygger automationer som tar bort friktion i vardagen — utan hype, bara fungerande workflows."
}
```

**Language**: Swedish (`<html lang="sv">`)

## Deployment Considerations

### Static Export Ready

The site is fully static and can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- Cloudflare Pages
- GitHub Pages
- Any static hosting service

### Environment Variables

**None required** - All configuration is hardcoded (email, Calendly, Formspree endpoint)

### Build Command

```bash
npm run build
```

### Output Directory

`.next/` (Next.js default)

## Future Enhancements (Not Implemented)

These are documented for future reference but not currently implemented:

- [ ] Connect Formspree to custom email backend
- [ ] Embed Calendly widget instead of external link
- [ ] Add page transitions (view transitions API)
- [ ] Integrate analytics (Google Analytics, Plausible, etc.)
- [ ] Add more case studies (expand casePreviews array)
- [ ] Create blog section
- [ ] Fix Turbopack dev mode (requires Next.js update)
- [ ] Add dark/light mode toggle (currently dark-only)

## Testing Checklist

Before deployment, verify:

**v1.3 Pixel-Perfect:**
- [x] Design tokens match HTML v1 exactly (monochrome scheme)
- [x] Border radius is 4px on all elements
- [x] Section spacing is 120px (80px mobile)
- [x] Hero typography uses clamp() sizing
- [x] Nav has "Khyte" logo linking to `/`
- [x] Landing page shows 2 case previews (data-driven)
- [x] Process timeline has connecting line + 3 circle styles
- [x] Footer CTA has 2-column layout with image
- [x] Zero hard-coded hex values in components
- [x] All routes statically generated
- [x] Production build succeeds
- [x] No TypeScript errors
- [x] Formspree form works
- [x] Responsive design (mobile/tablet/desktop)
- [x] Swedish copy is accurate
- [x] All buttons use Button component
- [x] All cases use CaseCard component (where applicable)

## Support & Contact

**Project Owner**: Hai
**Business**: Khyte Automations
**Email**: hai@khyteteam.com
**Calendly**: https://calendly.com/hai-khyteteam/30min

## Additional Resources

- **Next.js 16 Docs**: https://nextjs.org/docs
- **Tailwind CSS v4 Docs**: https://tailwindcss.com/docs
- **Formspree Docs**: https://formspree.io/docs
- **React 19 Docs**: https://react.dev
- **HTML v1 Reference**: `opus4.5-merged.html` (design source file)

## Version History

- **v1.21** (2026-01-07) - P0 SEO Implementation (Production-Grade Fundamentals)
  - **Goal**: Implement Google-recommended SEO fundamentals for search discoverability
  - **Global Metadata Foundation** ([layout.tsx](src/app/layout.tsx)):
    - Added `metadataBase: new URL("https://khyteautomations.com")` for absolute URL resolution
    - Implemented title template system: `"%s | Khyte Automations"` (consistent branding)
    - Updated description to plural voice: "Vi bygger" (matches site content)
    - Removed old domain (`khyteteam.com`) from OpenGraph configuration
    - Removed `openGraph.url` property to prevent inheritance issues
  - **Page-Specific Metadata** (all 4 pages):
    - **Home** ([page.tsx](src/app/page.tsx)): Title "AI-automation i Sverige", canonical "/"
    - **Cases** ([cases/page.tsx](src/app/cases/page.tsx)): Title "Case", canonical "/cases"
    - **About** ([about/page.tsx](src/app/about/page.tsx)): Title "Om Khyte", canonical "/about"
    - **Contact** ([contact/page.tsx](src/app/contact/page.tsx)): Title "Kontakt", canonical "/contact"
    - Each page has unique, keyword-rich Swedish descriptions
    - All canonical URLs explicitly set per page (prevents duplicate content issues)
  - **Sitemap Generation** ([sitemap.ts](src/app/sitemap.ts) - NEW):
    - Dynamic sitemap with 4 routes (/, /about, /cases, /contact)
    - Homepage: `changeFrequency: weekly`, `priority: 1.0`
    - Other pages: `changeFrequency: monthly`, `priority: 0.7`
    - Accessible at `/sitemap.xml`
  - **Robots Configuration** ([robots.ts](src/app/robots.ts) - NEW):
    - Allows all user agents to crawl all paths
    - References sitemap location for automatic discovery
    - Accessible at `/robots.txt`
  - **SEO Impact**:
    - ✅ Unique titles per page (Google's explicit recommendation)
    - ✅ Unique meta descriptions for rich snippets
    - ✅ Canonical tags prevent query-param duplicates
    - ✅ Sitemap helps search engines discover all pages
    - ✅ Robots.txt guides crawler behavior
    - ✅ Absolute URLs via metadataBase (proper OG/Twitter sharing)
    - ✅ Consistent brand voice (plural "Vi" throughout metadata)
  - **Files Modified**: 5 (layout.tsx, page.tsx, cases/page.tsx, about/page.tsx, contact/page.tsx)
  - **Files Created**: 2 (sitemap.ts, robots.ts)
  - **Production Domain**: https://khyteautomations.com (canonical)
  - **Post-Deployment Actions**:
    - Submit sitemap to Google Search Console
    - Verify robots.txt accessibility
    - Test social media preview cards (LinkedIn, Twitter, Facebook)
  - **Build Status**: ✅ Production build successful, all routes static

- **v1.14** (2025-12-21) - Typography & Spacing Design System Implementation
  - **Font Loading**:
    - Added Inter font via `next/font/google` for premium geometric look across all OS
    - Applied site-wide to replace dated system fonts (especially on Windows/Android)
  - **Design Tokens (globals.css)**:
    - Background: `#0F0F10` → `#0A0A0A` (softer black, OLED-safe)
    - Text: `#EDEDEF` → `rgba(255,255,255,1.0)` (pure white for headings)
    - NEW: `--color-text-body: rgba(255,255,255,0.85)` (body text with 85% opacity)
    - Borders: `#27272A` → `rgba(255,255,255,0.15)` (opacity-based)
  - **Typography System (all pages except homepage)**:
    - H1: `clamp(3rem,5vw,4rem)`, weight 700, tracking -0.03em, leading 1.1
    - H2: 2rem (32px), weight 600, tracking -0.01em, leading 1.2
    - H3: 1.5rem (24px), weight 500, leading 1.3
    - Body intro: 1.25rem (20px), lh 1.6, opacity white
    - Body base: 1rem (16px), lh 1.5, opacity white
    - Labels: 14px (text-sm), weight 700, tracking 0.02em, pure white
  - **Spacing & Readability**:
    - Card padding: p-10 (40px) → p-8 (32px) across all cards
    - Body text max-width: 460px (cards), 65ch (sections)
    - Label spacing: mb-1 → mb-2 (4px → 8px)
  - **Pages Updated**:
    - `/cases`: Card titles larger, labels bold, body text crisp
    - `/about`: H1 bolder, body 20px, profile cards tighter
    - `/contact`: Form labels bold white, contact info prominent
  - **Visual Impact**:
    - "Light shining through" effect with opacity whites vs grey hex
    - Bolder hierarchy (H1 700 weight immediately grabs attention)
    - Clearer sections (H2 32px vs 24px with semi-bold weight)
    - Better readability (max-widths prevent eye strain)
    - Premium tighter spacing (32px card padding)
  - **Files Modified**:
    - `layout.tsx`: Inter font loading
    - `globals.css`: Design tokens (background, text colors, borders)
    - `cases/page.tsx`: Typography & spacing (13 changes)
    - `about/page.tsx`: Typography & spacing (11 changes)
    - `contact/page.tsx`: Typography & spacing (11 changes)
  - **Note**: Homepage (/) intentionally not touched per requirements

- **v1.13** (2025-12-21) - About Page Image Optimization
  - **Profile Images**:
    - Replaced profile images with cropped versions: `Hai Bui 2.png` and `Abdi 2.png`
    - Changed aspect ratio from `aspect-[4/7]` to `aspect-[5/6]` (shorter, more compact frames)
    - Images are pre-cropped to remove top headroom (manual editing approach vs CSS cropping)
    - Original images kept as backups: `Hai Bui.png` and `Abdi.png`
  - **Card Styling**:
    - Reduced top padding on profile cards from `p-10` (40px all sides) to `pt-6 px-10 pb-10`
    - Top padding: 24px (reduced from 40px)
    - Left/right/bottom padding: 40px (unchanged)
    - Creates tighter visual presentation with less empty space above images
  - **Technical Notes**:
    - CSS `object-position` cropping was attempted but didn't produce desired results
    - Manual image editing with new aspect ratio proved more effective
    - All images maintain `object-cover` for proper scaling

- **v1.12** (2025-12-19) - About Page Profile Updates
  - **Profile Images**:
    - Added Abdi.png (1414x2000) for Abdimajiid Mohamud profile
    - Optimized Hai Bui.png to smaller file size (898KB)
    - Changed profile image aspect ratio from `aspect-[4/5]` to `aspect-[4/7]` (taller containers to show full body)
  - **Content Updates**:
    - Updated about page opening copy with clearer messaging about AI automation
    - Refined company philosophy section with more direct language
    - Updated Hai's profile description (Grundare och Automationsansvarig)
    - Updated Abdi's profile description and added email contact (abdimajiidmohamud@gmail.com)
    - Changed Abdi's role to "Partner - Säljare"
  - **Design**:
    - Profile images now use 4:7 aspect ratio for better full-body presentation
    - All profile cards maintain consistent styling and hover effects

- **v1.11** (2025-12-18) - Timeline SVG Circle Integration (SHELVED - NOT SHIPPING)
  - **GOAL**: Electricity traveling through circles as part of conductor path
  - **HORIZONTAL SCAN ✅** (Working perfectly - KEEPING):
    - Scan light travels 80% across timeline connector (300ms delay, 3640ms duration)
    - 200px wide, 4px height, 1px blur, 0.9 opacity at peak
    - Uses `color-mix()` with `--color-accent` token
    - Timing system working correctly
  - **SVG CIRCLE LOOPS ❌** (Not working, shelving for now):
    - **Issue**: Green flash appears on page reload (debug stroke visible)
    - **Root cause**: Debug strokes (`stroke="lime"`, `opacity: 1`) were added for testing
    - **Attempted fixes**:
      - Fixed coordinate space mismatch (trackRef vs sectionRef)
      - Fixed var owner mismatch (closest with data attribute)
      - Added double rAF for stable timing
      - Added px units to dashoffset keyframes
    - **Current state**: Debug code still in place, circles show but don't animate correctly
    - **Decision**: Shelve circle animation work, keep only horizontal scan
  - **REMOVED OLD ANIMATIONS** (keeping this cleanup):
    - Deleted circle pop effect (`.timeline-circle::after` + `circleOutlineSnap`)
    - Deleted step outline effect (`.timeline-step::before` + `stepOutlineScan`)
    - Deleted bridge segment (`.timeline-step--2::after` + `bridgeScan`)
    - All ~126 lines of old animation code removed
  - **FILES TO CLEAN UP BEFORE SHIPPING**:
    - `src/components/TimelineCircles.tsx` - Remove or disable component
    - `src/components/TimelineProcess.tsx` - Remove TimelineCircles import/usage, remove debug logging
    - `src/app/globals.css` - Remove SVG circle CSS (lines 267-331)
  - **SHIPPING**: Timeline with horizontal scan only (v1.9 state + cleanup)

- **v1.10** (2025-12-17) - Timeline Scan Animation with Outline Snap (ITERATION 2 - DEPRECATED)
  - **GOAL**: Electricity pulsing through - scan light traveling across timeline with sharp outline snap on circles
  - **SCAN ANIMATION ✅** (Working as intended):
    - Scan light travels 80% across timeline connector (300ms delay, 3640ms duration)
    - 200px wide, 4px height, 1px blur, 0.9 opacity at peak
    - Uses `color-mix()` with `--color-accent` token
  - **CIRCLE OUTLINE SNAP ⚠️** (Implemented but not desired effect):
    - **Issue**: Creates a "pop" effect whenever scan passes through circles
    - **Problem**: Timing is delayed and doesn't feel like continuous electricity flow
    - **Step 1 Issue**: Step 1 circle (solid white) should not have outline snap effect
    - **Current Implementation**:
      - Outline ring pseudo-element (`::after`) with `inset: -6px`
      - 240ms snap animation with scale 0.98 → 1.02 → 1.06
      - Semi-transparent white border via `color-mix(in oklab, var(--color-accent) 55%, transparent)`
      - Timing via CSS variables: `--timeline-hit-1/2/3` (500ms, 2120ms, 3540ms)
      - Uses `calc(var(--timeline-scan-delay) + var(--timeline-hit-X))` for delays
  - **TIMING SYSTEM ✅**:
    - Shared timing variables scoped to `.timeline-line, .timeline-step`
    - `--timeline-scan-delay: 0ms` (avoids double-counting with scan's 300ms delay)
    - `--timeline-scan-duration: 3640ms`
    - Single source of truth for all timeline animations
  - **FILES MODIFIED**:
    - `src/components/TimelineProcess.tsx` (new) - Client component with IntersectionObserver
    - `src/app/globals.css` - Timing variables, `circleOutlineSnap` keyframe, `::after` pseudo-element
    - `src/app/page.tsx` - Replaced static process section with TimelineProcess component
    - Added `overflow-visible` to grid and step containers
  - **NEXT ITERATION**:
    - Refine circle pulse effect to feel like continuous electricity wave
    - Fix timing to sync perfectly with scan arrival
    - Exclude Step 1 (solid white circle) from pulse effect
    - Explore alternative visual approaches (border glow, expanding ring, etc.)

- **v1.9** (2025-12-17) - Hero Layout Refinements & Centered Cover Design
  - **Centered Hero Layout**: Added `mx-auto`, `text-center`, `items-center` to hero for centered "cover" presentation
  - **Full-Width Divider**: Implemented viewport-wide border separator after hero using full-bleed technique
  - **Scroll Cue Chevron**: Added subtle inline SVG chevron in circle at hero bottom (no JS, naturally disappears on scroll)
  - **Hero Height**: Adjusted to `min-h-[92svh] md:min-h-[100svh]` to prevent cases section visibility on initial load
  - **Responsive Spacing**: Added spacer element (`h-12 md:h-16`) between hero and cases for clean separation
  - **Bottom Padding**: Added `pb-10 md:pb-12` to hero for subtle "continuation cue"
  - Hero now feels like a distinct, centered "cover" chapter with clear visual separation from content sections

- **v1.8** (2025-12-17) - Profile Image & Case Preview Updates
  - Added Hai Bui profile photo (PNG, 1414x2000) to About page
  - Replaced profile placeholder with Next.js Image component
  - Updated first case preview: "Automatiserad informationsförädling"
  - Changed case description to reference allabolag.se automation
  - Increased DNA weave opacity from 0.18 to 0.24

- **v1.7** (2025-12-15) - Contact Form Phone Field & Landing Page Copy Updates
  - Added phone number field to contact form (Telefon, optional, type="tel")
  - Added phone number (070-099 68 38) to direct contact options with tel: link
  - Updated landing page copy to use plural voice ("vi" instead of "jag")
  - Changed hero H1: "vill göra" → "behöver göra"
  - Updated subtext with "kundnära effektivt" messaging
  - Process section: "Så jobbar jag" → "Så jobbar vi"
  - Process intro: More casual tone ("simpel process utan onödigt skit")
  - Replaced em-dashes with hyphens in step titles for consistency

- **v1.6** (2025-12-15) - DNA Weave SVG Component & Footer CTA Redesign
  - Created DnaWeaveSvg component with horizontal slide animation (16s loop)
  - Redesigned footer CTA from 2-column to centered single-column layout
  - DNA weave animation positioned below CTA button with subtle opacity (0.18)
  - Removed vertical oscillation for cleaner animation
  - Inline SVG for instant loading and scalability

- **v1.5** (2025-12-15) - About Page Implementation
  - Added new `/about` route (Swedish: "Om Khyte")
  - Implemented three-section About page:
    - Section 1: Company purpose with two-column layout
    - Section 2: Work philosophy card with bullet points
    - Section 3: Team profiles (Hai & Abdi) with contact info
  - Updated Nav component to client component with `usePathname()` for active state
  - Added "Om" link to navigation between "Case" and "Kontakt"
  - Active nav links now highlight with `text-[var(--color-text)]`
  - Placeholder image blocks use card-style framing (border + background)
  - Used typographic Swedish quotes ("") for premium look
  - All responsive layouts stack properly on mobile (lg: breakpoint)
  - Zero new design tokens - fully consistent with existing system

- **v1.4** (2025-12-15) - Fixed Navigation & Page Header Refinements
  - Added fixed navigation header with backdrop blur effect
  - Refined Cases and Contact page headers with larger H1 typography (2.5rem)
  - Updated all pages with `pt-32` spacing to accommodate fixed nav
  - Replaced footer placeholder image with DNA weave GIF animation
  - Improved CTA text styling and visual hierarchy
  - Moved Nav component outside Container for proper fixed positioning
  - Enhanced page subtitle typography (17px, improved line-height)

- **v1.3** (2025-12-14) - Pixel-Perfect HTML v1 Migration
  - Complete design system overhaul (monochrome scheme)
  - Replaced all color tokens: cyan accent → pure white accent
  - Updated all border radius: 12-20px → 4px
  - Created reusable components: Button, CaseCard, Container
  - Rebuilt landing page: data-driven cases + timeline + footer CTA
  - Updated Nav: added logo, removed "Hem"
  - Updated all pages with consistent v1 styling
  - Zero hard-coded colors (all via CSS variables)
  - Production ready: all routes static, no TS errors

- **v1.2** (2025-12-12) - Multi-Page Redesign
  - Replaced single-page site with multi-page structure
  - New pages: `/` (hero-first), `/cases`, `/contact`
  - Added shared Nav component
  - Added CSS animations
  - All routes statically generated

- **v1.1** (2025-12-12) - Root Page Redirect
  - Root page (`/`) redirects to `/automations`
  - Simplified entry point

- **v1.0** (2025-12-10) - Initial Implementation
  - Swedish marketing site at `/automations`
  - Tailwind v4 configuration
  - Formspree contact form
  - Production build working

- **v1.15** (2025-12-22) - Timeline Animation Cleanup (SVG Circle Removal)
  - **Goal**: Remove non-functional SVG circle animations while preserving horizontal scan
  - **Removed Components**:
    - Deleted `src/components/TimelineCircles.tsx` (entire file)
    - Removed TimelineCircles import and usage from TimelineProcess.tsx
    - Removed SVG wrapper div from timeline markup
    - Removed all geometry measurement code (circle position calculations)
    - Simplified IntersectionObserver to only trigger visibility state
  - **CSS Cleanup**:
    - Removed all SVG circle-related CSS from globals.css:
      - `.timeline-circles` styles
      - `.circles-energy` styles
      - `.circle-energy` animation classes
      - `circleLoop` keyframe animation
      - SVG-specific media queries
  - **Preserved**:
    - Horizontal timeline scan animation (perfect working state)
    - `timelineScan` keyframe animation
    - `.timeline-line::after` pseudo-element
    - 200px scan light traveling 80% across timeline
    - All timing (3640ms duration, 300ms delay)
  - **Result**: Clean timeline with only horizontal scan, no debug circles visible
  - **Files Modified**:
    - `src/components/TimelineProcess.tsx` - Removed SVG code and geometry logic
    - `src/app/globals.css` - Removed ~65 lines of SVG circle CSS
  - **Files Deleted**:
    - `src/components/TimelineCircles.tsx`
  - **Build Status**: ✅ Production build successful, no TypeScript errors

- **v1.16** (2025-12-22) - Landing Page Typography Enhancement
  - **Goal**: Apply decisive typography system to landing page (homepage)
  - **Typography Changes**:
    - **Hero H1**:
      - Weight: 500 (medium) → 700 (bold) for stronger presence
      - Size: Kept original `clamp(3rem,5vw,4.5rem)` (user preference)
      - Removed inline fontWeight style
    - **Hero Subtitle**:
      - Color: `--color-muted` → `--color-text-body` (opacity white)
      - Size: `clamp(1.1rem,2vw,1.25rem)` → fixed `1.25rem` (20px)
      - Removed inline fontWeight style, added explicit leading
    - **Section Header** ("Nyliga projekt"):
      - Color: `--color-muted` → `--color-text` (pure white)
      - Weight: Added 700 (bold) for stronger label presence
    - **Footer CTA H2**:
      - Size: Restored to `clamp(2rem,3vw,2.5rem)` (user preferred hierarchy)
      - Weight: medium → 600 (semibold)
      - Added tracking -0.01em and leading 1.2
    - **Footer Text**:
      - Color: `--color-muted` → `--color-text-body` (opacity white)
      - Size: Kept `text-base` (16px) for better hierarchy with larger H2
      - Max-width: Kept `max-w-2xl` (original preference)
  - **Timeline Section Updates** ([TimelineProcess.tsx](src/components/TimelineProcess.tsx)):
    - **Section Intro**: Opacity white (`--color-text-body`), 16px, max-w-[65ch]
    - **Step Titles (H3)**: Size 18px → 24px (`1.5rem`), added leading-[1.3]
    - **Step Descriptions**: Opacity white, 16px, leading-[1.5], max-w-[460px]
  - **Case Card Component** ([CaseCard.tsx](src/components/CaseCard.tsx)):
    - **Card Padding**: p-10 (40px) → p-8 (32px) for tighter, premium feel
    - **H3 Title**: Size 20px → 24px (`1.5rem`), added leading-[1.3]
    - **Description**: Color muted → text-body (opacity white), size 15px → 16px, leading 1.6 → 1.5, added max-w-[460px]
  - **Global CSS** ([globals.css](src/app/globals.css)):
    - `.section-header`: Added font-weight 700, changed color from muted to pure white
  - **Visual Impact**:
    - Bolder hero with original preferred size
    - Footer CTA maintains strong hierarchy (large heading, smaller text)
    - Timeline steps more prominent with larger titles
    - Opacity white creates "light shining through" effect throughout
    - Tighter card spacing (32px) feels more premium
  - **Files Modified**:
    - `src/app/page.tsx` - Hero, footer CTA typography
    - `src/components/TimelineProcess.tsx` - Timeline section typography
    - `src/components/CaseCard.tsx` - Card padding and typography
    - `src/app/globals.css` - Section header styling
  - **Backtrack Reference**: `.backtrack-landing-page-v1.15.md` created with original values
  - **Build Status**: ✅ Production build successful, no TypeScript errors

- **v1.17** (2025-12-25) - P0 Micro-Polish: Obsidian Design System (Geist Sans + Physics Update)
  - **Goal**: Tighten design physics (typography, spacing, contrast) and switch from Inter to Geist Sans
  - **Phase 1: Typography Upgrade**:
    - Installed `geist` package (v1.5.1)
    - Updated `layout.tsx`: Replaced Inter with GeistSans from `geist/font/sans`
    - Applied `--font-geist-sans` CSS variable to `<html>` tag
    - Kept Swedish `lang="sv"` attribute
  - **Phase 2: Design Tokens (Obsidian System)**:
    - **Background**: `#0A0A0A` (richer, OLED-safe black)
    - **Card Background**: `#18181B` → `#121212` (softer lift)
    - **Text**: `rgba(255,255,255,1.0)` → `#FFFFFF` (pure white for headings)
    - **Text Body**: `rgba(255, 255, 255, 0.85)` (high-contrast body text)
    - **Muted**: `#A1A1AA` → `rgba(255, 255, 255, 0.50)` (opacity-based)
    - **Border**: `rgba(255, 255, 255, 0.15)` (opacity-based)
    - **Font Stack**: Added `--font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif`
    - **Spacing**: `--spacing-section: 120px` → `128px` (tighter, more premium)
    - **Body Font**: Updated to use `var(--font-sans)`
  - **Phase 3: Utility Layer**:
    - Added `.text-hero` utility: 700 weight, -0.03em tracking, 1.1 leading
    - Added `.text-label` utility: 13px, 700 weight, 0.05em tracking, uppercase, pure white
  - **Phase 4: Homepage Physics** ([page.tsx](src/app/page.tsx)):
    - **Hero H1**: Applied `.text-hero`, upgraded to `text-5xl md:text-7xl`, added `drop-shadow-sm`, `mb-8` → `mb-6`
    - **Hero Subtitle**: Reduced `max-w-[600px]` → `max-w-[540px]`, `mb-12` → `mb-10`
    - **Button Container**: Added `mt-10` spacing
    - **Section Label**: Replaced `.section-header` with `.text-label mb-8`, changed "Nyliga projekt" → "Senaste projekt"
    - **Footer CTA H2**: Scaled up to `text-5xl md:text-6xl`
    - **Footer Subtext**: Updated margin `mb-8` → `mb-10`
  - **Visual Impact**:
    - Premium Linear-like aesthetic with Geist Sans typography
    - Sharper hierarchy: pure white headings vs 85% opacity body text
    - "Light through darkness" effect with opacity-based muted colors
    - Tighter, more premium spacing (128px sections, mb-6/mb-10 rhythm)
    - Larger hero and footer headlines create strong visual impact
  - **Files Modified**:
    - `src/app/layout.tsx` - Geist Sans integration
    - `src/app/globals.css` - Obsidian tokens + utility layer
    - `src/app/page.tsx` - Hero, section label, footer CTA physics
  - **Build Status**: ✅ Production build successful, TypeScript clean

- **v1.18** (2025-12-25) - Cases Page: Obsidian Design System Polish
  - **Goal**: Apply Obsidian design system to `/cases` page with engineering data aesthetic
  - **Page Header (Hero Treatment)** ([cases/page.tsx:27-32](src/app/cases/page.tsx#L27-L32)):
    - **H1**: Applied `.text-hero` utility, changed "Case" → "Utvalda Case", upgraded to `text-5xl md:text-7xl`
    - **Subtitle**: Scaled to `text-xl`, tightened max-width to `max-w-[60ch]` (consistency with homepage)
  - **Case Cards (Engineering Data Aesthetic)** ([cases/page.tsx:46,54,62](src/app/cases/page.tsx#L46)):
    - **Labels**: Applied `.text-label` utility to Problem/Build/Result labels
    - **Visual Impact**: Uppercase, 13px, bold, pure white color creates engineering data look
    - **Hierarchy**: Clear contrast between white labels and 85% opacity body text
    - **Preserved**: All hover animations (`hover:border-[var(--color-muted)]`)
  - **Bottom CTA** ([cases/page.tsx:75-84](src/app/cases/page.tsx#L75-L84)):
    - **Headline**: Scaled up dramatically to `text-4xl md:text-5xl`
    - **Weight**: Updated from `font-medium` → `font-bold` with `tracking-tight`
    - **Spacing**: Added generous bottom padding (`pb-20`) and button separation (`mt-8`)
  - **Visual Outcome**:
    - Massive headline "Utvalda Case" (7xl on desktop) matches homepage hero treatment
    - Engineering data aesthetic with crisp uppercase labels
    - Dramatic CTA scale-up creates strong visual finale
    - Consistent with Obsidian system (pure white vs opacity whites)
  - **Files Modified**:
    - `src/app/cases/page.tsx` - Header, labels, bottom CTA
  - **Build Status**: ✅ Production build successful (12.1s), TypeScript clean

- **v1.19** (2025-12-26) - About Page: Obsidian Design System Polish
  - **Goal**: Apply Obsidian design system to `/about` page matching homepage/cases aesthetic
  - **Page Header (Hero Treatment)** ([about/page.tsx:13-18](src/app/about/page.tsx#L13-L18)):
    - Updated H1 from clamp() to `.text-hero text-5xl md:text-7xl`
    - Added subtitle paragraph: "Vi bygger automationer som tar bort friktion..."
    - Subtitle styling: `text-xl text-[var(--color-text-body)] max-w-2xl`
  - **Section 1 - Placeholder Div** ([about/page.tsx:32](src/app/about/page.tsx#L32)):
    - Changed from card-style to intentional placeholder
    - Updated: `bg-[var(--color-card-bg)]` → `bg-white/5`
    - Updated: `border-[var(--color-border)]` → `border-white/10`
    - Creates subtle, non-intrusive placeholder appearance
  - **Section 2 - Philosophy Card** ([about/page.tsx:44](src/app/about/page.tsx#L44)):
    - Updated headline from `font-medium` → `font-semibold`
    - Card already had correct p-8 padding and design tokens
  - **Section 3 - Team Section Header** ([about/page.tsx:61](src/app/about/page.tsx#L61)):
    - Upgraded from `text-[2rem]` to `text-4xl`
    - Changed `font-semibold` → `font-bold tracking-tight`
    - Increased margin from `mb-8` → `mb-10`
  - **Team Profile Cards** ([about/page.tsx:67-138](src/app/about/page.tsx#L67-L138)):
    - **Names** (L80, L117): `text-[1.5rem] font-medium` → `text-2xl font-bold text-white tracking-tight`
    - **Role Labels** (L85, L122): Applied `.text-label` utility (13px, bold, uppercase)
    - **Email Links** (L95-100, L132-137): Updated to `text-white hover:text-white/80` with underline
  - **Visual Impact**:
    - Massive hero headline matches homepage/cases
    - Engineering data aesthetic with `.text-label` on role badges
    - Clearer hierarchy with bolder names and tighter tracking
    - Premium email link treatment with underlines
  - **Files Modified**: `src/app/about/page.tsx` (8 change locations)
  - **Build Status**: ✅ Production build successful (9.3s), TypeScript clean

- **v1.20** (2025-12-26) - Contact Page: Obsidian Polish + Card Container (Final 5%)
  - **Goal**: Apply Obsidian design system to `/contact` page and add card container for visual balance
  - **Page Header (Hero Treatment)** ([contact/page.tsx:12-17](src/app/contact/page.tsx#L12-L17)):
    - Updated H1 from clamp() to `.text-hero text-5xl md:text-7xl`
    - Updated subtitle: `text-xl text-[var(--color-text-body)] max-w-[60ch]`
  - **Form Labels** ([contact/page.tsx:31,47,62,77,93](src/app/contact/page.tsx#L31)):
    - Applied `.text-label` utility to all 5 form field labels
    - Replaced `text-sm font-bold tracking-[0.02em]` with centralized utility
    - Creates engineering data aesthetic matching cases/about pages
  - **Direct Contact Section** ([contact/page.tsx:113-165](src/app/contact/page.tsx#L113-L165)):
    - **Section Header** (L114): Upgraded to `text-4xl font-bold tracking-tight`
    - **Contact Labels** (L120, L132, L144): Applied `.text-label` utility
    - **Email/Phone Links** (L125, L137): Updated to `text-xl text-white hover:text-white/80 underline`
    - **Bottom Text** (L159): Changed "Jag svarar" → "Vi svarar" for plural consistency
  - **Card Container (Final Polish)** ([contact/page.tsx:113](src/app/contact/page.tsx#L113)):
    - Wrapped entire right column in card container
    - Added: `bg-[var(--color-card-bg)] border border-[var(--color-border)] p-8 rounded-[4px]`
    - Added: `hover:border-[var(--color-muted)]` for subtle interaction
    - Removed nested wrapper div - H2 sits directly inside card
    - Added `mb-8` to contact options div for proper spacing
    - **Visual Impact**: Eliminates "sidebar drift", creates balanced Input Area (left) vs Info Area (right)
  - **Input Field Backgrounds** ([contact/page.tsx:40,55,70,86,102](src/app/contact/page.tsx#L40)):
    - Updated all 5 inputs/textarea: `bg-[var(--color-bg)]` → `bg-[var(--color-card-bg)]`
    - Creates subtle "inlaid" effect (#121212 inside #0A0A0A)
    - Better defines clickable areas and enhances tactile feel
  - **Visual Impact**:
    - Right column card container matches visual weight of form on left
    - Balanced two-column layout with equal structural presence
    - Input fields have premium "inlaid" effect
    - Consistent card aesthetic across all pages
  - **Files Modified**: `src/app/contact/page.tsx` (9 change locations)
  - **Build Status**: ✅ Production build successful (7.5s), TypeScript clean

---

**Last Updated**: 2026-01-07
**Current Version**: v1.21 (P0 SEO implementation)
**Status**: Production ready - Complete Obsidian design system + production-grade SEO ✅
**Next**: Deploy to production and submit sitemap to Google Search Console
