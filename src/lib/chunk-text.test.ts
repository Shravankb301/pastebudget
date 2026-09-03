import { describe, expect, it } from "vitest";

import { splitTextIntoChunks } from "./chunk-text";

const characterCounter = (text: string) => text.length;

describe("splitTextIntoChunks", () => {
  it("returns no chunks for empty text", () => {
    expect(splitTextIntoChunks("   ", 100, 0, characterCounter)).toEqual([]);
  });

  it("keeps every chunk inside the requested budget", () => {
    const text = Array.from(
      { length: 20 },
      (_, index) => `Paragraph ${index + 1} contains a complete thought for the model.`,
    ).join("\n\n");

    const chunks = splitTextIntoChunks(text, 120, 10, characterCounter);

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((chunk) => chunk.tokens <= 120)).toBe(true);
    expect(chunks.every((chunk) => chunk.text.trim().length > 0)).toBe(true);
  });

  it("preserves all content when overlap is disabled", () => {
    const text = "Alpha section. Beta section. Gamma section. Delta section.";
    const chunks = splitTextIntoChunks(text, 72, 0, characterCounter);
    const reconstructed = chunks.map((chunk) => chunk.text).join(" ");

    expect(reconstructed.replace(/\s+/gu, " ").trim()).toBe(text);
  });

  it("rejects unsafe chunk settings", () => {
    expect(() => splitTextIntoChunks("content", 63, 0, characterCounter)).toThrow(
      "at least 64",
    );
    expect(() => splitTextIntoChunks("content", 100, 100, characterCounter)).toThrow(
      "smaller",
    );
  });
});

