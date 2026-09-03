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

  it("puts the newest stable Gemini Flash release ahead of its predecessor", () => {
    const geminiModels = MODEL_PRESETS.filter(
      (model) => model.provider === "Gemini API",
    );

    expect(geminiModels.map((model) => model.name)).toEqual([
      "Gemini 3.8 Flash",
      "Gemini 3.7 Flash",
    ]);
    expect(geminiModels[0]).toMatchObject({
      contextWindow: 1_048_576,
      maxOutput: 65_536,
    });
  });
});
