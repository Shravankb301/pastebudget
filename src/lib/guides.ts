export type Guide = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
};

export const GUIDES: Guide[] = [
  {
    slug: "how-many-tokens-is-1000-words",
    eyebrow: "Token basics",
    title: "How many tokens is 1,000 words?",
    description:
      "1,000 English words are often about 1,250 to 1,500 tokens, but code, punctuation, and language can change the count.",
    intro:
      "A useful planning estimate is 1,000 English words ≈ 1,250–1,500 tokens. It is a range, not a conversion rule. The tokenizer reads pieces of text, so two documents with the same word count can consume different amounts of context.",
    sections: [
      {
        heading: "A practical reference",
        paragraphs: [
          "For ordinary English prose, one token is often around three to four characters or roughly three-quarters of a word. That makes 750 words about 1,000 tokens and 1,000 words about 1,250–1,500 tokens.",
          "Treat that estimate as planning shorthand. Count the actual material before an important API request or a long chat handoff.",
        ],
        bullets: [
          "500 English words: often 625–750 tokens",
          "1,000 English words: often 1,250–1,500 tokens",
          "10,000 English words: often 12,500–15,000 tokens",
        ],
      },
      {
        heading: "Why the ratio changes",
        paragraphs: [
          "Tokenizers split common text efficiently and unusual text less efficiently. Source code, identifiers, tables, repeated punctuation, emoji, and languages without spaces can produce a very different token-to-word ratio.",
          "The surrounding chat matters too. Your prompt is only one part of the context alongside system instructions, previous turns, tool definitions, attachments, and the model's response.",
        ],
      },
      {
        heading: "When an estimate is enough",
        paragraphs: [
          "Use a word-based estimate for rough planning. Use a tokenizer when you are close to a limit, comparing request cost, splitting a document, or preparing a reproducible handoff.",
        ],
      },
    ],
  },
  {
    slug: "split-long-text-for-ai",
    eyebrow: "Long documents",
    title: "How to split long text for an AI chat",
    description:
      "Split at structural boundaries, reserve response space, add modest overlap, and label every part in order.",
    intro:
      "The best chunk is not simply the largest piece an AI model accepts. A good split leaves room for the answer, keeps related material together, and gives the model enough continuity to connect one part to the next.",
    sections: [
      {
        heading: "Start with the real input budget",
        paragraphs: [
          "Subtract the response you expect and any context already in the conversation from the advertised window. If the model has a 128K window, the chat already uses 20K, and you reserve 8K for the answer, only about 100K remains for new material.",
        ],
      },
      {
        heading: "Choose readable boundaries",
        paragraphs: [
          "Prefer headings, paragraphs, list boundaries, or complete sentences. Arbitrary character cuts can separate a claim from its evidence or break a code block halfway through a definition.",
        ],
        bullets: [
          "Keep each part below the available budget, including its label.",
          "Repeat a small tail—often 100 to 300 tokens—when continuity matters.",
          "Label parts as Part 1 of N so order survives copy and paste.",
          "Tell the model whether to wait for every part before responding.",
        ],
      },
      {
        heading: "Avoid the context-stuffing trap",
        paragraphs: [
          "More context is not automatically better. Remove duplicate boilerplate, stale instructions, generated logs, and unrelated appendices first. A smaller, relevant packet is easier for a model to use and cheaper to send through an API.",
        ],
      },
    ],
  },
  {
    slug: "context-window-vs-output-limit",
    eyebrow: "Model limits",
    title: "Context window vs. output limit",
    description:
      "A context window is the model's working space; the output limit is the largest response it can return in one request.",
    intro:
      "Model documentation often lists a large context window beside a smaller maximum output. Those numbers answer different questions, and neither means you can safely fill the entire window with a new prompt.",
    sections: [
      {
        heading: "The context window",
        paragraphs: [
          "The context window is the model's working space for a request. Depending on the provider and API, it can include system instructions, user input, earlier turns, tool calls, retrieved documents, reasoning tokens, and generated output.",
        ],
      },
      {
        heading: "The output limit",
        paragraphs: [
          "The output limit caps how many tokens the model can generate in one answer. A model with a 1M context window and a 128K output cap cannot produce a 1M-token answer. It may also stop earlier because of your request settings or the provider's product limits.",
        ],
      },
      {
        heading: "Plan with a reserve",
        paragraphs: [
          "Choose a response reserve based on the task: a short extraction needs less room than a long report or a large code patch. Then subtract existing conversation usage. What remains is the practical budget for your new prompt and files.",
        ],
        bullets: [
          "Short classification or extraction: reserve roughly 1K–4K tokens",
          "Detailed analysis or writing: reserve roughly 8K–16K tokens",
          "Large structured output or code generation: reserve more and validate the provider cap",
        ],
      },
    ],
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug);
}

