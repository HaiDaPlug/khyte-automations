/** Delade typer för kompassens logik. */

import type { Bransch, Mal, Niva, Omrade } from "@/kompass/data/kompass";

/**
 * Användarens svar. Enval och fritext ger sträng, flerval ger lista.
 * Ett obesvarat eller överhoppat svar saknas helt i objektet.
 */
export type Svar = Record<string, string | string[] | undefined>;

/**
 * Varifrån besökaren kom. Läses automatiskt vid första besöket och följer med
 * varje sparande — kostar besökaren ingenting, men visar vilka kanaler som
 * faktiskt ger leads.
 */
export type Kalla = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  /** Sidan de kom från, bara domänen. Saknas om de kom direkt. */
  referrer?: string;
  enhet?: "mobil" | "surfplatta" | "dator";
};

/** Ett spann, t.ex. timmar i veckan eller kronor i månaden. */
export type Intervall = {
  min: number;
  max: number;
};

/** Ett område i resultatet, med besökarens egna siffror och vår uträkning. */
export type OmradeResultat = {
  omrade: Omrade;
  /** Tiden besökaren själv angett. Saknas för områden vi föreslår. */
  lagt?: Intervall;
  /** Besökarens svar på "Hur sköts det i dag?". */
  idag?: string;
  /** Vad som troligen går att spara. 0–0 när det inte går att räkna. */
  besparing: Intervall;
  /** Läsbar rad för "Så räknade vi". */
  harledning: string;
  /**
   * True när besökaren inte valde området själv, men svaren pekar dit —
   * t.ex. många missade samtal. Kortet förklarar då varför med `skal`.
   */
  foreslaget: boolean;
  skal?: string;
};

/**
 * Ett förslag på resultatsidan: ett konkret flöde för ett problem vi ser i
 * svaren. Tre stycken visas — det första synligt, resten låsta tills mejl.
 */
export type Forslag = {
  /** Områdets id, eller "onskemal" för fritextens förslag. */
  id: string;
  /** Området, när förslaget gäller ett enda. */
  omrade?: Omrade;
  /** Områdena, när förslaget binder ihop flera — en kedja. */
  omraden?: Omrade[];
  /**
   * Varför förslaget kom med:
   * valt = de valde området själva, signal = svaren pekar dit,
   * bransch = vanligt i branschen, ide = ett steg längre än de frågat om
   * (bl.a. tillväxtidéerna, som inte bygger på ett område),
   * onskemal = det de helst vill slippa.
   */
  kalla: "valt" | "signal" | "bransch" | "ide" | "onskemal";
  /**
   * Utfyllnad utan egna svar bakom — pekad ut av målet eller följdfrågan,
   * men utan tid eller annat underlag. Leder bara om inget förslag ur deras
   * svar och ingen tillväxtidé passar bättre.
   */
  fyllnad?: boolean;
  rubrik: string;
  /** Vad det betyder för företaget. Leder kortet, direkt under rubriken. */
  affarsnytta?: string;
  /** Deras egna svar som grund. Aldrig en gissning. */
  varfor: string;
  /** Flödet, steg för steg. Tomt för önskemålet — det kommer från AI:n. */
  steg: string[];
  slipper: string;
  besparing?: Intervall;
  lagt?: Intervall;
  /** Bara när ett problem är tydligt nog att sätta en siffra på. */
  pengar?: string;
  /** Tiden uttryckt i tjänster, för större företag: "ungefär en halv heltid". */
  tjanster?: string;
  forstaSteget?: string;
};

/** En fas i planen ovanför förslagen. */
export type Plansteg = {
  rubrik: string;
  text: string;
  /** Vad som ska vara klart innan nästa fas — något verksamheten märker. */
  klartNar?: string;
};

export type Resultat = {
  /** Tre förslag, starkast först. Det första visas i låst läge. */
  forslag: Forslag[];
  /** Tre faser: snabb vinst, koppla ihop, AI och överblick. */
  plan: Plansteg[];
  /** Storleksnivån — styr skala och ton. */
  niva: Niva;
  /** Kom förslagen från AI-analysen eller regelmotorn? */
  kallaForslag: "ai" | "regler";
  /** Valda områden, störst besparing först. Ett föreslaget område sist. */
  omraden: OmradeResultat[];
  /** Summan av tiden besökaren angett. */
  lagt: Intervall;
  /** Summan av det som troligen går att spara. */
  besparing: Intervall;
  /** Uteblivna affärer från missade samtal, kronor i månaden. */
  missadeAffarer?: { kronor: Intervall; harledning: string };
  /** Vad de sagt är viktigast just nu. Styr rubriken och vilket förslag som leder. */
  mal?: Mal;
  /**
   * True när tiden att spara är liten (LITEN_TID_UNDER). Tidsrutorna flyttas
   * då ner under förslagen, som "Administrativ potential".
   */
  litenTid: boolean;
  bransch?: Bransch;
};
