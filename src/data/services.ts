import type { FAQEntry } from "./faq";
import { cases, type CaseData } from "./cases";
import { facts } from "./facts";

/**
 * Service pages under /tjanster/<slug>.
 *
 * Works like cases.ts: this data drives the route, the sitemap, the service
 * cards on /tjanster and the structured data. The service ↔ case relationship
 * lives here (caseSlugs) and nowhere else. Service pages list their proof with
 * casesForService(); case pages link back with servicesForCase().
 *
 * Generic questions (price, ownership, timeline) belong on /tjanster, which is
 * the canonical page for them. A service's own FAQ only answers what is
 * specific to that service, so the pages never repeat each other.
 */

export interface ServicePoint {
  title: string;
  body: string;
}

/** Picks the animated scene beside an example in <ServiceScene />. */
export type SceneId = "dokument" | "ringlista" | "research" | "flera-system";

/**
 * One example on an example-led service page: the situation in the buyer's
 * words, how it was done before, what we built, and the case behind it.
 */
export interface ServiceExample {
  title: string;
  /** Who it was built for, or what kind of example it is. */
  label: string;
  /** Shown after the label, e.g. "AI i flödet". */
  tag?: string;
  /** Not a delivered case. The label is styled so the difference shows. */
  hypothetical?: boolean;
  /** How the work was done before. */
  before: string;
  /** What we built and what it gave. */
  after: string;
  /** The case behind the example, linked as text. Must also be in caseSlugs. */
  case?: { slug: string; linkText: string };
  scene: SceneId;
}

/** One item in the price band. */
export interface ServiceTerm {
  /** The big text. */
  num: string;
  /** Small label before it, e.g. "från". */
  unit?: string;
  /** Small label after it, e.g. "exkl. moms". */
  note?: string;
  body: string;
}

/**
 * Two page layouts share this type while the services move over one at a
 * time. Example-led pages (Automatisering) set examples, gets, needs and
 * terms; Egna system still uses problems and builds until it moves over, and
 * then those two fields go.
 */
export interface ServiceData {
  slug: string;
  /** Display name, used in links, breadcrumbs and schema. */
  name: string;
  /** Two-line page title for <PageHeader>. */
  heading: { line1: string; line2: string };
  /** <title>. The layout appends "| Khyte Automations". */
  seoTitle: string;
  metaDescription: string;
  /** Lead under the page title. */
  intro: string;
  /** One sentence for the card on /tjanster. */
  summary: string;
  /** The situations that make someone need this, in their own words. */
  problems?: ServicePoint[];
  /** What we build. */
  builds?: ServicePoint[];
  examplesHeading?: { line1: string; line2: string };
  examplesIntro?: string;
  examples?: ServiceExample[];
  /** "Ni får": what the customer gets. */
  gets?: string[];
  /** "Vi behöver från er": what we need from the customer. */
  needs?: string[];
  /** The price band. */
  terms?: ServiceTerm[];
  /** One line under the price band. */
  termsNote?: string;
  /** Cases that prove the service, strongest first. Must be slugs in cases.ts. */
  caseSlugs: string[];
  faqs: FAQEntry[];
}

