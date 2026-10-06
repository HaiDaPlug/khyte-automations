/**
 * Flödena vi föreslår på resultatsidan — ett per område.
 *
 * Det här är innehåll, inte logik: varje flöde är en mall som fylls i med
 * besökarens egna ord och verktyg (Sammanhang). En klinik får "patienter",
 * en restaurang "gäster", och den som använder Fortnox ser Fortnox i flödet.
 *
 * Reglerna:
 *  - Fyra konkreta steg, i den ordning det händer. Inga modeord.
 *  - Inga siffror här. Tid och pengar räknas i src/lib/analys.ts, och bara
 *    när svaren räcker för att stå för dem.
 *  - Ändra gärna texterna — testerna kontrollerar bara att alla områden har
 *    ett flöde och att inga mallvariabler blir tomma.
 */

import { BRANSCH, type Bransch, type Niva } from "@/kompass/data/kompass";

// ── Sammanhang ──────────────────────────────────────────────────────────────

/** Branschens egna ord. */
export type Ord = {
  kund: string;
  kunden: string;
  kunder: string;
  /** Plural för branschen: "hantverkare", "salonger" … */
  foretag: string;
  jobb: string;
  jobbet: string;
  /** "klar" eller "klart" — städningen är klar, jobbet är klart. */
  klar: string;
  /** Det som händer "när det är dags igen". */
  nastaGang: string;
};

/** Allt ett flöde behöver veta om besökaren. Byggs av src/lib/analys.ts. */
export type Sammanhang = {
  /** "Bara jag" — då skriver vi du i stället för ni. */
  du: boolean;
  ord: Ord;
  bransch?: Bransch;
  /** "Fortnox", "Visma" eller null. */
  ekonomi: string | null;
  /** "Google Kalender", "Outlook" eller null. */
  kalender: string | null;
  bokningssystem: boolean;
  crm: boolean;
  /** Verktyg med namn, för meningar som "förs över till Fortnox och Excel". */
  system: string[];
  /** RUT/ROT är relevant för branschen. */
  rut: boolean;
};

const STANDARDORD: Ord = {
  kund: "kund",
  kunden: "kunden",
  kunder: "kunder",
  foretag: "småföretag",
  jobb: "jobb",
  jobbet: "jobbet",
  klar: "klart",
  nastaGang: "nästa gång",
};

export const ORD: Readonly<Partial<Record<Bransch, Ord>>> = {
  [BRANSCH.hantverk]: {
    ...STANDARDORD,
    foretag: "hantverkare och verkstäder",
    nastaGang: "nästa översyn eller service",
  },
  [BRANSCH.stad]: {
    ...STANDARDORD,
    foretag: "serviceföretag",
    jobb: "uppdrag",
    jobbet: "uppdraget",
    klar: "klart",
    nastaGang: "nästa gång",
  },
  [BRANSCH.vard]: {
    kund: "patient",
    kunden: "patienten",
    kunder: "patienter",
    foretag: "kliniker och mottagningar",
    jobb: "besök",
    jobbet: "besöket",
    klar: "klart",
    nastaGang: "nästa besök",
  },
  [BRANSCH.hotell]: {
    kund: "gäst",
    kunden: "gästen",
    kunder: "gäster",
    foretag: "hotell och restauranger",
    jobb: "bokning",
    jobbet: "besöket",
    klar: "klart",
    nastaGang: "nästa besök",
  },
  [BRANSCH.handel]: {
    ...STANDARDORD,
    foretag: "butiker och e-handlare",
    jobb: "order",
    jobbet: "ordern",
    klar: "klar",
    nastaGang: "nästa köp",
  },
  [BRANSCH.tillverkning]: {
    ...STANDARDORD,
    foretag: "tillverkare",
    jobb: "order",
    jobbet: "ordern",
    klar: "klar",
    nastaGang: "nästa beställning",
  },
  [BRANSCH.transport]: {
    ...STANDARDORD,
    foretag: "åkerier och transportföretag",
    jobb: "leverans",
    jobbet: "leveransen",
    klar: "klar",
    nastaGang: "nästa beställning",
  },
  [BRANSCH.fastighet]: {
    kund: "hyresgäst",
    kunden: "hyresgästen",
    kunder: "hyresgäster",
    foretag: "fastighetsbolag",
    jobb: "ärende",
    jobbet: "ärendet",
    klar: "klart",
    nastaGang: "nästa besiktning",
  },
  [BRANSCH.byra]: {
    ...STANDARDORD,
    foretag: "byråer, konsult- och IT-bolag",
    jobb: "uppdrag",
    jobbet: "uppdraget",
    klar: "klart",
    nastaGang: "nästa uppdrag",
  },
};

export function ordFor(bransch: Bransch | undefined): Ord {
  return (bransch && ORD[bransch]) || STANDARDORD;
}

/**
 * Områden som brukar ge mest i varje bransch, i ordning. Sista reserven för
 * att fylla upp till tre förslag — först kommer det som svaren pekar på
 * (specialfrågan, målet). Visas utan siffror.
 */
export const BRANSCHTIPS: Readonly<Record<Bransch, readonly string[]>> = {
  [BRANSCH.hantverk]: ["offerter", "fakturor", "rut", "koll"],
  [BRANSCH.stad]: ["bokning", "samtal", "aterkommande", "rut"],
  [BRANSCH.vard]: ["bokning", "aterkommande", "samtal", "dokument"],
  [BRANSCH.hotell]: ["bokning", "schema", "arenden", "rapporter"],
  [BRANSCH.handel]: ["dubbelregistrering", "arenden", "rapporter", "kontakter"],
  [BRANSCH.tillverkning]: ["dubbelregistrering", "koll", "rapporter", "godkannande"],
  [BRANSCH.transport]: ["koll", "dubbelregistrering", "kontakter", "fakturor"],
  [BRANSCH.fastighet]: ["arenden", "koll", "dokument", "kontakter"],
  [BRANSCH.byra]: ["nya-kunder", "rapporter", "dokument", "fakturor"],
  [BRANSCH.annat]: ["dubbelregistrering", "koll", "rapporter", "fakturor"],
};

// ── Hjälpare för mallarna ───────────────────────────────────────────────────

