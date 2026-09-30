"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { MAX_FRITEXT, TEXT, type Delfraga, type Fraga } from "@/kompass/data/kompass";
import Knapp from "@/kompass/komponenter/Knapp";
import { arBesvarad } from "@/kompass/lib/flode";
import type { Svar } from "@/kompass/lib/typer";

type Props = {
  fraga: Fraga;
  svar: Svar;
  onSvara: (id: string, varde: string | string[]) => void;
  onNasta: () => void;
  onTillbaka: () => void;
  kanGaTillbaka: boolean;
  arSista: boolean;
  /** Åt vilket håll frågan glider in — framåt från höger, bakåt från vänster. */
  riktning: "fram" | "bak";
};

/** Hur länge ett valt alternativ syns innan flödet går vidare. */
const PAUS_UTAN_REAKTION = 350;

/** På en skärm med flera delar: lite längre, så att man hinner se helheten. */
const PAUS_GRUPP = 550;

/** Utgångsanimationens längd. Samma som .fraga-lamnar i globals.css. */
const UTGANG = 180;

/** Lästid för en reaktion: grundtid plus lite per tecken, med tak. */
function lastid(text: string): number {
  return Math.min(1400 + text.length * 25, 3800);
}

/** Gör alternativets index tillgängligt för den förskjutna intoningen. */
const ordning = (i: number) => ({ "--i": i }) as CSSProperties;

