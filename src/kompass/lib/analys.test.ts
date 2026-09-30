import { describe, expect, it } from "vitest";
import {
  BRANSCH,
  FRAGA,
  MAL,
  MONSTER,
  OMRADEN,
  OMRADESNYCKEL,
  VERKTYG,
  type Bransch,
} from "@/kompass/data/kompass";
import { FLODEN, FLODEN_AVANCERAD, TILLVAXT, ordFor } from "@/kompass/data/floden";
import {
  MINSTA_KRONOR_ATT_NAMNA,
  analysRader,
  byggSammanhang,
  diagnosFor,
  omradeForFritext,
  tjansterText,
} from "@/kompass/lib/analys";
import {
  kontrolleraAiAnalys,
  kontrolleraMotSvar,
  otillatenText,
  type AiForslag,
} from "@/kompass/lib/ai-typer";
import { tolkaForslag } from "@/kompass/lib/forslagstext";
import { raknaUtResultat } from "@/kompass/lib/matchning";
import { byggSammanfattning } from "@/kompass/lib/sammanfattning";
import type { Svar } from "@/kompass/lib/typer";

/** Mönstret på frågan "Vad görs fortfarande för hand?" för ett område. */
const monster = (omrade: string) =>
  MONSTER.find((m) => m.omrade === omrade || m.kundbokning === omrade || m.storre === omrade)!.text;

/** En hantverkare med Fortnox som gått hela vägen. */
const HANTVERKARE: Svar = {
  [FRAGA.bransch]: BRANSCH.hantverk,
  [FRAGA.antal]: "2–9",
  [FRAGA.roll]: "Ägare eller VD",
  [FRAGA.missadeSamtal]: "6–15",
  [FRAGA.kundvarde]: "5 000–50 000 kr",
  [FRAGA.tidstjuvar]: [monster("offerter"), monster("fakturor")],
  [OMRADESNYCKEL.tid("offerter")]: "5–10 h",
  [OMRADESNYCKEL.tid("fakturor")]: "2–5 h",
  [FRAGA.konsekvens]: "Kunder eller affärer påverkas",
  [FRAGA.verktyg]: [VERKTYG.fortnox, VERKTYG.excel],
};

const forslag = (svar: Svar) => raknaUtResultat(svar).forslag;

