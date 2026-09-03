export type AnalyticsEvent =
  | "sample_loaded"
  | "file_added"
  | "fit_report_copied"
  | "chunks_created"
  | "chunk_copied"
  | "chunks_downloaded";

export function trackEvent(
  name: AnalyticsEvent,
  properties: Record<string, string | number | boolean> = {},
) {
  if (typeof window === "undefined") return;

  // Never include prompt text, file names, or file contents in analytics.
  window.dispatchEvent(
    new CustomEvent("pastebudget:analytics", {
      detail: { name, properties },
    }),
  );

  const plausible = (
    window as typeof window & {
      plausible?: (event: string, options?: { props: typeof properties }) => void;
    }
  ).plausible;

  plausible?.(name, { props: properties });
}
