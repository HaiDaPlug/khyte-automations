import { describe, expect, it } from "vitest";
import { utanPersonuppgifter } from "@/kompass/lib/personuppgifter";

describe("utanPersonuppgifter — det som skickas till AI:n och skrivs i loggar", () => {
  it("tar bort telefonnummer, mejladresser och personnummer", () => {
    expect(utanPersonuppgifter("Ring mig på 070-123 45 67")).toBe("Ring mig på [borttaget]");
    expect(utanPersonuppgifter("maila anna.svensson@firma.se")).toBe("maila [borttaget]");
    expect(utanPersonuppgifter("kund 19850312-1234 klagar")).toBe("kund [borttaget] klagar");
  });

  it("låter vanliga tal vara", () => {
    expect(utanPersonuppgifter("Offerter tar 3 timmar")).toBe("Offerter tar 3 timmar");
    expect(utanPersonuppgifter("fakturor för 2024")).toBe("fakturor för 2024");
  });

  it("kapar vid gränsen", () => {
    expect(utanPersonuppgifter("a".repeat(500))).toHaveLength(300);
    expect(utanPersonuppgifter("a".repeat(500), 50)).toHaveLength(50);
  });
});