describe("förslagen", () => {
  it("är alltid tre — en kedja först när valda områden hänger ihop", () => {
    const f = forslag(HANTVERKARE);
    // Offerter + fakturor blir ett flöde från förfrågan till betalning.
    expect(f.map((x) => x.id)).toEqual(["kedja-offert-till-betalning", "samtal", "rut"]);
    expect(f.map((x) => x.kalla)).toEqual(["valt", "signal", "bransch"]);
    expect(f[0].omraden?.map((o) => o.id)).toEqual(["offerter", "fakturor"]);
  });

  it("summerar kedjans tid över områdena", () => {
    const [kedja] = forslag(HANTVERKARE);
    expect(kedja.lagt).toEqual({ min: 7, max: 15 });
    expect(kedja.besparing).toEqual({ min: 2, max: 9 });
  });

  it("grundar varför-texten i deras egna svar", () => {
    const [kedja, samtal] = forslag(HANTVERKARE);
    expect(kedja.varfor).toContain("7–15 timmar i veckan");
    expect(kedja.varfor).toContain("offerter, order och underlag samt fakturor och betalningar");
    expect(samtal.varfor).toContain("6–15 samtal i veckan");
  });

  it("använder deras verktyg i flödet", () => {
    const [kedja] = forslag(HANTVERKARE);
    expect(kedja.steg.join(" ")).toContain("Fortnox");
  });

  it("föreslår enskilda områden när inget hänger ihop", () => {
    const f = forslag({
      ...HANTVERKARE,
      [FRAGA.missadeSamtal]: "1–5",
      [FRAGA.tidstjuvar]: [monster("offerter"), monster("dokument")],
      [OMRADESNYCKEL.tid("dokument")]: "2–5 h",
    });
    expect(f.map((x) => x.id)).toEqual(["offerter", "dokument", "fakturor"]);
  });

  it("säger vad som händer när det inte fungerar — för det första området", () => {
    const f = forslag({
      ...HANTVERKARE,
      [FRAGA.missadeSamtal]: "1–5",
      [FRAGA.tidstjuvar]: [monster("offerter"), monster("dokument")],
      [OMRADESNYCKEL.tid("dokument")]: "2–5 h",
    });
    expect(f[0].varfor).toContain("När det inte fungerar påverkas kunder och affärer.");
    expect(f[1].varfor).not.toContain("När det inte fungerar");
  });

  it("nämner pengar bara för samtal, och bara när det är tydligt", () => {
    const f = forslag(HANTVERKARE);
    expect(f.find((x) => x.id === "samtal")?.pengar).toContain("kr i månaden");
    expect(f.filter((x) => x.pengar)).toHaveLength(1);

    const litetVarde = forslag({ ...HANTVERKARE, [FRAGA.kundvarde]: "Under 5 000 kr" });
    expect(litetVarde.some((x) => x.pengar)).toBe(false);

    const okantVarde = forslag({ ...HANTVERKARE, [FRAGA.kundvarde]: "Vet inte" });
    expect(okantVarde.some((x) => x.pengar)).toBe(false);
    expect(MINSTA_KRONOR_ATT_NAMNA).toBeGreaterThan(0);
  });

  it("ger arbetsflödet sista platsen när de skrivit något", () => {
    const f = forslag({ ...HANTVERKARE, [FRAGA.fritext]: "Jaga betalningar" });
    expect(f).toHaveLength(3);
    expect(f[2].kalla).toBe("onskemal");
    expect(f[2].varfor).toBe("Jaga betalningar");
    // Det svagaste av de tre förslagen fick maka på sig.
    expect(f.map((x) => x.id)).toEqual(["kedja-offert-till-betalning", "samtal", "onskemal"]);
  });

  it("fyller på med branschens vanligaste när svaren inte räcker — utan siffror", () => {
    const f = forslag({
      [FRAGA.bransch]: BRANSCH.vard,
      [FRAGA.mal]: MAL.effektivitet,
      [FRAGA.tidstjuvar]: [monster("bokning")],
      [OMRADESNYCKEL.tid("bokning")]: "5–10 h",
    });
    expect(f.map((x) => x.id)).toEqual(["bokning", "aterkommande", "samtal"]);
    expect(f[1].kalla).toBe("bransch");
    expect(f[1].besparing).toBeUndefined();
    expect(f[1].pengar).toBeUndefined();
    expect(f[1].varfor).toContain("kliniker och mottagningar");
  });

  it("fyller på med det målet pekar på före branschens vanligaste", () => {
    const f = forslag({
      [FRAGA.bransch]: BRANSCH.vard,
      [FRAGA.mal]: MAL.service,
      [FRAGA.tidstjuvar]: [monster("bokning")],
      [OMRADESNYCKEL.tid("bokning")]: "5–10 h",
    });
    expect(f.map((x) => x.id)).toEqual(["bokning", "samtal", "arenden"]);
    expect(f[1].kalla).toBe("signal");
    expect(f[2].varfor).toContain("det som skulle göra störst skillnad är att ge era kunder snabbare svar");
  });

  it("föreslår aldrig RUT/ROT utanför städ och hantverk", () => {
    const f = forslag({ [FRAGA.bransch]: BRANSCH.vard });
    expect(f.some((x) => x.id === "rut")).toBe(false);
  });

  it("talar branschens språk", () => {
    const f = forslag({
      [FRAGA.bransch]: BRANSCH.vard,
      [FRAGA.missadeSamtal]: "Fler än 15",
      [FRAGA.tidstjuvar]: [monster("bokning")],
      [OMRADESNYCKEL.tid("bokning")]: "2–5 h",
    });
    const text = f.map((x) => [x.rubrik, ...x.steg, x.slipper].join(" ")).join(" ");
    expect(text).toContain("patient");
    expect(text).not.toMatch(/\bkunder\b/);
  });

  it("skriver du till den som är ensam", () => {
    const f = forslag({ ...HANTVERKARE, [FRAGA.antal]: "Bara jag" });
    expect(f[0].varfor.startsWith("Du lägger")).toBe(true);
  });
});

describe("flödesmallarna", () => {
  // Varje kombination av bransch, du/ni och verktyg ska ge hela meningar —
  // aldrig "undefined", "null" eller dubbla mellanslag från en tom variabel.
  it("ger hela meningar för alla branscher och områden, i båda storlekarna", () => {
    const verktygsval = [[], [VERKTYG.fortnox, VERKTYG.google, VERKTYG.crm], [VERKTYG.bransch]];
    for (const bransch of Object.values(BRANSCH) as Bransch[]) {
      for (const antal of ["Bara jag", "10–49"]) {
        for (const verktyg of verktygsval) {
          const k = byggSammanhang({
            [FRAGA.bransch]: bransch,
            [FRAGA.antal]: antal,
            [FRAGA.verktyg]: verktyg,
          });
          for (const omrade of OMRADEN) {
            for (const mallar of [FLODEN, FLODEN_AVANCERAD]) {
              const flode = (mallar[omrade.id] ?? FLODEN[omrade.id])?.(k);
              expect(flode, `saknar flöde för ${omrade.id}`).toBeDefined();
              const text = [flode.rubrik, ...flode.steg, flode.slipper].join(" ");
              expect(text, `${bransch}/${omrade.id}`).not.toMatch(/undefined|null|\s{2,}/);
              expect(flode.steg.length, omrade.id).toBeGreaterThanOrEqual(3);
            }
          }
        }
      }
    }
  });

  it("har egna ord för alla branscher utom Annat", () => {
    for (const bransch of Object.values(BRANSCH) as Bransch[]) {
      if (bransch === BRANSCH.annat) continue;
      expect(ordFor(bransch).foretag, bransch).not.toBe("småföretag");
    }
  });
});

