import { beforeEach, describe, expect, it, vi } from "vitest";

// Cron-jobbets lås. Själva samtidigheten avgörs av databasen och kan bara
// provas mot en riktig databas — här kontrolleras att uppdateringen ställer
// rätt villkor, och att sparandet släpper låset.
vi.mock("server-only", () => ({}));
vi.mock("@/kompass/server/mail", () => ({}));

type Anrop = { sql: string; params: unknown[] };
let anrop: Anrop[] = [];
let svar: () => unknown[] = () => [];

vi.mock("@/kompass/server/db", () => ({
  fraga: async (sql: string, params: unknown[] = []) => {
    anrop.push({ sql, params });
    return svar();
  },
  uppdateraSvarsrad: async (falt: Record<string, unknown>, villkor: string, params: unknown[] = []) => {
    anrop.push({ sql: `update ${villkor}`, params: [...params, falt] });
    return svar();
  },
}));

const { taRad, sparaStatus, LAS_MINUTER } = await import("@/kompass/server/leverans");

const enRad = (sql: string) => sql.replace(/\s+/g, " ").trim();

beforeEach(() => {
  anrop = [];
  svar = () => [];
});

describe("taRad", () => {
  it("tar bara en rad som väntar och som ingen annan körning håller", async () => {
    svar = () => [{ session_id: "s1" }];
    expect(await taRad("s1")).toBe(true);

    const [{ sql, params }] = anrop;
    expect(enRad(sql)).toContain("set behandlas_till = now() + make_interval(mins => $2)");
    expect(enRad(sql)).toContain(
      "where session_id = $1 and behover_forsok and (behandlas_till is null or behandlas_till < now())",
    );
    expect(enRad(sql)).toContain("returning session_id");
    expect(params).toEqual(["s1", LAS_MINUTER]);
  });

  it("säger nej när en annan körning redan tagit raden", async () => {
    svar = () => [];
    expect(await taRad("s1")).toBe(false);
  });

  it("säger nej vid databasfel — hellre inget mejl än två", async () => {
    svar = () => {
      throw new Error("timeout");
    };
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await taRad("s1")).toBe(false);
  });
});

describe("sparaStatus", () => {
  it("släpper låset när statusen sparas", async () => {
    await sparaStatus("s1", { saljmejl: { status: "skickad", forsok: 2 } });
    const [{ sql, params }] = anrop;
    expect(sql).toBe("update session_id = $1");
    const falt = params[1] as Record<string, unknown>;
    expect(params[0]).toBe("s1");
    expect(falt.behandlas_till).toBeNull();
    expect(falt.behover_forsok).toBe(false);
  });
});
