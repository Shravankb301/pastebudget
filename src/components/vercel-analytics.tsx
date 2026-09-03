"use client";

import { Analytics } from "@vercel/analytics/next";

import { sanitizeAnalyticsEvent } from "@/lib/vercel-analytics";

export function VercelAnalytics() {
  if (process.env.NODE_ENV !== "production") return null;

  return <Analytics beforeSend={sanitizeAnalyticsEvent} />;
}
