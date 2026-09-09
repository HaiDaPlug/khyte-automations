import type { Metadata } from "next";
import Link from "next/link";
import CalendlyButton from "@/components/CalendlyButton";
import FAQAccordion from "@/components/FAQAccordion";
import EspressoBand from "@/components/EspressoBand";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import JsonLd from "@/components/JsonLd";
import { faqPageSchema } from "@/data/faq";

export const metadata: Metadata = {
  title: "Tjänster – Automationer för svenska företag",
  description: "Vi automatiserar manuella processer. Transparent prissättning, fast pris, ingen vendor lock-in.",
  alternates: {
    canonical: "/tjanster",
  },
};

const faqs = [
  {
    q: "Varför ska vi betala för en förstudie?",
    a: "Förstudien är djup teknisk analys och design – inte ett försäljningssamtal. Vi går in i era system, kartlägger dataflöden, och ritar en exakt lösning. Det tar tid och kräver expertis. Beloppet ger er en konkret plan och ett fast pris för bygget."
  },
  {
    q: "Hur lång tid tar en implementation?",
    a: "Det beror på komplexitet. Små automationer kan vara klara på 2-3 veckor, större projekt tar 4-6 veckor. Vi ger er en tidsplan i förstudien så ni vet exakt vad som gäller."
  },
  {
    q: "Vad händer om det inte är värt att automatisera?",
    a: "Då säger vi det direkt. Vi säljer inte på er något som inte ger värde. Om ROI inte är tydlig eller processen är för komplex, är vi öppna med det redan i kvalificeringssamtalet."
  },
  {
    q: "Vilka system kan ni jobba med?",
    a: "De flesta moderna verktyg med API:er – CRM (HubSpot, Pipedrive), bokföring (Fortnox, Visma), e-post (Gmail, Outlook), databaser, och webbapplikationer. Om systemet har ett API eller kan skrapas, kan vi ofta integrera det."
  },
  {
    q: "Vad ingår efter leverans?",
    a: "Ni får dokumentation, utbildning för ert team, och en supportperiod där vi fixar buggar kostnadsfritt. Ni äger koden och kan drifta allt själva. Om ni vill ha löpande support senare kan vi diskutera det separat."
  },
  {
    q: "Kan vi bara köpa implementationen utan förstudie?",
    a: "Nej. Förstudien är avgörande för att förstå era system och ge ett fast pris. Utan den riskerar vi att bygga fel sak eller att kostnaderna spårar ur. Vi vill inte ta den risken – och ni bör inte heller göra det."
  },
  {
    q: "Hur mycket kostar det typiskt?",
    a: "Vi jobbar med fast pris från 15 000 kr, beroende på scope. Exakt pris bestäms i förstudien – så ni vet vad det kostar innan ni bestämmer er."
  },
  {
    q: "Vem äger automationen efteråt?",
    a: "Ni gör. All kod, all dokumentation, alla inloggningsuppgifter. Ni kan drifta, ändra, och vidareutveckla systemet själva. Ingen vendor lock-in."
  }
];

const domains = [
  { label: "Leads", desc: "Hämta och förädla data från Allabolag och andra källorna" },
  { label: "CRM", desc: "Synka och uppdatera poster mellan era system" },
  { label: "Uppföljning", desc: "Automatisk e-post research och uppföljning på leads" },
  { label: "Bokföring", desc: "Faktura- och bokföringsflöden som sköter sig själv" },
  { label: "Rapporter", desc: "Sammanställning och rapportgenerering från era data" },
  { label: "Monitoring", desc: "Automatiska alerts och notifikationer vid fel eller händelser" },
];

