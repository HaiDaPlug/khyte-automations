"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { facts } from "@/data/facts";
import { AI_VANA, FOKUS, FORMAT, POLICY, TIDER, VERKTYG, type Bokning } from "@/data/konsultation";

/**
 * The booking request for an AI-konsultation, in four short steps.
 *
 * Each step is checked before the next one opens; errors sit next to their
 * field and focus moves to the first one. Options are native radios and
 * checkboxes under the styling, so keyboard and screen readers work as usual.
 * The server checks everything again (src/server/konsultation.ts).
 *
 * Bots: a hidden honeypot field and the time the form was opened go along,
 * and the server quietly drops anything that looks automated.
 */

const STEG = [
  { titel: "Om dig", info: "Så att vi vet vem vi pratar med." },
  { titel: "Ditt arbete", info: "Vi utgår från hur du jobbar i dag." },
  { titel: "Ditt fokus", info: "Det här förbereder vi oss på." },
  { titel: "Upplägg", info: "Hur och när det passar dig." },
] as const;

const TOM: Bokning = {
  namn: "",
  mejl: "",
  telefon: "",
  foretag: "",
  roll: "",
  arbete: "",
  aiVana: "",
  verktyg: [],
  policy: "",
  fokus: [],
  fragor: "",
  mal: "",
  format: "",
  plats: "",
  tider: [],
  tidNotis: "",
};

type Fel = Partial<Record<keyof Bokning, string>>;

const MEJL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function kontrollera(steg: number, d: Bokning): Fel {
  const fel: Fel = {};
  if (steg === 0) {
    if (!d.namn.trim()) fel.namn = "Skriv ditt namn.";
    if (!MEJL.test(d.mejl.trim())) fel.mejl = "Skriv en mejladress vi kan nå dig på.";
    if (!d.foretag.trim()) fel.foretag = "Skriv vilket företag du jobbar på.";
  }
  if (steg === 1) {
    if (!d.arbete.trim()) fel.arbete = "Berätta kort vad du jobbar med.";
    if (!d.aiVana) fel.aiVana = "Välj det som stämmer bäst.";
    if (!d.policy) fel.policy = "Välj ett av alternativen.";
  }
  if (steg === 2) {
    if (d.fokus.length === 0) fel.fokus = "Välj minst ett område.";
    if (!d.fragor.trim()) fel.fragor = "Skriv vad du vill ha hjälp med.";
  }
  if (steg === 3) {
    if (!d.format) fel.format = "Välj hur du vill ses.";
  }
  return fel;
}

/* ── Styling ──────────────────────────────────────────────────────────────── */

const ACCENT = "#D4622B";
const FELFARG = "#B42318";
const BOX =
  "w-full rounded-xl border bg-white px-4 py-3 text-base text-[var(--color-text)] placeholder:text-[#B5A99E] transition-[border-color,box-shadow] duration-200 focus:outline-none focus:ring-4";
const boxFarg = (harFel: boolean) =>
  harFel
    ? "border-[#B42318] focus:border-[#B42318] focus:ring-[#B42318]/15"
    : "border-[rgba(58,51,48,0.18)] hover:border-[rgba(58,51,48,0.32)] focus:border-[#D4622B] focus:ring-[#D4622B]/15";
const LABEL = "block text-[15px] font-semibold text-[var(--color-text)]";
const HINT = "mt-1 text-sm leading-relaxed text-[var(--color-text-body)]";
const VALFRITT = <span className="ml-1.5 text-sm font-medium text-[var(--color-muted)]">(valfritt)</span>;

function Felrad({ id, text }: { id: string; text?: string }) {
  if (!text) return null;
  return (
    <p id={id} className="mt-2 text-sm font-medium" style={{ color: FELFARG }}>
      {text}
    </p>
  );
}

