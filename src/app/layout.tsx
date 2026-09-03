import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
const siteAsset = (path: string) => `${siteUrl.replace(/\/$/, "")}${path}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PasteBudget — See If Your AI Prompt Actually Fits",
    template: "%s · PasteBudget",
  },
  description:
    "See what actually fits after prior messages and answer space, then split oversized prompts into safe, paste-ready parts. Private and browser-only.",
  applicationName: "PasteBudget",
  keywords: [
    "AI token counter",
    "context window calculator",
    "prompt token counter",
    "split text for ChatGPT",
    "Claude token counter",
    "LLM context window",
  ],
  authors: [{ name: "PasteBudget" }],
  creator: "PasteBudget",
  category: "technology",
  alternates: { canonical: siteUrl },
  icons: {
    icon: siteAsset("/icon.svg"),
  },
  manifest: siteAsset("/manifest.webmanifest"),
  openGraph: {
    title: "PasteBudget — Your context window is not your paste budget",
    description:
      "See what actually fits after prior messages and answer space, then fix oversized prompts locally.",
    type: "website",
    url: siteUrl,
    siteName: "PasteBudget",
    images: [{ url: siteAsset("/opengraph-image"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PasteBudget — Your context window is not your paste budget",
    description:
      "See the real room left for your prompt, protect the answer, and split long text locally.",
    images: [siteAsset("/opengraph-image")],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1715",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth antialiased`}>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
