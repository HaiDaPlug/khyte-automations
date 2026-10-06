/**
 * Single source of truth for FAQ content.
 *
 * Both the visible <FAQAccordion /> and the FAQPage JSON-LD read from here.
 * Google requires schema FAQ text to match what the visitor actually sees on
 * the page, so these must never be maintained separately.
 */

import { facts } from "./facts";

export interface FAQEntry {
  q: string;
  a: string;
}

/** Shown on `/` — keep in sync with nothing else; this IS the source. */
export const homeFaqs: FAQEntry[] = [
  {
    q: "Vad kostar det?",
    a: `Det beror på omfattningen. Vi börjar med en kostnadsfri kartläggning för att förstå vad ni behöver. Därefter får ni en offert med tydlig omfattning och ett fast pris för bygget, från ${facts.priceFrom}, innan ni bestämmer er.`,
  },
  {
    q: "Hur lång tid tar det?",
    a: `Det beror på era verktyg och processer. Mindre automationer är ofta klara på ${facts.delivery.small}, större system tar ${facts.delivery.large}. Ni får en tidsplan i kartläggningen.`,
  },
  {
    q: "Behöver vi ändra hur vi jobbar?",
    a: "Vårt mål är att övergången ska vara så smidig som möjligt. Ni ska märka av förändringen i form av frigjord tid, inte ett nytt sätt att arbeta.",
  },
  {
    q: "Kan ni integrera med vårt system?",
    a: "Har ert system ett API går det oftast att koppla. Vi går igenom era system i kartläggningen och säger direkt om något inte går.",
  },
];

/**
 * Builds FAQPage structured data from the entries a page actually renders.
 * Emit this only on pages where the accordion is visible.
 */
export function faqPageSchema(items: FAQEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
