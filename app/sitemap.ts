import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://error-logs.bookchaowalit.com/", changeFrequency: "monthly", priority: 1 }];
}
