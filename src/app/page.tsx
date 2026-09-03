import Link from "next/link";
import {
  ArrowRight,
  Brackets,
  CheckCircle2,
  FileStack,
  Gauge,
  LockKeyhole,
  Scissors,
} from "lucide-react";

import { PromptWorkbench } from "@/components/prompt-workbench";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatTokens, MODEL_PRESETS } from "@/lib/models";

const faq = [
  {
    question: "Does PasteBudget upload or save my prompt?",
    answer:
      "No. Token counting, file reading, and chunking happen in your browser. PasteBudget does not send prompt text to a server, write it to local storage, or include it in analytics events.",
  },
  {
    question: "Why reserve tokens for the answer?",
    answer:
      "A context window has to hold more than your new prompt. The response, earlier messages, system instructions, tool definitions, and provider overhead can all consume space. Reserving output room makes the verdict useful instead of merely optimistic.",
  },
  {
    question: "Are the token counts exact for every model?",
    answer:
      "PasteBudget uses the o200k tokenizer used by modern OpenAI models. Other providers do not publish an equivalent browser tokenizer, so their presets use the exact o200k count plus a clearly labeled 12% safety margin. Use a provider's own API counter when billing-grade precision is required.",
  },
  {
    question: "Do API context limits match ChatGPT, Claude, or Gemini subscriptions?",
    answer:
      "Not necessarily. Product plans can apply different limits, hidden instructions, attachments, and automatic compaction. PasteBudget labels its built-in limits as API presets and lets you enter a custom limit when you know the number available to your chat or tool.",
  },
  {
    question: "What does chunk overlap do?",
    answer:
      "It repeats a small tail from the previous part at the start of the next part. That continuity helps a model follow material split across multiple messages, but it also uses extra context, so keep the overlap modest.",
  },
];

