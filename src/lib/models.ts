export type ModelPreset = {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  maxOutput: number | null;
  sourceUrl: string;
  tokenizer: "o200k" | "estimated";
};

export const MODEL_PRESETS: ModelPreset[] = [
  {
    id: "gpt-5-6",
    name: "GPT-5.6",
    provider: "OpenAI API",
    contextWindow: 1_050_000,
    maxOutput: 128_000,
    sourceUrl: "https://platform.openai.com/docs/models",
    tokenizer: "o200k",
  },
  {
    id: "claude-fable-5-1",
    name: "Claude Fable 5.1",
    provider: "Claude API",
    contextWindow: 1_000_000,
    maxOutput: 128_000,
    sourceUrl: "https://platform.claude.com/docs/en/models/overview",
    tokenizer: "estimated",
  },
  {
    id: "claude-opus-5",
    name: "Claude Opus 5",
    provider: "Claude API",
    contextWindow: 1_000_000,
    maxOutput: 128_000,
    sourceUrl: "https://platform.claude.com/docs/en/models/overview",
    tokenizer: "estimated",
  },
  {
    id: "claude-sonnet-5",
    name: "Claude Sonnet 5",
    provider: "Claude API",
    contextWindow: 1_000_000,
    maxOutput: 128_000,
    sourceUrl: "https://platform.claude.com/docs/en/models/overview",
    tokenizer: "estimated",
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    provider: "Claude API",
    contextWindow: 200_000,
    maxOutput: 64_000,
    sourceUrl: "https://platform.claude.com/docs/en/models/overview",
    tokenizer: "estimated",
  },
  {
    id: "gemini-3-7-flash",
    name: "Gemini 3.7 Flash",
    provider: "Gemini API",
    contextWindow: 1_000_000,
    maxOutput: 64_000,
    sourceUrl: "https://ai.google.dev/gemini-api/docs/latest-model",
    tokenizer: "estimated",
  },
  {
    id: "grok-4-20",
    name: "Grok 4.20",
    provider: "xAI API",
    contextWindow: 1_000_000,
    maxOutput: null,
    sourceUrl: "https://docs.x.ai/developers/models/grok-4.20",
    tokenizer: "estimated",
  },
];

export const DEFAULT_MODEL_ID = MODEL_PRESETS[0].id;
export const MODEL_DATA_VERIFIED_AT = "September 2, 2026";

export function getModelPreset(id: string) {
  return MODEL_PRESETS.find((model) => model.id === id) ?? MODEL_PRESETS[0];
}

export function formatTokens(value: number) {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${Number.isInteger(millions) ? millions : millions.toFixed(2)}M`;
  }

  if (value >= 1_000) {
    const thousands = value / 1_000;
    return `${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}K`;
  }

  return new Intl.NumberFormat("en-US").format(value);
}
