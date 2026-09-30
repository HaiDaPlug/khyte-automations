import { describe, expect, it } from "vitest";
import { MAX_FRITEXT } from "@/kompass/data/kompass";
import {
  harKontaktvag,
  kompletteraSchema,
  svarSchema,
  type KontaktIndata,
} from "@/kompass/lib/validering";

describe("svarSchema", () => {
  const bas = { session_id: "abcdefgh-1234", svar: {} };

  it("godtar klar och senaste_fraga, men aldrig klar: false", () => {
    expect(svarSchema.safeParse({ ...bas, senaste_fraga: "antal" }).success).toBe(true);
    expect(svarSchema.safeParse({ ...bas, klar: true }).success).toBe(true);
    expect(svarSchema.safeParse({ ...bas, klar: false }).success).toBe(false);
  });
});

describe("harKontaktvag", () => {
  const tom: KontaktIndata = {
    session_id: "abcdefgh-1234",
    kontakt_namn: "",
    foretag: "",
    telefon: "",
    mejl: "",
    ort: "",
    skicka_resultat: true,
    tips_namn: "",
    tips_kontakt: "",
    webbplats: "",
  };

  it("kräver mejl — resultatet skickas dit", () => {
    expect(harKontaktvag({ ...tom, mejl: "anna@firma.se" })).toBe(true);
    expect(harKontaktvag({ ...tom, telefon: "070-123 45 67" })).toBe(false);
  });
});

describe("källa", () => {
  const bas = { session_id: "abcdefgh-1234", svar: {} };

  it("godtar UTM, referrer och känd enhet", () => {
    const ok = svarSchema.safeParse({
      ...bas,
      kalla: { utm_source: "linkedin", referrer: "google.com", enhet: "mobil" },
    });
    expect(ok.success).toBe(true);
  });

  it("avvisar okänd enhet och för långa värden", () => {
    expect(svarSchema.safeParse({ ...bas, kalla: { enhet: "tv" } }).success).toBe(false);
    expect(
      svarSchema.safeParse({ ...bas, kalla: { utm_source: "x".repeat(101) } }).success,
    ).toBe(false);
  });
});

describe("kompletteraSchema", () => {
  it("kräver alla fält som strängar, även tomma", () => {
    const komplett = {
      session_id: "abcdefgh-1234",
      kontakt_namn: "Anna",
      foretag: "",
      telefon: "070-123 45 67",
      ort: "",
      tips_namn: "",
      tips_kontakt: "",
    };
    expect(kompletteraSchema.safeParse(komplett).success).toBe(true);
    const utanTelefon: Partial<typeof komplett> = { ...komplett };
    delete utanTelefon.telefon;
    expect(kompletteraSchema.safeParse(utanTelefon).success).toBe(false);
  });

  it("tar bara emot roll och tidshorisont från de fasta alternativen", () => {
    const bas = {
      session_id: "abcdefgh-1234",
      kontakt_namn: "",
      foretag: "",
      telefon: "",
      ort: "",
      tips_namn: "",
      tips_kontakt: "",
    };
    expect(kompletteraSchema.safeParse({ ...bas, roll: "Ägare eller VD" }).success).toBe(true);
    expect(kompletteraSchema.safeParse({ ...bas, tidshorisont: "Inom tre månader" }).success).toBe(true);
    expect(kompletteraSchema.safeParse({ ...bas, roll: "Kung" }).success).toBe(false);
  });
});

describe("kontrollfrågans text", () => {
  it("avvisar svar över MAX_FRITEXT tecken", () => {
    const bas = { session_id: "abcdefgh-1234" };
    const med = (n: number) => ({ ...bas, svar: { bekraftelse_text: "x".repeat(n) } });
    expect(svarSchema.safeParse(med(MAX_FRITEXT)).success).toBe(true);
    expect(svarSchema.safeParse(med(MAX_FRITEXT + 1)).success).toBe(false);
  });
});

describe("fritextens längd", () => {
  it("räcker för ett arbetsflöde från början till slut", () => {
    expect(MAX_FRITEXT).toBe(500);
  });

  it("avvisar fritext över MAX_FRITEXT tecken, även om fältet kringgås", () => {
    const bas = { session_id: "abcdefgh-1234" };
    expect(svarSchema.safeParse({ ...bas, svar: { fritext: "x".repeat(MAX_FRITEXT) } }).success).toBe(true);
    expect(svarSchema.safeParse({ ...bas, svar: { fritext: "x".repeat(MAX_FRITEXT + 1) } }).success).toBe(false);
  });
});