const guides = [
  {
    href: "/guides/how-many-tokens-is-1000-words",
    eyebrow: "Token basics",
    title: "How many tokens is 1,000 words?",
    description: "A practical range, why language matters, and when to count instead of estimate.",
  },
  {
    href: "/guides/split-long-text-for-ai",
    eyebrow: "Long documents",
    title: "How to split long text for an AI chat",
    description: "Choose a safe chunk size, preserve structure, and carry context between parts.",
  },
  {
    href: "/guides/context-window-vs-output-limit",
    eyebrow: "Model limits",
    title: "Context window vs. output limit",
    description: "The two numbers are related, but they are not interchangeable.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#f7f5f1]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2.5" aria-label="PasteBudget home">
            <span className="flex size-8 items-center justify-center rounded-md bg-stone-950 text-white shadow-sm transition-transform group-hover:-rotate-2">
              <Brackets className="size-4" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-tight">PasteBudget</span>
          </Link>
          <nav className="flex items-center gap-1" aria-label="Primary navigation">
            <Button variant="ghost" size="sm" asChild className="hidden text-stone-600 sm:inline-flex">
              <a href="#how-it-works">How it works</a>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hidden text-stone-600 sm:inline-flex">
              <a href="#guides">Guides</a>
            </Button>
            <Button size="sm" asChild className="ml-1 bg-stone-950 text-white hover:bg-stone-800">
              <a href="#tool">Check a prompt</a>
            </Button>
          </nav>
        </div>
      </header>

      <section className="border-b border-stone-200 bg-[#f7f5f1]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end lg:px-8 lg:py-24">
          <div>
            <Badge variant="outline" className="mb-5 border-stone-300 bg-white/60 px-2.5 py-1 text-stone-700">
              <LockKeyhole className="mr-1 size-3" />
              Private · browser-only · free
            </Badge>
            <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-stone-950 sm:text-6xl lg:text-7xl">
              Know what fits before you paste.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
              Count a prompt and its files against real model limits, leave honest room for the answer, and split oversized material into clean parts—without uploading a word.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild className="bg-indigo-700 text-white shadow-sm hover:bg-indigo-600">
                <a href="#tool">
                  Measure my prompt
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-stone-300 bg-white/50">
                <a href="#how-it-works">See the method</a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-stone-300 bg-stone-300 shadow-[0_16px_50px_rgba(28,25,23,0.08)]">
            <div className="col-span-3 bg-stone-950 px-5 py-4 text-white">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-stone-400">What PasteBudget counts</p>
              <p className="mt-2 text-sm leading-6 text-stone-200">
                New input + attached text + existing chat + response reserve
              </p>
            </div>
            {[
              ["Live", "token meter"],
              ["6", "API presets"],
              ["0", "uploads"],
            ].map(([value, label]) => (
              <div key={label} className="bg-white p-4">
                <p className="font-mono text-xl font-semibold tracking-tight text-stone-950">{value}</p>
                <p className="mt-1 text-[0.68rem] uppercase tracking-wide text-stone-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <PromptWorkbench />

        <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-24" aria-labelledby="method-heading">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
            <div>
              <p className="mb-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-indigo-700">
                The method
              </p>
              <h2 id="method-heading" className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                One useful verdict, with the caveats visible.
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-stone-600">
                A raw context-window number is not your real input budget. PasteBudget subtracts the space you need for an answer and anything already in the conversation before deciding whether new material fits.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Gauge,
                  number: "01",
                  title: "Measure",
                  body: "Count the pasted text and local files together, off the main browser thread.",
                },
                {
                  icon: CheckCircle2,
                  number: "02",
                  title: "Budget",
                  body: "Reserve response space and account for earlier messages before the verdict.",
                },
                {
                  icon: Scissors,
                  number: "03",
                  title: "Split",
                  body: "Turn long material into labeled parts at paragraph or sentence boundaries.",
                },
              ].map((item) => (
                <Card key={item.title} className="border-stone-300/80 bg-white shadow-none">
                  <CardHeader>
                    <div className="mb-5 flex items-center justify-between">
                      <span className="flex size-9 items-center justify-center rounded-md bg-indigo-50 text-indigo-700">
                        <item.icon className="size-4" />
                      </span>
                      <span className="font-mono text-xs text-stone-400">{item.number}</span>
                    </div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-stone-600">{item.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-stone-300/70 py-16 sm:py-20" aria-labelledby="models-heading">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-indigo-700">
                Current references
              </p>
              <h2 id="models-heading" className="text-3xl font-semibold tracking-tight">
                Model limits with receipts.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-stone-600">
              Presets are sourced from provider documentation. Limits can change, so every row links back to the current source.
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-stone-300 bg-white">
            <div className="hidden grid-cols-[1.2fr_1fr_0.7fr_0.7fr_56px] border-b border-stone-200 bg-stone-50 px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-wide text-stone-500 md:grid">
              <span>Model</span>
              <span>Provider</span>
              <span>Context</span>
              <span>Max output</span>
              <span className="text-right">Source</span>
            </div>
            {MODEL_PRESETS.map((model, index) => (
              <div
                key={model.id}
                className={`grid gap-3 px-5 py-4 text-sm md:grid-cols-[1.2fr_1fr_0.7fr_0.7fr_56px] md:items-center ${
                  index < MODEL_PRESETS.length - 1 ? "border-b border-stone-200" : ""
                }`}
              >
                <span className="font-medium text-stone-950">{model.name}</span>
                <span className="text-stone-500">{model.provider}</span>
                <span className="font-mono tabular-nums">{formatTokens(model.contextWindow)}</span>
                <span className="font-mono tabular-nums">
                  {model.maxOutput ? formatTokens(model.maxOutput) : "Not stated"}
                </span>
                <a
                  href={model.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="justify-self-start font-medium text-indigo-700 underline-offset-4 hover:underline md:justify-self-end"
                  aria-label={`Open official source for ${model.name}`}
                >
                  Open
                </a>
              </div>
            ))}
          </div>
        </section>

        <section id="guides" className="scroll-mt-24 py-16 sm:py-24" aria-labelledby="guides-heading">
          <div className="mb-8">
            <p className="mb-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-indigo-700">
              Practical guides
            </p>
            <h2 id="guides-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Use the limit well, not just fully.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {guides.map((guide) => (
              <Link key={guide.href} href={guide.href} className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                <Card className="h-full border-stone-300/80 bg-white shadow-none transition-transform group-hover:-translate-y-0.5 group-hover:border-indigo-300">
                  <CardHeader>
                    <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-indigo-700">
                      {guide.eyebrow}
                    </p>
                    <CardTitle className="pt-2 text-lg leading-6">{guide.title}</CardTitle>
                    <CardDescription className="pt-1 leading-6">{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-800">
                      Read guide
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-10 border-t border-stone-300/70 py-16 sm:py-20 lg:grid-cols-[0.7fr_1.3fr]" aria-labelledby="faq-heading">
          <div>
            <p className="mb-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-indigo-700">
              Good to know
            </p>
            <h2 id="faq-heading" className="text-3xl font-semibold tracking-tight">Plain answers.</h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-stone-600">
              PasteBudget is designed to be conservative about both context and privacy.
            </p>
          </div>
          <Accordion type="single" collapsible className="border-t border-stone-300">
            {faq.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`} className="border-stone-300">
                <AccordionTrigger className="text-left text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-3xl pr-8 text-sm leading-7 text-stone-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>

      <section className="border-t border-stone-800 bg-stone-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-md border border-white/20 bg-white/10">
                <Brackets className="size-4" />
              </span>
              <span className="font-semibold">PasteBudget</span>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-6 text-stone-400">
              A small, private utility for making better use of finite context. No account, no backend, no prompt collection.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stone-400">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <a href="#tool" className="hover:text-white">Tool</a>
            <span className="inline-flex items-center gap-1.5">
              <FileStack className="size-3.5" />
              Files stay local
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