/** Du eller ni, i alla former mallarna behöver. */
function pron(k: Sammanhang) {
  return k.du
    ? { ni: "du", Ni: "Du", er: "dig", era: "dina", upptagna: "upptagen" }
    : { ni: "ni", Ni: "Ni", er: "er", era: "era", upptagna: "upptagna" };
}

const stor = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Fortnox", "Fortnox och Excel", "Fortnox, Google och Excel". */
export function uppraknat(lista: string[]): string {
  if (lista.length <= 1) return lista[0] ?? "";
  return `${lista.slice(0, -1).join(", ")} och ${lista[lista.length - 1]}`;
}

const ekonomi = (k: Sammanhang) => k.ekonomi ?? "ert ekonomisystem";

const kalender = (k: Sammanhang) =>
  k.bokningssystem
    ? "ert bokningssystem"
    : k.kalender
      ? k.kalender
      : "kalendern";

const system = (k: Sammanhang) =>
  k.system.length > 0 ? uppraknat(k.system) : "era system";

// ── Flödena ─────────────────────────────────────────────────────────────────

export type Flode = {
  /** Problemet som en möjlighet — det de ska vilja läsa vidare om. */
  rubrik: string;
  /** Så skulle det se ut. Fyra steg, i ordning. */
  steg: string[];
  /** Vad de slipper. En mening. */
  slipper: string;
};

