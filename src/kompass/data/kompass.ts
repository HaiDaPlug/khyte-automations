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
//
// Kompassen har två delar. Först förstår den företaget — bransch, storlek,
// mål, vad som görs för hand — med frågor som alla kan svara på. Sedan väljer
// den frågor efter deras situation: ingen ska behöva svara på något som inte
// tydligt kan gälla dem, och ingen fråga ställs två gånger i olika ord.

export const FRAGA = {
  bransch: "bransch",
  antal: "antal",
  // Frågas på tacksidan, efter mejlet — se ROLLER.
  roll: "roll",
  mal: "mal",
  // Specialfrågorna — visas bara när svaren pekar dit, se SPAR.
  affarer: "affarer",
  kanaler: "kanaler",
  // Skärm: era samtal och förfrågningar (hör till spåret "kund")
  kunder: "kunder",
  missadeSamtal: "missade_samtal",
  svarstid: "svarstid",
  kundvarde: "kundvarde",
  systembrott: "systembrott",
  produktion: "produktion",
  // Vad som görs för hand, följt av en skärm per valt område
  tidstjuvar: "tidstjuvar",
  // Skärm: systemen och om samma sak matas in flera gånger
  slutet: "verktyg_start",
  verktyg: "verktyg",
  dubbelinmatning: "dubbelinmatning",
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
  konsekvens: (omradeId: string) => `omrade_${omradeId}_konsekvens`,
} as const;

// ── Branscher ───────────────────────────────────────────────────────────────
// Branschen ger språk och exempel — den bestämmer inte vilket problem
// företaget har. Det gör svaren.

export const BRANSCH = {
  tillverkning: "Tillverkning och produktion",
  fastighet: "Fastighet och förvaltning",
  hotell: "Hotell, restaurang och besöksnäring",
  handel: "Handel och e-handel",
  transport: "Transport och logistik",
  hantverk: "Bygg och hantverk",
  vard: "Vård och hälsa",
  skonhet: "Frisör och skönhet",
  byra: "Konsult, byrå och professionella tjänster",
  it: "IT och teknik",
  forbund: "Organisation och förbund",
  stad: "Städ, flytt och lokal service",
  bil: "Bil och verkstad",
  annat: "Annat",
} as const;

export type Bransch = (typeof BRANSCH)[keyof typeof BRANSCH];

/**
 * Branscher där kunderna själva bokar tider. Där betyder "planerar tider"
 * kundbokningar — annars schema och bemanning.
 */
export const KUNDBOKNING: readonly Bransch[] = [BRANSCH.vard, BRANSCH.skonhet, BRANSCH.bil];

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
      /** Liten rad ovanför rubriken, t.ex. "Del 1 av 3". */
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
    };

// ── Områden ─────────────────────────────────────────────────────────────────
// Allt vi kan hjälpa till med, inte bara det som redan är byggt. Besökaren
// väljer arbetsmönster ("Flyttar information mellan system"), och varje
// mönster pekar på ett område. Områden utan mönster nås via specialfrågorna,
// målet och AI-analysen.

