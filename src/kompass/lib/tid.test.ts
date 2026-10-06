import { describe, expect, it } from "vitest";
import {
  avrundaKronor,
  formateraKronor,
  formateraTimmar,
  formateraTimmarKort,
  perManad,
  summera,
} from "@/kompass/lib/tid";

describe("formatering", () => {
  it("skriver timmar på svenska", () => {
    expect(formateraTimmar({ min: 1.5, max: 4 })).toBe("1,5–4 timmar");
    expect(formateraTimmar({ min: 1, max: 1 })).toBe("1 timme");
    expect(formateraTimmarKort({ min: 3, max: 6 })).toBe("3–6 h");
  });

  it("skriver kronor med mellanslag som tusentalsavgränsare", () => {
    expect(formateraKronor({ min: 21000, max: 43000 })).toBe(
      "21 000–43 000 kr",
    );
  });

  it("avrundar kronor så att de inte ser exakta ut", () => {
    expect(avrundaKronor(1612)).toBe(1500);
    expect(avrundaKronor(21543)).toBe(22000);
  });

  it("summerar intervall", () => {
    expect(summera([{ min: 1, max: 2 }, { min: 0.5, max: 1.5 }])).toEqual({
      min: 1.5,
      max: 3.5,
    });
  });
});

describe("perManad", () => {
  it("räknar veckotid till hela timmar i månaden", () => {
    expect(perManad({ min: 1, max: 3 })).toEqual({ min: 4, max: 13 });
    expect(perManad({ min: 0.5, max: 1.5 })).toEqual({ min: 2, max: 6 });
  });
});
