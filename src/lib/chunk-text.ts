export type TextChunk = {
  text: string;
  tokens: number;
};

type TokenCounter = (text: string) => number;

function preferredBreak(text: string, candidate: number) {
  const floor = Math.floor(candidate * 0.6);
  const prefix = text.slice(0, candidate);
  const breakpoints = [
    { point: prefix.lastIndexOf("\n\n"), offset: 0 },
    { point: prefix.lastIndexOf("\n"), offset: 0 },
    { point: prefix.lastIndexOf(". "), offset: 1 },
    { point: prefix.lastIndexOf("? "), offset: 1 },
    { point: prefix.lastIndexOf("! "), offset: 1 },
    { point: prefix.lastIndexOf(" "), offset: 0 },
  ];

  const selected = breakpoints.find(({ point }) => point >= floor);
  return selected ? selected.point + selected.offset : candidate;
}

function takeWithinBudget(
  text: string,
  maxTokens: number,
  countTokens: TokenCounter,
) {
  if (countTokens(text) <= maxTokens) return text.length;

  let low = 1;
  let high = text.length;
  let best = 1;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (countTokens(text.slice(0, middle)) <= maxTokens) {
      best = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  const boundary = preferredBreak(text, best);
  return Math.max(1, boundary);
}

function takeTailWithinBudget(
  text: string,
  maxTokens: number,
  countTokens: TokenCounter,
) {
  if (maxTokens <= 0 || !text) return "";
  if (countTokens(text) <= maxTokens) return text;

  let low = 0;
  let high = text.length;
  let best = text.length;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const tail = text.slice(middle);
    if (countTokens(tail) <= maxTokens) {
      best = middle;
      high = middle - 1;
    } else {
      low = middle + 1;
    }
  }

  const tail = text.slice(best);
  const firstBreak = tail.search(/(?:\n\n|[.!?]\s|\n)/u);
  return firstBreak >= 0 && firstBreak < tail.length * 0.4
    ? tail.slice(firstBreak).trimStart()
    : tail;
}

export function splitTextIntoChunks(
  text: string,
  maxTokens: number,
  overlapTokens: number,
  countTokens: TokenCounter,
): TextChunk[] {
  const cleanText = text.trim();
  if (!cleanText) return [];
  if (!Number.isFinite(maxTokens) || maxTokens < 64) {
    throw new Error("Chunk size must be at least 64 tokens.");
  }
  if (overlapTokens < 0 || overlapTokens >= maxTokens) {
    throw new Error("Overlap must be smaller than the chunk size.");
  }

  // Leave room for a short "Part X of Y" label when the user copies a chunk.
  const contentBudget = maxTokens - 24;
  const chunks: TextChunk[] = [];
  let remaining = cleanText;
  let previous = "";

  while (remaining) {
    const overlap = takeTailWithinBudget(
      previous,
      Math.min(overlapTokens, Math.floor(contentBudget / 3)),
      countTokens,
    );
    const overlapPrefix = overlap ? `${overlap}\n\n` : "";
    const available = contentBudget - countTokens(overlapPrefix);
    const take = takeWithinBudget(remaining, available, countTokens);
    const freshText = remaining.slice(0, take).trim();
    const chunkText = `${overlapPrefix}${freshText}`.trim();

    if (!freshText) break;

    chunks.push({ text: chunkText, tokens: countTokens(chunkText) });
    previous = freshText;
    remaining = remaining.slice(take).trimStart();
  }

  return chunks;
}
