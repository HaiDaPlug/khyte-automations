/**
 * Analysen bakom förslagen på resultatsidan.
 *
 * Läser alla svar tillsammans — bransch, storlek, verktyg, hur det görs i dag,
 * missade samtal, svarstid — och väljer de tre förslag där vi ser tydligast
 * att vi kan hjälpa. Varje förslag är ett konkret flöde (src/data/floden.ts)
 * ifyllt med deras egna ord och verktyg.
 *
 * Siffror bara när de går att stå för: tid när de själva angett den, pengar
 * bara när problemet är tydligt och kundvärdet känt.
 */

import {
  ANDEL_MISSADE_SOM_AFFAR,
  BRANSCH,
  FLASKHALS,
  FRAGA,
  HELTID_TIMMAR,
  LANGSAM_SVARSTID,
  MAL,
  MAL_OMRADEN,
  MANGA_MISSADE_SAMTAL,
  NYCKELORD,
  OMRADEN,
  TEXT,
  VIKT_PER_NIVA,
  type Bransch,
  type Mal,
  type Niva,
  type Omrade,
} from "@/kompass/data/kompass";
import {
  BRANSCHTIPS,
  FLODEN,
  AI_OMRADEN,
  FLODEN_AVANCERAD,
  KEDJOR,
  OVERBLICK_OMRADEN,
  PLANFASER,
  TILLVAXT,
  ordFor,
  uppraknat,
  type Kedja,
  type Sammanhang,
  type Tillvaxtide,
} from "@/kompass/data/floden";
import { kontrolleraMotSvar, type AiAnalys, type AiForslag } from "@/kompass/lib/ai-typer";
import { flaskhalsFor, nivaFor, omradenFor, valdaOmraden } from "@/kompass/lib/flode";
import { formateraKronor, formateraTimmar, summera } from "@/kompass/lib/tid";
import type {
  Forslag,
  Intervall,
  OmradeResultat,
  Plansteg,
  Resultat,
  Svar,
} from "@/kompass/lib/typer";

/** "Skriva offerter" → "skriva offerter", men "RUT/ROT-…" lämnas som det är. */
function forstaGemen(text: string): string {
  return /^[A-ZÅÄÖ]{2}/.test(text)
    ? text
    : text.charAt(0).toLowerCase() + text.slice(1);
}

/**
 * Raderna i analysögonblicket före resultatet. Byggda av deras svar, så att
 * det som bockas av faktiskt stämmer: "Läser 14 svar", "Hittar tidstjuvarna:
 * offerter och fakturor", "Bygger tre förslag för er".
 */
export function analysRader(svar: Svar): string[] {
  const antal = Object.values(svar).filter((v) =>
    Array.isArray(v) ? v.length > 0 : typeof v === "string" && v.trim() !== "",
  ).length;

  // Uppgiftsnamnen, inte områdesnamnen — "offerter och uppföljning och
  // fakturor och betalningar" blir en ordsallad.
  const valda = valdaOmraden(svar).map((o) => forstaGemen(o.uppgift));
  const du = enval(svar, FRAGA.antal) === "Bara jag";

  return [
    `Läser ${antal} svar`,
    valda.length > 0
      ? `Hittar tidstjuvarna: ${uppraknat(valda)}`
      : "Letar efter tidstjuvarna",
    `Bygger ${ANTAL_FORSLAG === 3 ? "tre" : ANTAL_FORSLAG} förslag för ${du ? "dig" : "er"}`,
  ];
}

/** Antal förslag på resultatsidan. */
export const ANTAL_FORSLAG = 3;

/** Under det här beloppet i månaden nämner vi inga pengar alls. */
export const MINSTA_KRONOR_ATT_NAMNA = 5000;

function enval(svar: Svar, id: string): string | undefined {
  const v = svar[id];
  return typeof v === "string" ? v : undefined;
}

/** Verktygsvalen som namn att skriva i text. "Annat" och "Vet inte" räknas inte. */
const VERKTYGSNAMN: Readonly<Record<string, string>> = {
  Fortnox: "Fortnox",
  Visma: "Visma",
  "Google (Gmail, Kalender)": "Google",
  "Microsoft 365 (Outlook)": "Outlook",
  Bokningssystem: "ert bokningssystem",
  Branschsystem: "ert branschsystem",
  CRM: "ert CRM",
  "Excel eller papper": "Excel",
};

