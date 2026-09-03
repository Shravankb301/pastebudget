export type TextAnalysis = {
  characters: number;
  words: number;
  lines: number;
  readingMinutes: number;
};

export function analyzeText(text: string): TextAnalysis {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/u).length : 0;

  return {
    characters: text.length,
    words,
    lines: text ? text.split(/\r?\n/u).length : 0,
    readingMinutes: words === 0 ? 0 : Math.max(1, Math.ceil(words / 225)),
  };
}

export function buildFitReport({
  modelName,
  tokenCount,
  availableTokens,
  responseReserve,
  existingUsage,
}: {
  modelName: string;
  tokenCount: number;
  availableTokens: number;
  responseReserve: number;
  existingUsage: number;
}) {
  const remaining = availableTokens - tokenCount;
  const status = remaining >= 0 ? "fits" : "does not fit";
  const formatter = new Intl.NumberFormat("en-US");

  return [
    `PromptFit report — ${status}`,
    `Model preset: ${modelName}`,
    `Prompt: ${formatter.format(tokenCount)} tokens`,
    `Available input budget: ${formatter.format(availableTokens)} tokens`,
    `Reserved for response: ${formatter.format(responseReserve)} tokens`,
    `Existing context: ${formatter.format(existingUsage)} tokens`,
    remaining >= 0
      ? `Headroom: ${formatter.format(remaining)} tokens`
      : `Over by: ${formatter.format(Math.abs(remaining))} tokens`,
    "Measured locally at PromptFit.",
  ].join("\n");
}

