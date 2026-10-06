"use client";

import { useState } from "react";
import { SAJT, TEXT } from "@/kompass/data/kompass";
import Drake from "@/kompass/komponenter/Drake";
import Knapp from "@/kompass/komponenter/Knapp";

type Props = {
  onStarta: () => void;
  /** Visas om det finns ett påbörjat flöde att fortsätta på. */
  harPaborjat: boolean;
  onFortsatt: () => void;
};

/** Så länge draken får flyga innan första frågan visas. Matchar .drake-flyger. */
const AVFARD = 650;

export default function StartVy({
  onStarta,
  harPaborjat,
  onFortsatt,
}: Props) {
  const [flyger, setFlyger] = useState(false);

  /** Draken flyger iväg först, sedan börjar flödet. */
  function gaVidare(vidare: () => void) {
    if (flyger) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      vidare();
      return;
    }
    setFlyger(true);
    window.setTimeout(vidare, AVFARD);
  }

  return (
    <div className="relative">
      {/* På bred skärm lånar draken plats till höger om textspalten, så att
          rubriken får rymmas på en rad. */}
      <div className="relative grid items-center gap-2 sm:grid-cols-[1fr_12.5rem] sm:gap-6 lg:-mr-40 lg:grid-cols-[1fr_15rem]">
        <div className="relative mx-auto sm:order-last">
          {/* Kopparsken bakom draken. Tar ingen plats i layouten. */}
          <div
            aria-hidden="true"
            className={`k-start-sken ${flyger ? "k-start-lamnar" : ""} top-1/2 left-1/2 h-[21.25rem] w-[21.25rem] -translate-x-1/2 -translate-y-1/2 sm:h-[28.75rem] sm:w-[28.75rem]`}
          />
          <Drake
            flyger={flyger}
            // k-drake-start: mindre på låga telefoner, se kompass.css.
            className="k-drake-start relative h-[11.875rem] w-[8.5rem] sm:h-[17.5rem] sm:w-[12.5rem] lg:h-[21rem] lg:w-[15rem]"
          />
        </div>

        <div className={flyger ? "k-start-lamnar" : ""}>
          <h1 className="k-tona-in text-3xl leading-tight text-balance font-semibold tracking-tight text-[var(--k-text)] sm:text-4xl">
            {TEXT.start.rubrik}
          </h1>
          <p
            style={{ "--i": 1 } as React.CSSProperties}
            className="k-tona-in mt-5 max-w-[40ch] text-lg leading-relaxed text-balance text-[var(--k-text-body)]"
          >
            {TEXT.start.underrubrik}
          </p>

          {/* Knappen före faktapillren: på en låg telefon ska den synas utan
              att man scrollar. Pillren blir en lugnande rad under den. */}
          <div
            style={{ "--i": 2 } as React.CSSProperties}
            className="k-tona-in mt-7 flex flex-wrap items-center gap-3"
          >
            {harPaborjat ? (
              <>
                <Knapp onClick={() => gaVidare(onFortsatt)}>
                  Fortsätt där du var
                </Knapp>
                <Knapp variant="sekundar" onClick={() => gaVidare(onStarta)}>
                  Börja om
                </Knapp>
              </>
            ) : (
              <Knapp onClick={() => gaVidare(onStarta)}>{TEXT.start.knapp}</Knapp>
            )}
          </div>

          <ul
            style={{ "--i": 3 } as React.CSSProperties}
            className="k-tona-in mt-5 flex flex-wrap gap-2"
          >
            {TEXT.start.fakta.map((f) => (
              <li
                key={f}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--k-border)] bg-white/60 px-3.5 py-1.5 text-[0.8125rem] font-semibold text-[var(--k-text-body)]"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rotate-45 bg-[var(--k-cta)]"
                />
                {f}
              </li>
            ))}
          </ul>

          <p
            style={{ "--i": 4 } as React.CSSProperties}
            className="k-tona-in mt-6 max-w-[42ch] text-[0.8125rem] leading-relaxed text-[var(--k-muted)]"
          >
            {TEXT.start.integritet}{" "}
            <a
              href={SAJT.integritetspolicy}
              className="underline underline-offset-4 hover:text-[var(--k-text-body)]"
            >
              {TEXT.start.integritetLank}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
