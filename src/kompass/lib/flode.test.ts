import { describe, expect, it } from "vitest";
import {
  BRANSCH,
  FRAGA,
  FRAGOR,
  MAL,
  MAL_OMRADEN,
  MAX_TIDSTJUVAR,
  MONSTER,
  OMRADEN,
  OMRADESNYCKEL,
  SPECIAL,
  type Fraga,
} from "@/kompass/data/kompass";
import {
  aktivaSpar,
  arBesvarad,
  byggFragor,
  diagnosFor,
  omradenFor,
  sattSvar,
  valdaOmraden,
} from "@/kompass/lib/flode";
import type { Svar } from "@/kompass/lib/typer";

const ids = (svar: Svar) => byggFragor(svar).map((f) => f.id);
const monster = (omrade: string) =>
  MONSTER.find((m) => m.omrade === omrade || m.kundbokning === omrade || m.storre === omrade)!.text;
const skarm = (svar: Svar, id: string) => byggFragor(svar).find((f) => f.id === id);
const delIds = (f: Fraga | undefined) => (f?.typ === "grupp" ? f.delar.map((d) => d.id) : []);

describe("byggFragor", () => {
  it("har 6 skärmar innan något valts", () => {
    expect(ids({})).toEqual([
      FRAGA.omEr,
      FRAGA.mal,
      FRAGA.tidstjuvar,
      FRAGA.tid,
      FRAGA.slutet,
      FRAGA.fritext,
    ]);
  });

  it("aldrig fler än 7 skärmar, även med följdfråga och max antal områden", () => {
    const svar: Svar = {
      [FRAGA.mal]: MAL.affarer,
      [FRAGA.tidstjuvar]: MONSTER.slice(0, MAX_TIDSTJUVAR).map((m) => m.text),
    };
    expect(byggFragor(svar)).toHaveLength(7);
  });

  it("frågar om högst tre mönster", () => {
    expect(MAX_TIDSTJUVAR).toBe(3);
    const f = skarm({}, FRAGA.tidstjuvar);
    expect(f?.typ === "flerval" && f.max).toBe(3);
  });

  it("följdfrågan kommer direkt efter mönstren, före tidsskärmen", () => {
    const lista = ids({ [FRAGA.mal]: MAL.integration });
    const efter = lista.indexOf(FRAGA.tidstjuvar);
    expect(lista[efter + 1]).toBe(FRAGA.systembrott);
    expect(lista[efter + 2]).toBe(FRAGA.tid);
  });

  it("mål utan riktning ger ingen följdfråga", () => {
    expect(aktivaSpar({ [FRAGA.mal]: MAL.effektivitet })).toEqual([]);
    expect(aktivaSpar({ [FRAGA.mal]: MAL.overblick })).toEqual([]);
  });

  it("högst en följdfråga: målet går före branschen och mönstren", () => {
    const svar: Svar = {
      [FRAGA.bransch]: BRANSCH.tillverkning,
      [FRAGA.mal]: MAL.affarer,
      [FRAGA.tidstjuvar]: [monster("dubbelregistrering")],
    };
    expect(aktivaSpar(svar)).toEqual([FRAGA.affarer]);
    // Utan mål med spår: branschens fråga.
    expect(aktivaSpar({ ...svar, [FRAGA.mal]: MAL.effektivitet })).toEqual([FRAGA.produktion]);
    // Utan bransch med spår: mönstrets fråga.
    expect(aktivaSpar({ [FRAGA.tidstjuvar]: [monster("dubbelregistrering")] })).toEqual([
      FRAGA.systembrott,
    ]);
  });

  it("tidsskärmen har en rad per valt område, sist konsekvensen", () => {
    const svar: Svar = { [FRAGA.tidstjuvar]: [monster("offerter"), monster("fakturor")] };
    expect(delIds(skarm(svar, FRAGA.tid))).toEqual([
      OMRADESNYCKEL.tid("offerter"),
      OMRADESNYCKEL.tid("fakturor"),
      FRAGA.konsekvens,
    ]);
  });

  it("utan valt område frågar tidsskärmen bara om konsekvensen", () => {
    const svar: Svar = { [FRAGA.tidstjuvar]: ["Något annat"] };
    expect(delIds(skarm(svar, FRAGA.tid))).toEqual([FRAGA.konsekvens]);
  });

  it("sista frågan har inga förslag att välja", () => {
    const f = FRAGOR.find((x) => x.id === FRAGA.fritext);
    expect(f?.typ).toBe("fritext");
    expect(f && "snabbval" in f).toBe(false);
  });
});

