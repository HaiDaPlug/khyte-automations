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
│   │   ├── layout.tsx             # Root layout (Swedish metadata)
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

#### Design Tokens (v1.3 - Monochrome Scheme)

```css
@theme inline {
  --color-bg: #0F0F10;              /* Deep charcoal */
  --color-card-bg: #18181B;         /* Card background */
  --color-text: #EDEDEF;            /* Off-white text */
  --color-muted: #A1A1AA;           /* Muted grey */
  --color-accent: #FFFFFF;          /* Pure white accent */
  --color-border: #27272A;          /* Dark border */

  --radius-sm: 4px;                 /* Small border radius */
  --shadow-soft: 0 18px 45px rgba(0, 0, 0, 0.08);
}

:root {
  --spacing-section: 120px;         /* Section spacing (desktop) */
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

- **Font Stack**: System fonts (no web fonts for faster loading)
- **CSS**: `system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif`
- **Hero H1**: `clamp(3rem, 5vw, 4.5rem)` with weight 500, tracking -0.03em
- **Body Text**: 15px with line-height 1.6 for optimal readability

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
   - H1: "AI som tar hand om jobbet du inte vill göra."
   - Subtext: "Jag bygger automationer som tar bort friktion i vardagen — utan hype, bara fungerande workflows."
   - CTA buttons: "Boka ett samtal" (primary) + "Se hur det funkar" (secondary)
   - Max-width: 900px

3. **Cases Section** ("Nyliga projekt")
   - Section header: Uppercase, 14px, tracking 0.05em
   - **Exactly 2 case previews** (data-driven, expandable via array)
   - Cases:
     1. Automatiserad orderhantering
     2. AI-driven inbox triage
   - Uses CaseCard component

4. **Process Section** ("Så jobbar jag")
   - Border top + padding top (120px spacing)
   - Intro text (max-width 600px)
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
   - Animation: Horizontal slide only (16s), opacity 0.18, color var(--color-muted)
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
   - Left: Formspree form (4 fields: name, company, email, message)
   - Right: Direct contact options (email + Calendly)
4. **Form Styling**: 4px border radius, token colors, focus ring on accent
5. **Calendly Button**: Uses `<a>` tag (not next/link) with `target="_blank"`

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
     - Placeholder image block (4:5 aspect ratio, card-style frame)
     - Name (H3, 20px)
     - Role (small, muted text)
     - Description paragraph (15px, muted)
     - Contact info (email link for Hai, placeholder text for Abdi)
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

---

**Last Updated**: 2025-12-15
**Current Version**: v1.6
**Status**: Production Ready ✅
**Commit**: `839a739` - Refine footer CTA layout and DNA weave animation