describe("tolkaForslag", () => {
  it("delar upp Claudes svar i sammanfattning och steg", () => {
    const t = tolkaForslag(
      "Fakturorna skapas direkt när jobbet är klart.\n- Du markerar jobbet som klart.\n- Fakturan skapas i Fortnox.\n- Påminnelse går ut vid förfall.",
    );
    expect(t.sammanfattning).toBe("Fakturorna skapas direkt när jobbet är klart.");
    expect(t.steg).toHaveLength(3);
    expect(t.steg[1]).toBe("Fakturan skapas i Fortnox.");
  });

  it("klarar ett svar utan steg", () => {
    const t = tolkaForslag("Bara en mening.");
    expect(t).toEqual({ sammanfattning: "Bara en mening.", steg: [] });
  });
});

describe("analysRader", () => {
  it("bygger raderna av deras svar", () => {
    const rader = analysRader(HANTVERKARE);
    expect(rader[0]).toBe("Läser 10 svar");
    expect(rader[1]).toBe("Hittar var arbetet fastnar: skriva offerter och jaga betalningar");
    expect(rader[2]).toBe("Bygger tre förslag för er");
  });

  it("skriver dig till den som är ensam", () => {
    const rader = analysRader({
      [FRAGA.antal]: "Bara jag",
      [FRAGA.bransch]: BRANSCH.stad,
      [FRAGA.tidstjuvar]: [monster("fakturor")],
    });
    expect(rader[1]).toBe("Hittar var arbetet fastnar: jaga betalningar");
    expect(rader[2]).toBe("Bygger tre förslag för dig");
  });
});

/** Ett byggbolag med 50+ anställda — den stora skalan. */
const BYGGBOLAG: Svar = {
  [FRAGA.bransch]: BRANSCH.hantverk,
  [FRAGA.antal]: "50 eller fler",
  // Dokument och fakturor, lika mycket tid. Inget av dem bildar en kedja.
  [FRAGA.tidstjuvar]: [monster("dokument"), monster("fakturor")],
  [OMRADESNYCKEL.tid("dokument")]: "20–40 h",
  [OMRADESNYCKEL.tid("fakturor")]: "20–40 h",
  [FRAGA.verktyg]: [VERKTYG.fortnox, VERKTYG.bransch, VERKTYG.excel],
};

/** Uppföljning och system — kedjan för drift och överblick. */
const DRIFT: Svar = {
  [FRAGA.bransch]: BRANSCH.hantverk,
  [FRAGA.antal]: "50 eller fler",
  [FRAGA.tidstjuvar]: [monster("koll"), monster("dubbelregistrering")],
  [OMRADESNYCKEL.tid("koll")]: "20–40 h",
  [OMRADESNYCKEL.tid("dubbelregistrering")]: "20–40 h",
  [FRAGA.verktyg]: [VERKTYG.fortnox, VERKTYG.bransch, VERKTYG.excel],
};

describe("storlek", () => {
  it("vikten efter storlek avgör ordningen när tiden är lika", () => {
    // Ett stort bolag vinner mer på fakturaflödet; för ett litet väger de lika.
    expect(forslag(BYGGBOLAG)[0].id).toBe("fakturor");
    expect(forslag({ ...BYGGBOLAG, [FRAGA.antal]: "2–9" })[0].id).toBe("dokument");
  });

  it("uttrycker tiden i tjänster", () => {
    const [forsta] = forslag(BYGGBOLAG);
    expect(forsta.tjanster).toMatch(/heltidstjänst/);
    // Ett litet företag får timmar, inte tjänster.
    expect(forslag(HANTVERKARE)[0].tjanster).toBeUndefined();
  });

  it("får de avancerade flödena", () => {
    const f = forslag(BYGGBOLAG);
    expect(f.find((x) => x.id === "fakturor")?.steg.length).toBe(5);
  });

  it("tjansterText skalar", () => {
    expect(tjansterText({ min: 10, max: 30 }, "stor")).toBe("motsvarar ungefär en halv heltidstjänst");
    expect(tjansterText({ min: 30, max: 50 }, "mellan")).toBe("motsvarar ungefär en heltidstjänst");
    expect(tjansterText({ min: 60, max: 100 }, "stor")).toBe("motsvarar ungefär 2 heltidstjänster");
    expect(tjansterText({ min: 1, max: 3 }, "stor")).toBeUndefined();
    expect(tjansterText({ min: 30, max: 50 }, "liten")).toBeUndefined();
  });
});

describe("planen", () => {
  it("har tre faser och nämner kedjan i fas två", () => {
    const plan = raknaUtResultat(HANTVERKARE).plan;
    expect(plan.map((p) => p.rubrik)).toEqual(["Snabb vinst", "Koppla ihop", "AI och överblick"]);
    expect(plan[1].text).toContain("från förfrågan till betald faktura");
  });
});