export const services: ServiceData[] = [
  {
    slug: "automatisering",
    name: "Automatisering",
    heading: { line1: "AUTOMATISERING", line2: "AV MANUELLT ARBETE." },
    seoTitle: "Automatisering av arbetsflöden och dokument",
    metaDescription: `Vi automatiserar listor, dokument och företagsresearch. Se exempel med Excel och AI. Kostnadsfri kartläggning och fast pris från ${facts.priceFrom} ${facts.priceVat}.`,
    intro:
      "Samma lista, samma dokument, samma kopierande. Vi bygger flöden som gör återkommande arbete åt er, med AI när information behöver läsas eller tolkas.",
    summary:
      "Det ni gör för hand varje vecka, gjort automatiskt. Listor som fylls i, dokument som skapas och uppgifter som flyttas mellan system.",
    examplesHeading: { line1: "VAD VI", line2: "AUTOMATISERAR." },
    examplesIntro: "Fyra vanliga lägen. Tre av dem kommer från uppdrag vi har levererat.",
    examples: [
      {
        title: "Kundfiler som ska bli färdiga dokument",
        label: "Etcetera Offset",
        before:
          "Kunderna skickar stora Excel-filer. Artikelnummer, storlekar och antal fördes över för hand till plock- och följesedlar, rad för rad.",
        after:
          "Nu laddar teamet upp filen. Systemet läser raderna, delar upp dem rätt och tar fram färdiga sedlar i Etceteras eget format.",
        case: { slug: "etcetera-offset", linkText: "Så gjorde vi för Etcetera Offset" },
        scene: "dokument",
      },
      {
        title: "Prospektlistor som byggs för hand",
        label: "JaTack",
        before:
          "JaTack bokar möten åt andra företag och behöver nya prospektlistor hela tiden. Varje bolag öppnades, kopierades och klistrades in i Excel för hand.",
        after:
          "Nu klistrar de in länken till en sökning i Allabolag, och ett knapptryck senare ligger en färdig ringlista i Excel. Två minuter per lead blev fem sekunder.",
        case: { slug: "lead-engine", linkText: "Så gjorde vi för JaTack" },
        scene: "ringlista",
      },
      {
        title: "AI-research från en lista med företagsnamn",
        label: "Observa Inkasso & Juridik",
        tag: "AI i flödet",
        before:
          "Observa hade tiotusentals företagsnamn, men saknade uppgifter som behövdes för säljarbetet. Varje företag behövde sökas upp och informationen sammanställas.",
        after:
          "Vi byggde ett AI-flöde i tre steg som söker fram hemsida, ort, kundtyp och ekonomiansvarig och skriver tillbaka resultatet till listan. Fyra minuters research per företag blev omkring tio sekunder. Uppgifterna finns samlade för fortsatt arbete och granskning.",
        case: { slug: "foretagsresearch", linkText: "Så gjorde vi för Observa" },
        scene: "research",
      },
      {
        title: "Samma uppgifter i flera system",
        label: "Exempel på ett möjligt flöde",
        hypothetical: true,
        before:
          "Samma kunduppgifter skrivs in i bokningssystemet, CRM:et och bokföringen. Det tar tid, och informationen kan skilja sig mellan systemen.",
        after:
          "Ett flöde kan föra över uppgifterna när bokningen kommer in, så att de inte behöver skrivas in igen. Vilka steg som går att koppla ihop undersöker vi i kartläggningen, utifrån hur era system kan lämna och ta emot uppgifter.",
        scene: "flera-system",
      },
    ],
    gets: [
      "Ett färdigt flöde i drift.",
      "Dokumentation och en genomgång med dem som ska använda det.",
      "Koden vi levererar, och tillgång till er data och era inloggningar.",
      "Support och felrättning efter leverans, enligt offerten.",
    ],
    needs: [
      "En person som kan visa hur jobbet görs i dag.",
      "Exempel på riktiga filer, listor eller ärenden.",
      "Tillgång till de system flödet ska använda.",
      "Någon som testar och godkänner varje del innan vi går vidare.",
    ],
    terms: [
      {
        num: "Kostnadsfritt",
        body: "Introsamtal och kartläggning är kostnadsfria. Ni får en offert med omfattning, tidsplan och fast pris innan ni bestämmer er.",
      },
      {
        num: facts.priceFrom,
        unit: "från",
        note: facts.priceVat,
        body: "Priset beror på hur många system och steg flödet har, hur datan ser ut och vilka undantag det ska klara.",
      },
      {
        num: facts.delivery.small,
        body: `För mindre automationer, från kartläggning till drift. Större bygge tar ${facts.delivery.large}. Ni får en tidsplan i offerten.`,
      },
      {
        num: "Drift och support",
        body: "Efter leverans kan vi sköta hosting, underhåll och löpande support till ett fast månadspris utifrån lösningens omfattning, utan bindningstid. Offerten visar vad som ingår och vad det kostar.",
      },
    ],
    termsNote: "Kostnader för externa tjänster, som SMS eller AI, står också i offerten.",
    caseSlugs: ["etcetera-offset", "lead-engine", "foretagsresearch"],
    faqs: [
      {
        q: "Vad startar ett flöde?",
        a: "Något som redan händer hos er: en fil som laddas upp, ett formulär som skickas, en bokning eller ett mejl som kommer in, eller en viss tid på dagen.",
      },
      {
        q: "Vad händer när något inte stämmer?",
        a: "I kartläggningen går vi igenom vilka undantag lösningen behöver hantera och kommer överens om vad som ska hända. Det kan vara att stoppa ett steg, försöka igen eller be någon kontrollera underlaget.",
      },
      {
        q: "Måste vi byta verktyg?",
        a: "Inte nödvändigtvis. Vi undersöker om systemen kan kopplas ihop och vad som krävs. Ibland räcker en koppling mellan verktygen. I andra fall är det bättre att ändra ett steg eller bygga något nytt.",
      },
      {
        q: "När använder ni AI, och när räcker vanliga regler?",
        a: "Regler passar när ett steg har tydliga villkor och görs likadant varje gång. AI kan hjälpa till att läsa, tolka och sammanställa information som varierar, till exempel i företagsresearch. Vi väljer utifrån uppgiften och vilka krav ni har på resultatet.",
      },
      {
        q: "Kan vi börja med ett enda flöde?",
        a: "Ja. Vi kan börja med ett avgränsat flöde och ta nästa steg när ni har sett hur det fungerar.",
      },
    ],
  },
  {
    slug: "egna-system",
    name: "Egna system",
    heading: { line1: "EGNA", line2: "SYSTEM." },
    seoTitle: "Egna system – skräddarsydda verksamhetssystem för företag",
    metaDescription:
      "Vi bygger egna system när färdiga verktyg inte passar: bokning och personal, dokument från Excel, SMS-uppföljning. Fast pris, och ni äger koden.",
    intro:
      "När färdiga verktyg inte passar hur ni jobbar bygger vi ett eget system som gör det. Anpassat efter er verksamhet, byggt av delar vi redan vet fungerar.",
    summary:
      "När inget färdigt verktyg passar bygger vi ett eget, för bokning och personal, dokument eller kunduppföljning.",
    problems: [
      {
        title: "Samma dokument byggs för hand",
        body: "Information från kundernas filer förs över rad för rad till nya dokument. Varje gång en ny fil kommer in.",
      },
      {
        title: "Verksamheten lever i en telefon",
        body: "Bokningar, pass och bekräftelser hålls ihop av en person, via meddelanden och minnet. Det fungerar tills det blir fler kunder och fler anställda.",
      },
      {
        title: "Färdiga verktyg passar inte",
        body: "Det ni behöver finns inte, eller kommer med en dyr och krånglig process runt sig. Så ni anpassar er efter verktyget istället för tvärtom.",
      },
    ],
    builds: [
      {
        title: "Dokument som skapar sig själva",
        body: "Ladda upp filen ni redan får. Systemet läser den och tar fram färdiga dokument i ert format, till exempel plock- och följesedlar.",
      },
      {
        title: "Boknings- och personalsystem",
        body: "Kund, uppdrag, tid och ansvarig medarbetare på ett ställe. Personalen loggar in och ser sina pass, och kunden får sin bekräftelse automatiskt.",
      },
      {
        title: "Egna verktyg för kunduppföljning",
        body: "Importera kundlistan, skicka SMS och se vilka utskick som faktiskt leder till nya bokningar.",
      },
    ],
    caseSlugs: ["etcetera-offset", "komfort-bilvard", "osteopaticentrum"],
    faqs: [
      {
        q: "Varför ett eget system och inte ett färdigt verktyg?",
        a: "Färdiga verktyg är bra när de passar. Men när ni börjar anpassa verksamheten efter verktyget, eller bygger rutiner runt det som saknas, blir ett eget system ofta enklare. Räcker ett färdigt verktyg säger vi det i kartläggningen.",
      },
      {
        q: "Vad händer med systemet om vi slutar jobba med er?",
        a: "Ni äger koden vi levererar och har tillgång till er data och de inloggningar som hör till lösningen. Ni kan låta oss sköta driften eller ta över själva, med eller utan en annan leverantör. Driften och supporten har ingen bindningstid, och upplägget för överlämningen specificerar vi i offerten.",
      },
      {
        q: "Kan systemet kopplas till det vi redan använder?",
        a: "Ofta. Har ert nuvarande system ett API eller kan exportera data går det att koppla. Osteopaticentrum importerar sin kundlista som CSV direkt i sitt SMS-system. Vad som går i ert fall ser vi i kartläggningen.",
      },
      {
        q: "Behöver personalen lära sig något nytt?",
        a: "Lite, men vi bygger runt hur ni redan jobbar. Hos Kom-Fort Bilvård loggar personalen in och ser sina pass och den information de behöver inför varje uppdrag. Ni får en genomgång och dokumentation vid överlämningen.",
      },
      {
        q: "Kan systemet växa med oss?",
        a: "Ja. Vi bygger det för hur ni jobbar idag, men så att nya delar kan läggas till när verksamheten ändras.",
      },
    ],
  },
];

