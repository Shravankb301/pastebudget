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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PromptFit — AI Token Counter & Context Window Calculator",
    template: "%s · PromptFit",
  },
  description:
    "Count prompt tokens, check text against current AI context limits, reserve room for the answer, and split long text into safe chunks. Private and browser-only.",
  applicationName: "PromptFit",
  keywords: [
    "AI token counter",
    "context window calculator",
    "prompt token counter",
    "split text for ChatGPT",
    "Claude token counter",
    "LLM context window",
  ],
  authors: [{ name: "PromptFit" }],
  creator: "PromptFit",
  category: "technology",
  alternates: { canonical: "/" },
  icons: {
    icon: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "PromptFit — Know what fits before you paste",
    description:
      "A private token counter and context-window calculator with safe, local text splitting.",
    type: "website",
    url: "/",
    siteName: "PromptFit",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptFit — Know what fits before you paste",
    description:
      "Count prompt tokens, keep room for the answer, and split long text locally.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f5f1",
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
