import { describe, expect, it } from "vitest";
import {
  BRANSCH,
  FRAGA,
  MONSTER,
  OMRADESNYCKEL,
} from "@/kompass/data/kompass";
import { raknaUtResultat } from "@/kompass/lib/matchning";
import { byggSammanfattning } from "@/kompass/lib/sammanfattning";
import { sammanstall } from "@/kompass/lib/sammanstallning";
import type { Svar } from "@/kompass/lib/typer";

/** Mönstret på frågan "Vad görs fortfarande för hand?" för ett område. */
const monster = (omrade: string) =>
  MONSTER.find((m) => m.omrade === omrade || m.kundbokning === omrade || m.storre === omrade)!.text;

/** En hantverkare som gått hela vägen. */
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
};

describe("raknaUtResultat", () => {
  it("räknar besparing som angiven tid × andel som går att automatisera", () => {
    const r = raknaUtResultat(HANTVERKARE);
    const offerter = r.omraden.find((o) => o.omrade.id === "offerter")!;

    // 5–10 h × 30–60 % = 1,5–6.
    expect(offerter.besparing).toEqual({ min: 1.5, max: 6 });
    expect(offerter.harledning).toContain("30–60 %");
  });

  it("summerar lagd tid över de valda områdena", () => {
    expect(raknaUtResultat(HANTVERKARE).lagt).toEqual({ min: 7, max: 15 });
  });

  it("sorterar störst besparing först", () => {
    const r = raknaUtResultat(HANTVERKARE);
    expect(r.omraden[0].omrade.id).toBe("offerter");
  });

  it("föreslår samtalsområdet vid många missade samtal", () => {
    const r = raknaUtResultat(HANTVERKARE);
    const sista = r.omraden[r.omraden.length - 1];

    expect(sista.omrade.id).toBe("samtal");
    expect(sista.foreslaget).toBe(true);
    expect(sista.skal).toContain("6–15");
  });

  it("föreslår inte samtal om det redan är valt", () => {
    const r = raknaUtResultat({
      ...HANTVERKARE,
      [FRAGA.tidstjuvar]: [monster("samtal")],
      [OMRADESNYCKEL.tid("samtal")]: "2–5 h",
    });
    expect(r.omraden.filter((o) => o.omrade.id === "samtal")).toHaveLength(1);
    expect(r.omraden[0].foreslaget).toBe(false);
  });

  it("föreslår inte samtal vid få missade samtal", () => {
    const r = raknaUtResultat({ ...HANTVERKARE, [FRAGA.missadeSamtal]: "1–5" });
    expect(r.omraden.some((o) => o.omrade.id === "samtal")).toBe(false);
  });

  it("föreslår integrationsområdet när samma information ofta matas in flera gånger", () => {
    const r = raknaUtResultat({ ...HANTVERKARE, [FRAGA.dubbelinmatning]: "Ja, ofta" });
    const dubbel = r.omraden.find((o) => o.omrade.id === "dubbelregistrering");
    expect(dubbel?.foreslaget).toBe(true);
    expect(dubbel?.besparing).toEqual({ min: 0, max: 0 });
    expect(raknaUtResultat({ ...HANTVERKARE, [FRAGA.dubbelinmatning]: "Ibland" }).omraden.map((o) => o.omrade.id))
      .not.toContain("dubbelregistrering");
  });

  it("räknar uteblivna affärer från missade samtal och kundvärde", () => {
    const r = raknaUtResultat(HANTVERKARE);
    // 10 samtal × 4,3 veckor × 5–10 % × 15 000 kr = 32 250–64 500, avrundat.
    expect(r.missadeAffarer?.kronor).toEqual({ min: 32000, max: 65000 });
  });

  it("räknar inga kronor när kundvärdet är okänt", () => {
    const r = raknaUtResultat({ ...HANTVERKARE, [FRAGA.kundvarde]: "Vet inte" });
    expect(r.missadeAffarer).toBeUndefined();
  });

  it("markerar liten tid när det finns lite att hämta", () => {
    const r = raknaUtResultat({
      [FRAGA.tidstjuvar]: [monster("rapporter")],
      [OMRADESNYCKEL.tid("rapporter")]: "Under 2 h",
    });
    expect(r.litenTid).toBe(true);
  });

  it("markerar inte liten tid när det finns tid att hämta", () => {
    expect(raknaUtResultat(HANTVERKARE).litenTid).toBe(false);
  });

  it("större företag behöver mer tid innan tiden räknas som stor", () => {
    const svar: Svar = {
      [FRAGA.tidstjuvar]: [monster("fakturor")],
      [OMRADESNYCKEL.tid("fakturor")]: "5–20 h",
    };
    // 1,5–12 h räcker för ett litet företag, inte för ett bolag med 50+.
    expect(raknaUtResultat({ ...svar, [FRAGA.antal]: "2–9" }).litenTid).toBe(false);
    expect(raknaUtResultat({ ...svar, [FRAGA.antal]: "50 eller fler" }).litenTid).toBe(true);
  });

  // Svaren sparas efter varje fråga, så uträkningen måste tåla halva svar.
  it("tål ett svar som slutar halvvägs", () => {
    const r = raknaUtResultat({
      [FRAGA.bransch]: BRANSCH.stad,
      [FRAGA.tidstjuvar]: [monster("fakturor")],
    });
    expect(r.omraden[0].besparing).toEqual({ min: 0, max: 0 });
    expect(() => sammanstall({ [FRAGA.bransch]: BRANSCH.stad })).not.toThrow();
  });
});