const steps = [
  {
    step: "01",
    title: "Kvalificeringssamtal (gratis)",
    desc: "Ett 15-minuters intro där vi diskuterar era flöden på hög nivå. Inga slides, ingen försäljning – vi avgör tillsammans om vi kan hjälpa er.",
  },
  {
    step: "02",
    title: "Förstudie (fast pris)",
    desc: "Vi går in i era system, kartlägger flöden, och designar den tekniska lösningen. Ni får en blueprint och ett fast pris för implementation. Priset diskuteras vid kontakt.",
  },
  {
    step: "03",
    title: "Implementation (fast pris efter förstudie)",
    desc: "Vi bygger automationen i iterationer. Ni godkänner varje milestone innan vi går vidare. Transparenta kostnader, inga överraskningar.",
  },
  {
    step: "04",
    title: "Överlämning & Drift",
    desc: "Vi tränar ert team, överlämnar dokumentation, och ger er full äganderätt. Ni får också en supportperiod där vi fixar eventuella buggar.",
  },
];

const priceFactors = [
  "Antal system och integrationspunkter",
  "Datakvalitet i era nuläge",
  "Antal steg i flödet",
  "Edge cases och undantagsfall",
  "Godkännandesteg och inblandade parter",
];

const included = [
  "Kickoff och scope-definition",
  "Byggande av automationen",
  "Testing och quality check",
  "Grundläggande logging och synlighet",
  "Dokumentation",
  "Kort supportfönster efter leverans",
];

const supportItems = [
  "Justeringar när er process ändras",
  "Felsökning om något stannar upp",
  "Små förbättringar baserade på verklig användning",
  "Månatlig avstämning och grundläggande monitoring",
  "Dokumentationsuppdateringar vid ändrat flöde",
  "Mindre tillägg kan göras vid behov",
];

const results = [
  {
    num: "5–20h",
    unit: "/ vecka",
    body: "Sparade timmar per automation, beroende på process och volym.",
  },
  {
    num: "Färre fel",
    unit: null,
    body: "Automation följer regler konsekvent, men resultaten beror på datakvalitet.",
  },
  {
    num: "2–6",
    unit: "veckor",
    body: "Från förstudie till drift, beroende på komplexitet och integrationskrav.",
  },
];

