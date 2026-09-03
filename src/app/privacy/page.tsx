import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Brackets, LockKeyhole, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How PasteBudget handles prompts, files, browser storage, and analytics.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f7f5f1]">
      <header className="border-b border-stone-200">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="PasteBudget home">
            <span className="flex size-8 items-center justify-center rounded-md bg-stone-950 text-white">
              <Brackets className="size-4" />
            </span>
            <span className="font-semibold tracking-tight">PasteBudget</span>
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-950">
          <ArrowLeft className="size-3.5" />
          Back to PasteBudget
        </Link>
        <div className="flex size-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
          <ShieldCheck className="size-5" />
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">Privacy, in plain language.</h1>
        <p className="mt-5 text-lg leading-8 text-stone-600">
          PasteBudget is designed so the sensitive part of the product—the material you measure—does not need a backend.
        </p>

        <div className="mt-12 space-y-10 border-t border-stone-300 pt-10 text-stone-700">
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-stone-950">
              <LockKeyhole className="size-4 text-indigo-700" />
              Prompts and files
            </h2>
            <p className="mt-3 leading-7">
              Text you paste and files you choose are read in your browser tab. Token counting and chunking run there too. PasteBudget does not upload, store, log, or transmit their contents. Closing or refreshing the tab clears the working material.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-stone-950">Browser storage</h2>
            <p className="mt-3 leading-7">
              PasteBudget does not put prompt text or file contents in local storage, IndexedDB, cookies, or a service worker cache. The application code and static pages may be cached normally by your browser or hosting provider.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-stone-950">Analytics</h2>
            <p className="mt-3 leading-7">
              The interface exposes analytics-ready events for actions such as loading the sample or creating chunks. Those events are restricted to coarse counts and settings. They are explicitly designed not to include prompt text, file names, or file contents. No analytics service is enabled by default.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-stone-950">Shared and downloaded results</h2>
            <p className="mt-3 leading-7">
              A copied fit report contains model and token counts, not your input. Downloaded chunks do contain the text you provided because they are the output you requested; they are created locally and saved through your browser.
            </p>
          </section>
        </div>
        <p className="mt-12 text-xs text-stone-500">Last updated September 2, 2026.</p>
      </article>
    </main>
  );
}
