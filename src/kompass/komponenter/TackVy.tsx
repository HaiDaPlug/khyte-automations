"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { SAJT, TEXT } from "@/kompass/data/kompass";
import { MoteKnapp } from "@/kompass/komponenter/ResultatVy";

type Props = {
  /** Adressen resultatet skickas till — visas så att de kan se att den stämmer. */
  mejl: string;
  /** När de klickar på "Boka ett möte" — för mätningen. */
  onMote: () => void;
  /** Det frivilliga steget — namn, telefon, roll. */
  komplettera?: ReactNode;
};

/**
 * Tacket. Kort: resultatet är på väg, boka en tid om du inte vill vänta.
 * Resultatet visas inte igen — det står i mejlet.
 */
export default function TackVy({ mejl, onMote, komplettera }: Props) {
  const rubrikRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    rubrikRef.current?.focus();
  }, []);

  return (
    <div>
      <h1
        ref={rubrikRef}
        tabIndex={-1}
        className="k-tona-in text-2xl leading-tight font-semibold tracking-tight text-[var(--k-text)] outline-none sm:text-[1.75rem]"
      >
        {TEXT.tack.rubrik}
      </h1>
      <p className="k-tona-in mt-3 text-base leading-relaxed text-[var(--k-text-body)]">
        {TEXT.tack.brodtext(mejl)}
      </p>

      <div className="mt-10 rounded-3xl bg-[var(--k-card-bg)] p-6 sm:p-8">
        <p className="text-[0.9375rem] font-semibold text-[var(--k-text)]">{TEXT.tack.mote}</p>
        <MoteKnapp onMote={onMote} className="mt-4" />
      </div>

      {komplettera}

      <p className="mt-10 text-[0.9375rem] text-[var(--k-text-body)]">
        {TEXT.tack.direktkontakt}{" "}
        <a
          href={`mailto:${SAJT.mejl}`}
          className="font-semibold text-[var(--k-cta)] underline underline-offset-4"
        >
          {SAJT.mejl}
        </a>{" "}
        ·{" "}
        <a
          href={SAJT.telefonLank}
          className="font-semibold text-[var(--k-cta)] underline underline-offset-4"
        >
          {SAJT.telefon}
        </a>
      </p>
    </div>
  );
}