export type Omrade = {
  id: string;
  /** Kort namn — visas som rubrik på följdfrågan och i resultatet. */
  namn: string;
  /**
   * Arbetsmönstret, som det står på frågan "Vad görs fortfarande för hand?".
   * Flera områden kan dela mönster — branschen avgör då vilket (KUNDBOKNING).
   * Saknas = området väljs inte direkt.
   */
  monster?: string;
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
  /** Uppgiften i vardagsord, för planen: "att slippa <uppgift>". */
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

/** Mönstret som delas av bokning och schema — branschen avgör vilket. */
const PLANERING = "Planerar och fördelar arbete, tider eller bemanning";

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
    monster: PLANERING,
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
    namn: "Offerter, order och underlag",
    monster: "Tar fram offerter, order eller underlag",
    exempel: "Räkna, skriva, skicka och följa upp offerter, order och underlag.",
    varTiden: "till offerter, order och underlag",
    losning:
      "Offerter och underlag byggs från mallar på några minuter, och de som inte fått svar följs upp av sig själva tills kunden svarar ja eller nej.",
    forstaSteget:
      "Leta upp de fem senaste offerterna utan svar och följ upp dem i veckan.",
    affarsnytta:
      "Fler offerter ut, snabbare svar till kunden och en högre andel vunna affärer.",
    konsekvens:
      "Offerter som blir liggande betyder affärer som går till den som svarar först.",
    klartNar:
      "Klart när offerterna skrivs från mallar och följs upp utan att någon behöver komma ihåg det.",
    diagnos: "offerter och underlag som tar tid att ta fram och blir liggande",
    uppgift: "Skriva offerter",
    fardig: true,
  },
  {
    id: "fakturor",
    namn: "Fakturor och betalningar",
    monster: "Fakturerar och jagar betalningar",
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
    namn: "Planering och bemanning",
    monster: PLANERING,
    exempel: "Fördela arbete, lägga schema, planera resurser, byta pass.",
    varTiden: "till planering och bemanning",
    losning:
      "Arbete och pass fördelas utifrån beläggning och tillgänglighet, och byten och frånvaro hanteras på ett ställe i stället för i sms-trådar.",
    forstaSteget: "Skriv ner hur många gånger planeringen ändras en vanlig vecka.",
    affarsnytta:
      "Rätt bemanning på rätt plats: mindre övertid och färre uppdrag som får vänta.",
    konsekvens:
      "En planering som pusslas för hand ger övertid, luckor och uppdrag som får vänta.",
    klartNar:
      "Klart när planeringen föreslås av sig själv och byten sköts utan sms-trådar.",
    diagnos: "en planering som pusslas ihop för hand",
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
    namn: "Rapporter och statuslistor",
    monster: "Uppdaterar Excel, rapporter eller status",
    exempel: "Ta fram siffror, sammanställa rapporter, uppdatera Excel och statuslistor.",
    varTiden: "till rapporter och statuslistor",
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
    diagnos: "rapporter och statuslistor som uppdateras för hand",
    uppgift: "Sammanställa rapporter",
    fardig: false,
  },
  {
    id: "dubbelregistrering",
    namn: "Information mellan system",
    monster: "Flyttar information mellan system",
    exempel: "Skriva in eller kopiera kunder, ordrar och uppgifter på mer än ett ställe.",
    varTiden: "till att flytta information mellan system",
    losning:
      "Systemen kopplas ihop så att en uppgift skrivs in en gång och syns överallt där den behövs.",
    forstaSteget:
      "Rita upp vart en ny kund eller order tar vägen, från första kontakt till betald faktura.",
    affarsnytta:
      "Färre fel, snabbare flöden och ett företag som kan växa utan att administrationen växer i samma takt.",
    konsekvens:
      "Information som flyttas för hand mellan system ger fel, gör uppföljningen långsammare och verksamheten beroende av manuella rutiner.",
    klartNar:
      "Klart när en uppgift skrivs in på ett ställe och finns överallt där den behövs.",
    diagnos: "information som flyttas för hand mellan system",
    uppgift: "Skriva in samma sak två gånger",
    fardig: false,
  },
  {
    id: "information",
    namn: "Sökande efter information",
    monster: "Letar efter information",
    exempel: "Leta i mejl, mappar, system och hos kollegor efter rätt uppgift eller version.",
    varTiden: "till att leta efter information",
    losning:
      "En AI-assistent söker i era dokument, mejl och system och ger svaret med källa — så att ingen behöver fråga runt.",
    forstaSteget:
      "Skriv ner de fem frågor ni oftast behöver leta svar på en vanlig vecka.",
    affarsnytta:
      "Snabbare beslut och mindre beroende av att rätt person är på plats.",
    konsekvens:
      "När information måste letas fram tar varje ärende längre tid, och kunskapen sitter hos enskilda personer.",
    klartNar:
      "Klart när rätt uppgift går att hitta på sekunder, utan att fråga en kollega.",
    diagnos: "information som måste letas fram för hand",
    uppgift: "Leta efter information",
    fardig: false,
  },
  {
    id: "arenden",
    namn: "Inkommande mejl och ärenden",
    monster: "Läser och sorterar mejl eller ärenden",
    exempel: "Läsa, sortera och skicka vidare mejl, beställningar och ärenden till rätt person.",
    varTiden: "till att läsa och sortera mejl och ärenden",
    losning:
      "AI läser inkommande mejl och ärenden, sorterar dem, skickar dem till rätt person och förbereder ett svar.",
    forstaSteget:
      "Räkna hur många mejl och ärenden som kommer in en vanlig dag, och hur många som bara ska skickas vidare.",
    affarsnytta:
      "Snabbare svar, färre ärenden som blir liggande och mer tid till det som kräver en människa.",
    konsekvens:
      "När varje ärende måste läsas och sorteras för hand blir svaren långsamma och saker blir liggande.",
    klartNar:
      "Klart när inkommande ärenden är sorterade och har ett svarsutkast innan någon öppnar dem.",
    diagnos: "inkommande mejl och ärenden som sorteras för hand",
    uppgift: "Sortera mejl och ärenden",
    fardig: false,
  },
  {
    id: "dokument",
    namn: "Dokument och avtal",
    monster: "Skriver eller sammanställer dokument",
    exempel: "Skriva avtal, fylla i blanketter, sammanställa dokument, samla underskrifter.",
    varTiden: "till dokument och avtal",
    losning:
      "Avtal och dokument fylls i från mallar med rätt uppgifter, skickas för digital signering och sparas på rätt ställe.",
    forstaSteget:
      "Räkna hur många dokument ni fyller i eller sammanställer för hand under en månad.",
    affarsnytta:
      "Snabbare avslut och mindre risk för fel i avtal och villkor.",
    konsekvens:
      "Dokument som skrivs för hand tar tid att få klara och riskerar fel i villkoren.",
    klartNar:
      "Klart när dokumenten fylls i och skickas för signering utan handpåläggning.",
    diagnos: "dokument som tar tid att ta fram och få påskrivna",
    uppgift: "Skriva dokument",
    fardig: false,
  },
  {
    id: "koll",
    namn: "Uppföljning av vem som gör vad",
    monster: "Följer upp att saker blir gjorda",
    exempel: "Följa upp, påminna, svara på ”hur går det med …”.",
    varTiden: "till att följa upp att saker blir gjorda",
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
    uppgift: "Följa upp alla jobb",
    fardig: false,
  },
  {
    id: "godkannande",
    namn: "Kontroller och godkännanden",
    monster: "Kontrollerar eller godkänner information",
    exempel: "Stämma av uppgifter, attestera, godkänna underlag och jaga den som ska godkänna.",
    varTiden: "till kontroller och godkännanden",
    losning:
      "Underlag kontrolleras automatiskt mot era regler, och det som behöver godkännas går till rätt person med påminnelser tills det är klart.",
    forstaSteget:
      "Välj ett underlag ni godkänner ofta och skriv ner vilka kontroller som görs innan det går vidare.",
    affarsnytta:
      "Färre fel, kortare ledtider och tydligt ansvar för varje beslut.",
    konsekvens:
      "Kontroller för hand är långsamma och missar fel, och godkännanden som väntar stoppar hela flödet.",
    klartNar:
      "Klart när underlag kontrolleras automatiskt och godkännanden inte längre blir liggande.",
    diagnos: "kontroller och godkännanden som bromsar flödet",
    uppgift: "Kontrollera och godkänna",
    fardig: false,
  },
  {
    id: "kontakter",
    namn: "Besked och utskick",
    monster: "Kontaktar kunder, leverantörer eller andra manuellt",
    exempel: "Skicka besked, påminnelser, statusuppdateringar och beställningar till kunder och leverantörer.",
    varTiden: "till att kontakta kunder, leverantörer och andra",
    losning:
      "Besked, påminnelser och beställningar går ut automatiskt när något händer, med rätt information till rätt mottagare.",
    forstaSteget:
      "Lista de meddelanden ni skickar oftast och vad det är som gör att de behöver skickas.",
    affarsnytta:
      "Kunder och leverantörer får besked i tid, utan att någon behöver komma ihåg det.",
    konsekvens:
      "När varje besked skickas för hand blir de sena eller glöms, och kunder och leverantörer får jaga er.",
    klartNar:
      "Klart när besked och påminnelser går ut av sig själva när något händer.",
    diagnos: "besked och påminnelser som skickas för hand",
    uppgift: "Skicka besked och påminnelser",
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

/** Sista alternativet på mönsterfrågan. Pekar inte på något område. */
export const ANNAT_MONSTER = "Något annat";

/**
 * Mönstren i den ordning de visas. Ett mönster per rad, även när två
 * områden delar det (PLANERING).
 */
export const MONSTER: readonly string[] = [
  "Flyttar information mellan system",
  "Letar efter information",
  "Läser och sorterar mejl eller ärenden",
  "Skriver eller sammanställer dokument",
  "Uppdaterar Excel, rapporter eller status",
  "Följer upp att saker blir gjorda",
  PLANERING,
  "Kontrollerar eller godkänner information",
  "Tar fram offerter, order eller underlag",
  "Fakturerar och jagar betalningar",
  "Kontaktar kunder, leverantörer eller andra manuellt",
  ANNAT_MONSTER,
];

/**
 * Längsta fritextsvaret. Räcker för att beskriva ett arbetsflöde från början
 * till slut, och håller det som når AI:n kort. Kontrolleras både i fältet och
 * på servern.
 */
export const MAX_FRITEXT = 500;

/**
 * Branscher där "missat samtal = förlorad ny kund" inte håller: den som ringer
 * ett fastighetsbolag är oftast en hyresgäst, och en tillverkares affärer går
 * sällan via ett missat samtal. Här frågar vi inte om kundvärde och räknar
 * inga pengar.
 */
export const INGA_PENGAR_FOR: readonly Bransch[] = [
  BRANSCH.fastighet,
  BRANSCH.handel,
  BRANSCH.tillverkning,
  BRANSCH.forbund,
];

/**
 * Ord som pekar på ett område i fritexten — reserven när AI:n inte svarar.
 * "Jaga fakturor" ger fakturaflödet, "lägga schemat" schemaflödet. Ordstammar
 * i gemener; en träff räcker, flest träffar vinner.
 */
export const NYCKELORD: Readonly<Record<string, readonly string[]>> = {
  samtal: ["samtal", "ringa", "ringer", "telefon", "förfråg"],
  bokning: ["boka", "bokning", "ombok", "avbok", "tider", "kalender"],
  offerter: ["offert", "anbud", "kalkyl", "prisförslag", "order"],
  fakturor: ["faktur", "betaln", "obetal", "inkasso", "påminnelseavgift"],
  bokforing: ["kvitto", "kvitton", "bokför", "moms", "redovis", "bokslut", "konter"],
  schema: ["schema", "pass", "bemann", "personal", "semester", "frånvaro", "planer", "fördela", "resurs"],
  "nya-kunder": ["nya kunder", "prospekt", "lead", "sälj", "kalla samtal", "ringlist"],
  marknad: ["inlägg", "instagram", "facebook", "linkedin", "nyhetsbrev", "marknadsför", "annons"],
  aterkommande: ["omdöme", "recension", "återkommande", "gamla kunder", "lojal"],
  rapporter: ["rapport", "statistik", "siffror", "sammanställ", "nyckeltal", "excel"],
  dubbelregistrering: ["dubbel", "flera system", "skriva in", "föra över", "kopiera", "manuellt in", "exporter", "importer", "mellan system"],
  information: ["leta", "hitta", "söka", "version", "var ligger", "fråga kollegor"],
  arenden: ["mejl", "mail", "inkorg", "ärende", "sortera", "skicka vidare"],
  dokument: ["avtal", "kontrakt", "dokument", "blankett", "signer", "underskrift"],
  koll: ["koll", "status", "följa upp", "uppföljning", "arbetsorder", "hur går det"],
  godkannande: ["godkänn", "attest", "kontroller", "granska", "stämma av"],
  kontakter: ["meddela", "besked", "leverantör", "beställ", "påminn", "skicka ut"],
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

/** Hur många mönster man får välja. Fler blir för många följdfrågor. */
// Upp till tre — den som bara har en eller två väljer färre.
export const MAX_TIDSTJUVAR = 3;

/** Högst så många specialspår visas — kompassen ska inte bli ett formulär. */
export const MAX_SPAR = 2;

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
    information: 1.15,
    godkannande: 1.15,
    arenden: 1.1,
    marknad: 0.8,
    aterkommande: 0.85,
  },
  stor: {
    dubbelregistrering: 1.5,
    koll: 1.45,
    fakturor: 1.35,
    rapporter: 1.35,
    information: 1.3,
    godkannande: 1.3,
    offerter: 1.25,
    dokument: 1.25,
    schema: 1.25,
    arenden: 1.2,
    bokforing: 1.15,
    samtal: 1.1,
    kontakter: 1.05,
    marknad: 0.6,
    aterkommande: 0.6,
  },
};

