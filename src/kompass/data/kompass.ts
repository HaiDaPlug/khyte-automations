/**
 * Allt innehåll i Automationskompassen bor här.
 *
 * Reglerna för den här filen:
 *  - Ingen logik. Bara data. Logiken ligger i src/lib/.
 *  - Alla texter som en användare ser ska gå att ändra här, utan att röra kod.
 *  - Konstanter märkta // KALIBRERA är uppskattningar. De justeras när vi har
 *    riktig data från kunder. De är medvetet försiktiga — hellre för låg
 *    gissning än en siffra vi inte kan försvara i ett möte.
 *  - Timmarna kommer från besökarens egna svar. Våra antaganden gäller bara
 *    hur stor del som går att automatisera och vad en missad kund kostar.
 */

// ── Identitet och länkar ────────────────────────────────────────────────────

export const SAJT = {
  bas: "https://khyte.se",
  integritetspolicy: "https://khyte.se/integritetspolicy",
  mejl: "hai@khyte.se",
  telefon: "070-099 68 38",
  telefonLank: "tel:+46700996838",
} as const;

// ── Frågornas identiteter ───────────────────────────────────────────────────
// Sträng-id:n i stället för index: en fråga kan flyttas utan att matchningen
// eller sparade svar i localStorage går sönder. Frågor på samma skärm har egna
// id:n för varje del — svaren sparas platt, ett per del.

export const FRAGA = {
  bransch: "bransch",
  // Skärm: om er
  omEr: "om_er",
  antal: "antal",
  // Frågas på tacksidan, efter mejlet — se ROLLER.
  roll: "roll",
  mal: "mal",
  // Skärm: följdfrågan som hör till målet — se FLASKHALS
  flaskhals: "flaskhals",
  // Skärm: era kunder
  kunder: "kunder",
  missadeSamtal: "missade_samtal",
  svarstid: "svarstid",
  kundvarde: "kundvarde",
  // Vad som tar tid, följt av en skärm per valt område
  tidstjuvar: "tidstjuvar",
  // Skärm: verktyg och när de vill komma igång
  slutet: "verktyg_start",
  verktyg: "verktyg",
  tidshorisont: "tidshorisont",
  fritext: "fritext",
  // Kontrollfrågan på resultatsidan: stämmer vår bedömning?
  bekraftelse: "bekraftelse",
  bekraftelseText: "bekraftelse_text",
} as const;

/** Svarsnycklar för följdfrågorna per område. */
export const OMRADESNYCKEL = {
  skarm: (omradeId: string) => `omrade_${omradeId}`,
  tid: (omradeId: string) => `omrade_${omradeId}_tid`,
  idag: (omradeId: string) => `omrade_${omradeId}_idag`,
} as const;

// ── Branscher ───────────────────────────────────────────────────────────────

export const BRANSCH = {
  stad: "Städ och flytt",
  bil: "Bilverkstad och bilvård",
  hantverk: "Hantverk och bygg",
  vard: "Vård och hälsa",
  skonhet: "Frisör och skönhet",
  restaurang: "Restaurang och café",
  butik: "Butik och e-handel",
  fastighet: "Fastighet och förvaltning",
  transport: "Transport och logistik",
  byra: "Byrå och B2B-tjänster",
  annat: "Annat",
} as const;

export type Bransch = (typeof BRANSCH)[keyof typeof BRANSCH];

// ── Frågetyper ──────────────────────────────────────────────────────────────

/** En del av en skärm med flera korta frågor. Besvaras med ett tryck. */
export type Delfraga = {
  id: string;
  fraga: string;
  hjalptext?: string;
  alternativ: readonly string[];
  /** Flera val på samma rad. En skärm med en sådan rad går inte vidare av sig själv. */
  flerval?: boolean;
  /**
   * Kort kommentar som dyker upp när ett visst alternativ väljs.
   * Inga påhittade siffror — bara sådant vi kan stå för i ett möte.
   */
  reaktioner?: Readonly<Record<string, string>>;
};

export type Fraga =
  | {
      id: string;
      typ: "enval";
      fraga: string;
      hjalptext?: string;
      alternativ: readonly string[];
      reaktioner?: Readonly<Record<string, string>>;
      /** Två kolumner i stället för en lista. För många korta alternativ. */
      rutnat?: boolean;
    }
  | {
      id: string;
      typ: "flerval";
      fraga: string;
      hjalptext?: string;
      alternativ: readonly string[];
      /** Högst så här många val. Saknas = obegränsat. */
      max?: number;
      rutnat?: boolean;
    }
  | {
      id: string;
      typ: "grupp";
      fraga: string;
      /** Liten rad ovanför rubriken, t.ex. "Tidstjuv 1 av 3". */
      overrubrik?: string;
      hjalptext?: string;
      /** Skärmen går vidare av sig själv när alla delar är besvarade. */
      delar: readonly Delfraga[];
    }
  | {
      id: string;
      typ: "fritext";
      fraga: string;
      hjalptext?: string;
      platshallare: string;
      valfri: true;
      /** Tryckbara förslag som fyller i texten. Sätts av flödet. */
      snabbval?: readonly string[];
    };

// ── Områden ─────────────────────────────────────────────────────────────────
// Allt vi kan hjälpa till med, inte bara det som redan är byggt. Besökaren
// väljer upp till tre, och får sedan två snabba följdfrågor per område.

export type Omrade = {
  id: string;
  /** Kort namn — visas som val och som rubrik. */
  namn: string;
  /** Vad som ingår. Visas under rubriken på följdfrågan. */
  exempel: string;
  /** Fortsättning på "Mest tid går …" i sammanfattningen. */
  varTiden: string;
  /** Vad vi skulle bygga. En till två meningar. */
  losning: string;
  /** Det minsta första steget — något de kan göra nästa vecka. */
  forstaSteget: string;
  /**
   * Vad det betyder för företaget — inte för den som gör jobbet. Fler
   * affärer, kassaflöde, kapacitet, färre fel, mindre sårbarhet. Inga siffror.
   */
  affarsnytta: string;
  /**
   * Vad det kostar affären när det sköts som i dag. Inleder sammanfattningen
   * när området är det starkaste förslaget. Inga siffror.
   */
  konsekvens: string;
  /** När området är klart som fas 1 i planen — något verksamheten märker. */
  klartNar: string;
  /**
   * Flaskhalsen i en fras, för kontrollfrågan på resultatsidan: "Vi tror att
   * er första flaskhals är <diagnos>. Stämmer det?"
   */
  diagnos: string;
  /**
   * Uppgiften i vardagsord, som snabbval på frågan "vilken uppgift vill du
   * slippa?". Kort — ska få plats i ett piller.
   */
  uppgift: string;
  /**
   * True när vi har en färdig lösning som går att starta snabbt. Annars
   * bygger vi skräddarsytt. Fylls i manuellt.
   */
  fardig: boolean;
  caseIds?: readonly string[];
  /** Visas bara för dessa branscher. Saknas = alla. */
  branscher?: readonly Bransch[];
};

