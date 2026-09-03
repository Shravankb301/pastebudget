import { describe, expect, it } from "vitest";

import { analyzeText, buildFitReport } from "./text-analysis";

describe("analyzeText", () => {
  it("returns useful document measurements", () => {
    expect(analyzeText("one two\nthree")).toEqual({
      characters: 13,
      words: 3,
      lines: 2,
      readingMinutes: 1,
    });
  });

  it("handles empty input", () => {
    expect(analyzeText("")).toEqual({
      characters: 0,
      words: 0,
      lines: 0,
      readingMinutes: 0,
    });
  });
});

describe("buildFitReport", () => {
  it("reports headroom without including prompt content", () => {
    const report = buildFitReport({
      modelName: "Example model",
      tokenCount: 10_000,
      availableTokens: 20_000,
      responseReserve: 4_000,
      existingUsage: 2_000,
    });

    expect(report).toContain("fits");
    expect(report).toContain("Headroom: 10,000 tokens");
  });
});