describe("mönstren", () => {
  it("planering blir kundbokningar där kunderna bokar tider, annars schema", () => {
    const val = (bransch: string) =>
      valdaOmraden({ [FRAGA.bransch]: bransch, [FRAGA.tidstjuvar]: [monster("schema")] })[0]?.id;
    expect(val(BRANSCH.vard)).toBe("bokning");
    expect(val(BRANSCH.stad)).toBe("bokning");
    expect(val(BRANSCH.tillverkning)).toBe("schema");
  });

  it("förfrågningar blir samtal för små företag och ett ärendeflöde för större", () => {
    const val = (antal: string) =>
      valdaOmraden({ [FRAGA.antal]: antal, [FRAGA.tidstjuvar]: [monster("samtal")] })[0]?.id;
    expect(val("2–9")).toBe("samtal");
    expect(val("10–49")).toBe("arenden");
  });

  it("'Något annat' pekar inte på något område", () => {
    expect(valdaOmraden({ [FRAGA.tidstjuvar]: ["Något annat"] })).toEqual([]);
  });

  it("RUT/ROT finns bara för städ och hantverk", () => {
    expect(omradenFor(BRANSCH.stad).map((o) => o.id)).toContain("rut");
    expect(omradenFor(BRANSCH.hantverk).map((o) => o.id)).toContain("rut");
    expect(omradenFor(BRANSCH.vard).map((o) => o.id)).not.toContain("rut");
  });
});

describe("sattSvar", () => {
  it("rensar tiden när ett område väljs bort", () => {
    let svar: Svar = sattSvar({}, FRAGA.tidstjuvar, [monster("offerter")]);
    svar = sattSvar(svar, OMRADESNYCKEL.tid("offerter"), "2–5 h");
    svar = sattSvar(svar, FRAGA.tidstjuvar, [monster("fakturor")]);

    expect(svar[OMRADESNYCKEL.tid("offerter")]).toBeUndefined();
  });

  it("byter man mål försvinner den gamla följdfrågans svar", () => {
    let svar: Svar = sattSvar({}, FRAGA.mal, MAL.affarer);
    svar = sattSvar(svar, FRAGA.affarer, "Offerter följs inte upp");
    expect(sattSvar(svar, FRAGA.mal, MAL.affarer)[FRAGA.affarer]).toBe("Offerter följs inte upp");
    expect(sattSvar(svar, FRAGA.mal, MAL.effektivitet)[FRAGA.affarer]).toBeUndefined();
  });

  it("rensar tidssvar som inte finns i den nya skalan när storleken ändras", () => {
    let svar: Svar = sattSvar({}, FRAGA.antal, "2–9");
    svar = sattSvar(svar, FRAGA.tidstjuvar, [monster("fakturor")]);
    svar = sattSvar(svar, OMRADESNYCKEL.tid("fakturor"), "Mer än 10 h");
    svar = sattSvar(svar, FRAGA.antal, "10–49");
    expect(svar[OMRADESNYCKEL.tid("fakturor")]).toBeUndefined();
  });

  it("rensar tiden när ett mönster byter område för att storleken ändras", () => {
    let svar: Svar = sattSvar({}, FRAGA.antal, "2–9");
    svar = sattSvar(svar, FRAGA.tidstjuvar, [monster("samtal")]);
    svar = sattSvar(svar, OMRADESNYCKEL.tid("samtal"), "2–5 h");
    svar = sattSvar(svar, FRAGA.antal, "10–49");
    expect(svar[OMRADESNYCKEL.tid("samtal")]).toBeUndefined();
  });

  it("frågar inte om samma information på flera ställen när de redan sagt det", () => {
    const utan = skarm({}, FRAGA.slutet);
    expect(delIds(utan)).toContain(FRAGA.dubbelinmatning);

    const svar: Svar = { [FRAGA.tidstjuvar]: [monster("dubbelregistrering")] };
    expect(delIds(skarm(svar, FRAGA.slutet))).not.toContain(FRAGA.dubbelinmatning);
    let med: Svar = sattSvar({}, FRAGA.dubbelinmatning, "Ja, ofta");
    med = sattSvar(med, FRAGA.tidstjuvar, [monster("dubbelregistrering")]);
    expect(med[FRAGA.dubbelinmatning]).toBeUndefined();
  });
});

