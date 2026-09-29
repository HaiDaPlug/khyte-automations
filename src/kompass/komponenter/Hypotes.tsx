"use client";

import { TEXT } from "@/kompass/data/kompass";

type Props = {
  text: string;
};

/**
 * "Det vi ser hittills" — AI-analysens bild av företaget, uppdaterad efter
 * varje skärm. Visar att kompassen faktiskt tänker, utan att ta plats från
 * frågan. Byter text med en mjuk intoning (key på texten).
 */
export default function Hypotes({ text }: Props) {
  return (
    <div aria-live="polite" className="mt-10">
      <p
        key={text}
        className="k-hypotes flex items-start gap-2.5 rounded-2xl border border-[rgba(192,94,32,0.25)] bg-[rgba(192,94,32,0.06)] px-4 py-3"
      >
        <span aria-hidden="true" className="k-hypotes-prick mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-[var(--k-cta)]" />
        <span className="text-[0.875rem] leading-snug text-[var(--k-text)]">
          <span className="font-semibold">{TEXT.hypotes.etikett}</span> {text}
        </span>
      </p>
    </div>
  );
}
