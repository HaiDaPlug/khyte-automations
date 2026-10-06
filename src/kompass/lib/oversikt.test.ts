import { describe, expect, it } from "vitest";
import { FRAGA } from "@/kompass/data/kompass";
import {
  andel,
  leveransText,
  raknaAvhopp,
  raknaTratt,
  stegNamn,
  type Handelse,
} from "@/kompass/lib/oversikt";

const h = (session_id: string, handelse: string, steg: string | null = null): Handelse => ({
  session_id,
  handelse,
  steg,
});

describe("raknaTratt", () => {
  const handelser = [
    h("a", "start"),
    h("a", "fraga_besvarad", FRAGA.omEr),
    h("a", "fraga_besvarad", FRAGA.mal),
    // a backar och svarar igen — räknas bara en gång.
    h("a", "fraga_besvarad", FRAGA.mal),
    h("a", "resultat_visat"),
    h("a", "kontakt_lamnad"),
    h("b", "start"),
    h("b", "start"),
    h("b", "fraga_besvarad", FRAGA.omEr),
    h("c", "start"),
    h("c", "fraga_besvarad", `skarm_${FRAGA.kanaler}`),
    h("c", "resultat_visat"),
    h("c", "mote_klick"),
    h("c", "mote_klick", "tack"),
  ];

  it("räknar besök, inte händelser", () => {
    const t = raknaTratt(handelser);
    expect(t.startade).toBe(3);
    expect(t.resultat).toBe(2);
    expect(t.leads).toBe(1);
    expect(t.mote).toBe(1);
  });

  it("räknar per skärm i flödets ordning, och slår ihop följdfrågans två varianter", () => {
    const t = raknaTratt([...handelser, h("d", "start"), h("d", "fraga_besvarad", FRAGA.kanaler)]);
    expect(t.steg).toEqual([
      { namn: "Om er", antal: 2 },
      { namn: "Mål", antal: 1 },
      { namn: "Följdfråga: förfrågningar", antal: 2 },
    ]);
  });

  it("räknar bara besök som startade under perioden — andelarna jämför samma besök", () => {
    // x startade före perioden men blev klar och lämnade mejl inuti den.
    const t = raknaTratt([
      h("y", "start"),
      h("x", "fraga_besvarad", FRAGA.fritext),
      h("x", "resultat_visat"),
      h("x", "kontakt_lamnad"),
      h("z", "resultat_visat"),
    ]);
    expect(t.startade).toBe(1);
    expect(t.resultat).toBe(0);
    expect(t.leads).toBe(0);
    expect(t.steg).toEqual([]);
  });

  it("visar skärmar från äldre versioner sist, utan att krascha", () => {
    const t = raknaTratt([
      h("a", "start"),
      h("a", "fraga_besvarad", "flaskhals"),
      h("a", "fraga_besvarad", FRAGA.mal),
    ]);
    expect(t.steg.map((s) => s.namn)).toEqual(["Mål", "flaskhals (äldre version)"]);
  });
});

describe("raknaAvhopp", () => {
  it("räknar bara de som inte nådde resultatet, efter var de slutade", () => {
    const avhopp = raknaAvhopp([
      { senaste_fraga: FRAGA.tidstjuvar, klar: false },
      { senaste_fraga: FRAGA.omEr, klar: false },
      { senaste_fraga: FRAGA.tidstjuvar, klar: false },
      { senaste_fraga: FRAGA.fritext, klar: true },
      { senaste_fraga: null, klar: false },
    ]);
    expect(avhopp).toEqual([
      { namn: "Om er", antal: 1 },
      { namn: "Görs för hand", antal: 2 },
      { namn: "Före första frågan", antal: 1 },
    ]);
  });
});

describe("formatering", () => {
  it("andel avrundar och klarar noll", () => {
    expect(andel(1, 3)).toBe("33 %");
    expect(andel(0, 0)).toBe("–");
  });

  it("leveransen visar sälj- och resultatmejlet", () => {
    expect(leveransText({ saljmejl: { status: "skickad" }, resultatmejl: { status: "misslyckad" } })).toBe(
      "Sälj ✓ · Resultat ✗",
    );
    expect(leveransText(null)).toBe("Sälj … · Resultat …");
  });

  it("alla skärmar i flödet har ett namn", () => {
    for (const id of [FRAGA.omEr, FRAGA.mal, FRAGA.tidstjuvar, FRAGA.tid, FRAGA.slutet, FRAGA.fritext]) {
      expect(stegNamn(id)).not.toContain("äldre version");
    }
  });
});
