import type { Metadata } from "next";
import Link from "next/link";
import CalendlyButton from "@/components/CalendlyButton";
import FAQAccordion from "@/components/FAQAccordion";
import EspressoBand from "@/components/EspressoBand";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import JsonLd from "@/components/JsonLd";
import { faqPageSchema } from "@/data/faq";
import { cases } from "@/data/cases";

export const metadata: Metadata = {
  title: "Tjänster och priser – automation, AI och egna system",
  description: "Automatiserade flöden, AI och skräddarsydda system för svenska företag. Fast pris från 15 000 kr efter kartläggning. Ni äger allt vi bygger.",
  alternates: {
    canonical: "/tjanster",
  },
};

const faqs = [
  {
    q: "Varför ska vi betala för en kartläggning?",
    a: "Kartläggningen är riktigt arbete, inte ett säljsamtal. Vi går in i era system, kartlägger dataflödena och ritar upp en exakt lösning. Det tar tid och kräver expertis. Ni får en konkret plan och ett fast pris för bygget."
  },
  {
    q: "Hur lång tid tar en implementation?",
    a: "Det beror på komplexiteten. Mindre automationer är ofta klara på 1–2 veckor, större system tar 4–6 veckor. Ni får en tidsplan i kartläggningen, så att ni vet exakt vad som gäller."
  },
  {
    q: "Vad händer om det inte är värt att automatisera?",
    a: "Då säger vi det direkt. Vi säljer inte på er något som inte ger värde. Om ROI inte är tydlig eller processen är för komplex är vi öppna med det redan i introsamtalet."
  },
  {
    q: "Vilka system kan ni jobba med?",
    a: "De flesta moderna verktyg med API:er: CRM (HubSpot, Pipedrive), bokföring (Fortnox, Visma), e-post (Gmail, Outlook), databaser och webbapplikationer. Om systemet har ett API eller kan skrapas kan vi ofta integrera det."
  },
  {
    q: "Vad ingår efter leverans?",
    a: "Ni får dokumentation, utbildning för ert team och en supportperiod där vi fixar buggar kostnadsfritt. Ni äger koden och kan drifta allt själva. Om ni vill ha löpande support senare kan vi diskutera det separat."
  },
  {
    q: "Kan vi bara köpa implementationen utan kartläggning?",
    a: "Nej. Kartläggningen behövs för att förstå era system och kunna ge ett fast pris. Utan den riskerar vi att bygga fel sak eller att kostnaderna drar iväg. Den risken vill vi inte ta, och det ska inte ni heller."
  },
  {
    q: "Hur mycket kostar det typiskt?",
    a: "Vi jobbar med fast pris från 15 000 kr, beroende på omfattning. Exakt pris bestäms i kartläggningen, så ni vet vad det kostar innan ni bestämmer er."
  },
  {
    q: "Vem äger automationen efteråt?",
    a: "Det gör ni. All kod, all dokumentation och alla inloggningsuppgifter. Ni kan drifta, ändra och vidareutveckla systemet själva. Ingen vendor lock-in."
  }
];

const domains = [
  { label: "Leads", desc: "Hämta och förädla data från Allabolag och andra källor" },
  { label: "CRM", desc: "Synka och uppdatera poster mellan era system" },
  { label: "Uppföljning", desc: "Automatisk research och uppföljning av leads via e-post" },
  { label: "Bokföring", desc: "Faktura- och bokföringsflöden som sköter sig själva" },
  { label: "Rapporter", desc: "Sammanställning och rapportgenerering från era data" },
  { label: "Monitoring", desc: "Automatiska alerts och notifikationer vid fel eller händelser" },
];

