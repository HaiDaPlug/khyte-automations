# Services copy — draft for review (2026-10-07, rev. 5)

Copy for the three service pages and the matching `/tjanster` overview text. **Agree this before any
animation is built.** Design (layout, image, motion) is handled separately; the "Bild" line under each
example only says what the visual has to show.

> **2026-10-09 (owner):** build prices are not shown anywhere on the site, so every "15 000 kr" line below is
> superseded; price bands lead with "Kostnadsfritt" instead. `/tjanster` is "VÅRA / TJÄNSTER." Automatisering's
> examples are told one at a time on scroll (see section 2); its price band and "Så jobbar vi med er" go.

## Status: what's decided and what's proposed

**Owner-confirmed:**
- Free kartläggning.
- AI-rådgivning as its own page, and its offer (section 4): one person, 90 minutes, 2 990 kr exkl. moms,
  remote or in person, preparation from questions sent in advance, a written summary and tailored document
  within two working days, invoice afterwards, the full fee credited toward a later automation or system
  build with no expiry. One participant at launch.
- The AI-rådgivning offer should feel generous for its price.
- An overview with large visuals, HELkom as reference. Visuals don't link to cases.
- Build terms (2026-10-07), see "Build terms" below: ongoing support at a fixed monthly price based on
  scope, no binding period; Khyte hosts and pays for hosting, covered by the maintenance fee; customers
  have access to their data and the logins tied to their solution; builds from 15 000 kr exkl. moms.

**Still proposed (Claude and GPT), until the owner adopts them:**
- One Automatisering page with AI inside it, and which examples go on which page.
- Section order, the exact public wording below (including the build-terms wording), and Automatisering
  as the first page to build.

A docs-only commit of this draft is for review. It doesn't approve the copy or any site change.

## Conventions

- Public copy is plain text. Anything marked **[INTERNT]** is a note for us and must never ship.
- Automatisering and Egna system speak to the company ("ni"). AI-rådgivning speaks to one person ("du").
- No em dashes in public copy. Facts (price, delivery, intro length) come from `src/data/facts.ts` when built.
- Build cases prove the build services only. Nothing suggests those customers bought AI-rådgivning.

## Build terms (owner-confirmed 2026-10-07)

- Ongoing support at a fixed monthly price, based on the project's scope.
- Support arrangements vary by project, with no binding period.
- Khyte handles and pays for hosting; the cost is covered by the client's maintenance fee.
- Customers have access to their data and the logins tied to their solution, even if they let Khyte
  manage everything.
- Builds start at **15 000 kr exkl. moms**. Use "exkl. moms" wherever the starting price appears.

**Public wording (proposed, used throughout this draft):**

*Drift och support:* Efter leverans kan vi sköta hosting, underhåll och löpande support till ett fast
månadspris utifrån lösningens omfattning, utan bindningstid. Offerten visar vad som ingår och vad det
kostar.

*Ägande och överlämning:* Ni äger koden vi levererar och har tillgång till er data och de inloggningar som
hör till lösningen. Ni kan låta oss sköta driften eller ta över själva, med eller utan en annan
leverantör. Upplägget för överlämningen specificerar vi i offerten.

*Pris:* Byggen från 15 000 kr exkl. moms. Kartläggningen är kostnadsfri och ni får en offert med tydlig
omfattning och fast pris innan ni bestämmer er.

**[INTERNT] Set per quote, never as a site-wide promise:** how much support and bug fixing the build
price itself includes (no standard duration), and costs for external services such as SMS and AI. The
hosting answer doesn't settle whether those are inside the monthly fee, so the page only says the quote
states them.

## Open questions (don't block the draft)

**[INTERNT] AI-rådgivning.**
- **Booking.** A simple request followed by a personal confirmation of a 90-minute time. Never route it to
  the 30-min intro event.
- **Delivery.** Same-day delivery of the document is an internal ambition; the public promise is within
  two working days.
- **Extra participants.** +1 500 kr per extra participant is a future option, not published.

---

## 1. `/tjanster` — overview

**Title** (unchanged): Tjänster och priser – automation, AI och egna system

**Meta description:** Automatisering, egna system och AI-rådgivning för svenska företag. Kostnadsfri
kartläggning och fast pris för bygget från 15 000 kr exkl. moms. Ni äger koden vi bygger.

**H1** (unchanged): TJÄNSTER / OCH PRISER.

**Intro:** Vi automatiserar det som görs för hand varje vecka, bygger egna system när färdiga verktyg inte
räcker och hjälper er att använda AI i jobbet. Ni får ett fast pris innan något byggs, och ni äger koden
vi levererar.

