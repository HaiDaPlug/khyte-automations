import { describe, expect, it, vi } from "vitest";

// leverans.ts importerar server-only och Supabase-klienten. Ingen av dem
// behövs för den rena funktionen som testas här.
vi.mock("server-only", () => ({}));
vi.mock("@/kompass/server/supabase", () => ({ supabase: () => ({}) }));
vi.mock("@/kompass/server/mail", () => ({}));

const { behoverForsok, MAX_FORSOK } = await import("@/kompass/server/leverans");

describe("behoverForsok — vad cron-jobbet ska ta i", () => {
  it("ett misslyckat steg med försök kvar ska försökas igen", () => {
    expect(behoverForsok({ saljmejl: { status: "misslyckad", forsok: 1 } })).toBe(true);
    expect(
      behoverForsok({
        saljmejl: { status: "skickad", forsok: 1 },
        resultatmejl: { status: "misslyckad", forsok: MAX_FORSOK - 1 },
      }),
    ).toBe(true);
  });

  it("ett steg som gett upp försöks inte igen", () => {
    expect(behoverForsok({ saljmejl: { status: "misslyckad", forsok: MAX_FORSOK } })).toBe(false);
  });

  it("CRM:et väntar på att sättas upp — rörs inte", () => {
    expect(behoverForsok({ crm: { status: "vantar", forsok: 0 } })).toBe(false);
  });

  it("allt skickat, eller ingen status alls, är inget att göra", () => {
    expect(
      behoverForsok({
        saljmejl: { status: "skickad", forsok: 1 },
        resultatmejl: { status: "skickad", forsok: 1 },
      }),
    ).toBe(false);
    expect(behoverForsok(null)).toBe(false);
    expect(behoverForsok({})).toBe(false);
  });
});