export function byggSammanhang(svar: Svar): Sammanhang {
  const bransch = enval(svar, FRAGA.bransch) as Bransch | undefined;
  const verktyg = Array.isArray(svar[FRAGA.verktyg])
    ? (svar[FRAGA.verktyg] as string[])
    : [];
  const har = (v: string) => verktyg.includes(v);

  return {
    du: enval(svar, FRAGA.antal) === "Bara jag",
    ord: ordFor(bransch),
    bransch,
    ekonomi: har("Fortnox") ? "Fortnox" : har("Visma") ? "Visma" : null,
    kalender: har("Google (Gmail, Kalender)")
      ? "Google Kalender"
      : har("Microsoft 365 (Outlook)")
        ? "Outlook"
        : null,
    bokningssystem: har("Bokningssystem"),
    crm: har("CRM"),
    system: verktyg.flatMap((v) => (VERKTYGSNAMN[v] ? [VERKTYGSNAMN[v]] : [])),
    rut: bransch === BRANSCH.stad || bransch === BRANSCH.hantverk,
  };
}

const IDAG_I_TEXT: Readonly<Record<string, string>> = {
  "För hand": ", och det mesta görs för hand",
  "Delvis i ett system": ", delvis i ett system",
  "Mest automatiserat": ", och mycket är redan automatiserat",
};

/** Fakta om samtal och förfrågningar, ur deras svar. Tom om inget sticker ut. */
function samtalsfakta(svar: Svar, k: Sammanhang): string[] {
  const ni = k.du ? "Du" : "Ni";
  const fakta: string[] = [];
  const missade = enval(svar, FRAGA.missadeSamtal);
  const svarstid = enval(svar, FRAGA.svarstid);

  if (missade && MANGA_MISSADE_SAMTAL.some((m) => m === missade)) {
    fakta.push(`${ni} missar ${missade.toLowerCase()} samtal i veckan`);
  }
  if (svarstid === "Nästa dag") {
    fakta.push("förfrågningar får ofta svar först nästa dag");
  } else if (svarstid === "Det varierar") {
    fakta.push("svarstiden på förfrågningar varierar");
  }
  return fakta;
}

/** Varför vi föreslår ett område — byggt på deras egna svar. */
function varfor(
  o: OmradeResultat,
  kalla: Forslag["kalla"],
  svar: Svar,
  k: Sammanhang,
): string {
  const ni = k.du ? "Du" : "Ni";
  const delar: string[] = [];

  if (kalla === "bransch") {
    return `Det här är ett av de ställen där ${k.ord.foretag} oftast tappar tid, och där ett enkelt flöde brukar göra stor skillnad.`;
  }

  if (o.lagt && o.idag) {
    delar.push(
      `${ni} lägger ${formateraTimmar(o.lagt)} i veckan på ${o.omrade.namn.toLowerCase()}${IDAG_I_TEXT[o.idag] ?? ""}.`,
    );
  }

  if (o.omrade.id === "samtal") {
    const fakta = samtalsfakta(svar, k);
    if (fakta.length > 0) {
      const mening = fakta.join(", och ");
      delar.push(`${mening.charAt(0).toUpperCase()}${mening.slice(1)}.`);
    }
    if (kalla === "signal") {
      delar.push(
        `Det valde ${k.du ? "du" : "ni"} inte som tidstjuv — men det är ofta just där ${k.ord.kunder} försvinner.`,
      );
    }
  }

  // Verktygen: det konkreta skälet till att flödet går att bygga hos dem.
  const kopplingsomraden = ["dubbelregistrering", "fakturor", "rapporter", "bokforing"];
  if (kalla === "valt" && o.idag !== "Mest automatiserat") {
    if (kopplingsomraden.includes(o.omrade.id) && k.system.length >= 2) {
      delar.push(
        `${ni} har redan ${uppraknat(k.system)} — flödet kopplar ihop dem i stället för att ersätta dem.`,
      );
    } else if (k.system.includes("Excel") && o.idag === "För hand") {
      delar.push("Excel och papper är ofta just där tiden försvinner.");
    }
  }

  return delar.join(" ");
}