export default function FragaVy({
  fraga,
  svar,
  onSvara,
  onNasta,
  onTillbaka,
  kanGaTillbaka,
  arSista,
  riktning,
}: Props) {
  const [visaFel, setVisaFel] = useState(false);
  const [reaktion, setReaktion] = useState("");
  /** Millisekunder tills flödet går vidare av sig självt. 0 = väntar på knapp. */
  const [autoOm, setAutoOm] = useState(0);
  const [lamnar, setLamnar] = useState(false);
  const [tangentbordsval, setTangentbordsval] = useState(false);
  // Var frågan redan besvarad när den visades? Då har användaren backat hit
  // och behöver en Nästa-knapp för att gå vidare utan att byta svar.
  const [besvaradVidStart] = useState(() => arBesvarad(fraga, svar));

  const rubrikRef = useRef<HTMLHeadingElement>(null);
  const timer = useRef<number | undefined>(undefined);
  // Pekare (mus/touch) går vidare automatiskt. Tangentbord gör det inte —
  // piltangenter byter alternativ i en radiogrupp, och då ska man inte
  // kastas till nästa fråga.
  const medPekare = useRef(false);
  // Timern ska anropa den onNasta som gäller när den löser ut, inte den som
  // fanns vid klicket — då var det nya svaret ännu inte med i föräldern.
  const nastaRef = useRef(onNasta);

  useEffect(() => {
    nastaRef.current = onNasta;
  });

  // Flytta fokus till frågan vid varje steg, så att skärmläsare och
  // tangentbord följer med i flödet i stället för att ligga kvar på knappen.
  // Allt annat nollställs av sig självt: vyn monteras om per fråga (key).
  useEffect(() => {
    rubrikRef.current?.focus();
  }, [fraga.id]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const besvarad = arBesvarad(fraga, svar);

  /** Spelar utgången och går sedan vidare. */
  function gaVidare() {
    window.clearTimeout(timer.current);
    setLamnar(true);
    timer.current = window.setTimeout(() => nastaRef.current(), UTGANG);
  }

  function hanteraNasta() {
    if (lamnar) return;
    if (!besvarad) {
      setVisaFel(true);
      return;
    }
    gaVidare();
  }

  /**
   * Ett tryck på ett envalsalternativ — på en hel skärm eller en del av en.
   * Går vidare av sig självt när skärmen är komplett.
   */
  function valj(
    id: string,
    alternativ: string,
    reaktioner: Readonly<Record<string, string>> | undefined,
    blirKomplett: boolean,
    paus: number,
  ) {
    if (lamnar) return;

    onSvara(id, alternativ);
    setVisaFel(false);
    window.clearTimeout(timer.current);

    // En ny reaktion ersätter den gamla. Ett val utan reaktion låter den
    // förra stå kvar — den kan fortfarande vara relevant på skärmen.
    const text = reaktioner?.[alternativ] ?? "";
    if (text) setReaktion(text);

    if (!blirKomplett) {
      setAutoOm(0);
      return;
    }

    if (!medPekare.current) {
      setTangentbordsval(true);
      setAutoOm(0);
      return;
    }

    const vantan = text ? lastid(text) : paus;
    setAutoOm(text ? vantan : 0);
    timer.current = window.setTimeout(gaVidare, vantan);
  }

  function valjEnval(alternativ: string) {
    if (fraga.typ !== "enval") return;
    valj(fraga.id, alternativ, fraga.reaktioner, true, PAUS_UTAN_REAKTION);
  }

  function valjDel(del: Delfraga, alternativ: string) {
    if (fraga.typ !== "grupp") return;

    // Flerval på en rad: växla, och gå aldrig vidare av sig själv — annars
    // skulle skärmen hoppa vidare efter första valet.
    if (del.flerval) {
      const nu = Array.isArray(svar[del.id]) ? (svar[del.id] as string[]) : [];
      const nya = nu.includes(alternativ)
        ? nu.filter((v) => v !== alternativ)
        : [...nu, alternativ];
      onSvara(del.id, nya);
      setVisaFel(false);
      return;
    }

    const efter: Svar = { ...svar, [del.id]: alternativ };
    const komplett = fraga.delar.every((d) =>
      d.flerval
        ? Array.isArray(efter[d.id]) && (efter[d.id] as string[]).length > 0
        : typeof efter[d.id] === "string",
    );
    // En skärm med en flervalsrad går inte vidare av sig själv.
    const autoVidare = komplett && !fraga.delar.some((d) => d.flerval);
    valj(del.id, alternativ, del.reaktioner, autoVidare, PAUS_GRUPP);
  }

  function vaxlaFlerval(alternativ: string) {
    if (fraga.typ !== "flerval") return;
    const varde = svar[fraga.id];
    const valda = Array.isArray(varde) ? varde : [];

    const nya = valda.includes(alternativ)
      ? valda.filter((v) => v !== alternativ)
      : [...valda, alternativ];

    // Taket hindras redan i gränssnittet, men tangentbord och snabba tryck
    // ska inte kunna ta sig förbi det.
    if (fraga.max && nya.length > fraga.max) return;

    onSvara(fraga.id, nya);
    setVisaFel(false);
  }

  // Enval och delskärmar går vidare av sig själva, så knappen behövs bara
  // när man backat hit, valt med tangentbordet eller vill hoppa förbi en
  // reaktion.
  const visaNasta =
    fraga.typ === "flerval" ||
    fraga.typ === "fritext" ||
    (fraga.typ === "grupp" && fraga.delar.some((d) => d.flerval)) ||
    besvaradVidStart ||
    tangentbordsval ||
    (!!reaktion && besvarad);

  const felId = `fel-${fraga.id}`;
  const hjalpId = `hjalp-${fraga.id}`;

  const animation = lamnar
    ? "k-fraga-lamnar"
    : riktning === "bak"
      ? "k-fraga-in-bak"
      : "k-fraga-in-fram";

  // Pekare eller tangentbord — se medPekare ovan.
  const inmatningsLyssnare = {
    onPointerDown: () => {
      medPekare.current = true;
    },
    onKeyDown: () => {
      medPekare.current = false;
    },
  };

  return (
    <div className={animation}>
      {fraga.typ === "grupp" && fraga.overrubrik ? (
        <p className="mb-2 text-[0.8125rem] font-semibold tracking-wide text-[var(--k-cta)] uppercase">
          {fraga.overrubrik}
        </p>
      ) : null}

      <h1
        ref={rubrikRef}
        tabIndex={-1}
        className="text-2xl leading-tight font-semibold tracking-tight text-[var(--k-text)] outline-none sm:text-[1.75rem]"
      >
        {fraga.fraga}
      </h1>

      {fraga.hjalptext ? (
        <p
          id={hjalpId}
          className="mt-3 text-[0.9375rem] text-[var(--k-text-body)]"
        >
          {fraga.hjalptext}
        </p>
      ) : null}

      <div className="mt-7" {...inmatningsLyssnare}>
        {fraga.typ === "fritext" ? (
          <textarea
            id={fraga.id}
            value={typeof svar[fraga.id] === "string" ? (svar[fraga.id] as string) : ""}
            onChange={(e) => onSvara(fraga.id, e.target.value)}
            placeholder={fraga.platshallare}
            rows={3}
            maxLength={MAX_FRITEXT}
            aria-label={fraga.fraga}
            aria-describedby={fraga.hjalptext ? hjalpId : undefined}
            className="k-alternativ-in w-full resize-y rounded-2xl border border-[var(--k-border)] bg-[var(--k-card-bg)] p-4 text-base text-[var(--k-text)] placeholder:text-[var(--k-muted)]"
          />
        ) : null}

        {fraga.typ === "grupp" ? (
          <div className="flex flex-col gap-7">
            {fraga.delar.map((del, radIndex) => (
              <DelRad
                key={del.id}
                del={del}
                valda={
                  Array.isArray(svar[del.id])
                    ? (svar[del.id] as string[])
                    : typeof svar[del.id] === "string"
                      ? [svar[del.id] as string]
                      : []
                }
                forskjutning={radIndex * 3}
                onValj={(a) => valjDel(del, a)}
              />
            ))}
          </div>
        ) : null}

        {fraga.typ === "enval" || fraga.typ === "flerval" ? (
          <AlternativLista
            fraga={fraga}
            svar={svar}
            beskrivning={
              [fraga.hjalptext ? hjalpId : null, visaFel ? felId : null]
                .filter(Boolean)
                .join(" ") || undefined
            }
            onEnval={valjEnval}
            onFlerval={vaxlaFlerval}
          />
        ) : null}
      </div>

      {/* Reaktionen läses upp av skärmläsare när den dyker upp. */}
      <div aria-live="polite">
        {reaktion ? (
          <div
            key={reaktion}
            className="k-reaktion mt-5 overflow-hidden rounded-2xl border-l-4 border-[var(--k-cta)] bg-[var(--k-card-bg)]"
          >
            <p className="px-5 py-4 text-[0.9375rem] leading-relaxed text-[var(--k-text)]">
              {reaktion}
            </p>
            {autoOm > 0 ? (
              <span
                aria-hidden="true"
                className="k-reaktion-tid"
                style={{ animationDuration: `${autoOm}ms` }}
              />
            ) : null}
          </div>
        ) : null}
      </div>

      {visaFel ? (
        <p id={felId} role="alert" className="mt-4 text-sm text-[var(--k-cta)]">
          {fraga.typ === "grupp"
            ? TEXT.fel.obligatorisktGrupp
            : TEXT.fel.obligatoriskt}
        </p>
      ) : null}

      {/* k-knappfalt: fast i nederkant på mobil, se kompass.css. */}
      <div className="k-knappfalt mt-8 flex min-h-12 flex-wrap items-center gap-3">
        {visaNasta ? (
          <Knapp onClick={hanteraNasta}>
            {arSista ? TEXT.navigering.seResultat : TEXT.navigering.nasta}
          </Knapp>
        ) : null}

        {kanGaTillbaka ? (
          <Knapp variant="diskret" onClick={onTillbaka}>
            {TEXT.navigering.tillbaka}
          </Knapp>
        ) : null}

        {fraga.typ === "fritext" ? (
          <Knapp variant="diskret" onClick={gaVidare}>
            {TEXT.navigering.hoppaOver}
          </Knapp>
        ) : null}
      </div>
    </div>
  );
}

/** En del av en grupp-skärm: frågan och en rad med snabbval. */
function DelRad({
  del,
  valda,
  forskjutning,
  onValj,
}: {
  del: Delfraga;
  /** Valda alternativ — ett för enval, flera för flerval. */
  valda: string[];
  /** Var i intoningen raden börjar, så att raderna tonar in i tur och ordning. */
  forskjutning: number;
  onValj: (alternativ: string) => void;
}) {
  const hjalpId = `hjalp-${del.id}`;

  return (
    <fieldset aria-describedby={del.hjalptext ? hjalpId : undefined}>
      <legend className="text-[1rem] font-semibold text-[var(--k-text)]">
        {del.fraga}
      </legend>
      {del.hjalptext ? (
        <p id={hjalpId} className="mt-1 text-sm text-[var(--k-text-body)]">
          {del.hjalptext}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {del.alternativ.map((alternativ, i) => {
          const vald = valda.includes(alternativ);
          return (
            <label
              key={alternativ}
              data-vald={vald}
              style={ordning(forskjutning + i)}
              className="k-snabbval k-alternativ-in"
            >
              <input
                type={del.flerval ? "checkbox" : "radio"}
                name={del.id}
                value={alternativ}
                checked={vald}
                // onClick i stället för onChange: löser ut även när man trycker
                // på redan valt alternativ efter att ha backat.
                onChange={() => undefined}
                onClick={() => onValj(alternativ)}
                className="k-bara-skarmlasare"
              />
              {del.flerval && vald ? (
                <span aria-hidden="true" className="mr-1.5">✓</span>
              ) : null}
              {alternativ}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Enval eller flerval som kort — i en lista eller i två kolumner. */
function AlternativLista({
  fraga,
  svar,
  beskrivning,
  onEnval,
  onFlerval,
}: {
  fraga: Extract<Fraga, { typ: "enval" | "flerval" }>;
  svar: Svar;
  beskrivning: string | undefined;
  onEnval: (alternativ: string) => void;
  onFlerval: (alternativ: string) => void;
}) {
  const varde = svar[fraga.id];
  const valda = Array.isArray(varde) ? varde : [];
  const valt = typeof varde === "string" ? varde : "";

  const max = fraga.typ === "flerval" ? fraga.max : undefined;
  const fullt = max !== undefined && valda.length >= max;

  return (
    <fieldset aria-describedby={beskrivning}>
      <legend className="k-bara-skarmlasare">{fraga.fraga}</legend>

      <div
        className={
          fraga.rutnat
            ? "grid grid-cols-2 gap-2.5"
            : "flex flex-col gap-3"
        }
      >
        {fraga.alternativ.map((alternativ, i) => {
          const arVald =
            fraga.typ === "flerval"
              ? valda.includes(alternativ)
              : valt === alternativ;
          const last = fraga.typ === "flerval" && fullt && !arVald;

          return (
            <label
              key={alternativ}
              data-vald={arVald}
              data-last={last}
              style={ordning(i)}
              className={
                "k-alternativ k-alternativ-in flex cursor-pointer items-center rounded-2xl " +
                (fraga.rutnat
                  ? "min-h-14 gap-2.5 px-3.5 py-3"
                  : "min-h-14 gap-3 px-5 py-4")
              }
            >
              <input
                type={fraga.typ === "flerval" ? "checkbox" : "radio"}
                name={fraga.id}
                value={alternativ}
                checked={arVald}
                disabled={last}
                // Enval hanteras i onClick: den löser ut även när man
                // klickar på ett redan valt alternativ efter att ha
                // backat, vilket onChange inte gör.
                onChange={() => {
                  if (fraga.typ === "flerval") onFlerval(alternativ);
                }}
                onClick={() => {
                  if (fraga.typ === "enval") onEnval(alternativ);
                }}
                className="h-5 w-5 shrink-0 accent-[var(--k-cta)]"
              />
              <span
                className={
                  "leading-snug text-[var(--k-text)] " +
                  (fraga.rutnat ? "text-[0.9375rem]" : "text-base")
                }
              >
                {alternativ}
              </span>
            </label>
          );
        })}
      </div>

      {max !== undefined ? (
        <p
          aria-live="polite"
          className="mt-3 text-sm font-semibold text-[var(--k-text-body)]"
        >
          {TEXT.navigering.valda(valda.length, max)}
        </p>
      ) : null}
    </fieldset>
  );
}
