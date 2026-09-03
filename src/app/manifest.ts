import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PasteBudget",
    short_name: "PasteBudget",
    description: "Private token counter and context-window calculator.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5f1",
    theme_color: "#f7f5f1",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
