import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CalendlyButton from "@/components/CalendlyButton";
import FAQAccordion from "@/components/FAQAccordion";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import ServiceExamples from "@/components/sections/ServiceExamples";
import { facts } from "@/data/facts";
import { faqPageSchema } from "@/data/faq";
import { getServiceBySlug, services } from "@/data/services";

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

/**
 * A service page: hero, the examples told one at a time on scroll, how a build
 * goes in three steps, and the service's FAQ. No prices: build prices aren't
 * shown on the site (owner, 2026-10-09). Spacing is generous on purpose; one
 * idea per screen (owner's design direction, 2026-10-09).
 */
export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const url = `${facts.url}/tjanster/${service.slug}`;

  const steps = [
    {
      title: "Introsamtal",
      meta: `Kostnadsfritt · ${facts.introCall.minutes} min`,
      desc: "Vi hör hur ni jobbar och om vi kan hjälpa till.",
    },
    {
      title: "Kartläggning",
      meta: "Kostnadsfri",
      desc: "Vi går igenom arbetet och ger er en offert med omfattning, tidsplan och fast pris.",
    },
    {
      title: "Bygge",
      meta: "Fast pris",
      desc: `Vi bygger i steg och ni godkänner varje del. Mindre lösningar är ofta i drift inom ${facts.delivery.small}, större system inom ${facts.delivery.large}.`,
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
                href="#exempel"
                className="text-[var(--color-muted)] hover:text-[var(--color-text)] text-base underline underline-offset-4 transition-colors"
              >
                Se exempel
              </Link>
            </div>
          </PageHeader>
        </div>
      </section>

      {/* 2. EXEMPEL — told one at a time on scroll; the scenes only illustrate */}
      <section id="exempel" className="scroll-mt-28 py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-6">
          <ServiceExamples service={service} />
        </div>
      </section>

      {/* 3. SÅ GÅR DET TILL — heading left, the three steps as rows on the right */}
      <section id="sa-gar-det-till" className="scroll-mt-28 border-t border-[var(--color-border)] py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-6 lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="mb-10 lg:col-span-4 lg:mb-0">
            <SectionHeading line1="SÅ GÅR" line2="DET TILL." />
          </div>

          <ol className="lg:col-span-8">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-[var(--color-border)] py-7 first:border-t-0 first:pt-0 md:grid-cols-[4rem_1fr] md:gap-x-6"
              >
                <span className="font-display text-[2rem] leading-none tracking-wide text-[var(--color-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xl font-semibold tracking-[-0.02em] leading-[1.2] text-[var(--color-text)]">
                    {step.title}
                    <span className="text-[13px] font-bold tracking-[0.05em] uppercase text-[var(--color-muted)]">
                      {step.meta}
                    </span>
                  </h3>
                  <p className="mt-2 max-w-[56ch] text-base font-medium leading-relaxed text-[var(--color-text-body)]">
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. FAQ — questions a buyer of this service asks; same grid as above */}
      <section id="vanliga-fragor" className="scroll-mt-28 border-t border-[var(--color-border)] py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-6 lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="mb-10 lg:col-span-4 lg:mb-0">
            <SectionHeading line1="VANLIGA" line2="FRÅGOR." />
          </div>

          <div className="lg:col-span-8">
            <FAQAccordion items={service.faqs} />
          </div>
        </div>
      </section>
    </main>
  );
}
