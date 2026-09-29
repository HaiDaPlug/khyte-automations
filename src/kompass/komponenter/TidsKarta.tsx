import type { CSSProperties } from "react";
import { TEXT } from "@/kompass/data/kompass";
import { formateraTimmarKort } from "@/kompass/lib/tid";
import type { Intervall, OmradeResultat } from "@/kompass/lib/typer";

type Props = {
  omraden: OmradeResultat[];
};

/** Mitten av ett spann — staplarnas längd. Etiketterna visar hela spannet. */
const mitt = (i: Intervall) => (i.min + i.max) / 2;

/**
 * Var tiden går: en liggande stapel per område.
 *
 * Hela stapeln är tiden de lägger i dag, den mörka delen det som troligen går
 * att spara. Två steg ur samma kopparramp — validerade mot bakgrunden med
 * dataviz-skriptet (se globals.css, .karta-*). Den ljusa delen har låg
 * kontrast, därför står värdet alltid utskrivet vid stapeln, och en dold
 * tabell bär samma siffror för skärmläsare.
 */
export default function TidsKarta({ omraden }: Props) {
  const rader = omraden
    .filter((o): o is OmradeResultat & { lagt: Intervall } => !!o.lagt)
    .sort((a, b) => mitt(b.lagt) - mitt(a.lagt));

  if (rader.length === 0) return null;

  // Längsta stapeln tar 100 % av spåret. Resten skalas mot den.
  const skala = Math.max(...rader.map((r) => mitt(r.lagt)));

  return (
    <figure className="mt-6 rounded-2xl border border-[var(--k-border)] bg-[var(--k-card-bg)] p-5">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <span className="text-[0.8125rem] font-semibold tracking-wide text-[var(--k-muted)] uppercase">
          {TEXT.resultat.karta.rubrik}
        </span>
        {/* Förklaring: två serier, alltid synlig. */}
        <span
          aria-hidden="true"
          className="flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem] text-[var(--k-text-body)]"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="k-karta-nyckel k-karta-spara" />
            {TEXT.resultat.karta.spara}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="k-karta-nyckel k-karta-rest" />
            {TEXT.resultat.karta.rest}
          </span>
        </span>
      </figcaption>

      <ul aria-hidden="true" className="mt-4 flex flex-col gap-4">
        {rader.map((r, i) => {
          const helt = (mitt(r.lagt) / skala) * 100;
          // Andelen av stapeln som går att spara. Aldrig mer än hela stapeln.
          const andel = Math.min(1, mitt(r.besparing) / mitt(r.lagt));

          return (
            <li key={r.omrade.id}>
              <p className="text-sm font-semibold text-[var(--k-text)]">
                {r.omrade.namn}
              </p>
              <div className="mt-1.5 flex items-center gap-2.5">
                {/* Spåret tar all plats utom etiketten; stapeln skalas i det. */}
                <div className="min-w-0 flex-1">
                  <div
                    className="k-karta-stapel flex h-4"
                    style={{ width: `${helt}%`, "--i": i } as CSSProperties}
                  >
                    {andel > 0 ? (
                      <span
                        className="k-karta-spara h-full"
                        style={{ width: `${andel * 100}%` }}
                      />
                    ) : null}
                    {andel < 1 ? (
                      <span className="k-karta-rest h-full flex-1" />
                    ) : null}
                  </div>
                </div>
                {/* Allt på en rad: tiden i dag, och i ljusare text det som går
                    att spara. Tidigare en egen rad per område — för mycket text. */}
                <span className="shrink-0 text-sm whitespace-nowrap">
                  <span className="font-semibold text-[var(--k-text)]">
                    {formateraTimmarKort(r.lagt)}
                  </span>
                  {r.besparing.max > 0 ? (
                    <span className="text-[var(--k-text-body)]">
                      {" "}
                      · {TEXT.resultat.karta.sparaKort} {formateraTimmarKort(r.besparing)}
                    </span>
                  ) : null}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Samma siffror som tabell, för skärmläsare. Döljs via en div — en
          tabell struntar i width: 1px och skulle ge sidledsscroll. */}
      <div className="k-bara-skarmlasare">
        <table>
          <caption>{TEXT.resultat.karta.rubrik}</caption>
          <thead>
            <tr>
              <th scope="col">Område</th>
              <th scope="col">{TEXT.resultat.karta.idag}</th>
              <th scope="col">{TEXT.resultat.karta.spara}</th>
            </tr>
          </thead>
          <tbody>
            {rader.map((r) => (
              <tr key={r.omrade.id}>
                <th scope="row">{r.omrade.namn}</th>
                <td>{formateraTimmarKort(r.lagt)} i veckan</td>
                <td>{formateraTimmarKort(r.besparing)} i veckan</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