export const FLODEN: Readonly<Record<string, (k: Sammanhang) => Flode>> = {
  samtal: (k) => {
    const p = pron(k);
    return {
      rubrik: `Missade samtal blir bokningar i stället för förlorade ${k.ord.kunder}`,
      steg: [
        `En ${k.ord.kund} ringer medan ${p.ni} är ${p.upptagna} och inte kan svara.`,
        `Inom tio sekunder får hen ett SMS: ”Vi sitter fast just nu — boka en tid här eller svara med vad det gäller.”`,
        `Förfrågningar på mejl och formulär får svar inom en minut, med svar på de vanligaste frågorna och en bokningslänk.`,
        `Bokningen hamnar direkt i ${kalender(k)}, och ${p.ni} får en kort sammanfattning av vad det gäller.`,
      ],
      slipper: `Att ringa tillbaka i blindo på kvällen, och ${k.ord.kunder} som hinner gå till någon annan.`,
    };
  },

  bokning: (k) => {
    const p = pron(k);
    return {
      rubrik: "Bokningar som sköter sig själva",
      steg: [
        `${stor(k.ord.kunden)} bokar, flyttar eller avbokar själv via en länk, dygnet runt.`,
        `Tiden läggs direkt i ${kalender(k)}, utan risk för dubbelbokningar.`,
        `Dagen innan går en påminnelse ut via SMS, med möjlighet att flytta tiden.`,
        `Blir en tid ledig erbjuds den automatiskt till nästa ${k.ord.kund} som vill ha en.`,
      ],
      slipper: `Samtal och sms-trådar om tider, och tider där ingen dyker upp. ${p.Ni} ser bara att kalendern fylls.`,
    };
  },

  offerter: (k) => {
    const p = pron(k);
    return {
      rubrik: "Offerter som skrivs på minuter och följs upp av sig själva",
      steg: [
        `${stor(k.ord.kunden)} beskriver ${k.ord.jobbet} i ett formulär, med bilder och allt ${p.ni} behöver för att räkna.`,
        `Offerten byggs från ${p.era} mallar och priser och är klar att skicka efter en snabb koll.`,
        `Har ${k.ord.kunden} inte svarat efter tre dagar går en vänlig påminnelse ut. Sedan en till.`,
        `Säger ${k.ord.kunden} ja blir offerten en order${k.ekonomi ? ` i ${k.ekonomi}` : ""} och hamnar i planeringen.`,
      ],
      slipper: "Kvällar med offertskrivande, och offerter som dör i tystnad.",
    };
  },

  fakturor: (k) => {
    const p = pron(k);
    return {
      rubrik: `Fakturan går iväg samma dag som ${k.ord.jobbet} blir ${k.ord.klar}`,
      steg: [
        `${p.Ni} markerar ${k.ord.jobbet} som ${k.ord.klar} i mobilen.`,
        `Fakturan skapas direkt i ${ekonomi(k)}, med rätt ${k.ord.kund}, rader och ${k.rut ? "RUT/ROT-avdrag" : "priser"}.`,
        "Betalningarna stäms av automatiskt mot banken.",
        `Är något obetalt efter förfallodagen går en påminnelse ut, och ${p.ni} får en lista på det som fortfarande saknas.`,
      ],
      slipper: "Att samla ihop underlag i efterhand och jaga betalningar för hand.",
    };
  },

  bokforing: (k) => {
    const p = pron(k);
    return {
      rubrik: "Kvitton som hamnar rätt utan att någon sorterar dem",
      steg: [
        "Kvitton fotas i mobilen eller vidarebefordras från mejlen. Det är allt.",
        "Underlaget läses av, sorteras och konteras automatiskt.",
        `Allt hamnar i ${ekonomi(k)}, kopplat till rätt transaktion.`,
        `Saknas ett kvitto får ${p.ni} en påminnelse direkt, i stället för en överraskning vid bokslutet.`,
      ],
      slipper: "Kvittohögen och kvällarna före momsdeklarationen.",
    };
  },

  schema: (k) => {
    const p = pron(k);
    return {
      rubrik: "Ett schema som lägger sig självt",
      steg: [
        "Personalen lägger in tillgänglighet och önskemål i en app.",
        `Ett schema föreslås utifrån bokningar och bemanningsbehov — ${p.ni} godkänner.`,
        `Vill någon byta pass sköts det mellan kollegorna, med ${p.er} godkännande i ett klick.`,
        "Sjukanmälan går direkt till rätt person, och passet erbjuds automatiskt till den som kan.",
      ],
      slipper: "Sms-trådar om pass och att pussla om schemat varje vecka.",
    };
  },

  "nya-kunder": (k) => ({
    rubrik: "En färdig lista på rätt kunder, varje vecka",
    steg: [
      "Vi bestämmer tillsammans vilka kunder som är rätt för er — bransch, storlek och område.",
      "Varje vecka tas en lista fram på företag som passar, med rätt kontaktperson och kontaktuppgifter.",
      "Varje företag kommer med en kort sammanfattning, så att första kontakten blir personlig.",
      `Listan hamnar ${k.crm ? "direkt i ert CRM" : "i ett enkelt CRM eller kalkylark"}, redo att ringa eller mejla.`,
    ],
    slipper: "Timmar av googlande och kopierande mellan flikar.",
  }),

  marknad: (k) => {
    const p = pron(k);
    return {
      rubrik: `Innehåll som skapas av det ${p.ni} redan gör`,
      steg: [
        `${p.Ni} tar en bild när ${k.ord.jobbet} är ${k.ord.klar} och skickar den till ett nummer.`,
        "Ett färdigt inlägg skrivs i er ton, anpassat för Instagram, Facebook eller LinkedIn.",
        `Inläggen schemaläggs över veckan — ${p.ni} godkänner med ett klick.`,
        "En gång i månaden sätts ett nyhetsbrev ihop av det som publicerats.",
      ],
      slipper: "Att sitta och komma på vad ni ska skriva.",
    };
  },

  aterkommande: (k) => {
    const p = pron(k);
    return {
      rubrik: `${stor(k.ord.kunder)} som kommer tillbaka utan att ${p.ni} behöver jaga dem`,
      steg: [
        `Två dagar efter ${k.ord.jobbet} får ${k.ord.kunden} en fråga om omdöme, med direktlänk till Google.`,
        `Den som är nöjd skickas vidare till Google. Den som inte är nöjd hamnar hos ${p.er} först.`,
        `När det är dags för ${k.ord.nastaGang} får ${k.ord.kunden} en påminnelse med bokningslänk.`,
        `${stor(k.ord.kunder)} som inte hört av sig på sex månader får ett personligt meddelande.`,
      ],
      slipper: "Att komma ihåg vem som borde höra av sig, och omdömen som aldrig blir skrivna.",
    };
  },

  rapporter: (k) => {
    const p = pron(k);
    return {
      rubrik: `Siffrorna finns där när ${p.ni} behöver dem`,
      steg: [
        `Siffrorna hämtas automatiskt från ${system(k)} varje natt.`,
        "De samlas i en översikt som alltid är uppdaterad: försäljning, beläggning, obetalt.",
        `Varje måndag får ${p.ni} en sammanfattning på mejlen med det viktigaste.`,
        `Sticker något ut, som en ovanligt svag vecka, får ${p.ni} en signal direkt.`,
      ],
      slipper: "Att kopiera siffror till Excel och bygga samma rapport varje vecka.",
    };
  },

  dubbelregistrering: (k) => {
    const p = pron(k);
    return {
      rubrik: "Skriv in det en gång — resten sköter sig",
      steg: [
        `En ny ${k.ord.kund} eller order skrivs in på ett enda ställe.`,
        `Uppgifterna förs över automatiskt till ${system(k)}.`,
        "Ändras något, som en adress eller ett datum, uppdateras det överallt.",
        `Går något snett får ${p.ni} en notis, i stället för att upptäcka det i efterhand.`,
      ],
      slipper: "Att skriva samma sak två eller tre gånger — och felen som följer med.",
    };
  },

  dokument: (k) => {
    const p = pron(k);
    return {
      rubrik: "Avtal och dokument som fyller i sig själva",
      steg: [
        `Uppgifterna om ${k.ord.kunden} och ${k.ord.jobbet} finns redan — de hämtas in i rätt mall.`,
        "Avtalet eller blanketten skapas på några sekunder, med rätt priser och villkor.",
        "Det skickas för digital signering med BankID.",
        `Det signerade dokumentet sparas på rätt ställe, och ${p.ni} får en notis.`,
      ],
      slipper: "Att fylla i samma uppgifter för hand och jaga underskrifter.",
    };
  },

  koll: (k) => {
    const p = pron(k);
    return {
      rubrik: "Alla vet vad som händer — utan att fråga",
      steg: [
        `Varje ${k.ord.jobb} får en status: inkommet, planerat, pågår, klart.`,
        "Den som ska utföra det får det i mobilen, med allt som behövs.",
        `När något ändras får rätt person en notis, och ${k.ord.kunden} kan få besked automatiskt.`,
        `Blir något liggande för länge får ${p.ni} en påminnelse.`,
      ],
      slipper: "Frågor som ”hur går det med …?” och lappar som försvinner.",
    };
  },

  information: (k) => {
    const p = pron(k);
    return {
      rubrik: "Rätt svar på sekunder — utan att fråga runt",
      steg: [
        `Era dokument, mejl och ${k.system.length ? system(k) : "system"} görs sökbara på ett ställe.`,
        `${p.Ni} ställer frågan med egna ord, som ”vilket pris gäller för …?” eller ”var ligger senaste versionen?”.`,
        "Svaret kommer direkt, med en länk till källan så att det går att lita på.",
        "Det som ofta efterfrågas men saknas flaggas, så att det kan skrivas ner en gång för alla.",
      ],
      slipper: "Att leta i mappar och mejltrådar, och att vänta på att rätt kollega har tid att svara.",
    };
  },

  arenden: (k) => {
    const p = pron(k);
    return {
      rubrik: "Inkorgen som sorterar sig själv",
      steg: [
        `Mejl, formulär och ärenden från ${k.ord.kunder} landar på ett ställe.`,
        "Varje ärende läses av, märks med vad det gäller och hur bråttom det är.",
        "Det skickas direkt till rätt person, med ett förberett svar att utgå från.",
        `Blir något liggande får ${p.ni} en påminnelse innan ${k.ord.kunden} hinner fråga igen.`,
      ],
      slipper: "Att läsa allt för att hitta det som är viktigt, och att skicka vidare mejl för hand.",
    };
  },

  godkannande: (k) => {
    const p = pron(k);
    return {
      rubrik: "Kontroller som görs av sig själva — godkännanden som inte fastnar",
      steg: [
        "När ett underlag kommer in kontrolleras det automatiskt mot era regler.",
        "Det som stämmer går vidare direkt. Det som avviker markeras, med förklaring.",
        `Det som behöver godkännas skickas till rätt person, som godkänner i mobilen.`,
        `Väntar något för länge går en påminnelse ut, och ${p.ni} ser var allt står.`,
      ],
      slipper: "Att stämma av uppgifter för hand och jaga den som ska godkänna.",
    };
  },

  kontakter: (k) => {
    const p = pron(k);
    return {
      rubrik: "Besked som går ut av sig själva när något händer",
      steg: [
        `När något händer — en order läggs, ${k.ord.jobbet} blir ${k.ord.klar}, en leverans är på väg — skickas rätt besked automatiskt.`,
        "Leverantörer får beställningar och påminnelser utan att någon skriver dem.",
        `${stor(k.ord.kunder)} får statusbesked i tid, i stället för att behöva höra av sig och fråga.`,
        `${p.Ni} ser vad som skickats och till vem, och kan ändra texterna när ${p.ni} vill.`,
      ],
      slipper: "Att komma ihåg vem som ska ha besked, och att skriva samma meddelande om och om igen.",
    };
  },

  rut: (k) => ({
    rubrik: "RUT/ROT-underlaget som sköter sig självt",
    steg: [
      `När ${k.ord.jobbet} faktureras sparas uppgifterna som behövs för avdraget automatiskt.`,
      "Underlaget sammanställs och kontrolleras innan det skickas.",
      "Ansökan går till Skatteverket i rätt format.",
      "När utbetalningen kommer stäms den av mot fakturan.",
    ],
    slipper: "Att sitta med Skatteverkets filer och stämma av belopp för hand.",
  }),
};

