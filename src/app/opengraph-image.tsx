import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          CS Any Video Downloader
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 950,
            }}
          >
            Download any public video from a link
          </div>
          <div style={{ fontSize: 28, color: "#3d4b5c", maxWidth: 820 }}>
            YouTube · TikTok · Instagram · Facebook · X — works on mobile &
            desktop
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
