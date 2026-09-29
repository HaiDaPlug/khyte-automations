import { CASE, TEXT } from "@/kompass/data/kompass";
import { tolkaForslag } from "@/kompass/lib/forslagstext";
import { formateraTimmar, formateraTimmarKort } from "@/kompass/lib/tid";
import type { Forslag } from "@/kompass/lib/typer";

/** Claudes förslag på det besökaren vill slippa. */
export type ForslagLage =
  | { status: "laddar" }
  | { status: "klar"; text: string }
  | { status: "saknas" };

type Props = {
  forslag: Forslag;
  nummer: number;
  /** Bara för önskemålet — dess flöde kommer från Claude. */
  claude?: ForslagLage;
  /** Visas under det synliga kortet i låst läge: vägen vidare till formuläret. */
  visaVidare?: boolean;
};

const ETIKETT =
  "text-[0.75rem] font-semibold tracking-wide text-[var(--k-muted)] uppercase";

/**
 * Vad förslaget bygger på, i en rad. Har de angett tid: områdena och tiden.
 * Annars förslagets egen förklaring (t.ex. missade samtal, eller att det är
 * vanligt i branschen) — den är redan kort.
 */
function bevis(forslag: Forslag): string {
  const omraden = forslag.omraden ?? (forslag.omrade ? [forslag.omrade] : []);
  if (forslag.lagt && omraden.length) {
    const namn = omraden.map((o) => o.namn.toLowerCase()).join(" + ");
    return `${TEXT.resultat.byggerPa} ${namn} — ${formateraTimmar(forslag.lagt)} i veckan i dag.`;
  }
  return forslag.varfor;
}

/**
 * Ett förslag, kort nog att läsas på en telefon: rubrik, vad det sparar, vad
 * det betyder för företaget, vad det bygger på, flödet steg för steg och
 * första steget. Den längre versionen — varför, vad som försvinner, hur vi
 * räknade — står i resultatmejlet.
 */
export default function ForslagKort({
  forslag,
  nummer,
  claude,
  visaVidare = false,
}: Props) {
  const { omrade, kalla } = forslag;
  // Högst ett case per kort — det ska bevisa, inte ta över.
  const fall = [
    ...new Set([
      ...(omrade?.caseIds ?? []),
      ...(forslag.omraden ?? []).flatMap((o) => o.caseIds ?? []),
    ]),
  ]
    .map((id) => CASE[id])
    .filter(Boolean)
    .slice(0, 1);

  // Önskemålets flöde kommer från Claude och tolkas till samma form.
  const claudeFlode =
    kalla === "onskemal" && claude?.status === "klar"
      ? tolkaForslag(claude.text)
      : null;
  // Medan Claude arbetar visas inga steg. Svarar Claude inte visas
  // regelmotorns reserv (steg för det område fritexten pekar på), om det finns.
  const laddar = kalla === "onskemal" && claude?.status === "laddar";
  const steg = claudeFlode ? claudeFlode.steg : laddar ? [] : forslag.steg;

  return (
    <article
      className={
        "rounded-3xl bg-[var(--k-card-bg)] p-5 sm:p-6 " +
        (kalla === "onskemal"
          ? "border-2 border-[var(--k-cta)]"
          : "border border-[var(--k-border)]")
      }
    >
      <div className="flex items-baseline gap-3">
        <span aria-hidden="true" className="k-rubrik text-xl text-[var(--k-cta)]">
          {String(nummer).padStart(2, "0")}.
        </span>
        <h3 className="k-rubrik text-xl sm:text-2xl">{forslag.rubrik}</h3>
      </div>

      <Chips forslag={forslag} />

      {/* Vad det betyder för företaget — det första de läser. */}
      {forslag.affarsnytta ? (
        <p className="mt-4 border-l-4 border-[var(--k-cta)] pl-3 text-base leading-snug font-semibold text-[var(--k-text)]">
          <span className="k-bara-skarmlasare">{TEXT.resultat.affarsnytta}: </span>
          {forslag.affarsnytta}
        </p>
      ) : null}

      {/* Vad det bygger på — en rad. För önskemålet: deras egna ord. */}
      {kalla === "onskemal" ? (
        <p className="mt-3 text-lg leading-snug font-semibold text-[var(--k-text)]">
          ”{forslag.varfor}”
        </p>
      ) : (
        <p className="mt-2.5 text-sm leading-relaxed text-[var(--k-text-body)]">{bevis(forslag)}</p>
      )}

      {/* Flödet. */}
      <div className="mt-5">
        <p className={ETIKETT}>{TEXT.resultat.flode}</p>

        {claudeFlode?.sammanfattning ? (
          <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[var(--k-text)]">
            {claudeFlode.sammanfattning}
          </p>
        ) : null}

        {kalla === "onskemal" && !claudeFlode && (laddar || steg.length === 0) ? (
          <p aria-live="polite" className="mt-1.5 text-[0.9375rem] text-[var(--k-text-body)]">
            {laddar ? TEXT.resultat.onskemal.laddar : TEXT.resultat.onskemal.saknas}
          </p>
        ) : null}

        {steg.length > 0 ? <Steg steg={steg.slice(0, SYNLIGA_STEG)} forsta={1} /> : null}

        {/* Resten av flödet bakom ett klick — läsbart på en blick, men inget
            försvinner för den som vill se allt. */}
        {steg.length > SYNLIGA_STEG ? (
          <details className="mt-3">
            <summary className="cursor-pointer py-3 text-sm font-semibold text-[var(--k-cta)]">
              {TEXT.resultat.flerSteg(steg.length - SYNLIGA_STEG)}
            </summary>
            <Steg steg={steg.slice(SYNLIGA_STEG)} forsta={SYNLIGA_STEG + 1} />
          </details>
        ) : null}
      </div>

      {/* Pengar bara när vi kan stå för dem — en rad. */}
      {forslag.pengar ? (
        <p className="mt-4 text-sm leading-relaxed text-[var(--k-text-body)]">{forslag.pengar}</p>
      ) : null}

      {fall.map((c) => (
        <figure key={c.id} className="mt-4 border-l-2 border-[var(--k-cta)] pl-3">
          <blockquote className="text-sm leading-relaxed text-[var(--k-text)] italic">
            ”{c.citat ?? c.resultat}”
          </blockquote>
          <figcaption className="mt-1 text-[0.8125rem] text-[var(--k-muted)]">
            {c.namn ? `${c.namn}, ` : ""}
            {c.foretag} ·{" "}
            <a href={c.lank} className="font-semibold text-[var(--k-cta)] underline underline-offset-4">
              {TEXT.resultat.lasCase}
            </a>
          </figcaption>
        </figure>
      ))}

      {forslag.forstaSteget ? (
        <p className="mt-4 rounded-xl bg-[var(--k-bg)] px-3.5 py-2.5 text-sm leading-relaxed text-[var(--k-text)]">
          <span className="font-semibold">{TEXT.resultat.forstaSteget}:</span> {forslag.forstaSteget}
        </p>
      ) : null}

      {visaVidare ? (
        <p className="mt-5 border-t border-[var(--k-border)] pt-4 text-[0.9375rem] leading-relaxed text-[var(--k-text)]">
          {TEXT.resultat.vidare}{" "}
          <a
            href="#kontakt"
            className="font-semibold text-[var(--k-cta)] underline underline-offset-4"
          >
            {TEXT.resultat.vidareLank}
          </a>
        </p>
      ) : null}
    </article>
  );
}

