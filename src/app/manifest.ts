import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PasteBudget",
    short_name: "PasteBudget",
    description:
      "See your real AI paste budget and split oversized prompts locally.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f4ee",
    theme_color: "#0d1715",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