/**
 * The "Vad vi löser" tiles on /tjanster: what we solve, in the buyer's words,
 * short on purpose. Each tile is also the way into the matching service page;
 * the depth lives on the subpages, not here.
 *
 * A tile links to its service page when it exists, otherwise to a case that
 * shows the work, otherwise nowhere. Setting `serviceSlug` once a new service
 * page ships is all it takes to repoint a tile.
 */
export interface ServiceArea {
  /** Also picks the tile's illustration in <AreaIllustration />. */
  id: "excel" | "steg" | "verktyg" | "system" | "radgivning";
  title: string;
  body: string;
  /** Service name shown above the title when the tile is a service in its own right. */
  label?: string;
  serviceSlug?: string;
  caseSlug?: string;
  /** Book the intro call instead of linking anywhere. */
  bookIntro?: boolean;
  /** Spans the full row. */
  wide?: boolean;
}

export const serviceAreas: ServiceArea[] = [
  {
    id: "excel",
    title: "Excelsammanställningar",
    body: "Rapporter och listor som byggs för hand, rad för rad, varje vecka.",
    serviceSlug: "automatisering",
  },
  {
    id: "steg",
    title: "Manuella steg",
    body: "Kopiera, klistra in, kolla, skicka. Steg som någon gör om och om igen i CRM, mejl och Excel.",
    serviceSlug: "automatisering",
  },
  {
    id: "verktyg",
    title: "Verktyg som inte pratar med varandra",
    body: "Samma uppgifter skrivs in i bokningssystem, CRM och bokföring, och något faller mellan stolarna.",
  },
  {
    id: "system",
    title: "Allt på ett ställe",
    body: "När bokningar, kunder och personal lever i telefoner, mejl och minnet.",
    serviceSlug: "egna-system",
  },
  {
    id: "radgivning",
    label: "Rådgivning",
    title: "Vet inte var ni ska börja?",
    body: "Ni vet att något borde gå enklare, men inte vad. Vi ger råd om vad som lönar sig att automatisera, vilka verktyg som passar och var AI gör nytta, utan krav på att vi bygger något.",
    bookIntro: true,
    wide: true,
  },
];

