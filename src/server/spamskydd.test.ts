import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { MAX_PER_TIMME, slappIgenom } = await import("@/server/spamskydd");

describe("slappIgenom", () => {
  it("lets an IP through up to the limit, then stops it until the hour has passed", () => {
    const start = 1_000_000;
    for (let i = 0; i < MAX_PER_TIMME; i++) expect(slappIgenom("9.9.9.9", start + i)).toBe(true);
    expect(slappIgenom("9.9.9.9", start + 10)).toBe(false);
    expect(slappIgenom("8.8.8.8", start + 10)).toBe(true);
    expect(slappIgenom("9.9.9.9", start + 60 * 60 * 1000 + 10)).toBe(true);
  });
});