describe("AI-analysen", () => {
  const ai = {
    hypotes: "Offerterna verkar vara flaskhalsen, och de hänger ihop med faktureringen.",
    forslag: [
      {
        omraden: ["offerter", "fakturor", "koll"],
        rubrik: "Ett flöde från offert till betalning",
        affarsnytta: "Snabbare kassaflöde och fler affärer per person.",
        varfor: "Offerter och fakturor görs för hand och hänger ihop.",
        steg: ["Ett.", "Två.", "Tre.", "Fyra."],
        slipper: "Dubbelarbetet.",
        forsta_steget: "Rita upp flödet.",
      },
      {
        omraden: ["samtal"],
        rubrik: "Inga fler missade samtal",
        affarsnytta: "Fler förfrågningar blir affärer.",
        varfor: "Ni missar många samtal.",
        steg: ["Ett.", "Två.", "Tre."],
        slipper: "Återuppringningar.",
        forsta_steget: "Räkna samtalen.",
      },
      {
        omraden: ["rapporter"],
        rubrik: "Översikt i realtid",
        affarsnytta: "Beslut på aktuella siffror.",
        varfor: "Ett steg längre.",
        steg: ["Ett.", "Två.", "Tre."],
        slipper: "Excel.",
        forsta_steget: "Välj en rapport.",
      },
    ],
    plan: [
      { rubrik: "Snabb vinst", text: "A." },
      { rubrik: "Koppla ihop", text: "B." },
      { rubrik: "AI och överblick", text: "C." },
    ],
  };

  it("används när den finns — men tiden räknas ur svaren", () => {
    const r = raknaUtResultat(HANTVERKARE, kontrolleraAiAnalys(ai));
    expect(r.kallaForslag).toBe("ai");
    expect(r.forslag[0].rubrik).toBe("Ett flöde från offert till betalning");
    // koll har inga svar — tiden kommer bara från offerter och fakturor.
    expect(r.forslag[0].lagt).toEqual({ min: 7, max: 15 });
    expect(r.forslag[1].pengar).toContain("kr i månaden");
    // Ett område utan svar alls blir "ett steg längre", utan siffror.
    expect(r.forslag[2].kalla).toBe("ide");
    expect(r.forslag[2].besparing).toBeUndefined();
    expect(r.plan[0].text).toBe("A.");
  });

  it("slänger förslag med siffror, okända områden eller för få steg", () => {
    const trasig = {
      ...ai,
      forslag: [
        { ...ai.forslag[0], varfor: "Ni lägger 20 h i veckan på det." },
        { ...ai.forslag[1], omraden: ["pizza"] },
        { ...ai.forslag[2], steg: ["Bara ett."] },
      ],
    };
    expect(kontrolleraAiAnalys(trasig)).toBeNull();
  });

  it("faller tillbaka på reglerna utan analys", () => {
    const r = raknaUtResultat(HANTVERKARE, null);
    expect(r.kallaForslag).toBe("regler");
    expect(r.forslag[0].id).toBe("kedja-offert-till-betalning");
  });

  it("en hypotes på femton ord ryms", () => {
    const hypotes =
      "Offerterna och fakturorna hänger ihop, och varje överlämning mellan dem gör att pengarna kommer in senare än de borde.";
    expect(kontrolleraAiAnalys({ ...ai, hypotes })?.hypotes).toBe(hypotes);
  });
});

describe("planens första fas", () => {
  it("ett större företag börjar i det starkaste området", () => {
    const plan = raknaUtResultat(BYGGBOLAG).plan;
    expect(plan[0].text).toContain("att slippa jaga betalningar");
  });

  it("ett större företag med en kedja börjar i kedjans starkaste område", () => {
    const plan = raknaUtResultat(DRIFT).plan;
    expect(plan[0].text).toContain("att slippa skriva in samma sak två gånger");
  });

  it("ett litet företag börjar med något vi har färdigt", () => {
    const plan = raknaUtResultat(HANTVERKARE).plan;
    expect(plan[0].text).toMatch(/att slippa (ringa tillbaka kunder|skriva offerter)/);
  });
});

describe("företagsperspektivet", () => {
  it("varje område och kedja säger vad det betyder för företaget", async () => {
    const { KEDJOR } = await import("@/kompass/data/floden");
    for (const o of OMRADEN) expect(o.affarsnytta.length, o.id).toBeGreaterThan(20);
    for (const k of KEDJOR) expect(k.affarsnytta.length, k.id).toBeGreaterThan(20);
  });

  it("alla förslag leder med affärsnyttan — utom arbetsflödet", () => {
    const f = forslag({ ...BYGGBOLAG, [FRAGA.fritext]: "Tidrapporter" });
    for (const x of f.filter((y) => y.kalla !== "onskemal")) {
      expect(x.affarsnytta, x.id).toBeTruthy();
    }
  });

  it("ett större företag får frigjord tid som tjänster", () => {
    const r = raknaUtResultat(BYGGBOLAG);
    expect(tjansterText(r.besparing, r.niva)).toMatch(/heltidstjänst/);
  });

  it("AI-förslag utan affärsnytta slängs", () => {
    const utan = {
      hypotes: "",
      forslag: [0, 1].map(() => ({
        omraden: ["offerter"],
        rubrik: "R",
        varfor: "V.",
        steg: ["Ett.", "Två.", "Tre."],
        slipper: "S.",
        forsta_steget: "F.",
      })),
      plan: [],
    };
    expect(kontrolleraAiAnalys(utan)).toBeNull();
  });
});

