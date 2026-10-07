import type { Metadata } from "next";
import Link from "next/link";
import CalendlyButton from "@/components/CalendlyButton";
import CaseList from "@/components/CaseList";
import FAQAccordion from "@/components/FAQAccordion";
import EspressoBand from "@/components/EspressoBand";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import ServiceAreas from "@/components/sections/ServiceAreas";
import JsonLd from "@/components/JsonLd";
import { faqPageSchema } from "@/data/faq";
import { cases } from "@/data/cases";
import { facts } from "@/data/facts";

export const metadata: Metadata = {
  title: "Tjänster och priser – automation, AI och egna system",
  description: `Automatiserade flöden, AI, egna system och rådgivning för svenska företag. Fast pris från ${facts.priceFrom} ${facts.priceVat} efter kartläggning. Ni äger allt vi bygger.`,
  alternates: {
    canonical: "/tjanster",
  },
};

/*
 * /tjanster is the short hub: what we solve, how we work, what it costs, and
 * proof. Depth about each service lives on its own subpage (src/data/services.ts),
 * so nothing here should grow into a service description.
 *
 * Section anchors are link targets from service pages; don't rename them.
 */

const faqs = [
  {
    q: "Kostar kartläggningen något?",
    a: "Nej. Kartläggningen är kostnadsfri. Vi går igenom ert behov och tar fram underlaget för en offert med tydlig omfattning och ett fast pris. Ni väljer sedan om ni vill gå vidare med bygget."
  },
  {
    q: "Hur lång tid tar det?",
    a: `Det beror på komplexiteten. Mindre automationer är ofta klara på ${facts.delivery.small}, större system tar ${facts.delivery.large}. Ni får en tidsplan i kartläggningen, så att ni vet exakt vad som gäller.`
  },
  {
    q: "Vad påverkar priset?",
    a: "Hur många system och steg flödet har, hur datan ser ut idag, vilka undantag som måste hanteras och vilka som ska godkänna på vägen. Allt det går vi igenom i kartläggningen, innan ni får ett fast pris."
  },
  {
    q: "Vilka system kan ni jobba med?",
    a: "De flesta moderna verktyg med API:er: CRM (HubSpot, Pipedrive), bokföring (Fortnox, Visma), e-post (Gmail, Outlook), databaser och webbapplikationer. Om systemet har ett API eller kan skrapas kan vi ofta integrera det."
  },
  {
    q: "Vad ingår efter leverans?",
    a: "Dokumentation och en genomgång med ert team. Vilken support och felrättning som ingår i bygget står i offerten. Efter leverans kan vi sköta hosting, underhåll och löpande support till ett fast månadspris utifrån lösningens omfattning, utan bindningstid."
  },
  {
    q: "Kan vi köpa bara rådgivning?",
    a: "Ja. Rådgivning är en egen tjänst, utan krav på att vi bygger något efteråt. Ni får en tydlig bild av var det finns tid att spara, och väljer sedan själva om och hur ni vill gå vidare."
  },
];

const steps = [
  {
    title: "Introsamtal",
    meta: `Kostnadsfritt · ${facts.introCall.minutes} min`,
    desc: "Vi går igenom era flöden och avgör tillsammans om vi kan hjälpa er.",
  },
  {
    title: "Kartläggning",
    meta: "Kostnadsfri",
    desc: "Vi går igenom arbetsflödet, klargör vad lösningen behöver göra och tar fram en offert med omfattning, tidsplan och ett fast pris för bygget.",
  },
  {
    title: "Implementering",
    meta: "Fast pris",
    desc: "Vi bygger i steg, och ni godkänner varje del innan vi går vidare.",
  },
  {
    title: "Överlämning",
    meta: "Ingår",
    desc: "Dokumentation, en genomgång med ert team och full äganderätt.",
  },
];

