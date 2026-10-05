/**
 * AI-analysen: formen den har, och kontrollen av den.
 *
 * Delas av servern (som tar emot svaret från AI:n) och klienten (som visar
 * det). Kontrollen är handskriven i stället för zod så att klienten slipper
 * ladda ett helt valideringsbibliotek.
 *
 * AI:n skriver aldrig siffror. Den väljer vilka områden ett förslag bygger på,
 * och tid räknas sedan fram ur besökarens egna svar (src/lib/analys.ts).
 */

import { CASE, OMRADEN, VERKTYG, type Niva } from "@/kompass/data/kompass";

export type AiForslag = {
  /** Områdes-id:n förslaget bygger på. Styr tidsuträkningen. */
  omraden: string[];
  rubrik: string;
  /** Vad förslaget betyder för företaget — affärer, kassaflöde, kapacitet. */
  affarsnytta: string;
  varfor: string;
  steg: string[];
  slipper: string;
  forsta_steget: string;
};

export type AiPlansteg = {
  rubrik: string;
  text: string;
  /** Vad som ska vara klart innan nästa fas. Kan saknas. */
  klart_nar?: string;
};

export type AiAnalys = {
  /** En mening om vad vi ser hittills — visas under frågorna. */
  hypotes: string;
  forslag: AiForslag[];
  plan: AiPlansteg[];
};

const GRANSER = {
  // Prompten ber om högst femton ord. Taket ger marginal, så att en något
  // längre mening inte försvinner tyst.
  hypotes: 200,
  rubrik: 100,
  affarsnytta: 240,
  varfor: 400,
  steg: 240,
  slipper: 200,
  forstaSteget: 240,
  planRubrik: 40,
  planText: 220,
} as const;

const giltigaOmraden = new Set(OMRADEN.map((o) => o.id));

function text(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length > 0 && t.length <= max ? t : null;
}

/**
 * Kontrollerar och tvättar en analys. Returnerar null om den inte duger —
 * då används regelmotorns förslag i stället. Ett enskilt trasigt förslag
 * slängs; resten behålls om minst två är hela.
 */
export function kontrolleraAiAnalys(indata: unknown): AiAnalys | null {
  if (typeof indata !== "object" || indata === null) return null;
  const r = indata as Record<string, unknown>;

  const hypotes = text(r.hypotes, GRANSER.hypotes) ?? "";

  const forslag: AiForslag[] = [];
  for (const f of Array.isArray(r.forslag) ? r.forslag : []) {
    if (typeof f !== "object" || f === null) continue;
    const x = f as Record<string, unknown>;

    const omraden = (Array.isArray(x.omraden) ? x.omraden : []).filter(
      (id): id is string => typeof id === "string" && giltigaOmraden.has(id),
    );
    const steg = (Array.isArray(x.steg) ? x.steg : [])
      .map((s) => text(s, GRANSER.steg))
      .filter((s): s is string => s !== null);
    const rubrik = text(x.rubrik, GRANSER.rubrik);
    const affarsnytta = text(x.affarsnytta, GRANSER.affarsnytta);
    const varfor = text(x.varfor, GRANSER.varfor);
    const slipper = text(x.slipper, GRANSER.slipper);
    const forstaSteget = text(x.forsta_steget, GRANSER.forstaSteget);

    // Siffror hör inte hemma i AI-texten — de räknas fram ur svaren.
    const harSiffror = [rubrik, affarsnytta, varfor, slipper, ...steg].some((t) =>
      /\d+\s*(h|tim|kr|%|procent|minut)/i.test(t ?? ""),
    );

    if (
      omraden.length === 0 ||
      steg.length < 3 ||
      !rubrik ||
      !affarsnytta ||
      !varfor ||
      !slipper ||
      !forstaSteget ||
      harSiffror
    ) {
      continue;
    }

    forslag.push({
      omraden: [...new Set(omraden)],
      rubrik,
      affarsnytta,
      varfor,
      steg: steg.slice(0, 6),
      slipper,
      forsta_steget: forstaSteget,
    });
  }

  if (forslag.length < 2) return null;

  const plan: AiPlansteg[] = [];
  for (const p of Array.isArray(r.plan) ? r.plan : []) {
    if (typeof p !== "object" || p === null) continue;
    const x = p as Record<string, unknown>;
    const rubrik = text(x.rubrik, GRANSER.planRubrik);
    const t = text(x.text, GRANSER.planText);
    const klart = text(x.klart_nar, GRANSER.planText) ?? undefined;
    if (rubrik && t) plan.push({ rubrik, text: t, ...(klart ? { klart_nar: klart } : {}) });
  }

  return {
    hypotes,
    forslag: forslag.slice(0, 3),
    // Två eller tre faser — en tredje pressas inte in om den inte behövs.
    plan: plan.length >= 2 && plan.length <= 3 ? plan : [],
  };
}

// ── Kontroll mot besökarens egna svar ───────────────────────────────────────

/**
 * Verktyg AI:n får nämna — bara om besökaren själv valt dem. Nyckel = ord i
 * texten, värde = svarsalternativet som måste vara valt.
 */
