# Khyte SEO — Living Decision Log
**Domain:** khyte.se · **Last updated:** 2026-09-30

This file is the single place for SEO state and decisions. It replaces the March 2026 audit as the
active roadmap. That audit is kept below as **Appendix A**: a keyword pool and idea bank, not a plan.

**How to maintain it:** when something ships, update *Current state* and tick it off in *Open items*.
When a decision is made, add it to *Decisions* with a date. When a claim rests on a source or a
measurement, log it under *Evidence*. When a change can be measured, add a row to *Measured outcomes*.

**Strategy in one line:** fix truth → fix plumbing → measure reality → strengthen proof → build pages
when evidence earns them → feed traffic back into proof.

The flywheel: client work → case → reveals a use case / integration → page that captures search demand →
visitor sees proof → conversation → client work.

---

## 1. Current state (verified 2026-09-30)

Verified from the outside (live HTML fetched as Googlebot, Lighthouse, DNS, redirects) and inside (code).
Rows marked **(main)** describe the P1 pass committed on 2026-09-30 and verified on a local production
build. They reach khyte.se on the next deploy.

| Area | State |
|---|---|
| Domains | `khyte.se` is canonical. `www.khyte.se`, `khyteteam.com`, `khyteautomations.com` 308 → `khyte.se` with path kept (≤2 hops). Unknown URLs return a real 404. |
| Crawling | `robots.ts` allows everything except `/internal/`. AI crawlers (incl. `OAI-SearchBot`) are allowed. |
| Sitemap | 12 URLs (7 static + 5 cases), generated from `src/data/cases.ts`. **(main)** No `lastmod` until real edit dates are tracked. |
| Google Search Console | **Verified** Domain property (DNS TXT), under the second Google account in Chrome (`/u/1/`); the default account has an unverified duplicate. Baseline exported 2026-10-02 (see Evidence). **No sitemap submitted.** 11 pages indexed; the 5 not indexed are old `www.`/font URLs and the `www.` home (canonical → `khyte.se`). No Core Web Vitals field data. |
| Google Business Profile | Verified, 5.0★ (1 review), ~230 customer interactions. **Primary category changed 2026-10-02** from Automationsföretag to Programvaruföretag; secondary Datorkonsult and Automationsföretag (pending Google review). "IT-konsult" does not exist as a Swedish category; Datorkonsult is Google's "Computer consultant". New description and services saved 2026-10-02 (pending review): description names Excel work, tools that don't talk to each other and manual steps, plus automatiseringar, integrationer och AI-lösningar; services are IT-konsultverksamhet and Programutveckling (predefined) plus Automatisering av arbetsflöden, Systemintegration, AI-automation, Excel-automatisering and Skräddarsydda system (custom). |
| Bing Webmaster Tools | Not set up. |
| Analytics | GA4 `G-F91HE9L5LS` (lazy) + Vercel Analytics. |
| Structured data | **(main)** Organization (with `logo.png`), ProfessionalService with full street address, postcode and coordinates for Västerbrogatan 8A, WebSite, Person (Hai). Values read from `src/data/facts.ts`. FAQPage on `/` and `/tjanster`, matching the visible accordions. |
| Titles / descriptions | Unique per page. **(main)** Home: "Automatisering för företag – mindre manuellt arbete". `/tjanster`: "Tjänster och priser". Case titles lead with the workflow (`seoTitle` / `metaDescription` in `cases.ts`). |
| Social previews | **(main)** `og:*` / `twitter:*` inherit each page's own title and description. Case pages preview with their co-branded case photo. |
| Headings | **(main)** Home H1 reads once. Case pages have h2 sections (Utmaningen / Lösningen / Resultat) and h3 steps. `PageHeader` H1s are still brand statements on `/case` and `/om-oss`; `/tjanster` is "TJÄNSTER OCH PRISER." |
| Cases | 5 case pages with real first-party detail. `/tjanster` links to all five ("Det här har vi byggt"). Case pages still link only to the next case — no route to services. `lead-lista` is now `/case/foretagsresearch` (308 from the old URL). |
| Performance (Lighthouse mobile, lab) | **(main)** Page weight 8.3 MB → 1.5 MB. Case photos are ~80 KB JPGs; the text logo is 100 KB. The score is now bound by JavaScript: LCP render delay ~9.7 s and TBT 0.6–1.4 s (animations, particles, smooth scroll). `icon.svg` / `apple-icon.svg` are 381 KB each. No field data. |
| Content signals | "Borås" is absent from main content on every page except `/kontakt` (home meta description now names it). "Systemintegration" appears nowhere. |
| Off-site | Allabolag lists the sole trader under Hai's name, not "Khyte". No Hitta listing. E-handelsstaden member page links to `khyteteam.com`. No client sites link to khyte.se. |
| Rankings | No non-brand rankings observed (external check, approximate). Brand SERP still shows some old `khyteautomations.com` URLs; they redirect, so this resolves with time. |

---

## 2. Decisions

