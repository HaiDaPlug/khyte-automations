# Khyte Automations - Project Context Summary

## Project Overview

**Khyte Automations** is a Swedish-language marketing website for an AI consulting business that helps small to medium-sized companies automate workflows and eliminate time-wasting manual tasks.

## Tech Stack

- **Framework**: Next.js 16.0.8 (App Router)
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
│   │   ├── automations/
│   │   │   └── page.tsx          # Redirects to / (v1.2)
│   │   ├── cases/
│   │   │   └── page.tsx          # Cases page (3 case cards)
│   │   ├── contact/
│   │   │   └── page.tsx          # Contact page (Formspree form)
│   │   ├── page.tsx               # Landing page (hero-first)
│   │   ├── layout.tsx             # Root layout (Swedish metadata)
│   │   └── globals.css            # Tailwind v4 config + animations
│   └── components/
│       └── Nav.tsx                # Shared navigation component
├── docs/
│   └── CONTEXT.md                 # This file
├── public/                        # Static assets
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

#### Custom Theme Variables

```css
@theme inline {
  /* Colors */
  --color-background: #0f172a;      /* Dark slate */
  --color-foreground: #f9fafb;      /* Near-white */
  --color-muted: #9ca3af;           /* Gray-400 */
  --color-accent: #38bdf8;          /* Sky-400 (primary brand) */
  --color-accentSoft: rgba(56, 189, 248, 0.12);
  --color-borderSoft: rgba(148, 163, 184, 0.35);

  /* Border Radius */
  --radius-xl: 1rem;
  --radius-2xl: 1.25rem;

  /* Shadows */
  --shadow-soft: 0 18px 45px rgba(0, 0, 0, 0.08);
}
```

**Usage in JSX**: `className="bg-background text-foreground border-borderSoft"`

### Typography

- **Font Stack**: System fonts (no web fonts for faster loading)
- **CSS**: `system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif`
- **Note**: Geist fonts were removed from the original Next.js template

### Contact Information (Production Data)

⚠️ **CRITICAL - Do Not Change Without Authorization**

- **Email**: `hai@khyteteam.com`
- **Calendly**: `https://calendly.com/hai-khyteteam/30min`
- **Formspree Endpoint**: `https://formspree.io/f/xzznjaly`

### CSS Animations (v1.2)

Lightweight CSS-only animations added for hero section:

```css
/* Gradient shift animation */
@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Floating shapes animation */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
```

**Usage**: Hero section includes animated gradient background and floating shapes with staggered timing.

### Form Implementation

The contact form at `/contact` uses **Formspree** for submissions:

```html
<form action="https://formspree.io/f/xzznjaly" method="POST">
  <input type="text" name="name" required />
  <input type="text" name="company" />
  <input type="email" name="email" required />
  <textarea name="message" required></textarea>
  <button type="submit">Skicka förfrågan</button>
</form>
```

**Important**:
- All inputs must have `name` attributes
- No custom JavaScript needed - Formspree handles submission
- User is redirected to Formspree's thank-you page after submission

## Site Structure (v1.2 Multi-Page)

The site now uses a multi-page structure with dedicated pages:

### `/` - Landing Page (Hero-First)
1. **Shared Navigation** - Hem / Case / Kontakt
2. **Hero Section** - Full-screen with slogan + CSS animations (gradient, floating shapes)
3. **Case Preview** - 3 short case teasers linking to `/cases`
4. **How I Work** - 3-step process (numbered cards)
5. **Bottom CTAs** - Links to `/cases` and `/contact`

### `/cases` - Cases List Page
1. **Shared Navigation** - Hem / Case / Kontakt
2. **Page Header** - "Case" + subheading
3. **Cases Grid** - Exactly 3 case cards with Problem/Build/Result format
4. **Bottom CTA** - Link to `/contact`

**Case Examples**:
- **Prospektmotor för sälj** - Automated company data to Google Sheets
- **Research-motor för byrå** - Automated industry/competitor data collection
- **Interna admin-flöden** - Automated internal workflows and reminders

### `/contact` - Contact Page
1. **Shared Navigation** - Hem / Case / Kontakt
2. **Page Header** - "Kontakt" + subheading
3. **Formspree Form** - name, company (optional), email, message
4. **Direct Contact** - Email link + Calendly button (uses `<a>` tag, not next/link)

### `/automations` - Redirect
Server-side redirect to `/` using Next.js `redirect()` function

### Shared Components

**Nav Component** (`src/components/Nav.tsx`):
- Minimal navigation: Hem / Case / Kontakt
- Links to: `/` / `/cases` / `/contact`
- Used on all pages to prevent dead-end feeling
- Styled with text-sm, muted color, accent hover

### Design System

