import type { MetadataRoute } from "next";

// GEO-friendly: explicitly welcome AI answer-engine crawlers alongside search.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"], allow: "/" },
    ],
    sitemap: "https://nazaara.studio/sitemap.xml",
  };
}