| Date | Decision |
|---|---|
| 2026-09-30 | The March "24 pieces in 90 days" plan is retired. Strengthen the existing small site first; new pages only when GSC data or sales reality earns them. |
| 2026-09-30 | **Business facts live in `src/data/facts.ts`** and are read from there: intro call **30 min** (what Calendly books), delivery **1–2 veckor för mindre automationer, 4–6 veckor för större system** (owner's call, 2026-09-30 — replaces "ofta 2–6 veckor"), price **från 15 000 kr, fast pris efter kartläggning**, public name for the first step **Kartläggning** — a **paid, required** step (owner confirmed 2026-09-30; *superseded 2026-10-05: kartläggning is free, see below*), Calendly URL, address/phone/email. Kept small — numbers and contact details, not whole paragraphs. |
| 2026-10-05 | **The home page keeps its general statistics** ("3-15h / vecka", "3–6 månader", "24/7", "3x", "0 integrerade system") — owner's call. **No case numbers or client names on the home page**: case proof lives on the case pages and the case section; a version of the home stat bands built from JaTack/Observa/Kom-Fort figures felt wrong to the owner and was reverted (`b88586c`). |
| ~~2026-09-30~~ | ~~No site-wide "hours saved" claim.~~ **Retired 2026-10-05:** this was an AI suggestion recorded as if it were an owner decision. It is not a rule — don't act on it. |
| 2026-09-30 | Team: only render members we can present properly (Hai, Abdi). Erik is added when his profile is ready; `src/lib/signature-profiles.ts` is the future team source. |
| 2026-09-30 | Home page owns **"automatisering för företag"** (workflows, systems, repetitive work). AI-specific intent goes to a dedicated service page later. |
| 2026-09-30 | Case titles lead with the workflow, client second: `SMS-system för kunduppföljning – Osteopaticentrum`. |
| 2026-09-30 | Slugs: rename only misleading ones. `lead-lista` → `foretagsresearch` (301). `lead-engine` stays. |
| 2026-09-30 | Link prefetching stays as is — the nav is protected. Fix image weight at the source instead; revisit prefetch only if it still matters afterwards. |
| 2026-09-30 | Client-system repositories go private. Public proof, if wanted, comes from sanitised demo repos. |
| 2026-09-30 | **Deprioritised:** FAQ schema as a growth tactic (Google deprecated FAQ rich results), self-serving review stars (ineligible), hreflang (single-language site), mass city/vertical pages, generic AI blog posts, strict title/description character limits, "one H1" as doctrine. |
| 2026-09-30 | BreadcrumbList: cheap and valid, but Google only shows breadcrumbs on desktop since Jan 2025. Low priority. |
| 2026-10-02 | **Service pages live under `/tjanster/<slug>`, driven by `src/data/services.ts`.** First page: **Egna system** (`/tjanster/egna-system`, owner's name), proven by Etcetera Offset, Kom-Fort and Osteopaticentrum. The service ↔ case relationship lives only in `services.ts` (`caseSlugs`); case pages link back with `servicesForCase(slug)`. Generic questions (price, ownership, timeline) stay on `/tjanster`; a service FAQ only answers what is specific to it. AI and workflow automation pages follow when evidence earns them; systemintegration waits for a delivered case. `/tjanster/custom-build` and `/services/custom-build` now 308 to Egna system. |
| 2026-10-02 | **`/tjanster` is a short hub, not a service description** (owner's call): what we solve → how we work → what it costs → proof → FAQ. Depth lives on the subpages. "Vad vi löser" tiles (`serviceAreas` in `services.ts`) double as the menu: each links to its service page when one exists, otherwise to a case. **Rådgivning is a separate service** (advice on what to automate, tools and AI, with no build required); it has a tile and an FAQ entry now and gets its own page once its content and price model are defined. |
| 2026-10-05 | **Kartläggning is free** (owner; supersedes "paid, required" from 2026-09-30). A priced pre-step adds friction and leaves the buyer unsure what they're committing to. It's used when needed to scope a build and ends in a written offer with scope, price and assumptions; straightforward projects may need only the intro call. The "från 15 000 kr" price is for the build. Free kartläggning scopes and quotes a potential project; paid AI-rådgivning is practical guidance the customer can use on their own. |
| 2026-10-05 | **Services redesign: three pages, split by buying situation** — Automatisering (one page, AI as a named section; a separate AI page is reconsidered when the offer and GSC data support it), Egna system, and AI-rådgivning (paid two-hour session, 2 990 kr base). Supersedes the 2026-10-02 plan for separate AI and workflow automation pages. Visuals never link to cases; proof is a descriptive text link. FAQ rich results are not a success criterion (see 2026-09-30); visible FAQs and their accurate markup stay. Order and details: `docs/current_state.md` → Open items — services work. |

---

## 3. Open items

**P0 — truth, security, measurement**
- [x] Export GSC baseline (2026-10-02, all data Apr–Sep 2026; findings under Evidence). Re-export 4–6 weeks after the P1 deploy to compare.
- [x] Submitted `https://khyte.se/sitemap.xml` in GSC (2026-10-02). It showed "Couldn't fetch" right after submitting although the live file returns 200 `application/xml`; recheck in a few days.
- [ ] Ask BNI Sjuhärad to update their link to `https://khyte.se`.
- [x] All GitHub repos private (owner's call, 2026-10-02 — 20 repos, incl. this site). Anonymous access returns 404. Vercel deploys through its GitHub app, so deploys are unaffected; confirm on the next push that `vercel[bot]` still creates the deployment. Old GitHub results drop out of Google as it recrawls.
- [x] `bni-references` member-name check — moot now that the repo is private.

**P1 — invisible pass (no visual/layout change)** — done 2026-09-30 (`d805f26`…`06cd8e4`), **live 2026-10-02** (deployed with `97567a2`)
- [x] `src/data/facts.ts`; pre-footer, Calendly drawer, `/kontakt` metadata, 404 and home FAQ read from it
- [x] Complete the LocalBusiness address (street, postcode, coordinates) and add an Organization logo
- [x] Home H1: render the rotating word once
- [x] Social titles/descriptions per page (inherit from each page's own metadata)
- [x] Home title/description for "automatisering för företag"
- [x] Case pages: workflow-first titles, real descriptions, case photo as OG image
- [x] Case pages: section labels become headings (identical styling)
- [x] Compress case photos and the logo (testimonial photos were already 3–12 KB)
- [x] Sitemap: stop stamping every URL with the build date
- [x] Rename `lead-lista` → `foretagsresearch` with a permanent redirect
- [ ] `/tjanster` still hardcodes 30 min, 15 000 kr and the delivery ranges — switch to `facts.ts` (services rework)
- [x] After deploy (2026-10-02): live crawl clean (13 URLs, one H1 each, per-page titles and previews, 308s for `lead-lista` and `custom-build`); LinkedIn Post Inspector shows the case title, photo and description; Lighthouse re-run (see Measured outcomes); GSC indexing requested for `/`, `/tjanster/egna-system`, `/case/foretagsresearch` and four case pages.
- [ ] Deploys: after the repos went private, Vercel (Hobby) blocks commits whose author email is not linked to the GitHub account. This repo's local override (`hai@khyteteam.com`) was removed 2026-10-02, so commits use the linked global email. `bni-references` and `hovaliden` still commit as `hai@khyteteam.com` and will be blocked on their next push — remove the override there too, or add `hai@khyteteam.com` to the GitHub account.

**Performance (next lever, not invisible)**
- [ ] LCP is held by render delay (~9.7 s lab), not bytes: the logo/hero wait on JavaScript. Look at what the hero waits for (page transition, animation libraries, particles) before hydration. Design-sensitive — plan first.
- [ ] `icon.svg` and `apple-icon.svg` are 381 KB each, and iOS does not support SVG touch icons. Replace with small PNGs (32/180 px).

**P2 — connect the flywheel** *(coordinate with the `/tjanster` rework)*
- [ ] Case → service: contextual link from each case to the relevant part of `/tjanster`. Anchors now exist (2026-10-02): `/tjanster#vad-vi-loser`, `#sa-jobbar-vi`, `#vad-det-kostar`, `#case`, `#vanliga-fragor`; service pages have `#nar-behovs`, `#vad-vi-bygger`, `#case`, `#pris`, `#vanliga-fragor`. Where a case proves a service, link to the service page itself via `servicesForCase(c.slug)` from `src/data/services.ts`.
- [x] Service → case (2026-10-02): `/tjanster` lists every case, `/tjanster/egna-system` lists its three — both through the shared `CaseList` component.
- [ ] Systems line on each case (e.g. `System: n8n · Allabolag · Excel`) near the existing "Case 03 av 5" (keep the numbering).
- [ ] Replace the five identical "Läs mer" anchors on `/case` with contextual labels where it fits.
- [ ] Descriptive H1 via a small eyebrow above the display heading in `PageHeader` (design sign-off; frontend-design skill first).

**P3 — entity and local**
- [ ] Audit and improve the existing Google Business Profile. Done 2026-10-02: categories (Programvaruföretag primary; Datorkonsult + Automationsföretag secondary), description, services list. Remaining: photos, posts. **Reviews are owned by Hai** (ask the case clients; the wording customers use counts).
- [x] (Fixed 2026-10-02) Footer label "Address" was English on a Swedish site; Google currently uses footer text as the home snippet ("Automatisering för svenska företag. Address. Västerbrogatan 8A…"). Change to "Adress" (footer is a protected component; a text-only change).
- [ ] Hitta and Allabolag under the Khyte name; same NAP everywhere.
- [ ] Ask E-handelsstaden to change their link to `khyte.se`.
- [ ] Ask clients (JaTack, Osteopaticentrum, Observa, Etcetera) for a link or mention.
- [ ] `/om-oss`: Borås office, founder background.
- [ ] `/boras`: a real local entity page — team, office, local cases, GBP/map. Not a city-swap page.

**P4 — expansion from evidence**
- [ ] Choose service child pages (`automatisering`, `systemintegration`, `ai-automation`, `n8n-konsult`) and first use-case/integration pages from GSC + sales conversations. Rule: client demand × search demand × Khyte capability.

**P5 — Bing and AI visibility**
- [ ] Bing Webmaster Tools (import from GSC), check the AI Performance report. IndexNow optional.

**Copy (Swedish pass, not SEO-critical but trust-critical)**
- [x] Home ROI/COI bands — closed 2026-10-05: the general statistics stay, no case numbers on the home page (see Decisions).
- [x] Home FAQ: "har ett API", "var ni tappar tid" (services rework, `e7f24f4`). Mixed du/ni on the home page remains.
- [ ] `/om-oss`: "Vart allt började" → "Där allt började"; "fick med han" → "fick med honom".
- [x] `/tjanster` Swedish fixes and "Kartläggning" (services rework, `e7f24f4`).

---

## 4. Evidence

| Date | Finding | Source |
|---|---|---|
| 2026-09-30 | FAQ rich results stopped 2026-05-07 (deprecation notice 2026-05-08); already limited to gov/health sites since Aug 2023. Markup is harmless, no benefit. | developers.google.com/search/updates |
| 2026-09-30 | Service schema is not a Google rich-result type; Breadcrumb, Local business, Organization, Review snippet are. | developers.google.com/search/docs/appearance/structured-data/search-gallery |
| 2026-09-30 | Breadcrumbs removed from mobile results 2025-01-23; desktop only. | developers.google.com/search/blog/2025/01/simplifying-breadcrumbs |
| 2026-09-30 | Self-serving reviews on LocalBusiness/Organization are ineligible for stars. | developers.google.com/search/docs/appearance/structured-data/review-snippet |
| 2026-09-30 | Google's AI-features guidance: no special files, markup or schema needed; recommends Google Business Profile for local visibility in AI answers. | developers.google.com/search/docs/fundamentals/ai-optimization-guide |
| 2026-09-30 | ChatGPT search uses third-party providers with Bing "an important one"; appearing depends on allowing `OAI-SearchBot` (GPTBot is training only). | help.openai.com/en/articles/10093903 · developers.openai.com/api/docs/bots |
| 2026-09-30 | Bing Webmaster Tools has an AI Performance report (citations in Copilot/Bing AI) since 2026-02-10. Not a ChatGPT view. | blogs.bing.com/webmaster/February-2026 |
| 2026-09-30 | Borås AI/automation SERPs are held by city-swap pages (Patrick Petcu: no Borås address; Fostira: Sundsvall; Zorc: Jönköping). No competitor combines a Borås address with named local cases. | External SERP check (US index, approximate) |
| 2026-09-30 | "n8n konsult" SERP is thin. n8n Expert Partners is a closed pilot (n8n as main revenue, 3+ active n8n customers); waitlist open. | n8n.io/expert-partners |
| 2026-09-30 | Fortnox SERPs are dominated by fortnox.se and established integrators; the consultant list (fortnox.se/kopplingar/konsulter) has ~15 firms. | External SERP check |
| 2026-09-30 | Lighthouse mobile (lab): home 46 / LCP 19.6 s / 8.3 MB; case page 61 / LCP 10.5 s. LCP element is the logo, delayed by render. | Local Lighthouse 12 run |
| 2026-10-02 | GSC: brand drives the clicks ("khyte automations" 32 of 54, avg pos 3.7). 60% of impressions sit in queries GSC hides as too rare. | GSC export |
| 2026-10-02 | GSC: local intent already shows up — "automationsföretag borås" pos 1.8 (23 impr), "automation konsult borås" pos 15.3, "ai konsult borås" pos 67 — plus many one-off misspelt "automation" queries at pos 4–13, typical of Maps/local-pack searches (Google Business Profile). | GSC export |
| 2026-10-02 | GSC: some queries read Khyte as *industrial* automation ("automationsföretag", "manufacturer", "hersteller", "produktion"). The name plus "automation" invites it; GBP category/description and page copy should say office/system automation. | GSC export |
| 2026-10-02 | GSC: case pages surface for client-name searches ("komfort bilvård" pos 11, "etcetera offset" pos 23.5) and brand sitelinks, not yet for workflow queries ("kunduppföljning" pos 60). | GSC export |
| 2026-10-02 | GSC: `http://khyte.se/` (170 impr) and `www.khyte.se/om-oss` (67 impr) still appeared in the last 28 days, but Google already picks `https://khyte.se/` as canonical (recrawled 2026-10-02). Consolidating; no action. | URL Inspection |
| 2026-10-02 | Backlink found: BNI Sjuhärad member page links to `http://khyte.se`. | URL Inspection, referring pages |
| 2026-09-30 | Link prefetch adds `<link rel="preload" as="image">` for linked pages' images (e.g. `/villkor` preloads home case photos; case pages preload all five `/case` photos). | Headless Chrome rendered DOM |

---

## 5. Next bets

Hypotheses, each with how we'll know.

| Bet | Why | Signal to watch |
|---|---|---|
| `/boras` as a real local entity page | Competitors have pages *about* Borås; Khyte is a company *in* Borås | GSC impressions for Borås queries; GBP views/actions |
| Cases as search assets | Real first-party workflows no generic agency can copy | Impressions for workflow/problem queries on case URLs |
| `n8n-konsult` service page | Thin SERP, high intent | Impressions/position within 8 weeks of launch |
| Integration pages from real work (e.g. Lime, Vitec/MSpecs, Visbook) | Only once there is a case to point to | Sales conversations mentioning the system + GSC queries |
| "Vanliga arbetsflöden vi automatiserar" workflow library | Practical, specific, linked to cases and services | Entrances from long-tail queries |

---

## 6. Measured outcomes

| Date | Change | Metric | Before | After |
|---|---|---|---|---|
| 2026-09-30 | Baseline | Lighthouse mobile, home | 46 · 8.3 MB | — |
| 2026-09-30 | Baseline | Lighthouse mobile, `/case/osteopaticentrum` | 61 · 8.2 MB | — |
| 2026-09-30 | P1 (local build, not yet live) | Page weight, home / case page | 8.3 / 8.2 MB | 1.5 / 1.5 MB |
| 2026-09-30 | P1 (local build, not yet live) | Lab LCP, home / case page | 19.6 / 10.5 s | 10.1 / 7.5 s |
| 2026-09-30 | P1 (local build, not yet live) | Perf score, home / case page | 46 / 61 | 39 / 62 — JS-bound, and the local run shared the machine with the server; re-measure on khyte.se after deploy |
| 2026-10-02 | P1 live on khyte.se (Lighthouse mobile, same method as baseline) | Home: score · weight · LCP · TBT | 46 · 8.3 MB · 19.6 s · 600 ms | **59 · 1.4 MB · 9.5 s · 300 ms** |
| 2026-10-02 | P1 live on khyte.se (Lighthouse mobile, same method as baseline) | `/case/osteopaticentrum`: score · weight · LCP · TBT | 61 · 8.2 MB · 10.5 s · 310 ms | **68 · 1.4 MB · 8.1 s · 180 ms** |
| 2026-10-02 | Baseline (before P1 deploy) | GSC, all data (Apr–Sep 2026) | 54 clicks · 558 impr · CTR 9.7% · pos 4.5 | — |
| 2026-10-02 | Baseline (before P1 deploy) | GSC, September 2026 | 41 clicks · 250 impr | — |
| 2026-10-02 | Baseline (before P1 deploy) | Case pages (impr, all data): lead-engine / etcetera / komfort / osteopati | 33 / 30 / 30 / 19, clicks 0 / 0 / 1 / 0 | — |

---
---

# Appendix A — March 2026 audit (archived keyword pool)

> **Not the active roadmap.** Written 2026-03-05, partly reconciled 2026-08-29, superseded 2026-09-30 by the
> sections above. Keyword volumes and difficulty are directional and unvalidated. Several technical items
> below are done or deprecated (FAQ rich results, hreflang, "zero competition in Borås", "no case pages",
> "GSC not verified"). Use it as an idea bank; check anything here against *Current state* before acting.

### Sanity Check — What I Believe Khyte Is

Khyte Automations is a 2-person Swedish consultancy (Borås) that builds custom AI + workflow automations for SMEs. You eliminate manual processes (CRM → invoice, lead routing, reporting, support triage) using n8n, OpenAI, Claude, and native integrations. You sell fixed-price projects (25–120k SEK), deliver in 2–6 weeks, and hand over full ownership. Your ICP is the Swedish SME (10–100 employees) with a process bottleneck and no internal IT team to solve it.

---

## A) Executive Summary

### Top 5 Opportunities (Impact → Effort)

| # | Opportunity | Impact | Effort | Why |
|---|---|---|---|---|
| 1 | **Claim "automatisering Borås" and local SEO** | High | Low | Zero competition. No specialist owns this. GBP + 1 landing page = local pack within weeks. |
| 2 | **Build a "n8n konsult Sverige" pillar page** | High | Low | Near-zero competition. Only NordicAIgency targets this weakly. High buyer intent. |
| 3 | ~~Add /services to sitemap~~ — now: add Service + BreadcrumbList schema | Medium | Trivial | Sitemap is fixed. Remaining gap is Service and BreadcrumbList markup. |
| 4 | **Create 6 tool-integration pages (Fortnox, HubSpot, etc.)** | High | Medium | Each page captures a long-tail cluster. Buyers search "[tool] integration" when ready to buy. |
| 5 | **Publish 3 rich case studies with metrics** | High | Medium | You have 1 testimonial. Each case with real numbers builds E-E-A-T and converts. SCB data ([source](https://www.scb.se/hitta-statistik/statistik-efter-amne/forskning-och-det-digitala-samhallet/ovrigt/artificiell-intelligens-i-sverige/pong/statistiknyhet/artificiell-intelligens-i-sverige-2025/)): 74.7% of SMEs cite "lack of expertise" — proof removes this objection. |

### Top 5 Risks / Issues

| # | Risk | Severity | Status |
|---|---|---|---|
| 1 | ~~No analytics installed~~ | ~~Critical~~ | **RESOLVED** — GA4 `G-F91HE9L5LS` + Vercel Analytics live. GSC verification still open. |
| 2 | ~~Sitemap missing routes~~ | ~~High~~ | **RESOLVED** — all 7 static routes + case detail pages in `sitemap.ts`. |
| 3 | **No Service schema** — invisible to rich results | Medium | LocalBusiness, Organization, WebSite, Person, FAQPage live. Service + BreadcrumbList still missing. |
| 4 | **Thin content on /cases** — 2 sparse cards, no real case pages | High | Hurts E-E-A-T, no indexable case content |
| 5 | ~~OG image is SVG~~ | ~~Medium~~ | **RESOLVED** — real 1200×630 PNG via `opengraph-image.tsx`. |

---

## B) Hidden Gems — Keyword Discovery (150 Keywords)

### Methodology
Keywords selected for: Swedish search behavior (primary), buyer intent stage, competition gap vs. established players, and Khyte's actual service capabilities. Difficulty estimates are relative to a new domain with thin backlink profile.

---

#### Cluster 1: Core Intent (AI Automation / Automation för Företag)

| Keyword | Intent Stage | Page Type | Difficulty | Conv. Potential | Suggested Title Tag (sv) | Suggested H1 |
|---|---|---|---|---|---|---|
| ai automation företag | Mid-funnel | Pillar | Med | High | AI-automation för företag – Automatisera med AI \| Khyte | AI-automation för svenska företag |
| automatisering för företag | Mid-funnel | Pillar | High | High | Automatisering för företag – Spara tid och minska fel \| Khyte | Automatisering anpassad för ditt företag |
| ai automatisering | Early-mid | Pillar | Med | Med | AI-automatisering – Så fungerar det i praktiken \| Khyte | AI-automatisering: vad det är och vad det ger |
| automatisera processer | Mid-funnel | Service | Med | High | Automatisera processer – Slipp manuellt arbete \| Khyte | Automatisera era processer på veckor, inte månader |
| ai implementering | Mid-funnel | Service | Med | High | AI-implementering för SME – Från idé till drift \| Khyte | AI-implementering: vi bygger, ni äger |
| ai konsult | Mid-funnel | Service | Med-High | High | AI-konsult – Expert på affärsautomation \| Khyte | AI-konsult som levererar fungerande automation |
| workflow automation | Mid-funnel | Pillar | Med | High | Workflow Automation – Automatisera arbetsflöden \| Khyte | Workflow automation för svenska företag |
| automatisera arbetsflöden | Mid-funnel | Service | Low-Med | High | Automatisera arbetsflöden – Frigör tid i vardagen \| Khyte | Automatisera era arbetsflöden |
| rpa för små företag | Mid-funnel | Blog/Comparison | Low | Med | RPA för små företag – Alternativ som faktiskt fungerar \| Khyte | RPA för små företag: behöver du det? |
| ai lösningar för företag | Early-mid | Pillar | Med | Med | AI-lösningar för företag – Praktiska exempel \| Khyte | AI-lösningar som löser riktiga problem |
| digital transformation SME | Early | Blog | Low | Low-Med | Digital transformation för SME – Börja med automation \| Khyte | Digital transformation börjar med ett automatiserat flöde |
| automatisering konsult | Mid-funnel | Service | Low-Med | High | Automatiseringskonsult – Vi bygger ert automatiserade flöde \| Khyte | Automatiseringskonsult som levererar på veckor |
| processautomatisering | Mid-funnel | Service | Med | High | Processautomatisering – Eliminera manuella steg \| Khyte | Processautomatisering utan IT-avdelning |
| ai byrå sverige | Mid-funnel | Local | Med | High | AI-byrå i Sverige – Automation som håller \| Khyte | AI-byrå med svensk leverans |
| intelligent automation | Early-mid | Blog | Low | Med | Intelligent Automation – Guide för svenska företag \| Khyte | Intelligent automation: mer än bara RPA |

#### Cluster 2: Tool-Intent (Integration Pages)

| Keyword | Intent Stage | Page Type | Difficulty | Conv. Potential | Suggested Title Tag (sv) | Suggested H1 |
|---|---|---|---|---|---|---|
| fortnox integration | Late-funnel | Tool page | Med-High | Very High | Fortnox-integration – Automatisera bokföring och fakturering \| Khyte | Fortnox-integration: automatisera fakturor, bokföring och rapporter |
| fortnox automatisering | Late-funnel | Tool page | Med | Very High | Fortnox-automatisering – Slipp manuell hantering \| Khyte | Automatisera Fortnox: fakturor, export och synk |
| fortnox api integration | Late-funnel | Tool page | Low-Med | High | Fortnox API-integration – Koppla era system \| Khyte | Fortnox API-integration utan egen IT |
| hubspot integration | Late-funnel | Tool page | Med | High | HubSpot-integration – Automatisera leads och CRM \| Khyte | HubSpot-integration som automatiserar hela säljflödet |
| hubspot automatisering | Late-funnel | Tool page | Low-Med | High | HubSpot-automatisering – Leads, CRM och uppföljning \| Khyte | Automatisera HubSpot: leads, deals och rapporter |
| lime crm integration | Late-funnel | Tool page | Low | High | Lime CRM-integration – Koppla CRM till era flöden \| Khyte | Lime CRM-integration med era övriga system |
| shopify automation | Late-funnel | Tool page | Med | High | Shopify-automation – Orderflöde, lager och fakturering \| Khyte | Automatisera Shopify: ordrar, lager och synk |
| woocommerce automatisering | Late-funnel | Tool page | Low-Med | High | WooCommerce-automatisering – Ordrar och kunddata \| Khyte | WooCommerce-automatisering för e-handel |
| google workspace automation | Mid-funnel | Tool page | Low | Med | Google Workspace-automation – Gmail, Sheets, Drive \| Khyte | Automatisera Google Workspace |
| microsoft 365 automation | Mid-funnel | Tool page | Low-Med | Med | Microsoft 365-automation – Outlook, Excel, Teams \| Khyte | Automatisera Microsoft 365 |
| zapier alternativ | Mid-funnel | Comparison | Low | High | Zapier-alternativ – Bättre automation för svenska företag \| Khyte | Zapier-alternativ: varför skräddarsytt slår SaaS |
| make.com alternativ | Mid-funnel | Comparison | Low | High | Make.com-alternativ – Skräddarsytt istället för drag-and-drop \| Khyte | Make.com-alternativ för växande företag |
| n8n konsult | Late-funnel | Tool page | Very Low | Very High | n8n-konsult – Expert på n8n-automation i Sverige \| Khyte | n8n-konsult: automation som ni äger |
| n8n implementation | Late-funnel | Tool page | Very Low | Very High | n8n Implementation – Custom Workflows for Swedish SMEs \| Khyte | n8n Implementation: Own Your Automation |
| n8n vs zapier | Early-mid | Comparison | Low | Med | n8n vs Zapier – Vilken passar ditt företag? \| Khyte | n8n vs Zapier: ärlig jämförelse |
| openai integration företag | Mid-funnel | Tool page | Low | High | OpenAI-integration för företag – AI i era processer \| Khyte | OpenAI-integration: AI i era befintliga arbetsflöden |
| claude ai integration | Mid-funnel | Tool page | Very Low | High | Claude AI-integration – Intelligent automation \| Khyte | Claude AI-integration i era processer |
| visma integration | Late-funnel | Tool page | Med | High | Visma-integration – Automatisera ekonomi och admin \| Khyte | Automatisera Visma med era övriga system |
| excel automatisering | Mid-funnel | Tool page | Med | Med | Excel-automatisering – Slipp kopiera data manuellt \| Khyte | Automatisera Excel: import, export och rapporter |
| google sheets automation | Mid-funnel | Tool page | Low-Med | Med | Google Sheets-automation – Automatisera data \| Khyte | Google Sheets-automation: slipp manuell datainmatning |

#### Cluster 3: Use-Case Intent

| Keyword | Intent Stage | Page Type | Difficulty | Conv. Potential | Suggested Title Tag (sv) | Suggested H1 |
|---|---|---|---|---|---|---|
| automatisera fakturering | Late-funnel | Use-case | Low-Med | Very High | Automatisera fakturering – Från CRM till Fortnox \| Khyte | Automatisera fakturering: aldrig en manuell faktura igen |
| automatisera kundtjänst | Mid-funnel | Use-case | Med | High | Automatisera kundtjänst – Sortering, svar och routing \| Khyte | Automatisera kundtjänst utan att tappa det personliga |
| automatisera offertprocessen | Late-funnel | Use-case | Low | Very High | Automatisera offertprocessen – Snabbare offerter, fler affärer \| Khyte | Automatisera offertprocessen från lead till avtal |
| automatisera orderhantering | Late-funnel | Use-case | Low-Med | Very High | Automatisera orderhantering – Ordrar, lager och leverans \| Khyte | Automatisera orderhantering: noll manuella steg |
| automatisera rapportering | Mid-funnel | Use-case | Low | High | Automatisera rapportering – Dagliga rapporter utan manuellt arbete \| Khyte | Automatisera rapportering: rätt data, varje morgon |
| automatisera leadgenerering | Mid-funnel | Use-case | Med | High | Automatisera leadgenerering – Leads som aldrig faller mellan stolarna \| Khyte | Automatisera leadgenerering: från data till kontakt |
| automatisera e-post | Mid-funnel | Use-case | Low-Med | Med | Automatisera e-post – Smarta flöden för mail \| Khyte | Automatisera e-post: uppföljning, bekräftelse och påminnelse |
| automatisera onboarding | Mid-funnel | Use-case | Low | High | Automatisera onboarding – Ny kund eller medarbetare \| Khyte | Automatisera onboarding: från första dag till full fart |
| crm automation | Mid-funnel | Use-case | Med | High | CRM-automation – Automatisera hela kundresan \| Khyte | CRM-automation: slipp manuell CRM-admin |
| ärendehantering automatisering | Late-funnel | Use-case | Low | High | Automatisera ärendehantering – Rätt ärende till rätt person \| Khyte | Automatisera ärendehantering: sortering, prioritering, routing |
| automatisera bokföring | Late-funnel | Use-case | Med | High | Automatisera bokföring – Koppla system till Fortnox \| Khyte | Automatisera bokföring: slipp dubbelinmatning |
| automatisera påminnelser | Mid-funnel | Use-case | Low | Med | Automatisera påminnelser – Aldrig missa en uppföljning \| Khyte | Automatisera påminnelser och uppföljningar |
| automatisera datainsamling | Mid-funnel | Use-case | Low | Med | Automatisera datainsamling – Data från web, mail och system \| Khyte | Automatisera datainsamling: rätt data utan manuellt arbete |
| automatisera säljprocessen | Mid-funnel | Use-case | Low-Med | Very High | Automatisera säljprocessen – Leads, offerter och uppföljning \| Khyte | Automatisera säljprocessen: från lead till stängd affär |
| lead scoring automation | Mid-funnel | Use-case | Low | High | Lead scoring-automation – Prioritera rätt leads automatiskt \| Khyte | Lead scoring-automation: fokusera på affärerna som stängs |
| automatisera dokumenthantering | Mid-funnel | Use-case | Low | Med | Automatisera dokumenthantering – Skapa, sortera och arkivera \| Khyte | Automatisera dokumenthantering |
| slack integration automation | Mid-funnel | Use-case | Low | Med | Slack-automation – Notiser och rapporter i realtid \| Khyte | Automatisera Slack: rapporter, larm och uppföljning |
| automatisk uppföljning kund | Late-funnel | Use-case | Low | Very High | Automatisk kunduppföljning – Aldrig missa en deal \| Khyte | Automatisk kunduppföljning: uppföljning som aldrig glöms |

#### Cluster 4: Industry/Vertical Intent

**Justification for verticals:** These are Swedish SME sectors with (a) high manual process load, (b) established digital tool usage, (c) volume in Borås/VG region, and (d) documented automation demand per SCB 2025 data.

| Keyword | Intent Stage | Page Type | Difficulty | Conv. Potential | Suggested Title Tag (sv) | Suggested H1 |
|---|---|---|---|---|---|---|
| automation e-handel | Mid-funnel | Vertical | Low-Med | High | Automation för e-handel – Ordrar, lager och kunddata \| Khyte | Automation för e-handlare: från order till leverans |
| automation redovisningsbyrå | Late-funnel | Vertical | Low | Very High | Automation för redovisningsbyråer – Fortnox, Visma, klientdata \| Khyte | Automation för redovisningsbyråer |
| automation fastighetsbyrå | Mid-funnel | Vertical | Very Low | High | Automation för fastighetsbranschen – Leads, visningar och avtal \| Khyte | Automation för fastighetsbyråer |
| automation rekryteringsbyrå | Mid-funnel | Vertical | Very Low | High | Automation för rekrytering – Kandidater, screening och CRM \| Khyte | Automation för rekryteringsbyråer |
| automation konsultbolag | Mid-funnel | Vertical | Low | High | Automation för konsultbolag – Tid, projekt och fakturering \| Khyte | Automation för konsultbolag |
| automation advokatbyrå | Mid-funnel | Vertical | Very Low | High | Automation för advokatbyråer – Ärenden, dokument och fakturering \| Khyte | Automation för advokatbyråer |
| automation grossist | Mid-funnel | Vertical | Very Low | High | Automation för grossister – Order, lager och leverans \| Khyte | Automation för grossister |
| automation marknadsbyrå | Mid-funnel | Vertical | Low | High | Automation för marknadsbyråer – Research, rapporter och leads \| Khyte | Automation för marknadsbyråer |
| automation tillverkning SME | Mid-funnel | Vertical | Low-Med | Med | Automation för tillverkande SME – Order, produktion och leverans \| Khyte | Automation för tillverkande företag |
| automation säljbolag | Mid-funnel | Vertical | Low | Very High | Automation för säljbolag – Leads, CRM och uppföljning \| Khyte | Automation för säljbolag |
| digitalisering småföretag | Early-mid | Blog | Med | Med | Digitalisering för småföretag – Börja med automation \| Khyte | Digitalisering för småföretag: var börjar man? |
| ai för småföretag | Early-mid | Blog | Low-Med | Med | AI för småföretag – Praktiska användningsområden \| Khyte | AI för småföretag: så kommer du igång |
| automation logistik | Mid-funnel | Vertical | Low-Med | Med | Automation för logistik – Ordrar, rutter och rapporter \| Khyte | Automation för logistikföretag |
| automation resebyrå | Mid-funnel | Vertical | Very Low | Med | Automation för resebyråer – Bokningar, bekräftelse och uppföljning \| Khyte | Automation för resebyråer |

#### Cluster 5: Local Intent (Borås + Region)

| Keyword | Intent Stage | Page Type | Difficulty | Conv. Potential | Suggested Title Tag (sv) | Suggested H1 |
|---|---|---|---|---|---|---|
| automatisering borås | Late-funnel | Local | Very Low | Very High | Automatisering i Borås – AI-automation för lokala företag \| Khyte | Automatisering i Borås |
| ai konsult borås | Late-funnel | Local | Very Low | Very High | AI-konsult i Borås – Automation anpassad för ert företag \| Khyte | AI-konsult i Borås |
| it konsult borås | Mid-funnel | Local | Low-Med | Med | IT-konsult i Borås – Automation och systemintegration \| Khyte | IT-konsult i Borås med fokus på automation |
| systemintegration borås | Late-funnel | Local | Very Low | High | Systemintegration i Borås – Koppla era affärssystem \| Khyte | Systemintegration i Borås |
| automation göteborg | Mid-funnel | Local | Low-Med | High | Automation i Göteborg – AI-automation för företag \| Khyte | Automation i Göteborg |
| ai konsult göteborg | Mid-funnel | Local | Med | High | AI-konsult i Göteborg – Processer som automatiseras \| Khyte | AI-konsult i Göteborg |
| automatisering västra götaland | Mid-funnel | Local | Very Low | High | Automatisering i Västra Götaland – Lokal leverans \| Khyte | Automatisering i Västra Götaland |
| it automation göteborg | Mid-funnel | Local | Low | High | IT-automation i Göteborg – Effektiva processer \| Khyte | IT-automation i Göteborg |
| digitalisering borås | Early-mid | Local | Very Low | Med | Digitalisering i Borås – Automatisera och effektivisera \| Khyte | Digitalisering i Borås: börja med era processer |
| processautomatisering göteborg | Late-funnel | Local | Low | High | Processautomatisering i Göteborg \| Khyte | Processautomatisering i Göteborg |
| automatisering sjuhärad | Mid-funnel | Local | Very Low | Med | Automatisering i Sjuhärad – Lokal AI-automation \| Khyte | Automatisering i Sjuhärad |
| fortnox konsult borås | Late-funnel | Local | Very Low | Very High | Fortnox-konsult i Borås – Integration och automatisering \| Khyte | Fortnox-konsult i Borås |
| ai företag göteborg | Mid-funnel | Local | Low-Med | High | AI-företag i Göteborg – Automation och integration \| Khyte | AI-företag i Göteborg |
| automatisering trollhättan | Mid-funnel | Local | Very Low | Med | Automatisering i Trollhättan \| Khyte | Automatisering i Trollhättan |
| automatisering skövde | Mid-funnel | Local | Very Low | Med | Automatisering i Skövde \| Khyte | Automatisering i Skövde |

---

## C) Competitor/SERP Reality Check

### Who Ranks and Why

| Competitor | Main Terms They Rank For | Why They Rank | Khyte Differentiation |
|---|---|---|---|
| **NordicAIgency** (nordicaigency.com) | "ai automation", "n8n automation" | Blog content on separate domain (blog.nordicaigency.se), n8n positioning | Khyte: fixed price, no vendor lock-in, Swedish delivery. Nordic is more generic "transformation" language. |
| **LOAO Solutions** (loao.se) | "ai chatbot företag", "ai automation" | Clean Swedish-language service pages, GDPR positioning | Khyte: we build custom workflows, not chatbot products. Deeper integration work. |
| **Smultron Studio** (smultronstudio.com) | "ai automation konsult göteborg" | Bilingual site, Göteborg location pages | Khyte: Borås base (no overlap), fixed pricing, production-grade builds. |
| **Patrick Petcu** (patrickpetcu.com) | "ai konsult göteborg", "ai konsult örebro" | Excellent local SEO — dedicated city landing pages for each location | Copy this strategy. Patrick proves a solo operator can dominate local SERPs with dedicated location pages. |
| **Flexra** (flexra.se) | "ai automation för företag" | Well-optimized service pages, Eskilstuna base | Khyte: VG region focus, different geography. No overlap. |
| **Automatiseramera** (automatiseramera.se) | "fortnox integration" | 60+ Fortnox integrations, 2019 heritage, Fortnox partner listing | Only compete here if you build Fortnox integrations. Otherwise, adjacent positioning. |
| **Aiautomatiseringsguiden.se** | Many informational "vad är ai automation" queries | Pure content SEO site — high-volume blog | Not a competitor for service queries. But blocks informational keywords. Build content that targets buyer intent, not just information. |
| **Digihelp** (digihelp.se) | "rpa", "automation" | 20-year consultancy, UiPath partner | Enterprise-focused. Khyte targets SME. Different buyer. |

### How to Differentiate

1. **Don't compete for "automatisering för företag"** (broad, enterprise-dominated) — instead own **long-tail tool + use-case + local** combinations
2. **Patrick Petcu is the model** — a single person ranking well with dedicated location pages. Khyte can do this better with 2 people and real case studies
3. **Content gap**: no competitor publishes detailed, Swedish-language use-case pages ("automatisera fakturering", "automatisera offertprocessen"). These are uncontested
4. **Local gap**: Borås has zero automation specialists. Göteborg has 3–4 competing for the same terms. Borås is free land

---

## D) Site + Content Architecture Plan

### Proposed SEO Sitemap

```
/ (Home)
├── /tjanster                          ← Services hub (existing /services — consider Swedish URL)
│   ├── /tjanster/workflow-automation   ← Pillar: workflow automation
│   ├── /tjanster/ai-automation        ← Pillar: AI-driven automation
│   ├── /tjanster/systemintegration    ← Pillar: system integration
│   └── /tjanster/n8n-konsult          ← Tool: n8n consultancy
│
├── /integrationer                     ← Integration hub
│   ├── /integrationer/fortnox         ← Tool page
│   ├── /integrationer/hubspot         ← Tool page
│   ├── /integrationer/visma           ← Tool page
│   ├── /integrationer/shopify         ← Tool page
│   ├── /integrationer/google-workspace ← Tool page
│   └── /integrationer/microsoft-365   ← Tool page
│
├── /anvandningsfall                   ← Use-case hub
│   ├── /anvandningsfall/fakturering   ← Use-case: invoicing automation
│   ├── /anvandningsfall/kundtjanst    ← Use-case: customer support
│   ├── /anvandningsfall/leadgenerering ← Use-case: lead gen
│   ├── /anvandningsfall/orderhantering ← Use-case: order handling
│   ├── /anvandningsfall/rapportering  ← Use-case: reporting
│   └── /anvandningsfall/offertprocess ← Use-case: quote process
│
├── /bransch                           ← Vertical hub
│   ├── /bransch/e-handel              ← E-commerce
│   ├── /bransch/redovisning           ← Accounting firms
│   ├── /bransch/konsultbolag          ← Consulting firms
│   └── /bransch/saljbolag            ← Sales companies
│
├── /case                              ← Case studies hub (existing /cases — consider Swedish URL)
│   ├── /case/lead-engine-jatack       ← Individual case page
│   ├── /case/seo-research-automation  ← Individual case page
│   └── /case/[future-cases]
│
├── /boras                             ← Local: Borås
├── /goteborg                          ← Local: Göteborg
├── /vastra-gotaland                   ← Local: Region
│
├── /blogg                             ← Blog hub
│   ├── /blogg/n8n-vs-zapier
│   ├── /blogg/ai-for-smaforetag
│   ├── /blogg/[etc]
│
├── /om-oss                            ← About (existing /about)
├── /kontakt                           ← Contact (existing /contact)
├── /integritetspolicy                 ← Privacy (existing)
└── /villkor                           ← Terms (existing)
```

**Note on URL language:** Your current routes are mixed (`/services`, `/cases`, `/about`, `/contact`). For Swedish SEO, Swedish URLs perform better. Consider migrating to `/tjanster`, `/case`, `/om-oss`, `/kontakt` with 301 redirects from the English versions. This is a medium-effort, high-impact change.

### Internal Linking Strategy

#### Rules (apply consistently)

1. **Every service page** links to → at least 2 relevant use-case pages + 1 integration page + the closest local page
2. **Every integration page** links to → the parent service page + 2 relevant use-case pages + "Boka genomgång" CTA
3. **Every use-case page** links to → the parent service page + 1–2 relevant integration pages + at least 1 case study
4. **Every case study** links to → the service used + the integration involved + "Boka genomgång" CTA
5. **Every local page** links to → 3 service pages + 2 case studies + contact
6. **Every blog post** links to → 1 service page (minimum) + 1 use-case or integration page
7. **Homepage** links to → each pillar page (services, integrations, use-cases) + Borås local page + 1–2 featured cases
8. **Anchor text rule**: use the target keyword naturally. Don't say "klicka här" — say "Läs mer om vår Fortnox-integration"

#### Link hierarchy visual
```
Homepage
  ↓ ↓ ↓
Service pillars ← → Integration pages
  ↓ ↓                    ↓
Use-case pages ← ——— → Case studies
  ↓                       ↓
Local pages        → Contact/CTA
```

### Page Template Requirements

Every conversion-focused page (service, integration, use-case, vertical, local) must include:

| Section | Purpose | Required elements |
|---|---|---|
| **Hero** | Immediate clarity | H1 (keyword-rich), 1–2 sentence value prop, CTA |
| **Problem** | Empathy + qualification | 2–3 pain points the buyer recognizes |
| **Solution** | What we actually do | Concrete description, no buzzwords |
| **Process** | Reduce uncertainty | 3–4 steps: how it works from first call to delivery |
| **Proof** | Trust | Case study snippet, testimonial, or metric (even 1 stat) |
| **ROI/Results** | Quantified value | Time saved, error reduction, or cost stat |
| **FAQ** | Objection handling | 3–5 questions specific to this page's topic |
| **CTA** | Close | "Boka genomgång" or "Berätta om era processer" |

### 90-Day Content Plan (Prioritized)

#### Month 1: Foundation (Weeks 1–4)

| Week | Content Piece | Type | Target Keyword | Priority Rationale |
|---|---|---|---|---|
| 1 | Fix sitemap, add schema, install GA4/GSC | Technical | — | Must-have before anything else |
| 1 | /boras landing page | Local | automatisering borås, ai konsult borås | Zero competition, immediate local pack chance |
| 2 | /tjanster/n8n-konsult | Tool page | n8n konsult sverige | Near-zero competition, high buyer intent |
| 2 | /case/lead-engine-jatack (expanded) | Case study | — | E-E-A-T proof, conversion asset |
| 3 | /integrationer/fortnox | Tool page | fortnox integration automatisering | High buyer intent, validates capability |
| 3 | /anvandningsfall/fakturering | Use-case | automatisera fakturering | Matches your CRM→invoice case on homepage |
| 4 | /goteborg landing page | Local | ai konsult göteborg, automation göteborg | Second-priority local market |
| 4 | /blogg/n8n-vs-zapier | Comparison blog | n8n vs zapier | Low competition, attracts tool-aware buyers |

#### Month 2: Expansion (Weeks 5–8)

| Week | Content Piece | Type | Target Keyword |
|---|---|---|---|
| 5 | /tjanster/ai-automation pillar | Pillar | ai automation företag |
| 5 | /anvandningsfall/kundtjanst | Use-case | automatisera kundtjänst |
| 6 | /integrationer/hubspot | Tool page | hubspot integration |
| 6 | /blogg/ai-for-smaforetag | Blog | ai för småföretag |
| 7 | /bransch/redovisning | Vertical | automation redovisningsbyrå |
| 7 | /anvandningsfall/offertprocess | Use-case | automatisera offertprocessen |
| 8 | /integrationer/google-workspace | Tool page | google workspace automation |
| 8 | New case study (real client) | Case study | — |

#### Month 3: Authority (Weeks 9–12)

| Week | Content Piece | Type | Target Keyword |
|---|---|---|---|
| 9 | /tjanster/workflow-automation pillar | Pillar | workflow automation, automatisera arbetsflöden |
| 9 | /bransch/e-handel | Vertical | automation e-handel |
| 10 | /integrationer/microsoft-365 | Tool page | microsoft 365 automation |
| 10 | /blogg/zapier-alternativ | Comparison | zapier alternativ |
| 11 | /anvandningsfall/leadgenerering | Use-case | automatisera leadgenerering |
| 11 | /vastra-gotaland landing page | Local | automatisering västra götaland |
| 12 | /bransch/saljbolag | Vertical | automation säljbolag |
| 12 | /blogg/processautomatisering-guide | Blog | processautomatisering |

**Total: 24 pieces in 90 days** (2/week pace)

---

## E) On-Page Best Practices (Swedish B2B)

### Title Tag Formulas

```
[Primary keyword] – [Benefit/Action phrase] | Khyte
```

Examples:
- `Automatisera fakturering – Från CRM till Fortnox | Khyte`
- `AI-konsult i Borås – Automation anpassad för ert företag | Khyte`
- `n8n-konsult – Expert på n8n-automation i Sverige | Khyte`

**Rules:**
- Max 60 characters (including brand)
- Primary keyword first
- Swedish characters (å, ä, ö) are fine and expected
- Don't stuff — one core keyword per title

### Meta Description Formulas

```
[What we do for this keyword]. [Proof/differentiator]. [CTA prompt].
```

Examples:
- `Vi automatiserar fakturering mellan CRM och Fortnox. Fast pris, leverans på veckor. Boka en kostnadsfri genomgång.`
- `AI-konsult i Borås som bygger automation ni äger. Inga löpande licenser. Resultat på 2–6 veckor.`

**Rules:**
- Max 155 characters
- Include 1 keyword naturally
- End with soft CTA ("Boka genomgång", "Läs mer", "Se hur det fungerar")
- Avoid "vi är bäst" language — state facts

### H1/H2 Patterns

**H1 (one per page):**
- Include primary keyword
- Write for humans first — don't keyword stuff
- Example: `Automatisera fakturering: aldrig en manuell faktura igen`

**H2 structure for service/use-case pages:**
```
H1: [Primary keyword phrase]
  H2: Problemet (or "Varför [topic] kostar er tid")
  H2: Hur vi löser det
  H2: Så fungerar processen
  H2: Resultat
  H2: Vanliga frågor
```

### E-E-A-T Proof Elements

| Element | What to Add | Where |
|---|---|---|
| **Case blocks** | Real client name, problem, solution, metric. Even 1 number beats zero. | Every service/use-case page |
| **"Så jobbar vi"** | 3–4 step process with clear deliverables at each step | Services hub + each pillar page |
| **Founder credibility** | Hai's background, experience, LinkedIn link. Not a bio — a trust signal. | About page, JSON-LD Person schema, case studies (byline) |
| **Process transparency** | "Vi börjar alltid med en förstudie (fast pris)" — show the buyer what happens before they commit | Every CTA area |
| **Tech stack disclosure** | "Vi bygger med n8n, OpenAI, Claude, Fortnox API" — specific tools, not vague "AI" | Service pages, integration pages |
| **Pricing transparency** | You already have this (25–120k SEK). Keep it visible. It filters and converts. | Services page, repeated in FAQ on relevant pages |
| **Real testimonial** | Sebastian/JaTack is gold. Get 2–3 more. | Homepage, case page, service pages |

### Conversion Design

#### CTA Placement Rules
1. **Above the fold**: every page gets a CTA within the first viewport
2. **After proof section**: immediately after a case study or testimonial
3. **End of page**: before footer CTA (you already have PreFooterCTA — good)
4. **Sticky mobile CTA**: consider a fixed bottom bar on mobile for service pages

#### Trust Blocks (place near CTAs)
- "Kostnadsfri genomgång — 30 min"
- "Fast pris efter scope — inga dolda avgifter"
- "Ni äger all kod och dokumentation"
- "Svensk leverans, svensk support"

#### Objection-Handling FAQ (template)
Every conversion page should have 3–5 of these:
1. "Vad kostar det?" → Range + "fast pris efter förstudie"
2. "Hur lång tid tar det?" → "2–6 veckor från förstudie till drift"
3. "Vem äger lösningen?" → "Ni — all kod, alla inloggningar, all dokumentation"
4. "Behöver vi en IT-avdelning?" → "Nej, vi hanterar allt"
5. "Vad händer om det inte fungerar?" → "Vi testar i staging innan produktion, och inkluderar monitoring"

---

## F) Technical SEO Audit (Prioritized)

### Critical (Fix This Week)

| Issue | Current State | Fix |
|---|---|---|
| **Sitemap incomplete** | Only 4 routes: `/`, `/about`, `/cases`, `/contact` | Add `/services`, `/integritetspolicy`, `/villkor` to sitemap.ts routes array |
| **No GA4/GSC** | Zero analytics | Install GA4 via GTM or Next.js script. Verify GSC ownership via DNS TXT record. |
| **OG image is SVG** | `/opengraph-image.svg` — LinkedIn/Twitter/Slack won't render it | Convert to PNG/JPG (1200×630px). Use Next.js `opengraph-image.tsx` for dynamic generation, or static PNG. |
| **JSON-LD missing LocalBusiness** | Only Organization, WebSite, Person | Add LocalBusiness schema with address, geo, areaServed, telephone |
| **JSON-LD missing Service schema** | No Service type | Add Service schema on /services with offers, areaServed |
| **JSON-LD missing FAQPage schema** | FAQ content exists on homepage + services but no schema | Add FAQPage schema to homepage and /services — drives rich results |

### High Priority (Fix This Month)

| Issue | Current State | Fix |
|---|---|---|
| **No BreadcrumbList schema** | Breadcrumbs not in structured data | Add BreadcrumbList JSON-LD to all pages with depth > 1 |
| **Title tag suboptimal on homepage** | "AI-automation för företag – Frigör tid från manuellt arbete" | Consider: "AI-automation för företag i Sverige – Automatisera processer \| Khyte" (include geo signal) |
| **No `<link rel="alternate">` hreflang** | Site is Swedish-only currently | Add `hreflang="sv-SE"` + `x-default` on all pages for future-proofing |
| **Calendly scripts loaded globally** | CSS + JS on every page, even those without Calendly buttons | Lazy-load Calendly only on pages/interactions that need it (reduces LCP on non-CTA pages) |
| **Missing alt text audit** | SVG illustrations, logo, profile images — unknown alt text state | Audit all `<img>` and SVG elements for descriptive alt text |
| **No Review/AggregateRating schema** | 1 testimonial exists but no schema | Add Review schema when you have 3+ reviews |

### Medium Priority (Fix This Quarter)

| Issue | Current State | Fix |
|---|---|---|
| **URL structure is English** | `/services`, `/cases`, `/about`, `/contact` | Migrate to Swedish URLs (`/tjanster`, `/case`, `/om-oss`, `/kontakt`) with 301 redirects |
| **No blog/content hub** | Zero blog pages | Build `/blogg` route with first 4 posts per content plan |
| **Image optimization** | WebP for hero bg — but profile PNGs, logo SVGs | Audit all images: convert to WebP where possible, add width/height, use Next/Image for PNGs |
| **Core Web Vitals** | Unknown — no field data (no traffic yet) | Run Lighthouse, fix LCP (likely Calendly script), ensure CLS < 0.1 |
| **Robots.txt** | Currently allows everything | Fine for now. Add `Disallow: /api/` if you add API routes. |
| **Canonical URLs** | Set per page — good | Verify all canonicals resolve correctly after any URL structure changes |
| **404 page** | Default Next.js 404 | Create custom 404 with navigation, search, and internal links (captures lost traffic + passes link equity) |

### Schema Markup Implementation Plan

```typescript
// Add to layout.tsx or individual pages:

// 1. LocalBusiness (homepage + /boras page)
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://khyte.se/#local",
  "name": "Khyte Automations",
  "image": "https://khyte.se/opengraph-image.png",
  "url": "https://khyte.se",
  "telephone": "+46700996838",
  "email": "hai@khyte.se",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Borås",
    "addressRegion": "Västra Götaland",
    "addressCountry": "SE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 57.7210,
    "longitude": 12.9401
  },
  "areaServed": [
    { "@type": "City", "name": "Borås" },
    { "@type": "City", "name": "Göteborg" },
    { "@type": "AdministrativeArea", "name": "Västra Götaland" },
    { "@type": "Country", "name": "Sverige" }
  ],
  "priceRange": "Från 15 000 SEK",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "09:00",
    "closes": "17:00"
  }
}

// 2. Service (on /services)
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "AI-automation och processautomatisering",
  "description": "Skräddarsydd automation för svenska SME-företag...",
  "provider": { "@id": "https://khyte.se/#organization" },
  "areaServed": { "@type": "Country", "name": "Sverige" },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "SEK",
    "price": "15000",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "minPrice": "15000",
      "priceCurrency": "SEK"
    }
  }
}

// 3. FAQPage (on homepage FAQ + /services FAQ)
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Vad kostar det?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En skräddarsydd automation kostar från 15 000 kr..."
      }
    }
    // ... more questions
  ]
}

// 4. BreadcrumbList (on all subpages)
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Hem", "item": "https://khyte.se" },
    { "@type": "ListItem", "position": 2, "name": "Tjänster", "item": "https://khyte.se/services" }
  ]
}
```

---

## G) Local SEO — Borås Dominance

### Google Business Profile Playbook

#### Setup (Do This Week)

| Action | Details |
|---|---|
| **Create GBP** | business.google.com — register Khyte Automations |
| **Primary category** | "IT-konsultföretag" (IT consulting company) |
| **Secondary categories** | Programvaruföretag, Företagskonsult |
| **Address** | Your Borås office/registered address |
| **Service area** | Borås, Göteborg, Sjuhärad, Västra Götaland |
| **Phone** | 070-099 68 38 (consistent across all platforms) |
| **Website** | https://khyte.se |
| **Business hours** | Mon–Fri 09:00–17:00 |
| **Description** | "Khyte Automations bygger skräddarsydda AI-automationer för svenska företag. Vi eliminerar manuellt arbete, minskar fel och levererar fungerande automation — fast pris, ni äger allt." (max 750 chars) |

#### Services to List in GBP
- AI-automation
- Processautomatisering
- Systemintegration
- n8n-konsulting
- Workflow automation
- Fortnox-integration (if applicable)
- CRM-automation
- Automatiserad rapportering

#### Ongoing GBP Activity (Weekly)

| Activity | Frequency | What |
|---|---|---|
| **Posts** | 1–2/week | Share tips, case snippets, process insights. ~150–300 words. Include image + CTA. |
| **Photos** | 2–4/month | Office, team at work, whiteboard sessions, tool screenshots (redacted). Real > stock. |
| **Q&A** | Seed 5 questions at launch | Pre-answer: "Vad kostar det?", "Vilka system integrerar ni med?", "Hur lång tid tar det?", "Var är ni baserade?", "Kan ni hjälpa företag utanför Borås?" |
| **Reviews** | Ask every client | Send review request 1 week after delivery. Target: 1 review/month minimum. |

#### Review Request Script (Swedish)

> Hej [Namn],
>
> Tack för att vi fick hjälpa er med [projekt]. Vi uppskattar verkligen samarbetet.
>
> Om du har 2 minuter — en kort recension på Google hjälper andra företag att hitta oss. Inga krav, men det betyder mycket.
>
> [Google Review Link]
>
> Tack!
> Hai, Khyte Automations

### Local Landing Pages Plan

#### /boras (Primary Local Page)

**Unique content requirements:**
- H1: "Automatisering i Borås"
- Local proof: mention Borås by name 3–5 times naturally
- Reference local context: "Vi är baserade i Borås och jobbar med företag i Sjuhärad och hela Västra Götaland"
- Include local case study or example (even anonymized): "Ett Borås-baserat [bransch]-företag sparade..."
- Embed Google Map
- LocalBusiness schema with Borås coordinates
- Link to: /tjanster, /case, /kontakt, /goteborg

#### /goteborg (Service Area Page)

**Unique content rules:**
- H1: "Automation i Göteborg"
- Different angle than /boras — focus on the Göteborg SME market
- Reference proximity: "Baserade i Borås — vi jobbar aktivt med företag i Göteborgsregionen"
- Different case study or example than /boras
- Mention Göteborg-specific business context (port city, tech hub, startup scene)
- Do NOT duplicate /boras content — Google penalizes duplicate local pages

#### /vastra-gotaland (Regional Page)

- Broader scope — references multiple cities
- Links down to /boras and /goteborg
- Positions Khyte as the regional automation partner

#### Additional City Pages (Later — Month 3+)

Build only if you have business in these areas:
- /trollhattan
- /skovde
- /alingsas
- /uddevalla

**Duplication rule:** each city page must have unique opening paragraph, unique local reference, and ideally a unique case or example. Never use find-and-replace on city names.

### "Local Proof" Strategy

| Tactic | Action | Timeline |
|---|---|---|
| **Science Park Borås** | Apply for partnership/tenant listing. Attend events. Get listed on their site. | Month 1 |
| **Business Region Borås** | Register in their business directory. Meet their advisors. | Month 1 |
| **Drivhuset Borås** | Attend/host a workshop. Get mentioned in their events list. | Month 2 |
| **Borås Stad business pages** | Get listed in their business support resources | Month 2 |
| **Högskolan i Borås** | Guest lecture opportunity (RPA/automation course exists). Academic .se backlink. | Month 2–3 |
| **Local networking** | BNI Borås, Företagarna Sjuhärad, local breakfast seminars | Ongoing |
| **Västsvenska Handelskammaren** | Join West Sweden Chamber of Commerce. Member listing + events. | Month 2 |
| **ALMI Västra Götaland** | Explore their digitalization programs. Get listed as a resource/partner. | Month 3 |

---

## H) Backlink + Partnership Authority Plan

### 20 Swedish Backlink Opportunities

#### Tier 1: High Authority (DA 60+)

| # | Source | Type | Action | Difficulty |
|---|---|---|---|---|
| 1 | **Fortnox Partner Program** (fortnox.se/kopplingar/konsulter) | Partner listing | Apply as a Fortnox integration consultant. High-authority .se backlink + referral traffic. | Med |
| 2 | **AI Sweden** (ai.se) | Association | Apply for associate/community membership. Listed on partner page. | Med |
| 3 | **Breakit** (breakit.se) | PR/editorial | Pitch a founder story or contrarian take ("Varför svenska SME inte behöver RPA"). | High |
| 4 | **Vinnova** (vinnova.se) | Government | Apply for a digitalization/AI pilot grant. Project listing includes company links. | High |
| 5 | **Högskolan i Borås** (hb.se) | Academic | Guest lecture or collaboration with their RPA/automation program. .se edu link. | Med |

#### Tier 2: Industry & Association (DA 30–60)

| # | Source | Type | Action | Difficulty |
|---|---|---|---|---|
| 6 | **Almega** (almega.se) | Association | Join as member. Company listed in member directory. | Low |
| 7 | **Teknikföretagen** (teknikforetagen.se) | Association | Member directory listing. | Low |
| 8 | **Västsvenska Handelskammaren** | Chamber | Join. Member listing with link. | Low |
| 9 | **Science Park Borås** (scienceparkboras.se) | Innovation hub | Partnership or tenant listing. Local authority. | Low-Med |
| 10 | **Business Region Borås** (businessregionboras.se) | Government | Register in directory. Attend events for PR mentions. | Low |

#### Tier 3: Directories & Listings (Quick Wins)

| # | Source | Type | Action | Difficulty |
|---|---|---|---|---|
| 11 | **Hitta.se** | Business directory | Create/claim listing. Essential for local SEO. | Trivial |
| 12 | **Allabolag.se** | Company register | Verify auto-populated data from Bolagsverket. | Trivial |
| 13 | **Sortlist** (sortlist.com) | Agency directory | Register as AI automation agency. Ranks for "AI company Sweden". | Low |
| 14 | **Konsultlistan.se** | Consultant directory | Register as automation consultant. | Low |
| 15 | **Techhubben.se** | Tech directory | Submit company profile. | Low |
| 16 | **Cinode/Konsultkollen** | Consultant marketplace | Create company profile. | Low |
| 17 | **Kompass.com/se** | B2B directory | Verified listing. | Low |

#### Tier 4: Content & Partnership Links

| # | Source | Type | Action | Difficulty |
|---|---|---|---|---|
| 18 | **Drivhuset Borås** (boras.drivhuset.se) | Community | Host/speak at event. Mentioned in event listing with link. | Low-Med |
| 19 | **ALMI Västra Götaland** | Business support | Participate in digitalization program. Get listed as case/resource. | Med |
| 20 | **n8n Community** (community.n8n.io) | Tech community | Contribute workflows, answer questions, link back to "n8n konsult" page. | Low |

### Partnership Content Plays

#### 1. Co-Marketed Workshops

**Format:** "Automatisera [process] med [partner tool]" — 45-min webinar or in-person workshop
**Target partners:** Fortnox, regional accounting firms, CRM vendors (Lime CRM, HubSpot Swedish resellers)
**Output:** Recording → blog post → both parties link to each other

#### 2. Joint Case Studies

When you deliver a project using a partner's tool (Fortnox, HubSpot, etc.), propose a co-branded case study:
- Published on both sites
- Partner shares on their channels
- Cross-links between sites

#### 3. Integration Pages with Partners

Create /integrationer/[partner] pages and ask the partner to link to them from their "partners" or "integrations" page. This is standard practice in the SaaS ecosystem and generates high-quality backlinks.

### Ethical Outreach Scripts (Swedish)

#### Partnership Outreach

> Ämne: Samarbete kring [Tool]-automatisering?
>
> Hej [Namn],
>
> Jag heter Hai och driver Khyte Automations i Borås. Vi bygger skräddarsydda automationer för svenska SME-företag — och [Tool] är ett system vi integrerar regelbundet.
>
> Jag tror det finns ett naturligt samarbete här: vi kan hjälpa era kunder att automatisera fler processer, och ni kan rekommendera oss till kunder som behöver mer än vad [Tool] kan lösa på egen hand.
>
> Vore det intressant att ta ett kort samtal (15 min) och se om det finns en match?
>
> Bästa hälsningar,
> Hai Bui
> Khyte Automations
> hai@khyte.se | 070-099 68 38

#### Guest Post / Knowledge Sharing

> Ämne: Gästinlägg om AI-automation för SME?
>
> Hej [Namn],
>
> Vi på Khyte Automations jobbar dagligen med att automatisera processer åt svenska företag. Jag ser att ni skriver om [ämne] och tänkte kolla om ni tar emot gästinlägg.
>
> Jag kan bidra med en praktisk artikel om t.ex.:
> - Hur ett litet företag automatiserade sin fakturering och sparade 15h/vecka
> - n8n vs Zapier: vad passar svenska SME bäst?
> - 5 processer som varje SME borde automatisera (med exempel)
>
> Inga säljpitchar — bara praktisk kunskap. Ni får exklusivt innehåll, vi får en byline.
>
> Vad tror du?
>
> Hai Bui, Khyte Automations

#### Academic Collaboration

> Ämne: Gästföreläsning om processautomatisering?
>
> Hej [Namn],
>
> Jag driver Khyte Automations i Borås och arbetar dagligen med AI-automation och processautomatisering för svenska företag. Jag såg att ni har kurser inom RPA och tjänsteautomation.
>
> Vi har praktisk erfarenhet av att implementera automationer med n8n, AI-API:er och diverse affärssystem — och jag tror det skulle kunna vara värdefullt för era studenter att se hur det ser ut "i verkligheten".
>
> Kan vi ta ett kort samtal om möjligheten till en gästföreläsning?
>
> Bästa hälsningar,
> Hai Bui
> Khyte Automations

---

## I) Measurement Plan

### What to Track

#### Google Search Console (Primary)

| Metric | What It Tells You | Check |
|---|---|---|
| **Total impressions** | How often you appear in search results | Weekly |
| **Total clicks** | How often people click through to your site | Weekly |
| **Average CTR** | % of impressions that click. Target: >3% for branded, >2% for non-branded | Weekly |
| **Average position** | Where you rank on average. Improvements here lead future traffic. | Weekly |
| **Index coverage** | How many pages Google has indexed. Should = your total pages. | Weekly |
| **Crawl errors** | 404s, server errors, redirect issues | Weekly |
| **Top queries** | Which keywords drive impressions — watch for new keywords appearing | Weekly |
| **Top pages** | Which pages get the most search traffic | Weekly |

#### Google Analytics 4

| Metric | What It Tells You | Check |
|---|---|---|
| **Sessions by source** | Where traffic comes from (organic, direct, referral) | Weekly |
| **Engaged sessions** | Sessions > 10s or with a conversion | Weekly |
| **Page-level engagement** | Which pages hold attention, which bounce | Weekly |
| **Calendly clicks (event)** | How many people click "Boka genomgång" — your primary conversion | Daily |
| **Contact form submissions** | Secondary conversion (via Formspree) | Daily |
| **New vs returning users** | Growing new audience vs. returning interest | Monthly |

#### Conversion Events to Set Up in GA4

| Event Name | Trigger | Value |
|---|---|---|
| `calendly_click` | Calendly popup opens | Primary conversion |
| `contact_form_submit` | Formspree form submission | Secondary conversion |
| `phone_click` | Click on phone number link | Micro conversion |
| `email_click` | Click on email link | Micro conversion |
| `case_study_view` | Scroll to case study section or click case page | Engagement signal |

### Leading Indicators

These metrics predict future growth before traffic arrives:

| Indicator | What It Means | Target |
|---|---|---|
| **Impressions growth** | Google is showing you more — ranking is improving | +20%/month |
| **New keywords appearing** | Your content covers more territory | +10 new keywords/month |
| **Index coverage increase** | Google is indexing your new pages | 100% of published pages indexed within 2 weeks |
| **Average position improvement** | Moving from page 3 → page 1 | Avg. position < 20 for target keywords by month 3 |
| **CTR improvement** | Your titles/descriptions are compelling | CTR > 3% for priority pages |

### Weekly SEO Scoreboard

Track this every Monday in a simple spreadsheet:

| Metric | This Week | Last Week | Δ | Notes |
|---|---|---|---|---|
| GSC: Total impressions | | | | |
| GSC: Total clicks | | | | |
| GSC: Average CTR | | | | |
| GSC: Average position | | | | |
| GSC: Pages indexed | | | | |
| GA4: Organic sessions | | | | |
| GA4: Calendly clicks | | | | |
| GA4: Contact form subs | | | | |
| New content published | | | | |
| GBP: Views | | | | |
| GBP: Clicks to website | | | | |
| GBP: Reviews (total) | | | | |

**Rule of thumb:** If impressions grow but clicks don't, improve titles/descriptions. If clicks grow but conversions don't, improve page content and CTAs. If nothing grows, you need more content and backlinks.

---

## Quick-Win Checklist (Do This Week)

- [x] Add all routes + case detail pages to sitemap.ts
- [x] Install GA4 (via next/script or GTM)
- [ ] Verify domain in Google Search Console
- [ ] Create Google Business Profile
- [x] Convert OG image from SVG to PNG (1200×630)
- [x] Add LocalBusiness JSON-LD schema to layout.tsx
- [x] Add FAQPage JSON-LD schema to homepage and /tjanster
- [ ] Seed 5 Q&A on GBP
- [ ] Register on Hitta.se and verify Allabolag.se listing
- [ ] Start drafting /boras landing page

---

*This audit was compiled based on analysis of the live codebase, SERP research for Swedish keywords, competitor analysis of 12+ Swedish automation companies, and SCB 2025 AI adoption data. All difficulty estimates are relative to a new domain (DR 0–10). Keyword volumes are directional — install GSC and validate with real impression data within 30 days.*