/** Pengar nämns bara för samtal, och bara när problemet är tydligt. */
function pengar(
  o: OmradeResultat,
  svar: Svar,
  resultat: Pick<Resultat, "missadeAffarer">,
  k: Sammanhang,
): string | undefined {
  if (o.omrade.id !== "samtal" || !resultat.missadeAffarer) return undefined;

  const missade = enval(svar, FRAGA.missadeSamtal);
  if (!MANGA_MISSADE_SAMTAL.some((m) => m === missade)) return undefined;

  const kr = resultat.missadeAffarer.kronor.min;
  if (kr < MINSTA_KRONOR_ATT_NAMNA) return undefined;

  const procent = Math.round(ANDEL_MISSADE_SOM_AFFAR.min * 100);
  return `Om bara ${procent} % av de missade samtalen hade blivit nya ${k.ord.kunder} motsvarar det runt ${formateraKronor({ min: kr, max: kr })} i månaden.`;
}

/**
 * Hur starkt ett område är som förslag. Tiden de kan spara väger tyngst.
 * Samtal får extra vikt när svaren visar att kunder faktiskt tappas, och
 * storleken avgör vad som väger mest — se VIKT_PER_NIVA.
 */
function styrka(o: OmradeResultat, svar: Svar): number {
  const vikt = VIKT_PER_NIVA[nivaFor(svar)][o.omrade.id] ?? 1;
  return grundstyrka(o, svar) * vikt;
}

function grundstyrka(o: OmradeResultat, svar: Svar): number {
  let poang = o.besparing.max;
  if (o.idag === "För hand") poang += 1;

  if (o.omrade.id === "samtal") {
    const missade = enval(svar, FRAGA.missadeSamtal);
    const svarstid = enval(svar, FRAGA.svarstid);
    if (MANGA_MISSADE_SAMTAL.some((m) => m === missade)) poang += 2;
    if (LANGSAM_SVARSTID.some((l) => l === svarstid)) poang += 1;
  }
  return poang;
}

/**
 * Tid uttryckt i tjänster, för företag med 6 anställda eller fler. Det är så
 * en vd tänker: "en halv tjänst", inte "12–20 timmar".
 */
export function tjansterText(besparing: Intervall | undefined, niva: Niva): string | undefined {
  if (!besparing || niva === "liten") return undefined;
  const andel = (besparing.min + besparing.max) / 2 / HELTID_TIMMAR;
  if (andel < 0.15) return undefined;
  if (andel < 0.35) return "motsvarar ungefär en kvarts heltidstjänst";
  if (andel < 0.65) return "motsvarar ungefär en halv heltidstjänst";
  if (andel < 0.9) return "motsvarar nästan en heltidstjänst";
  if (andel < 1.3) return "motsvarar ungefär en heltidstjänst";
  const antal = Math.round(andel * 2) / 2;
  return `motsvarar ungefär ${String(antal).replace(".", ",")} heltidstjänster`;
}

/** Flödet för ett område — det avancerade för företag med 6 eller fler. */
function flodeFor(id: string, k: Sammanhang, niva: Niva) {
  const mall = niva === "liten" ? FLODEN[id] : (FLODEN_AVANCERAD[id] ?? FLODEN[id]);
  return mall(k);
}

function tillForslag(
  o: OmradeResultat,
  kalla: Forslag["kalla"],
  svar: Svar,
  resultat: Pick<Resultat, "missadeAffarer">,
  k: Sammanhang,
  niva: Niva,
): Forslag {
  const flode = flodeFor(o.omrade.id, k, niva);
  const besparing = o.besparing.max > 0 ? o.besparing : undefined;
  return {
    id: o.omrade.id,
    omrade: o.omrade,
    kalla,
    rubrik: flode.rubrik,
    affarsnytta: o.omrade.affarsnytta,
    varfor: varfor(o, kalla, svar, k),
    steg: flode.steg,
    slipper: flode.slipper,
    besparing,
    lagt: o.lagt,
    pengar: pengar(o, svar, resultat, k),
    tjanster: tjansterText(besparing, niva),
    forstaSteget: o.omrade.forstaSteget,
  };
}

/** Ett område utan egna svar — används för branschtipsen. */
const utanSvar = (omrade: Omrade): OmradeResultat => ({
  omrade,
  besparing: { min: 0, max: 0 },
  harledning: "",
  foreslaget: true,
});

