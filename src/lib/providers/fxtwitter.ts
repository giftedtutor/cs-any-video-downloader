import { withSortedOptions } from "../quality";
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
          const ascending = [...variants].sort(
            (a, b) => (a.bitrate || 0) - (b.bitrate || 0),
          );
          ascending.forEach((variant, index) => {
            const kbps = variant.bitrate
              ? Math.round(variant.bitrate / 1000)
              : 0;
            let label = `Video · quality ${index + 1}`;
            let quality = String(kbps || index + 1);
            if (index === 0) {
              label = "Low quality";
              quality = "360";
            } else if (index === ascending.length - 1) {
              label = ascending.length > 2 ? "High quality" : "Better quality";
              quality = ascending.length > 2 ? "1080" : "720";
            } else if (index === Math.floor(ascending.length / 2)) {
              label = "Standard quality";
              quality = "480";
            } else {
              label = `Medium · ${kbps || index + 1} kbps`;
              quality = String(480 + index * 40);
            }
            options.push({
              id: `fx-v-${vi}-${index}`,
              label,
              quality,
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
            quality: "720",
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

      return withSortedOptions(
        buildResult({
          platform: "twitter",
          title: tweet.text?.slice(0, 120) || "X post media",
          author: tweet.author?.name || tweet.author?.screen_name,
          thumbnail: videos[0]?.thumbnail_url,
          duration: videos[0]?.duration,
          options,
          provider: "cs-downloader",
          sourceUrl: url,
        }),
      );
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Request failed";
    }
  }

  throw new ProviderError(lastError);
}