const steps = [
  {
    step: "01",
    title: "Introsamtal (gratis)",
    desc: "Ett intro på 30 minuter där vi går igenom era flöden på hög nivå. Inga slides och ingen säljpitch. Vi avgör tillsammans om vi kan hjälpa er.",
  },
  {
    step: "02",
    title: "Kartläggning (fast pris)",
    desc: "Vi går in i era system, kartlägger flödena och designar den tekniska lösningen. Ni får en plan, en tidsplan och ett fast pris för bygget. Priset för kartläggningen tar vi i introsamtalet.",
  },
  {
    step: "03",
    title: "Implementation (fast pris efter kartläggning)",
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
  "Datakvaliteten i era system idag",
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
    // Measured in a real case, not a sitewide estimate — hours saved is only
    // ever stated where it was measured (docs/SEO_AUDIT.md, Decisions).
    num: "≈65h",
    unit: "per 1 000 företag",
    body: "Sparad researchtid hos Observa Inkasso & Juridik, där researchen gick från 4 minuter till 10 sekunder per företag.",
  },
  {
    num: "Färre fel",
    unit: null,
    body: "Automation följer regler konsekvent, men resultaten beror på datakvalitet.",
  },
  {
    num: "1–2",
    unit: "veckor",
    body: "Från kartläggning till drift för mindre automationer. Större system tar 4–6 veckor.",
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
            line1="TJÄNSTER"
            line2="OCH PRISER."
            intro="Vi tar bort manuellt arbete som återkommer varje vecka, med automatiserade flöden, AI eller ett system byggt för just er verksamhet. Ni äger koden, ni bestämmer takten."
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
              intro="Processer vi ofta tar hand om."
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
              intro="Vi tar ett projekt i taget. Inga parallella uppdrag, inga halv-implementationer. Er automation får fullt fokus från start till mål."
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

      {/* 4. VAD DET KOSTAR — pris, vad ingår, support */}
      <section className="border-t border-[var(--color-border)] py-16 md:py-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="mb-10">
            <SectionHeading
              line1="VAD DET"
              line2="KOSTAR."
              intro="Allt vi bygger anpassas efter era system och flöden. Ni får ett fast pris efter kartläggningen, innan något byggs."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Price */}
            <div className="rounded-2xl bg-transparent p-8 lg:p-10 border border-[rgba(58,51,48,0.28)]">
              <div className="font-display text-[2rem] md:text-[2.5rem] leading-none tracking-[-0.01em] text-[var(--color-text)]">
                15 000+ kr
              </div>
              <p className="text-[15px] font-medium text-[var(--color-text-body)] mt-3">
                Fast pris efter kartläggning
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
                  Efter leverans kan ni köra själva. Eller så hjälper vi er att hålla flödet stabilt och göra små förbättringar när processen ändras.
                </p>
                <p className="text-sm font-medium text-[var(--color-muted)] leading-relaxed mt-4">
                  Prissätts efter leverans beroende på omfattning. Vi sätter ett fast månadsbelopp efter en kort avstämning.
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
              intro="Siffror från verkliga projekt och vad som brukar gälla. Resultatet beror alltid på er process, och vi är öppna med vad som är realistiskt."
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

      {/* 6. CASE — bevis efter löftena ovan. Läser från cases.ts, så ett nytt
          case dyker upp här utan att sidan behöver röras. */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="mb-10">
            <SectionHeading
              line1="DET HÄR HAR"
              line2="VI BYGGT."
              intro="Verkliga projekt. Vad problemet var, vad vi byggde och vad det gav."
            />
          </div>

          <ul className="border-t border-[var(--color-border)]">
            {cases.map((c) => (
              <li key={c.slug} className="border-b border-[var(--color-border)]">
                <Link
                  href={`/case/${c.slug}`}
                  className="group grid grid-cols-[2.75rem_1fr_auto] md:grid-cols-[3.5rem_13rem_1fr_auto] lg:grid-cols-[4rem_16rem_1fr_auto] items-baseline gap-x-4 md:gap-x-8 gap-y-1 py-6 md:py-7"
                >
                  <span className="col-start-1 row-start-1 font-display text-[1.75rem] leading-none tracking-wide text-[var(--color-accent)]">
                    {c.index}
                  </span>
                  <span className="col-start-2 row-start-1 text-lg md:text-xl font-semibold tracking-[-0.02em] leading-[1.2] text-[var(--color-text)] transition-colors duration-300 group-hover:text-[#D4622B]">
                    {c.company}
                  </span>
                  <span className="col-start-2 row-start-2 md:col-start-3 md:row-start-1 text-base font-medium leading-relaxed text-[var(--color-text-body)]">
                    {c.problem}
                  </span>
                  <svg
                    className="col-start-3 row-start-1 md:col-start-4 self-center text-[var(--color-text)] transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-[#D4622B]"
                    width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/case"
            className="mt-8 inline-flex items-center gap-2 font-display text-sm font-bold tracking-[0.18em] uppercase text-[var(--color-text)] hover:text-[#D4622B] transition-colors duration-300"
          >
            ALLA CASE
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="border-t border-[var(--color-border)] py-16 md:py-20">
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