/** Summerar tid över flera områden. Saknas all tid blir det undefined. */
function summaTid(delar: OmradeResultat[], falt: "lagt" | "besparing") {
  const intervall = delar.flatMap((d) => {
    const v = d[falt];
    return v && v.max > 0 ? [v] : [];
  });
  return intervall.length > 0 ? summera(intervall) : undefined;
}

/**
 * Hittar den starkaste kedjan: minst två av dess områden bland svaren, och
 * minst ett av kärnområdena. Det är i överlämningarna mellan områden som
 * tiden försvinner — och där vi gör störst skillnad.
 */
function valjKedja(
  omraden: OmradeResultat[],
  svar: Svar,
): { kedja: Kedja; delar: OmradeResultat[] } | null {
  let bast: { kedja: Kedja; delar: OmradeResultat[]; poang: number } | null = null;

  for (const kedja of KEDJOR) {
    const delar = omraden.filter((o) => kedja.omraden.includes(o.omrade.id));
    if (delar.length < 2) continue;
    if (!delar.some((d) => kedja.karna.includes(d.omrade.id))) continue;
    const poang = delar.reduce((s, d) => s + styrka(d, svar), 0);
    if (!bast || poang > bast.poang) bast = { kedja, delar, poang };
  }

  return bast ? { kedja: bast.kedja, delar: bast.delar } : null;
}

function kedjeForslag(
  kedja: Kedja,
  delar: OmradeResultat[],
  svar: Svar,
  resultat: Pick<Resultat, "missadeAffarer">,
  k: Sammanhang,
  niva: Niva,
): Forslag {
  const flode = kedja.flode(k);
  const lagt = summaTid(delar, "lagt");
  const besparing = summaTid(delar, "besparing");
  // "offerter och uppföljning samt fakturor och betalningar" — namnen
  // innehåller redan "och", så de binds ihop med komma och "samt".
  const namn = uppraknatSamt(delar.map((d) => d.omrade.namn.toLowerCase()));
  const ni = k.du ? "Du" : "Ni";
  const samtal = delar.find((d) => d.omrade.id === "samtal");

  return {
    id: `kedja-${kedja.id}`,
    omraden: delar.map((d) => d.omrade),
    kalla: delar.some((d) => !d.foreslaget) ? "valt" : "signal",
    rubrik: flode.rubrik,
    affarsnytta: kedja.affarsnytta,
    varfor: lagt
      ? `${ni} lägger ${formateraTimmar(lagt)} i veckan på ${namn}. Det hänger ihop — och det är i överlämningarna mellan dem som tiden försvinner.`
      : `${stor(namn)} hänger ihop — och det är i överlämningarna mellan dem som tiden försvinner.`,
    steg: flode.steg,
    slipper: flode.slipper,
    besparing,
    lagt,
    pengar: samtal ? pengar(samtal, svar, resultat, k) : undefined,
    tjanster: tjansterText(besparing, niva),
    forstaSteget: kedja.forstaSteget,
  };
}

const stor = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

function uppraknatSamt(lista: string[]): string {
  if (lista.length <= 1) return lista[0] ?? "";
  return `${lista.slice(0, -1).join(", ")} samt ${lista[lista.length - 1]}`;
}

/** Ett förslag från AI-analysen, med tiden räknad ur deras egna svar. */
function franAi(
  f: AiForslag,
  index: number,
  omraden: OmradeResultat[],
  svar: Svar,
  resultat: Pick<Resultat, "missadeAffarer">,
  k: Sammanhang,
  niva: Niva,
): Forslag {
  const delar = omraden.filter((o) => f.omraden.includes(o.omrade.id));
  const lagt = summaTid(delar, "lagt");
  const besparing = summaTid(delar, "besparing");
  const samtal = delar.find((d) => d.omrade.id === "samtal");
  const objekt = f.omraden
    .map((id) => OMRADEN.find((o) => o.id === id))
    .filter((o): o is Omrade => o !== undefined);

  return {
    id: `ai-${index}-${f.omraden.join("+")}`,
    omrade: objekt.length === 1 ? objekt[0] : undefined,
    omraden: objekt.length > 1 ? objekt : undefined,
    kalla: delar.some((d) => !d.foreslaget)
      ? "valt"
      : delar.length > 0
        ? "signal"
        : "ide",
    rubrik: f.rubrik,
    affarsnytta: f.affarsnytta,
    varfor: f.varfor,
    steg: f.steg,
    slipper: f.slipper,
    besparing,
    lagt,
    pengar: samtal ? pengar(samtal, svar, resultat, k) : undefined,
    tjanster: tjansterText(besparing, niva),
    forstaSteget: f.forsta_steget,
  };
}