const terms = [
  {
    num: facts.priceFrom,
    unit: "från",
    body: `För bygget, ${facts.priceVat}. Exakt pris sätts i kartläggningen, utifrån hur många system, steg och undantag flödet har.`,
  },
  {
    num: facts.delivery.small,
    unit: null,
    body: `För mindre automationer, från kartläggning till drift. Större system tar ${facts.delivery.large}.`,
  },
  {
    num: "Er kod",
    unit: null,
    body: "Ni äger koden, all data och alla inloggningar. Ingen vendor lock-in.",
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
          >
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <CalendlyButton variant="primary">
                Boka ett intro ({facts.introCall.minutes} min)
              </CalendlyButton>
              <Link
                href="#case"
                className="text-[var(--color-muted)] hover:text-[var(--color-text)] text-base underline underline-offset-4 transition-colors"
              >
                Se vad vi har byggt
              </Link>
            </div>
          </PageHeader>
        </div>
      </section>

      {/* 2. VAD VI LÖSER — also the menu into the service pages */}
      <section id="vad-vi-loser" className="scroll-mt-28 py-16 md:py-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="mb-10">
            <SectionHeading line1="VAD VI" line2="LÖSER." intro="Det vi oftast tar hand om." />
          </div>

          <ServiceAreas />
        </div>
      </section>

      {/* 3. SÅ JOBBAR VI */}
      <section id="sa-jobbar-vi" className="scroll-mt-28 border-t border-[var(--color-border)] py-16 md:py-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="mb-10">
            <SectionHeading
              line1="SÅ"
              line2="JOBBAR VI."
              intro="Ett projekt i taget. Ni vet priset innan något byggs."
            />
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t border-[var(--color-border)] pt-6">
                <span className="block font-display text-[2rem] leading-none tracking-wide text-[var(--color-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg md:text-xl font-semibold tracking-[-0.02em] leading-[1.2] text-[var(--color-text)]">
                  {s.title}
                </h3>
                <p className="mt-1 text-[13px] font-bold tracking-[0.05em] uppercase text-[var(--color-muted)]">
                  {s.meta}
                </p>
                <p className="mt-3 text-[15px] font-medium leading-relaxed text-[var(--color-text-body)]">
                  {s.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. VAD DET KOSTAR — price, delivery and ownership in one band */}
      <EspressoBand>
        <div id="vad-det-kostar" className="scroll-mt-28 relative z-10 max-w-[1100px] mx-auto px-6 py-20 md:py-28">
          <div className="mb-12 md:mb-16">
            <SectionHeading
              tone="dark"
              line1="VAD DET"
              line2="KOSTAR."
              intro="Samma upplägg oavsett vad vi bygger."
            />
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {terms.map(({ num, unit, body }) => (
              <li key={num} className="border-l border-white/10 pl-8">
                <div className="flex items-baseline flex-wrap gap-3 mb-3">
                  {unit && (
                    <span className="text-sm text-white/70 uppercase tracking-widest">{unit}</span>
                  )}
                  <span className="font-display text-4xl md:text-5xl leading-none tracking-wide uppercase text-white">
                    {num}
                  </span>
                </div>
                <p className="text-base text-white/70 leading-relaxed max-w-[40ch]">{body}</p>
              </li>
            ))}
          </ul>

          <p className="mt-12 md:mt-16 border-t border-white/10 pt-8 text-base text-white/70 leading-relaxed max-w-[72ch]">
            Ingår alltid: dokumentation och en genomgång med ert team. Vilken support och felrättning som
            ingår i bygget står i offerten. Efter leverans kan vi sköta hosting, underhåll och löpande support
            till ett fast månadspris utifrån lösningens omfattning, utan bindningstid.
          </p>
        </div>
      </EspressoBand>

      {/* 5. CASE — proof. Reads cases.ts, so a new case shows up here untouched. */}
      <section id="case" className="scroll-mt-28 py-16 md:py-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="mb-10">
            <SectionHeading
              line1="DET HÄR HAR"
              line2="VI BYGGT."
              intro="Verkliga projekt. Vad problemet var, vad vi byggde och vad det gav."
            />
          </div>

          <CaseList items={cases} />

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

      {/* 6. FAQ */}
      <section id="vanliga-fragor" className="scroll-mt-28 border-t border-[var(--color-border)] py-16 md:py-20">
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
