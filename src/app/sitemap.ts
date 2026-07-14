import type { MetadataRoute } from "next";
import { PLATFORMS } from "@/lib/platforms";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const platformRoutes = PLATFORMS.map((platform) => ({
    url: absoluteUrl(`/download/${platform.slug}`),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const legalRoutes: MetadataRoute.Sitemap = [
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.65 },
    { path: "/privacy", priority: 0.5 },
    { path: "/terms", priority: 0.5 },
    { path: "/cookies", priority: 0.45 },
  ].map((item) => ({
    url: absoluteUrl(item.path),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: item.priority,
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    ...platformRoutes,
    ...legalRoutes,
  ];
}
