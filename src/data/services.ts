import type { FAQEntry } from "./faq";
import { cases } from "./cases";

/**
 * Service pages under /tjanster/<slug>.
 *
 * Works like cases.ts: this data drives the route, the sitemap, the service
 * cards on /tjanster and the structured data. The service ↔ case relationship
 * lives here (caseSlugs) and nowhere else. Examples link their case with
 * exampleCaseHref(); case pages link back with servicesForCase().
 *
 * Generic questions (price, timeline) belong on /tjanster, which is the
 * canonical page for them. A service's own FAQ mostly answers what is specific
 * to that service; a generic answer is repeated only where a buyer of that
 * service needs it (Egna system's ownership question).
 */

/** Picks the animated scene beside an example in <ServiceScene />. */
export type SceneId = "dokument" | "ringlista" | "research" | "flera-system" | "bokning" | "sms" | "status";

/**
 * One card on an example-led service page: the situation in the buyer's
 * words, one or two sentences on what changed, and the case behind it.
 */
export interface ServiceExample {
  title: string;
  summary: string;
  /** A small pill above the title, e.g. "AI i flödet". */
  tag?: string;
  /** Not a delivered case. The tag is drawn dashed so the difference shows. */
  hypothetical?: boolean;
  /** The case behind the example, linked as text. Must also be in caseSlugs. */
  case?: { slug: string; linkText: string };
  scene: SceneId;
}

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
  examplesHeading: { line1: string; line2: string };
  examplesIntro: string;
  examples: ServiceExample[];
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
    metaDescription: "Vi automatiserar listor, dokument och företagsresearch. Se exempel med Excel och AI. Kostnadsfri kartläggning och fast pris innan vi bygger.",
    intro:
      "Samma lista, samma dokument, samma kopierande. Vi bygger flöden som gör återkommande arbete åt er, med AI när information behöver läsas eller tolkas.",
    summary:
      "Det ni gör för hand varje vecka, gjort automatiskt. Listor som fylls i, dokument som skapas och uppgifter som flyttas mellan system.",
    examplesHeading: { line1: "VAD VI", line2: "AUTOMATISERAR." },
    examplesIntro: "Fyra vanliga lägen. Tre av dem kommer från uppdrag vi har levererat.",
    examples: [
      {
        title: "Kundfiler som ska bli färdiga dokument",
        summary:
          "Kundens Excel-fil laddas upp, och färdiga plock- och följesedlar kommer ut i Etceteras eget format. Inget förs över för hand.",
        case: { slug: "etcetera-offset", linkText: "Så gjorde vi för Etcetera Offset" },
        scene: "dokument",
      },
      {
        title: "Prospektlistor som byggs för hand",
        summary:
          "En länk till en sökning i Allabolag blir en färdig ringlista i Excel. Två minuter per lead blev fem sekunder.",
        case: { slug: "lead-engine", linkText: "Så gjorde vi för JaTack" },
        scene: "ringlista",
      },
      {
        title: "AI-research från en lista med företagsnamn",
        summary:
          "Ett AI-flöde tar fram hemsida, ort, kundtyp och ekonomiansvarig för varje företag i listan. Fyra minuter per företag blev omkring tio sekunder.",
        tag: "AI i flödet",
        case: { slug: "foretagsresearch", linkText: "Så gjorde vi för Observa" },
        scene: "research",
      },
      {
        title: "Samma uppgifter i flera system",
        summary:
          "När en bokning kommer in kan uppgifterna föras över till CRM och bokföring, så att ingen skriver in dem igen. Vad som går att koppla ihop undersöker vi i kartläggningen.",
        tag: "Exempel på ett möjligt flöde",
        hypothetical: true,
        scene: "flera-system",
      },
    ],
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
      "Skräddarsydda system för bokningar, personal eller kunduppföljning när färdiga verktyg inte räcker. Kostnadsfri kartläggning, fast pris och ni äger koden.",
    intro:
      "Vi bygger ett verktyg för jobbet ni behöver göra, när färdiga program inte räcker. Det kan samla bokningar och personal, eller hjälpa er att följa upp kunder.",
    summary:
      "Ett verktyg byggt för hur ni jobbar, när färdiga program inte räcker. Till exempel för bokningar, personal eller kunduppföljning.",
    examplesHeading: { line1: "VAD VI", line2: "BYGGER." },
    examplesIntro:
      "Exempel på vad ett eget system kan hjälpa er med. Varje system byggs för er, av delar vi redan vet fungerar.",
    // Complete tools people work in, as illustrations of what's possible rather
    // than a catalogue (owner, 2026-10-09). No case links on these examples.
    examples: [
      {
        title: "Bokningar och personal på ett ställe",
        summary:
          "Hos Kom-Fort Bilvård registreras uppdrag, kund, bil och ansvarig medarbetare på ett ställe. Personalen ser sina pass, och kunden får sin bekräftelse automatiskt.",
        scene: "bokning",
      },
      {
        title: "Kunder som bokar igen",
        summary:
          "Osteopaticentrum importerar sin kundlista, väljer vilka som ska få ett SMS och ser vilka utskick som leder till nya bokningar.",
        scene: "sms",
      },
      {
        title: "Status på varje uppdrag",
        summary:
          "Alla ser var ett uppdrag står, från förfrågan till klart, utan att behöva fråga någon.",
        tag: "Exempel på ett möjligt system",
        hypothetical: true,
        scene: "status",
      },
    ],
    caseSlugs: ["komfort-bilvard", "osteopaticentrum"],
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
        a: "Det undersöker vi i kartläggningen, utifrån hur era system kan lämna och ta emot uppgifter. En koppling kan vara automatiserad eller bygga på att ni exporterar och importerar en fil. Osteopaticentrum importerar till exempel sin kundlista som CSV i sitt SMS-system.",
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
 * Where a tile leads. Throws on an unknown slug, like exampleCaseHref(), so a
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

// Every caseSlug must be a real case; checked when this module loads, so a
// renamed or removed case fails the build.
for (const s of services) {
  for (const slug of s.caseSlugs) {
    if (!cases.some((c) => c.slug === slug)) throw new Error(`services.ts: "${s.slug}" lists unknown case "${slug}"`);
  }
}

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find((s) => s.slug === slug);
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
