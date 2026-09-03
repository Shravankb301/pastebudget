# PasteBudget

PasteBudget is a private token counter and context-window calculator. Paste a prompt, add text-based files, choose a current API model or custom limit, reserve room for the answer, and create paste-ready chunks when the material is too large.

Everything sensitive runs in the browser. There is no account, database, prompt upload, or AI API call.

## What ships in the MVP

- Live o200k token counting in a Web Worker so large pastes do not block typing
- Current documented API presets for OpenAI, Anthropic, Google, and xAI models
- Clearly labeled conservative estimates for providers without a public browser tokenizer
- Response reserve and existing-context controls
- Local reading of common text, data, and source-code files
- Structure-aware chunking with overlap, per-part copy, and Markdown download
- Privacy-safe fit reports containing counts but no prompt content
- Responsive utility UI built with the current shadcn/ui CLI and accessible Radix primitives
- Metadata, generated Open Graph image, web manifest, sitemap, robots rules, privacy page, and three search-intent guides
- Analytics-ready events that explicitly exclude prompt text, file names, and file contents
- Production security headers including a restrictive connection policy

## Run locally

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify

```bash
npm run check
```

The check runs lint, TypeScript, unit tests, and a production build.

## Deploy

### Vercel

1. Push this directory to a Git repository.
2. Import the repository in Vercel; the framework is detected as Next.js.
3. Set `NEXT_PUBLIC_SITE_URL` to the final canonical URL, such as `https://your-domain.example`.
4. Deploy. No other environment variables or services are required.

The app also works on any host that supports a standard Next.js production build:

```bash
npm run build
npm run start
```

## Privacy boundary

Prompt text and selected files stay in the current browser tab. They are not written to browser storage. The Content Security Policy restricts production connections to the site's own origin. If analytics is added later, keep the event contract in `src/lib/analytics.ts` and do not add prompt text, file names, file contents, or hashes derived from that content.

## Updating model limits

Model presets live in `src/lib/models.ts`. Every preset includes a first-party source URL and the UI shows the last verification date. Re-check provider documentation before changing a context or output limit.

## Product and distribution notes

The research shortlist, scoring, product thesis, acquisition plan, content ideas, and next improvements are in [PRODUCT_RESEARCH.md](./PRODUCT_RESEARCH.md).