/**
 * Hur stor andel av tiden som brukar gå att automatisera, efter hur det görs
 * i dag. Det som redan är automatiserat har minst kvar att hämta.
 */
export const ANDEL_SPARBAR: Readonly<Record<string, { min: number; max: number }>> = {
  // KALIBRERA: alla fyra. Försiktiga uppskattningar tills vi har egen data.
  "För hand": { min: 0.4, max: 0.7 },
  "Delvis med systemstöd": { min: 0.25, max: 0.5 },
  "Till stor del automatiserat": { min: 0.05, max: 0.15 },
  // Försiktigt: vi vet inte, så vi räknar lågt.
  "Vet inte": { min: 0.2, max: 0.4 },
};

/** Svaret som ger extra tyngd åt ett område i rangordningen. */
export const FOR_HAND = "För hand";

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
 * Svaren på "Om ni kunde förbättra en del av verksamheten …". Målet bestämmer
 * resultatets rubrik och vilket förslag som leder — så att förslaget svarar på
 * det de bryr sig om, inte bara på var kalkylen blev störst. Fungerar för en
 * enmansfirma och en organisation med hundratals anställda.
 */
export const MAL = {
  effektivitet: "Få mer gjort med samma team",
  integration: "Få våra system och vår information att hänga ihop",
  ledtid: "Kortare väg från start till färdigt arbete",
  overblick: "Bättre koll på vad som händer i verksamheten",
  overlamningar: "Färre saker som faller mellan personer eller avdelningar",
  affarer: "Få in och vinna fler affärer",
  // Visas i branschens ord: "Ge era patienter bättre service". Se malFor.
  service: "Ge era kunder bättre service",
  admin: "Minska administrationen",
  vetinte: "Jag vet inte – hjälp mig hitta det",
} as const;

