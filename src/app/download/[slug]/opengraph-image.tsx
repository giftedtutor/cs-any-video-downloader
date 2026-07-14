import { ImageResponse } from "next/og";
import { getPlatformBySlug, PLATFORMS } from "@/lib/platforms";
import { siteConfig } from "@/lib/seo";

export const alt = "Platform downloader Open Graph image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return PLATFORMS.map((platform) => ({ slug: platform.slug }));
}

export default async function PlatformOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const platform = getPlatformBySlug(slug);
  const name = platform?.name ?? "Video";
  const color = platform?.color ?? "#0f7a6c";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "linear-gradient(135deg, #eef3f6 0%, #f7fafb 45%, #d9ece8 100%)",
          color: "#15202b",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "#0f7a6c",
            }}
          />
          <span>{siteConfig.name}</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 28,
              color: "#3d4b5c",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: color,
              }}
            />
            <span>{name}</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 980,
            }}
          >
            Free {name} video downloader
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#3d4b5c",
              maxWidth: 860,
            }}
          >
            Paste a public {name} link · Save MP4 on mobile or desktop
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
