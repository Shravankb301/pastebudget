import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Brackets, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getGuide, GUIDES } from "@/lib/guides";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      url: `/guides/${guide.slug}`,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <main className="min-h-screen bg-[#f7f5f1]">
      <header className="border-b border-stone-200">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="PromptFit home">
            <span className="flex size-8 items-center justify-center rounded-md bg-stone-950 text-white">
              <Brackets className="size-4" />
            </span>
            <span className="font-semibold tracking-tight">PromptFit</span>
          </Link>
          <Button size="sm" asChild className="bg-stone-950 text-white hover:bg-stone-800">
            <Link href="/#tool">Check a prompt</Link>
          </Button>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
        <Link
          href="/#guides"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-stone-600 underline-offset-4 hover:text-stone-950 hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          All guides
        </Link>
        <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-indigo-700">
          {guide.eyebrow}
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-[-0.035em] text-stone-950 sm:text-5xl">
          {guide.title}
        </h1>
        <p className="mt-6 text-pretty text-lg leading-8 text-stone-600">{guide.intro}</p>

        <div className="mt-12 space-y-12 border-t border-stone-300 pt-12">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-950">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-stone-700">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.bullets && (
                <ul className="mt-5 space-y-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-stone-700">
                      <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                        <Check className="size-2.5" />
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <aside className="mt-14 rounded-xl bg-stone-950 p-6 text-white sm:p-8">
          <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Skip the guesswork
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Measure the actual text.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-stone-300">
            PromptFit counts locally, keeps space for the answer, and splits long material without uploading it.
          </p>
          <Button asChild className="mt-6 bg-white text-stone-950 hover:bg-stone-200">
            <Link href="/#tool">
              Open PromptFit
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </aside>
      </article>
    </main>
  );
}

