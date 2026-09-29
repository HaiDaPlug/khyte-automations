"use client";

import { useState } from "react";
import { ROLLER, TEXT, TIDSHORISONTER } from "@/kompass/data/kompass";
import Knapp from "@/kompass/komponenter/Knapp";
import { komplettera, type Komplettering } from "@/kompass/lib/klient";

type Props = {
  sessionId: string;
};

const TOMT: Komplettering = {
  kontakt_namn: "",
  foretag: "",
  telefon: "",
  ort: "",
  tips_namn: "",
  tips_kontakt: "",
  roll: "",
  tidshorisont: "",
};

const FALT =
  "w-full rounded-xl border border-[var(--k-border)] bg-[var(--k-bg)] " +
  "px-4 py-3 text-base text-[var(--k-text)] placeholder:text-[var(--k-muted)]";

/**
 * Frivilligt steg på tacksidan: namn, företag, telefon, ort, roll och när de
 * vill komma igång. Roll och tidshorisont frågades förut före resultatet —
 * här hjälper de oss förbereda samtalet, när kunden redan fått sitt svar.
 *
 * De har redan lämnat mejl och fått sitt resultat — det här är ren bonus för
 * säljaren. Därför ligger det här och inte i formuläret före resultatet.
 */
export default function KompletteraVy({ sessionId }: Props) {
  const [uppgifter, setUppgifter] = useState<Komplettering>(TOMT);
  const [lage, setLage] = useState<"redo" | "skickar" | "klar">("redo");
  const [fel, setFel] = useState("");

  const nagotIfyllt = Object.values(uppgifter).some((v) => v.trim());

  function andra(nyckel: keyof Komplettering, varde: string) {
    setUppgifter((u) => ({ ...u, [nyckel]: varde }));
    setFel("");
  }

  async function hanteraSkicka(e: React.FormEvent) {
    e.preventDefault();
    if (!nagotIfyllt || lage !== "redo") return;

    setLage("skickar");
    try {
      await komplettera(sessionId, uppgifter);
      setLage("klar");
    } catch (e) {
      setFel(e instanceof Error ? e.message : TEXT.komplettera.fel);
      setLage("redo");
    }
  }

  if (lage === "klar") {
    return (
      <p
        role="status"
        className="k-tona-in mt-8 rounded-2xl bg-[var(--k-card-bg)] p-5 text-[0.9375rem] font-semibold text-[var(--k-text)]"
      >
        {TEXT.komplettera.tack}
      </p>
    );
  }

  const falt = (
    nyckel: keyof Komplettering,
    etikett: string,
    extra: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <div>
      <label htmlFor={`k-${nyckel}`} className="mb-1.5 block text-sm font-semibold">
        {etikett}
      </label>
      <input
        id={`k-${nyckel}`}
        type="text"
        value={uppgifter[nyckel]}
        onChange={(e) => andra(nyckel, e.target.value)}
        className={FALT}
        {...extra}
      />
    </div>
  );

  /** En rad val — roll eller tidshorisont. Ett tryck till väljer bort igen. */
  const val = (nyckel: "roll" | "tidshorisont", etikett: string, alternativ: readonly string[]) => (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{etikett}</legend>
      <div className="flex flex-wrap gap-2">
        {alternativ.map((a) => {
          const vald = uppgifter[nyckel] === a;
          return (
            <label key={a} data-vald={vald} className="k-snabbval">
              <input
                type="radio"
                name={`k-${nyckel}`}
                value={a}
                checked={vald}
                onChange={() => undefined}
                onClick={() => andra(nyckel, vald ? "" : a)}
                className="k-bara-skarmlasare"
              />
              {a}
            </label>
          );
        })}
      </div>
    </fieldset>
  );

  return (
    <section
      aria-labelledby="komplettera-rubrik"
      className="k-tona-in mt-8 rounded-3xl border border-[var(--k-border)] bg-[var(--k-card-bg)] p-6 sm:p-7"
    >
      <h2 id="komplettera-rubrik" className="text-lg font-bold text-[var(--k-text)]">
        {TEXT.komplettera.rubrik}
      </h2>
      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[var(--k-text-body)]">
        {TEXT.komplettera.brodtext}
      </p>

      <form onSubmit={hanteraSkicka} className="mt-5 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {falt("kontakt_namn", TEXT.kontakt.namn, { autoComplete: "name" })}
          {falt("foretag", TEXT.kontakt.foretag, { autoComplete: "organization" })}
          {falt("telefon", TEXT.kontakt.telefon, {
            type: "tel",
            inputMode: "tel",
            autoComplete: "tel",
          })}
          {falt("ort", TEXT.kontakt.ort, { autoComplete: "address-level2" })}
        </div>

        {val("roll", TEXT.komplettera.roll, ROLLER)}
        {val("tidshorisont", TEXT.komplettera.tidshorisont, TIDSHORISONTER)}

        {/* Tips är ett tillägg till tillägget — därför hopfällt. */}
        <details className="rounded-2xl border border-[var(--k-border)] px-5 py-1">
          <summary className="cursor-pointer py-3 text-[0.9375rem] font-semibold">
            {TEXT.kontakt.tipsRubrik}
          </summary>
          <div className="mt-1 grid gap-4 pb-4 sm:grid-cols-2">
            {falt("tips_namn", TEXT.kontakt.tipsNamn)}
            {falt("tips_kontakt", TEXT.kontakt.tipsKontakt)}
          </div>
        </details>

        {fel ? (
          <p role="alert" className="text-sm font-medium text-[var(--k-cta)]">
            {fel}
          </p>
        ) : null}

        <div>
          <Knapp type="submit" disabled={!nagotIfyllt || lage === "skickar"}>
            {lage === "skickar" ? TEXT.kontakt.skickar : TEXT.komplettera.skicka}
          </Knapp>
        </div>
      </form>
    </section>
  );
}
