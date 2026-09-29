import { TEXT } from "@/kompass/data/kompass";

type Props = {
  nu: number;
  av: number;
};

/**
 * Förloppsindikator. Lästs upp av skärmläsare via aria-valuenow, och visas
 * som en enkel stapel — ingen animation som stjäl uppmärksamhet.
 */
export default function Forlopp({ nu, av }: Props) {
  const andel = av > 0 ? Math.round((nu / av) * 100) : 0;

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-[var(--k-text-body)]">
          {TEXT.navigering.steg(nu, av)}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={av}
        aria-valuenow={nu}
        aria-label={TEXT.navigering.steg(nu, av)}
        className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--k-card-bg)]"
      >
        <div
          className="h-full rounded-full bg-[var(--k-cta)] transition-[width] duration-300 ease-out"
          style={{ width: `${andel}%` }}
        />
      </div>
    </div>
  );
}