/**
 * Vilket område fritexten pekar på, ur NYCKELORD. Bara områden som finns för
 * branschen. Flest träffar vinner; ingen träff ger undefined.
 */
export function omradeForFritext(fritext: string, bransch: Bransch | undefined): Omrade | undefined {
  const t = fritext.toLowerCase();
  let bast: { omrade: Omrade; traffar: number } | undefined;
  for (const omrade of omradenFor(bransch)) {
    const traffar = (NYCKELORD[omrade.id] ?? []).filter((ord) => t.includes(ord)).length;
    if (traffar > 0 && (!bast || traffar > bast.traffar)) bast = { omrade, traffar };
  }
  return bast?.omrade;
}

/**
 * Det de helst vill slippa. Claude skriver flödet (se ForslagKort); stegen här
 * är reserven — regelmotorns flöde för det område texten pekar på — som visas
 * om AI:n inte svarar. Pekar texten inte på något område blir stegen tomma.
 */
function onskemalForslag(fritext: string, k: Sammanhang, niva: Niva): Forslag {
  const omrade = omradeForFritext(fritext, k.bransch);
  return {
    id: "onskemal",
    kalla: "onskemal",
    rubrik: `Det ${k.du ? "du" : "ni"} helst vill slippa`,
    varfor: fritext,
    steg: omrade ? flodeFor(omrade.id, k, niva).steg : [],
    slipper: "",
  };
}

/**
 * Väljer och bygger de tre förslagen.
 *
 * Finns en AI-analys används den — den har byggts upp svar för svar och ser
 * helheten. Annars regelmotorn:
 *  1. En kedja om flera valda områden hänger ihop — hela flödet, inte bitar.
 *  2. Övriga områden med svar, starkast först (vägt efter storlek).
 *  3. Har de skrivit vad de helst vill slippa får det sista platsen.
 *  4. Räcker det inte fylls det på med det som brukar ge mest i branschen.
 * Har de sagt vad som är viktigast just nu leder det förslag som svarar mot
 * målet — se ledMedMal.
 */
export function byggForslag(
  svar: Svar,
  omraden: OmradeResultat[],
  resultat: Pick<Resultat, "missadeAffarer" | "mal">,
  ai?: AiAnalys | null,
): Forslag[] {
  const k = byggSammanhang(svar);
  const niva = nivaFor(svar);
  const fritext = enval(svar, FRAGA.fritext)?.trim();
  const platser = fritext ? ANTAL_FORSLAG - 1 : ANTAL_FORSLAG;

  const regel = regelForslag(svar, omraden, resultat, k, niva, platser);
  const onskemal = fritext ? [onskemalForslag(fritext, k, niva)] : [];
  const { mal } = resultat;
  const ordna = (lista: Forslag[]) =>
    mal && mal !== "admin"
      ? ledMedMal(lista, mal, { svar, omraden, resultat, k, niva, platser })
      : lista;

  // AI-förslagen, tvättade mot svaren: inga verktyg de inte har, inga
  // casekunder, inga siffror, och varje område i högst ett förslag.
  const aiRen = ai ? kontrolleraMotSvar(ai, verktygIsvar(svar), niva) : null;
  if (aiRen && aiRen.forslag.length > 0) {
    const valda = aiRen.forslag
      .slice(0, platser)
      .map((f, i) => franAi(f, i, omraden, svar, resultat, k, niva));

    // Lediga platser fylls med regelmotorns förslag — bara sådana som inte
    // delar område med något AI-förslag, så att ingen tid räknas två gånger.
    const anvanda = new Set(aiRen.forslag.slice(0, platser).flatMap((f) => f.omraden));
    for (const r of regel) {
      if (valda.length >= platser) break;
      const ids = omradesIds(r);
      if (ids.some((id) => anvanda.has(id))) continue;
      valda.push(r);
      ids.forEach((id) => anvanda.add(id));
    }
    return [...ordna(valda), ...onskemal];
  }

  return [...ordna(regel), ...onskemal];
}

/** "Ni sa att det viktigaste just nu är att få betalt snabbare — därför börjar vi där." */
const maletText = (mal: Mal, k: Sammanhang) => TEXT.resultat.malet(k.du, MAL[mal]);

