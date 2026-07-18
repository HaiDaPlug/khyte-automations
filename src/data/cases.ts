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
  challenge: string;
  solution: string;
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
      "Automatiserat flöde som identifierar, kvalificerar och levererar varma leads direkt till säljarnas arbetsyta. Utan manuellt arbete.",
    hook: "Säljteamet öppnar ett Sheet. Listan är redan där.",
    gradient: [
      "radial-gradient(ellipse 55% 60% at 78% 18%, rgba(255,235,185,0.72) 0%, rgba(255,235,185,0) 65%)",
      "radial-gradient(ellipse 70% 65% at 28% 52%, rgba(212,98,43,0.90) 0%, rgba(212,98,43,0) 62%)",
      "radial-gradient(ellipse 50% 55% at 8% 88%, rgba(27,8,3,0.88) 0%, rgba(27,8,3,0) 58%)",
      "radial-gradient(ellipse 60% 50% at 18% 10%, rgba(232,131,58,0.65) 0%, rgba(232,131,58,0) 60%)",
      "linear-gradient(145deg, #7A3A18 0%, #C46020 35%, #E8A050 58%, #F5D8A0 80%, #C87030 100%)",
    ].join(", "),
    challenge:
      "JaTack AB säljer listor och lösningar inom fastighetsdata. Varje nytt prospekteringsuppdrag krävde timmar av manuell research: identifiera rätt bolag, hitta beslutsfattare, samla in kontaktuppgifter och flytta allt till ett kalkylblad. Repetitivt, dyrt och lätt att göra fel.",
    solution:
      "Vi byggde ett automatiserat prospekteringsflöde i n8n. Varje morgon identifierar systemet nya målföretag baserat på JaTacks ICP-kriterier, berikar med kontaktdata, kvalificerar mot säljkriteria och levererar en färdig, sorterad lista direkt till deras befintliga Google Sheet. Redo att ringas.",
    steps: [
      {
        label: "Scraping & identifiering",
        description:
          "Systemet söker igenom rätt databaser baserat på bransch, storlek och geografi.",
      },
      {
        label: "Berikning",
        description:
          "Kontaktuppgifter, bolagsstatus och beslutsfattare hämtas automatiskt.",
      },
      {
        label: "Kvalificering",
        description:
          "AI filtrerar bort leads som inte matchar ICP-kriterierna.",
      },
      {
        label: "Leverans",
        description:
          "Färdiga leads hamnar i rätt Sheet, formaterade och redo att ringas.",
      },
    ],
    metrics: [
      { value: "12h", unit: "/vecka", label: "Sparad tid per säljare" },
      { value: "3×", unit: "mer", label: "Kvalificerade leads i pipeline" },
      { value: "0", unit: "manuella steg", label: "Från identifiering till leverans" },
    ],
    testimonial: {
      quote:
        "Vi spenderade en oproportionerlig del av säljtiden på att hitta vem vi skulle ringa. Nu är listan klar när vi sätter oss vid datorn.",
      name: "Sebastian Andersson",
      role: "Säljansvarig, JaTack AB",
    },
    nextSlug: "lead-lista",
  },
  {
    slug: "lead-lista",
    index: "02",
    company: "Observa Inkasso & Juridik",
    problem: "Automatisk research av befintlig data",
    category: "Research & Analys",
    description:
      "AI-driven research som scrapar, filtrerar och sammanställer företagsprofiler med kontaktuppgifter. Helt utan mänsklig hand.",
    hook: "Research som tog en fredag görs nu på ett par minuter.",
    gradient: [
      "radial-gradient(ellipse 45% 55% at 15% 25%, rgba(90,20,8,0.95) 0%, rgba(90,20,8,0) 65%)",
      "radial-gradient(ellipse 60% 50% at 85% 45%, rgba(160,60,20,0.70) 0%, rgba(160,60,20,0) 60%)",
      "radial-gradient(ellipse 55% 60% at 50% 85%, rgba(200,90,30,0.55) 0%, rgba(200,90,30,0) 65%)",
      "radial-gradient(ellipse 40% 35% at 70% 12%, rgba(240,160,80,0.40) 0%, rgba(240,160,80,0) 60%)",
      "linear-gradient(140deg, #0C0402 0%, #2A0A04 30%, #6B2210 58%, #A84020 80%, #5A1A08 100%)",
    ].join(", "),
    challenge:
      "Observa hade en stor befintlig lista med kunder och potentiella kunder. Problemet: listan var inaktuell. Att manuellt gå igenom varje post, kontrollera bolagsstatus, hitta rätt beslutsfattare, uppdatera kontaktuppgifter, tog en hel arbetsdag varje gång listan behövde ses över.",
    solution:
      "Vi byggde en AI-driven research-pipeline i n8n. Systemet tar in deras befintliga lista, hämtar aktuell bolagsdata för varje post, låter AI filtrera bort inaktiva och irrelevanta bolag, och levererar en ren, uppdaterad lista med validerade kontaktuppgifter. Automatiskt.",
    steps: [
      {
        label: "Inläsning",
        description:
          "Befintlig lista importeras till flödet — CSV, Sheet eller direkt från CRM.",
      },
      {
        label: "Berikning",
        description:
          "Aktuell bolagsstatus, ekonomi och beslutsfattare hämtas per post.",
      },
      {
        label: "AI-filtrering",
        description:
          "Inaktiva, konkursade eller irrelevanta bolag sorteras bort automatiskt.",
      },
      {
        label: "Export",
        description:
          "Ren, uppdaterad lista med kontaktuppgifter exporteras i valt format.",
      },
    ],
    metrics: [
      { value: "8 min", unit: "per 100", label: "Mot en halv dag manuellt" },
      { value: "1 dag", unit: "/vecka", label: "Frigjord tid per researcher" },
      { value: "94%", unit: "träffsäkerhet", label: "På kontaktuppgifter" },
    ],
    nextSlug: "lead-engine",
  },
];

export function getCaseBySlug(slug: string): CaseData | undefined {
  return cases.find((c) => c.slug === slug);
}
