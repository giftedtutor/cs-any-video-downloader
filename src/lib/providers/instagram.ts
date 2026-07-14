import type { MediaResult } from "../types";
import {
  buildResult,
  decodeHtmlEntities,
  extractFirstMatch,
  fetchWithTimeout,
  ProviderError,
} from "./utils";

function extractShortcode(url: string): string | null {
  const match = url.match(
    /instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i,
  );
  return match?.[1] ?? null;
}

export async function downloadWithInstagramEmbed(
  url: string,
): Promise<MediaResult> {
  const shortcode = extractShortcode(url);
  if (!shortcode) {
    throw new ProviderError("Not a valid Instagram post/reel URL.");
  }

  const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
  const res = await fetchWithTimeout(
    embedUrl,
    {
      headers: {
        Accept: "text/html",
        Referer: "https://www.instagram.com/",
      },
    },
    14_000,
  );
  if (!res.ok) throw new ProviderError(`Instagram embed HTTP ${res.status}`);

  const html = await res.text();

  const videoUrl = extractFirstMatch(html, [
    /"video_url"\s*:\s*"([^"]+)"/,
    /property="og:video"\s+content="([^"]+)"/,
    /<video[^>]+src="([^"]+)"/,
  ]);

  const thumbnail = extractFirstMatch(html, [
    /"display_url"\s*:\s*"([^"]+)"/,
    /property="og:image"\s+content="([^"]+)"/,
  ]);

  const caption =
    extractFirstMatch(html, [
      /"caption"\s*:\s*"([^"]+)"/,
      /property="og:title"\s+content="([^"]+)"/,
    ]) || "Instagram media";

  const author = extractFirstMatch(html, [
    /"owner"\s*:\s*\{[^}]*"username"\s*:\s*"([^"]+)"/,
    /@"([^"]+)"/,
  ]);

  if (!videoUrl) {
    // Photo post fallback from og:image
    if (thumbnail) {
      return buildResult({
        platform: "instagram",
        title: decodeHtmlEntities(caption).slice(0, 140),
        author: author || undefined,
        thumbnail,
        options: [
          {
            id: "ig-photo",
            label: "Photo",
            quality: "original",
            format: "jpg",
            kind: "photo",
            url: thumbnail,
            proxied: true,
          },
        ],
        provider: "instagram-embed",
        sourceUrl: url,
      });
    }
    throw new ProviderError("No media found in Instagram embed.");
  }

  return buildResult({
    platform: "instagram",
    title: decodeHtmlEntities(caption).slice(0, 140),
    author: author || undefined,
    thumbnail: thumbnail || undefined,
    options: [
      {
        id: "ig-video",
        label: "Video",
        quality: "best",
        format: "mp4",
        kind: "video",
        url: videoUrl,
        proxied: true,
      },
    ],
    provider: "instagram-embed",
    sourceUrl: url,
  });
}
