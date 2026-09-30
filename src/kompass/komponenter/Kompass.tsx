"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FRAGA, MAX_SPAR } from "@/kompass/data/kompass";
import Header from "@/kompass/komponenter/Header";
import Forlopp from "@/kompass/komponenter/Forlopp";
import Hypotes from "@/kompass/komponenter/Hypotes";
import StartVy from "@/kompass/komponenter/StartVy";
import FragaVy from "@/kompass/komponenter/FragaVy";
import AnalysVy, { ANALYS_STEG } from "@/kompass/komponenter/AnalysVy";
import ResultatVy from "@/kompass/komponenter/ResultatVy";
import KontaktVy, { type KontaktUppgifter } from "@/kompass/komponenter/KontaktVy";
import KompletteraVy from "@/kompass/komponenter/KompletteraVy";
import TackVy from "@/kompass/komponenter/TackVy";
import {
  arBesvarad,
  byggFragor,
  lasSparat,
  rensaSparat,
  sattSvar,
  spara,
  SPARSKARMAR,
} from "@/kompass/lib/flode";
import { analysRader } from "@/kompass/lib/analys";
import { raknaUtResultat } from "@/kompass/lib/matchning";
import {
  begarAnalys,
  hamtaForslag,
  lasKalla,
  loggaHandelse,
  skickaKontakt,
  sparaSvar,
  vantaPaAnalys,
} from "@/kompass/lib/klient";
import type { AiAnalys } from "@/kompass/lib/ai-typer";
import type { Kalla, Svar } from "@/kompass/lib/typer";

type Vy = "start" | "fragor" | "analys" | "resultat" | "tack";

/** Kort paus efter sista raden i analysen, innan resultatet visas. */
const ANALYS_EFTER = 400; // 3 rader × 700 ms + 400 ms = 2,5 s

/**
 * Längsta vi väntar på den sista AI-analysen innan resultatet visas ändå,
 * med regelmotorns förslag. Har de beskrivit ett arbetsflöde körs en sista
 * analys med det — den hinner sällan klart under analysögonblicket, därför
 * lite längre marginal.
 */
const MAX_VANTAN_PA_ANALYS = 12000;

/**
 * AI-analysen körs från och med skärmen om vad som görs för hand. Före det
 * finns för lite att säga något träffsäkert om — de tidiga skärmarna har
 * regelbaserade reaktioner i stället. Det sparar anrop, kostnad och svarstid.
 */
const analysFran = (fragor: { id: string }[]) =>
  fragor.findIndex((f) => f.id === FRAGA.tidstjuvar);

const sov = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/** uuid utan beroenden. crypto.randomUUID finns i alla webbläsare vi stödjer. */
function nyttSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Reserv för äldre webbläsare — behöver inte vara kryptografiskt säkert,
  // bara unikt nog för att koppla ihop svar och kontaktuppgifter.
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

type Props = {
  /**
   * Visa Khytes logga överst. Fristående (kompass.khyte.se) ja; inbäddad på
   * khyte.se nej — där har sajten redan sin egen meny.
   */
  visaLogga?: boolean;
  /** Sökvägen delningslänken pekar på. Se KompassSida. */
  delningsSokvag?: string;
};

