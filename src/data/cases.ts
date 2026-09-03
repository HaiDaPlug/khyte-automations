export interface CaseMetric {
  value: string;
  unit: string;
  label: string;
}

export interface CaseStep {
  label: string;
  description: string;
}

export interface CaseData {
  slug: string;
  index: string;
  company: string;
  problem: string;
  category: string;
  description: string;
  hook: string;
  gradient: string;
  challenge: string | string[];
  solution: string | string[];
  steps: CaseStep[];
  metrics: CaseMetric[];
  testimonial?: {
    quote: string;
    name: string;
    role: string;
  };
  nextSlug?: string;
}

export const cases: CaseData[] = [
  {
    slug: "lead-engine",
    index: "01",
    company: "JaTack AB",
    problem: "Leadgenerering för listor",
    category: "Sälj & Prospektering",
    description:
      "Säljarens arbetsflöde automatiserat. In med en länk i Allabolag och ut med kvalificerade leads direkt i ett Excel.",
    hook: "Från filtrering till ringlista på några sekunder.",
    gradient: [
      "radial-gradient(ellipse 55% 60% at 78% 18%, rgba(255,235,185,0.72) 0%, rgba(255,235,185,0) 65%)",
      "radial-gradient(ellipse 70% 65% at 28% 52%, rgba(212,98,43,0.90) 0%, rgba(212,98,43,0) 62%)",
      "radial-gradient(ellipse 50% 55% at 8% 88%, rgba(27,8,3,0.88) 0%, rgba(27,8,3,0) 58%)",
      "radial-gradient(ellipse 60% 50% at 18% 10%, rgba(232,131,58,0.65) 0%, rgba(232,131,58,0) 60%)",
      "linear-gradient(145deg, #7A3A18 0%, #C46020 35%, #E8A050 58%, #F5D8A0 80%, #C87030 100%)",
    ].join(", "),
    challenge: [
      "JaTack AB bokar möten åt företag och behöver löpande bygga prospektlistor inför säljarbetet.",
      "Tidigare innebar det en lång manuell process. Först behövde rätt företag filtreras och kvalificeras, därefter öppnas ett efter ett för att information skulle kopieras och klistras mellan olika sidor och slutligen in i Excel.",
      "När hundratals eller tusentals leads skulle tas fram blev det snabbt många timmar av repetitiv research. Alternativet var att köpa färdiga listor – en lösning som istället blir kostsam över tid.",
    ],
    solution: [
      "Vi byggde ett automatiserat flöde i n8n som kapar bort det manuella arbetet mellan urval och färdig ringlista.",
      "Användaren filtrerar fram rätt företag i Allabolag, kopierar länken till resultatet och lägger den i ett Excel-ark. Med ett knapptryck bearbetas sedan listan automatiskt och resultatet levereras tillbaka i Excel.",
      "Istället för att manuellt öppna, kopiera och klistra information för varje företag får säljteamet en färdig lista och kan gå direkt till nästa steg: att börja ringa.",
    ],
    steps: [
      {
        label: "Filtrera",
        description:
          "Användaren filtrerar fram rätt bolag utifrån uppdragets kriterier.",
      },
      {
        label: "Lägg in",
        description:
          "Länken till sökresultatet läggs in i det befintliga Excel-flödet.",
      },
      {
        label: "Automatisera",
        description:
          "Med ett knapptryck hämtas och struktureras informationen automatiskt.",
      },
      {
        label: "Börja ringa",
        description:
          "Den färdiga listan öppnas i Excel och säljteamet kan börja arbeta direkt.",
      },
    ],
    metrics: [
      { value: "≈32h", unit: "", label: "Sparad tid per 1 000 leads" },
      { value: "2 min → 5 sek", unit: "", label: "Bearbetningstid per lead" },
      { value: "—", unit: "manuella steg", label: "Från prospektering till färdig ringlista" },
    ],
    nextSlug: "lead-lista",
  },
  {
    slug: "lead-lista",
    index: "02",
    company: "Observa Inkasso & Juridik",
    problem: "Automatisk research av befintlig data",
    category: "Research & Analys",
    description:
      "Lista med leads utan kontaktuppgifter, och AI-driven research som hittar information och fyller in det som saknas.",
    hook: "Från företagsnamn till färdig research på sekunder.",
    gradient: [
      "radial-gradient(ellipse 45% 55% at 15% 25%, rgba(90,20,8,0.95) 0%, rgba(90,20,8,0) 65%)",
      "radial-gradient(ellipse 60% 50% at 85% 45%, rgba(160,60,20,0.70) 0%, rgba(160,60,20,0) 60%)",
      "radial-gradient(ellipse 55% 60% at 50% 85%, rgba(200,90,30,0.55) 0%, rgba(200,90,30,0) 65%)",
      "radial-gradient(ellipse 40% 35% at 70% 12%, rgba(240,160,80,0.40) 0%, rgba(240,160,80,0) 60%)",
      "linear-gradient(140deg, #0C0402 0%, #2A0A04 30%, #6B2210 58%, #A84020 80%, #5A1A08 100%)",
    ].join(", "),
    challenge: [
      "Observa Inkasso & Juridik hade en omfattande lista med tiotusentals potentiella kunder – men underlaget bestod till stor del bara av företagsnamn.",
      "För att listan skulle kunna användas i säljarbetet behövde varje företag researchas och förädlas med bland annat hemsida, stad, om verksamheten riktade sig mot företag eller konsumenter samt vem som var ekonomichef.",
      "Att göra detta manuellt innebar att söka efter varje företag, kontrollera information från flera källor och sammanställa resultatet. Med flera minuters research per bolag blev arbetet snabbt väldigt tidskrävande i större volymer.",
    ],
    solution: [
      "Vi byggde ett AI-drivet researchflöde som automatiskt förädlar företagslistan steg för steg.",
      "Utifrån endast företagsnamnet genomför systemet research i tre separata AI-steg. Först identifieras rätt företag och dess domän. Därefter analyseras bolaget för att fastställa bland annat stad och om verksamheten är B2B eller B2C. Slutligen används den insamlade informationen för att identifiera rätt ekonomiansvarig.",
      "Resultatet skrivs tillbaka till listan och ger Observa ett betydligt mer komplett underlag utan att varje företag behöver researchas manuellt.",
    ],
    steps: [
      {
        label: "Identifiering",
        description:
          "Företagsnamnet används för att identifiera rätt bolag och hitta dess domän och hemsida.",
      },
      {
        label: "Bolagsresearch",
        description:
          "Nästa steg analyserar verksamheten och identifierar bland annat stad och om företaget arbetar B2B eller B2C.",
      },
      {
        label: "Beslutsfattare",
        description:
          "Ytterligare research genomförs för att identifiera företagets ekonomichef eller motsvarande beslutsfattare.",
      },
      {
        label: "Förädlad lista",
        description:
          "Den insamlade informationen struktureras och läggs tillbaka i listan, redo att användas vidare.",
      },
    ],
    metrics: [
      { value: "4 min → ~10 sek", unit: "", label: "Researchtid per företag" },
      { value: "≈96%", unit: "", label: "Kortare researchtid" },
      { value: "≈65h", unit: "", label: "Sparad tid per 1 000 företag" },
    ],
    nextSlug: "lead-engine",
  },
];

export function getCaseBySlug(slug: string): CaseData | undefined {
  return cases.find((c) => c.slug === slug);
}