### Vi erbjuder (service cards, anchor `#vad-vi-loser` kept)

**Automatisering**
Det ni gör för hand varje vecka, gjort automatiskt. Listor som fylls i, dokument som skapas och uppgifter
som flyttas mellan system.
*Proof line:* Byggt för [Etcetera Offset], [JaTack] och [Observa].  *(each name a real link to its case)*
*Link:* Läs om automatisering

**Egna system**
Ett verktyg byggt för hur ni jobbar, när färdiga program inte räcker. Till exempel för bokningar,
personal eller kunduppföljning.
*Proof line:* Byggt för [Kom-Fort Bilvård] och [Osteopaticentrum].  *(each name a real link to its case)*
*Link:* Läs om egna system

**AI-rådgivning**
En förberedd genomgång av dina frågor om AI. Vi går på djupet under 90 minuter, och du får ett personligt
underlag med förklaringar, verktygsråd och nästa steg.
*Price line:* 2 990 kr exkl. moms · 90 minuter
*Link:* Läs om AI-rådgivning
*No proof line: there are no rådgivning customers to name yet.*

### Vad det kostar (band)

Intro: Gäller automatisering och egna system. AI-rådgivningen har ett eget, fast pris.

| Big text | Body |
|---|---|
| Kostnadsfritt | Introsamtal och kartläggning är kostnadsfria. Ni får en offert med omfattning, tidsplan och fast pris innan ni bestämmer er. |
| från 15 000 kr exkl. moms | För bygget. Priset beror på hur många system, steg och undantag lösningen ska hantera. |
| 1–2 veckor | För mindre automationer, från kartläggning till drift. Större system tar 4–6 veckor. Ni får en tidsplan i offerten. |
| Er kod | Ni äger koden vi levererar och har tillgång till er data och de inloggningar som hör till lösningen. |

Below the band: Efter leverans kan vi sköta hosting, underhåll och löpande support till ett fast
månadspris utifrån lösningens omfattning, utan bindningstid. Offerten visar vad som ingår och vad det
kostar.
**[INTERNT]** Replaces today's "Ingår alltid…" line, which promises a standard "supportperiod". Four
items where the band has three today; layout is a design call.

### FAQ changes

**Replace** "Kan vi köpa bara rådgivning?" with:

**Vad är skillnaden mellan kartläggningen och AI-rådgivningen?**
Kartläggningen är kostnadsfri och handlar om ett bygge: vad vi skulle bygga åt er och vad det kostar.
AI-rådgivningen är en betald session där du får förklaringar, verktygsråd och nästa steg utifrån dina
frågor, oavsett om ni bygger något med oss.

**New answer** to "Vilka system kan ni jobba med?":
Vi undersöker hur era verktyg kan lämna och ta emot uppgifter, till exempel genom en systemkoppling eller
en fil. Det kan handla om CRM, bokföring, mejl eller ett eget system. Vad som är möjligt i ert fall går vi
igenom i den kostnadsfria kartläggningen.

**New answer** to "Vad ingår efter leverans?":
Dokumentation och en genomgång med ert team. Efter leverans kan vi sköta hosting, underhåll och löpande
support till ett fast månadspris utifrån lösningens omfattning, utan bindningstid. Offerten visar vad som
ingår och vad det kostar, även för externa tjänster som SMS eller AI.

The other three ("Kostar kartläggningen något?", "Hur lång tid tar det?", "Vad påverkar priset?") stay.

### People (next to the FAQ)

**Heading:** PRATA MED / HAI OCH ABDI.
**Line:** Berätta vad ni vill få att fungera bättre.
Real photo; phone and email from `facts.ts`.

---

## 2. `/tjanster/automatisering` — built on `feat/automatisering` (2026-10-09 layout)

**Buyer's situation:** "We keep processing, moving or preparing the same information."

**Sections (owner, 2026-10-09):** hero → examples told one at a time on scroll → "Så går det till" (three
steps) → FAQ.
No price band and no "Ni får / Vi behöver" lists.

**Title:** Automatisering av arbetsflöden och dokument
**Meta description:** Vi automatiserar listor, dokument och företagsresearch. Se exempel med Excel och AI.
Kostnadsfri kartläggning och fast pris innan vi bygger.

**H1:** AUTOMATISERING / AV MANUELLT ARBETE.

**Intro:** Samma lista, samma dokument, samma kopierande. Vi bygger flöden som gör återkommande arbete åt
er, med AI när information behöver läsas eller tolkas.

**CTAs:** Boka ett intro (30 min) · Se exempel