describe("arBesvarad", () => {
  const omEr = FRAGOR.find((f) => f.id === FRAGA.omEr) as Fraga;

  it("kräver alla delar på en grupp-skärm", () => {
    expect(arBesvarad(omEr, { [FRAGA.bransch]: BRANSCH.hantverk })).toBe(false);
    expect(arBesvarad(omEr, { [FRAGA.antal]: "2–9" })).toBe(false);
    expect(arBesvarad(omEr, { [FRAGA.bransch]: BRANSCH.hantverk, [FRAGA.antal]: "2–9" })).toBe(true);
  });

  it("systemskärmen kräver minst ett system", () => {
    const slutet = FRAGOR.find((f) => f.id === FRAGA.slutet) as Fraga;
    expect(arBesvarad(slutet, { [FRAGA.verktyg]: [], [FRAGA.dubbelinmatning]: "Ibland" })).toBe(false);
    expect(arBesvarad(slutet, { [FRAGA.verktyg]: ["Fortnox"], [FRAGA.dubbelinmatning]: "Ibland" })).toBe(true);
  });
});

describe("datafilen", () => {
  // En reaktion vars nyckel inte är ett riktigt alternativ visas aldrig —
  // fångar det om ett alternativ byter namn.
  it("reaktioner pekar bara på alternativ som finns", () => {
    const alla = byggFragor({
      [FRAGA.bransch]: BRANSCH.hantverk,
      [FRAGA.mal]: MAL.affarer,
      [FRAGA.tidstjuvar]: [monster("offerter")],
      [FRAGA.missadeSamtal]: "6–15",
    });
    for (const fraga of alla) {
      const grupper =
        fraga.typ === "grupp" ? fraga.delar : fraga.typ === "enval" ? [fraga] : [];
      for (const g of grupper) {
        for (const nyckel of Object.keys(g.reaktioner ?? {})) {
          expect(g.alternativ, `${g.id}: "${nyckel}"`).toContain(nyckel);
        }
      }
    }
  });

  it("alla områden går att välja i minst en bransch", () => {
    const valbara = new Set(
      Object.values(BRANSCH).flatMap((b) => omradenFor(b).map((o) => o.id)),
    );
    expect(valbara.size).toBe(OMRADEN.length);
  });

  it("mönster, mål och följdfrågor pekar bara på områden som finns", () => {
    const finns = new Set(OMRADEN.map((o) => o.id));
    const pekar = [
      ...MONSTER.flatMap((m) => [m.omrade, m.kundbokning, m.storre]),
      ...Object.values(MAL_OMRADEN).flat(),
      ...Object.values(SPECIAL).flatMap((f) => f.alternativ.flatMap((a) => a.omraden)),
    ].filter((id): id is string => id !== undefined);
    for (const id of pekar) expect(finns.has(id), id).toBe(true);
  });

  it("har korta uppgiftsnamn för planen", () => {
    for (const o of OMRADEN) {
      expect(o.uppgift.length, o.id).toBeLessThanOrEqual(32);
    }
  });
});

describe("följdfrågorna är neutrala", () => {
  // Den som inte har ett problem, eller inte vet, ska kunna säga det — och
  // då ska svaret inte styra resultatet.
  it("varje följdfråga har ett svar som inte pekar ut något", () => {
    for (const f of Object.values(SPECIAL)) {
      if (f.id === FRAGA.kanaler) continue; // En faktafråga, inget problem.
      expect(
        f.alternativ.some((a) => a.omraden.length === 0 && !a.ide),
        f.id,
      ).toBe(true);
    }
  });

  it("'fungerar bra' och 'vet inte' ger ingen diagnos", () => {
    const bas: Svar = { [FRAGA.mal]: MAL.integration };
    for (const svar of ["Systemen är kopplade och fungerar bra", "Vet inte"]) {
      expect(diagnosFor({ ...bas, [FRAGA.systembrott]: svar }), svar).toBeUndefined();
    }
    expect(diagnosFor({ ...bas, [FRAGA.systembrott]: "Vi exporterar och importerar filer" })?.signal.omraden)
      .toEqual(["dubbelregistrering"]);
  });
});

describe("tidsskala efter storlek", () => {
  const tidsval = (svar: Svar) => {
    const f = skarm({ ...svar, [FRAGA.tidstjuvar]: [monster("fakturor")] }, FRAGA.tid);
    return f?.typ === "grupp" ? f.delar[0].alternativ : [];
  };

  it("större företag mäter i dagar och tjänster", () => {
    expect(tidsval({ [FRAGA.antal]: "2–9" })).toContain("Mer än 10 h");
    expect(tidsval({ [FRAGA.antal]: "10–49" })).toContain("Mer än en heltid");
  });

  it("har fyra val per skala", () => {
    expect(tidsval({ [FRAGA.antal]: "2–9" })).toHaveLength(4);
    expect(tidsval({ [FRAGA.antal]: "50 eller fler" })).toHaveLength(4);
  });
});

