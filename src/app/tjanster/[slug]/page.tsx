import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CalendlyButton from "@/components/CalendlyButton";
import CaseList from "@/components/CaseList";
import EspressoBand from "@/components/EspressoBand";
import FAQAccordion from "@/components/FAQAccordion";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import ServiceExamples from "@/components/sections/ServiceExamples";
import { facts } from "@/data/facts";
import { faqPageSchema } from "@/data/faq";
import { casesForService, getServiceBySlug, services } from "@/data/services";

type Params = { slug: string };

// Only the services in services.ts exist; anything else under /tjanster/ 404s.
export const dynamicParams = false;

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getServiceBySlug(slug);
  if (!s) return {};
  // No openGraph here: the layout's siteName/locale/image apply, and Next fills
  // og:title / og:description from this page's own title and description.
  return {
    title: s.seoTitle,
    description: s.metaDescription,
    alternates: { canonical: `/tjanster/${slug}` },
  };
}

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const proof = casesForService(service);
  const url = `${facts.url}/tjanster/${service.slug}`;

  // Example-led pages (Automatisering) and the older problems/builds layout
  // (Egna system) share this template until every service has moved over.
  const exampleLed = Boolean(service.examples);

  // Example-led pages: how a build goes, in three steps. No prices: build
  // prices aren't shown on the site (owner, 2026-10-09).
  const steps = [
    {
      title: "Introsamtal",
      meta: `Kostnadsfritt · ${facts.introCall.minutes} min`,
      desc: "Vi hör hur ni jobbar och om vi kan hjälpa till.",
    },
    {
      title: "Kartläggning",
      meta: "Kostnadsfri",
      desc: "Vi går igenom flödet och ger er en offert med omfattning, tidsplan och fast pris.",
    },
    {
      title: "Bygge",
      meta: "Fast pris",
      desc: `Vi bygger i steg och ni godkänner varje del. Mindre lösningar är ofta i drift inom ${facts.delivery.small}.`,
    },
  ];

  // Older layout: process and terms are owned by /tjanster. This band only
  // summarises them, from facts.ts, and links up to the full version.
  const terms = [
    {
      num: "Kostnadsfritt",
      body: "Introsamtal och kartläggning är kostnadsfria. Ni får en offert med omfattning, tidsplan och fast pris innan ni bestämmer er.",
    },
    {
      num: facts.delivery.large,
      body: `Från kartläggning till drift för större system. Mindre lösningar är ofta klara på ${facts.delivery.small}.`,
    },
    {
      num: "Er kod",
      body: "Ni äger koden, all data och alla inloggningar. Ni kan drifta och bygga vidare själva.",
    },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: service.name,
      description: service.metaDescription,
      url,
      provider: { "@id": `${facts.url}/#organization` },
      areaServed: { "@type": "Country", name: "Sverige" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Hem", item: facts.url },
        { "@type": "ListItem", position: 2, name: "Tjänster", item: `${facts.url}/tjanster` },
        { "@type": "ListItem", position: 3, name: service.name, item: url },
      ],
    },
    faqPageSchema(service.faqs),
  ];

  return (
    <main>
      <JsonLd data={structuredData} />

      {/* 1. HERO */}
      <section className="pt-32 md:pt-40">
        <div className="max-w-[1100px] mx-auto px-6">
          <nav aria-label="Brödsmulor" className="mb-6">
            {/* .text-label sets its own colour and wins over a colour utility on
                the same element, so colours go on the items, not the list. */}
            <ol className="flex items-center gap-2 text-label">
              <li>
                <Link href="/tjanster" className="hover:text-[#D4622B] transition-colors duration-200">
                  Tjänster
                </Link>
              </li>
              <li aria-hidden="true" className="text-[var(--color-muted)]">/</li>
              <li aria-current="page" className="text-[var(--color-muted)]">{service.name}</li>
            </ol>
          </nav>

          <PageHeader
            divider
            line1={service.heading.line1}
            line2={service.heading.line2}
            intro={service.intro}
          >
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <CalendlyButton variant="primary">
                Boka ett intro ({facts.introCall.minutes} min)
              </CalendlyButton>
              <Link
                href={exampleLed ? "#exempel" : "#case"}
                className="text-[var(--color-muted)] hover:text-[var(--color-text)] text-base underline underline-offset-4 transition-colors"
              >
                {exampleLed ? "Se exempel" : "Se vad vi har byggt"}
              </Link>
            </div>
          </PageHeader>
        </div>
      </section>

      {exampleLed ? (
        <>
          {/* 2. EXEMPEL — a grid of cards; the scenes only illustrate */}
          <section id="exempel" className="scroll-mt-28 py-16 md:py-24">
            <div className="max-w-[1100px] mx-auto px-6">
              {service.examplesHeading && (
                <div className="mb-12 md:mb-14">
                  <SectionHeading
                    line1={service.examplesHeading.line1}
                    line2={service.examplesHeading.line2}
                    intro={service.examplesIntro}
                  />
                </div>
              )}

              <ServiceExamples service={service} />
            </div>
          </section>

          {/* 3. SÅ GÅR DET TILL — three steps, the same strip as /tjanster */}
          <section id="sa-gar-det-till" className="scroll-mt-28 border-t border-[var(--color-border)] py-16 md:py-20">
            <div className="max-w-[1100px] mx-auto px-6">
              <div className="mb-10">
                <SectionHeading line1="SÅ GÅR" line2="DET TILL." />
              </div>

              <ol className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-10">
                {steps.map((step, i) => (
                  <li key={step.title} className="border-t border-[var(--color-border)] pt-6">
                    <span className="block font-display text-[2rem] leading-none tracking-wide text-[var(--color-accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 text-lg md:text-xl font-semibold tracking-[-0.02em] leading-[1.2] text-[var(--color-text)]">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-[13px] font-bold tracking-[0.05em] uppercase text-[var(--color-muted)]">
                      {step.meta}
                    </p>
                    <p className="mt-3 text-[15px] font-medium leading-relaxed text-[var(--color-text-body)]">
                      {step.desc}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* 2. NÄR BEHÖVS ETT EGET SYSTEM */}
          <section id="nar-behovs" className="scroll-mt-28 py-16 md:py-20">
            <div className="max-w-[1100px] mx-auto px-6">
              <div className="mb-10">
                <SectionHeading
                  line1="NÄR BEHÖVS"
                  line2="ETT EGET SYSTEM?"
                  intro="Tre lägen där vi oftast bygger ett."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(service.problems ?? []).map((p) => (
                  <div
                    key={p.title}
                    className="rounded-2xl bg-transparent p-8 border border-[var(--color-border)] transition-colors duration-300 hover:border-[rgba(58,51,48,0.28)]"
                  >
                    <h3 className="text-lg md:text-xl font-semibold tracking-[-0.02em] text-[var(--color-text)] leading-[1.2] mb-3">
                      {p.title}
                    </h3>
                    <p className="text-[15px] font-medium text-[var(--color-text-body)] leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. VAD VI BYGGER */}
          <section id="vad-vi-bygger" className="scroll-mt-28 border-t border-[var(--color-border)] py-16 md:py-20">
            <div className="max-w-[1100px] mx-auto px-6">
              <div className="mb-10">
                <SectionHeading
                  line1="VAD VI"
                  line2="BYGGER."
                  intro="Varje system byggs för er, men av delar vi redan vet fungerar: inloggning, kalender, filimport och utskick. Ni får något som passar, utan att vi uppfinner hjulet varje gång."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(service.builds ?? []).map((b, i) => (
                  <div
                    key={b.title}
                    className="rounded-2xl bg-transparent p-8 lg:p-10 border border-[var(--color-border)]"
                  >
                    <span className="block font-display text-[2.5rem] leading-none tracking-wide text-[var(--color-accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg md:text-xl font-semibold tracking-[-0.02em] text-[var(--color-text)] leading-[1.2] mt-6 mb-3">
                      {b.title}
                    </h3>
                    <p className="text-base font-medium text-[var(--color-text-body)] leading-relaxed">
                      {b.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. CASE — the proof, from services.ts → cases.ts */}
          <section id="case" className="scroll-mt-28 border-t border-[var(--color-border)] py-16 md:py-20">
            <div className="max-w-[1100px] mx-auto px-6">
              <div className="mb-10">
                <SectionHeading
                  line1="DET HÄR HAR"
                  line2="VI BYGGT."
                  intro="System vi har byggt för verksamheter som inte passade i färdiga verktyg."
                />
              </div>

              <CaseList items={proof} />

              <Link
                href="/case"
                className="mt-8 inline-flex items-center gap-2 font-display text-sm font-bold tracking-[0.18em] uppercase text-[var(--color-text)] hover:text-[#D4622B] transition-colors duration-300"
              >
                ALLA CASE
                <Arrow />
              </Link>
            </div>
          </section>

          {/* 5. UPPLÄGG — summary; /tjanster owns the full version */}
          <EspressoBand>
            <div id="pris" className="scroll-mt-28 relative z-10 max-w-[1100px] mx-auto px-6 py-20 md:py-28">
              <div className="mb-12 md:mb-16">
                <SectionHeading
                  tone="dark"
                  line1="VÅRT"
                  line2="UPPLÄGG."
                  intro="Samma upplägg som för allt vi bygger: först en kartläggning, sedan ett fast pris för bygget."
                />
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
                {terms.map(({ num, body }) => (
                  <li key={num} className="border-l border-white/10 pl-8">
                    <span className="block mb-3 font-display text-4xl md:text-5xl leading-none tracking-wide uppercase text-white">
                      {num}
                    </span>
                    <p className="text-base text-white/70 leading-relaxed max-w-[40ch]">{body}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-12 md:mt-16 flex flex-wrap gap-x-10 gap-y-4">
                <Link
                  href="/tjanster#sa-jobbar-vi"
                  className="inline-flex items-center gap-2 font-display text-sm font-bold tracking-[0.18em] uppercase text-white hover:text-[#E8833A] transition-colors duration-300"
                >
                  SÅ JOBBAR VI
                  <Arrow />
                </Link>
                <Link
                  href="/tjanster#vad-det-kostar"
                  className="inline-flex items-center gap-2 font-display text-sm font-bold tracking-[0.18em] uppercase text-white hover:text-[#E8833A] transition-colors duration-300"
                >
                  VILLKOR
                  <Arrow />
                </Link>
              </div>
            </div>
          </EspressoBand>
        </>
      )}

      {/* 6. FAQ — only questions specific to this service */}
      <section id="vanliga-fragor" className="scroll-mt-28 py-16 md:py-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="mb-10">
            <SectionHeading line1="VANLIGA" line2="FRÅGOR." />
          </div>

          <FAQAccordion items={service.faqs} />
        </div>
      </section>
    </main>
  );
}