describe("AI-förslagen mot besökarens svar", () => {
  const forslagMall = (over: Partial<AiForslag>): AiForslag => ({
    omraden: ["offerter"],
    rubrik: "Ett förslag",
    affarsnytta: "Fler affärer.",
    varfor: "För att.",
    steg: ["Ett.", "Två.", "Tre."],
    slipper: "Dubbelarbete.",
    forsta_steget: "Börja här.",
    ...over,
  });
  const analys = (...forslag: AiForslag[]) => ({ hypotes: "", forslag, plan: [] });

  it("samma område i två förslag: det senare slängs, platsen fylls av reglerna", () => {
    const r = raknaUtResultat(
      HANTVERKARE,
      analys(
        forslagMall({ omraden: ["offerter", "fakturor"], rubrik: "Offert till betalning" }),
        forslagMall({ omraden: ["fakturor"], rubrik: "Bara fakturor" }),
      ),
    );
    const rubriker = r.forslag.map((f) => f.rubrik);
    expect(rubriker).toContain("Offert till betalning");
    expect(rubriker).not.toContain("Bara fakturor");
    // Ingen tid räknas två gånger: fakturor finns bara i ett förslag.
    const medFakturor = r.forslag.filter((f) =>
      (f.omraden ?? (f.omrade ? [f.omrade] : [])).some((o) => o.id === "fakturor"),
    );
    expect(medFakturor).toHaveLength(1);
    expect(r.forslag).toHaveLength(3);
  });

  it("slänger förslag som nämner verktyg de inte har, andra produkter eller casekunder", () => {
    for (const text of [
      "Allt synkas med Visma.", // HANTVERKARE har Fortnox och Excel, inte Visma
      "Leads hamnar i HubSpot.",
      "Precis som för Osteopaticentrum.",
    ]) {
      const r = raknaUtResultat(
        HANTVERKARE,
        analys(
          forslagMall({ omraden: ["offerter"], rubrik: "Med fel text", steg: ["Ett.", text, "Tre."] }),
          forslagMall({ omraden: ["samtal"], rubrik: "Ok förslag" }),
        ),
      );
      expect(r.forslag.map((f) => f.rubrik), text).not.toContain("Med fel text");
    }
  });

  it("godtar verktyg de har — och Google som omdömessajt", () => {
    const r = raknaUtResultat(
      HANTVERKARE,
      analys(
        forslagMall({ omraden: ["offerter"], rubrik: "Med Fortnox", steg: ["Ordern skapas i Fortnox.", "Omdöme på Google.", "Tre."] }),
        forslagMall({ omraden: ["samtal"], rubrik: "Ok förslag" }),
      ),
    );
    expect(r.forslag.map((f) => f.rubrik)).toContain("Med Fortnox");
  });

  it("otillatenText säger varför", () => {
    expect(otillatenText("Sparar 5 h i veckan", [])).toBe("siffror");
    expect(otillatenText("Kopplas till Outlook", [VERKTYG.fortnox])).toMatch(/verktyg/);
    expect(otillatenText("Kopplas till Outlook", [VERKTYG.microsoft])).toBeNull();
    expect(otillatenText("Som JaTack gjorde", [])).toMatch(/casenamn/);
  });
});

describe("pengar efter bransch", () => {
  it("räknar inga pengar för fastighet, hur många samtal de än missar", () => {
    const r = raknaUtResultat({
      ...HANTVERKARE,
      [FRAGA.bransch]: BRANSCH.fastighet,
      [FRAGA.missadeSamtal]: "Fler än 15",
    });
    expect(r.missadeAffarer).toBeUndefined();
    expect(r.forslag.some((f) => f.pengar)).toBe(false);
  });
});

describe("reserven för arbetsflödet", () => {
  it("pekar texten på ett område får arbetsflödet det flödet", () => {
    expect(omradeForFritext("Jaga obetalda fakturor", BRANSCH.hantverk)?.id).toBe("fakturor");
    expect(omradeForFritext("Lägga schemat varje vecka", BRANSCH.hotell)?.id).toBe("schema");
    const f = forslag({ ...HANTVERKARE, [FRAGA.fritext]: "Jaga obetalda fakturor" });
    const onskemal = f.find((x) => x.kalla === "onskemal");
    expect(onskemal?.steg.length).toBeGreaterThanOrEqual(3);
  });

  it("pekar den inte på något blir stegen tomma", () => {
    expect(omradeForFritext("Vet inte riktigt", BRANSCH.hantverk)).toBeUndefined();
    const f = forslag({ ...HANTVERKARE, [FRAGA.fritext]: "Vet inte riktigt" });
    expect(f.find((x) => x.kalla === "onskemal")?.steg).toEqual([]);
  });

  it("föreslår aldrig RUT/ROT för en bransch där det inte finns", () => {
    expect(omradeForFritext("RUT-ansökningar", BRANSCH.vard)?.id).not.toBe("rut");
  });
});