### Vad vi automatiserar (scroll story)

Desktop: a sticky panel. Left, the examples on a connecting rail that fills as you scroll; the active one
opens with its summary and case link. Right, one window where the active workflow builds itself, with a
progress line, "Scrolla ↓" and a 01 / 04 counter. Mobile: the same rail down the page, each example open
with its animation under the text. Each example: optional tag, title, summary, case link.

Section intro: Fyra vanliga lägen. Tre av dem kommer från uppdrag vi har levererat.

**Kundfiler som ska bli färdiga dokument**
Kundens Excel-fil laddas upp, och färdiga plock- och följesedlar kommer ut i Etceteras eget format. Inget
förs över för hand.
*Link:* Så gjorde vi för Etcetera Offset → `/case/etcetera-offset`

**Prospektlistor som byggs för hand**
En länk till en sökning i Allabolag blir en färdig ringlista i Excel. Två minuter per lead blev fem
sekunder.
*Link:* Så gjorde vi för JaTack → `/case/lead-engine`

**AI-research från en lista med företagsnamn** *(tag: AI i flödet)*
Ett AI-flöde tar fram hemsida, ort, kundtyp och ekonomiansvarig för varje företag i listan. Fyra minuter
per företag blev omkring tio sekunder.
*Link:* Så gjorde vi för Observa → `/case/foretagsresearch`

**Samma uppgifter i flera system** *(tag, dashed: Exempel på ett möjligt flöde)*
När en bokning kommer in kan uppgifterna föras över till CRM och bokföring, så att ingen skriver in dem
igen. Vad som går att koppla ihop undersöker vi i kartläggningen.
*No case link: no delivered integration case yet.*

### Så går det till

1. **Introsamtal** · Kostnadsfritt · 30 min — Vi hör hur ni jobbar och om vi kan hjälpa till.
2. **Kartläggning** · Kostnadsfri — Vi går igenom flödet och ger er en offert med omfattning, tidsplan och
   fast pris.
3. **Bygge** · Fast pris — Vi bygger i steg och ni godkänner varje del. Mindre lösningar är ofta i drift
   inom 1–2 veckor.

### Vanliga frågor

**Vad startar ett flöde?**
Något som redan händer hos er: en fil som laddas upp, ett formulär som skickas, en bokning eller ett mejl
som kommer in, eller en viss tid på dagen.

**Vad händer när något inte stämmer?**
I kartläggningen går vi igenom vilka undantag lösningen behöver hantera och kommer överens om vad som ska
hända. Det kan vara att stoppa ett steg, försöka igen eller be någon kontrollera underlaget.

**Måste vi byta verktyg?**
Inte nödvändigtvis. Vi undersöker om systemen kan kopplas ihop och vad som krävs. Ibland räcker en
koppling mellan verktygen. I andra fall är det bättre att ändra ett steg eller bygga något nytt.

**När använder ni AI, och när räcker vanliga regler?**
Regler passar när ett steg har tydliga villkor och görs likadant varje gång. AI kan hjälpa till att läsa,
tolka och sammanställa information som varierar, till exempel i företagsresearch. Vi väljer utifrån
uppgiften och vilka krav ni har på resultatet.

**Kan vi börja med ett enda flöde?**
Ja. Vi kan börja med ett avgränsat flöde och ta nästa steg när ni har sett hur det fungerar.

---

## 3. `/tjanster/egna-system` — built on `feat/egna-system` (2026-10-09 layout)

**Buyer's situation:** "We need a tool to run our work."

**Sections:** the same template as Automatisering: hero → examples told one at a time on scroll → "Så går
det till" → FAQ. Examples are complete tools people work in, as illustrations of what's possible (owner's
example model, 2026-10-09); no case links on them. "Så går det till" and the FAQ use the editorial grid
(heading left, content right), shared with Automatisering.

**Title** (unchanged): Egna system – skräddarsydda verksamhetssystem för företag
**Meta description:** Skräddarsydda system för bokningar, personal eller kunduppföljning när färdiga
verktyg inte räcker. Kostnadsfri kartläggning, fast pris och ni äger koden.

**H1** (unchanged): EGNA / SYSTEM.

**Intro:** Vi bygger ett verktyg för jobbet ni behöver göra, när färdiga program inte räcker. Det kan
samla bokningar och personal, eller hjälpa er att följa upp kunder.

### Vad vi bygger (scroll story)

Section intro: Exempel på vad ett eget system kan hjälpa er med. Varje system byggs för er, av delar vi
redan vet fungerar.

