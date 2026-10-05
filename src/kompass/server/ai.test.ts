import { beforeEach, describe, expect, it, vi } from "vitest";

// AI-anropen mot OpenAI, med en låtsasklient. Kontrollerar att anropen
// byggs rätt (modell, strikt svarsformat, inget sparas hos OpenAI) och att
// svaren tolkas och kontrolleras som förut. Själva kvaliteten på svaren
// kan bara provas med en riktig nyckel.
vi.mock("server-only", () => ({}));
vi.mock("@/kompass/server/db", () => ({ uppdateraSvarsrad: async () => [] }));

let anrop: Record<string, unknown> | null = null;
let svar: Record<string, unknown> = {};
let harNyckel = true;

vi.mock("@/kompass/server/openai", () => ({
  MODELL: "testmodell",
  harAi: () => harNyckel,
  aiKlient: () => ({
    responses: {
      parse: async (body: Record<string, unknown>) => ((anrop = body), svar),
      create: async (body: Record<string, unknown>) => ((anrop = body), svar),
    },
  }),
  loggaAiFel: () => {},
}));

const { analysera } = await import("@/kompass/server/ai-analys");
const { hamtaForslag } = await import("@/kompass/server/forslag");

beforeEach(() => {
  anrop = null;
  svar = {};
  harNyckel = true;
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("analysen", () => {
  it("ber om ett strikt JSON-svar och sparar inget hos OpenAI", async () => {
    const forslag = (omrade: string, rubrik: string) => ({
      omraden: [omrade],
      rubrik,
      affarsnytta: "Fler förfrågningar blir affärer.",
      varfor: "Ni sa att det görs för hand.",
      steg: ["Något händer.", "Sedan nästa sak.", "Till sist det sista."],
      slipper: "Att jaga i efterhand.",
      forsta_steget: "Lista det som görs i dag.",
    });
    svar = {
      output_parsed: {
        hypotes: "Offerterna tar tid.",
        forslag: [forslag("samtal", "Missade samtal blir bokningar"), forslag("marknad", "Synlighet utan extra jobb")],
        plan: [],
      },
    };
    const analys = await analysera({}, null);

    expect(anrop?.model).toBe("testmodell");
    expect(anrop?.store).toBe(false);
    expect(typeof anrop?.instructions).toBe("string");
    const format = (anrop?.text as { format: Record<string, unknown> }).format;
    expect(format.type).toBe("json_schema");
    expect(format.strict).toBe(true);
    expect(Object.keys((format.schema as { properties: object }).properties)).toEqual([
      "hypotes",
      "forslag",
      "plan",
    ]);
    expect(analys?.hypotes).toBe("Offerterna tar tid.");
  });

  it("inget tolkat svar (avböjt eller avbrutet) ger null — regelmotorn tar över", async () => {
    svar = { output_parsed: null };
    expect(await analysera({}, null)).toBeNull();
  });

  it("utan nyckel görs inget anrop", async () => {
    harNyckel = false;
    expect(await analysera({}, null)).toBeNull();
    expect(anrop).toBeNull();
  });
});

describe("förslaget på arbetsflödet", () => {
  const rad = (extra: Record<string, unknown> = {}) =>
    ({ session_id: "s1", fritext: "Vi skriver offerter i Excel.", verktyg: [], omraden: [], ai_forslag: null, ...extra }) as never;

  it("returnerar texten och sparar inget hos OpenAI", async () => {
    svar = { output_text: "Offerten byggs från era mallar.\n- Kunden fyller i\n- Offerten skickas" };
    expect(await hamtaForslag(rad())).toContain("Offerten byggs från era mallar.");
    expect(anrop?.store).toBe(false);
    expect(anrop?.model).toBe("testmodell");
  });

  it("tomt svar (avböjt) och INGET ger null", async () => {
    svar = { output_text: "" };
    expect(await hamtaForslag(rad())).toBeNull();
    svar = { output_text: "INGET" };
    expect(await hamtaForslag(rad())).toBeNull();
  });

  it("text med siffror slängs, som förut", async () => {
    svar = { output_text: "Ni sparar 5 timmar i veckan.\n- Steg" };
    expect(await hamtaForslag(rad())).toBeNull();
  });

  it("verktyg de själva skrev om får nämnas, andra inte", async () => {
    svar = { output_text: "Offerten byggs i Excel och skickas.\n- Steg ett\n- Steg två" };
    expect(await hamtaForslag(rad())).toContain("Excel");
    svar = { output_text: "Offerten bokförs i Fortnox.\n- Steg ett\n- Steg två" };
    expect(await hamtaForslag(rad())).toBeNull();
  });

  it("ett sparat förslag återanvänds utan nytt anrop", async () => {
    expect(await hamtaForslag(rad({ ai_forslag: "Redan klart." }))).toBe("Redan klart.");
    expect(anrop).toBeNull();
  });
});