export type Mal = keyof typeof MAL;

/** Mål där tiden får avgöra vad som leder — inget särskilt område svarar mot dem. */
export const MAL_UTAN_RIKTNING: readonly Mal[] = ["effektivitet", "admin", "vetinte"];

/**
 * Områden som svarar mot varje mål. Det första förslaget som bygger på något
 * av dem leder resultatet. Tomt = det som sparar mest tid leder.
 */
export const MAL_OMRADEN: Readonly<Record<Mal, readonly string[]>> = {
  effektivitet: [],
  integration: ["dubbelregistrering", "information", "rapporter"],
  ledtid: ["koll", "godkannande", "offerter", "fakturor", "schema"],
  overblick: ["rapporter", "koll"],
  overlamningar: ["koll", "dubbelregistrering", "godkannande", "arenden"],
  affarer: ["nya-kunder", "offerter", "samtal", "aterkommande", "marknad"],
  service: ["samtal", "arenden", "bokning", "kontakter"],
  admin: [],
  vetinte: [],
};

/**
 * Målet som bisats, för "det viktigaste just nu är att …". Du-formen byter
 * "era" mot "dina".
 */
export const MAL_FRAS: Readonly<Record<Mal, (du: boolean) => string>> = {
  effektivitet: (du) => (du ? "få mer gjort på samma tid" : "få mer gjort med samma team"),
  integration: (du) =>
    du ? "få dina system och din information att hänga ihop" : "få era system och er information att hänga ihop",
  ledtid: () => "korta vägen från start till färdigt arbete",
  overblick: () => "få bättre koll på vad som händer i verksamheten",
  overlamningar: () => "färre saker ska falla mellan personer eller avdelningar",
  affarer: () => "få in och vinna fler affärer",
  service: (du) => (du ? "ge dina kunder bättre service" : "ge era kunder bättre service"),
  admin: () => "minska administrationen",
  vetinte: () => "hitta var det finns mest att vinna",
};

