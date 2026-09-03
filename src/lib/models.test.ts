import { describe, expect, it } from "vitest";

import { MODEL_PRESETS } from "./models";

describe("MODEL_PRESETS", () => {
  it("includes Anthropic's complete current Claude lineup", () => {
    const claudeModels = MODEL_PRESETS.filter(
      (model) => model.provider === "Claude API",
    ).map((model) => model.name);

    expect(claudeModels).toEqual([
      "Claude Fable 5.1",
      "Claude Opus 5",
      "Claude Sonnet 5",
      "Claude Haiku 4.5",
    ]);
  });

  it("keeps a first-party source on every preset", () => {
    expect(
      MODEL_PRESETS.every((model) => model.sourceUrl.startsWith("https://")),
    ).toBe(true);
  });
});
