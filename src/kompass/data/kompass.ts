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
  /** Samma bokning som sajtens "Boka samtal". */
  bokaMote: "https://calendly.com/hai-khyteteam/30min",
} as const;

// ── Frågornas identiteter ───────────────────────────────────────────────────
// Sträng-id:n i stället för index: en fråga kan flyttas utan att matchningen
// eller sparade svar i localStorage går sönder. Frågor på samma skärm har egna
// id:n för varje del — svaren sparas platt, ett per del.
//
// Kompassen ska vara lätt att genomföra: få skärmar, få val, varje fråga
// ska ge något vi använder — i resultatet, i AI-analysen eller i mötet.
// Ingen ska behöva svara på något som inte tydligt kan gälla dem, och ingen
// fråga ställs två gånger i olika ord.

export const FRAGA = {
  // Skärm: om er
  omEr: "om_er",
  bransch: "bransch",
  antal: "antal",
  // Frågas på tacksidan, efter mejlet — se ROLLER.
  roll: "roll",
  mal: "mal",
  // Vad som görs för hand
  tidstjuvar: "tidstjuvar",
  // Specialspåret — högst ett, se SPECIAL.
  affarer: "affarer",
  kanaler: "kanaler",
  missadeSamtal: "missade_samtal",
  kundvarde: "kundvarde",
  systembrott: "systembrott",
  produktion: "produktion",
  // Skärm: tid per område och vad som händer när det inte fungerar
  tid: "tid",
  konsekvens: "konsekvens",
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
  tid: (omradeId: string) => `omrade_${omradeId}_tid`,
} as const;

// ── Branscher ───────────────────────────────────────────────────────────────
// Branschen ger språk och exempel — den bestämmer inte vilket problem
// företaget har. Det gör svaren.

export const BRANSCH = {
  hantverk: "Bygg, hantverk och verkstad",
  stad: "Städ, skönhet och lokal service",
  vard: "Vård och hälsa",
  hotell: "Hotell, restaurang och besöksnäring",
  handel: "Handel och e-handel",
  tillverkning: "Tillverkning och industri",
  transport: "Transport och logistik",
  fastighet: "Fastighet och förvaltning",
  byra: "Konsult, byrå och IT",
  annat: "Annat",
} as const;

export type Bransch = (typeof BRANSCH)[keyof typeof BRANSCH];

/**
 * Branscher där kunderna själva bokar tider. Där betyder "planering och
 * bokningar" kundbokningar — annars schema och bemanning.
 */
export const KUNDBOKNING: readonly Bransch[] = [BRANSCH.vard, BRANSCH.stad];

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
// väljer bland ett fåtal arbetsmönster (MONSTER), och varje mönster pekar på
// ett område. Övriga områden nås via specialfrågan, målet och AI-analysen.

