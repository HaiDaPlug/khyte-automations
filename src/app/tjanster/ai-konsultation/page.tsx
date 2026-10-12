import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/Button";
import FAQAccordion from "@/components/FAQAccordion";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import KonsultationForm from "@/components/sections/KonsultationForm";
import { facts } from "@/data/facts";
import { faqPageSchema, type FAQEntry } from "@/data/faq";

/*
 * /tjanster/ai-konsultation — a fixed-price session, not a build, so it has its
 * own page rather than the examples template in [slug] (a static segment wins
 * over [slug]).
 *
 * Owner's brief (2026-10-11): minimal and trustworthy, light (no dark price
 * band), the problem first, example questions people start with, two cards for
 * what's included and what isn't, and the fee credited toward a later build.
 *
 * Booking is a request through the form in #boka (KonsultationForm →
 * /api/ai-konsultation → mail to SALES_EMAIL and a confirmation to the
 * customer), confirmed personally by Hai and invoiced afterwards. Follow-up
 * questions after the session are included but deliberately not promised on
 * the page (owner, 2026-10-12).
 */

const c = facts.consultation;
const url = `${facts.url}/tjanster/ai-konsultation`;
const priceNumber = Number(c.price.replace(/\D/g, ""));

export const metadata: Metadata = {
  title: "AI-konsultation för företag – 90 minuter med dina frågor",
  description: `Personlig AI-konsultation för dig i företaget: ${c.minutes} minuter kring dina frågor, förberedd i förväg, med ett skriftligt underlag inom ${c.deliveryDays}. ${c.price} ${c.vat}.`,
  alternates: { canonical: "/tjanster/ai-konsultation" },
};

const startingQuestions = [
  "Vilket AI-verktyg passar mitt jobb?",
  "Hur får jag bättre svar från ChatGPT?",
  "Vad kan AI göra i min vardag, konkret?",
  "Vad är en AI-agent, och behöver jag en?",
  "Är det säkert att använda AI med företagets information?",
  "Var börjar jag, utan att lägga massor av tid?",
];

const included = [
  "Förberedelse utifrån frågorna du skickar in",
  `${c.minutes} minuter personlig konsultation, på distans eller på plats`,
  "Förklaringar på en nivå som passar dig",
  "Råd om verktyg och arbetssätt för just ditt arbete",
  `En skriftlig sammanfattning och ett anpassat underlag inom ${c.deliveryDays}`,
  "Prioriterade nästa steg",
];

const notIncluded = [
  "Ett färdigt system eller en automation i drift",
  "Ändringar i era system",
  "Fler deltagare (konsultationen är för en person)",
];

const steps = [
  {
    title: "Du skickar en förfrågan",
    desc: "Svara på några korta frågor om ditt arbete och vad du vill få ut av mötet. Vi hör av oss och bekräftar en tid.",
  },
  {
    title: "Vi förbereder oss",
    desc: "Vi går igenom dina svar och tar fram exempel, verktyg och förklaringar för just dig.",
  },
  {
    title: `${c.minutes} minuter tillsammans`,
    desc: "På distans eller på plats. Vi reder ut begrepp, går igenom verktyg och arbetssätt, och provar tillsammans när det passar.",
  },
  {
    title: "Du får underlaget",
    desc: `Inom ${c.deliveryDays} får du en sammanfattning och ett dokument med förklaringar, verktygsråd och prioriterade nästa steg. Fakturan kommer efter konsultationen.`,
  },
];

const faqs: FAQEntry[] = [
  {
    q: "Behöver jag kunna något om AI innan?",
    a: "Nej. Vi utgår från var du är i dag, oavsett om du aldrig har använt AI eller använder det varje dag.",
  },
  {
    q: "Måste jag veta exakt vad jag vill fråga?",
    a: "Nej. Frågorna i förfrågan hjälper dig att formulera det, och är du osäker utgår vi från hur ditt arbete ser ut.",
  },
  {
    q: "Räknas avgiften av om vi bygger något senare?",
    a: "Ja. Anlitar du oss senare för en automation eller ett eget system räknas hela avgiften av mot priset. Det finns ingen tidsgräns.",
  },
  {
    q: "Kan fler från företaget vara med?",
    a: "Konsultationen är upplagd för en person, så att vi kan utgå helt från ditt arbete. Hör av dig om ni är fler.",
  },
  {
    q: "Hur betalar jag?",
    a: `Mot faktura efter konsultationen. Priset är ${c.price} ${c.vat}.`,
  },
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: "AI-konsultation",
    description: metadata.description,
    url,
    provider: { "@id": `${facts.url}/#organization` },
    areaServed: { "@type": "Country", name: "Sverige" },
    offers: {
      "@type": "Offer",
      price: priceNumber,
      priceCurrency: "SEK",
      priceSpecification: {
        "@type": "PriceSpecification",
        price: priceNumber,
        priceCurrency: "SEK",
        valueAddedTaxIncluded: false,
      },
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hem", item: facts.url },
      { "@type": "ListItem", position: 2, name: "Tjänster", item: `${facts.url}/tjanster` },
      { "@type": "ListItem", position: 3, name: "AI-konsultation", item: url },
    ],
  },
  faqPageSchema(faqs),
];

