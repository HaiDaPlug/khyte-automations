import type { CSSProperties } from "react";
import { TEXT } from "@/kompass/data/kompass";
import type { Plansteg } from "@/kompass/lib/typer";

type Props = {
  plan: Plansteg[];
};

/**
 * "Klart när offerterna skrivs från mallar …" → "Offerterna skrivs från
 * mallar …". Resultatet av fasen, som en mening — det är det besökaren vill
 * veta. Hur det görs står i mejlet.
 */
function utfall(steg: Plansteg): string {
  const t = (steg.klartNar ?? steg.text).replace(/^(klart när|när)\s+/i, "");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/**
 * Planen, kort: fasens namn och vad som är annorlunda när den är klar.
 * Syns även i låst läge. Hela texten per fas finns i resultatmejlet.
 */
export default function PlanVy({ plan }: Props) {
  if (plan.length === 0) return null;

  return (
    <section aria-labelledby="plan-rubrik" className="mt-10">
      <h2 id="plan-rubrik" className="k-rubrik text-2xl text-[var(--k-text-body)]">
        {TEXT.resultat.plan.rubrik}
      </h2>
      <ol className={`mt-4 grid gap-3 ${plan.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {plan.map((steg, i) => (
          <li
            key={i}
            style={{ "--i": i } as CSSProperties}
            className="k-tona-in rounded-2xl border border-[var(--k-border)] bg-[var(--k-card-bg)] p-4"
          >
            <p className="text-[0.75rem] font-bold tracking-wide text-[var(--k-cta)] uppercase">
              {TEXT.resultat.plan.fas(i + 1)} · {steg.rubrik}
            </p>
            <p className="mt-1.5 text-sm leading-snug text-[var(--k-text)]">{utfall(steg)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