// ── Avancerade flöden ───────────────────────────────────────────────────────
// För företag med 6 anställda eller fler. Samma områden, men i den skala där
// Khyte faktiskt gör mest nytta: AI-assistenter, integrationer mellan system,
// automatisk kontroll och översikter i realtid. Fem steg i stället för fyra.

/** Ledningen, eller du om du är ensam. */
const ledning = (k: Sammanhang) => (k.du ? "du" : "ledningen");

export const FLODEN_AVANCERAD: Readonly<Record<string, (k: Sammanhang) => Flode>> = {
  samtal: (k) => ({
    rubrik: "En kundtjänst som svarar dygnet runt",
    steg: [
      "Alla samtal, sms, mejl och formulär samlas i en gemensam inkorg.",
      `Vanliga frågor om öppettider, priser och status på ${k.ord.jobbet} får svar direkt via sms och mejl, med en länk för att boka tid i ${kalender(k)}.`,
      "Det som kräver en människa sorteras och skickas till rätt person, med en sammanfattning av vad det gäller.",
      `Missade samtal får ett sms inom tio sekunder, så att ingen ${k.ord.kund} hinner ringa någon annan.`,
      `${stor(ledning(k))} ser svarstider, volymer och vad ${k.ord.kunder} frågar om i en översikt.`,
    ],
    slipper: "Att telefonen styr dagen — och förfrågningar som ingen tog hand om.",
  }),

  bokning: (k) => ({
    rubrik: "Bokning, bemanning och påminnelser i ett flöde",
    steg: [
      `${stor(k.ord.kunder)} bokar själva, dygnet runt, utifrån verklig tillgänglighet hos rätt person eller resurs.`,
      `Bokningen hamnar i ${kalender(k)} och kopplas till kundkortet, med historik och önskemål.`,
      "Påminnelser, ombokningar och avbokningar sköts automatiskt, och lediga tider erbjuds till väntelistan.",
      "Luckor och uteblivna besök syns direkt, så att schemat kan fyllas i tid.",
      `${stor(ledning(k))} ser beläggningen per person och vecka i en översikt.`,
    ],
    slipper: "Telefonkön för att boka om, och tomma tider som ingen hann fylla.",
  }),

  offerter: (k) => {
    const p = pron(k);
    return {
      rubrik: "Offerter som räknar, skickas och följs upp av sig själva",
      steg: [
        `Förfrågan kommer in med allt som behövs — mått, bilder, önskemål — via ett formulär som ställer rätt följdfrågor.`,
        `En AI-assistent tar fram ett första utkast från ${p.era} kalkyler, prislistor och tidigare liknande uppdrag.`,
        "Offerten granskas och godkänns i mobilen och skickas för digital signering.",
        `Obesvarade offerter följs upp automatiskt. Vid ja skapas ordern direkt${k.ekonomi ? ` i ${k.ekonomi}` : ""} och i planeringen.`,
        `${stor(ledning(k))} ser hitrate, snittvärde och vilka offerter som väntar på svar.`,
      ],
      slipper: "Offertskrivande på kvällarna och affärer som dör i tystnad.",
    };
  },

  fakturor: (k) => ({
    rubrik: `Fakturering som går av sig själv — från utfört arbete till betalt`,
    steg: [
      `Tid och material rapporteras i mobilen och kopplas automatiskt till rätt ${k.ord.kund}.`,
      `Fakturaunderlaget sammanställs och skapas i ${ekonomi(k)}${k.rut ? ", med RUT/ROT-avdraget ifyllt" : ""}.`,
      "Avvikelser — saknade timmar, fel pris, dubbletter — flaggas innan fakturan går iväg.",
      "Betalningar stäms av mot banken, och påminnelser går ut automatiskt.",
      `${stor(ledning(k))} ser fakturerat, obetalt och likviditet i realtid.`,
    ],
    slipper: "Att jaga underlag i efterhand, och pengar som blir liggande.",
  }),

  bokforing: (k) => ({
    rubrik: "Ekonomi utan pappershögar",
    steg: [
      "Kvitton och leverantörsfakturor fångas upp automatiskt från mejl, mobil och leverantörsportaler.",
      "En AI läser av underlaget, konterar och föreslår attest — ni godkänner med ett klick.",
      `Allt bokförs i ${ekonomi(k)}, kopplat till rätt projekt och kostnadsställe.`,
      "Saknade underlag och avvikelser flaggas löpande, inte vid bokslutet.",
      "Månadsrapporten tas fram automatiskt och kommer på mejlen.",
    ],
    slipper: "Kvittojakt, manuell kontering och stressen före varje bokslut.",
  }),

  schema: (k) => ({
    rubrik: "Bemanning som planerar sig själv",
    steg: [
      "Bemanningen föreslås automatiskt utifrån bokningar, kompetens och tillgänglighet.",
      "Personalen ser sitt schema, byter pass och sjukanmäler sig i en app.",
      "Luckor fylls genom att passet erbjuds direkt till den som kan och får.",
      "Arbetad tid rapporteras på plats och förs vidare till lön och fakturering.",
      `${stor(ledning(k))} ser beläggning och övertid per vecka i en översikt.`,
    ],
    slipper: "Att pussla om schemat varje vecka, och sms-kedjor om vem som kan jobba.",
  }),

  "nya-kunder": (k) => ({
    rubrik: "En säljmotor som hittar, förbereder och följer upp",
    steg: [
      "Vi bestämmer tillsammans vilka kunder som är rätt — bransch, storlek, område, signaler som att de växer.",
      "Varje vecka tas en lista fram på företag som passar, med rätt beslutsfattare och kontaktuppgifter.",
      "Varje företag kommer med en kort analys, så att första kontakten blir personlig.",
      "Uppföljningen går ut automatiskt om ingen svarar, och den som visar intresse flaggas direkt.",
      `Allt loggas ${k.crm ? "i ert CRM" : "i ett CRM"}, och ni ser hela säljtratten i en översikt.`,
    ],
    slipper: "Googlande, kalla listor och uppföljningar som glöms bort.",
  }),

  marknad: (k) => {
    const p = pron(k);
    return {
      rubrik: "Marknadsföring som drivs av er egen data",
      steg: [
        `Färdiga ${k.ord.jobb === "jobb" ? "jobb" : "uppdrag"}, bilder och omdömen samlas in automatiskt.`,
        "Inlägg, nyhetsbrev och annonser tas fram i er ton, anpassade för varje kanal.",
        `Utskicken riktas till rätt ${k.ord.kunder} — de som inte hört av sig på länge, eller som köpt något liknande.`,
        `Allt schemaläggs, och ${p.ni} godkänner med ett klick.`,
        "En översikt visar vilka kanaler som faktiskt ger förfrågningar och affärer.",
      ],
      slipper: "Att komma på vad ni ska skriva — och att inte veta vad som fungerar.",
    };
  },

  aterkommande: (k) => ({
    rubrik: `${stor(k.ord.kunder)} som kommer tillbaka — av sig själva`,
    steg: [
      `Efter ${k.ord.jobbet} går en fråga om omdöme ut vid rätt tidpunkt, och den som inte är nöjd hamnar hos er först.`,
      `När det är dags för ${k.ord.nastaGang} får ${k.ord.kunden} en personlig påminnelse med bokningslänk.`,
      `${stor(k.ord.kunder)} delas in efter historik, så att erbjudanden och utskick träffar rätt.`,
      `${stor(k.ord.kunder)} som inte hört av sig på länge får ett eget meddelande.`,
      `${stor(ledning(k))} ser hur stor andel som kommer tillbaka, och vad som får dem att göra det.`,
    ],
    slipper: "Att komma ihåg vem som borde höra av sig — och kunder som tyst försvinner.",
  }),

  rapporter: (k) => ({
    rubrik: "Ledningsinformation i realtid",
    steg: [
      `Data hämtas automatiskt från ${system(k)} och samlas på ett ställe.`,
      "Nyckeltalen — försäljning, marginal, beläggning, obetalt — räknas ut direkt.",
      "Varje team ser sin egen vy, och ledningen ser helheten.",
      "Varje måndag kommer en sammanfattning i klartext med det viktigaste som hänt.",
      "Avvikelser flaggas direkt, innan de blir problem.",
    ],
    slipper: "Excel-bygget varje vecka, och beslut som fattas på gamla siffror.",
  }),

  dubbelregistrering: (k) => ({
    rubrik: "Ett flöde som binder ihop alla era system",
    steg: [
      `${stor(system(k))} kopplas ihop, så att en uppgift skrivs in en gång och finns överallt.`,
      `${stor(k.ord.kunder)}, ordrar, tider och fakturor synkas automatiskt, åt båda hållen.`,
      "Regler fångar fel direkt — dubbletter, saknade fält, avvikande belopp.",
      "Det som inte går att koppla via en integration sköts av en robot som gör exakt det en människa gjorde.",
      "En logg visar vad som flyttats, när och varför.",
    ],
    slipper: "Att skriva samma sak två eller tre gånger — och felen som följer med.",
  }),

  dokument: (k) => ({
    rubrik: "Avtal och dokument från utkast till arkiv",
    steg: [
      `Rätt mall väljs automatiskt och fylls i med uppgifterna om ${k.ord.kunden} som redan finns.`,
      "En AI granskar utkastet och markerar villkor som avviker från det vanliga.",
      "Dokumentet skickas för digital signering med BankID.",
      "Det signerade arkiveras på rätt ställe, kopplat till kund och uppdrag.",
      "Påminnelser går ut inför förnyelse och uppsägningstider.",
    ],
    slipper: "Kopiera-klistra i Word, jakt på underskrifter och avtal som löper ut obemärkt.",
  }),

  koll: (k) => ({
    rubrik: "Ett operativt nav för hela verksamheten",
    steg: [
      "Alla uppdrag och ärenden samlas på ett ställe, med status, ansvarig och deadline.",
      "Uppdrag fördelas automatiskt efter kompetens, plats och beläggning.",
      "Den som utför jobbet får allt i mobilen och rapporterar klart därifrån.",
      `${stor(k.ord.kunden)} får automatiska statusbesked, och ${ledning(k)} får en signal när något blir liggande.`,
      "En översikt visar läget i hela verksamheten i realtid.",
    ],
    slipper: "Frågor som ”hur går det med …?”, whiteboards och lappar som försvinner.",
  }),

  information: (k) => ({
    rubrik: "En AI-assistent som kan hela verksamheten",
    steg: [
      `Dokument, avtal, rutiner och data från ${system(k)} kopplas till en gemensam kunskapsbas.`,
      "Alla i teamet ställer frågor med egna ord och får svar med källa, direkt.",
      "Behörigheter följer med, så att var och en bara ser det de får se.",
      "Frågor som saknar bra svar samlas, så att luckorna i dokumentationen syns.",
      `${stor(ledning(k))} ser vad som efterfrågas mest — och var kunskapen sitter hos enskilda personer.`,
    ],
    slipper: "Att leta, fråga runt och vänta — och kunskap som försvinner när någon slutar.",
  }),

  arenden: (k) => ({
    rubrik: "Ärendeflöde där AI sorterar och förbereder",
    steg: [
      `Alla inkommande mejl, formulär och ärenden från ${k.ord.kunder}, leverantörer och kollegor samlas i ett flöde.`,
      "En AI läser varje ärende, sorterar det efter typ och brådska och hämtar det som behövs från era system.",
      "Ärendet går till rätt person eller team, med ett svarsutkast klart att skicka.",
      "Enkla ärenden — status, kopior, bekräftelser — besvaras automatiskt.",
      `${stor(ledning(k))} ser volymer, svarstider och vad som blir liggande i en översikt.`,
    ],
    slipper: "Delade inkorgar som ingen äger, och ärenden som faller mellan stolarna.",
  }),

  godkannande: (k) => ({
    rubrik: "Kontroll- och attestflöde utan flaskhalsar",
    steg: [
      "Underlag — fakturor, beställningar, avvikelser, dokument — fångas upp automatiskt när de kommer in.",
      "Varje underlag kontrolleras mot era regler: belopp, avtal, fält som saknas, dubbletter.",
      "Det som ska godkännas går till rätt person efter belopp och ansvar, och godkänns i mobilen.",
      "Påminnelser och eskalering sköts automatiskt, och varje beslut loggas.",
      `${stor(ledning(k))} ser var godkännanden väntar och hur lång tid varje steg tar.`,
    ],
    slipper: "Mejlkedjor om vem som ska godkänna, och fel som upptäcks för sent.",
  }),

  kontakter: (k) => ({
    rubrik: "Automatisk kommunikation genom hela flödet",
    steg: [
      `Varje händelse i verksamheten — ny order, ändrad tid, ${k.ord.jobbet} ${k.ord.klar} — kan trigga ett besked.`,
      `${stor(k.ord.kunder)} får statusuppdateringar i rätt kanal, utan att någon skriver dem.`,
      "Leverantörer får beställningar, avrop och påminnelser direkt från era system.",
      "Svar som kommer tillbaka kopplas till rätt ärende och rätt person.",
      `${stor(ledning(k))} ser vad som skickats, vad som besvarats och vad som väntar.`,
    ],
    slipper: "Att vara spindeln i nätet för varje besked mellan kunder, leverantörer och kollegor.",
  }),

  rut: () => ({
    rubrik: "RUT/ROT helt utan handpåläggning",
    steg: [
      "Uppgifterna som behövs för avdraget samlas in redan vid bokning.",
      "Underlaget skapas vid fakturering och kontrolleras mot regelverket.",
      "Ansökan skickas till Skatteverket i rätt format, för alla ärenden på en gång.",
      "Utbetalningar stäms av automatiskt, och avslag flaggas med orsak.",
    ],
    slipper: "Skatteverkets filer, manuell avstämning och avslag som upptäcks för sent.",
  }),
};