// ── Konsekvens ──────────────────────────────────────────────────────────────

/**
 * "Vad händer när det här inte fungerar?" — frågas för det första valda
 * området, det som oftast skaver mest. Ger AI:n och regelmotorn
 * affärskonsekvensen, inte bara timmarna. En gång räcker: samma fråga tre
 * gånger kändes som ett formulär.
 */
export const KONSEKVENS: Readonly<
  Record<
    string,
    {
      /** Fortsättning på "När det inte fungerar …". Null = nämns inte. */
      text: string | null;
      /** Påslag i rangordningen (se grundstyrka i src/lib/analys.ts). */
      vikt: number;
    }
  >
> = {
  "Arbetet tar längre tid": { text: "tar arbetet längre tid", vikt: 0 },
  "Kunder eller affärer påverkas": { text: "påverkas kunder och affärer", vikt: 2 },
  "Vi behöver fler personer": { text: "behövs fler personer", vikt: 1.5 },
  "Fel uppstår": { text: "uppstår fel", vikt: 1 },
  "Ingen har riktigt överblick": { text: "har ingen riktigt överblick", vikt: 1 },
  "Saker blir liggande mellan personer": { text: "blir saker liggande mellan personer", vikt: 1 },
  "Det skapar risk eller kvalitetsproblem": { text: "skapar det risk och kvalitetsproblem", vikt: 1.5 },
  "Inte så mycket – mest irritation": { text: null, vikt: -1 },
};