describe("planen — bara de faser som passar", () => {
  it("varje fas säger när den är klar", () => {
    const plan = raknaUtResultat(HANTVERKARE).plan;
    expect(plan.length).toBeGreaterThanOrEqual(2);
    for (const fas of plan) expect(fas.klartNar, fas.rubrik).toMatch(/^Klart när /);
  });

  it("fas 1 nämner bara verktyg som hör till området", () => {
    // HANTVERKARE börjar med samtal — Fortnox har inget med det att göra.
    expect(raknaUtResultat(HANTVERKARE).plan[0].text).not.toContain("Fortnox");
    const fakturor = raknaUtResultat({
      [FRAGA.bransch]: BRANSCH.hantverk,
      [FRAGA.antal]: "2–9",
      [FRAGA.tidstjuvar]: [monster("fakturor"), monster("rapporter")],
      [OMRADESNYCKEL.tid("fakturor")]: "5–10 h",
      [OMRADESNYCKEL.tid("rapporter")]: "2–5 h",
      [FRAGA.verktyg]: [VERKTYG.fortnox, VERKTYG.microsoft],
    });
    expect(fakturor.plan[0].text).toContain("Fortnox");
    expect(fakturor.plan[0].text).not.toContain("Outlook");
  });

  it("böjer 'klar' rätt efter branschens ord", () => {
    const text = (bransch: string) =>
      raknaUtResultat({
        ...HANTVERKARE,
        [FRAGA.bransch]: bransch,
        [FRAGA.tidstjuvar]: [monster("fakturor")],
      })
        .forslag.map((f) => [f.rubrik, ...f.steg].join(" "))
        .join(" ");
    expect(text(BRANSCH.tillverkning)).toMatch(/ordern (är|blir|som) klar\b/);
    expect(text(BRANSCH.tillverkning)).not.toMatch(/ordern (är|blir|som) klart/);
    expect(text(BRANSCH.hantverk)).toMatch(/jobbet (är|blir|som) klart/);
  });

  it("ett litet företag utan samtal, rapporter eller flera verktyg får ingen AI-fas", () => {
    const plan = raknaUtResultat({
      [FRAGA.bransch]: BRANSCH.hantverk,
      [FRAGA.antal]: "2–9",
      [FRAGA.tidstjuvar]: [monster("offerter"), monster("fakturor")],
      [OMRADESNYCKEL.tid("offerter")]: "5–10 h",
      [OMRADESNYCKEL.tid("fakturor")]: "2–5 h",
      [FRAGA.verktyg]: [VERKTYG.fortnox],
    }).plan;
    expect(plan.map((p) => p.rubrik)).toEqual(["Snabb vinst", "Koppla ihop"]);
  });

  it("finns inget att koppla ihop och inget för fas 3 visas ingen plan alls", () => {
    const plan = raknaUtResultat({
      [FRAGA.bransch]: BRANSCH.hantverk,
      [FRAGA.antal]: "Bara jag",
      [FRAGA.tidstjuvar]: [monster("offerter")],
      [OMRADESNYCKEL.tid("offerter")]: "2–5 h",
      [FRAGA.verktyg]: [VERKTYG.annat],
    }).plan;
    expect(plan).toEqual([]);
  });

  it("AI:ns plan får ha två faser, med klart när", () => {
    const ai = {
      hypotes: "",
      forslag: [],
      plan: [
        { rubrik: "Offerter först", text: "Mallar och uppföljning.", klart_nar: "När offerterna följs upp av sig själva." },
        { rubrik: "Sedan fakturorna", text: "Order blir faktura.", klart_nar: "När inget arbete blir ofakturerat." },
      ],
    };
    const plan = raknaUtResultat(HANTVERKARE, ai as never).plan;
    expect(plan.map((p) => p.rubrik)).toEqual(["Offerter först", "Sedan fakturorna"]);
    expect(plan[1].klartNar).toBe("När inget arbete blir ofakturerat.");
  });
});

describe("sammanfattningen — konsekvensen först", () => {
  it("börjar med vad det kostar affären", () => {
    const s = byggSammanfattning(raknaUtResultat(DRIFT), DRIFT);
    expect(s.startsWith("När status, siffror och uppgifter hålls ihop för hand")).toBe(true);
  });

  it("gissar inte en konsekvens när starkaste förslaget saknar egna svar", () => {
    const svar = { [FRAGA.bransch]: BRANSCH.vard };
    const r = raknaUtResultat(svar);
    expect(r.forslag[0].kalla).toBe("bransch");
    expect(byggSammanfattning(r, svar)).not.toMatch(/Tomma tider/);
  });
});

describe("innehållet är komplett", () => {
  it("varje område och kedja har konsekvens och 'klart när'", async () => {
    const { KEDJOR } = await import("@/kompass/data/floden");
    for (const o of OMRADEN) {
      expect(o.konsekvens.length, o.id).toBeGreaterThan(30);
      expect(o.klartNar, o.id).toMatch(/^Klart när /);
    }
    for (const k of KEDJOR) {
      expect(k.konsekvens.length, k.id).toBeGreaterThan(30);
      expect(k.klartNar, k.id).toMatch(/^Klart när /);
    }
  });
});