// ── Kedjor ──────────────────────────────────────────────────────────────────
// När flera valda områden hänger ihop är det i överlämningarna tiden
// försvinner. Då föreslår vi hela flödet från början till slut i stället för
// bitar — det är där Khyte gör störst skillnad.

export type Kedja = {
  id: string;
  /** Områden som ingår. Minst två måste vara med i svaren. */
  omraden: readonly string[];
  /** Minst ett av dessa måste vara med — annars är det inte den här kedjan. */
  karna: readonly string[];
  flode: (k: Sammanhang) => Flode;
  forstaSteget: string;
  /** Vad hela flödet betyder för företaget. Se Omrade.affarsnytta. */
  affarsnytta: string;
  /** Vad det kostar affären i dag. Se Omrade.konsekvens. */
  konsekvens: string;
  /** När fas 2 i planen är klar — något verksamheten märker. */
  klartNar: string;
  /** Flaskhalsen i en fras, för kontrollfrågan. Se Omrade.diagnos. */
  diagnos: string;
};

export const KEDJOR: readonly Kedja[] = [
  {
    id: "offert-till-betalning",
    omraden: ["offerter", "fakturor", "bokforing", "dubbelregistrering", "koll", "godkannande", "rut"],
    karna: ["offerter", "fakturor"],
    flode: (k) => ({
      rubrik: "Från förfrågan till betald faktura — utan en enda överlämning",
      steg: [
        "Förfrågningar via telefon, mejl och formulär fångas på ett ställe, med de uppgifter som behövs för att räkna redan ifyllda.",
        `Offerten byggs från ${pron(k).era} kalkyler och priser och godkänns i mobilen.`,
        `Säger ${k.ord.kunden} ja skapas uppdraget automatiskt i planeringen${k.system.length ? ` och i ${system(k)}` : ""}.`,
        `Tid och material rapporteras i mobilen, och fakturan skapas i ${ekonomi(k)} när ${k.ord.jobbet} är ${k.ord.klar}${k.rut ? ", med RUT/ROT-avdraget ifyllt" : ""}.`,
        `Betalningar stäms av automatiskt, och ${ledning(k)} ser offerter, pågående arbeten och obetalt i en översikt.`,
      ],
      slipper: "Överlämningarna mellan offert, planering och ekonomi — och allt som faller mellan stolarna där.",
    }),
    affarsnytta:
      "Kortare tid från förfrågan till betalning, fler affärer per person och ett kassaflöde som går att lita på.",
    konsekvens:
      "Varje överlämning mellan offert, planering och faktura gör att affärer tar längre tid att vinna och att pengarna kommer in senare.",
    klartNar:
      "Klart när en förfrågan kan gå hela vägen till betald faktura utan att något skrivs in två gånger.",
    forstaSteget:
      "Rita upp vägen från första kontakt till betald faktura, och markera varje ställe där något skrivs in för hand.",
    diagnos: "överlämningarna mellan offert, planering och faktura",
  },
  {
    id: "forfragan-till-aterkommande",
    omraden: ["samtal", "bokning", "aterkommande", "marknad", "arenden", "kontakter"],
    karna: ["samtal", "bokning"],
    flode: (k) => ({
      rubrik: `Varje ${k.ord.kund} fångas upp, bokas in och kommer tillbaka`,
      steg: [
        "Samtal, sms, mejl och formulär landar i en gemensam inkorg — ingen förfrågan blir liggande.",
        "Varje förfrågan får svar direkt med en länk för att boka, och det som kräver en människa går vidare till rätt person.",
        `Bokningen hamnar i ${kalender(k)}, med påminnelse dagen innan.`,
        `Efter ${k.ord.jobbet} går en fråga om omdöme ut, och när det är dags för ${k.ord.nastaGang} får ${k.ord.kunden} en inbjudan att boka igen.`,
        `${stor(ledning(k))} ser hur många förfrågningar som kommer in, hur snabbt de besvaras och hur många som blir ${k.ord.kunder}.`,
      ],
      slipper: `Missade samtal, tomma tider och ${k.ord.kunder} som aldrig kommer tillbaka.`,
    }),
    affarsnytta:
      "Fler förfrågningar blir kunder, och fler kunder kommer tillbaka — tillväxt utan fler säljtimmar.",
    konsekvens:
      "Förfrågningar som inte fångas upp direkt och kunder som inte påminns är affärer som går till någon annan.",
    klartNar:
      "Klart när varje förfrågan får svar direkt och kunderna påminns utan att någon behöver komma ihåg det.",
    forstaSteget:
      "Räkna en vecka: hur många förfrågningar kom in, hur många blev bokningar, och hur många fick aldrig svar?",
    diagnos: "förfrågningar och kunder som inte följs upp hela vägen",
  },
  {
    id: "lead-till-affar",
    omraden: ["nya-kunder", "offerter", "samtal", "marknad"],
    karna: ["nya-kunder"],
    flode: (k) => ({
      rubrik: "En säljmotor som går även när ni inte hinner",
      steg: [
        "Varje vecka tas en lista fram på företag som passar er, med rätt kontaktperson och en kort analys av varje.",
        "Första kontakten förbereds personligt, och uppföljningen går ut automatiskt om ingen svarar.",
        `Den som visar intresse hamnar ${k.crm ? "i ert CRM" : "i ett CRM"} med all historik, och ni får en signal när det är dags att ringa.`,
        "Offerten byggs från mallar med uppgifterna som redan finns, och följs upp tills ni får ett ja eller nej.",
        "En översikt visar hela säljtratten — från lista till signerad affär.",
      ],
      slipper: "Kalla listor, glömda uppföljningar och säljarbete som bara händer när det är lugnt.",
    }),
    affarsnytta:
      "En säljpipeline som växer av sig själv, i stället för att hänga på att någon har tid över.",
    konsekvens:
      "När säljarbetet bara händer när det finns tid över blir tillväxten ryckig och beroende av enskilda personer.",
    klartNar:
      "Klart när nya företag kommer in i säljtratten varje vecka, även de veckor ni är fullt upptagna.",
    forstaSteget:
      "Beskriv er drömkund i tre meningar. Det är grunden för hela säljmotorn.",
    diagnos: "att nya affärer bara jagas när det finns tid över",
  },
  {
    id: "drift-och-overblick",
    omraden: ["koll", "schema", "rapporter", "dubbelregistrering", "dokument", "bokning", "information", "godkannande", "arenden", "kontakter"],
    karna: ["koll", "schema", "rapporter", "dubbelregistrering", "information"],
    flode: (k) => ({
      rubrik: "En verksamhet där alla ser samma sak — i realtid",
      steg: [
        `Uppdrag, ärenden och scheman samlas i ett system som pratar med ${system(k)}.`,
        "Den som ska utföra något får det i mobilen, med allt som behövs — och status uppdateras när det görs.",
        "Uppgifter skrivs in en gång och förs vidare automatiskt, till ekonomi, dokument och rapporter.",
        "Avvikelser — något som blir liggande, ett pass som saknas, ett avtal som inte är signerat — flaggas direkt.",
        `${stor(ledning(k))} får en översikt över beläggning, status och nyckeltal som alltid är uppdaterad.`,
      ],
      slipper: "Dubbelarbete, statusfrågor och beslut som fattas på magkänsla.",
    }),
    affarsnytta:
      "Ett företag som kan växa utan att administrationen växer i samma takt — och där ledningen styr på fakta.",
    // Allmän: kedjan kan väljas för uppföljning och rapporter även när
    // systemen i sig fungerar bra.
    konsekvens:
      "När status, siffror och uppgifter hålls ihop för hand blir uppföljningen långsammare och verksamheten beroende av enskilda personer.",
    klartNar:
      "Klart när ledningen och alla i teamet ser status på varje uppdrag i realtid, utan att någon behöver fråga.",
    forstaSteget:
      "Lista alla ställen där ni i dag håller koll på jobb, scheman och siffror. Det brukar vara fler än man tror.",
    diagnos: "information som flyttas för hand mellan system",
  },
];