export const OMRADEN: readonly Omrade[] = [
  {
    id: "samtal",
    namn: "Samtal och förfrågningar",
    exempel: "Svara i telefon, ringa tillbaka, svara på mejl och formulär.",
    varTiden: "till samtal och förfrågningar",
    losning:
      "Den som inte får svar i telefon får ett SMS direkt, och förfrågningar på mejl och formulär besvaras inom en minut, dygnet runt.",
    forstaSteget:
      "Räkna missade samtal och obesvarade förfrågningar under en vecka.",
    affarsnytta:
      "Fler förfrågningar blir affärer — utan att någon behöver sitta vid telefonen.",
    konsekvens:
      "Varje förfrågan som inte får svar direkt är en kund som kan hinna vända sig till någon annan.",
    klartNar:
      "Klart när varje samtal och förfrågan får svar direkt — även när ni är upptagna.",
    diagnos: "samtal och förfrågningar som inte får svar direkt",
    uppgift: "Ringa tillbaka kunder",
    fardig: true,
  },
  {
    id: "bokning",
    namn: "Bokningar och påminnelser",
    exempel: "Boka in, flytta tider, påminna kunder om besöket.",
    varTiden: "till bokningar och påminnelser",
    losning:
      "Kunderna bokar och ombokar själva, och påminnelsen går ut automatiskt dagen innan. Färre samtal och färre uteblivna besök.",
    forstaSteget:
      "Räkna hur många bokningar som flyttas eller uteblir en vanlig vecka.",
    affarsnytta:
      "Fler bokade timmar och färre tomma luckor: mer intäkt på samma personal.",
    konsekvens:
      "Tomma tider och uteblivna besök är intäkter som aldrig kommer tillbaka.",
    klartNar:
      "Klart när kunderna bokar och ombokar själva och påminnelserna går ut av sig själva.",
    diagnos: "bokningar och ombokningar som sköts för hand",
    uppgift: "Boka och flytta tider",
    fardig: true,
  },
  {
    id: "offerter",
    namn: "Offerter och uppföljning",
    exempel: "Räkna, skriva, skicka och påminna om offerter.",
    varTiden: "till offerter och uppföljning",
    losning:
      "Offerter byggs från mallar på några minuter, och de som inte fått svar följs upp av sig själva tills kunden svarar ja eller nej.",
    forstaSteget:
      "Leta upp de fem senaste offerterna utan svar och följ upp dem i veckan.",
    affarsnytta:
      "Fler offerter ut, snabbare svar till kunden och en högre andel vunna affärer.",
    konsekvens:
      "Offerter som blir liggande betyder affärer som går till den som svarar först.",
    klartNar:
      "Klart när offerterna skrivs från mallar och följs upp utan att någon behöver komma ihåg det.",
    diagnos: "offerter som blir liggande utan uppföljning",
    uppgift: "Skriva offerter",
    fardig: true,
  },
  {
    id: "fakturor",
    namn: "Fakturor och betalningar",
    exempel: "Skapa fakturor, stämma av, påminna om obetalt.",
    varTiden: "till fakturor och betalningar",
    losning:
      "Avslutade jobb blir fakturor direkt i ert ekonomisystem, och påminnelser om obetalt går ut av sig själva.",
    forstaSteget:
      "Kolla hur många dagar det går från avslutat jobb till skickad faktura.",
    affarsnytta:
      "Pengarna kommer in snabbare och inget utfört arbete blir ofakturerat — ett kassaflöde att lita på.",
    konsekvens:
      "Fakturor som dröjer eller glöms binder pengar som företaget redan har tjänat.",
    klartNar:
      "Klart när varje avslutat jobb blir en faktura samma dag och påminnelserna sköter sig själva.",
    diagnos: "tiden från avslutat jobb till betald faktura",
    uppgift: "Jaga betalningar",
    fardig: false,
  },
  {
    id: "bokforing",
    namn: "Kvitton och bokföring",
    exempel: "Samla kvitton, sortera underlag, förbereda för redovisning.",
    varTiden: "till kvitton och bokföring",
    losning:
      "Kvitton och underlag fångas upp från mejl och mobil och hamnar rätt i bokföringen utan handpåläggning.",
    forstaSteget:
      "Samla en månads kvitton på ett ställe och ta tid på hur lång tid det tar.",
    affarsnytta:
      "Alltid aktuell ekonomi, färre fel och lägre kostnad för redovisningen.",
    konsekvens:
      "Underlag som samlas på hög gör ekonomin svår att följa och redovisningen dyrare.",
    klartNar:
      "Klart när kvitton och underlag hamnar rätt i bokföringen utan att någon sorterar dem.",
    diagnos: "kvitton och underlag som samlas på hög",
    uppgift: "Sortera kvitton",
    fardig: false,
  },
  {
    id: "schema",
    namn: "Schema och personal",
    exempel: "Lägga schema, byta pass, hålla koll på frånvaro.",
    varTiden: "till schema och personal",
    losning:
      "Schemat läggs utifrån bokningar och tillgänglighet, och byten och frånvaro hanteras på ett ställe i stället för i sms-trådar.",
    forstaSteget: "Skriv ner hur många gånger schemat ändras en vanlig vecka.",
    affarsnytta:
      "Rätt bemanning på rätt plats: mindre övertid och färre uppdrag som får vänta.",
    konsekvens:
      "Ett schema som pusslas för hand ger övertid, luckor och uppdrag som får vänta.",
    klartNar:
      "Klart när schemat föreslås av sig självt och byten sköts utan sms-trådar.",
    diagnos: "ett schema som pusslas ihop för hand",
    uppgift: "Lägga schemat",
    fardig: false,
  },
  {
    id: "nya-kunder",
    namn: "Hitta nya kunder",
    exempel: "Leta företag, ta fram kontaktpersoner, skriva första kontakten.",
    varTiden: "till att hitta nya kunder",
    losning:
      "Listan på rätt företag med rätt kontaktperson byggs åt er, i stället för att ni googlar fram den.",
    forstaSteget:
      "Ta tid på hur lång tid ett enda företag tar att researcha ordentligt.",
    affarsnytta:
      "En jämn ström av nya affärer, även när leveransen tar all tid.",
    konsekvens:
      "När säljet bara sker när det finns tid över blir tillväxten ryckig.",
    klartNar:
      "Klart när en lista på rätt företag kommer varje vecka utan att någon letar.",
    diagnos: "att nya kunder bara letas fram när det finns tid över",
    uppgift: "Leta nya kunder",
    fardig: true,
    caseIds: ["observa", "jatack"],
  },
  {
    id: "marknad",
    namn: "Marknadsföring och sociala medier",
    exempel: "Skriva inlägg och nyhetsbrev, svara på kommentarer.",
    varTiden: "till marknadsföring och sociala medier",
    losning:
      "Inlägg och nyhetsbrev tas fram utifrån det ni faktiskt gör — färdiga jobb, bilder, säsong — och schemaläggs åt er.",
    forstaSteget:
      "Lista tre saker ni gjort den senaste månaden som kunderna borde få se.",
    affarsnytta:
      "Synlighet som drar in förfrågningar — utan att det äter tid från leveransen.",
    konsekvens:
      "Utan jämn synlighet tystnar förfrågningarna just när ni har som mest att göra.",
    klartNar:
      "Klart när inlägg och utskick tas fram av sig själva och bara behöver godkännas.",
    diagnos: "att för få hittar er när ni inte syns",
    uppgift: "Skriva inlägg",
    fardig: false,
  },
  {
    id: "aterkommande",
    namn: "Omdömen och återkommande kunder",
    exempel: "Be om omdömen, höra av sig till gamla kunder, påminna om service.",
    varTiden: "till omdömen och återkommande kunder",
    losning:
      "Efter varje jobb går en fråga om omdöme ut vid rätt tidpunkt, och kunder som inte hört av sig på ett tag får en påminnelse och bokar igen.",
    forstaSteget:
      "Ta fram listan på kunder ni inte sett på sex månader. Den är ofta längre än man tror.",
    affarsnytta:
      "Fler återkommande kunder och starkare omdömen: den billigaste tillväxt som finns.",
    konsekvens:
      "Kunder som inte påminns går tyst vidare — och de är de billigaste att behålla.",
    klartNar:
      "Klart när omdömen och påminnelser går ut av sig själva efter varje jobb.",
    diagnos: "kunder som inte kommer tillbaka av sig själva",
    uppgift: "Be om omdömen",
    fardig: true,
    caseIds: ["osteopaticentrum"],
  },
  {
    id: "rapporter",
    namn: "Rapporter och sammanställningar",
    exempel: "Ta fram siffror, sammanställa veckorapporter, uppdatera Excel.",
    varTiden: "till rapporter och sammanställningar",
    losning:
      "Siffrorna hämtas automatiskt från era system och landar i en rapport eller översikt som alltid är uppdaterad.",
    forstaSteget:
      "Välj den rapport ni tar fram oftast och skriv ner var siffrorna kommer ifrån.",
    affarsnytta:
      "Beslut på aktuella siffror i stället för magkänsla, och avvikelser som upptäcks i tid.",
    konsekvens:
      "När siffrorna tas fram för hand fattas besluten på gammal information.",
    klartNar:
      "Klart när siffrorna finns uppdaterade utan att någon bygger rapporten för hand.",
    diagnos: "rapporter som sammanställs för hand",
    uppgift: "Sammanställa rapporter",
    fardig: false,
  },
  {
    id: "dubbelregistrering",
    namn: "Samma sak i flera system",
    exempel: "Skriva in kunder, ordrar eller tider på mer än ett ställe.",
    varTiden: "till att skriva in samma sak på flera ställen",
    losning:
      "Systemen kopplas ihop så att en uppgift skrivs in en gång och syns överallt där den behövs.",
    forstaSteget:
      "Rita upp vart en ny kund tar vägen, från första kontakt till betald faktura.",
    affarsnytta:
      "Färre fel, snabbare flöden och ett företag som kan växa utan att administrationen växer i samma takt.",
    konsekvens:
      "Information som flyttas för hand mellan system ger fel, gör uppföljningen långsammare och verksamheten beroende av manuella rutiner.",
    klartNar:
      "Klart när en uppgift skrivs in på ett ställe och finns överallt där den behövs.",
    diagnos: "samma uppgifter som skrivs in i flera system",
    uppgift: "Skriva in samma sak två gånger",
    fardig: false,
  },
  {
    id: "dokument",
    namn: "Avtal och dokument",
    exempel: "Skriva avtal, fylla i blanketter, samla underskrifter.",
    varTiden: "till avtal och dokument",
    losning:
      "Avtal och dokument fylls i från mallar med rätt uppgifter, skickas för digital signering och sparas på rätt ställe.",
    forstaSteget:
      "Räkna hur många dokument ni fyller i för hand under en månad.",
    affarsnytta:
      "Snabbare avslut och mindre risk för fel i avtal och villkor.",
    konsekvens:
      "Avtal som fylls i för hand tar tid att få klara och riskerar fel i villkoren.",
    klartNar:
      "Klart när avtalen fylls i och skickas för signering utan handpåläggning.",
    diagnos: "avtal och dokument som tar tid att ta fram och få påskrivna",
    uppgift: "Fylla i avtal",
    fardig: false,
  },
  {
    id: "koll",
    namn: "Hålla koll på vem som gör vad",
    exempel: "Fördela jobb, följa upp, svara på ”hur går det med …”.",
    varTiden: "till att hålla koll på vem som gör vad",
    losning:
      "Jobb, ärenden och status samlas på ett ställe, med automatiska aviseringar när något ändras eller blir liggande.",
    forstaSteget:
      "Skriv ner alla ställen där ni i dag håller koll på pågående jobb.",
    affarsnytta:
      "Mindre beroende av enskilda personer, färre missar och nöjdare kunder.",
    konsekvens:
      "När ingen ser helheten hänger allt på att rätt person minns rätt sak.",
    klartNar:
      "Klart när alla ser status på varje jobb utan att behöva fråga.",
    diagnos: "att det är svårt att se vem som gör vad",
    uppgift: "Hålla koll på alla jobb",
    fardig: false,
  },
  {
    id: "rut",
    namn: "RUT/ROT-underlag",
    exempel: "Sammanställa underlag, ansöka hos Skatteverket, stämma av.",
    varTiden: "till RUT/ROT-underlag",
    losning:
      "Underlaget sammanställs och skickas till Skatteverket utan att någon sitter med det manuellt.",
    forstaSteget:
      "Tidsätt en månads RUT/ROT-hantering. Det är nästan alltid mer än man gissar.",
    affarsnytta:
      "Pengarna från Skatteverket kommer in snabbare, utan avslag som äter marginalen.",
    konsekvens:
      "RUT/ROT som hanteras för hand binder pengar och riskerar avslag.",
    klartNar:
      "Klart när RUT/ROT-underlaget skickas utan att någon sitter med det.",
    diagnos: "RUT/ROT-underlag som tas fram för hand",
    uppgift: "RUT/ROT-ansökningar",
    fardig: false,
    branscher: [BRANSCH.stad, BRANSCH.hantverk],
  },
];

