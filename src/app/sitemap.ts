import type { MetadataRoute } from "next";
import { getAllModels } from "@/data/models";
import { routing } from "@/i18n/routing";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3100";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/models", "/compare"];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "daily",
        priority: path === "" ? 1 : 0.8,
      });
    }

    for (const model of getAllModels()) {
      entries.push({
        url: `${siteUrl}/${locale}/models/${model.slug}`,
        lastModified: new Date(model.lastUpdated),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