/**
 * Varför det ledande förslaget kom med, i deras egna ord: flaskhalsen de
 * valde ("Ni svarade att det oftast fastnar här: ”Fakturan skapas sent”."),
 * annars målet.
 */
function malVarfor(mal: Mal, svar: Svar, k: Sammanhang): string {
  const fh = flaskhalsFor(svar);
  if (fh && mal !== "admin" && fh.svar !== "Annat") return FLASKHALS[mal].varfor(k.du, fh.svar);
  return maletText(mal, k);
}

/** En tillväxtidé som förslag — utan tid, den bygger inte på ett område. */
function tillvaxtForslag(ide: Tillvaxtide, k: Sammanhang, varfor: string): Forslag {
  const flode = ide.flode(k);
  return {
    id: `tillvaxt-${ide.id}`,
    kalla: "ide",
    rubrik: flode.rubrik,
    affarsnytta: ide.affarsnytta,
    varfor,
    steg: flode.steg,
    slipper: flode.slipper,
    forstaSteget: ide.forstaSteget,
  };
}

/** Täcker något av förslagen redan idén? Då läggs den inte till en gång till. */
const tacks = (ide: Tillvaxtide, forslag: Forslag[]): boolean =>
  forslag.some((f) => ide.liknar.test([f.rubrik, ...f.steg].join(" ")));

type MalUnderlag = {
  svar: Svar;
  omraden: OmradeResultat[];
  resultat: Pick<Resultat, "missadeAffarer">;
  k: Sammanhang;
  niva: Niva;
  platser: number;
};

/**
 * Ett förslag för ett av målets områden när inget av förslagen redan täcker
 * det. Har de valt området (men det fick inte plats) används deras tid;
 * annars blir det utan siffror.
 */
function forslagForOmrade(ids: readonly string[], mal: Mal, u: MalUnderlag): Forslag | undefined {
  const tillgangliga = new Set(omradenFor(u.k.bransch).map((o) => o.id));
  const id = ids.find((x) => tillgangliga.has(x));
  const omrade = OMRADEN.find((o) => o.id === id);
  if (!omrade) return undefined;

  const egen = u.omraden.find((o) => o.omrade.id === omrade.id);
  const kalla = egen && !egen.foreslaget ? "valt" : "signal";
  const f = tillForslag(egen ?? utanSvar(omrade), kalla, u.svar, u.resultat, u.k, u.niva);
  return { ...f, varfor: malVarfor(mal, u.svar, u.k) };
}

/**
 * Målet leder. Det de sagt är viktigast just nu — och flaskhalsen de pekat ut
 * — ska vara det första de ser, inte det som råkade ge störst kalkyl.
 *  - Finns ett förslag ur svaren som bygger på flaskhalsens (annars målets)
 *    områden flyttas det först.
 *  - Annars leder flaskhalsens tillväxtidé, i företagets storlek.
 *  - Annars skapas ett förslag för flaskhalsens första område.
 *  - För "fler förfrågningar" får branschens vanligaste (utfyllnad utan svar)
 *    ge plats åt tillväxtidéerna.
 * Förslag som bygger på deras svar behålls i sin ordning efter ledaren.
 */
function ledMedMal(forslag: Forslag[], mal: Mal, u: MalUnderlag): Forslag[] {
  const fh = flaskhalsFor(u.svar);
  const malOmraden = fh ? fh.omraden : MAL_OMRADEN[mal];
  const ideId = fh?.ide?.[u.niva === "liten" ? "liten" : "storre"];

  const egna = forslag.filter((f) => f.kalla !== "bransch");
  const utfyllnad = forslag.filter((f) => f.kalla === "bransch");
  const varfor = malVarfor(mal, u.svar, u.k);
  const ideer =
    mal === "forfragningar"
      ? TILLVAXT.filter((ide) => ide.nivaer.includes(u.niva) && !tacks(ide, egna)).map((ide) =>
          tillvaxtForslag(ide, u.k, varfor),
        )
      : [];

  const i = egna.findIndex((f) => omradesIds(f).some((id) => malOmraden.includes(id)));
  const ledare =
    (i >= 0 ? egna[i] : undefined) ??
    (ideId ? ideer.find((f) => f.id === `tillvaxt-${ideId}`) : undefined) ??
    // Fler förfrågningar utan flaskhals: idén i företagets storlek, inte
    // ett slumpat område ur målets lista.
    (mal === "forfragningar" && !fh ? ideer[0] : undefined) ??
    forslagForOmrade(malOmraden, mal, u);
  if (!ledare) return forslag;

  const resten = i >= 0 ? egna.filter((_, j) => j !== i) : egna;
  const ovrigaIdeer = ideer.filter((f) => f !== ledare);

  return [ledare, ...resten, ...ovrigaIdeer, ...utfyllnad].slice(0, u.platser);
}

