import { beforeEach, describe, expect, it, vi } from "vitest";

// The booking endpoint against fake mail and spam modules: the right mails go
// to the right people, bots and bad input never reach anyone, and a failed
// notification is reported instead of silently lost.
vi.mock("server-only", () => ({}));
vi.spyOn(console, "error").mockImplementation(() => {});

type Utskick = { from: string; to: string[]; replyTo?: string; subject: string; html: string; nyckel?: string };
const skickade: Utskick[] = [];
const fallerFor = { notis: false, kvitto: false };

vi.mock("@/server/mail", () => ({
  avsandare: () => "Khyte <hej@khyte.se>",
  saljare: () => ["hai@khyte.se"],
  ram: (innehall: string) => innehall,
  skyddaHtml: (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"),
  skicka: async (u: Utskick) => {
    if (u.nyckel?.endsWith("-notis") && fallerFor.notis) throw new Error("Resend nere");
    if (u.nyckel?.endsWith("-kvitto") && fallerFor.kvitto) throw new Error("Resend nere");
    skickade.push(u);
  },
}));

const spam = { slapp: true };
vi.mock("@/server/spamskydd", () => ({
  lasIp: () => "1.2.3.4",
  slappIgenom: () => spam.slapp,
}));

const { POST } = await import("@/app/api/ai-konsultation/route");

const giltig = () => ({
  namn: "Sara Lind",
  mejl: "sara@example.com",
  telefon: "",
  foretag: "Lind Redovisning AB",
  roll: "vd",
  arbete: "Redovisningsbyrå med fem anställda.",
  aiVana: "testat",
  verktyg: ["chatgpt", "copilot"],
  policy: "vet-inte",
  fokus: ["texter", "sakerhet"],
  fragor: "Hur skriver jag kundmejl snabbare?",
  mal: "",
  format: "distans",
  plats: "",
  tider: ["formiddag"],
  tidNotis: "",
  webbplats: "",
  startad: Date.now() - 60_000,
  nyckel: "nyckel-12345",
});

const skickaIn = (kropp: unknown) =>
  POST(new Request("http://test/api/ai-konsultation", { method: "POST", body: JSON.stringify(kropp) }));

beforeEach(() => {
  skickade.length = 0;
  fallerFor.notis = false;
  fallerFor.kvitto = false;
  spam.slapp = true;
});

describe("POST /api/ai-konsultation", () => {
  it("sends the notification to Hai and the confirmation to the customer", async () => {
    const svar = await skickaIn(giltig());
    expect(svar.status).toBe(200);
    expect(skickade).toHaveLength(2);

    const [notis, kvitto] = skickade;
    expect(notis.to).toEqual(["hai@khyte.se"]);
    expect(notis.replyTo).toBe("sara@example.com");
    expect(notis.subject).toBe("AI-konsultation: Sara Lind, Lind Redovisning AB");
    expect(notis.html).toContain("Mejl, texter och dokument, Säkerhet och vad man får dela");
    expect(notis.html).toContain("ChatGPT, Microsoft Copilot");
    expect(notis.nyckel).toBe("nyckel-12345-notis");

    expect(kvitto.to).toEqual(["sara@example.com"]);
    expect(kvitto.replyTo).toBe("hai@khyte.se");
    expect(kvitto.html).toContain("Tack, Sara!");
    expect(kvitto.html).toContain("2 990 kr exkl. moms");
    expect(kvitto.nyckel).toBe("nyckel-12345-kvitto");
  });

  it("escapes what the visitor typed", async () => {
    await skickaIn({ ...giltig(), fragor: '<script>alert("x")</script>' });
    expect(skickade[0].html).not.toContain("<script>");
    expect(skickade[0].html).toContain("&lt;script&gt;");
  });

  it("rejects a bad mail address or missing answers, and sends nothing", async () => {
    expect((await skickaIn({ ...giltig(), mejl: "inte-en-adress" })).status).toBe(400);
    expect((await skickaIn({ ...giltig(), fokus: [] })).status).toBe(400);
    expect((await skickaIn({ ...giltig(), aiVana: "kanske" })).status).toBe(400);
    expect((await skickaIn({ ...giltig(), fragor: "   " })).status).toBe(400);
    expect(skickade).toHaveLength(0);
  });

  it("quietly drops bots: a filled honeypot or a form sent within seconds", async () => {
    expect((await skickaIn({ ...giltig(), webbplats: "https://spam.example" })).status).toBe(200);
    expect((await skickaIn({ ...giltig(), startad: Date.now() })).status).toBe(200);
    expect(skickade).toHaveLength(0);
  });

  it("says so when the visitor has sent too many requests", async () => {
    spam.slapp = false;
    expect((await skickaIn(giltig())).status).toBe(429);
    expect(skickade).toHaveLength(0);
  });

  it("fails the request when the notification can't be sent, and offers the mail address", async () => {
    fallerFor.notis = true;
    const svar = await skickaIn(giltig());
    expect(svar.status).toBe(502);
    expect(((await svar.json()) as { fel: string }).fel).toContain("hai@khyte.se");
  });

  it("still succeeds when only the confirmation fails, since Hai has the request", async () => {
    fallerFor.kvitto = true;
    const svar = await skickaIn(giltig());
    expect(svar.status).toBe(200);
    expect(skickade).toHaveLength(1);
    expect(skickade[0].to).toEqual(["hai@khyte.se"]);
  });
});
