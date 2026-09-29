"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { FRAGA, TEXT, VISA_PER_MANAD_UNDER } from "@/kompass/data/kompass";
import Bekraftelse from "@/kompass/komponenter/Bekraftelse";
import ForslagKort, { type ForslagLage } from "@/kompass/komponenter/ForslagKort";
import Knapp from "@/kompass/komponenter/Knapp";
import PlanVy from "@/kompass/komponenter/PlanVy";
import TidsKarta from "@/kompass/komponenter/TidsKarta";
import { diagnosFor, tjansterText } from "@/kompass/lib/analys";
import { byggSammanfattning } from "@/kompass/lib/sammanfattning";
import { formateraTimmarKort, perManad } from "@/kompass/lib/tid";
import type { Forslag, Resultat, Svar } from "@/kompass/lib/typer";

export type { ForslagLage };

type Props = {
  resultat: Resultat;
  svar: Svar;
  /**
   * Låst: siffrorna och det första förslaget syns. Resten får de på mejl,
   * och låses upp här när kontaktuppgifterna skickats.
   */
  last: boolean;
  /**
   * Visas under tackrubriken. Rubriken blir då h2 och tar inte fokus —
   * tackvyn äger sidans h1.
   */
  inbaddad?: boolean;
  /** Sökvägen delningslänken pekar på. Utan den: sidans egen adress. */
  delningsSokvag?: string;
  onDelning: () => void;
  /** Läget för Claudes förslag på det de helst vill slippa. */
  claude: ForslagLage;
  /** Kontaktformuläret, i låst läge. Hamnar mellan förslagen och delningen. */
  children?: ReactNode;
  /** Svaret på kontrollfrågan under det första förslaget. */
  onBekrafta?: (svar: string, text?: string) => void;
};

/** Verksamheter i det här spannet kan söka digitaliseringscheck. */
const CHECK_GILTIG_FOR = ["Bara jag", "2–5", "6–20", "21–50"];

/** Ordningen resultatet tonar in i. */
const ordning = (i: number) => ({ "--i": i }) as CSSProperties;

