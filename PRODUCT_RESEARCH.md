# PromptFit product research

Research date: September 2, 2026.

## Demand signals

- A March 2026 Claude discussion with roughly 2,000 votes explicitly complained that there was no real-time token counter and no clear way to plan usage: [Reddit discussion](https://www.reddit.com/r/ClaudeAI/comments/1s5nxwe/an_open_letter_to_anthropic_want_to_free_up/).
- A January 2026 thread about lost context and compaction had a highly upvoted request for “a token counter that shows me how much context length I have left”: [Reddit discussion](https://www.reddit.com/r/ClaudeAI/comments/1qonm6z/hey_remember_all_that_stuff_i_just_blew_50_of/).
- A June 2026 extension write-up reported that a naive tokenizer visibly froze on a 4 MB paste. PromptFit moves live counting to a Web Worker and treats large-paste responsiveness as core behavior: [implementation discussion](https://www.reddit.com/r/ClaudeCode/comments/1ujhl85/i_kept_losing_track_of_how_close_i_was_to_hitting/).
- Current providers advertise context windows from 200K to more than 1M tokens, while output caps are smaller and product-plan limits may differ. That makes “does it fit?” a budgeting question, not just a word count: [OpenAI models](https://platform.openai.com/docs/models), [Claude models](https://platform.claude.com/docs/en/models/overview), [Gemini 3.7 Flash](https://ai.google.dev/gemini-api/docs/latest-model), [Grok 4.20](https://docs.x.ai/developers/models/grok-4.20).
- Competing counters validate the category, but many stop at a raw count. PromptFit's wedge is the complete pre-paste decision: input + files + existing context + answer reserve, followed by a local fix when the material does not fit.

## Ten viable ideas

Scores are 1–5. For Competition, 5 means unusually open space and 1 means crowded. Total is out of 40.

| Idea | Severity | Audience | Distribution | Competition | Build tonight | Repeat | Share | Later revenue | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| PromptFit — context budget + safe chunker | 4 | 5 | 5 | 2 | 5 | 5 | 3 | 4 | **33** |
| Restaurant tip-pool calculator with saved roles | 4 | 3 | 4 | 3 | 5 | 5 | 4 | 4 | 32 |
| Permanent local screenshot redactor | 4 | 5 | 5 | 2 | 4 | 4 | 4 | 3 | 31 |
| Cross-platform social crop previewer | 3 | 5 | 5 | 1 | 4 | 4 | 4 | 4 | 30 |
| AI crawler policy and edge-access checker | 4 | 4 | 5 | 1 | 3 | 4 | 4 | 5 | 30 |
| Fair roommate rent-split calculator | 4 | 4 | 5 | 2 | 5 | 2 | 5 | 3 | 30 |
| MCP/tool-schema context cost scanner | 4 | 3 | 4 | 3 | 3 | 5 | 3 | 5 | 30 |
| Bulk URL cleaner and domain normalizer | 3 | 4 | 4 | 2 | 5 | 5 | 2 | 3 | 28 |
| Private subtitle/transcript cleaner | 3 | 4 | 5 | 1 | 5 | 4 | 2 | 3 | 27 |
| Local AI chat-export reader | 4 | 5 | 4 | 1 | 4 | 2 | 3 | 3 | 26 |

Several apparently attractive categories were deprioritized after live competition checks. Social-size/crop utilities, AI crawler checkers, chat-export readers, subtitle cleaners, and screenshot redactors all have numerous current free local-first entrants. Tip pooling has real recurring pain—one restaurant manager described spending 10–30 minutes per night dividing tips—but reaches a smaller audience than AI context management: [tip-pool discussion](https://www.reddit.com/r/Restaurant_Managers/comments/1nqncs4/free_tippooling_calculator_website_google_sheet/).

## Winning product thesis

**User:** People who paste long prompts, documents, transcripts, exports, or code into AI chats and APIs.

**Problem:** They do not know whether the material will fit after earlier conversation, hidden overhead, and the desired answer are considered. The failure arrives late as truncation, compaction, rejection, or a poor answer.

**Existing workaround:** Guess from word count, paste into a basic token counter, search model tables in another tab, then manually cut the text into arbitrary pieces.

**Product:** PromptFit turns all of that into one pre-paste step: measure locally, choose a sourced limit, reserve output and existing context, get a verdict, then create labeled chunks at readable boundaries.

**Why now:** AI usage is broad, long-context claims keep increasing, and current user discussions show that visibility and control have not kept pace.

**Distribution wedge:** High-intent search pages around token counts, context windows, output limits, and splitting long text lead directly into the tool. Privacy and the “counts plus fix” workflow give people a reason to bookmark it over a generic counter.

**Why it can win:** It does not claim to reveal a consumer plan's hidden quota or pretend one tokenizer is exact for every provider. The product exposes those caveats and solves the next action—creating safe chunks—inside the same local workflow.

## MVP scope

The one job is: **tell me whether this material fits, and make it fit if it does not.**

Included tonight:

- Paste and text-file input
- Local live count
- Six sourced API presets plus a custom limit
- Response and existing-context reserves
- Clear fit/near-limit/overflow states
- Local structure-aware chunks with overlap
- Copy report, copy part, and download all
- Mobile layout, error states, accessibility, metadata, privacy page, guides, and automated checks

Explicitly excluded:

- Accounts, sync, history, or a database
- AI summarization or compression
- PDF/DOCX extraction
- Browser-extension access to live chat history
- API billing estimates, because prices and caching rules change faster than context basics

## Distribution architecture

**Primary acquisition:** Search. The first cluster is “AI token counter,” “context window calculator,” “will my prompt fit,” “split long text for ChatGPT,” and “how many tokens is 1,000 words.”

**Secondary acquisition:** Useful, evidence-first posts in AI tool, prompting, Claude, ChatGPT, local-first, and developer communities. The pitch should demonstrate the failure mode and disclose estimation limits, not lead with a generic launch announcement.

**Share loop:** Copying a fit report gives collaborators a content-free, privacy-safe budget receipt. Downloaded chunks remain labeled in order. A later opt-in share card can visualize counts without including source text.

**Repeat loop:** People return before large uploads, prompt handoffs, long analyses, and model changes. Settings can later be saved locally without retaining content.

**Programmatic SEO expansion:** Verified pages for each model's context/output limits; calculators for common word counts; guides for code, transcripts, books, CSVs, and multilingual text; comparisons between context sizes. Model pages must stay sourced and date-stamped.

**Communities:** r/ClaudeAI, r/ChatGPT, r/ClaudeCode, r/PromptEngineering, r/LocalLLaMA, Hacker News Show HN, Indie Hackers, and developer Discord/Slack groups where long prompts or agent context are routine.

## Five launchable content pieces

1. **“Your 1M-token model does not give your prompt 1M tokens.”** A diagram showing response reserve, prior chat, tools, and new input, ending with a live PromptFit example.
2. **“I tested a 4 MB paste without freezing the UI.”** A short engineering post about moving tokenization into a browser worker, with a reproducible sample.
3. **“1,000 words is not a fixed number of tokens.”** Compare prose, code, emoji, and multilingual text, then link to the counter.
4. **“How to split a document without cutting every N characters.”** Show paragraph-first boundaries, overlap, and ordered labels.
5. **“A privacy receipt for prompt tools.”** Explain how CSP, local file reading, no storage, and content-free analytics make the no-upload claim verifiable.

## Next three high-leverage improvements

1. **Browser extension meter:** Read only the currently open chat DOM—with explicit permission—to estimate visible conversation usage where the pain is strongest. Keep the web tool independent and free.
2. **More local document formats:** Add PDF and DOCX text extraction in Web Workers, with clear warnings for scans, images, and extraction failures.
3. **Search surface with maintenance:** Generate model-specific pages from the same sourced registry, add automated link/change checks, and display a stale-data warning when a source has not been reverified on schedule.

## Starter decision

The project uses the official current `create-next-app` App Router template, TypeScript, Tailwind CSS, and the maintained shadcn CLI with Radix primitives. The older `shadcn-ui/next-template` repository is archived and explicitly deprecated in favor of the CLI, so it was not used: [shadcn Next.js installation](https://ui.shadcn.com/docs/installation/next), [archived template](https://github.com/shadcn-ui/next-template), [Next.js App Router documentation](https://nextjs.org/docs/app).