**Bokningar och personal på ett ställe**
Hos Kom-Fort Bilvård registreras uppdrag, kund, bil och ansvarig medarbetare på ett ställe. Personalen ser
sina pass, och kunden får sin bekräftelse automatiskt.
*Bild:* a week calendar; a new job lands, a staff member takes it, the confirmation goes out.

**Kunder som bokar igen**
Osteopaticentrum importerar sin kundlista, väljer vilka som ska få ett SMS och ser vilka utskick som leder
till nya bokningar.
*Bild:* an imported customer list, a selection, one SMS, a booking that comes back.

**Status på varje uppdrag** *(tag, dashed: Exempel på ett möjligt system)*
Alla ser var ett uppdrag står, från förfrågan till klart, utan att behöva fråga någon.
*Bild:* a shared board; jobs move from förfrågan to pågår to klart.

### Vanliga frågor

The five questions stay. New answer to "Kan systemet kopplas till det vi redan använder?": Det undersöker
vi i kartläggningen, utifrån hur era system kan lämna och ta emot uppgifter. En koppling kan vara
automatiserad eller bygga på att ni exporterar och importerar en fil. Osteopaticentrum importerar till
exempel sin kundlista som CSV i sitt SMS-system.

---

## 4. `/tjanster/ai-radgivning` — new page

**Buyer's situation:** "I want to understand AI better, choose the right tools or work out how to use it
in my job, and want someone to prepare around my questions."

**Sections:** hero → package → how it works → who it's for → FAQ.

**Title:** AI-rådgivning för företag – 90 minuter med dina frågor
**Meta description:** Personlig AI-rådgivning för dig i företaget. 90 minuter kring dina frågor, med
förberedelse och ett anpassat underlag inom två arbetsdagar. 2 990 kr exkl. moms.

**H1:** AI-RÅDGIVNING / FÖR DITT ARBETE.

**Subheading:** Förstå AI bättre och få en tydlig väg framåt.

**Intro:** Vill du förstå AI bättre, välja rätt verktyg eller reda ut hur du kan använda tekniken i ditt
arbete? Vi förbereder oss utifrån dina frågor och går på djupet tillsammans under 90 minuter. Efteråt får
du ett genomarbetat underlag med förklaringar, verktygsråd och tydliga nästa steg.

**Price line:** 2 990 kr exkl. moms · 90 minuter · på distans eller på plats
**CTA:** Skicka bokningsförfrågan
**Under the CTA:** Vi hör av oss för att bekräfta en tid och upplägget för sessionen. Du betalar mot
faktura efter sessionen.

### Package (one card: price, what's included, credit)

**Heading:** Dina frågor. En tydlig plan framåt.
**Price:** 2 990 kr exkl. moms
**Line:** Förberedelse, 90 minuters personlig AI-rådgivning och ett genomarbetat underlag efteråt.

| Det här ingår | Det ger dig |
|---|---|
| Förberedelse utifrån dina frågor | En genomgång som kan fokusera direkt på det du vill förstå eller lösa. |
| 90 minuter personlig rådgivning | Svar och förklaringar på en nivå som passar dig. |
| Skriftlig sammanfattning och fördjupade förklaringar | Ett underlag att gå tillbaka till när du behöver det. |
| Verktygsråd och prioriterade nästa steg | En tydlig bild av vad du kan börja med och varför. |

**Credit:** Hela rådgivningsavgiften räknas av om du senare anlitar oss för en automation eller ett eget
system. Ingen tidsgräns.
**Delivery and payment:** Faktura efter sessionen. Ditt underlag levereras inom två arbetsdagar.
**Scope (small, secondary):** Utveckling av ett färdigt system eller en automation offereras separat.

**[INTERNT]** The last two rows describe parts of one tailored follow-up, not separate products. No made-up
"värde"-prices next to the rows. The package and the three steps below overlap on purpose (summary vs.
detail); if the design merges them, keep the step text.

### Så går det till

**1. Förberett utifrån dina frågor**
Innan vi ses svarar du på några frågor om ditt arbete, vad du redan har provat och vad du vill förstå
eller kunna göra. Vi använder svaren för att förbereda en genomgång som är relevant för dig.

**2. 90 minuter på djupet**
Vi reder ut begrepp, diskuterar möjligheterna i ditt arbete och går igenom relevanta verktyg och
arbetssätt. Nivån och innehållet anpassas efter dina frågor. När det passar kan vi också visa exempel och
prova ett verktyg tillsammans.

**3. Ett genomarbetat underlag efteråt**
Inom två arbetsdagar får du en skriftlig sammanfattning och ett dokument anpassat till det vi gått
igenom. Där samlar vi svaren på dina frågor, fördjupade förklaringar av begrepp, verktygsråd och
prioriterade nästa steg.