describe("samtalsfrågorna", () => {
  // Frågorna om missade samtal och kundvärde ligger på följdfrågans skärm.
  const rader = (svar: Svar) =>
    byggFragor(svar)
      .filter((f) => f.id.startsWith("skarm_"))
      .flatMap((f) => delIds(f));

  it("frågas vid service bara när förfrågningar kommer in via telefon", () => {
    const service: Svar = { [FRAGA.mal]: MAL.service };
    expect(rader({ ...service, [FRAGA.kanaler]: "Mejl och formulär" })).not.toContain(FRAGA.missadeSamtal);
    expect(rader({ ...service, [FRAGA.kanaler]: "Telefon" })).toContain(FRAGA.missadeSamtal);
    expect(rader({ ...service, [FRAGA.kanaler]: "Flera kanaler" })).toContain(FRAGA.missadeSamtal);
  });

  it("frågas vid fler affärer bara för små företag, och aldrig där vi inte räknar pengar", () => {
    const affarer: Svar = { [FRAGA.mal]: MAL.affarer, [FRAGA.bransch]: BRANSCH.hantverk };
    expect(rader({ ...affarer, [FRAGA.antal]: "2–9" })).toContain(FRAGA.missadeSamtal);
    expect(rader({ ...affarer, [FRAGA.antal]: "10–49" })).not.toContain(FRAGA.missadeSamtal);
    expect(rader({ ...affarer, [FRAGA.bransch]: BRANSCH.fastighet })).not.toContain(FRAGA.missadeSamtal);
    // Utan samtalsrader blir affärsfrågan en vanlig fråga med ett tryck.
    expect(ids({ ...affarer, [FRAGA.antal]: "10–49" })).toContain(FRAGA.affarer);
  });

  it("frågar om kundvärde bara när de missar många samtal", () => {
    const bas: Svar = { [FRAGA.mal]: MAL.service, [FRAGA.kanaler]: "Telefon", [FRAGA.bransch]: BRANSCH.hantverk };
    expect(rader({ ...bas, [FRAGA.missadeSamtal]: "1–5" })).not.toContain(FRAGA.kundvarde);
    expect(rader({ ...bas, [FRAGA.missadeSamtal]: "6–15" })).toContain(FRAGA.kundvarde);
  });

  it("frågar i branschens ord", () => {
    const f = skarm(
      { [FRAGA.mal]: MAL.service, [FRAGA.kanaler]: "Telefon", [FRAGA.bransch]: BRANSCH.vard, [FRAGA.missadeSamtal]: "6–15" },
      "skarm_kanaler",
    );
    const varde = f?.typ === "grupp" ? f.delar.find((d) => d.id === FRAGA.kundvarde) : undefined;
    expect(varde?.fraga).toBe("Vad är en ny patient värd för er, ungefär?");
  });

  it("tar bort samtalssvaren när de inte längre frågas", () => {
    let svar: Svar = sattSvar({ [FRAGA.bransch]: BRANSCH.hantverk }, FRAGA.mal, MAL.service);
    svar = sattSvar(svar, FRAGA.kanaler, "Telefon");
    svar = sattSvar(svar, FRAGA.missadeSamtal, "Fler än 15");
    svar = sattSvar(svar, FRAGA.kundvarde, "Över 50 000 kr");
    expect(sattSvar(svar, FRAGA.missadeSamtal, "1–5")[FRAGA.kundvarde]).toBeUndefined();
    const mejl = sattSvar(svar, FRAGA.kanaler, "Mejl och formulär");
    expect(mejl[FRAGA.missadeSamtal]).toBeUndefined();
    expect(mejl[FRAGA.kundvarde]).toBeUndefined();
  });

  it("tar bort ett gammalt kundvärde om man byter till en bransch utan pengar", () => {
    let svar: Svar = sattSvar({ [FRAGA.bransch]: BRANSCH.hantverk }, FRAGA.mal, MAL.service);
    svar = sattSvar(svar, FRAGA.kanaler, "Telefon");
    svar = sattSvar(svar, FRAGA.missadeSamtal, "6–15");
    svar = sattSvar(svar, FRAGA.kundvarde, "Över 50 000 kr");
    svar = sattSvar(svar, FRAGA.bransch, BRANSCH.fastighet);
    expect(svar[FRAGA.kundvarde]).toBeUndefined();
  });
});
