# Intentions & Ideas

Captured thoughts, directions, and things we want to act on. Lightweight by design — prune freely.

---

### World-class layout on all pages
> Migrated from current_state.md P1

Full visual pass: every page should feel unmistakably Khyte. Homepage hero, sections, cards — all cohesive and premium. Tjänster, Om oss, Case, Kontakt: apply design system consistently. Replace any remaining placeholder UI or off-brand elements.

### Social proof & trust indicators on homepage
> Migrated from current_state.md P2 — FAQ is done

COI / trust indicators: logos, stats, or trust strip that signals credibility. Should feel native to homepage rhythm, not bolted on.

### Design system audit across all pages
> Migrated from current_state.md P3

Tjänster, Om oss, Case, Kontakt: audit against design tokens. Verify `.btn-cta` on all primary actions, `text-label` on all eyebrows, section spacing consistent. Eliminate one-off inline styles. Mobile pass on all pages.

### Sharpen website copy
> Migrated from current_state.md P4

Audit all copy for clarity, directness, and brand voice. Hero h1, subheadline, section headers, CTA labels — all should feel earned and specific. Replace placeholder/generic copy with real differentiators.

### CasesSection: real photo + Cases page
> Migrated from current_state.md P5

Replace gradient image area with real case photo (`/case-photo.jpg`). Cases page refinement to match CasesSection visual language.

### "Vår vision" page
> Migrated from current_state.md P6

New route `/vision` — standalone page communicating long-term mission and values. Should feel editorial and personal, not corporate. Add to nav or footer once live.

### Custom booking & form flow (replace Calendly)

Build a fully owned booking experience — more impressive than Calendly, full control over logic and follow-ups.

**Phase 1 — Lean (ship first):**
- Multi-step qualification form (3-4 steps): name/email → what they want to automate → rough budget/company size
- On submit: hit n8n webhook with all form data
- n8n triggers Resend: branded confirmation to lead + internal notification to Hai
- No calendar picker yet — "we'll confirm a time within 2h" is more personal than a robot calendar
- Lives inside the existing Calendly drawer (swap contents)

**Phase 2 — Full:**
- Time slot picker (custom, not Calendly) after form submit
- Admin view: all bookings in one place
- Automated reminders via n8n + Resend (24h before, day-of)
- Qualification routing: different flows based on budget/need

**Why it matters:** Walk into every call already knowing what they need. Zero context is Calendly's biggest flaw. Full brand control, custom follow-up sequences, internal logic (e.g. flag high-value leads, skip certain steps for returning contacts).

**Stack:** Next.js API route → n8n webhook → Resend (transactional email)

### Homepage vision skeleton
> Migrated from current_state.md — target structure

8 sections, each with one job and a hard limit: Statement (hero) → Conviction Cards (3) → Fit Check (2-col qualify) → Process (3 steps) → Testimonials (1-2 max) → ROI/COI (3 stats) → FAQ (6 max) → CTA Band (close).
