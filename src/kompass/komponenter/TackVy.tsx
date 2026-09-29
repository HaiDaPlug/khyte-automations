"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { SAJT, TEXT } from "@/kompass/data/kompass";

type Props = {
  /** Adressen resultatet skickas till — visas så att de kan se att den stämmer. */
  mejl: string;
  /** Det frivilliga steget — direkt under tacket, före resultatet. */
  komplettera?: ReactNode;
  /** Det upplåsta resultatet, mellan tacket och direktkontakten. */
  children?: ReactNode;
};

export default function TackVy({ mejl, komplettera, children }: Props) {
  const rubrikRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    rubrikRef.current?.focus();
  }, []);

  return (
    <div>
      <h1
        ref={rubrikRef}
        tabIndex={-1}
        className="k-rubrik k-tona-in text-4xl outline-none sm:text-5xl"
      >
        {TEXT.tack.rubrik}
      </h1>
      <p className="k-tona-in mt-4 text-lg text-[var(--k-text-body)]">
        {TEXT.tack.brodtext(mejl)}
      </p>

      {komplettera}

      {children ? (
        <div className="mt-10 border-t border-[var(--k-border)] pt-10">
          <p className="mb-4 text-[0.9375rem] font-semibold text-[var(--k-text-body)]">
            {TEXT.tack.ocksaHar}
          </p>
          {children}
        </div>
      ) : null}

      <div className="mt-10 rounded-2xl bg-[var(--k-card-bg)] p-6">
        <p className="text-[0.9375rem] text-[var(--k-text-body)]">
          {TEXT.tack.direktkontakt}
        </p>
        <p className="mt-3 flex flex-col gap-2">
          <a
            href={`mailto:${SAJT.mejl}`}
            className="text-base font-semibold text-[var(--k-cta)] underline underline-offset-4"
          >
            {SAJT.mejl}
          </a>
          <a
            href={SAJT.telefonLank}
            className="text-base font-semibold text-[var(--k-cta)] underline underline-offset-4"
          >
            {SAJT.telefon}
          </a>
        </p>
      </div>
    </div>
  );
}
