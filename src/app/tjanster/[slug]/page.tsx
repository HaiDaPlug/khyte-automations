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

  // Process and price are owned by /tjanster. This band only summarises them,
  // from facts.ts, and links up to the full version.
  const terms = [
    {
      num: facts.priceFrom,
      unit: "från",
      body: "Fast pris för bygget, satt efter kartläggningen. Ni vet vad det kostar innan något byggs.",
    },
    {
      num: facts.delivery.large,
      unit: null,
      body: `Från kartläggning till drift för större system. Mindre lösningar är ofta klara på ${facts.delivery.small}.`,
    },
    {
      num: "Er kod",
      unit: null,
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
      offers: {
        "@type": "Offer",
        priceCurrency: "SEK",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: Number(facts.priceFrom.replace(/\D/g, "")),
          priceCurrency: "SEK",
        },
      },
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
                href="#case"
                className="text-[var(--color-muted)] hover:text-[var(--color-text)] text-base underline underline-offset-4 transition-colors"
              >
                Se vad vi har byggt
              </Link>
            </div>
          </PageHeader>
        </div>
      </section>

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
            {service.problems.map((p) => (
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
            {service.builds.map((b, i) => (
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

      {/* 5. PRIS OCH UPPLÄGG — summary; /tjanster owns the full version */}
      <EspressoBand>
        <div id="pris" className="scroll-mt-28 relative z-10 max-w-[1100px] mx-auto px-6 py-20 md:py-28">
          <div className="mb-12 md:mb-16">
            <SectionHeading
              tone="dark"
              line1="PRIS OCH"
              line2="UPPLÄGG."
              intro="Samma upplägg som för allt vi bygger: först en kartläggning, sedan ett fast pris för bygget."
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
              VAD DET KOSTAR
              <Arrow />
            </Link>
          </div>
        </div>
      </EspressoBand>

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