// ── Specialspår ─────────────────────────────────────────────────────────────
// Frågor som bara visas när svaren pekar dit. En tillverkare får aldrig frågan
// om missade samtal; en flyttfirma som vill ha fler affärer och tar in
// förfrågningar via telefon får den. Högst MAX_SPAR spår per besök. Vilka spår
// som visas avgörs i src/lib/flode.ts (aktivaSpar).
//
// Varje spår gräver djupare i något de redan sagt — inget spår frågar om
// samma sak som mönsterfrågan i andra ord.

/** Ett svar på en specialfråga: var det bromsar. */
export type Signal = {
  /** Alternativet, som det står på knappen. */
  svar: string;
  /**
   * Områden som löser det, i ordning. Ett förslag ur svaren som bygger på
   * något av dem leder; annars skapas ett för det första.
   */
  omraden: readonly string[];
  /**
   * Tillväxtidé (id i TILLVAXT) som leder när inget förslag ur svaren
   * passar. Per storlek: "storre" gäller från 6 anställda.
   */
  ide?: { liten?: string; storre?: string };
};

export type Specialfraga = {
  id: string;
  fraga: string;
  hjalptext?: string;
  alternativ: readonly Signal[];
  /** "Ni svarade att …: ”…”." — varför det ledande förslaget kom med. */
  varfor: (du: boolean, svar: string) => string;
  /** Rubriken i AI-underlaget och säljnotisen. */
  etikett: string;
};

const nidu = (du: boolean) => ({ Ni: du ? "Du" : "Ni", ni: du ? "du" : "ni" });

export const SPECIAL: Readonly<Record<string, Specialfraga>> = {
  [FRAGA.affarer]: {
    id: FRAGA.affarer,
    fraga: "Var tappar ni mest fart på vägen till en ny affär?",
    etikett: "Var de tappar affärer",
    varfor: (du, svar) =>
      `${nidu(du).Ni} svarade att ${nidu(du).ni} tappar mest fart här: ”${svar}”.`,
    alternativ: [
      { svar: "För få rätt personer hittar oss", omraden: ["marknad", "nya-kunder"], ide: { storre: "prospektering" } },
      // Först här blir hemsidan en fråga — och den avgörs i samtalet.
      { svar: "Intresserade hör inte av sig", omraden: [], ide: { liten: "fanga-forfragningar", storre: "fanga-forfragningar" } },
      { svar: "Förfrågningar eller offerter följs inte upp", omraden: ["offerter", "samtal"] },
      { svar: "Tidigare kunder kommer inte tillbaka", omraden: ["aterkommande"], ide: { storre: "kundbasen" } },
    ],
  },
  [FRAGA.kanaler]: {
    id: FRAGA.kanaler,
    fraga: "Hur kommer de flesta förfrågningar och ärenden in?",
    etikett: "Hur ärenden kommer in",
    varfor: (du, svar) =>
      `${nidu(du).Ni} svarade att de flesta förfrågningar kommer in så här: ”${svar}”.`,
    alternativ: [
      { svar: "Telefon", omraden: ["samtal"] },
      { svar: "Mejl", omraden: ["arenden", "samtal"] },
      { svar: "Formulär på hemsidan", omraden: ["samtal"] },
      { svar: "Chatt eller sociala medier", omraden: ["samtal"] },
      { svar: "Flera kanaler", omraden: ["arenden", "samtal"] },
    ],
  },
  [FRAGA.systembrott]: {
    id: FRAGA.systembrott,
    fraga: "Var bryts flödet i dag?",
    etikett: "Var flödet bryts",
    varfor: (du, svar) =>
      `${nidu(du).Ni} svarade att flödet bryts här: ”${svar}”.`,
    alternativ: [
      { svar: "Information kopieras manuellt", omraden: ["dubbelregistrering"] },
      { svar: "Systemen har olika information", omraden: ["dubbelregistrering", "rapporter"] },
      { svar: "Någon måste exportera och importera filer", omraden: ["dubbelregistrering"] },
      { svar: "Information skickas via mejl", omraden: ["arenden", "dubbelregistrering"] },
      { svar: "Vi saknar en gemensam överblick", omraden: ["rapporter", "koll"] },
      { svar: "Vet inte", omraden: [] },
    ],
  },
  [FRAGA.produktion]: {
    id: FRAGA.produktion,
    fraga: "Vilken del av flödet kräver mest manuell koordinering?",
    etikett: "Produktionsflödet",
    varfor: (du, svar) =>
      `${nidu(du).Ni} svarade att det här kräver mest manuell koordinering: ”${svar}”.`,
    alternativ: [
      { svar: "Order → planering", omraden: ["dubbelregistrering", "schema"] },
      { svar: "Planering → produktion", omraden: ["schema", "koll"] },
      { svar: "Inköp → lager", omraden: ["kontakter", "dubbelregistrering"] },
      { svar: "Kvalitetskontroll", omraden: ["godkannande"] },
      { svar: "Dokumentation", omraden: ["dokument"] },
      { svar: "Produktion → leverans", omraden: ["koll", "kontakter"] },
      { svar: "Rapportering", omraden: ["rapporter"] },
    ],
  },
};