describe("målet leder", () => {
  /** Fakturor 2–5 h, inga missade samtal. */
  const BAS: Svar = {
    [FRAGA.bransch]: BRANSCH.hantverk,
    [FRAGA.antal]: "2–9",
    [FRAGA.tidstjuvar]: [monster("fakturor")],
    [OMRADESNYCKEL.tid("fakturor")]: "2–5 h",
  };
  const med = (mal: string, extra: Svar = {}): Svar => ({ ...BAS, [FRAGA.mal]: mal, ...extra });

  it("fler affärer utan diagnos, litet företag: fånga förfrågningar leder, deras val behålls", () => {
    // T.ex. "Vet inte" på följdfrågan — då leder idén, inte målets utfyllnad.
    const r = raknaUtResultat(med(MAL.affarer, { [FRAGA.affarer]: "Vet inte" }));
    expect(r.mal).toBe("affarer");
    expect(r.forslag).toHaveLength(3);
    expect(r.forslag[0].id).toBe("tillvaxt-fanga-forfragningar");
    // Ingen ny hemsida utlovad — vi vet inte om de behöver en.
    expect(r.forslag[0].rubrik).not.toMatch(/hemsida/i);
    expect(r.forslag[0].besparing).toBeUndefined();
    expect(r.forslag.map((f) => f.id)).toContain("fakturor");
  });

  it("fler affärer: ett förslag ur svaren leder före idéerna", () => {
    const r = raknaUtResultat(med(MAL.affarer, { [FRAGA.missadeSamtal]: "Fler än 15" }));
    expect(r.forslag[0].id).toBe("samtal");
  });

  it("fler affärer, större företag: prospektering — aldrig hemsida", () => {
    for (const antal of ["10–49", "50 eller fler"]) {
      const r = raknaUtResultat(
        med(MAL.affarer, {
          [FRAGA.antal]: antal,
          [OMRADESNYCKEL.tid("fakturor")]: "Under 5 h",
        }),
      );
      const ids = r.forslag.map((f) => f.id);
      expect(ids[0], antal).toBe("tillvaxt-prospektering");
      expect(ids, antal).not.toContain("tillvaxt-fanga-forfragningar");
      const text = r.forslag.flatMap((f) => [f.rubrik, ...f.steg]).join(" ");
      expect(text, antal).not.toMatch(/hemsid|chatbot|chatt/i);
    }
  });

  it("system som hänger ihop: integrationsförslaget leder, även när det inte var störst", () => {
    // Samtal och system bildar ingen kedja — så syns det att målet leder.
    const svar = med(MAL.integration, {
      [FRAGA.tidstjuvar]: [monster("samtal"), monster("dubbelregistrering")],
      [OMRADESNYCKEL.tid("samtal")]: "5–10 h",
      [OMRADESNYCKEL.tid("dubbelregistrering")]: "Under 2 h",
    });
    const r = raknaUtResultat(svar);
    expect(r.forslag[0].id).toBe("dubbelregistrering");
    expect(byggSammanfattning(r, svar)).toMatch(/^Information som flyttas för hand mellan system/);
  });

  it("snabbare svar utan valt område: samtalsförslaget skapas, utan siffror", () => {
    const r = raknaUtResultat(med(MAL.service));
    expect(r.forslag[0].id).toBe("samtal");
    expect(r.forslag[0].kalla).toBe("signal");
    expect(r.forslag[0].besparing).toBeUndefined();
    expect(r.forslag[0].varfor).toContain(
      "Ni sa att det som skulle göra störst skillnad är att ge era kunder snabbare svar och bättre service",
    );
  });

  describe("följdfrågan leder", () => {
    const fh = (mal: string, id: string, svar: string, extra: Svar = {}) =>
      raknaUtResultat(med(mal, { [id]: svar, ...extra }));

    it("förfrågningar blir liggande: fånga förfrågningar för små", () => {
      const r = fh(MAL.affarer, FRAGA.affarer, "Förfrågningar blir liggande");
      expect(r.forslag[0].id).toBe("tillvaxt-fanga-forfragningar");
      expect(r.forslag[0].varfor).toBe(
        "Ni svarade att ni tappar mest affärer här: ”Förfrågningar blir liggande”.",
      );
    });

    it("för få hittar oss: synlighet för små, prospektering för större", () => {
      expect(fh(MAL.affarer, FRAGA.affarer, "För få hittar oss").forslag[0].id).toBe("marknad");
      expect(
        fh(MAL.affarer, FRAGA.affarer, "För få hittar oss", { [FRAGA.antal]: "10–49" }).forslag[0].id,
      ).toBe("tillvaxt-prospektering");
    });

    it("kunder kommer inte tillbaka: återkommande för små, kundbasen för större", () => {
      expect(fh(MAL.affarer, FRAGA.affarer, "Kunder kommer inte tillbaka").forslag[0].id).toBe(
        "aterkommande",
      );
      expect(
        fh(MAL.affarer, FRAGA.affarer, "Kunder kommer inte tillbaka", { [FRAGA.antal]: "50 eller fler" })
          .forslag[0].id,
      ).toBe("tillvaxt-kundbasen");
    });

    it("ett förslag ur deras egna svar går före det skapade", () => {
      const r = fh(MAL.affarer, FRAGA.affarer, "Offerter följs inte upp", {
        [FRAGA.tidstjuvar]: [monster("fakturor"), monster("offerter")],
        [OMRADESNYCKEL.tid("offerter")]: "2–5 h",
      });
      // Offerter och fakturor blir en kedja — den bygger på diagnosens område.
      expect(r.forslag[0].id).toBe("kedja-offert-till-betalning");
    });

    it("systemfrågan: deras svar står som skäl när förslaget skapas", () => {
      const r = fh(MAL.integration, FRAGA.systembrott, "Vi exporterar och importerar filer", {
        [FRAGA.antal]: "Bara jag",
      });
      expect(r.forslag[0].id).toBe("dubbelregistrering");
      expect(r.forslag[0].varfor).toBe(
        "Du svarade att information flyttas mellan systemen så här: ”Vi exporterar och importerar filer”.",
      );
    });

    it("'fungerar bra' låter målet leda i stället", () => {
      const r = fh(MAL.integration, FRAGA.systembrott, "Systemen är kopplade och fungerar bra");
      expect(r.forslag[0].varfor).not.toContain("flyttas mellan systemen");
    });
  });

  it("diagnosen följer det ledande förslaget — ingen för utfyllnad", () => {
    const r = raknaUtResultat(med(MAL.affarer, { [FRAGA.affarer]: "Förfrågningar blir liggande" }));
    expect(diagnosFor(r.forslag[0])).toBe("förfrågningar som försvinner på vägen in");
    expect(diagnosFor(forslag(HANTVERKARE)[0])).toBe(
      "överlämningarna mellan offert, planering och faktura",
    );
    expect(diagnosFor({ ...r.forslag[0], kalla: "bransch" })).toBeUndefined();
    for (const o of OMRADEN) expect(o.diagnos.length, o.id).toBeGreaterThan(10);
  });

  it("mer gjort med samma team ändrar inte ordningen", () => {
    const utan = raknaUtResultat(BAS).forslag.map((f) => f.id);
    const effektivitet = raknaUtResultat(med(MAL.effektivitet)).forslag.map((f) => f.id);
    expect(effektivitet).toEqual(utan);
  });

  it("lägger inte till en idé som ett förslag redan täcker", () => {
    const ai = kontrolleraAiAnalys({
      hypotes: "",
      forslag: [
        {
          omraden: ["fakturor"],
          rubrik: "Fakturor som skickas av sig själva",
          affarsnytta: "Pengarna kommer in snabbare.",
          varfor: "Ni lägger tid på fakturor.",
          steg: ["Ett.", "Två.", "Tre."],
          slipper: "Påminnelser.",
          forsta_steget: "Räkna dagarna.",
        },
        {
          omraden: ["dokument"],
          rubrik: "En hemsida med tydliga vägar till förfrågan",
          affarsnytta: "Fler förfrågningar.",
          varfor: "Ett steg längre.",
          steg: ["Ett.", "Två.", "Tre."],
          slipper: "Tysta dagar.",
          forsta_steget: "Titta på sidan.",
        },
      ],
      plan: [],
    });
    const f = raknaUtResultat(med(MAL.affarer), ai).forslag;
    expect(f.map((x) => x.id)).not.toContain("tillvaxt-fanga-forfragningar");
  });

  it("slänger AI-förslag om chatbot för alla, och om hemsida för större", () => {
    const forslag = (rubrik: string, omrade: string) => ({
      omraden: [omrade],
      rubrik,
      affarsnytta: "Fler förfrågningar.",
      varfor: "Ett steg längre.",
      steg: ["Ett.", "Två.", "Tre."],
      slipper: "Tysta dagar.",
      forsta_steget: "Börja här.",
    });
    const analys = {
      hypotes: "Hemsidan kan ta in fler förfrågningar.",
      forslag: [
        forslag("En chatbot som svarar dygnet runt", "samtal"),
        forslag("En ny hemsida som säljer", "marknad"),
        forslag("Fakturor som skickas av sig själva", "fakturor"),
      ],
      plan: [],
    };
    const rubriker = (niva: "liten" | "mellan") =>
      kontrolleraMotSvar(analys, [], niva).forslag.map((f) => f.rubrik);
    expect(rubriker("liten")).toEqual(["En ny hemsida som säljer", "Fakturor som skickas av sig själva"]);
    expect(rubriker("mellan")).toEqual(["Fakturor som skickas av sig själva"]);
    expect(kontrolleraMotSvar(analys, [], "mellan").hypotes).toBe("");
  });

  it("idéerna har inga siffror, ingen chatbot och inga tomma mallvariabler", () => {
    for (const bransch of Object.values(BRANSCH) as Bransch[]) {
      for (const du of [true, false]) {
        const k = { ...byggSammanhang({ [FRAGA.bransch]: bransch }), du };
        for (const ide of TILLVAXT) {
          const f = ide.flode(k);
          const text = [f.rubrik, f.slipper, ...f.steg, ide.affarsnytta, ide.forstaSteget].join(" ");
          expect(otillatenText(text, []), `${ide.id} ${bransch}`).toBeNull();
          expect(text, `${ide.id} ${bransch}`).not.toMatch(/undefined|null|\$\{|chatbot|chatt/i);
        }
      }
    }
  });
});