/**
 * Längsta fritextsvaret. Räcker gott för en uppgift, och håller det som når
 * AI:n kort. Kontrolleras både i fältet och på servern.
 */
export const MAX_FRITEXT = 300;

/**
 * Branscher där "missat samtal = förlorad ny kund" inte håller: den som ringer
 * ett fastighetsbolag är oftast en hyresgäst, och en butiks affärer går
 * sällan via telefon. Här frågar vi inte om kundvärde och räknar inga pengar.
 */
export const INGA_PENGAR_FOR: readonly Bransch[] = [BRANSCH.fastighet, BRANSCH.butik];

/**
 * Ord som pekar på ett område i fritexten — reserven när AI:n inte svarar.
 * "Jaga fakturor" ger fakturaflödet, "lägga schemat" schemaflödet. Ordstammar
 * i gemener; en träff räcker, flest träffar vinner.
 */
export const NYCKELORD: Readonly<Record<string, readonly string[]>> = {
  samtal: ["samtal", "ringa", "ringer", "telefon", "svara", "mejl", "mail", "inkorg", "förfråg"],
  bokning: ["boka", "bokning", "ombok", "avbok", "tider", "påminn", "kalender"],
  offerter: ["offert", "anbud", "kalkyl", "prisförslag"],
  fakturor: ["faktur", "betaln", "obetal", "inkasso", "påminnelseavgift"],
  bokforing: ["kvitto", "kvitton", "bokför", "moms", "redovis", "bokslut", "konter"],
  schema: ["schema", "pass", "bemann", "personal", "semester", "frånvaro"],
  "nya-kunder": ["nya kunder", "prospekt", "lead", "sälj", "kalla samtal", "ringlist"],
  marknad: ["inlägg", "instagram", "facebook", "linkedin", "nyhetsbrev", "marknadsför", "annons"],
  aterkommande: ["omdöme", "recension", "återkommande", "gamla kunder", "lojal"],
  rapporter: ["rapport", "statistik", "siffror", "sammanställ", "nyckeltal", "uppföljning"],
  dubbelregistrering: ["dubbel", "flera system", "skriva in", "föra över", "kopiera", "manuellt in"],
  dokument: ["avtal", "kontrakt", "dokument", "blankett", "signer", "underskrift"],
  koll: ["koll", "status", "planering", "planera", "fördela", "arbetsorder"],
  rut: ["rut", "rot", "skatteverket"],
};

