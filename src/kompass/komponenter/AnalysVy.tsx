"use client";

import { useEffect, useRef, useState } from "react";
import { TEXT } from "@/kompass/data/kompass";
import Drake from "@/kompass/komponenter/Drake";

type Props = {
  /** Raderna som bockas av, i ordning. Byggda av deras svar. */
  rader: string[];
  /**
   * Är AI-analysen klar? Sista raden ("Bygger tre förslag") bockas inte av
   * förrän den är det — då stämmer det som visas.
   */
  klar: boolean;
};

/** Tid mellan varje rad. Hela momentet: rader × STEG + en kort paus. */
export const ANALYS_STEG = 700;

/**
 * Kort paus innan resultatet: draken svävar och tre rader bockas av —
 * "Läser 12 svar ✓ Hittar tidstjuvarna: offerter, fakturor ✓ …".
 *
 * Det är inte teater för sakens skull. Raderna är byggda av deras egna svar,
 * och ett resultat som synligt tas fram upplevs som mer genomtänkt än ett som
 * bara dyker upp. Hålls kort — 2,5 sekunder totalt.
 */
export default function AnalysVy({ rader, klar: analysKlar }: Props) {
  const [klaraPaTid, setKlara] = useState(0);
  const [sistaTid, setSistaTid] = useState(false);
  const klara = sistaTid && analysKlar ? rader.length : klaraPaTid;
  const rubrikRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    rubrikRef.current?.focus();
    // Alla rader utom den sista bockas av på tid. Den sista väntar på
    // analysen, se nedan.
    const timers = rader.slice(0, -1).map((_, i) =>
      window.setTimeout(() => setKlara(i + 1), (i + 1) * ANALYS_STEG),
    );
    const sista = window.setTimeout(() => setSistaTid(true), rader.length * ANALYS_STEG);
    timers.push(sista);
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [rader]);

  return (
    <div className="flex flex-col items-center pt-6 text-center">
      <Drake className="h-[9.375rem] w-[6.75rem]" />

      <h1
        ref={rubrikRef}
        tabIndex={-1}
        className="k-rubrik k-tona-in mt-6 text-3xl outline-none sm:text-4xl"
      >
        {TEXT.analys.rubrik}
      </h1>

      <ul role="status" className="mt-6 flex w-full max-w-[22.5rem] flex-col gap-3 text-left">
        {rader.map((rad, i) => {
          const klar = i < klara;
          const pagar = i === klara;
          return (
            <li
              key={rad}
              className={
                "k-analys-rad flex items-center gap-3 rounded-2xl bg-[var(--k-card-bg)] px-4 py-3 " +
                (i <= klara ? "k-analys-synlig" : "")
              }
            >
              <span
                aria-hidden="true"
                className={
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full " +
                  (klar
                    ? "bg-[var(--k-cta)] text-white"
                    : "border-2 border-[var(--k-border)]")
                }
              >
                {klar ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                ) : pagar ? (
                  <span className="k-analys-puls h-2 w-2 rounded-full bg-[var(--k-cta)]" />
                ) : null}
              </span>
              <span className="text-[0.9375rem] leading-snug text-[var(--k-text)]">
                {rad}
                {klar ? <span className="k-bara-skarmlasare"> — klart</span> : null}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
