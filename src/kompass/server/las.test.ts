import { beforeEach, describe, expect, it, vi } from "vitest";

// Cron-jobbets lås. Själva samtidigheten avgörs av databasen och kan bara
// provas mot en riktig Supabase — här kontrolleras att uppdateringen ställer
// rätt villkor, och att sparandet släpper låset.
vi.mock("server-only", () => ({}));
vi.mock("@/kompass/server/mail", () => ({}));

type Anrop = { metod: string; args: unknown[] };
let anrop: Anrop[] = [];
let svar: { data: unknown[] | null; error: { message: string } | null } = { data: [], error: null };

const kedja: Record<string, unknown> = {};
for (const metod of ["from", "update", "eq", "or", "select"]) {
  kedja[metod] = (...args: unknown[]) => {
    anrop.push({ metod, args });
    return kedja;
  };
}
// Klienten är "thenable": await på kedjan ger svaret.
kedja.then = (los: (v: unknown) => void) => los(svar);
vi.mock("@/kompass/server/supabase", () => ({ supabase: () => kedja }));

const { taRad, sparaStatus, LAS_MINUTER } = await import("@/kompass/server/leverans");

const hitta = (metod: string) => anrop.filter((a) => a.metod === metod).map((a) => a.args);

beforeEach(() => {
  anrop = [];
  svar = { data: [], error: null };
});

describe("taRad", () => {
  it("tar bara en rad som väntar och som ingen annan körning håller", async () => {
    svar = { data: [{ session_id: "s1" }], error: null };
    const fore = Date.now();
    expect(await taRad("s1")).toBe(true);

    expect(hitta("eq")).toEqual([
      ["session_id", "s1"],
      ["behover_forsok", true],
    ]);
    const [villkor] = hitta("or")[0] as [string];
    expect(villkor).toMatch(/^behandlas_till\.is\.null,behandlas_till\.lt\."[^"]+"$/);

    const [{ behandlas_till }] = hitta("update")[0] as [{ behandlas_till: string }];
    const minuter = (Date.parse(behandlas_till) - fore) / 60_000;
    expect(minuter).toBeGreaterThanOrEqual(LAS_MINUTER - 0.1);
    expect(minuter).toBeLessThanOrEqual(LAS_MINUTER + 0.1);
  });

  it("säger nej när en annan körning redan tagit raden", async () => {
    svar = { data: [], error: null };
    expect(await taRad("s1")).toBe(false);
  });

  it("säger nej vid databasfel — hellre inget mejl än två", async () => {
    svar = { data: null, error: { message: "timeout" } };
    expect(await taRad("s1")).toBe(false);
  });
});

describe("sparaStatus", () => {
  it("släpper låset när statusen sparas", async () => {
    await sparaStatus("s1", { saljmejl: { status: "skickad", forsok: 2 } });
    const [falt] = hitta("update")[0] as [Record<string, unknown>];
    expect(falt.behandlas_till).toBeNull();
    expect(falt.behover_forsok).toBe(false);
  });
});
