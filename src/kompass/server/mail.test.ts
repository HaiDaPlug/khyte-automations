import { beforeEach, describe, expect, it, vi } from "vitest";

// Resend kastar inte när ett utskick nekas — det kommer tillbaka som
// { error }. De här testerna låtsas vara Resend och kontrollerar att ett
// nekat mejl blir "misslyckad" och försöks igen, inte "skickad".
vi.mock("server-only", () => ({}));
vi.mock("@/kompass/server/supabase", () => ({ supabase: () => ({}) }));

const send = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

process.env.RESEND_API_KEY = "test";
process.env.MAIL_FROM = "Khyte <hej@khyte.se>";
process.env.SALES_EMAIL = "salj@khyte.se";

const { skickaSaljnotis } = await import("@/kompass/server/mail");
const { behoverForsok, korEftersteg } = await import("@/kompass/server/leverans");

const RAD = {
  session_id: "abc-123",
  mejl: "anna@exempel.se",
  skicka_resultat: true,
  leverans_status: {},
  svar: {},
  omraden: [],
  forslag: [],
  plan: [],
} as never;

const NEKAD = {
  data: null,
  error: { name: "validation_error", message: "Invalid `to` field.", statusCode: 422 },
  headers: null,
};

beforeEach(() => send.mockReset());

describe("utskick via Resend", () => {
  it("ett nekat mejl kastar ett fel", async () => {
    send.mockResolvedValue(NEKAD);
    await expect(skickaSaljnotis(RAD)).rejects.toThrow(/Resend nekade utskicket/);
  });

  it("ett godkänt mejl går igenom, med idempotensnyckeln", async () => {
    send.mockResolvedValue({ data: { id: "e1" }, error: null, headers: null });
    await expect(skickaSaljnotis(RAD, "kompass-abc-123-saljmejl-1")).resolves.toBeUndefined();
    expect(send.mock.calls[0][1]).toEqual({ idempotencyKey: "kompass-abc-123-saljmejl-1" });
  });
});

describe("leveransen när Resend nekar", () => {
  it("markeras som misslyckad och försöks igen — inte som skickad", async () => {
    send.mockResolvedValue(NEKAD);
    const status = await korEftersteg(RAD);
    expect(status.saljmejl?.status).toBe("misslyckad");
    expect(status.resultatmejl?.status).toBe("misslyckad");
    expect(behoverForsok(status)).toBe(true);
  });

  it("varje försök får en egen nyckel, samma försök samma nyckel", async () => {
    send.mockResolvedValue({ data: { id: "e1" }, error: null, headers: null });
    await korEftersteg(RAD);
    await korEftersteg({
      ...(RAD as object),
      leverans_status: { saljmejl: { status: "misslyckad", forsok: 1 } },
    } as never);
    const nycklar = send.mock.calls.map((c) => c[1]?.idempotencyKey);
    expect(nycklar).toContain("kompass-abc-123-saljmejl-1");
    expect(nycklar).toContain("kompass-abc-123-saljmejl-2");
  });
});
