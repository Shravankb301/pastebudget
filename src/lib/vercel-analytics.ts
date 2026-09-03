import type { BeforeSendEvent } from "@vercel/analytics/next";

export function sanitizeAnalyticsEvent(
  event: BeforeSendEvent,
): BeforeSendEvent | null {
  try {
    const url = new URL(event.url);
    url.search = "";
    url.hash = "";

    return { ...event, url: url.toString() };
  } catch {
    return null;
  }
}