export default function ResultatVy({
  resultat,
  svar,
  last,
  inbaddad = false,
  delningsSokvag,
  onDelning,
  claude,
  children,
  onBekrafta,
}: Props) {
  const [delningsbesked, setDelningsbesked] = useState("");
  const rubrikRef = useRef<HTMLHeadingElement>(null);
  const potentialId = useId();

  useEffect(() => {
    if (!inbaddad) rubrikRef.current?.focus();
  }, [inbaddad]);

  const antal = svar[FRAGA.antal];
  const visaCheck =
    typeof antal === "string" && CHECK_GILTIG_FOR.includes(antal);

  const Rubrik = inbaddad ? "h2" : "h1";
  const { lagt, besparing, forslag, missadeAffarer } = resultat;

  async function dela() {
    // Behåll ?ref= så att en partner får krediten även när länken skickas vidare.
    const ref = new URLSearchParams(window.location.search).get("ref");
    const url =
      window.location.origin +
      (delningsSokvag ?? window.location.pathname) +
      (ref ? `?ref=${encodeURIComponent(ref)}` : "");
    const delningsdata = {
      title: "Var tappar du mest tid?",
      text: "Ett par minuter, mest snabba tryck. Du ser direkt var tiden går.",
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
        // Annars stöds delningen inte här (vanligt på dator) — kopiera i stället.
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

  // Kronuträkningen redovisas bara om ett förslag faktiskt nämner pengar.
  const visaKronor = !!missadeAffarer && forslag.some((f) => f.pengar);

  // Liten veckotid visas per månad: "1–3 h i veckan" säger lite, "4–13 h i
  // månaden" går att relatera till. Båda rutorna byter, så att de går att
  // jämföra. Aldrig per år.
  const visaPerManad = besparing.max > 0 && besparing.max < VISA_PER_MANAD_UNDER;

  const du = svar[FRAGA.antal] === "Bara jag";
  // Kontrollfrågan gäller det första förslaget — vår diagnos.
  const diagnos = diagnosFor(forslag[0]);
  const bekraftelse = svar[FRAGA.bekraftelse];
  const rubrik =
    resultat.mal && resultat.mal !== "admin"
      ? TEXT.resultat.malRubrik[resultat.mal](du)
      : TEXT.resultat.rubrik;

  // Tidsrutorna, tidskartan och "Så räknade vi". Är tiden liten hamnar de
  // längre ner, under "Administrativ potential" — affärsnyttan först.
  const tid = (
    <>
        {/* Tid — deras egna siffror. Syns även i låst läge. */}
        {lagt.max > 0 || besparing.max > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {lagt.max > 0 ? (
              <Siffra
                i={2}
                etikett={TEXT.resultat.lagt}
                varde={formateraTimmarKort(visaPerManad ? perManad(lagt) : lagt)}
                fot={visaPerManad ? TEXT.resultat.perManad.lagtFot : TEXT.resultat.lagtFot}
              />
            ) : null}
            {besparing.max > 0 ? (
              <Siffra
                i={3}
                etikett={TEXT.resultat.besparing}
                varde={formateraTimmarKort(visaPerManad ? perManad(besparing) : besparing)}
                fot={
                  visaPerManad
                    ? TEXT.resultat.perManad.besparingFot(formateraTimmarKort(besparing))
                    : (tjansterText(besparing, resultat.niva) ?? TEXT.resultat.besparingFot)
                }
                betonad={!resultat.litenTid}
              />
            ) : null}
          </div>
        ) : null}

        {/* Var tiden går, område för område. Syns även i låst läge. */}
        <TidsKarta omraden={resultat.omraden} />

        {/* Så räknade vi — öppen redovisning, även innan mejl lämnats. Den som
            ser siffrorna ska alltid kunna se hur de kom till. */}
        {resultat.omraden.some((o) => o.harledning) ? (
          <details className="mt-4 rounded-2xl border border-[var(--k-border)] bg-[var(--k-card-bg)] px-5 py-1">
            <summary className="cursor-pointer py-3 text-[0.9375rem] font-semibold text-[var(--k-text)]">
              {TEXT.resultat.saRaknadeVi}
            </summary>
            <ul className="mt-1 flex flex-col gap-2">
              {resultat.omraden
                .filter((o) => o.harledning)
                .map((o) => (
                  <li
                    key={o.omrade.id}
                    className="text-sm leading-relaxed text-[var(--k-text-body)]"
                  >
                    {o.harledning}
                  </li>
                ))}
              {visaKronor && missadeAffarer ? (
                <li className="text-sm leading-relaxed text-[var(--k-text-body)]">
                  {missadeAffarer.harledning}
                </li>
              ) : null}
            </ul>
            <ul className="mt-3 flex flex-col gap-1.5 border-t border-[var(--k-border)] pt-3">
              {resultat.niva !== "liten" ? (
                <li className="text-sm text-[var(--k-text-body)]">{TEXT.resultat.definition.heltid}</li>
              ) : null}
              {forslag.some((f) => f.omraden && f.omraden.length > 1) ? (
                <li className="text-sm text-[var(--k-text-body)]">{TEXT.resultat.definition.kedja}</li>
              ) : null}
              {visaPerManad ? (
                <li className="text-sm text-[var(--k-text-body)]">{TEXT.resultat.definition.manad}</li>
              ) : null}
              <li className="text-sm text-[var(--k-text-body)]">{TEXT.resultat.definition.dubbel}</li>
            </ul>
            <p className="mt-3 pb-3 text-sm text-[var(--k-muted)]">
              {TEXT.resultat.saRaknadeViFot}
            </p>
          </details>
        ) : null}
    </>
  );

  return (
    <div>
      <Rubrik
        ref={rubrikRef}
        tabIndex={-1}
        className="k-rubrik k-tona-in text-3xl outline-none sm:text-4xl"
      >
        {rubrik}
      </Rubrik>

      <p
        style={ordning(1)}
        className="k-tona-in mt-4 text-lg leading-relaxed text-[var(--k-text)]"
      >
        {byggSammanfattning(resultat, svar)}
      </p>

      {/* Stor tid: siffrorna direkt under sammanfattningen. */}
      {!resultat.litenTid ? tid : null}

      <PlanVy plan={resultat.plan} />

      <h2
        style={ordning(4)}
        className="k-rubrik k-tona-in mt-10 text-2xl text-[var(--k-text-body)]"
      >
        {TEXT.resultat.forslagRubrik}
      </h2>

      <div className="mt-4 flex flex-col gap-4">
        {forslag.map((f, i) => (
          <div key={f.id} style={ordning(5 + i)} className="k-tona-in">
            {last && i > 0 ? (
              <LastKort forslag={f} nummer={i + 1} />
            ) : (
              <ForslagKort
                forslag={f}
                nummer={i + 1}
                claude={f.kalla === "onskemal" ? claude : undefined}
                visaVidare={last && i === 0}
              />
            )}
            {i === 0 && diagnos && onBekrafta ? (
              <div className="mt-4">
                <Bekraftelse
                  diagnos={diagnos}
                  du={du}
                  besvarad={typeof bekraftelse === "string" ? bekraftelse : undefined}
                  onSvara={onBekrafta}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {!last && visaCheck ? (
        <p className="mt-6 rounded-2xl bg-[var(--k-card-bg)] p-5 text-[0.9375rem] leading-relaxed text-[var(--k-text-body)]">
          {TEXT.resultat.digitaliseringscheck}
        </p>
      ) : null}

      {/* Liten tid: siffrorna efter förslagen, som administrativ potential —
          men före formuläret, så att uträkningen syns innan mejl lämnas. */}
      {resultat.litenTid && (lagt.max > 0 || besparing.max > 0) ? (
        <section aria-labelledby={potentialId} className="mt-10">
          <h2 id={potentialId} className="k-rubrik text-2xl text-[var(--k-text-body)]">
            {TEXT.resultat.potential.rubrik}
          </h2>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--k-text-body)]">
            {TEXT.resultat.potential.brodtext}
          </p>
          {tid}
        </section>
      ) : null}

      {children}
      {/* Mobil: en knapp som leder ner till mejlfältet, som annars ligger
          långt ner. Bara i låst läge, där formuläret finns. */}
      {last && children ? <FlytandeKnapp /> : null}

      <div className="mt-8">
        <Knapp variant="sekundar" onClick={dela}>
          {TEXT.resultat.dela}
        </Knapp>
        {delningsbesked ? (
          <p role="status" className="mt-3 text-sm text-[var(--k-text-body)]">
            {delningsbesked}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * "Få hela resultatet på mejl ↓" — fast i nederkant på mobil (kompass.css,
 * .k-flytande). Syns när man scrollat förbi toppen och döljs när formuläret
 * är i bild. Döljs helt på bredare skärmar.
 */
function FlytandeKnapp() {
  const [dold, setDold] = useState(true);

  useEffect(() => {
    const formular = document.getElementById("kontakt");
    let formularSyns = false;
    const uppdatera = () => setDold(formularSyns || window.scrollY < 320);

    const iakttagare = formular
      ? new IntersectionObserver(([post]) => {
          formularSyns = post.isIntersecting;
          uppdatera();
        })
      : null;
    if (formular && iakttagare) iakttagare.observe(formular);
    window.addEventListener("scroll", uppdatera, { passive: true });

    return () => {
      iakttagare?.disconnect();
      window.removeEventListener("scroll", uppdatera);
    };
  }, []);

  function tillFormularet() {
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth", block: "start" });
    // Fokus för tangentbord och skärmläsare, utan att sidan hoppar.
    window.setTimeout(() => document.getElementById("mejl")?.focus({ preventScroll: true }), 500);
  }

  return (
    <button
      type="button"
      data-dold={dold}
      aria-hidden={dold}
      tabIndex={dold ? -1 : 0}
      onClick={tillFormularet}
      className="k-flytande k-btn-primar inline-flex min-h-12 items-center rounded-full px-6 text-base font-semibold whitespace-nowrap"
    >
      {TEXT.resultat.tillMejl}
    </button>
  );
}

/** En siffra i en ruta. Den betonade är den vi vill att ögat fastnar på. */
function Siffra({
  i,
  etikett,
  varde,
  fot,
  betonad = false,
}: {
  i: number;
  etikett: string;
  varde: string;
  fot: string;
  betonad?: boolean;
}) {
  return (
    <div
      style={ordning(i)}
      className={
        "k-tona-in rounded-2xl p-4 " +
        (betonad
          ? "bg-[var(--k-cta)] text-white"
          : "bg-[var(--k-card-bg)] text-[var(--k-text)]")
      }
    >
      <p
        className={
          "text-[0.75rem] font-semibold tracking-wide uppercase " +
          (betonad ? "text-white/80" : "text-[var(--k-muted)]")
        }
      >
        {etikett}
      </p>
      <p
        className="k-rubrik mt-1 text-[2.125rem] leading-none"
        style={betonad ? { color: "#fff" } : undefined}
      >
        {varde}
      </p>
      <p
        className={
          "mt-1.5 text-[0.8125rem] leading-snug " +
          (betonad ? "text-white/80" : "text-[var(--k-text-body)]")
        }
      >
        {fot}
      </p>
    </div>
  );
}

/**
 * Ett låst förslag. Rubriken syns — den säger vilket problem vi ser — men
 * flödet är en suddig platshållare, inte den riktiga texten.
 */
function LastKort({ forslag, nummer }: { forslag: Forslag; nummer: number }) {
  return (
    <article
      className={
        "relative overflow-hidden rounded-3xl bg-[var(--k-card-bg)] p-6 sm:p-7 " +
        (forslag.kalla === "onskemal"
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

      {/* Förhandsvisning: vad mejlen låser upp. Önskemålet visar deras egna
          ord, övriga förslag vad de betyder för företaget. */}
      {forslag.kalla === "onskemal" ? (
        <p className="mt-3 text-lg font-semibold text-[var(--k-text)]">
          ”{forslag.varfor}”
        </p>
      ) : forslag.affarsnytta ? (
        <p className="mt-3 border-l-4 border-[var(--k-cta)] pl-3 text-[0.9375rem] leading-snug font-semibold text-[var(--k-text)]">
          {forslag.affarsnytta}
        </p>
      ) : null}

      <div aria-hidden="true" className="k-last-innehall mt-4 flex flex-col gap-3">
        {[0, 1].map((i) => (
          <span key={i} className="flex items-center gap-3">
            <span className="h-6 w-6 shrink-0 rounded-full bg-[var(--k-muted)] opacity-40" />
            <span
              className="h-3 rounded-full bg-[var(--k-muted)] opacity-35"
              style={{ width: `${[78, 64, 70][i]}%` }}
            />
          </span>
        ))}
      </div>

      <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--k-bg)] px-3.5 py-1.5 text-[0.8125rem] font-semibold text-[var(--k-text-body)]">
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        {TEXT.resultat.last.etikett}
      </p>
    </article>
  );
}
