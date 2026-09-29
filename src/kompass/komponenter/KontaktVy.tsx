"use client";

import { useState } from "react";
import { SAJT, TEXT } from "@/kompass/data/kompass";
import Knapp from "@/kompass/komponenter/Knapp";

export type KontaktUppgifter = {
  kontakt_namn: string;
  foretag: string;
  telefon: string;
  mejl: string;
  ort: string;
  skicka_resultat: boolean;
  tips_namn: string;
  tips_kontakt: string;
  /** Honeypot. Fylls bara i av robotar — människor ser aldrig fältet. */
  webbplats: string;
};

type Props = {
  onSkicka: (uppgifter: KontaktUppgifter) => Promise<void>;
};

/**
 * Formuläret under smakprovet: ett fält och en knapp.
 *
 * Varje extra fält här kostar leads. Namn, företag och telefon frågar vi efter
 * på tacksidan i stället (KompletteraVy) — då har de redan sagt ja.
 */
export default function KontaktVy({ onSkicka }: Props) {
  const [mejl, setMejl] = useState("");
  const [webbplats, setWebbplats] = useState("");
  const [fel, setFel] = useState("");
  const [skickar, setSkickar] = useState(false);

  async function hanteraSkicka(e: React.FormEvent) {
    e.preventDefault();

    if (!mejl.trim()) {
      setFel(TEXT.kontakt.minstEtt);
      return;
    }

    setSkickar(true);
    try {
      await onSkicka({
        mejl,
        webbplats,
        // Resultatet skickas alltid — det är hela poängen med att lämna mejl.
        skicka_resultat: true,
        // Kompletteras frivilligt på tacksidan.
        kontakt_namn: "",
        foretag: "",
        telefon: "",
        ort: "",
        tips_namn: "",
        tips_kontakt: "",
      });
    } catch (e) {
      // Servern skickar redan ett svenskt besked om vad som gick fel.
      // Visa det om det finns, annars det generella.
      const besked =
        e instanceof Error && e.message !== "Kunde inte skicka"
          ? e.message
          : TEXT.fel.kontaktMisslyckades;
      setFel(besked);
      setSkickar(false);
    }
  }

  return (
    <section
      id="kontakt"
      aria-labelledby="kontakt-rubrik"
      style={{ "--i": 8 } as React.CSSProperties}
      className="k-tona-in mt-10 scroll-mt-6 rounded-3xl border-2 border-[var(--k-cta)] bg-[var(--k-card-bg)] p-6 sm:p-8"
    >
      <h2 id="kontakt-rubrik" className="k-rubrik text-3xl sm:text-4xl">
        {TEXT.kontakt.rubrik}
      </h2>
      <p className="mt-3 text-[1rem] leading-relaxed text-[var(--k-text-body)]">
        {TEXT.kontakt.brodtext}
      </p>

      <form onSubmit={hanteraSkicka} noValidate className="mt-6">
        <label htmlFor="mejl" className="mb-1.5 block text-sm font-semibold">
          {TEXT.kontakt.mejl}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="mejl"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder={TEXT.kontakt.mejlPlatshallare}
            value={mejl}
            onChange={(e) => {
              setMejl(e.target.value);
              setFel("");
            }}
            aria-describedby={fel ? "kontakt-fel" : undefined}
            className="min-h-12 w-full flex-1 rounded-full border border-[var(--k-border)] bg-[var(--k-bg)] px-5 text-base text-[var(--k-text)] placeholder:text-[var(--k-muted)]"
          />
          <Knapp type="submit" disabled={skickar} className="w-full sm:w-auto">
            {skickar ? TEXT.kontakt.skickar : TEXT.kontakt.skicka}
          </Knapp>
        </div>

        {/* Honeypot. Dolt för människor, lockande för robotar. */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="webbplats">Lämna detta fält tomt</label>
          <input
            id="webbplats"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={webbplats}
            onChange={(e) => setWebbplats(e.target.value)}
          />
        </div>

        {fel ? (
          <p
            id="kontakt-fel"
            role="alert"
            className="mt-3 text-sm font-medium text-[var(--k-cta)]"
          >
            {fel}
          </p>
        ) : null}

        <p className="mt-4 text-sm leading-relaxed text-[var(--k-muted)]">
          {TEXT.kontakt.gdpr}{" "}
          <a
            href={SAJT.integritetspolicy}
            className="underline underline-offset-4 hover:text-[var(--k-text-body)]"
          >
            {TEXT.kontakt.gdprLank}
          </a>
          .
        </p>
      </form>
    </section>
  );
}