/* ── Small icons, stroke only, inheriting colour ─────────────────────────── */

const Icon = ({ d }: { d: string }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="shrink-0">
    <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CLOCK = "M9 16A7 7 0 1 0 9 2a7 7 0 0 0 0 14ZM9 5v4l2.5 1.5";
const PLACE = "M9 16s5-4.6 5-8.5A5 5 0 0 0 4 7.5C4 11.4 9 16 9 16Zm0-6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z";
const DOC = "M5 2h5.5L14 5.5V16H5V2Zm5 0v4h4M7.5 9.5h4M7.5 12.5h4";

const Mark = ({ ok }: { ok: boolean }) => (
  <span
    aria-hidden="true"
    className={`mt-[0.1em] grid h-6 w-6 shrink-0 place-items-center rounded-full ${
      ok ? "bg-[#2F7D4F]/10 text-[#2F7D4F]" : "bg-[#B42318]/10 text-[#B42318]"
    }`}
  >
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d={ok ? "M2.5 6.2 5 8.6l4.5-5" : "M3 3l6 6M9 3 3 9"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const CARD = "rounded-2xl border border-[var(--color-border)] bg-white/70";

export default function AiKonsultationPage() {
  return (
    <main>
      <JsonLd data={structuredData} />

      {/* 1. HERO — the problem first, then the offer beside it */}
      <section className="pt-32 md:pt-40 pb-20 md:pb-28">
        <div className="max-w-[1100px] mx-auto px-6">
          <nav aria-label="Brödsmulor" className="mb-6">
            {/* .text-label sets its own colour; colours go on the items. */}
            <ol className="flex items-center gap-2 text-label">
              <li>
                <Link href="/tjanster" className="hover:text-[#D4622B] transition-colors duration-200">
                  Tjänster
                </Link>
              </li>
              <li aria-hidden="true" className="text-[var(--color-muted)]">/</li>
              <li aria-current="page" className="text-[var(--color-muted)]">AI-konsultation</li>
            </ol>
          </nav>

          <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
            <div className="lg:col-span-7">
              <PageHeader
                line1="AI-"
                line2="KONSULTATION."
                intro="Det kommer nya AI-verktyg varje vecka, och alla verkar ha en åsikt om vilket du borde använda. Du har kanske testat ChatGPT och fått svar som låter bra men inte går att använda. Eller så vet du att något i ditt jobb borde gå snabbare, men inte var du ska börja."
              >
                <p className="mt-5 max-w-[52ch] text-lg font-medium leading-[1.5] text-[var(--color-text)]">
                  I en AI-konsultation utgår vi från ditt arbete och dina frågor. På {c.minutes} minuter reder vi
                  ut vad som är värt din tid, och efteråt får du ett skriftligt underlag med tydliga nästa steg.
                </p>
              </PageHeader>
            </div>

            {/* The offer: price, what it is, how to book. */}
            <aside aria-label="Pris och bokning" className={`mt-12 lg:col-span-5 lg:mt-3 ${CARD} p-8 md:p-10 shadow-[0_24px_60px_-40px_rgba(58,51,48,0.35)]`}>
              <p className="text-label">AI-konsultation</p>
              <p className="mt-4 flex flex-wrap items-baseline gap-x-2">
                <span className="text-[2.5rem] font-semibold leading-none tracking-[-0.03em] text-[var(--color-text)]">
                  {c.price}
                </span>
                <span className="text-sm font-semibold text-[var(--color-muted)]">{c.vat}</span>
              </p>

              <ul className="mt-6 space-y-3 border-t border-[var(--color-border)] pt-6 text-base font-medium text-[var(--color-text-body)]">
                <li className="flex items-center gap-3">
                  <span className="text-[#D4622B]"><Icon d={CLOCK} /></span>
                  {c.minutes} minuter, en person
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#D4622B]"><Icon d={PLACE} /></span>
                  På distans eller på plats
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#D4622B]"><Icon d={DOC} /></span>
                  Skriftligt underlag inom {c.deliveryDays}
                </li>
              </ul>

              <Button variant="primary" href="#boka" className="mt-8 w-full">
                Skicka bokningsförfrågan
              </Button>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-body)]">
                Vi bekräftar tiden personligen. Faktura efter konsultationen.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* 2. FRÅGOR — what people usually start with */}
      <section id="fragor" className="scroll-mt-28 border-t border-[var(--color-border)] py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-6 lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="mb-10 lg:col-span-4 lg:mb-0">
            <SectionHeading line1="FRÅGOR SOM" line2="MÅNGA HAR." intro="Ta med dina egna, eller börja här." />
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-8">
            {startingQuestions.map((q) => (
              <li
                key={q}
                className={`${CARD} px-6 py-5 text-base font-medium leading-snug text-[var(--color-text)]`}
              >
                {q}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. VAD DU FÅR — included vs. not included, side by side */}
      <section id="vad-du-far" className="scroll-mt-28 border-t border-[var(--color-border)] py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="mb-12">
            <SectionHeading line1="VAD DU" line2="FÅR." />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <div className={`${CARD} p-8 md:p-10`}>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-text)]">Det här ingår</h3>
              <ul className="mt-6 space-y-4">
                {included.map((item) => (
                  <li key={item} className="flex gap-3 text-base font-medium leading-relaxed text-[var(--color-text-body)]">
                    <Mark ok />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${CARD} p-8 md:p-10`}>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-text)]">Det här ingår inte</h3>
              <ul className="mt-6 space-y-4">
                {notIncluded.map((item) => (
                  <li key={item} className="flex gap-3 text-base font-medium leading-relaxed text-[var(--color-text-body)]">
                    <Mark ok={false} />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-8 border-t border-[var(--color-border)] pt-6 text-[15px] leading-relaxed text-[var(--color-text-body)]">
                Vill ni ha något byggt tar vi fram en separat offert efter en kostnadsfri kartläggning.
              </p>
            </div>
          </div>

          {/* The fee goes toward a later build. */}
          <div className="mt-4 md:mt-6 flex flex-col gap-6 rounded-2xl border border-[#D4622B]/25 bg-[#D4622B]/[0.05] p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <p className="max-w-[56ch] text-base leading-relaxed text-[var(--color-text-body)]">
              <strong className="font-semibold text-[var(--color-text)]">Avgiften går vidare till bygget.</strong>{" "}
              Anlitar du oss senare för en automation eller ett eget system räknas hela avgiften av mot
              priset. Det finns ingen tidsgräns.
            </p>
            <Button variant="primary" href="#boka" className="shrink-0">
              Skicka bokningsförfrågan
            </Button>
          </div>
        </div>
      </section>

      {/* 4. SÅ GÅR DET TILL — heading left, the steps as rows on the right */}
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
                  <h3 className="text-xl font-semibold tracking-[-0.02em] leading-[1.2] text-[var(--color-text)]">
                    {step.title}
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

      {/* 5. BOKA — the request form */}
      <section id="boka" className="scroll-mt-28 border-t border-[var(--color-border)] py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-6 lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="mb-10 lg:col-span-4 lg:mb-0">
            <SectionHeading
              line1="BOKA DIN"
              line2="KONSULTATION."
              intro="Fyra korta steg. Dina svar gör att vi kan förbereda oss på riktigt."
            />
            <ul className="mt-8 space-y-3 text-[15px] font-medium leading-relaxed text-[var(--color-text-body)]">
              {[
                `${c.price} ${c.vat}, faktura efter konsultationen`,
                "Vi bekräftar tiden personligen",
                `Skriftligt underlag inom ${c.deliveryDays}`,
                "Avgiften räknas av om vi bygger något senare",
              ].map((rad) => (
                <li key={rad} className="flex gap-3">
                  <Mark ok />
                  {rad}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-8">
            <KonsultationForm />
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section id="vanliga-fragor" className="scroll-mt-28 border-t border-[var(--color-border)] py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-6 lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="mb-10 lg:col-span-4 lg:mb-0">
            <SectionHeading line1="VANLIGA" line2="FRÅGOR." />
          </div>
          <div className="lg:col-span-8">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>
    </main>
  );
}