/**
 * Hur länge data sparas. Rensas automatiskt av cron-jobbet.
 * Leads (rader med mejl) rensas inte här — de följer Khytes kundregister.
 * Kontrollera mot integritetspolicyn på khyte.se innan lansering.
 */
export const LAGRING = {
  /** Påbörjade eller avbrutna svar utan mejl. */
  avbrutnaDagar: 90,
  /** Mätningshändelser (var i flödet folk hoppar av). */
  handelserDagar: 90,
  /** Spamskyddets räkning per IP (hashad). Behövs bara en timme. */
  spamskyddDagar: 2,
} as const;

/** Snabbval på fritextfrågan: så många visas. */
export const ANTAL_SNABBVAL = 5;

/** Hur många områden man får välja. Fler blir för många följdfrågor. */
// Upp till tre — den som bara har en eller två väljer färre.
export const MAX_TIDSTJUVAR = 3;

// ── Beräkningar ─────────────────────────────────────────────────────────────

// ── Storlek ─────────────────────────────────────────────────────────────────
// Ett företag med 25 anställda ska inte få samma förslag som en enmansfirma.
// Nivån styr tidsvalen, vilka områden som väger tyngst, hur tiden uttrycks
// och hur stora flöden vi föreslår.

export type Niva = "liten" | "mellan" | "stor";

export const NIVA_FOR_ANTAL: Readonly<Record<string, Niva>> = {
  "Bara jag": "liten",
  "2–5": "liten",
  "6–20": "mellan",
  "21–50": "stor",
  "Fler än 50": "stor",
};

/**
 * Tid per vecka för ett område, som besökaren själv angett. Timmar.
 * Två skalor: små företag mäter i timmar, större i arbetsdagar och tjänster —
 * "Mer än 10 h" räcker inte när fakturahanteringen är en halv heltid.
 */
export const TIDSSKALA: Readonly<
  Record<"liten" | "storre", Readonly<Record<string, { min: number; max: number }>>>
> = {
  liten: {
    "Under 1 h": { min: 0.5, max: 1 },
    "1–3 h": { min: 1, max: 3 },
    "3–6 h": { min: 3, max: 6 },
    "6–10 h": { min: 6, max: 10 },
    // KALIBRERA: taket för "mer än 10". Hellre för lågt än för högt.
    "Mer än 10 h": { min: 10, max: 15 },
  },
  storre: {
    "Under 3 h": { min: 1, max: 3 },
    "3–10 h": { min: 3, max: 10 },
    "10–25 h": { min: 10, max: 25 },
    "25–40 h": { min: 25, max: 40 },
    // KALIBRERA: taket för "mer än en heltid".
    "Mer än en heltid": { min: 40, max: 60 },
  },
};

