"use client";

import { useState } from "react";

const faqs = [
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

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[var(--color-border)] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-5 px-8 py-6 text-left cursor-pointer"
        aria-expanded={open}
      >
        <span className="text-base md:text-lg font-semibold tracking-[-0.01em] text-[var(--color-text)]">
          {q}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
          className="shrink-0 text-[var(--color-muted)]"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <path
            d="M4.5 6.75L9 11.25L13.5 6.75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 220ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div className="px-8 pb-7 pt-0">
            <p className="text-[var(--color-text-body)] font-medium text-base leading-[1.7] max-w-[60ch]">
              {a}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQAccordion() {
  return (
    <div className="flex flex-col gap-2">
      {faqs.map(({ q, a }) => (
        <FAQItem key={q} q={q} a={a} />
      ))}
    </div>
  );
}