const VERKTYG_I_TEXT: Readonly<Record<string, string>> = {
  fortnox: VERKTYG.fortnox,
  visma: VERKTYG.visma,
  // Inte bara "google" — "omdöme på Google" handlar om kunden, inte deras verktyg.
  gmail: VERKTYG.google,
  "google kalender": VERKTYG.google,
  "google calendar": VERKTYG.google,
  "google drive": VERKTYG.google,
  "google workspace": VERKTYG.google,
  outlook: VERKTYG.microsoft,
  microsoft: VERKTYG.microsoft,
  teams: VERKTYG.microsoft,
  sharepoint: VERKTYG.microsoft,
  excel: VERKTYG.excel,
};

/**
 * Verktyg besökaren själv nämner i en text ("vi skriver offerter i Excel").
 * Dem vet vi att de har, även om de inte kryssat i dem bland systemen.
 */
export function verktygIText(text: string): string[] {
  const t = text.toLowerCase();
  return Object.entries(VERKTYG_I_TEXT)
    .filter(([ord]) => new RegExp(`\\b${ord}\\b`).test(t))
    .map(([, verktyg]) => verktyg);
}

/** Andra leverantörers produkter. Nämns aldrig — vi vet inte att de har dem. */
const ANDRA_PRODUKTER = [
  "hubspot", "pipedrive", "salesforce", "zapier", "make.com", "monday", "trello",
  "asana", "notion", "slack", "bokadirekt", "timewave", "tengella", "shopify",
  "wordpress", "chatgpt", "openai", "gemini", "calendly", "mailchimp", "zendesk",
];

/**
 * Namn på kunder och personer i våra case. Case-texten hämtas alltid från den
 * fasta listan (CASE) — AI:n får aldrig skriva egna påståenden om dem.
 */
const CASENAMN = Object.values(CASE).flatMap((c) => [
  c.foretag.split(" ")[0].toLowerCase(),
  ...(c.namn ? [c.namn.toLowerCase(), c.namn.split(" ")[0].toLowerCase()] : []),
]);

/** Siffror följda av en enhet — tid, pengar, procent. */
const SIFFRA = /\d+\s*(h|tim|kr|%|procent|minut|sek|dag|vecko|månad|år)/i;

/**
 * Varför en AI-text inte duger, eller null om den är ok. Används både för
 * analysens förslag och för förslaget på fritexten.
 */
export function otillatenText(text: string, verktyg: readonly string[]): string | null {
  const t = text.toLowerCase();
  if (SIFFRA.test(text)) return "siffror";
  for (const namn of CASENAMN) {
    if (new RegExp(`\\b${namn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(t)) return `casenamn: ${namn}`;
  }
  for (const produkt of ANDRA_PRODUKTER) {
    if (t.includes(produkt)) return `annan produkt: ${produkt}`;
  }
  for (const [ord, kravs] of Object.entries(VERKTYG_I_TEXT)) {
    if (new RegExp(`\\b${ord}\\b`).test(t) && !verktyg.includes(kravs)) return `verktyg de inte har: ${ord}`;
  }
  return null;
}

/** Chatbot föreslås aldrig — den ger för lite nytta att sälja. */
const CHATBOT = /chat{1,2}bot|chatt|assistent på hemsidan|assistent som svarar/i;

/**
 * Hemsida föreslås bara för de minsta företagen. För ett företag med fler än
 * fem anställda får den Khyte att se litet ut.
 */
const BARA_FOR_SMA = /hemsid|webbplats/i;

/**
 * Tvättar en analys mot besökarens svar:
 *  - förslag som nämner siffror, casekunder, andra produkter eller verktyg
 *    de inte valt slängs
 *  - varje område får ingå i högst ett förslag — annars visas samma timmar
 *    två gånger; ett senare förslag som delar område med ett tidigare slängs
 *  - en otillåten hypotes blir tom, en otillåten plan tas bort
 *  - allt som föreslår chatbot slängs, och för större företag (niva mellan
 *    eller stor) allt som föreslår hemsida
 * Kan lämna färre än tre förslag. Luckorna fylls med regelmotorns förslag.
 */
export function kontrolleraMotSvar(
  analys: AiAnalys,
  verktyg: readonly string[],
  niva: Niva = "liten",
): AiAnalys {
  const fel = (t: string) =>
    otillatenText(t, verktyg) !== null ||
    CHATBOT.test(t) ||
    (niva !== "liten" && BARA_FOR_SMA.test(t));

  const anvanda = new Set<string>();
  const forslag = analys.forslag.filter((f) => {
    const texter = [f.rubrik, f.affarsnytta, f.varfor, f.slipper, f.forsta_steget, ...f.steg];
    if (texter.some(fel)) return false;
    if (f.omraden.some((id) => anvanda.has(id))) return false;
    f.omraden.forEach((id) => anvanda.add(id));
    return true;
  });

  const planOk = analys.plan.every((p) => !fel(`${p.rubrik} ${p.text} ${p.klart_nar ?? ""}`));

  return {
    hypotes: analys.hypotes && !fel(analys.hypotes) ? analys.hypotes : "",
    forslag,
    plan: planOk ? analys.plan : [],
  };
}
