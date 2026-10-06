import { beforeEach, describe, expect, it, vi } from "vitest";

// Kontaktvägen mot en låtsasdatabas med en enda rad. Prövar att ett lead
// aldrig blir liggande utan omförsök: om mejlen misslyckas och statusen
// sedan inte går att spara, måste cron-jobbet ändå hitta raden.
vi.mock("server-only", () => ({}));

let rad: Record<string, unknown>;
let statusSparandeFaller = false;

vi.mock("@/kompass/server/db", () => ({
  fraga: async () => [],
  uppdateraSvarsrad: async (falt: Record<string, unknown>, villkor: string) => {
    if (villkor.includes("kontakt_at is null") && rad.kontakt_at) return [];
    if ("leverans_status" in falt && statusSparandeFaller) throw new Error("databasen svarar inte");
    Object.assign(rad, falt);
    return [{ ...rad }];
  },
}));

const mejlFaller = { varde: false };
const skicka = async () => {
  if (mejlFaller.varde) throw new Error("Resend nere");
};
vi.mock("@/kompass/server/mail", () => ({
  skickaSaljnotis: skicka,
  skickaResultatmejl: skicka,
  skickaAdminlarm: skicka,
}));
vi.mock("@/kompass/server/forslag", () => ({ hamtaForslag: async () => null }));
vi.mock("@/kompass/server/spamskydd", () => ({
  lasIp: () => "1.2.3.4",
  slappIgenom: async () => true,
}));

const { POST } = await import("@/kompass/server/api/kontakt");
const { behoverKoras } = await import("@/kompass/server/leverans");

const skickaIn = () =>
  POST(
    new Request("http://test/api/kompass/kontakt", {
      method: "POST",
      body: JSON.stringify({
        session_id: "besok-123",
        kontakt_namn: "",
        foretag: "",
        telefon: "",
        mejl: "lead@example.com",
        ort: "",
        skicka_resultat: true,
        tips_namn: "",
        tips_kontakt: "",
        webbplats: "",
      }),
    }),
  );

beforeEach(() => {
  rad = {
    session_id: "besok-123",
    svar: {},
    ai_analys: null,
    fritext: null,
    leverans_status: {},
    behover_forsok: false,
    behandlas_till: null,
    kontakt_at: null,
  };
  statusSparandeFaller = false;
  mejlFaller.varde = false;
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("kontakt — leveransen kan alltid tas upp igen", () => {
  it("mejlen misslyckas och statusen går inte att spara: cron hittar ändå raden", async () => {
    mejlFaller.varde = true;
    statusSparandeFaller = true;

    const svar = await skickaIn();
    expect(svar.status).toBe(200);

    // Det cron-jobbet frågar efter: behover_forsok, och sedan statusen.
    expect(rad.behover_forsok).toBe(true);
    expect(behoverKoras(rad.leverans_status as never)).toBe(true);
    // Kontaktvägen håller raden medan den skickar, så att cron inte skickar
    // samtidigt. Låset löper ut av sig självt.
    expect(typeof rad.behandlas_till).toBe("string");
  });

  it("allt går igenom: raden släpps och behöver inga omförsök", async () => {
    await skickaIn();
    expect(rad.behover_forsok).toBe(false);
    expect(rad.behandlas_till).toBeNull();
    expect(behoverKoras(rad.leverans_status as never)).toBe(false);
  });

  it("mejlen misslyckas men statusen sparas: vanligt omförsök", async () => {
    mejlFaller.varde = true;
    await skickaIn();
    expect(rad.behover_forsok).toBe(true);
    expect(rad.behandlas_till).toBeNull();
  });
});