**Color Palette**:
- Background: Dark slate (#0f172a) with radial gradient
- Accent: Sky blue (#38bdf8) for CTAs and highlights
- Text: Near-white (#f9fafb) with muted gray (#9ca3af) for secondary text

**Key Features**:
- Smooth anchor navigation (`scroll-behavior: smooth`)
- Responsive grid layouts (`sm:grid-cols-3`, `lg:flex-row`)
- Dark theme throughout
- Border dividers between sections
- Soft shadows on cards

## Content Language

**All user-facing content is in Swedish** (`lang="sv"` in HTML)

**Swedish Terminology Used**:
- "Tjänster" (Services)
- "Så jobbar jag" (How I work)
- "Exempel" (Examples)
- "Om mig" (About me)
- "Kontakt" (Contact)
- "Skicka förfrågan" (Send inquiry)

## Known Issues & Workarounds

### Turbopack Dev Mode Bug

**Issue**: Next.js 16.0.8's Turbopack has a panic error when compiling `/automations/page`:

```
FATAL: Turbopack Error: Failed to write app endpoint /automations/page
```

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
# Visit: http://localhost:3000/automations

# Dev mode (currently broken due to Turbopack bug)
npm run dev
# Note: Will show Turbopack panic error
```

### Build Output

```
Route (app)
├── / (landing page - hero-first)
├── /_not-found
├── /automations (redirects to /)
├── /cases (3 case cards)
└── /contact (Formspree form)

○ (Static) - All routes prerendered as static content
```

## File Modification History

### Modified Files

1. **src/app/globals.css**
   - Added Tailwind v4 `@theme inline` block
   - Defined custom color system (background, foreground, muted, accent, etc.)
   - Added radial gradient background
   - Created utility classes (`.main-wrapper`, `.section`)
   - Enabled smooth scrolling
   - **v1.2**: Added CSS animations (gradient shift, floating shapes)

2. **src/app/layout.tsx**
   - Changed language to Swedish (`lang="sv"`)
   - Updated metadata (Swedish title and description)
   - Removed Geist font imports
   - Simplified to use system font stack
   - Applied `.main-wrapper` class to body

3. **src/app/page.tsx**
   - **v1.0-v1.1**: Redirect to `/automations`
   - **v1.2**: Hero-first landing page with CSS animations, case previews, process section

4. **src/app/automations/page.tsx**
   - **v1.0-v1.1**: Full one-page marketing site with 8 sections
   - **v1.2**: Server-side redirect to `/`

5. **src/app/cases/page.tsx** (NEW in v1.2)
   - Dedicated cases page with exactly 3 case cards
   - Each card: Problem / Build / Result format
   - Links to `/contact` at bottom

6. **src/app/contact/page.tsx** (NEW in v1.2)
   - Dedicated contact page with Formspree form
   - Email link and Calendly button (uses `<a>` tag)
   - 2-column responsive layout

7. **src/components/Nav.tsx** (NEW in v1.2)
   - Shared navigation component
   - Links: Hem / Case / Kontakt
   - Used on all pages

### Created Directories

- `src/app/automations/` - Redirect page (v1.0-v1.2)
- `src/app/cases/` - Cases page (v1.2)
- `src/app/contact/` - Contact page (v1.2)
- `src/components/` - Shared components (v1.2)
- `docs/` - Documentation and context files

## Metadata & SEO

```typescript
{
  title: "Khyte Automations – AI som tar hand om jobbet du inte vill göra",
  description: "Khyte Automations hjälper företag att hitta tids­tjuvar i vardagen och bygga smarta automationer som frigör tid."
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
- [ ] Add animations/transitions (Framer Motion, etc.)
- [ ] Integrate analytics (Google Analytics, Plausible, etc.)
- [ ] Add more detailed case studies
- [ ] Create additional pages (blog, portfolio, detailed services)
- [ ] Fix Turbopack dev mode (requires Next.js update)

## Testing Checklist

Before deployment, verify:

**v1.2 Multi-Page:**
- [x] `/` loads landing page with hero + animations
- [x] `/cases` loads 3 case cards with Problem/Build/Result
- [x] `/contact` loads Formspree form + email + Calendly
- [x] `/automations` redirects to `/`
- [x] Shared navigation (Hem/Case/Kontakt) appears on all pages
- [x] CSS animations (gradient, floating shapes) work on hero
- [x] Contact form submits to Formspree
- [x] Email link opens mail client (mailto:hai@khyteteam.com)
- [x] Calendly button opens in new tab (uses `<a>` tag)
- [x] Responsive design works on mobile/tablet/desktop
- [x] Dark theme applied correctly
- [x] Swedish copy is accurate
- [x] No TypeScript errors
- [x] No ESLint warnings
- [x] Production build succeeds
- [x] All routes statically generated

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

## Version History

- **v1.2** (2025-12-12) - Multi-page redesign
  - Replaced single-page site with multi-page structure
  - **New pages**: `/` (hero-first landing), `/cases` (3 cards), `/contact` (Formspree form)
  - **Redirect**: `/automations` now redirects to `/`
  - **Components**: Created shared `Nav.tsx` component (Hem/Case/Kontakt)
  - **Animations**: Added lightweight CSS animations (gradient shift, floating shapes)
  - **Design**: Minimal, premium look with consistent navigation across all pages
  - **Production ready**: All routes statically generated, no TS/lint errors

- **v1.1** (2025-12-12) - Root page redirect
  - Replaced default Next.js template with redirect to `/automations`
  - Root page (`/`) automatically redirects to main marketing site
  - Simplified user experience - single entry point

- **v1.0** (2025-12-10) - Initial implementation
  - Created Swedish marketing site at `/automations`
  - Implemented Tailwind v4 configuration
  - Integrated Formspree contact form
  - Production build working (dev mode has Turbopack bug)

---

**Last Updated**: 2025-12-12
**Status**: Production Ready ✅ (v1.2)
