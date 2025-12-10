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
│   └── app/
│       ├── automations/
│       │   └── page.tsx          # Main marketing site (Swedish)
│       ├── layout.tsx             # Root layout (Swedish metadata)
│       └── globals.css            # Tailwind v4 config + global styles
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

### Form Implementation

The contact form at `/automations#contact` uses **Formspree** for submissions:

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

## Page Structure - `/automations`

The main marketing site is a single-page application with 8 sections:

1. **Header** - Sticky navigation with anchor links
2. **Hero** - Main value proposition + 3 benefit cards
3. **Services** - Target audiences (bureaus, consultants, Excel-heavy businesses)
4. **Process** - 3-step methodology (Understand → Test → Implement)
5. **Cases** - 3 example projects
6. **About** - Personal introduction about Hai
7. **Contact** - Functional Formspree form + direct contact options
8. **Footer** - Copyright and tech stack note

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
├── / (root page - default Next.js template)
├── /_not-found
└── /automations (main marketing site)

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

2. **src/app/layout.tsx**
   - Changed language to Swedish (`lang="sv"`)
   - Updated metadata (Swedish title and description)
   - Removed Geist font imports
   - Simplified to use system font stack
   - Applied `.main-wrapper` class to body

3. **src/app/automations/page.tsx** (NEW FILE)
   - Created full one-page marketing site
   - Implemented 8 sections as React components
   - Functional Formspree contact form
   - All Swedish copy
   - Responsive Tailwind classes

### Created Directories

- `src/app/automations/` - Houses the main marketing page
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

- [x] Site loads at `/automations`
- [x] All 8 sections render correctly
- [x] Smooth anchor navigation works (#services, #process, etc.)
- [x] Contact form submits to Formspree
- [x] Email link opens mail client (mailto:hai@khyteteam.com)
- [x] Calendly link opens in new tab
- [x] Responsive design works on mobile/tablet/desktop
- [x] Dark theme applied correctly
- [x] Swedish copy is accurate
- [x] No TypeScript errors
- [x] Production build succeeds

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

- **v1.0** (2025-12-10) - Initial implementation
  - Created Swedish marketing site at `/automations`
  - Implemented Tailwind v4 configuration
  - Integrated Formspree contact form
  - Production build working (dev mode has Turbopack bug)

---

**Last Updated**: 2025-12-10
**Status**: Production Ready ✅
