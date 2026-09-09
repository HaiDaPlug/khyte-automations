/**
 * Single source of truth for FAQ content.
 *
 * Both the visible <FAQAccordion /> and the FAQPage JSON-LD read from here.
 * Google requires schema FAQ text to match what the visitor actually sees on
 * the page, so these must never be maintained separately.
 */

export interface FAQEntry {
  q: string;
  a: string;
}

/** Shown on `/` — keep in sync with nothing else; this IS the source. */
export const homeFaqs: FAQEntry[] = [
  {
    q: "Vad kostar det?",
    a: "Det beror på projektets omfattning. Är det en simpel implementation kommer det att kosta mindre, och större mer. Man får ett pris på kartläggningen så att ni vet innan ni bestämmer er.",
  },
  {
    q: "Hur lång tid tar det?",
    a: "Beror på komplexitet av dina verktyg och processer. Vi värderar snabb service och försöker att få ut det åtminstone inom en till två veckor. Tidsramen läggs tydligt i kartläggningen.",
  },
  {
    q: "Behöver vi ändra hur vi jobbar?",
    a: "Vårt mål är att övergången ska vara så smidig som möjligt. Ni ska märka av förändringen i form av frigjord tid, inte ett nytt sätt att arbeta.",
  },
  {
    q: "Kan ni integrera med vårt system?",
    a: "Om ert system har en API kommer det troligtvis att kunna koppla. Vi dyker djupt in i era processer och system och säger ja/nej om det inte går.",
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
