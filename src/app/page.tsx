import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Brackets,
  CheckCircle2,
  FileStack,
  Gauge,
  LockKeyhole,
  Scissors,
  ShieldCheck,
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
    <main className="bg-[#f2f4ee] text-[#12201d]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d1715]/95 text-white backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2.5" aria-label="PasteBudget home">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#d9ff72] text-[#10231f] shadow-sm transition-transform group-hover:-rotate-2">
              <Brackets className="size-4" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-[-0.02em]">PasteBudget</span>
          </Link>
          <nav className="flex items-center gap-1" aria-label="Primary navigation">
            <Button variant="ghost" size="sm" asChild className="hidden text-stone-300 hover:bg-white/10 hover:text-white sm:inline-flex">
              <a href="#how-it-works">How it works</a>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hidden text-stone-300 hover:bg-white/10 hover:text-white sm:inline-flex">
              <a href="#guides">Guides</a>
            </Button>
            <Button size="sm" asChild className="ml-1 bg-[#d9ff72] font-semibold text-[#10231f] hover:bg-[#caff45]">
              <a href="#tool">Try it now</a>
            </Button>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#0d1715] pb-16 text-white sm:pb-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "linear-gradient(to bottom, black, transparent 82%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center lg:px-8">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-5 border-white/15 bg-white/5 px-3 py-1 text-stone-200">
              <LockKeyhole className="mr-1 size-3 text-[#d9ff72]" />
              Private in-browser context calculator
            </Badge>
            <h1 className="text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">
              Your context window is not your paste budget.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-stone-300 sm:text-lg">
              See what actually fits after prior messages and answer space. If it’s too large, turn it into safe, paste-ready parts in one click.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-stone-300">
              {["Real API limits", "Local file reading", "No prompt upload"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <CheckCircle2 className="size-3.5 text-[#d9ff72]" />
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild className="bg-[#d9ff72] font-semibold text-[#10231f] shadow-sm hover:bg-[#caff45]">
                <a href="#tool">
                  Check my real budget
                  <ArrowDown className="size-4" />
                </a>
              </Button>
              <Button size="lg" variant="ghost" asChild className="text-stone-200 hover:bg-white/10 hover:text-white">
                <a href="#tool">Use the demo below</a>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#14221f] shadow-[0_30px_90px_rgba(0,0,0,0.32)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#a8cbbf]">
                  The 200K context trap
                </p>
                <p className="mt-1 text-sm font-medium text-white">Claude Haiku 4.5</p>
              </div>
              <span className="rounded-full bg-[#ffded7] px-2.5 py-1 text-xs font-semibold text-[#832f24]">
                Won’t fit
              </span>
            </div>
            <div className="space-y-4 p-5">
              <div className="space-y-2.5 text-sm">
                {[
                  ["Published context window", "200,000"],
                  ["Already used by the chat", "−191,850"],
                  ["Protected for the answer", "−8,000"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 text-stone-300">
                    <span>{label}</span>
                    <span className="font-mono tabular-nums text-white">{value}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-stone-400">Actual room for new material</p>
                    <p className="mt-1 font-mono text-3xl font-semibold text-[#d9ff72]">150</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-stone-400">Example needs</p>
                    <p className="mt-1 font-mono text-xl font-semibold text-[#ff9b86]">≈161</p>
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-full rounded-full bg-[#ff8068]" />
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-[#d9ff72]/20 bg-[#d9ff72]/10 p-3">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#d9ff72]" />
                <div>
                  <p className="text-sm font-semibold text-white">PasteBudget catches the 11-token overflow.</p>
                  <p className="mt-1 text-xs leading-5 text-stone-300">Then it makes 2 safe parts without uploading the text.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-8 max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <div className="rounded-3xl border border-stone-300/80 bg-[#f8f9f5] p-4 shadow-[0_30px_90px_rgba(20,32,30,0.12)] sm:p-6 lg:p-8">
        <PromptWorkbench />
        </div>

        <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-24" aria-labelledby="method-heading">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
            <div>
              <p className="mb-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#0b6b5f]">
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
                      <span className="flex size-9 items-center justify-center rounded-md bg-[#e9f7f2] text-[#0b6b5f]">
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
              <p className="mb-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#0b6b5f]">
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
                  className="justify-self-start font-medium text-[#0b6b5f] underline-offset-4 hover:underline md:justify-self-end"
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
            <p className="mb-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#0b6b5f]">
              Practical guides
            </p>
            <h2 id="guides-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Use the limit well, not just fully.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {guides.map((guide) => (
              <Link key={guide.href} href={guide.href} className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b6b5f] focus-visible:ring-offset-2">
                <Card className="h-full border-stone-300/80 bg-white shadow-none transition-transform group-hover:-translate-y-0.5 group-hover:border-[#77c7b5]">
                  <CardHeader>
                    <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#0b6b5f]">
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
            <p className="mb-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#0b6b5f]">
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