/** A text field or textarea with its label, hint and error. */
function Falt({
  id,
  label,
  hint,
  valfritt = false,
  fel,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  valfritt?: boolean;
  fel?: string;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string; className: string }) => ReactNode;
}) {
  const faltId = `bokning-${id}`;
  const beskrivning = [hint ? `${faltId}-hint` : "", fel ? `${faltId}-fel` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={faltId} className={LABEL}>
        {label}
        {valfritt && VALFRITT}
      </label>
      {hint && (
        <p id={`${faltId}-hint`} className={HINT}>
          {hint}
        </p>
      )}
      <div className="mt-2.5">
        {children({ id: faltId, "aria-invalid": Boolean(fel), "aria-describedby": beskrivning, className: `${BOX} ${boxFarg(Boolean(fel))}` })}
      </div>
      <Felrad id={`${faltId}-fel`} text={fel} />
    </div>
  );
}

/** One choice (radio) or several (checkbox), as cards or chips. */
function Val({
  namn,
  legend,
  hint,
  valfritt = false,
  fel,
  alternativ,
  valda,
  flera,
  chips = false,
  kolumner = "",
  onVal,
}: {
  namn: string;
  legend: string;
  hint?: string;
  valfritt?: boolean;
  fel?: string;
  alternativ: readonly { id: string; label: string; hint?: string }[];
  valda: string[];
  flera: boolean;
  chips?: boolean;
  kolumner?: string;
  onVal: (id: string) => void;
}) {
  const gruppId = `bokning-${namn}`;
  const beskrivning = [hint ? `${gruppId}-hint` : "", fel ? `${gruppId}-fel` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <fieldset aria-describedby={beskrivning}>
      <legend className={LABEL}>
        {legend}
        {valfritt && VALFRITT}
      </legend>
      {hint && (
        <p id={`${gruppId}-hint`} className={HINT}>
          {hint}
        </p>
      )}
      <div className={`mt-3 ${chips ? "flex flex-wrap gap-2" : `grid gap-2 ${kolumner}`}`}>
        {alternativ.map((a, i) => {
          const vald = valda.includes(a.id);
          return (
            <label key={a.id} className="relative block cursor-pointer">
              <input
                type={flera ? "checkbox" : "radio"}
                name={namn}
                value={a.id}
                checked={vald}
                onChange={() => onVal(a.id)}
                aria-invalid={i === 0 && Boolean(fel) ? true : undefined}
                className="peer sr-only"
              />
              <span
                className={`flex h-full items-center gap-2 border bg-white text-[15px] font-semibold text-[var(--color-text)] transition-[border-color,background-color,box-shadow] duration-200 peer-focus-visible:ring-4 peer-focus-visible:ring-[#D4622B]/20 ${
                  chips ? "rounded-full px-4 py-2" : "flex-col items-start justify-center gap-0.5 rounded-xl px-4 py-3"
                } ${
                  vald
                    ? "border-[#D4622B] bg-[#D4622B]/[0.06]"
                    : fel
                      ? "border-[#B42318]/50"
                      : "border-[rgba(58,51,48,0.18)] hover:border-[rgba(58,51,48,0.35)]"
                }`}
              >
                {chips && (
                  <span
                    aria-hidden="true"
                    className={`grid h-4 w-4 place-items-center rounded-full border transition-colors ${
                      vald ? "border-[#D4622B] bg-[#D4622B] text-white" : "border-[rgba(58,51,48,0.3)]"
                    }`}
                  >
                    {vald && (
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6.2 5 8.6l4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                )}
                {a.label}
                {!chips && a.hint && <span className="text-sm font-medium text-[var(--color-text-body)]">{a.hint}</span>}
              </span>
            </label>
          );
        })}
      </div>
      <Felrad id={`${gruppId}-fel`} text={fel} />
    </fieldset>
  );
}

/* ── The form ─────────────────────────────────────────────────────────────── */

export default function KonsultationForm() {
  const [d, setD] = useState<Bokning>(TOM);
  const [steg, setSteg] = useState(0);
  const [fel, setFel] = useState<Fel>({});
  const [status, setStatus] = useState<"redo" | "skickar" | "klar" | "fel">("redo");
  const [serverFel, setServerFel] = useState("");
  const startad = useRef(0);
  const nyckel = useRef("");
  const honung = useRef<HTMLInputElement>(null);
  const rubrik = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const forstaVisning = useRef(true);

  useEffect(() => {
    startad.current = Date.now();
    nyckel.current = crypto.randomUUID();
  }, []);

  // A new step (or the thank-you) gets focus on its heading, so screen
  // readers announce it and keyboard users start from the top of it.
  useEffect(() => {
    if (forstaVisning.current) {
      forstaVisning.current = false;
      return;
    }
    rubrik.current?.focus();
  }, [steg, status]);

  const satt = <K extends keyof Bokning>(k: K, v: Bokning[K]) => {
    setD((p) => ({ ...p, [k]: v }));
    if (fel[k]) setFel((f) => ({ ...f, [k]: undefined }));
  };

  const vaxla = (k: "verktyg" | "fokus" | "tider", id: string) => {
    setD((p) => {
      const lista = p[k] as string[];
      return { ...p, [k]: lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id] };
    });
    if (fel[k]) setFel((f) => ({ ...f, [k]: undefined }));
  };

  const skickaIn = async () => {
    setStatus("skickar");
    setServerFel("");
    const reserv = `Förfrågan kunde inte skickas just nu. Försök igen om en stund, eller mejla oss på ${facts.email}.`;
    try {
      const trimmat = Object.fromEntries(
        Object.entries(d).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v]),
      );
      const svar = await fetch("/api/ai-konsultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...trimmat,
          webbplats: honung.current?.value ?? "",
          startad: startad.current,
          nyckel: nyckel.current,
        }),
      });
      if (!svar.ok) {
        const json = (await svar.json().catch(() => ({}))) as { fel?: string };
        setServerFel(json.fel ?? reserv);
        setStatus("fel");
        return;
      }
      setStatus("klar");
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "generate_lead", {
        form: "ai-konsultation",
      });
    } catch {
      setServerFel(reserv);
      setStatus("fel");
    }
  };

  const vidare = (e: FormEvent) => {
    e.preventDefault();
    const nyaFel = kontrollera(steg, d);
    if (Object.keys(nyaFel).length > 0) {
      setFel(nyaFel);
      // After React has drawn the errors, put focus on the first one.
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    if (steg < STEG.length - 1) {
      setSteg(steg + 1);
      return;
    }
    void skickaIn();
  };

  const c = facts.consultation;

  if (status === "klar") {
    const fornamn = d.namn.trim().split(/\s+/)[0];
    return (
      <div role="status" className="rounded-2xl border border-[var(--color-border)] bg-white/70 p-8 md:p-10">
        <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full bg-[#2F7D4F]/10 text-[#2F7D4F]">
          <svg width="20" height="20" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.2 5 8.6l4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 ref={rubrik} tabIndex={-1} className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-[var(--color-text)] focus:outline-none">
          Tack, {fornamn}! Din förfrågan är skickad.
        </h3>
        <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-[var(--color-text-body)]">
          Vi går igenom dina svar och hör av oss för att bekräfta en tid. En bekräftelse är på väg till{" "}
          <strong className="font-semibold text-[var(--color-text)]">{d.mejl.trim()}</strong>.
        </p>
        <ol className="mt-8 space-y-3 border-t border-[var(--color-border)] pt-6 text-[15px] leading-relaxed text-[var(--color-text-body)]">
          <li><span className="font-semibold text-[var(--color-text)]">1.</span> Vi bekräftar en tid som passar dig.</li>
          <li><span className="font-semibold text-[var(--color-text)]">2.</span> Vi förbereder oss utifrån dina svar.</li>
          <li>
            <span className="font-semibold text-[var(--color-text)]">3.</span> {c.minutes} minuter tillsammans, och ditt
            underlag inom {c.deliveryDays}.
          </li>
        </ol>
      </div>
    );
  }

  const sista = steg === STEG.length - 1;

  return (
    <form
      ref={form}
      onSubmit={vidare}
      noValidate
      aria-label="Bokningsförfrågan för AI-konsultation"
      className="relative rounded-2xl border border-[var(--color-border)] bg-white/70 p-6 shadow-[0_24px_60px_-40px_rgba(58,51,48,0.35)] md:p-10"
    >
      {/* Progress */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-label whitespace-nowrap">
          Steg {steg + 1} av {STEG.length}
        </p>
        <ol aria-hidden="true" className="flex gap-1.5">
          {STEG.map((s, i) => (
            <li
              key={s.titel}
              className="h-1.5 w-5 rounded-full transition-colors duration-300 sm:w-7 md:w-9"
              style={{ background: i <= steg ? ACCENT : "rgba(58,51,48,0.12)" }}
            />
          ))}
        </ol>
      </div>
      <h3
        ref={rubrik}
        tabIndex={-1}
        className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-[var(--color-text)] focus:outline-none"
      >
        {STEG[steg].titel}
      </h3>
      <p className="mt-1 text-[15px] text-[var(--color-text-body)]">{STEG[steg].info}</p>

      <div className="mt-8 space-y-7">
        {steg === 0 && (
          <>
            <Falt id="namn" label="Namn" fel={fel.namn}>
              {(p) => <input {...p} type="text" autoComplete="name" value={d.namn} onChange={(e) => satt("namn", e.target.value)} />}
            </Falt>
            <div className="grid gap-7 sm:grid-cols-2 sm:gap-5">
              <Falt id="mejl" label="Mejl" fel={fel.mejl}>
                {(p) => (
                  <input {...p} type="email" inputMode="email" autoComplete="email" value={d.mejl} onChange={(e) => satt("mejl", e.target.value)} />
                )}
              </Falt>
              <Falt id="telefon" label="Telefon" valfritt>
                {(p) => <input {...p} type="tel" autoComplete="tel" value={d.telefon} onChange={(e) => satt("telefon", e.target.value)} />}
              </Falt>
            </div>
            <div className="grid gap-7 sm:grid-cols-2 sm:gap-5">
              <Falt id="foretag" label="Företag" fel={fel.foretag}>
                {(p) => (
                  <input {...p} type="text" autoComplete="organization" value={d.foretag} onChange={(e) => satt("foretag", e.target.value)} />
                )}
              </Falt>
              <Falt id="roll" label="Roll" valfritt>
                {(p) => (
                  <input
                    {...p}
                    type="text"
                    autoComplete="organization-title"
                    placeholder="T.ex. vd eller ekonomiansvarig"
                    value={d.roll}
                    onChange={(e) => satt("roll", e.target.value)}
                  />
                )}
              </Falt>
            </div>
          </>
        )}

        {steg === 1 && (
          <>
            <Falt id="arbete" label="Vad jobbar du med till vardags?" fel={fel.arbete}>
              {(p) => (
                <textarea
                  {...p}
                  rows={3}
                  placeholder="T.ex. Jag driver en redovisningsbyrå med fem anställda och lägger mycket tid på mejl och avstämningar."
                  value={d.arbete}
                  onChange={(e) => satt("arbete", e.target.value)}
                />
              )}
            </Falt>
            <Val
              namn="aiVana"
              legend="Hur mycket använder du AI i dag?"
              fel={fel.aiVana}
              alternativ={AI_VANA}
              valda={d.aiVana ? [d.aiVana] : []}
              flera={false}
              kolumner="grid-cols-2 sm:grid-cols-4"
              onVal={(id) => satt("aiVana", id as Bokning["aiVana"])}
            />
            <Val
              namn="verktyg"
              legend="Vilka AI-verktyg har du tillgång till?"
              hint="Välj alla som stämmer."
              valfritt
              alternativ={VERKTYG}
              valda={d.verktyg}
              flera
              chips
              onVal={(id) => vaxla("verktyg", id)}
            />
            <Val
              namn="policy"
              legend="Har företaget riktlinjer för hur AI får användas?"
              hint="Det avgör vilka verktyg och vilken information vi kan utgå från."
              fel={fel.policy}
              alternativ={POLICY}
              valda={d.policy ? [d.policy] : []}
              flera={false}
              kolumner="grid-cols-3"
              onVal={(id) => satt("policy", id as Bokning["policy"])}
            />
          </>
        )}

        {steg === 2 && (
          <>
            <Val
              namn="fokus"
              legend="Vad vill du fokusera på?"
              hint="Välj ett eller flera."
              fel={fel.fokus}
              alternativ={FOKUS}
              valda={d.fokus}
              flera
              chips
              onVal={(id) => vaxla("fokus", id)}
            />
            <Falt
              id="fragor"
              label="Vilka frågor eller uppgifter vill du ha hjälp med?"
              hint="Skriv fritt, gärna med exempel från ditt arbete."
              fel={fel.fragor}
            >
              {(p) => <textarea {...p} rows={4} value={d.fragor} onChange={(e) => satt("fragor", e.target.value)} />}
            </Falt>
            <Falt id="mal" label="Vad vill du kunna efter konsultationen?" valfritt>
              {(p) => (
                <textarea
                  {...p}
                  rows={2}
                  placeholder="T.ex. ta fram ett första utkast till offerter på halva tiden."
                  value={d.mal}
                  onChange={(e) => satt("mal", e.target.value)}
                />
              )}
            </Falt>
          </>
        )}

        {steg === 3 && (
          <>
            <Val
              namn="format"
              legend="Hur vill du ses?"
              fel={fel.format}
              alternativ={FORMAT}
              valda={d.format ? [d.format] : []}
              flera={false}
              kolumner="sm:grid-cols-2"
              onVal={(id) => satt("format", id as Bokning["format"])}
            />
            {d.format === "plats" && (
              <Falt id="plats" label="Var passar det?" valfritt>
                {(p) => (
                  <input {...p} type="text" placeholder="Ort eller adress" value={d.plats} onChange={(e) => satt("plats", e.target.value)} />
                )}
              </Falt>
            )}
            <Val
              namn="tider"
              legend="När på dagen passar det bäst?"
              valfritt
              alternativ={TIDER}
              valda={d.tider}
              flera
              chips
              onVal={(id) => vaxla("tider", id)}
            />
            <Falt id="tidNotis" label="Något vi bör veta om tider?" valfritt>
              {(p) => (
                <input {...p} type="text" placeholder="T.ex. inte fredagar" value={d.tidNotis} onChange={(e) => satt("tidNotis", e.target.value)} />
              )}
            </Falt>

            <div className="rounded-xl bg-[rgba(58,51,48,0.04)] px-5 py-4 text-[15px] leading-relaxed text-[var(--color-text-body)]">
              <span className="font-semibold text-[var(--color-text)]">
                AI-konsultation · {c.minutes} minuter · {c.price} {c.vat}
              </span>
              <br />
              Vi bekräftar tiden personligen, och fakturan kommer efter konsultationen.
            </div>
          </>
        )}
      </div>

      {/* Honeypot: off screen and out of the tab order; people never fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label>
          Webbplats
          <input ref={honung} type="text" name="webbplats" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {status === "fel" && (
        <p
          role="alert"
          className="mt-7 rounded-xl border px-4 py-3 text-[15px] leading-relaxed"
          style={{ borderColor: "rgba(180,35,24,0.25)", background: "rgba(180,35,24,0.05)", color: "#8A1C12" }}
        >
          {serverFel}
        </p>
      )}

      <div className="mt-9 flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-6">
        {steg > 0 ? (
          <button
            type="button"
            onClick={() => {
              setFel({});
              setSteg(steg - 1);
            }}
            className="rounded-full px-2 py-2 text-base font-semibold text-[var(--color-text-body)] transition-colors hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D4622B]/20"
          >
            Tillbaka
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={status === "skickar"}
          className="btn-cta inline-flex h-12 items-center justify-center rounded-full px-8 text-base font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
        >
          <span>{!sista ? "Fortsätt" : status === "skickar" ? "Skickar…" : "Skicka förfrågan"}</span>
        </button>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-[var(--color-text-body)]">
        Vi använder uppgifterna bara för att förbereda konsultationen. Läs mer i vår{" "}
        <Link href="/integritetspolicy" className="underline underline-offset-2 hover:text-[var(--color-text)]">
          integritetspolicy
        </Link>
        .
      </p>
    </form>
  );
}
