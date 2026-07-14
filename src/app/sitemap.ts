import type { MetadataRoute } from "next";
import { PLATFORMS } from "@/lib/platforms";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const platformRoutes = PLATFORMS.map((platform) => ({
    url: absoluteUrl(`/download/${platform.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const legalRoutes = [
    "/about",
    "/privacy",
    "/terms",
    "/cookies",
    "/contact",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...platformRoutes,
    ...legalRoutes,
  ];
}
