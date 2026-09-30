"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { FRAGA, SAJT, TEXT, VISA_PER_MANAD_UNDER } from "@/kompass/data/kompass";
import { ordFor } from "@/kompass/data/floden";
import Knapp from "@/kompass/komponenter/Knapp";
import { tjansterText } from "@/kompass/lib/analys";
import { byggSammanfattning } from "@/kompass/lib/sammanfattning";
import { formateraTimmarKort, perManad } from "@/kompass/lib/tid";
import type { Resultat, Svar } from "@/kompass/lib/typer";

type Props = {
  resultat: Resultat;
  svar: Svar;
  /** Sökvägen delningslänken pekar på. Utan den: sidans egen adress. */
  delningsSokvag?: string;
  onDelning: () => void;
  /** När de klickar på "Boka ett möte" — för mätningen. */
  onMote: () => void;
  /** Mejlformuläret. Hamnar under mötesknappen, som alternativet. */
  children?: ReactNode;
};

/** Ordningen resultatet tonar in i. */
const ordning = (i: number) => ({ "--i": i }) as CSSProperties;

/** Liten rad ovanför varje block — håller isär dem utan stora rubriker. */
const ETIKETT =
  "text-[0.75rem] font-semibold tracking-[0.08em] text-[var(--k-muted)] uppercase";

/**
 * Resultatet, i tre luftiga block: er tid, tre förslag, nästa steg. Så lite
 * text som möjligt — en mening, en siffra, tre rubriker. Stegen, planen och
 * uträkningarna står i mejlet; vill de veta mer tar vi det i mötet.
 */
