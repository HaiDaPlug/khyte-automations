"use client";

import { useId, useState } from "react";
import { MAX_FRITEXT, TEXT } from "@/kompass/data/kompass";
import Knapp from "@/kompass/komponenter/Knapp";

type Props = {
  /** Flaskhalsen i en fras: "offerter som blir liggande utan uppföljning". */
  diagnos: string;
  du: boolean;
  /** Svaret om de redan svarat — då visas bara tacket. */
  besvarad?: string;
  onSvara: (svar: string, text?: string) => void;
};

/**
 * Kontrollfrågan under det första förslaget: "Vi tror att er första
 * flaskhals är … Stämmer det?"
 *
 * Gör resultatet mer trovärdigt, fångar när kompassen gissat fel och visar
 * säljaren var samtalet ska börja. Ett tryck — bara "Nej" frågar vidare.
 */
export default function Bekraftelse({ diagnos, du, besvarad, onSvara }: Props) {
  const [nej, setNej] = useState(false);
  const [text, setText] = useState("");
  const rubrikId = useId();
  const faltId = useId();

  if (besvarad) {
    return (
      <p
        role="status"
        className="k-tona-in rounded-2xl bg-[var(--k-card-bg)] p-5 text-[0.9375rem] font-semibold text-[var(--k-text)]"
      >
        {TEXT.bekraftelse.tack}
      </p>
    );
  }

  const alternativ = [TEXT.bekraftelse.ja, TEXT.bekraftelse.delvis, TEXT.bekraftelse.nej];

  function valj(a: string) {
    if (a === TEXT.bekraftelse.nej) {
      setNej(true);
      return;
    }
    onSvara(a);
  }

  return (
    <section
      aria-labelledby={rubrikId}
      className="rounded-2xl border border-[var(--k-border)] bg-[var(--k-card-bg)] p-5"
    >
      <p id={rubrikId} className="text-[1rem] leading-snug font-semibold text-[var(--k-text)]">
        {TEXT.bekraftelse.fraga(du, diagnos)}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {alternativ.map((a) => (
          <button
            key={a}
            type="button"
            data-vald={nej && a === TEXT.bekraftelse.nej}
            aria-pressed={nej && a === TEXT.bekraftelse.nej}
            onClick={() => valj(a)}
            className="k-snabbval"
          >
            {a}
          </button>
        ))}
      </div>

      {nej ? (
        <form
          className="mt-4 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            // Tomt går också — "Nej" är ett svar i sig.
            onSvara(TEXT.bekraftelse.nej, text.trim() || undefined);
          }}
        >
          <label htmlFor={faltId} className="k-bara-skarmlasare">
            {TEXT.bekraftelse.platshallare}
          </label>
          <input
            id={faltId}
            type="text"
            value={text}
            maxLength={MAX_FRITEXT}
            onChange={(e) => setText(e.target.value)}
            placeholder={TEXT.bekraftelse.platshallare}
            className="w-full rounded-xl border border-[var(--k-border)] bg-[var(--k-bg)] px-4 py-3 text-base text-[var(--k-text)] placeholder:text-[var(--k-muted)]"
          />
          <div>
            <Knapp type="submit" variant="sekundar">
              {TEXT.bekraftelse.skicka}
            </Knapp>
          </div>
        </form>
      ) : null}
    </section>
  );
}
