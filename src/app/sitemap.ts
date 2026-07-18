import type { MetadataRoute } from "next";
import { getAllModels } from "@/data/models";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3100";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/models", "/compare", "/score"];
  return [
    ...staticPaths.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: (path === "" ? "weekly" : "daily") as
        | "weekly"
        | "daily",
      priority: path === "" ? 1 : 0.8,
    })),
    ...getAllModels().map((model) => ({
      url: `${siteUrl}/models/${model.slug}`,
      lastModified: new Date(model.lastUpdated),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