/**
 * Where a tile leads. Throws on an unknown slug, like casesForService(), so a
 * renamed page or case fails the build instead of leaving a dead tile.
 */
export function areaLink(area: ServiceArea): { href: string; label: string } | null {
  if (area.serviceSlug) {
    const s = getServiceBySlug(area.serviceSlug);
    if (!s) throw new Error(`services.ts: area "${area.id}" points at unknown service "${area.serviceSlug}"`);
    return { href: `/tjanster/${s.slug}`, label: `Läs om ${s.name.toLowerCase()}` };
  }
  if (area.caseSlug) {
    const c = cases.find((x) => x.slug === area.caseSlug);
    if (!c) throw new Error(`services.ts: area "${area.id}" points at unknown case "${area.caseSlug}"`);
    return { href: `/case/${c.slug}`, label: "Se ett exempel" };
  }
  return null;
}

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find((s) => s.slug === slug);
}

/**
 * The cases behind a service, in the order listed. Throws on an unknown slug
 * so a renamed or removed case fails the build instead of silently dropping
 * the proof from the page.
 */
export function casesForService(service: ServiceData): CaseData[] {
  return service.caseSlugs.map((slug) => {
    const c = cases.find((x) => x.slug === slug);
    if (!c) throw new Error(`services.ts: "${service.slug}" lists unknown case "${slug}"`);
    return c;
  });
}

/**
 * The case page an example links to. Throws when the slug isn't one of the
 * service's caseSlugs (or doesn't exist), so the example and the service ↔
 * case relationship can't drift apart.
 */
export function exampleCaseHref(service: ServiceData, example: ServiceExample): string | null {
  if (!example.case) return null;
  const { slug } = example.case;
  if (!service.caseSlugs.includes(slug) || !cases.some((c) => c.slug === slug)) {
    throw new Error(`services.ts: "${service.slug}" example "${example.title}" links to "${slug}", which isn't one of its cases`);
  }
  return `/case/${slug}`;
}

/** The services a case proves, for linking a case page back to its service. */
export function servicesForCase(caseSlug: string): ServiceData[] {
  return services.filter((s) => s.caseSlugs.includes(caseSlug));
}