export const tidsskalaFor = (niva: Niva) =>
  niva === "liten" ? TIDSSKALA.liten : TIDSSKALA.storre;

/** Alla tidsval oavsett skala — för att slå upp ett sparat svar. */
export const TID_PER_VECKA: Readonly<Record<string, { min: number; max: number }>> = {
  ...TIDSSKALA.liten,
  ...TIDSSKALA.storre,
};

/** En heltidstjänst i timmar per vecka — för att uttrycka tid som tjänster. */
export const HELTID_TIMMAR = 40;

/**
 * Hur tungt ett område väger i rangordningen, per nivå. Ett större företag
 * vinner mest på det som binder ihop verksamheten — flöden mellan system,
 * fakturering, överblick — inte på omdömen och inlägg.
 * Saknas ett område väger det 1.
 */
export const VIKT_PER_NIVA: Readonly<Record<Niva, Readonly<Record<string, number>>>> = {
  liten: {},
  mellan: {
    dubbelregistrering: 1.3,
    fakturor: 1.2,
    koll: 1.25,
    rapporter: 1.15,
    offerter: 1.15,
    schema: 1.15,
    marknad: 0.8,
    aterkommande: 0.85,
  },
  stor: {
    dubbelregistrering: 1.5,
    koll: 1.45,
    fakturor: 1.35,
    rapporter: 1.35,
    offerter: 1.25,
    dokument: 1.25,
    schema: 1.25,
    bokforing: 1.15,
    samtal: 1.1,
    marknad: 0.6,
    aterkommande: 0.6,
  },
};

/**
 * Hur stor andel av tiden som brukar gå att automatisera, efter hur det görs
 * i dag. Det som redan är automatiserat har minst kvar att hämta.
 */
export const ANDEL_SPARBAR: Readonly<Record<string, { min: number; max: number }>> = {
  // KALIBRERA: alla tre. Försiktiga uppskattningar tills vi har egen data.
  "För hand": { min: 0.4, max: 0.7 },
  "Delvis i ett system": { min: 0.25, max: 0.5 },
  "Mest automatiserat": { min: 0.05, max: 0.15 },
};

/** Missade samtal per vecka. Ett tal mitt i spannet, för kronberäkningen. */
export const MISSADE_SAMTAL_PER_VECKA: Readonly<Record<string, number>> = {
  Inga: 0,
  "1–5": 3,
  "6–15": 10,
  "16–30": 22,
  // KALIBRERA: "fler än 30" räknas lågt.
  "Fler än 30": 35,
};

/** Från och med dessa svar föreslår vi samtalsområdet även om det inte valts. */
export const MANGA_MISSADE_SAMTAL = ["6–15", "16–30", "Fler än 30"] as const;
export const LANGSAM_SVARSTID = ["Nästa dag", "Det varierar"] as const;

/** Minuter det tar att ringa tillbaka och reda ut ett missat samtal. */
// KALIBRERA
export const MINUTER_PER_MISSAT_SAMTAL = { min: 3, max: 8 } as const;

/**
 * Vad en ny kund är värd under första året. Ett värde i spannet — medvetet
 * i underkant. "Vet inte" ger ingen kronberäkning alls.
 */
export const KUNDVARDE_KR: Readonly<Record<string, number | null>> = {
  // KALIBRERA: alla.
  "Mindre än 1 000 kr": 500,
  "1 000–5 000 kr": 2500,
  "5 000–20 000 kr": 10000,
  "20 000–100 000 kr": 40000,
  "Över 100 000 kr": 120000,
  "Vet inte": null,
};

/** Andel missade samtal som hade blivit en ny affär. */
// KALIBRERA: försiktigt — många missade samtal är befintliga kunder.
export const ANDEL_MISSADE_SOM_AFFAR = { min: 0.05, max: 0.1 } as const;

export const VECKOR_PER_MANAD = 4.3;

/**
 * Under så här många sparade timmar i veckan (spannets övre gräns) är tiden
 * liten. Då flyttas tidsrutorna ner under förslagen, under rubriken
 * "Administrativ potential" — affärsnyttan först, timmarna sist. Vilket
 * förslag som leder styrs av målet (MAL), inte av tiden.
 */
// KALIBRERA
export const LITEN_TID_UNDER: Readonly<Record<Niva, number>> = {
  liten: 4,
  mellan: 8,
  stor: 15,
};

/**
 * Under så här många sparade timmar i veckan visas rutorna per månad i
 * stället. "1–3 h i veckan" säger lite; "4–13 h i månaden" går att relatera
 * till. Aldrig per år — det ser uppblåst ut.
 */
export const VISA_PER_MANAD_UNDER = 5;

// ── Mål ─────────────────────────────────────────────────────────────────────

/**
 * Svaren på "Vad är viktigast för er just nu?". Målet bestämmer resultatets
 * rubrik och vilket förslag som leder — så att förslaget svarar på det de
 * bryr sig om, inte bara på var kalkylen blev störst.
 */
export const MAL = {
  forfragningar: "Få fler förfrågningar",
  svara: "Svara kunderna snabbare",
  betalt: "Få betalt snabbare",
  admin: "Minska administrationen",
} as const;

export type Mal = keyof typeof MAL;

/**
 * Områden som svarar mot varje mål. Det första förslaget som bygger på något
 * av dem leder resultatet. "Minska administrationen" ändrar inget — där
 * leder det som sparar mest tid, som förut.
 */
export const MAL_OMRADEN: Readonly<Record<Mal, readonly string[]>> = {
  forfragningar: ["nya-kunder", "marknad", "aterkommande", "samtal"],
  svara: ["samtal", "bokning"],
  betalt: ["fakturor"],
  admin: [],
};

/** Ett svar på följdfrågan efter målet: var det bromsar. */
export type Flaskhals = {
  /** Alternativet, som det står på knappen. */
  svar: string;
  /**
   * Områden som löser flaskhalsen, i ordning. Ett förslag ur svaren som
   * bygger på något av dem leder; annars skapas ett för det första.
   */
  omraden: readonly string[];
  /**
   * Tillväxtidé (id i TILLVAXT) som leder när inget förslag ur svaren
   * passar. Per storlek: "storre" gäller från 6 anställda.
   */
  ide?: { liten?: string; storre?: string };
};