/** Stegen som syns direkt. Resten ligger bakom "+ N steg till". */
const SYNLIGA_STEG = 3;

function Steg({ steg, forsta }: { steg: string[]; forsta: number }) {
  return (
    <ol className="k-flode mt-3" start={forsta}>
      {steg.map((s, i) => (
        <li key={i} className="k-flode-steg">
          <span aria-hidden="true" className="k-flode-nummer">
            {forsta + i}
          </span>
          <span className="text-sm leading-relaxed text-[var(--k-text)]">{s}</span>
        </li>
      ))}
    </ol>
  );
}

/**
 * En rad chips: vad det sparar (koppar), om lösningen finns färdig, och
 * varifrån förslaget kommer när det inte är deras eget val.
 */
function Chips({ forslag }: { forslag: Forslag }) {
  const { omrade, kalla, besparing } = forslag;
  const kallaText =
    kalla === "signal"
      ? TEXT.resultat.kalla.signal
      : kalla === "bransch"
        ? TEXT.resultat.kalla.bransch
        : kalla === "ide"
          ? TEXT.resultat.kalla.ide
          : null;

  if (!besparing && !omrade && !kallaText) return null;

  return (
    <p className="mt-3 flex flex-wrap gap-1.5">
      {besparing ? (
        <span className="rounded-full bg-[var(--k-cta)] px-3 py-1 text-[0.75rem] font-semibold text-white">
          {TEXT.resultat.sparar(formateraTimmarKort(besparing))}
        </span>
      ) : null}
      {kallaText ? (
        <span className="rounded-full bg-[var(--k-text)] px-3 py-1 text-[0.75rem] font-semibold text-white">
          {kallaText}
        </span>
      ) : null}
      {omrade ? (
        <span className="rounded-full bg-[var(--k-bg)] px-3 py-1 text-[0.75rem] font-semibold text-[var(--k-text-body)]">
          {omrade.fardig ? TEXT.resultat.fardig : TEXT.resultat.skraddarsydd}
        </span>
      ) : null}
    </p>
  );
}