// ── Planen ──────────────────────────────────────────────────────────────────
// Tre faser ovanför förslagen. Signalerar att vi tänker helhet, inte prylar.

export const PLANFASER = {
  fas1: {
    rubrik: "Snabb vinst",
    // vad = en uppgift ur Omrade.uppgift: "slippa jaga betalningar".
    text: (vad: string, verktyg: string | null) =>
      `Vi börjar där ni får tillbaka mest tid snabbast — att slippa ${vad}${verktyg ? `, byggt på ${verktyg} som ni redan har` : ""}.`,
  },
  fas2: {
    rubrik: "Koppla ihop",
    text: (vad: string) => `Sedan binder vi ihop flödena: ${vad}.`,
    textUtanKedja: (k: Sammanhang) =>
      `Sedan kopplar vi ihop ${uppraknat(k.system)}, så att inget skrivs in två gånger.`,
    klartUtanKedja: (k: Sammanhang) =>
      `Klart när varje uppgift skrivs in på ett ställe och förs vidare till ${uppraknat(k.system)} av sig själv.`,
  },
  fas3: {
    rubrik: "AI och överblick",
    // Delarna väljs efter vad verksamheten behöver — se byggPlan.
    ai: "AI som sorterar inkommande förfrågningar och lägger fram ett svarsutkast",
    overblick: (k: Sammanhang) => `en översikt där ${ledning(k)} ser verksamheten i realtid`,
    text: (delar: string[]) => `Till sist ${uppraknat(delar)}.`,
    klartAi: "Klart när inkommande förfrågningar är sorterade och har ett svarsutkast innan någon öppnar dem.",
    klartOverblick: (k: Sammanhang) =>
      `Klart när ${ledning(k)} följer verksamheten i översikten i stället för i Excel eller på känsla.`,
  },
} as const;