describe("byggSammanfattning", () => {
  it("är kort: konsekvensen för affären, och de missade samtalen", () => {
    const s = byggSammanfattning(raknaUtResultat(HANTVERKARE), HANTVERKARE);
    expect(s).toBe(
      "Varje överlämning mellan offert, planering och faktura gör att affärer tar längre tid att vinna och att pengarna kommer in senare. Dessutom missar ni 6–15 samtal i veckan.",
    );
  });
});

describe("sammanstall", () => {
  // Roll och tidshorisont skrivs av kompletteringen på tacksidan. Stod de i
  // sammanställningen skulle varje sparande av svaren nolla dem.
  it("rör inte roll och tidshorisont", () => {
    const rad = sammanstall(HANTVERKARE);
    expect("roll" in rad).toBe(false);
    expect("tidshorisont" in rad).toBe(false);
  });

  it("ger kolumner för säljaren", () => {
    const rad = sammanstall({
      ...HANTVERKARE,
      [FRAGA.verktyg]: ["Fortnox", "Excel"],
      [FRAGA.mal]: "Fler affärer",
      [FRAGA.affarer]: "Offerter följs inte upp",
      [FRAGA.fritext]: "  Offerter  ",
    });

    expect(rad.verktyg).toEqual(["Fortnox", "Excel"]);
    expect(rad.mal).toBe("Fler affärer");
    // Kolumnen flaskhals håller följdfrågans svar — deras egen diagnos.
    expect(rad.flaskhals).toBe("Offerter följs inte upp");
    expect(rad.fritext).toBe("Offerter");
    // Svarstid frågas inte längre.
    expect(rad.svarstid).toBeNull();
    expect(rad.omraden.map((o) => o.id)).toEqual(["offerter", "fakturor", "samtal"]);
    expect(rad.kronor_min).toBe(32000);
    expect(rad.forslag.map((f) => f.id)).toEqual([
      "kedja-offert-till-betalning",
      "samtal",
      "onskemal",
    ]);
    expect(rad.forslag[0].omraden).toEqual(["offerter", "fakturor"]);
    expect(rad.plan).toHaveLength(3);
    expect(rad.forslag[0].steg.length).toBeGreaterThanOrEqual(3);
  });
});
