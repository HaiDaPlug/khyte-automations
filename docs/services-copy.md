# Services copy — draft for review (2026-10-05, rev. 2)

Copy for the three service pages and the matching `/tjanster` overview text. **Agree this before any
animation is built.** Design (layout, image, motion) is handled separately; the "Bild" line under each
example only says what the visual has to show.

Conventions in this draft:
- Public copy is plain text. Anything marked **[INTERNT]** is a note for us and must never ship.
- Automatisering and Egna system speak to the company ("ni"). AI-rådgivning speaks to one person ("du").
- No em dashes in public copy. Facts (price, delivery, intro length) come from `src/data/facts.ts` when built.
- Measured numbers appear only next to the case they were measured in.
- Build cases prove the build services only. Nothing suggests those customers bought AI-rådgivning.

**Rev. 2 (after GPT's first pass on the summary):**
- Fewer sections. The "Passar när" situations are now the example headings, so each example carries the
  situation, what we built and the result together. "Så fungerar ett flöde" is gone; what starts a flow and
  what happens with exceptions moved to the FAQ.
- Egna system's building blocks are now a "Byggt av" line under each example, not a section of their own.
- AI-rådgivning is carried by what you get: preparation, two focused hours, a written summary and a
  tailored document. The "Det här ingår inte" section became a FAQ answer.
- The Automatisering title is chosen for being descriptive, not for avoiding the homepage's phrase.
- Exception handling and the "same people throughout" line are rewritten so they don't promise more than
  we know, and stay flagged until the owner confirms.

**[INTERNT] Open before publishing anything about AI-rådgivning (doesn't block the build pages):**
1. **Moms.** Is 2 990 kr exkl. or inkl. moms? GPT's proposal: 2 990 kr exkl. moms (invoice 3 737,50 kr).
   Every price line below carries this flag.
2. **Credit.** The owner wants the session fee credited toward something afterwards. Destination and terms
   are not decided, so the public copy says nothing about it.
3. **Extra participants.** +1 500 kr per extra participant is a future option. The launch offer is one
   person, and the add-on price isn't published.
4. **Booking.** The CTA needs a two-hour booking with the preparation form. Today's Calendly event is the
   30-min intro. To build before launch.
5. **Document timing.** How many days after the session the summary and document arrive. Promise a
   timeframe only once it's decided.

---

## 1. `/tjanster` — overview

**Title** (unchanged): Tjänster och priser – automation, AI och egna system

**Meta description:** Automatisering, egna system och AI-rådgivning för svenska företag. Kostnadsfri
kartläggning och fast pris för bygget från 15 000 kr. Ni äger allt vi bygger.

**H1** (unchanged): TJÄNSTER / OCH PRISER.

**Intro:** Vi automatiserar det som görs för hand varje vecka, bygger egna system när färdiga verktyg inte
räcker och hjälper er att använda AI i jobbet. Ni får ett fast pris innan något byggs, och ni äger det vi
bygger.

### Vi erbjuder (service cards, anchor `#vad-vi-loser` kept)

**Automatisering**
Det ni gör för hand varje vecka, gjort automatiskt. Listor som fylls i, dokument som skapas och uppgifter
som flyttas mellan system.
*Proof line:* Byggt för Etcetera Offset, JaTack och Observa.
*Link:* Läs om automatisering

**Egna system**
Ett verktyg byggt för hur ni jobbar, när inget färdigt program passar. Bokningar, personal och kunder på
ett ställe.
*Proof line:* Byggt för Kom-Fort Bilvård och Osteopaticentrum.
*Link:* Läs om egna system

**AI-rådgivning**
Två timmar med oss, förberedda utifrån det du vill få hjälp med. För dig som vill börja använda AI i
jobbet, eller bli bättre på det.
*Price line:* 2 990 kr · 2 timmar  **[INTERNT: moms]**
*Link:* Läs om AI-rådgivning
*No proof line: there are no rådgivning customers to name yet.*

### Vad det kostar (band)

Intro: Gäller automatisering och egna system. AI-rådgivningen har ett eget, fast pris.

| Big text | Body |
|---|---|
| Kostnadsfritt | Introsamtal och kartläggning. Ni får en offert med omfattning, tidsplan och fast pris innan ni bestämmer er. |
| från 15 000 kr | För bygget. Priset beror på hur många system, steg och undantag lösningen ska hantera. |
| 1–2 veckor | För mindre automationer, från kartläggning till drift. Större system tar 4–6 veckor. |
| Er kod | Ni äger koden, all data och alla inloggningar. |

**[INTERNT]** Four items where the band has three today. Layout is a design call.

### FAQ changes (the other five stay as they are)

Replace "Kan vi köpa bara rådgivning?" with:

**Vad är skillnaden mellan kartläggningen och AI-rådgivningen?**
Kartläggningen är kostnadsfri och handlar om ett bygge: vad vi skulle bygga åt er och vad det kostar.
AI-rådgivningen är en betald session där du får praktisk hjälp att använda AI själv, oavsett om ni
bygger något med oss.

### People (next to the FAQ)

**Heading:** NI PRATAR MED / OSS SOM BYGGER.
**Line:** Hai och Abdi. Ni pratar direkt med oss, inte med en säljare.
Phone and email from `facts.ts`.

**[INTERNT]** Confirm this matches how you and Abdi split the work, including whether Abdi builds.

---

## 2. `/tjanster/automatisering` — new page

**Buyer's situation:** "We keep processing, moving or preparing the same information."

**Sections:** hero → examples (with the named AI section) → what you get / what we need → price → FAQ.

**Title:** Automatisering av manuellt arbete – flöden, dokument och AI
**Meta description:** Vi automatiserar arbete som görs för hand varje vecka: listor, dokument och
uppgifter som flyttas mellan system, med AI där ett steg kräver omdöme. Fast pris från 15 000 kr.

**H1:** AUTOMATISERING / AV RUTINJOBB.
*(alternative: AUTOMATISERING / AV MANUELLT ARBETE. Check it fits at 375px.)*

**Intro:** Om någon hos er gör samma sak för hand varje vecka går det oftast att automatisera. Vi bygger
flöden som hämtar, sorterar och för över informationen åt er, och använder AI i de steg som kräver omdöme.

**CTAs:** Boka ett intro (30 min) · Se exempel

### Vad vi automatiserar (examples)

Section intro: Fyra vanliga lägen. Tre av dem kommer från uppdrag vi har levererat.

**1. Filer som ska bli dokument**
*Etcetera Offset*
Kunderna skickar stora Excel-filer. Artikelnummer, storlekar och antal fördes över för hand till plock-
och följesedlar, rad för rad.
Nu laddar teamet upp filen. Systemet läser raderna, delar upp dem rätt och tar fram färdiga sedlar i
Etceteras eget format.
*Link:* Så gjorde vi för Etcetera Offset
*Bild:* spreadsheet rows flow into a plocksedel that fills in field by field.

**2. Samma steg, varje vecka**
*JaTack*
JaTack bokar möten åt andra företag och behöver nya prospektlistor hela tiden. Varje bolag öppnades,
kopierades och klistrades in i Excel för hand.
Nu klistrar de in länken till en sökning i Allabolag, och ett knapptryck senare ligger en färdig ringlista
i Excel. Två minuter per lead blev fem sekunder.
*Link:* Så gjorde vi för JaTack
*Bild:* a search link is pasted, then rows of companies fill a sheet.

**3. AI i flödet: research som kräver omdöme** (named section)
*Observa Inkasso & Juridik*
Vissa steg går inte att skriva som regler. Att hitta rätt företag bakom ett namn, eller avgöra om det
säljer till företag eller privatpersoner, kräver att någon läser och bedömer. Där använder vi AI, som ett
steg i flödet.
Observa hade tiotusentals företagsnamn och inte mycket mer. Ett AI-flöde i tre steg tar nu fram hemsida,
ort, om bolaget säljer till företag eller privatpersoner och vem som är ekonomichef. Fyra minuter per
företag blev runt tio sekunder, och resultatet hamnar i listan där det kan granskas.
*Link:* Så gjorde vi för Observa
*Bild:* a bare company name gains domain, city, B2B/B2C and a contact, one step at a time.

**4. Samma uppgift i flera system**
*Exempel*
Kunden läggs in i bokningen, sedan i CRM:et, sedan i bokföringen, och förr eller senare blir något fel.
Ett flöde kan föra över uppgifterna när bokningen kommer in, så att ingen behöver skriva in dem igen. Det
går när systemen har ett API eller kan exportera data, vilket vi ser i kartläggningen.
*No case link: no delivered integration case yet.*
*Bild:* one booking updates three tools at once.

### Så jobbar vi med er (one block, two columns)

**Ni får**
- Ett färdigt flöde i drift.
- Dokumentation och en genomgång med dem som ska använda det.
- Koden, datan och alla inloggningar. Ni äger allt.
- En supportperiod där vi rättar fel utan kostnad.

**Vi behöver från er**
- En person som kan visa hur jobbet görs i dag.
- Exempel på riktiga filer, listor eller ärenden.
- Tillgång till de system flödet ska använda.
- Någon som testar och godkänner varje del innan vi går vidare.

### Pris och upplägg (band)

| Big text | Body |
|---|---|
| Kostnadsfritt | Introsamtal och kartläggning. Ni får en offert med omfattning och fast pris innan något byggs. |
| från 15 000 kr | Priset beror på hur många system och steg flödet har, hur datan ser ut och vilka undantag det ska klara. |
| 1–2 veckor | För mindre automationer, från kartläggning till drift. Större bygge tar 4–6 veckor. |
| Efter leverans | Supportperioden ingår. Löpande support och små förbättringar finns till fast månadspris. |

### Vanliga frågor (automation-specific only; price and timeline stay on `/tjanster`)

**Vad startar ett flöde?**
Något som redan händer hos er: en fil som laddas upp, ett formulär som skickas, en bokning eller ett mejl
som kommer in, eller en viss tid på dagen.

**Vad händer när något inte stämmer?**
Det bestämmer vi tillsammans i kartläggningen: vilka undantag som finns och vad som ska hända med dem.
Ofta går de till en person hos er i stället för att flödet gissar.
**[INTERNT]** Owner to confirm "ofta går de till en person" matches how flows are built.

**Måste vi byta verktyg?**
Oftast inte. Har era system ett API eller kan exportera data går det att koppla ihop dem. Ibland är det
enklare att ändra ett steg eller bygga något nytt, och då säger vi det.

**När använder ni AI, och när räcker vanliga regler?**
Regler när steget alltid görs på samma sätt. AI när någon behöver läsa, tolka eller bedöma, som att hitta
rätt företag bakom ett namn. Många flöden använder båda.

**Kan vi börja med ett enda flöde?**
Ja. Många börjar med ett och lägger till fler när det första fungerar.

---

## 3. `/tjanster/egna-system` — existing page, restructured

**Buyer's situation:** "We need a tool to run our work."

**Sections:** hero → examples → what you get / what we need → price → FAQ.

**Title** (unchanged): Egna system – skräddarsydda verksamhetssystem för företag
**Meta description:** Vi bygger egna system när färdiga verktyg inte passar: bokningar, personal och
kunduppföljning på ett ställe. Kostnadsfri kartläggning, fast pris, och ni äger koden.
*(Old description named "dokument från Excel", which now belongs to Automatisering.)*

**H1** (unchanged): EGNA / SYSTEM.

**Intro:** När inget färdigt program passar hur ni jobbar bygger vi ett eget. Ett ställe där ni och
personalen ser bokningar, kunder och vem som gör vad.

**CTAs:** Boka ett intro (30 min) · Se exempel

### Vad vi bygger (examples)

Section intro: Varje system byggs för er, av delar vi redan vet fungerar: inloggning, kalender, import och
utskick.

**1. Verksamheten levde i en telefon**
*Kom-Fort Bilvård*
Varje ny bokning betydde att ägaren skulle hitta en ledig medarbetare, skriva om passet, samla uppgifter
om kund och bil och skicka bekräftelsen från sin egen telefon.
Nu registreras uppdraget på ett ställe. Personalen loggar in och ser sina pass, och kunden får sin
orderbekräftelse automatiskt.
*Byggt av:* bokning och kalender · inloggning för personalen · automatisk bekräftelse
*Link:* Så byggde vi Kom-Forts system
*Bild:* a booking lands in the calendar, a shift appears for a staff member, and the customer's confirmation goes out.

**2. Inget färdigt verktyg passade**
*Osteopaticentrum*
Osteopaticentrum ville påminna tidigare kunder om att boka en ny behandling, men verktygen på marknaden
passade inte hur de jobbade.
I sitt eget system importerar de kundlistan, väljer vilka som ska få ett SMS och ser vilka utskick som
leder till nya bokningar.
*Byggt av:* import av kundlista · SMS-utskick · koppling till bokningar
*Link:* Så byggde vi Osteopaticentrums SMS-system
*Bild:* a customer list, a selection of recipients, an SMS, then a booking that ties back to it.

### Så jobbar vi med er (one block, two columns)

**Ni får**
- Ett system i drift, med inloggning för dem som ska använda det.
- Dokumentation och en genomgång med personalen.
- Koden, datan och alla inloggningar.
- En supportperiod efter leverans, och ett system som går att bygga vidare på.

**Vi behöver från er**
- En person som kan visa hur ni jobbar i dag, steg för steg.
- Exempel på riktiga bokningar, kundlistor eller dokument.
- Någon som testar varje del innan vi går vidare.

### Pris och upplägg (band)

| Big text | Body |
|---|---|
| Kostnadsfritt | Introsamtal och kartläggning. Ni får en offert med omfattning och fast pris innan något byggs. |
| från 15 000 kr | Priset beror på hur många delar systemet har, hur många som ska använda det och vad det ska kopplas till. |
| 4–6 veckor | Från kartläggning till drift för de flesta system. Mindre verktyg är ofta klara på 1–2 veckor. |
| Efter leverans | Supportperioden ingår. Löpande support och små förbättringar finns till fast månadspris. |

### Vanliga frågor

The five current questions stay as they are (`src/data/services.ts`).

---

## 4. `/tjanster/ai-radgivning` — new page

**Buyer's situation:** "I want to use AI in my work, or get more out of it, and want someone to show me
how with my own tasks."

**Sections:** hero → what you get → who it's for → FAQ.

**Title:** AI-rådgivning – två timmar förberedda utifrån ditt arbete
**Meta description:** Personlig AI-rådgivning för dig som vill använda AI i jobbet. Du svarar på några
frågor, vi förbereder, och sedan jobbar vi två timmar med din uppgift. 2 990 kr.  **[INTERNT: moms]**

**H1:** AI-RÅDGIVNING / FÖR DITT ARBETE.

**Subheading:** Två timmar AI-hjälp, förberedda utifrån dina frågor.

**Intro:** Du vet att AI borde kunna spara dig tid, men inte riktigt hur. Eller så använder du det redan
och vill få ut mer. Innan vi ses svarar du på några frågor om ditt jobb, och sedan förbereder vi två
timmar kring just det.

**Price line:** 2 990 kr · 2 timmar · på distans eller på plats  **[INTERNT: moms]**
**CTA:** Boka din AI-session  **[INTERNT: booking flow]**
**Small print under the CTA:** Du betalar mot faktura efter sessionen.

### Det här får du (four parts, in order)

**1. Förberett för dig**
Innan vi ses svarar du på fem korta frågor om ditt jobb och vad du vill ha hjälp med. Vi går igenom
svaren och förbereder exempel och verktyg för just din uppgift.

**2. Två fokuserade timmar**
På distans eller på plats. Vi jobbar med din riktiga uppgift: testar verktyg, skriver om instruktioner
tills svaren går att använda och ritar upp hur ett flöde skulle kunna se ut.

**3. En skriftlig sammanfattning**
Det vi gick igenom, samlat så att du kan gå tillbaka till det när du provar själv.

**4. Ett dokument för ditt arbete**
Instruktioner, prompter och tips på verktyg som passar dig, och vad du kan göra härnäst, i
prioritetsordning.

### För dig som…

- …tycker att det händer för mycket inom AI för att hinna med.
- …vill komma igång men inte vet var du ska börja.
- …redan använder ChatGPT, Copilot eller liknande men inte får svar du kan använda.
- …har en uppgift som tar för lång tid och undrar om AI kan hjälpa till.
- …vill förstå vad en AI-agent är och om en sådan skulle göra nytta för dig.

### Vanliga frågor

**Behöver jag kunna något om AI innan?**
Nej. Vi utgår från var du är i dag, oavsett om du aldrig har använt AI eller använder det varje dag.

**Vad ska jag fylla i innan?**
Fem korta frågor om ditt jobb, uppgiften du vill ha hjälp med, hur du gör i dag, vad du har testat och
vad du vill kunna efteråt.

**Bygger ni något under sessionen?**
Nej. Sessionen handlar om att du ska kunna använda AI själv. Vi kan skissa hur ett automatiskt flöde
skulle kunna se ut, men vill ni ha det byggt tar vi det separat, med en kostnadsfri kartläggning och en
egen offert.

**Kan fler från företaget vara med?**
Sessionen är upplagd för en person, så att vi kan utgå helt från ditt arbete. Hör av dig om ni är fler.
**[INTERNT]** +1 500 kr per extra participant is a future option. Don't publish it yet.

**Hur betalar jag?**
Mot faktura efter sessionen.

**[INTERNT] Credit:** once destination and terms are decided, it gets one line near the price or its own
FAQ answer. Nothing is published until then.

### Preparation form (five questions)

1. Vad jobbar du med?
2. Vilken uppgift eller vilket problem vill du ha hjälp med?
3. Hur gör du i dag, och vilka verktyg använder du?
4. Vad har du redan testat med AI?
5. Vad vill du kunna göra efter sessionen?