/**
 * Områden där AI-assistent respektive överblick gör skillnad. Fas 3 i planen
 * tas bara med när verksamheten har något av dem — den pressas inte in.
 */
export const AI_OMRADEN: readonly string[] = ["samtal", "bokning", "arenden", "information"];
export const OVERBLICK_OMRADEN: readonly string[] = ["rapporter", "koll", "dubbelregistrering", "schema", "godkannande"];

// ── Tillväxt ────────────────────────────────────────────────────────────────

/**
 * Tillväxtidéer: förslag som inte sparar tid utan tar in affärer. Används
 * när målet är "Få fler förfrågningar" och svaren inte redan pekar på något
 * som tar in kunder. Inga siffror, samma regler som flödena ovan.
 *
 * De minsta företagen (upp till fem) får "fånga fler förfrågningar" — brett,
 * utan att lova en ny hemsida vi inte vet att de behöver. Större företag får
 * prospektering och kundbas — tillväxt i deras storlek. Ingen chatbot, för
 * någon storlek: den ger för lite nytta att sälja.
 */
export type Tillvaxtide = {
  id: string;
  /** Storlekarna idén passar för. */
  nivaer: readonly Niva[];
  flode: (k: Sammanhang) => Flode;
  /** Vad idén betyder för företaget. Se Omrade.affarsnytta. */
  affarsnytta: string;
  forstaSteget: string;
  /** Förslag vars text matchar täcker redan idén — då läggs den inte till. */
  liknar: RegExp;
  /** Flaskhalsen i en fras, för kontrollfrågan. Se Omrade.diagnos. */
  diagnos: string;
};