export default function ServicesPage() {
  return (
    <main>

      {/* 1. HERO */}
      <section className="pt-32 md:pt-40">
        <div className="max-w-[1100px] mx-auto px-6">
          <PageHeader
            divider
            line1="VÅRA"
            line2="TJÄNSTER."
            intro="Vi bygger automationer som tar hand av manuellt arbete. Ni äger koden, ni bestämmer takten."
          />
        </div>
      </section>

      {/* 2. VAD VI AUTOMATISERAR */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="mb-10">
            <SectionHeading
              line1="VAD VI"
              line2="AUTOMATISERAR."
              intro="Typ av processer vi brukar ta hand av."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {domains.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl bg-transparent p-8 border border-[var(--color-border)] transition-colors duration-300 hover:border-[rgba(58,51,48,0.28)]"
              >
                <p className="text-label mb-2">{item.label}</p>
                <p className="text-[15px] font-medium text-[var(--color-text-body)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SÅ JOBBAR VI */}
      <section id="sa-jobbar-vi" className="border-t border-[var(--color-border)] py-16 md:py-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="mb-10">
            <SectionHeading
              line1="SÅ"
              line2="JOBBAR VI."
              intro="Vi tar ett projekt i taget. Inga parallella uppdrag, inga halv-implementationer. Er automation får full fokus från start till mål."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl bg-transparent p-8 lg:p-10 border border-[var(--color-border)]"
              >
                <span className="block font-display text-[2.5rem] leading-none tracking-wide text-[var(--color-accent)]">
                  {item.step}
                </span>
                <h3 className="text-lg md:text-xl font-semibold tracking-[-0.02em] text-[var(--color-text)] leading-[1.2] mt-6 mb-3">
                  {item.title}
                </h3>
                <p className="text-base font-medium text-[var(--color-text-body)] leading-relaxed max-w-[46ch]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SKRÄDDARSYDD AUTOMATION — pris, vad ingår, support */}
      <section className="border-t border-[var(--color-border)] py-16 md:py-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="mb-10">
            <SectionHeading
              line1="SKRÄDDARSYDD"
              line2="AUTOMATION."
              intro="Vi bygger, integrar och levererar automationer anpassade till era system och flöden. Alltid ett projekt i taget – alltid skräddarsydda, alltid med fast pris."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Price */}
            <div className="rounded-2xl bg-transparent p-8 lg:p-10 border border-[rgba(58,51,48,0.28)]">
              <div className="font-display text-[2rem] md:text-[2.5rem] leading-none tracking-[-0.01em] text-[var(--color-text)]">
                15 000+ kr
              </div>
              <p className="text-[15px] font-medium text-[var(--color-text-body)] mt-3">
                Fast pris efter scope
              </p>

              <p className="text-label text-[var(--color-muted)] mt-8 mb-4">Vad som påverkar priset</p>
              <ul className="flex flex-col gap-3">
                {priceFactors.map((item) => (
                  <li
                    key={item}
                    className="border-l border-[var(--color-border)] pl-4 text-[15px] font-medium text-[var(--color-text-body)] leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* What's included */}
            <div className="rounded-2xl bg-transparent p-8 lg:p-10 border border-[var(--color-border)] flex flex-col">
              <p className="text-label text-[var(--color-muted)] mb-4">Vad ingår</p>
              <ul className="flex flex-col gap-3">
                {included.map((item) => (
                  <li
                    key={item}
                    className="border-l border-[var(--color-border)] pl-4 text-[15px] font-medium text-[var(--color-text-body)] leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <CalendlyButton variant="primary">Diskutera ert projekt</CalendlyButton>
              </div>
            </div>
          </div>

          {/* Support — secondary, deliberately quieter */}
          <div className="mt-3 rounded-2xl bg-transparent p-8 lg:p-10 border border-[var(--color-border)]">
            <div className="flex flex-col lg:flex-row lg:gap-16">
              <div className="lg:w-[38%] shrink-0">
                <h3 className="text-lg md:text-xl font-semibold tracking-[-0.02em] text-[var(--color-text)] leading-[1.2] mb-3">
                  Support &amp; förbättring
                  <span className="font-medium text-[var(--color-muted)]"> (valfritt)</span>
                </h3>
                <p className="text-[15px] font-medium text-[var(--color-text-body)] leading-relaxed">
                  Efter leverans kan ni köra själva — eller så hjälper vi er hålla flödet stabilt och göra små förbättringar när processen ändras.
                </p>
                <p className="text-sm font-medium text-[var(--color-muted)] leading-relaxed mt-4">
                  Prissätts efter leverans beroende på omfattning — vi sätter ett fast månadsbelopp efter en kort avstämning.
                </p>
                <Link
                  href="/kontakt"
                  className="inline-block mt-4 text-[var(--color-muted)] hover:text-[var(--color-text)] text-base underline underline-offset-4 transition-colors"
                >
                  Prata om support
                </Link>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-8 lg:mt-0 flex-1">
                {supportItems.map((item) => (
                  <li
                    key={item}
                    className="border-l border-[var(--color-border)] pl-4 text-[15px] font-medium text-[var(--color-text-body)] leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RESULTAT — dark band */}
      <EspressoBand>
        <div className="relative z-10 max-w-[1100px] mx-auto px-6 py-20 md:py-28">
          <div className="mb-12 md:mb-16">
            <SectionHeading
              tone="dark"
              line1="VAD NI"
              line2="BRUKAR FÅ."
              intro="Typiska resultat. Alla siffror beror på er specifika process – vi är alltid öppna med vad som är realistiskt."
            />
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {results.map(({ num, unit, body }) => (
              <li key={num} className="border-l border-white/10 pl-8">
                <div className="flex items-baseline flex-wrap gap-3 mb-3">
                  <span className="font-display text-4xl md:text-5xl leading-none tracking-wide uppercase text-white">
                    {num}
                  </span>
                  {unit && (
                    <span className="text-sm text-white/70 uppercase tracking-widest">{unit}</span>
                  )}
                </div>
                <p className="text-base text-white/70 leading-relaxed max-w-[40ch]">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </EspressoBand>

      {/* 6. FAQ */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="mb-10">
            <SectionHeading line1="VANLIGA" line2="FRÅGOR." />
          </div>

          <FAQAccordion items={faqs} />
          <JsonLd data={faqPageSchema(faqs)} />
        </div>
      </section>

    </main>
  );
}