export default function ResultatVy({
  resultat,
  svar,
  delningsSokvag,
  onDelning,
  onMote,
  children,
}: Props) {
  const [delningsbesked, setDelningsbesked] = useState("");
  const rubrikRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    rubrikRef.current?.focus();
  }, []);

  const { besparing, forslag } = resultat;
  const du = svar[FRAGA.antal] === "Bara jag";

  // Rubriken efter målet. Mål utan riktning får standardrubriken.
  const malRubrik =
    resultat.mal && resultat.mal in TEXT.resultat.malRubrik
      ? TEXT.resultat.malRubrik[resultat.mal as keyof typeof TEXT.resultat.malRubrik]
      : undefined;
  const rubrik = malRubrik
    ? malRubrik(du, ordFor(resultat.bransch).kunder)
    : TEXT.resultat.rubrik;

  // Bara den första meningen — vad det kostar i dag.
  const sammanfattning = byggSammanfattning(resultat, svar).split(/(?<=\.)\s/)[0];

  // Liten veckotid visas per månad: "1–3 h i veckan" säger lite.
  const perManadVisas = besparing.max > 0 && besparing.max < VISA_PER_MANAD_UNDER;
  const harledningar = resultat.omraden.filter((o) => o.lagt).map((o) => o.harledning);

  async function dela() {
    // Behåll ?ref= så att en partner får krediten även när länken skickas vidare.
    const ref = new URLSearchParams(window.location.search).get("ref");
    const url =
      window.location.origin +
      (delningsSokvag ?? window.location.pathname) +
      (ref ? `?ref=${encodeURIComponent(ref)}` : "");
    const delningsdata = {
      title: "Var tappar du mest tid?",
      text: "Under två minuter, mest snabba tryck. Du ser direkt var tiden går.",
      url,
    };

    // Web Share API finns på mobil. På dator faller vi tillbaka på urklipp.
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(delningsdata);
        onDelning();
        return;
      } catch (fel) {
        // Användaren avbröt delningen. Inget fel — säg ingenting.
        if (fel instanceof DOMException && fel.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setDelningsbesked(TEXT.resultat.delaKopierad);
      onDelning();
    } catch {
      // Urklipp kan vara blockerat. Visa länken så att den går att kopiera.
      setDelningsbesked(url);
    }
  }

  return (
    <div>
      {/* Rubrik och en mening. */}
      <h1
        ref={rubrikRef}
        tabIndex={-1}
        className="k-tona-in text-2xl leading-tight font-semibold tracking-tight text-[var(--k-text)] outline-none sm:text-[1.75rem]"
      >
        {rubrik}
      </h1>
      {sammanfattning ? (
        <p
          style={ordning(1)}
          className="k-tona-in mt-3 max-w-[34rem] text-base leading-relaxed text-[var(--k-text-body)]"
        >
          {sammanfattning}
        </p>
      ) : null}

      {/* Block 1: er tid — en siffra. */}
      {besparing.max > 0 ? (
        <section style={ordning(2)} className="k-tona-in mt-12">
          <p className={ETIKETT}>{TEXT.resultat.tidEtikett}</p>
          <p className="mt-2 text-[0.9375rem] text-[var(--k-text-body)]">
            {TEXT.resultat.frigor}
          </p>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
            <span className="text-3xl leading-none font-semibold tracking-tight text-[var(--k-cta)]">
              {formateraTimmarKort(perManadVisas ? perManad(besparing) : besparing)}
            </span>
            <span className="text-[0.9375rem] text-[var(--k-text-body)]">
              {perManadVisas
                ? TEXT.resultat.frigorFotManad
                : (tjansterText(besparing, resultat.niva) ?? TEXT.resultat.frigorFot)}
            </span>
          </p>

          {/* Uträkningen, för den som vill se den — stängd från början. */}
          {harledningar.length > 0 ? (
            <details className="mt-3 text-[0.8125rem] text-[var(--k-muted)]">
              <summary className="cursor-pointer py-1 font-semibold">
                {TEXT.resultat.saRaknadeVi}
              </summary>
              <ul className="mt-1 flex flex-col gap-1.5 leading-relaxed">
                {harledningar.map((h) => (
                  <li key={h}>{h}</li>
                ))}
                <li>{TEXT.resultat.saRaknadeViFot}</li>
              </ul>
            </details>
          ) : null}
        </section>
      ) : null}

      {/* Block 2: tre förslag — bara rubrikerna. Resten står i mejlet. */}
      <section style={ordning(3)} className="k-tona-in mt-12">
        <h2 className={ETIKETT}>{TEXT.resultat.forslagRubrik}</h2>
        <ol className="mt-3 border-t border-[var(--k-border)]">
          {forslag.map((f, i) => (
            <li
              key={f.id}
              className="flex items-baseline gap-4 border-b border-[var(--k-border)] py-4"
            >
              <span
                aria-hidden="true"
                className="text-[0.875rem] font-semibold tabular-nums text-[var(--k-cta)]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base leading-snug font-semibold text-[var(--k-text)]">
                {f.rubrik}
              </h3>
            </li>
          ))}
        </ol>
      </section>

      {/* Block 3: nästa steg — möte först, mejl som alternativ. */}
      <section
        id="kontakt"
        aria-labelledby="mote-rubrik"
        style={ordning(4)}
        className="k-tona-in mt-12 scroll-mt-6 rounded-3xl bg-[var(--k-card-bg)] p-6 sm:p-8"
      >
        <p className={ETIKETT}>{TEXT.resultat.mote.etikett}</p>
        <h2 id="mote-rubrik" className="mt-2 text-xl leading-tight font-semibold text-[var(--k-text)]">
          {TEXT.resultat.mote.rubrik}
        </h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--k-text-body)]">
          {TEXT.resultat.mote.brodtext}
        </p>
        <MoteKnapp onMote={onMote} className="mt-5" />

        {children ? (
          <div className="mt-8 border-t border-[var(--k-border)] pt-6">{children}</div>
        ) : null}
      </section>

      <div className="mt-6">
        <Knapp variant="diskret" onClick={dela}>
          {TEXT.resultat.dela}
        </Knapp>
        {delningsbesked ? (
          <p role="status" className="mt-2 px-3 text-sm text-[var(--k-text-body)]">
            {delningsbesked}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * "Boka ett möte" — samma bokning som sajtens "Boka samtal". Öppnas i en ny
 * flik, så att den fungerar även när kompassen visas i en ruta.
 */
export function MoteKnapp({ onMote, className = "" }: { onMote: () => void; className?: string }) {
  return (
    <a
      href={SAJT.bokaMote}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onMote}
      className={
        "k-btn-primar inline-flex min-h-12 w-full items-center justify-center rounded-full px-7 " +
        "text-base font-semibold whitespace-nowrap no-underline transition-all duration-200 sm:w-auto " +
        className
      }
    >
      {TEXT.resultat.mote.knapp}
    </a>
  );
}
