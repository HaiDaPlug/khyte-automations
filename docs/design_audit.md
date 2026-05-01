# Khyte Site — Design Audit & Sitewide Consistency Plan

## Status: Homepage locked. Inner pages pending.

---

## The Rule (extracted from AutomationShowcase)

The homepage has converged on a clear design language. Every section should follow this pattern:

```
section-eyebrow (uppercase label, orange accent)
H2: BLACK LINE / ORANGE LINE (font-display, uppercase, split)
Body copy (text-sm/base, muted brown, max ~52ch)
Content (cards / grid / list)
Brutalist CTA link — right-aligned, font-display, tracking-[0.2em], uppercase, black → hover orange, inline SVG arrow
```

**Card standard:** transparent bg, `border border-[var(--color-border)]`, `rounded-2xl`, muted number labels (`text-[var(--color-accent)] opacity-50`), Lucide icon + bold title, body copy.

**Link standard (brutalist ink):**
```
font-display text-sm font-bold tracking-[0.2em] uppercase
text-[var(--color-text)] hover:text-[#D4622B] transition-colors duration-300
flex items-center gap-2 + inline SVG arrow
```
No underline. No muted color. No generic blue. Just ink + hover burn.

---

## Homepage — Links to Upgrade

These existing links use the old "muted underline" style and need the brutalist ink treatment:

| Location | Current | Fix |
|----------|---------|-----|
| `CasesSection.tsx:14` | `"Se alla case →"` — muted, underline, sm font-medium | Brutalist ink link, right-aligned in header |
| `CasesSection.tsx:108` | Dashed placeholder card "Läs mer om våra case" | Replace with brutalist text link or keep card but strip the generic icon/copy |
| `CasesSection.tsx:138` | Mobile `"Se alla case →"` — same muted underline | Brutalist ink, centered on mobile |

---

## Inner Pages — Audit

### `/tjanster` — Services
**Gap:** Centered generic hero (`text-hero`, no eyebrow, no orange split). Section headers inconsistent. No brutalist CTAs.
**Work needed:** Medium. Apply eyebrow + H2 split pattern. Replace section link styles. No structural rewrite needed.

### `/case` — Case Studies
**Gap:** Bare card list, minimal styling. Cards don't match CasesSection visual language (no gradient image, no mono tag, no attribution footer pattern).
**Work needed:** Medium-high. Cards need a full visual pass to match the established CasesSection card style.

### `/om-oss` — About
**Gap:** Plain copy block + placeholder image box (no real photo). No conviction, no brand voice in layout.
**Work needed:** Medium. Apply design tokens, eyebrow/H2 split on section headers. Real photo still missing — placeholder stays until asset arrives.

### `/kontakt` — Contact
**Gap:** Closest to done. Centered hero, grid form. Needs eyebrow + H2 split and brutalist CTA polish.
**Work needed:** Low. Mostly token/class edits.

---

## Recommended Execution Order

1. **Homepage link upgrades** (CasesSection — 3 links) — minimal diff, immediate visual impact
2. **`/kontakt`** — lowest effort, high polish payoff, conversion-critical
3. **`/tjanster`** — most visited after homepage, needs the eyebrow/H2 split applied
4. **`/case`** — card visual pass, depends on whether real case assets are available
5. **`/om-oss`** — blocked on real photo asset; do layout pass now, photo swap later

---

## Inner Pages vs. Homepage: Manual Work Assessment

**Mostly token/class application (not rewrites):**
- Eyebrow pattern: swap `<h1 className="text-hero ...">` → `section-eyebrow` + `font-display` H1 with orange split
- Link styles: find/replace underline muted links with brutalist ink class
- Section spacing: verify `--spacing-section` token usage is consistent

**Genuine manual work:**
- `/case` card redesign (needs gradient image headers like CasesSection card 1)
- `/om-oss` copy and layout conviction — structural thinking required, not just token application

---

## What "Apply the Rules" Means Per Page

Not a rewrite. For each inner page:
1. Hero: add `section-eyebrow`, convert H1 to `font-display uppercase` with orange word split
2. Section headers: same eyebrow + split pattern
3. Any existing links that navigate forward: brutalist ink treatment
4. Cards/grids: transparent bg + border + muted numbers where applicable
5. Final section: brutalist CTA link pointing to next logical destination (usually `/kontakt`)