### För dig som…

- …tycker att det händer för mycket inom AI för att hinna med.
- …vill komma igång men inte vet var du ska börja.
- …redan använder ChatGPT, Copilot eller liknande men inte får svar du kan använda.
- …vill välja rätt verktyg för ditt arbete.
- …vill förstå vad en AI-agent är och om en sådan skulle göra nytta för dig.

### Vanliga frågor

**Behöver jag kunna något om AI innan?**
Nej. Vi utgår från var du är i dag, oavsett om du aldrig har använt AI eller använder det varje dag.

**Vad kan jag ta upp?**
Det kan handla om att förstå AI-agenter, välja verktyg för ditt arbete eller få bättre resultat av AI som
du redan använder. Beskriv dina frågor i förväg, så förbereder vi sessionen utifrån dem.

**Vad får jag efteråt?**
En skriftlig sammanfattning och ett dokument anpassat till våra samtal, med förklaringar, verktygsråd och
tydliga nästa steg. Du får underlaget inom två arbetsdagar efter sessionen.

**Kan rådgivningen räknas av mot ett senare projekt?**
Ja. Rådgivningsavgiften dras av från priset om du senare anlitar oss för en automation eller ett eget
system. Tillgodohavandet gäller utan tidsgräns.

**Ingår ett färdigt system eller automatiserat flöde?**
Sessionen ger dig förståelse, råd och nästa steg utifrån dina frågor. Vi kan diskutera hur ett flöde
skulle kunna fungera. Ett färdigt system eller en automation i drift ingår inte. Vill ni ha något byggt
tar vi fram en separat offert efter en kostnadsfri kartläggning.

**Kan fler från företaget vara med?**
Sessionen är upplagd för en person, så att vi kan utgå helt från ditt arbete. Hör av dig om ni är fler.

**Hur betalar jag?**
Mot faktura efter sessionen.

### Preparation form (five questions)

1. Vad jobbar du med?
2. Vilka frågor, utmaningar eller uppgifter vill du att vi fokuserar på?
3. Vilka verktyg använder du i ditt arbete i dag?
4. Vad har du redan testat med AI?
5. Vad vill du förstå eller kunna göra efter sessionen?

---

## 5. Implementation notes (for the build, not copy)

**Service ↔ case mapping** (proposed; `caseSlugs` in `src/data/services.ts`, so `servicesForCase()`
resolves case pages to the right service). Case URLs don't change:

| Service | Company | Case URL |
|---|---|---|
| Automatisering | Etcetera Offset | `/case/etcetera-offset` |
| Automatisering | JaTack AB | `/case/lead-engine` |
| Automatisering | Observa Inkasso & Juridik | `/case/foretagsresearch` |
| Egna system | Kom-Fort Bilvård | `/case/komfort-bilvard` |
| Egna system | Osteopaticentrum | `/case/osteopaticentrum` |
| AI-rådgivning | none | none |

**Links and HTML**
- Case and proof links are descriptive text links with real `href`s. No animation is a link.
- Every scene's full text is in the server-rendered HTML; animation only illustrates it.
- When Automatisering ships, link it from the current overview right away (set `serviceSlug` on the
  matching "Vad vi löser" tiles), not only after the overview redesign.

**URLs, anchors, sitemap**
- `/tjanster` and `/tjanster/egna-system` keep their URLs; each service page keeps its own canonical.
- New pages enter the sitemap through `services.ts` automatically.
- `/tjanster/egna-system` loses `#nar-behovs` and `#vad-vi-bygger`. Nothing in the code links to them;
  update the list in `docs/SEO_AUDIT.md` → P2.
- When the overview drops its case list, the hero's "Se vad vi har byggt" (`#case`) must point somewhere
  that still exists.
- The `services.ts` comment says service FAQs never repeat the overview. The new Egna system ownership
  answer does repeat it, on purpose: update the comment with the change.

**Price:** "15 000 kr exkl. moms" wherever the build starting price appears (`facts.priceFrom`, its
callers, metadata). The `Service` schema's `priceSpecification` can carry `valueAddedTaxIncluded: false`;
`minPrice` parses digits only, so it keeps working.

**AI-rådgivning booking:** a request form, then a personal confirmation of a 90-minute time. Not the
30-min intro event; no payment system.

**Checks per page:** `npm run build` and `npm run start`; changed routes and an unknown slug (404); text
links; no horizontal scroll at 375px; keyboard operation; reduced motion. Nav, footer and pre-footer
untouched.