export const TILLVAXT: readonly Tillvaxtide[] = [
  {
    id: "prospektering",
    nivaer: ["mellan", "stor"],
    // Resultatet, inte metoden — vilka kanaler som passar avgörs i samtalet.
    flode: (k) => ({
      rubrik: "Ett systematiskt flöde för prospektering och uppföljning",
      steg: [
        "Det blir tydligt vilka kunder ni vill ha fler av, och vem hos dem som fattar beslutet.",
        "Vilka kanaler som passar — egna listor, nätverk, annonser eller uppsökande — avgör vi tillsammans.",
        `Varje kontakt och offert följs upp i tid${k.crm ? " i ert CRM" : ""}, så att inget lead blir liggande.`,
        "Ledningen ser varje vecka var affärerna står och vad som ger resultat.",
      ],
      slipper: "Sälj som bara blir av när det finns tid över, och leads som kallnar.",
    }),
    affarsnytta:
      "En jämn ström av nya affärer som inte hänger på att säljarna hinner.",
    forstaSteget:
      "Beskriv er bästa kund: bransch, storlek och vem som fattar beslutet.",
    liknar: /prospekter|säljmotor|säljtratt/i,
    diagnos: "för få nya affärer i rörelse samtidigt",
  },
  {
    id: "kundbasen",
    nivaer: ["mellan", "stor"],
    flode: (k) => ({
      rubrik: `Mer affärer från de ${k.ord.kunder} ni redan har`,
      steg: [
        `Alla ${k.ord.kunder} samlas på ett ställe med historik: vad de köpt, när och hur ofta.`,
        `När det är dags för ${k.ord.nastaGang} får ${k.ord.kunden} ett personligt erbjudande vid rätt tidpunkt.`,
        `${stor(k.ord.kunder)} som inte hört av sig på ett tag fångas upp innan de glider iväg, och ansvarig får en signal.`,
        `Ledningen ser återköp, merförsäljning och vilka ${k.ord.kunder} som riskerar att försvinna.`,
      ],
      slipper: `${stor(k.ord.kunder)} som tyst går vidare utan att någon märker det.`,
    }),
    affarsnytta:
      "Mer intäkter från kunderna ni redan har — den billigaste tillväxten som finns.",
    forstaSteget:
      "Ta fram listan på kunder som inte hört av sig det senaste året.",
    liknar: /återköp|kundbas|merförsäljning/i,
    diagnos: "att befintliga kunder inte följs upp och köper igen",
  },
  {
    // Bredare än "en ny hemsida": vi vet inte om de har en, om den har
    // trafik eller var förfrågningarna tappas. Det avgörs i samtalet.
    id: "fanga-forfragningar",
    // Alla storlekar: texten lovar ingen hemsida, bara att förfrågningarna fångas.
    nivaer: ["liten", "mellan", "stor"],
    flode: (k) => {
      const p = pron(k);
      return {
        rubrik: "Fånga fler förfrågningar — och låt ingen bli liggande",
        steg: [
          `Vi går igenom var förfrågningarna kommer in i dag — telefon, mejl, formulär, sociala medier — och var de tappas.`,
          "Varje väg in leder till ett tydligt nästa steg: boka, be om offert eller ställa en fråga.",
          `Varje förfrågan landar på ett ställe, och ${k.ord.kunden} får bekräftelse direkt med när ${p.ni} hör av ${p.er}.`,
          `${p.Ni} ser vilka kanaler som ger förfrågningar — och vad som behöver bli bättre för att fler ska höra av sig.`,
        ],
        slipper: "Förfrågningar som försvinner på vägen, och kanaler som kostar utan att ge något.",
      };
    },
    affarsnytta:
      "Fler av dem som redan letar efter er hör av sig — och ingen förfrågan går förlorad.",
    forstaSteget:
      "Räkna en månad: hur många förfrågningar kom in, och varifrån kom de?",
    liknar: /fånga fler förfrågningar|hemsida|webbplats/i,
    diagnos: "förfrågningar som försvinner på vägen in",
  },
];
