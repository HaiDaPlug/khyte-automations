import { beforeEach, describe, expect, it, vi } from "vitest";

// Resend kastar inte när ett utskick nekas — det kommer tillbaka som
// { error }. De här testerna låtsas vara Resend och kontrollerar att ett
// nekat mejl blir "misslyckad" och försöks igen, inte "skickad".
vi.mock("server-only", () => ({}));
vi.mock("@/kompass/server/db", () => ({}));

const send = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

process.env.RESEND_API_KEY = "test";
process.env.MAIL_FROM = "Khyte <hej@khyte.se>";
process.env.SALES_EMAIL = "salj@khyte.se";

const { resultatmejl, skickaSaljnotis } = await import("@/kompass/server/mail");
const { SAJT } = await import("@/kompass/data/kompass");
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

describe("resultatmejlet", () => {
  const forslag = (f: Record<string, unknown>) => ({
    id: "x", kalla: "valt", rubrik: "Rubrik", affarsnytta: null, varfor: "Varför", steg: ["Steg ett"],
    slipper: "", besparing_min: null, besparing_max: null, lagt_min: null, lagt_max: null,
    pengar: null, forsta_steget: "Första steget", omraden: [], tjanster: null, ...f,
  });
  const rad = (extra: Record<string, unknown>) =>
    ({ ...(RAD as object), besparing_min: 2, besparing_max: 6, mal: null, kontakt_namn: null, ...extra }) as never;

  it("har mötesknappen, siffran och en rad per förslag — inte steg och första steg", () => {
    const { html } = resultatmejl(
      rad({ forslag: [forslag({ rubrik: "Snabbare offerter", affarsnytta: "Fler ja." })] }),
    );
    expect(html).toContain(SAJT.bokaMote);
    expect(html).toContain(`${SAJT.bas}/kompass/drake-mejl.png`);
    expect(html).toContain(`${SAJT.bas}/signature-assets/khyte-logo.png`);
    expect(html).toContain("2–6 h");
    expect(html).toContain("Snabbare offerter");
    expect(html).toContain("Fler ja.");
    expect(html).not.toContain("Steg ett");
    expect(html).not.toContain("Första steget");
  });

  it("arbetsflödet: AI-förslagets mening med, men inte stegen", () => {
    const { html } = resultatmejl(
      rad({
        forslag: [forslag({ kalla: "onskemal", varfor: "Offerter i Excel." })],
        ai_forslag: "Offerten byggs från era mallar.\n- Kunden fyller i ett formulär\n- Offerten skickas",
      }),
    );
    expect(html).toContain("Offerter i Excel.");
    expect(html).toContain("Offerten byggs från era mallar.");
    expect(html).not.toContain("Kunden fyller i ett formulär");
  });

  it("visar besökarens egen text kortad och skyddad", () => {
    const lang = `<b>offerter</b> ${"ord ".repeat(60)}`;
    const { html } = resultatmejl(rad({ forslag: [forslag({ kalla: "onskemal", varfor: lang })] }));
    expect(html).toContain("&lt;b&gt;offerter&lt;/b&gt;");
    expect(html).not.toContain("<b>offerter");
    expect(html).toContain("…”");
  });
});
