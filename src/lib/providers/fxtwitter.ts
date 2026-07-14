import type { DownloadOption, MediaResult } from "../types";
import { buildResult, fetchWithTimeout, ProviderError } from "./utils";

interface FxTwitterResponse {
  code: number;
  message?: string;
  tweet?: {
    text?: string;
    author?: { name?: string; screen_name?: string };
    media?: {
      videos?: Array<{
        url?: string;
        thumbnail_url?: string;
        duration?: number;
        variants?: Array<{
          url: string;
          content_type?: string;
          bitrate?: number;
        }>;
      }>;
      photos?: Array<{ url?: string }>;
    };
  };
}

function parseStatusUrl(url: string): { user: string; id: string } | null {
  const match = url.match(/(?:twitter\.com|x\.com)\/([^/]+)\/status\/(\d+)/i);
  if (!match) return null;
  return { user: match[1], id: match[2] };
}

export async function downloadWithFxTwitter(url: string): Promise<MediaResult> {
  const parsed = parseStatusUrl(url);
  if (!parsed) {
    throw new ProviderError("Not a valid X/Twitter status URL.");
  }

  const endpoints = [
    `https://api.fxtwitter.com/${parsed.user}/status/${parsed.id}`,
    `https://api.vxtwitter.com/${parsed.user}/status/${parsed.id}`,
  ];

  let lastError = "Unable to resolve tweet media.";
  for (const endpoint of endpoints) {
    try {
      const res = await fetchWithTimeout(endpoint, {}, 12_000);
      if (!res.ok) {
        lastError = `fxtwitter HTTP ${res.status}`;
        continue;
      }
      const json = (await res.json()) as FxTwitterResponse;
      if (json.code !== 200 || !json.tweet) {
        lastError = json.message || "Tweet not found.";
        continue;
      }

      const tweet = json.tweet;
      const options: DownloadOption[] = [];
      const videos = tweet.media?.videos ?? [];

      for (const [vi, video] of videos.entries()) {
        const variants = (video.variants || [])
          .filter(
            (v) => v.url && (!v.content_type || v.content_type.includes("mp4")),
          )
          .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

        if (variants.length) {
          variants.forEach((variant, index) => {
            const mbps = variant.bitrate
              ? `${Math.round(variant.bitrate / 1000)} kbps`
              : undefined;
            options.push({
              id: `fx-v-${vi}-${index}`,
              label: index === 0 ? "Best video" : `Video quality ${index + 1}`,
              quality: mbps || "mp4",
              format: "mp4",
              kind: "video" as const,
              url: variant.url,
              proxied: true,
            });
          });
        } else if (video.url) {
          options.push({
            id: `fx-v-${vi}`,
            label: "Video",
            quality: "mp4",
            format: "mp4",
            kind: "video" as const,
            url: video.url,
            proxied: true,
          });
        }
      }

      (tweet.media?.photos || []).forEach((photo, i) => {
        if (!photo.url) return;
        options.push({
          id: `fx-p-${i}`,
          label: `Photo ${i + 1}`,
          quality: "original",
          format: "jpg",
          kind: "photo" as const,
          url: photo.url,
          proxied: false,
        });
      });

      return buildResult({
        platform: "twitter",
        title: tweet.text?.slice(0, 120) || "X post media",
        author: tweet.author?.name || tweet.author?.screen_name,
        thumbnail: videos[0]?.thumbnail_url,
        duration: videos[0]?.duration,
        options,
        provider: endpoint.includes("vxtwitter") ? "vxtwitter" : "fxtwitter",
        sourceUrl: url,
      });
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Request failed";
    }
  }

  throw new ProviderError(lastError);
}
