import { describe, expect, it } from "vitest";

import { sanitizeAnalyticsEvent } from "./vercel-analytics";

describe("sanitizeAnalyticsEvent", () => {
  it("removes query strings and fragments from page views", () => {
    expect(
      sanitizeAnalyticsEvent({
        type: "pageview",
        url: "https://www.pastebudget.com/guides/token-basics?ref=x#example",
      }),
    ).toEqual({
      type: "pageview",
      url: "https://www.pastebudget.com/guides/token-basics",
    });
  });

  it("preserves a clean public URL", () => {
    expect(
      sanitizeAnalyticsEvent({
        type: "pageview",
        url: "https://www.pastebudget.com/privacy",
      }),
    ).toEqual({
      type: "pageview",
      url: "https://www.pastebudget.com/privacy",
    });
  });

  it("drops malformed event URLs", () => {
    expect(
      sanitizeAnalyticsEvent({ type: "pageview", url: "not a valid URL" }),
    ).toBeNull();
  });
});
