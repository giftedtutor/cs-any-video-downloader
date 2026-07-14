import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f7fafb",
    theme_color: "#0f7a6c",
    orientation: "any",
    categories: ["utilities", "entertainment"],
    icons: [
      {
        src: absoluteUrl("/icon"),
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