/**
 * Svar på "Hur kommer ärenden in?" som gör frågan om missade samtal relevant.
 * Den som bara får mejl ska aldrig behöva svara på den.
 */
export const KANALER_MED_TELEFON = ["Telefon", "Flera kanaler"] as const;

/** Svar på affärsfrågan som öppnar spåret om förfrågningar. */
export const AFFARER_OM_FORFRAGNINGAR = [
  "Intresserade hör inte av sig",
  "Förfrågningar eller offerter följs inte upp",
] as const;

// Frågas på tacksidan, efter mejlet. De hjälper säljaren — inte svaret — så
// de hör inte hemma före resultatet.
export const ROLLER = ["Ägare eller VD", "Chef eller ansvarig", "Medarbetare"] as const;
export const TIDSHORISONTER = [
  "Så snart som möjligt",
  "Inom tre månader",
  "Senare i år",
  "Är bara nyfiken",
] as const;

/** Svaren på "Behöver samma information matas in på flera ställen?". */
export const DUBBELINMATNING = ["Ja, ofta", "Ibland", "Sällan", "Vet inte"] as const;

/** Från det här svaret föreslår vi integrationsområdet även om det inte valts. */
export const OFTA_DUBBELT = "Ja, ofta";

/** Systemen, som de står på frågan. */
export const VERKTYG = {
  microsoft: "Microsoft 365 (Outlook, Teams, SharePoint)",
  google: "Google Workspace (Gmail, Kalender, Drive)",
  fortnox: "Fortnox",
  visma: "Visma",
  ekonomi: "Annat ekonomisystem",
  erp: "ERP eller affärssystem",
  crm: "CRM",
  bransch: "Branschsystem",
  projekt: "Projektverktyg",
  bokning: "Bokningssystem",
  excel: "Excel eller kalkylblad",
  egna: "Egna interna system",
  mejl: "Mejl",
  papper: "Papper eller manuella dokument",
  annat: "Annat",
} as const;

// ── Frågor ──────────────────────────────────────────────────────────────────
// Ordningen här är flödets ordning. Specialspåren och följdfrågorna per
// område läggs in efter FRAGA.tidstjuvar av src/lib/flode.ts.

export const FRAGOR: readonly Fraga[] = [
  {
    id: FRAGA.bransch,
    typ: "enval",
    fraga: "Vilken typ av verksamhet har ni?",
    alternativ: Object.values(BRANSCH),
    rutnat: true,
  },
  {
    id: FRAGA.antal,
    typ: "enval",
    fraga: "Hur många är ni?",
    alternativ: ["Bara jag", "2–5", "6–20", "21–50", "Fler än 50"],
    rutnat: true,
    reaktioner: {
      "Bara jag":
        "Då är det du som svarar, planerar och fakturerar. Varje timme du får tillbaka märks direkt.",
    },
  },
  {
    id: FRAGA.mal,
    typ: "enval",
    fraga: "Om ni kunde förbättra en del av verksamheten de kommande månaderna, vad skulle göra störst skillnad?",
    // Service-alternativet skrivs i branschens ord av flödet.
    alternativ: Object.values(MAL),
  },
  {
    id: FRAGA.tidstjuvar,
    typ: "flerval",
    fraga: "Vilka av de här sakerna gör människor fortfarande för hand hos er?",
    hjalptext: `Välj upp till ${MAX_TIDSTJUVAR === 3 ? "tre" : MAX_TIDSTJUVAR}.`,
    alternativ: MONSTER,
    max: MAX_TIDSTJUVAR,
  },
  // Specialspåren och följdfrågorna per valt område läggs in här av flödet.
  {
    id: FRAGA.slutet,
    typ: "grupp",
    fraga: "Var finns informationen som behövs för arbetet i dag?",
    delar: [
      {
        id: FRAGA.verktyg,
        flerval: true,
        fraga: "Välj alla system och ställen som stämmer",
        hjalptext: "Då vet vi vad som går att koppla ihop.",
        alternativ: Object.values(VERKTYG),
      },
      {
        id: FRAGA.dubbelinmatning,
        fraga: "Behöver samma information matas in eller flyttas mellan flera av dem?",
        alternativ: DUBBELINMATNING,
        reaktioner: {
          "Ja, ofta":
            "Där brukar det finnas mycket att hämta — och det är ofta enklare att lösa än man tror.",
        },
      },
    ],
  },
  {
    id: FRAGA.fritext,
    typ: "fritext",
    fraga: "Om du fick välja ett arbetsflöde som bara skulle fungera av sig självt – vilket skulle det vara?",
    hjalptext: "Beskriv gärna från början till slut. Skriv inga namn eller personuppgifter.",
    platshallare: "Skriv med egna ord …",
    valfri: true,
  },
];

