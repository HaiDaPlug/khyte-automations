import { cases, getCaseBySlug } from "@/data/cases";
import { Client, Frame, Headline, OG_CONTENT_TYPE, OG_SIZE, Quote, Result, Sub, assets, renderCard } from "@/og/card";

export const alt = "Case från Khyte Automations";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// The page's generateStaticParams doesn't reach this route; without its own,
// every card would be rendered on request instead of at build.
export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

type CaseCard = {
  lead: string;
  accent?: string;
  size?: number;
  sub: string;
  /** The result in the ring, top to bottom. */
  steps: string[];
  label: string;
  /** Verbatim from the testimonials in CasesSection. */
  quote?: { photo: string; text: string; name: string; role: string };
};

/** Share-card copy per case: shorter than the page's own, and split for the accent. */
const CARDS: Record<string, CaseCard> = {
  "lead-engine": {
    lead: "Från filtrering till ringlista",
    accent: "på några sekunder.",
    size: 60,
    sub: "Ett flöde hämtar bolagen från Allabolag och levererar listan i Excel.",
    steps: ["≈32 h"],
    label: "sparad tid per 1 000 leads",
    quote: {
      photo: assets.sebastian,
      text: "Nu kan jag jobba snabbare och effektivare, vilket skapar fler affärer!",
      name: "Sebastian Andersson",
      role: "Grundare, JaTack AB",
    },
  },
  "etcetera-offset": {
    lead: "Excel in.",
    accent: "Färdiga plocksedlar ut.",
    size: 70,
    sub: "Plock- och följesedlar som skapar sig själva. Mer tid till produktion.",
    steps: ["Excel", "Plocksedlar"],
    label: "utan manuellt dokumentarbete",
  },
  "komfort-bilvard": {
    lead: "Från telefon, minne och lösa trådar",
    accent: "till ett system.",
    size: 60,
    sub: "Verksamheten behöver inte längre leva i ägarens telefon.",
    steps: ["Bokning", "Schema", "Bekräftelse"],
    label: "samlat i ett enda arbetsflöde",
  },
  osteopaticentrum: {
    lead: "Från kundlista till",
    accent: "mätbara återbesök.",
    sub: "Ett eget system för SMS, kunduppföljning och återaktivering.",
    steps: ["SMS", "Bokning"],
    label: "se vilka utskick som ger bokningar",
    quote: {
      photo: assets.mattias,
      text: "Jag är mycket nöjd med det professionella bemötande och utförandet!",
      name: "Mattias Hietala",
      role: "Grundare, Osteopaticentrum",
    },
  },
  foretagsresearch: {
    lead: "Från företagsnamn till",
    accent: "färdig research på sekunder.",
    size: 60,
    sub: "≈65 timmar sparade per 1 000 företag.",
    steps: ["4 min", "10 sek"],
    label: "researchtid per företag",
  },
};

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) return renderCard(<Frame><Headline lead="Case" /></Frame>);

  // A case added to cases.ts without an entry above still gets a card from its own data.
  const metric = c.metrics[0];
  const card: CaseCard = CARDS[slug] ?? {
    lead: c.hook,
    size: 56,
    sub: c.description,
    steps: metric ? metric.value.split("→").map((s) => s.trim()) : [c.company],
    label: metric?.label ?? c.category,
  };

  return renderCard(
    <Frame
      right={<Result steps={card.steps} label={card.label} />}
      footer={
        card.quote ? (
          <Quote photo={card.quote.photo} quote={card.quote.text} name={card.quote.name} role={card.quote.role} />
        ) : (
          <Client name={c.company} />
        )
      }
    >
      <Headline lead={card.lead} accent={card.accent} size={card.size} />
      <Sub>{card.sub}</Sub>
    </Frame>,
  );
}