/**
 * Följdfrågan efter målet — den hittar den verkliga flaskhalsen, så att det
 * första förslaget blir en diagnos i stället för en gissning. "Minska
 * administrationen" har ingen: där räcker valet av tidstjuvar.
 */
export const FLASKHALS: Readonly<
  Record<
    Exclude<Mal, "admin">,
    {
      fraga: string;
      /** "Ni svarade att ni tappar mest fart här: ”…”." */
      varfor: (du: boolean, svar: string) => string;
      alternativ: readonly Flaskhals[];
    }
  >
> = {
  forfragningar: {
    fraga: "Var tappar ni mest fart på vägen till en ny kund?",
    varfor: (du, svar) =>
      `${du ? "Du" : "Ni"} svarade att ${du ? "du" : "ni"} tappar mest fart här: ”${svar}”.`,
    alternativ: [
      { svar: "För få rätt personer hittar er", omraden: ["marknad", "nya-kunder"], ide: { storre: "prospektering" } },
      // Först här blir hemsidan en fråga — och den avgörs i samtalet.
      { svar: "Besökare hör inte av sig", omraden: [], ide: { liten: "fanga-forfragningar", storre: "fanga-forfragningar" } },
      { svar: "Förfrågningar eller offerter följs inte upp", omraden: ["offerter", "samtal"] },
      { svar: "Tidigare kunder kommer inte tillbaka", omraden: ["aterkommande"], ide: { storre: "kundbasen" } },
    ],
  },
  svara: {
    fraga: "Vilka förfrågningar riskerar att bli liggande?",
    varfor: (du, svar) =>
      `${du ? "Du" : "Ni"} svarade att det här riskerar att bli liggande: ”${svar}”.`,
    alternativ: [
      { svar: "Samtal", omraden: ["samtal"] },
      { svar: "Mejl och formulär", omraden: ["samtal"] },
      { svar: "Bokning och ombokning", omraden: ["bokning"] },
      { svar: "Annat", omraden: ["samtal", "bokning"] },
    ],
  },
  betalt: {
    fraga: "Var fastnar det oftast från avslutat jobb till betalning?",
    varfor: (du, svar) =>
      `${du ? "Du" : "Ni"} svarade att det oftast fastnar här: ”${svar}”.`,
    alternativ: [
      { svar: "Underlaget saknas", omraden: ["fakturor"] },
      { svar: "Fakturan skapas sent", omraden: ["fakturor"] },
      { svar: "Godkännande", omraden: ["fakturor"] },
      { svar: "Påminnelser och uppföljning", omraden: ["fakturor"] },
    ],
  },
};

// Frågas på tacksidan, efter mejlet. De hjälper säljaren — inte svaret — så
// de hör inte hemma före resultatet.
export const ROLLER = ["Ägare eller VD", "Chef eller ansvarig", "Medarbetare"] as const;
export const TIDSHORISONTER = [
  "Så snart som möjligt",
  "Inom tre månader",
  "Senare i år",
  "Är bara nyfiken",
] as const;

// ── Frågor ──────────────────────────────────────────────────────────────────
// Ordningen här är flödets ordning. Följdfrågorna per område läggs in efter
// FRAGA.tidstjuvar av src/lib/flode.ts.

export const FRAGOR: readonly Fraga[] = [
  {
    id: FRAGA.bransch,
    typ: "enval",
    fraga: "Vilken typ av verksamhet har ni?",
    alternativ: Object.values(BRANSCH),
    rutnat: true,
  },
  {
    id: FRAGA.omEr,
    typ: "grupp",
    fraga: "Berätta lite om er",
    delar: [
      {
        id: FRAGA.antal,
        fraga: "Hur många är ni?",
        alternativ: ["Bara jag", "2–5", "6–20", "21–50", "Fler än 50"],
        reaktioner: {
          "Bara jag":
            "Då är det du som svarar, bokar och fakturerar. Varje timme du får tillbaka märks direkt.",
        },
      },
      {
        id: FRAGA.mal,
        fraga: "Vad är viktigast just nu?",
        alternativ: [MAL.forfragningar, MAL.svara, MAL.betalt, MAL.admin],
      },
    ],
  },
  {
    id: FRAGA.kunder,
    typ: "grupp",
    fraga: "Era kunder",
    delar: [
      {
        id: FRAGA.missadeSamtal,
        fraga: "Hur många samtal missar ni en vanlig vecka?",
        alternativ: ["Inga", "1–5", "6–15", "16–30", "Fler än 30"],
        reaktioner: {
          Inga: "Bra. Då lägger vi krutet på annat.",
          "16–30": "Den som inte får svar ringer ofta nästa firma på listan.",
          "Fler än 30":
            "Det blir många samtal i veckan som aldrig blir en bokning. Här finns ofta mest att hämta.",
        },
      },
      {
        id: FRAGA.svarstid,
        fraga: "Hur snabbt får en förfrågan på mejl eller formulär svar?",
        alternativ: ["Inom en timme", "Samma dag", "Nästa dag", "Det varierar"],
        reaktioner: {
          "Inom en timme": "Snabbt. Det är precis det kunder märker.",
          "Det varierar":
            "Ärligt svar. Det är ofta det enklaste hålet att täppa till.",
        },
      },
      {
        id: FRAGA.kundvarde,
        fraga: "Vad är en ny kund värd för er?",
        hjalptext: "Ungefär vad en ny kund köper för under första året.",
        alternativ: Object.keys(KUNDVARDE_KR),
      },
    ],
  },
  {
    id: FRAGA.tidstjuvar,
    typ: "flerval",
    fraga: "Vad tar mest tid hos er i dag?",
    hjalptext: `Välj upp till ${MAX_TIDSTJUVAR}.`,
    // Fylls i av flödet — RUT/ROT visas bara för vissa branscher.
    alternativ: [],
    max: MAX_TIDSTJUVAR,
    rutnat: true,
  },
  // Följdfrågorna per valt område läggs in här av flödet.
  {
    id: FRAGA.slutet,
    typ: "grupp",
    fraga: "Hur jobbar ni i dag?",
    delar: [
      {
        id: FRAGA.verktyg,
        flerval: true,
        fraga: "Vilka verktyg använder ni?",
        hjalptext: "Välj alla som stämmer. Då vet vi vad som går att koppla ihop.",
        alternativ: [
      "Fortnox",
      "Visma",
      "Google (Gmail, Kalender)",
      "Microsoft 365 (Outlook)",
      "Bokningssystem",
      "Branschsystem",
      "CRM",
      "Excel eller papper",
          "Annat",
          "Vet inte",
        ],
      },
    ],
  },
  {
    id: FRAGA.fritext,
    typ: "fritext",
    fraga: "Om du kunde slippa en uppgift för alltid, vilken skulle det vara?",
    hjalptext:
      "Tryck på ett förslag eller skriv med egna ord. Skriv inga namn eller personuppgifter.",
    platshallare: "… eller skriv med egna ord",
    valfri: true,
  },
];

