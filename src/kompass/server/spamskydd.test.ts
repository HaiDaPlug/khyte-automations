import { beforeEach, describe, expect, it, vi } from "vitest";

// Spamskyddet mot en låtsasdatabas: räkningen per IP och taket per dygn
// för hela sajten.
vi.mock("server-only", () => ({}));

let perIp = 0;
let totalt = 0;
let insatta: unknown[][] = [];

vi.mock("@/kompass/server/db", () => ({
  fraga: async (sql: string, params: unknown[]) => {
    if (sql.startsWith("insert")) {
      insatta.push(params);
      return [];
    }
    return sql.includes("ip_hash = $1") ? [{ antal: perIp }] : [{ totalt }];
  },
}));

const { slappIgenom, GRANSER, GRANSER_PER_DYGN } = await import("@/kompass/server/spamskydd");

beforeEach(() => {
  perIp = 0;
  totalt = 0;
  insatta = [];
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("spamskyddet", () => {
  it("AI: släpper igenom under båda taken och räknar anropet", async () => {
    totalt = GRANSER_PER_DYGN.ai! - 1;
    expect(await slappIgenom("1.2.3.4", "ai")).toBe(true);
    expect(insatta).toHaveLength(1);
  });

  it("AI: stoppar när taket för hela sajten är nått, även från en ny IP", async () => {
    totalt = GRANSER_PER_DYGN.ai!;
    expect(await slappIgenom("5.6.7.8", "ai")).toBe(false);
    expect(insatta).toHaveLength(0);
  });

  it("AI: stoppar när IP:ns tak per timme är nått", async () => {
    perIp = GRANSER.ai;
    expect(await slappIgenom("1.2.3.4", "ai")).toBe(false);
  });

  it("andra typer har inget tak per dygn", async () => {
    totalt = 1_000_000;
    expect(await slappIgenom("1.2.3.4", "event")).toBe(true);
  });

  it("taket för AI är 3 000 per dygn", () => {
    expect(GRANSER_PER_DYGN.ai).toBe(3000);
  });
});