/**
 * Följdfrågornas delar. Tidsvalen beror på storlek, se TIDSSKALA. Konsekvensen
 * frågas bara på den första skärmen.
 */
export const OMRADESFRAGOR = {
  // Rubriken är områdets namn — överrubriken säger vad som ska göras.
  overrubrik: (nu: number, av: number, delar: number) =>
    `Del ${nu} av ${av} · ${delar === 3 ? "tre" : "två"} snabba frågor`,
  tid: {
    fraga: "Hur mycket tid går ungefär åt till det här i veckan, sammanlagt?",
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
    fraga: "Hur görs det i dag?",
    alternativ: Object.keys(ANDEL_SPARBAR),
  },
  konsekvens: {
    fraga: "Vad händer när det här inte fungerar som det ska?",
    alternativ: Object.keys(KONSEKVENS),
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
      "Svara på några snabba frågor om hur ni arbetar, så visar vi var arbetet fastnar — och tre konkreta sätt att lösa det.",
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
    // Rubriken efter deras mål. Mål utan riktning får standardrubriken.
    // kunder = branschens ord, i versaler: "PATIENTER", "GÄSTER".
    malRubrik: {
      effektivitet: (du: boolean) =>
        du ? "SÅ FÅR DU MER GJORT PÅ SAMMA TID." : "SÅ FÅR NI MER GJORT MED SAMMA TEAM.",
      integration: (du: boolean) =>
        `SÅ FÅR ${du ? "DU DINA" : "NI ERA"} SYSTEM ATT HÄNGA IHOP.`,
      ledtid: () => "SÅ BLIR VÄGEN TILL FÄRDIGT ARBETE KORTARE.",
      overblick: (du: boolean) => `SÅ FÅR ${du ? "DU" : "NI"} KOLL PÅ VERKSAMHETEN.`,
      overlamningar: () => "SÅ SLUTAR SAKER FALLA MELLAN STOLARNA.",
      affarer: (du: boolean) => `SÅ FÅR ${du ? "DU" : "NI"} IN FLER AFFÄRER.`,
      service: (du: boolean, kunder: string) =>
        `SÅ GER ${du ? "DU DINA" : "NI ERA"} ${kunder.toUpperCase()} BÄTTRE SERVICE.`,
    },
    // Vad det kostar affären, per mål. Inleder sammanfattningen när det
    // ledande förslaget saknar en egen konsekvens (t.ex. en tillväxtidé).
    malKonsekvens: {
      effektivitet:
        "När teamets tid går åt till manuella moment blir det mindre kvar till det som faktiskt driver verksamheten framåt.",
      integration:
        "När systemen inte hänger ihop flyttas information för hand — det tar tid, ger fel och gör verksamheten beroende av enskilda personer.",
      ledtid:
        "Varje manuellt steg mellan start och färdigt arbete gör att det tar längre tid innan kunden får sitt och pengarna kommer in.",
      overblick:
        "Utan en samlad bild fattas besluten på gammal information, och problem upptäcks först när de redan har kostat.",
      overlamningar:
        "Det som faller mellan personer och avdelningar blir liggande — och märks ofta först när en kund eller kollega frågar.",
      affarer:
        "Utan en jämn ström av nya affärer blir tillväxten ryckig — och beroende av att någon hinner sälja.",
      service:
        "Kunder märker direkt när svar dröjer och ärenden blir liggande — och det avgör om de kommer tillbaka.",
    } as Readonly<Partial<Record<Mal, string>>>,
    /** "Du sa att det viktigaste just nu är att få betalt snabbare." */
    malet: (du: boolean, mal: Mal) =>
      mal === "vetinte"
        ? `${du ? "Du" : "Ni"} ville ha hjälp att hitta var det finns mest att vinna — därför börjar vi där svaren pekar tydligast.`
        : `${du ? "Du" : "Ni"} sa att det som skulle göra störst skillnad är att ${MAL_FRAS[mal](du)} — därför börjar vi där.`,
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