/** Följdfrågornas två delar. Tidsvalen beror på storlek, se TIDSSKALA. */
export const OMRADESFRAGOR = {
  // Rubriken är områdets namn — överrubriken säger vad som ska göras.
  overrubrik: (nu: number, av: number) => `Tidstjuv ${nu} av ${av} · två snabba frågor`,
  tid: {
    fraga: "Hur mycket tid går till det här i veckan, sammanlagt?",
    reaktioner: {
      "6–10 h": "Det är mer än en arbetsdag i veckan.",
      "Mer än 10 h":
        "Det är över en arbetsdag i veckan, varje vecka. Där brukar det finnas mycket att hämta.",
      "10–25 h": "Det är upp till tre arbetsdagar i veckan — ofta utspritt på flera personer.",
      "25–40 h": "Det är nästan en heltidstjänst som går åt till det här.",
      "Mer än en heltid":
        "Mer än en heltidstjänst. Här handlar det inte om minuter utan om hur verksamheten är byggd.",
    } as Readonly<Record<string, string>>,
  },
  idag: {
    fraga: "Hur sköts det i dag?",
    alternativ: Object.keys(ANDEL_SPARBAR),
  },
} as const;

// ── Case ────────────────────────────────────────────────────────────────────
// Citaten är hämtade ordagrant från khyte.se. Ändra dem inte utan att stämma
// av mot sajten — det är riktiga personer som sagt dem.

export type Case = {
  id: string;
  foretag: string;
  citat?: string;
  namn?: string;
  roll?: string;
  /** Används när caset är ett mätbart resultat i stället för ett citat. */
  resultat?: string;
  lank: string;
};

export const CASE: Readonly<Record<string, Case>> = {
  osteopaticentrum: {
    id: "osteopaticentrum",
    foretag: "Osteopaticentrum",
    citat:
      "Khyte har lyssnat på min verksamhets behov och skräddarsytt lösningen för att matcha dem. Jag är mycket nöjd med det professionella bemötande och utförandet!",
    namn: "Mattias Hietala",
    roll: "grundare",
    lank: "https://khyte.se/case/osteopaticentrum",
  },
  jatack: {
    id: "jatack",
    foretag: "JaTack AB",
    citat:
      "Hai har hjälpt mig att automatisera en del av min prospekteringsprocess genom att lyssna till mina behov. Nu kan jag jobba snabbare och effektivare, vilket skapar fler affärer!",
    namn: "Sebastian Andersson",
    roll: "grundare",
    lank: "https://khyte.se/case/lead-engine",
  },
  observa: {
    id: "observa",
    foretag: "Observa Inkasso & Juridik",
    resultat:
      "Researchtid per företag gick från 4 minuter till cirka 10 sekunder.",
    lank: "https://khyte.se/case",
  },
};

// ── Texter i flödet ─────────────────────────────────────────────────────────