/**
 * Flaskhalsen bakom ett förslag, för kontrollfrågan ("Vi tror att er första
 * flaskhals är …"). Ingen för önskemålet eller branschens utfyllnad — där
 * vore det en gissning.
 */
export function diagnosFor(f: Forslag | undefined): string | undefined {
  if (!f || f.kalla === "onskemal" || f.kalla === "bransch") return undefined;
  if (f.id.startsWith("kedja-")) return KEDJOR.find((k) => `kedja-${k.id}` === f.id)?.diagnos;
  if (f.id.startsWith("tillvaxt-")) {
    return TILLVAXT.find((t) => `tillvaxt-${t.id}` === f.id)?.diagnos;
  }
  return (f.omrade ?? f.omraden?.[0])?.diagnos;
}

/** Områdena ett förslag bygger på. */
const omradesIds = (f: Forslag): string[] =>
  f.omraden?.map((o) => o.id) ?? (f.omrade ? [f.omrade.id] : []);

/** Verktygen besökaren valt. */
const verktygIsvar = (svar: Svar): string[] => {
  const v = svar[FRAGA.verktyg];
  return Array.isArray(v) ? v : [];
};

/** Regelmotorns förslag: kedja, starkaste områdena, branschens vanligaste. */
function regelForslag(
  svar: Svar,
  omraden: OmradeResultat[],
  resultat: Pick<Resultat, "missadeAffarer">,
  k: Sammanhang,
  niva: Niva,
  platser: number,
): Forslag[] {
  const rangordnade = [...omraden].sort((a, b) => styrka(b, svar) - styrka(a, svar));
  const valda: Forslag[] = [];

  const kedja = valjKedja(rangordnade, svar);
  const iKedjan = new Set(kedja?.delar.map((d) => d.omrade.id) ?? []);
  if (kedja) {
    valda.push(kedjeForslag(kedja.kedja, kedja.delar, svar, resultat, k, niva));
  }

  for (const o of rangordnade) {
    if (valda.length >= platser) break;
    if (iKedjan.has(o.omrade.id)) continue;
    valda.push(tillForslag(o, o.foreslaget ? "signal" : "valt", svar, resultat, k, niva));
  }

  // Fyll på med branschens vanligaste — bara områden som finns för branschen
  // och som inte redan är med.
  const tillgangliga = new Set(omradenFor(k.bransch).map((o) => o.id));
  const redanMed = new Set([
    ...valda.flatMap((f) => [f.omrade?.id, ...(f.omraden ?? []).map((o) => o.id)]),
  ]);
  for (const id of BRANSCHTIPS[k.bransch ?? BRANSCH.annat]) {
    if (valda.length >= platser) break;
    if (redanMed.has(id) || !tillgangliga.has(id)) continue;
    const omrade = OMRADEN.find((o) => o.id === id);
    if (!omrade) continue;
    valda.push(tillForslag(utanSvar(omrade), "bransch", svar, resultat, k, niva));
    redanMed.add(id);
  }

  return valda;
}

/**
 * Verktyget som hör till ett område — bara det nämns i planen. "Skriva
 * offerter, byggt på Outlook" säger ingenting; fakturor i Fortnox gör det.
 */
function relevantVerktyg(omradeId: string, k: Sammanhang): string | null {
  if (["fakturor", "bokforing", "rut"].includes(omradeId)) return k.ekonomi;
  if (["bokning", "samtal", "schema"].includes(omradeId)) {
    return k.bokningssystem ? "ert bokningssystem" : k.kalender;
  }
  if (omradeId === "nya-kunder" && k.crm) return "ert CRM";
  if (["dubbelregistrering", "rapporter"].includes(omradeId) && k.system.length >= 2) {
    return uppraknat(k.system.slice(0, 2));
  }
  return null;
}