export default function Kompass({ visaLogga = true, delningsSokvag }: Props) {
  const sokparametrar = useSearchParams();

  const [vy, setVy] = useState<Vy>("start");
  const [svar, setSvar] = useState<Svar>({});
  const [steg, setSteg] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const [ref, setRef] = useState<string | undefined>();
  const [kalla, setKalla] = useState<Kalla | undefined>();
  const [harPaborjat, setHarPaborjat] = useState(false);
  const [riktning, setRiktning] = useState<"fram" | "bak">("fram");
  /** Adressen resultatet skickades till. Visas på tacksidan. */
  const [skickatTill, setSkickatTill] = useState("");
  const [analys, setAnalys] = useState<string[]>([]);
  /** Den löpande AI-analysen — uppdateras efter varje skärm. */
  const [aiAnalys, setAiAnalys] = useState<AiAnalys | null>(null);
  const aiAnalysRef = useRef<AiAnalys | null>(null);
  /**
   * Analysen som resultatet visas med. Låses när resultatet visas, så att en
   * sen analys inte byter ut förslagen framför ögonen på besökaren.
   */
  const [visadAnalys, setVisadAnalys] = useState<AiAnalys | null>(null);
  const [analysKlar, setAnalysKlar] = useState(false);

  // Läs referent och eventuellt påbörjat flöde vid start.
  useEffect(() => {
    const refFranUrl = sokparametrar.get("ref") ?? undefined;
    const sparat = lasSparat();

    // localStorage finns bara i webbläsaren. Sidan förrenderas statiskt, så
    // läsningen måste ske efter hydrering — annars skiljer sig server och klient.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (sparat) {
      setSessionId(sparat.sessionId);
      setSvar(sparat.svar);
      setSteg(sparat.steg);
      // Referenten från en ny länk vinner över den sparade.
      setRef(refFranUrl ?? sparat.ref);
      // Nya UTM-parametrar i länken vinner, annars behålls källan från första
      // besöket — det är den som gav leadet.
      const nyKalla = lasKalla(sokparametrar);
      setKalla(nyKalla.utm_source || !sparat.kalla ? nyKalla : sparat.kalla);
      setHarPaborjat(Object.keys(sparat.svar).length > 0);
    } else {
      setSessionId(nyttSessionId());
      setRef(refFranUrl);
      setKalla(lasKalla(sokparametrar));
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [sokparametrar]);

  const fragor = useMemo(() => byggFragor(svar), [svar]);
  // Ett sparat steg kan peka utanför listan, till exempel om antalet frågor
  // ändrats sedan sist. Kläm det till sista giltiga frågan.
  const aktivtSteg = Math.min(steg, Math.max(fragor.length - 1, 0));
  const aktuellFraga = fragor[aktivtSteg];

  const resultat = useMemo(
    () => raknaUtResultat(svar, visadAnalys),
    [svar, visadAnalys],
  );

  // Ny vy börjar överst. Frågorna är korta nog att inte behöva det, men
  // resultat- och tacksidan hamnar annars mitt i föregående scroll.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [vy]);

  // Varje ny fråga börjar överst — på mobil har man ofta scrollat ner för att
  // nå de nedersta alternativen, och då hamnar nästa rubrik utanför bild.
  useEffect(() => {
    if (vy === "fragor") window.scrollTo({ top: 0 });
  }, [aktivtSteg, vy]);

  /** Sparar läget i localStorage vid varje ändring. */
  const sparaLage = useCallback(
    (nyaSvar: Svar, nyttSteg: number) => {
      if (!sessionId) return;
      spara({ sessionId, svar: nyaSvar, steg: nyttSteg, ref, kalla });
    },
    [sessionId, ref, kalla],
  );

  function hanteraSvara(id: string, varde: string | string[]) {
    setSvar((tidigare) => {
      // sattSvar rensar det som blivit ogiltigt, t.ex. följdsvar för ett
      // område som valts bort.
      const nya = sattSvar(tidigare, id, varde);
      sparaLage(nya, aktivtSteg);
      return nya;
    });
  }

  function starta(franBorjan: boolean) {
    if (franBorjan) {
      rensaSparat();
      const nyttId = nyttSessionId();
      setSessionId(nyttId);
      setSvar({});
      setSteg(0);
      void loggaHandelse(nyttId, "start");
    } else {
      void loggaHandelse(sessionId, "start");
    }
    setVy("fragor");
  }

  /**
   * Sparar svaren till servern. Körs efter varje fråga, så att vi har datan
   * även från den som aldrig lämnar mejl eller hoppar av halvvägs.
   * Misslyckas det märker användaren inget — svaren finns kvar lokalt och
   * nästa fråga försöker igen med allt.
   */
  function sparaTillServer(
    aktuellaSvar: Svar,
    senasteFraga: string | undefined,
    klar = false,
  ) {
    return sparaSvar({
      sessionId,
      svar: aktuellaSvar,
      ref,
      kalla,
      senasteFraga,
      klar,
    });
  }

  function nasta() {
    // Sista skyddet: en skärm som fått en ny rad efter ett val (t.ex. missade
    // samtal) går inte att lämna förrän raden är besvarad.
    if (aktuellFraga && !arBesvarad(aktuellFraga, svar)) return;

    void loggaHandelse(sessionId, "fraga_besvarad", aktuellFraga?.id);

    // Frågelistan kan ha ändrats av branschvalet — räkna om innan vi går vidare.
    const aktuellaFragor = byggFragor(svar);
    const sista = aktivtSteg >= aktuellaFragor.length - 1;

    const sparat = sparaTillServer(svar, aktuellFraga?.id, sista);

    // Efter varje skärm bygger AI:n vidare på sin bild av företaget. Efter
    // arbetsflödesfrågan bara om de skrivit något — annars finns inget nytt.
    const nyttFranFritext = aktuellFraga?.id !== FRAGA.fritext || fritext.length > 0;
    if (aktivtSteg >= analysFran(aktuellaFragor) && nyttFranFritext) {
      begarAnalys(sessionId, (a) => {
        aiAnalysRef.current = a;
        setAiAnalys(a);
      });
    }

    if (sista) {
      void loggaHandelse(sessionId, "resultat_visat");
      // Claude-förslaget börjar tas fram direkt — det hinner ofta bli klart
      // medan analysen visas.
      void taFramForslag(sparat);
      void visaAnalysSedanResultat();
      return;
    }

    const nyttSteg = aktivtSteg + 1;
    setRiktning("fram");
    setSteg(nyttSteg);
    sparaLage(svar, nyttSteg);
  }

  /**
   * Ber servern ta fram Claudes förslag på arbetsflödet redan nu. Det visas
   * inte på sidan — det står i resultatmejlet och säljnotisen, och är då
   * redan klart när mejl lämnas. Väntar in det sista sparandet först —
   * servern läser fritexten från raden, inte från oss.
   */
  async function taFramForslag(sparat: Promise<boolean>) {
    if (!fritext) return;
    await sparat;
    await hamtaForslag(sessionId);
  }

  /**
   * Analysögonblicket, sedan resultatet. Den som valt reducerad rörelse
   * går direkt till resultatet.
   */
  async function visaAnalysSedanResultat() {
    const rader = analysRader(svar);
    setAnalys(rader);
    setAnalysKlar(false);
    setVy("analys");

    // Sista raden ("Bygger tre förslag") bockas av när AI-analysen är klar —
    // eller när vi slutat vänta på den.
    const klar = Promise.race([vantaPaAnalys(), sov(MAX_VANTAN_PA_ANALYS)]);
    void klar.then(() => setAnalysKlar(true));

    await Promise.all([klar, sov(rader.length * ANALYS_STEG)]);
    await sov(ANALYS_EFTER);

    setVisadAnalys(aiAnalysRef.current);
    setVy("resultat");
  }

  function tillbaka() {
    if (aktivtSteg === 0) {
      setVy("start");
      return;
    }
    const nyttSteg = aktivtSteg - 1;
    setRiktning("bak");
    setSteg(nyttSteg);
    sparaLage(svar, nyttSteg);
  }

  async function hanteraKontakt(uppgifter: KontaktUppgifter) {
    // Kontakten uppdaterar en befintlig rad. Gick sparandet vid resultatet
    // inte igenom finns ingen rad — spara igen först. Kön i sparaSvar gör
    // att det här alltid landar efter tidigare sparanden.
    await sparaTillServer(svar, fragor[fragor.length - 1]?.id, true);
    await skickaKontakt(sessionId, uppgifter);
    void loggaHandelse(sessionId, "kontakt_lamnad");
    rensaSparat();
    setSkickatTill(uppgifter.mejl.trim());
    setVy("tack");
  }

  const arSista = aktivtSteg === fragor.length - 1;

  // Innan mönstren valts kan följdfrågan fortfarande dyka upp — räkna med
  // den. Då kan "av"-siffran bara krympa — att målet flyttas längre bort tar
  // musten ur folk.
  const harValtOmraden = Array.isArray(svar[FRAGA.tidstjuvar]);
  const sparNu = fragor.filter((f) => SPARSKARMAR.has(f.id)).length;
  const visatAntal = fragor.length + (harValtOmraden ? 0 : Math.max(0, MAX_SPAR - sparNu));

  const fritextSvar = svar[FRAGA.fritext];
  const fritext = typeof fritextSvar === "string" ? fritextSvar.trim() : "";

  return (
    <div>
      {visaLogga ? <Header /> : null}

      <main className="mx-auto w-full max-w-[42.5rem] px-5 pt-6 pb-20 sm:px-6">
        {vy === "start" ? (
          <StartVy
            onStarta={() => starta(true)}
            harPaborjat={harPaborjat}
            onFortsatt={() => starta(false)}
          />
        ) : null}

        {vy === "fragor" && aktuellFraga ? (
          <>
            <Forlopp nu={aktivtSteg + 1} av={visatAntal} />
            <FragaVy
              key={aktuellFraga.id}
              riktning={riktning}
              fraga={aktuellFraga}
              svar={svar}
              onSvara={hanteraSvara}
              onNasta={nasta}
              onTillbaka={tillbaka}
              kanGaTillbaka={true}
              arSista={arSista}
            />
            {/* Under frågan, inte över: kommer AI-svaret medan besökaren ska
                trycka får inget flytta sig under fingret. */}
            {aiAnalys?.hypotes && aktivtSteg > analysFran(fragor) ? (
              <Hypotes text={aiAnalys.hypotes} />
            ) : null}
          </>
        ) : null}

        {vy === "analys" ? <AnalysVy rader={analys} klar={analysKlar} /> : null}

        {vy === "resultat" ? (
          <ResultatVy
            resultat={resultat}
            svar={svar}
            delningsSokvag={delningsSokvag}
            onDelning={() => void loggaHandelse(sessionId, "delning")}
            onMote={() => void loggaHandelse(sessionId, "mote_klick")}
          >
            <KontaktVy onSkicka={hanteraKontakt} />
          </ResultatVy>
        ) : null}

        {vy === "tack" ? (
          <TackVy
            mejl={skickatTill}
            onMote={() => void loggaHandelse(sessionId, "mote_klick", "tack")}
            komplettera={<KompletteraVy sessionId={sessionId} />}
          />
        ) : null}
      </main>
    </div>
  );
}