export type Omrade = {
  id: string;
  /** Kort namn — visas som rubrik på följdfrågan och i resultatet. */
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
    namn: "Offerter, order och underlag",
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
 * Ett val på "Vad görs fortfarande för hand?". Kort text, ett område.
 * Några mönster byter område efter verksamheten: där kunderna bokar tider
 * blir planering kundbokningar, och från tio anställda blir förfrågningar
 * ett ärendeflöde i stället för missade samtal.
 */
export type Monster = {
  text: string;
  omrade: string;
  /** Området när branschen är en KUNDBOKNING-bransch. */
  kundbokning?: string;
  /** Området från nivå mellan och uppåt. */
  storre?: string;
};

export const MONSTER: readonly Monster[] = [
  { text: "Svara på förfrågningar, mejl och samtal", omrade: "samtal", storre: "arenden" },
  { text: "Offerter och order", omrade: "offerter" },
  { text: "Fakturor och betalningar", omrade: "fakturor" },
  { text: "Planering, bokningar och schema", omrade: "schema", kundbokning: "bokning" },
  { text: "Flytta information mellan system", omrade: "dubbelregistrering" },
  { text: "Rapporter och Excel", omrade: "rapporter" },
  { text: "Följa upp vem som gör vad", omrade: "koll" },
  { text: "Dokument och avtal", omrade: "dokument" },
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
export const MAX_SPAR = 1;

// ── Beräkningar ─────────────────────────────────────────────────────────────

// ── Storlek ─────────────────────────────────────────────────────────────────
// Ett företag med 25 anställda ska inte få samma förslag som en enmansfirma.
// Nivån styr tidsvalen, vilka områden som väger tyngst, hur tiden uttrycks
// och hur stora flöden vi föreslår.

export type Niva = "liten" | "mellan" | "stor";

export const NIVA_FOR_ANTAL: Readonly<Record<string, Niva>> = {
  "Bara jag": "liten",
  "2–9": "liten",
  "10–49": "mellan",
  "50 eller fler": "stor",
};

/**
 * Tid per vecka för ett område, som besökaren själv angett. Timmar.
 * Två skalor: små företag mäter i timmar, större i arbetsdagar och tjänster —
 * "Mer än 10 h" räcker inte när fakturahanteringen är en halv heltid.
 * Fyra val per skala: tillräckligt för att räkna, snabbt att svara.
 */
export const TIDSSKALA: Readonly<
  Record<"liten" | "storre", Readonly<Record<string, { min: number; max: number }>>>
> = {
  liten: {
    "Under 2 h": { min: 0.5, max: 2 },
    "2–5 h": { min: 2, max: 5 },
    "5–10 h": { min: 5, max: 10 },
    // KALIBRERA: taket för "mer än 10". Hellre för lågt än för högt.
    "Mer än 10 h": { min: 10, max: 15 },
  },
  storre: {
    "Under 5 h": { min: 1, max: 5 },
    "5–20 h": { min: 5, max: 20 },
    "20–40 h": { min: 20, max: 40 },
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
 * Hur stor andel av tiden som brukar gå att automatisera. Allt som räknas har
 * de själva sagt görs för hand — men sällan helt, så spannet är försiktigt.
 */
// KALIBRERA: försiktig uppskattning tills vi har egen data.
export const ANDEL_SPARBAR = { min: 0.3, max: 0.6 } as const;

/** Missade samtal per vecka. Ett tal mitt i spannet, för kronberäkningen. */
export const MISSADE_SAMTAL_PER_VECKA: Readonly<Record<string, number>> = {
  "Nästan inga": 0,
  "1–5": 3,
  "6–15": 10,
  // KALIBRERA: "fler än 15" räknas lågt.
  "Fler än 15": 20,
};

/** Från och med dessa svar föreslår vi samtalsområdet även om det inte valts. */
export const MANGA_MISSADE_SAMTAL = ["6–15", "Fler än 15"] as const;

/** Minuter det tar att ringa tillbaka och reda ut ett missat samtal. */
// KALIBRERA
export const MINUTER_PER_MISSAT_SAMTAL = { min: 3, max: 8 } as const;

/**
 * Vad en ny kund är värd under första året. Ett värde i spannet — medvetet
 * i underkant. "Vet inte" ger ingen kronberäkning alls.
 */
export const KUNDVARDE_KR: Readonly<Record<string, number | null>> = {
  // KALIBRERA: alla.
  "Under 5 000 kr": 2000,
  "5 000–50 000 kr": 15000,
  "Över 50 000 kr": 60000,
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
 * Svaren på "Vad skulle göra störst skillnad för er just nu?". Målet
 * bestämmer resultatets rubrik och vilket förslag som leder — så att
 * förslaget svarar på det de bryr sig om, inte bara på var kalkylen blev
 * störst. Fem korta val som fungerar för alla storlekar.
 */
export const MAL = {
  affarer: "Fler affärer",
  service: "Snabbare svar och bättre service",
  effektivitet: "Mer gjort med samma team",
  integration: "System som hänger ihop",
  overblick: "Bättre koll och färre missar",
} as const;

export type Mal = keyof typeof MAL;

/** Mål där tiden får avgöra vad som leder — inget särskilt område svarar mot dem. */
export const MAL_UTAN_RIKTNING: readonly Mal[] = ["effektivitet"];

/**
 * Områden som svarar mot varje mål. Det första förslaget som bygger på något
 * av dem leder resultatet. Tomt = det som sparar mest tid leder.
 */
export const MAL_OMRADEN: Readonly<Record<Mal, readonly string[]>> = {
  affarer: ["nya-kunder", "offerter", "samtal", "aterkommande", "marknad"],
  service: ["samtal", "arenden", "bokning", "kontakter"],
  effektivitet: [],
  integration: ["dubbelregistrering", "information", "rapporter"],
  overblick: ["koll", "rapporter", "godkannande"],
};

/** Målet som bisats, för "det som skulle göra störst skillnad är att …". */
export const MAL_FRAS: Readonly<Record<Mal, (du: boolean) => string>> = {
  affarer: () => "få in fler affärer",
  service: (du) => (du ? "ge dina kunder snabbare svar och bättre service" : "ge era kunder snabbare svar och bättre service"),
  effektivitet: (du) => (du ? "få mer gjort på samma tid" : "få mer gjort med samma team"),
  integration: (du) => (du ? "få dina system att hänga ihop" : "få era system att hänga ihop"),
  overblick: () => "få bättre koll och färre missar",
};

// ── Konsekvens ──────────────────────────────────────────────────────────────

/**
 * "Vad händer när det här inte fungerar?" — frågas en gång, på tidsskärmen.
 * Ger AI:n, regelmotorn och säljaren affärskonsekvensen, inte bara timmarna.
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
  "Kunder eller affärer påverkas": { text: "påverkas kunder och affärer", vikt: 2 },
  "Fel uppstår": { text: "uppstår fel", vikt: 1 },
  "Saker blir liggande": { text: "blir saker liggande", vikt: 1 },
  "Vi behöver fler personer": { text: "behövs fler personer", vikt: 1.5 },
  "Mest irritation": { text: null, vikt: -1 },
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
    fraga: "Var tappar ni mest affärer i dag?",
    etikett: "Var de tappar affärer",
    varfor: (du, svar) =>
      `${nidu(du).Ni} svarade att ${nidu(du).ni} tappar mest affärer här: ”${svar}”.`,
    alternativ: [
      { svar: "För få hittar oss", omraden: ["marknad", "nya-kunder"], ide: { storre: "prospektering" } },
      // Först här blir hemsidan en fråga — och den avgörs i samtalet.
      { svar: "Förfrågningar blir liggande", omraden: ["samtal", "offerter"], ide: { liten: "fanga-forfragningar" } },
      { svar: "Offerter följs inte upp", omraden: ["offerter"] },
      { svar: "Kunder kommer inte tillbaka", omraden: ["aterkommande"], ide: { storre: "kundbasen" } },
      { svar: "Vet inte", omraden: [] },
    ],
  },
  [FRAGA.kanaler]: {
    id: FRAGA.kanaler,
    fraga: "Hur kommer de flesta förfrågningar in?",
    etikett: "Hur förfrågningar kommer in",
    varfor: (du, svar) =>
      `${nidu(du).Ni} svarade att de flesta förfrågningar kommer in så här: ”${svar}”.`,
    alternativ: [
      { svar: "Telefon", omraden: ["samtal"] },
      { svar: "Mejl och formulär", omraden: ["arenden", "samtal"] },
      { svar: "Flera kanaler", omraden: ["arenden", "samtal"] },
    ],
  },
  [FRAGA.systembrott]: {
    id: FRAGA.systembrott,
    // Neutral fråga: den som har system som fungerar ska kunna säga det.
    fraga: "Hur flyttas information mellan era system i dag?",
    etikett: "Hur information flyttas mellan system",
    varfor: (du, svar) =>
      `${nidu(du).Ni} svarade att information flyttas mellan systemen så här: ”${svar}”.`,
    alternativ: [
      { svar: "Vi skriver in eller kopierar för hand", omraden: ["dubbelregistrering"] },
      { svar: "Vi exporterar och importerar filer", omraden: ["dubbelregistrering"] },
      { svar: "Den skickas via mejl", omraden: ["arenden", "dubbelregistrering"] },
      // Pekar inte ut något — då leder målet i stället.
      { svar: "Systemen är kopplade och fungerar bra", omraden: [] },
      { svar: "Vet inte", omraden: [] },
    ],
  },
  [FRAGA.produktion]: {
    id: FRAGA.produktion,
    fraga: "Var krävs mest manuell samordning?",
    etikett: "Produktionsflödet",
    varfor: (du, svar) =>
      `${nidu(du).Ni} svarade att det här kräver mest manuell samordning: ”${svar}”.`,
    alternativ: [
      { svar: "Order → planering", omraden: ["dubbelregistrering", "schema"] },
      { svar: "Planering → produktion", omraden: ["schema", "koll"] },
      { svar: "Inköp och lager", omraden: ["kontakter", "dubbelregistrering"] },
      { svar: "Kvalitet och dokumentation", omraden: ["godkannande", "dokument"] },
      { svar: "Leverans och uppföljning", omraden: ["koll", "kontakter"] },
      { svar: "Inget särskilt", omraden: [] },
    ],
  },
};

/**
 * Svar på "Hur kommer förfrågningar in?" som gör frågan om missade samtal
 * relevant. Den som bara får mejl ska aldrig behöva svara på den.
 */
export const KANALER_MED_TELEFON = ["Telefon", "Flera kanaler"] as const;

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

/** Systemen, som de står på frågan. Få och breda — detaljerna tas i mötet. */
export const VERKTYG = {
  microsoft: "Microsoft 365 (Outlook, Teams)",
  google: "Google (Gmail, Kalender)",
  fortnox: "Fortnox",
  visma: "Visma",
  erp: "Affärssystem eller ERP",
  crm: "CRM",
  bransch: "Branschsystem",
  excel: "Excel",
  annat: "Annat",
} as const;

// ── Frågor ──────────────────────────────────────────────────────────────────
// Ordningen här är flödets ordning. Specialspåren och följdfrågorna per
// område läggs in efter FRAGA.tidstjuvar av src/lib/flode.ts.

export const FRAGOR: readonly Fraga[] = [
  {
    id: FRAGA.omEr,
    typ: "grupp",
    fraga: "Berätta kort om er",
    delar: [
      {
        id: FRAGA.bransch,
        fraga: "Vilken typ av verksamhet har ni?",
        alternativ: Object.values(BRANSCH),
      },
      {
        id: FRAGA.antal,
        fraga: "Hur många är ni?",
        alternativ: Object.keys(NIVA_FOR_ANTAL),
        reaktioner: {
          "Bara jag":
            "Då är det du som svarar, planerar och fakturerar. Varje timme du får tillbaka märks direkt.",
        },
      },
    ],
  },
  {
    id: FRAGA.mal,
    typ: "enval",
    fraga: "Vad skulle göra störst skillnad för er just nu?",
    alternativ: Object.values(MAL),
  },
  {
    id: FRAGA.tidstjuvar,
    typ: "flerval",
    fraga: "Vad görs fortfarande för hand hos er?",
    hjalptext: `Välj upp till ${MAX_TIDSTJUVAR === 3 ? "tre" : MAX_TIDSTJUVAR}.`,
    alternativ: [...MONSTER.map((m) => m.text), ANNAT_MONSTER],
    max: MAX_TIDSTJUVAR,
    rutnat: true,
  },
  // Specialspåret och tidsskärmen läggs in här av flödet.
  {
    id: FRAGA.slutet,
    typ: "grupp",
    fraga: "Vilka system använder ni?",
    delar: [
      {
        id: FRAGA.verktyg,
        flerval: true,
        fraga: "Välj alla som stämmer",
        hjalptext: "Då vet vi vad som går att koppla ihop.",
        alternativ: Object.values(VERKTYG),
      },
      {
        id: FRAGA.dubbelinmatning,
        fraga: "Skrivs samma information in på flera ställen?",
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
    fraga: "Om ett arbetsflöde kunde sköta sig självt — vilket skulle det vara?",
    hjalptext: "Frivilligt. Skriv inga namn eller personuppgifter.",
    platshallare: "Skriv med egna ord …",
    valfri: true,
  },
];

/** Tidsskärmen: en rad per valt område, sist konsekvensen. */
export const TIDSSKARM = {
  fraga: "Ungefär hur mycket tid går åt i veckan?",
  hjalptext: "Sammanlagt, för alla som gör det.",
  // När inget område valts ("Något annat") finns bara konsekvensraden.
  fragaUtanTid: "Vad händer när det här inte fungerar?",
  konsekvens: "Och vad händer när det inte fungerar?",
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
    rubrik: "Var tappar du mest tid?",
    underrubrik:
      "Svara på några snabba frågor om hur ni arbetar, så visar vi var arbetet fastnar — och tre konkreta sätt att lösa det.",
    knapp: "Kör igång",
    // Syns under knappen. Svaren sparas redan under flödet — det ska stå här,
    // inte först vid mejlfältet.
    integritet:
      "Dina svar sparas medan du svarar, utan namn eller kontaktuppgifter, så att vi kan ta fram ditt resultat och förbättra kompassen.",
    integritetLank: "Så hanterar vi uppgifterna",
    fakta: ["Under två minuter", "Mest snabba tryck", "Resultatet direkt"],
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
    rubrik: "Här går er tid",
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
    // Den enda siffran på sidan. Allt annat står i mejlet.
    frigor: "Går troligen att frigöra",
    frigorFot: "i veckan",
    frigorFotManad: "i månaden",
    // Arbetsflödet de beskrev, i listan.
    duSkrev: "Du skrev:",
    // Avslutet: möte först, mejl som alternativ.
    mote: {
      etikett: "Nästa steg",
      rubrik: "Vill du veta mer?",
      brodtext: "30 minuter, kostnadsfritt. Vi visar hur det skulle se ut hos er.",
      knapp: "Boka ett möte",
    },
    tidEtikett: "Er tid",
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
    // kunder = branschens ord: "patienter", "gäster".
    malRubrik: {
      affarer: (du: boolean) => `Så får ${du ? "du" : "ni"} in fler affärer`,
      service: (du: boolean, kunder: string) =>
        `Så ger ${du ? "du dina" : "ni era"} ${kunder} snabbare svar`,
      integration: (du: boolean) =>
        `Så får ${du ? "du dina" : "ni era"} system att hänga ihop`,
      overblick: (du: boolean) => `Så får ${du ? "du" : "ni"} koll på verksamheten`,
    },
    // Vad det kostar affären, per mål. Inleder sammanfattningen när det
    // ledande förslaget saknar en egen konsekvens (t.ex. en tillväxtidé).
    malKonsekvens: {
      affarer:
        "Utan en jämn ström av nya affärer blir tillväxten ryckig — och beroende av att någon hinner sälja.",
      service:
        "Kunder märker direkt när svar dröjer och ärenden blir liggande — och det avgör om de kommer tillbaka.",
      effektivitet:
        "När teamets tid går åt till manuella moment blir det mindre kvar till det som faktiskt driver verksamheten framåt.",
      integration:
        "När systemen inte hänger ihop flyttas information för hand — det tar tid, ger fel och gör verksamheten beroende av enskilda personer.",
      overblick:
        "Utan en samlad bild blir saker liggande, och problem upptäcks först när de redan har kostat.",
    } as Readonly<Partial<Record<Mal, string>>>,
    /** "Ni sa att det som skulle göra störst skillnad är att få in fler affärer." */
    malet: (du: boolean, mal: Mal) =>
      `${du ? "Du" : "Ni"} sa att det som skulle göra störst skillnad är att ${MAL_FRAS[mal](du)} — därför börjar vi där.`,
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
    rubrik: "Eller få hela resultatet på mejl",
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
    rubrik: "Tack!",
    brodtext: (mejl: string) =>
      `Hela resultatet är på väg till ${mejl}. Vi hör av oss inom ett dygn.`,
    mote: "Vill du inte vänta? Boka en tid direkt.",
    direktkontakt: "Eller hör av dig direkt:",
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