/**
 * Planen, fas för fas. AI-analysens plan används om den finns och håller.
 * Annars byggs den av förslagen — och bara med de faser som passar:
 *  1. Snabb vinst: det starkaste enskilda området (för större företag det
 *     starkaste i kedjan), med deras verktyg.
 *  2. Koppla ihop: bara om det finns en kedja eller minst två verktyg.
 *  3. AI och överblick: bara om verksamheten har samtal/bokningar (AI) eller
 *     rapporter, samordning och flera system (överblick) — eller är större.
 * Varje fas säger när den är klar. Blir det bara en fas visas ingen plan.
 */
export function byggPlan(svar: Svar, forslag: Forslag[], ai?: AiAnalys | null): Plansteg[] {
  const aiPlan = ai ? kontrolleraMotSvar(ai, verktygIsvar(svar), nivaFor(svar)).plan : [];
  if (aiPlan.length >= 2) {
    return aiPlan.map((p) => ({ rubrik: p.rubrik, text: p.text, klartNar: p.klart_nar || undefined }));
  }

  const k = byggSammanhang(svar);
  const niva = nivaFor(svar);
  // Bara förslag som bygger på deras egna svar — branschens vanligaste
  // (utfyllnad) får inte bli planens första steg.
  const enskilda = forslag.filter(
    (f) => f.omrade && f.kalla !== "onskemal" && f.kalla !== "bransch",
  );
  const kedjeForslaget = forslag.find((f) => f.id.startsWith("kedja-"));
  const kedja = kedjeForslaget ? KEDJOR.find((x) => `kedja-${x.id}` === kedjeForslaget.id) : undefined;

  // Fas 1: snabb vinst. Litet företag: helst något vi har färdigt. Större:
  // det starkaste området (i kedjan, annars det starkaste förslaget) — där
  // ligger tiden, inte i omdömen bara för att de råkar finnas färdiga.
  const snabb =
    niva !== "liten" && kedjeForslaget?.omraden
      ? kedjeForslaget.omraden[0]
      : ((niva === "liten" ? (enskilda.find((f) => f.omrade?.fardig) ?? enskilda[0]) : enskilda[0])
          ?.omrade ?? kedjeForslaget?.omraden?.[0]);
  if (!snabb) return [];

  const plan: Plansteg[] = [
    {
      rubrik: PLANFASER.fas1.rubrik,
      text: PLANFASER.fas1.text(forstaGemen(snabb.uppgift), relevantVerktyg(snabb.id, k)),
      klartNar: snabb.klartNar,
    },
  ];

  // Fas 2: koppla ihop — bara om det finns något att koppla.
  if (kedjeForslaget && kedja) {
    plan.push({
      rubrik: PLANFASER.fas2.rubrik,
      text: PLANFASER.fas2.text(forstaGemen(kedjeForslaget.rubrik)),
      klartNar: kedja.klartNar,
    });
  } else if (k.system.length >= 2) {
    plan.push({
      rubrik: PLANFASER.fas2.rubrik,
      text: PLANFASER.fas2.textUtanKedja(k),
      klartNar: PLANFASER.fas2.klartUtanKedja(k),
    });
  }

  // Fas 3: AI och överblick — bara det verksamheten faktiskt behöver. Bara
  // förslag som bygger på deras egna svar räknas; branschens vanligaste
  // (utfyllnad utan svar) får inte styra planen.
  const ids = new Set(
    forslag.filter((f) => f.kalla !== "bransch" && f.kalla !== "onskemal").flatMap(omradesIds),
  );
  const behoverAi = AI_OMRADEN.some((id) => ids.has(id));
  const behoverOverblick = niva !== "liten" || OVERBLICK_OMRADEN.some((id) => ids.has(id));
  const delar = [
    ...(behoverAi ? [PLANFASER.fas3.ai] : []),
    ...(behoverOverblick ? [PLANFASER.fas3.overblick(k)] : []),
  ];
  if (delar.length) {
    plan.push({
      rubrik: PLANFASER.fas3.rubrik,
      text: PLANFASER.fas3.text(delar),
      klartNar: behoverOverblick ? PLANFASER.fas3.klartOverblick(k) : PLANFASER.fas3.klartAi,
    });
  }

  return plan.length >= 2 ? plan : [];
}