export const TEXT = {
  start: {
    rubrik: "VAR TAPPAR DU MEST TID?",
    underrubrik:
      "Svara på några snabba frågor så visar vi var tiden går — och tre konkreta sätt att få tillbaka den.",
    knapp: "Kör igång",
    // Syns under knappen. Svaren sparas redan under flödet — det ska stå här,
    // inte först vid mejlfältet.
    integritet:
      "Dina svar sparas medan du svarar, utan namn eller kontaktuppgifter, så att vi kan ta fram ditt resultat och förbättra kompassen.",
    integritetLank: "Så hanterar vi uppgifterna",
    fakta: ["Ett par minuter", "Mest snabba tryck", "Resultatet direkt"],
  },
  navigering: {
    tillbaka: "Tillbaka",
    nasta: "Nästa",
    hoppaOver: "Hoppa över",
    seResultat: "Se resultatet",
    steg: (nu: number, av: number) => `Steg ${nu} av ${av}`,
    valda: (antal: number, max: number) => `${antal} av ${max} valda`,
    snabbval: "Förslag att välja",
  },
  resultat: {
    rubrik: "HÄR GÅR ER TID.",
    lagt: "Lägger ni i dag",
    lagtFot: "på det du valde, i veckan",
    besparing: "Går troligen att spara",
    besparingFot: "i veckan",
    // Rutorna per månad, när veckotiden är liten (VISA_PER_MANAD_UNDER).
    perManad: {
      lagtFot: "på det du valde, i månaden",
      besparingFot: (perVecka: string) => `i månaden — ${perVecka} i veckan`,
    },
    karta: {
      rubrik: "Så fördelar sig tiden",
      spara: "Går troligen att spara",
      rest: "Resten av tiden",
      idag: "I dag",
      /** Efter tiden i dag på samma rad: "3–10 h · spara 1–5 h". */
      sparaKort: "spara",
    },
    saRaknadeVi: "Så räknade vi",
    saRaknadeViFot:
      "En första uppskattning byggd på dina svar — inte ett löfte. Vi validerar den i ett kort förprojekt, mot hur det faktiskt ser ut hos er.",
    definition: {
      // Förklarar "motsvarar ungefär en halv heltidstjänst" i rutan ovanför.
      heltid: `Tid räknas om till tjänster med en arbetsvecka på ${HELTID_TIMMAR} timmar — ${HELTID_TIMMAR / 2} sparade timmar blir alltså en halv tjänst.`,
      kedja: "Ett förslag som binder ihop flera områden visar summan av de områdenas tid.",
      dubbel: "Varje område räknas bara en gång, även om det syns både i tidskartan och i ett förslag.",
      manad: `Tid per månad är veckotiden gånger ${String(VECKOR_PER_MANAD).replace(".", ",")} veckor.`,
    },
    forslagRubrik: "Tre saker vi skulle börja med",
    plan: {
      rubrik: "Så skulle vi lägga upp det",
      fas: (n: number) => `Fas ${n}`,
    },
    affarsnytta: "För företaget",
    byggerPa: "Bygger på dina svar:",
    sparar: (tid: string) => `Sparar ${tid}/vecka`,
    flerSteg: (antal: number) => `+ ${antal} steg till`,
    lasCase: "Läs caset",
    flode: "Så skulle det kunna se ut",
    forstaSteget: "Första steget",
    fardig: "Färdig lösning",
    skraddarsydd: "Byggs skräddarsytt för er",
    kalla: {
      signal: "Syns i dina svar",
      bransch: "Vanligt i er bransch",
      ide: "Ett steg längre",
    },
    onskemal: {
      laddar: "Vi tar fram ett förslag …",
      saknas: "Vi tar med det här i genomgången och visar hur det skulle kunna se ut.",
    },
    tillMejl: "Få hela resultatet på mejl ↓",
    vidare: "Vill du veta hur det här skulle se ut hos er?",
    vidareLank: "Lämna din mejl så hör vi av oss.",
    dela: "Dela med en kollega",
    delaKopierad: "Länken är kopierad",
    // Låst läge: bara det största området syns innan mejl lämnats.
    last: {
      etikett: "Ingår i hela resultatet på mejl",
    },
    // Rubriken efter deras mål. "Minska administrationen" får standardrubriken.
    malRubrik: {
      forfragningar: (du: boolean) => `SÅ FÅR ${du ? "DU" : "NI"} FLER FÖRFRÅGNINGAR.`,
      svara: (du: boolean) => `SÅ SVARAR ${du ? "DU" : "NI"} SNABBARE.`,
      betalt: (du: boolean) => `SÅ FÅR ${du ? "DU" : "NI"} BETALT SNABBARE.`,
    },
    // Vad det kostar affären, per mål. Inleder sammanfattningen när det
    // ledande förslaget saknar en egen konsekvens (t.ex. en tillväxtidé).
    malKonsekvens: {
      forfragningar:
        "Utan en jämn ström av förfrågningar blir tillväxten ryckig — och beroende av att någon hinner sälja.",
      svara:
        "Varje förfrågan som inte får svar direkt är en kund som kan hinna vända sig till någon annan.",
      betalt:
        "Fakturor som dröjer eller glöms binder pengar som företaget redan har tjänat.",
    },
    /** "Du sa att det viktigaste just nu är att få betalt snabbare." */
    malet: (du: boolean, mal: string) =>
      `${du ? "Du" : "Ni"} sa att det viktigaste just nu är att ${mal.charAt(0).toLowerCase()}${mal.slice(1)} — därför börjar vi där.`,
    // Tidsrutorna när tiden är liten (LITEN_TID_UNDER): längre ner, efter förslagen.
    potential: {
      rubrik: "Administrativ potential",
      brodtext: "Tid som går att frigöra i det du valde — en första uppskattning.",
    },
    // Visas för verksamheter med 1–50 anställda.
    digitaliseringscheck:
      "En stor del av kostnaden kan ofta finansieras via en regional digitaliseringscheck. Vi hjälper till med ansökan.",
  },
  kontakt: {
    rubrik: "FÅ HELA RESULTATET PÅ MEJL.",
    brodtext:
      "Få alla tre förslagen med hela flödet på mejl. Sedan hör vi av oss för en kort genomgång — inget säljsnack.",
    // När inget stort att hämta hittades.
    namn: "Namn",
    foretag: "Företag",
    telefon: "Telefon",
    mejl: "Din mejl",
    mejlPlatshallare: "namn@foretag.se",
    ort: "Ort",
    valfritt: "valfritt",
    minstEtt: "Fyll i din mejladress, så vi kan skicka resultatet.",
    tipsRubrik: "Känner du någon annan företagare som brottas med samma sak?",
    tipsNamn: "Namn",
    tipsKontakt: "Telefon eller mejl",
    gdpr: "Vi använder din mejl för att skicka resultatet och höra av oss om det — inga nyhetsbrev eller utskick om annat.",
    gdprLank: "Så hanterar vi dina uppgifter",
    skicka: "Skicka mitt resultat",
    skickar: "Skickar …",
  },
  analys: {
    rubrik: "Vi tar fram resultatet",
  },
  hypotes: {
    etikett: "Det vi ser hittills:",
  },
  // Frivilligt steg på tacksidan — efter att mejlen redan är lämnad.
  komplettera: {
    rubrik: "Hjälp oss förbereda samtalet",
    brodtext:
      "Frivilligt. Med namn och telefon kan vi ringa i stället för att mejla, och komma förberedda.",
    roll: "Din roll",
    tidshorisont: "När vill ni komma igång?",
    skicka: "Skicka",
    tack: "Tack! Det hjälper oss att komma förberedda.",
    fel: "Det gick inte att skicka just nu. Det gör inget — vi hör av oss på mejlen.",
    redanSkickat: "Det här är redan skickat. Tack!",
  },
  // Kontrollfrågan under det första förslaget.
  bekraftelse: {
    fraga: (du: boolean, diagnos: string) =>
      `Vi tror att ${du ? "din" : "er"} första flaskhals är ${diagnos}. Stämmer det?`,
    ja: "Ja, det stämmer",
    delvis: "Delvis",
    nej: "Nej, det är snarare …",
    platshallare: "Vad bromsar mest?",
    skicka: "Skicka",
    tack: "Tack — det hjälper oss att börja på rätt ställe.",
  },
  tack: {
    rubrik: "TACK!",
    brodtext: (mejl: string) =>
      `Hela resultatet är på väg till ${mejl}. Vi hör av oss inom ett dygn.`,
    ocksaHar: "Här är hela resultatet, upplåst:",
    direktkontakt: "Vill du höra av dig direkt går det bra på:",
  },
  fel: {
    kontaktMisslyckades:
      "Vi kunde inte skicka just nu. Försök igen, eller mejla oss direkt på " +
      SAJT.mejl +
      ".",
    forMangaForsok:
      "Det har kommit in många inskick härifrån just nu. Vänta en stund och försök igen.",
    obligatoriskt: "Välj ett alternativ för att gå vidare.",
    obligatorisktGrupp: "Svara på alla delar för att gå vidare.",
  },
} as const;
