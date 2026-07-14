import type { DownloadOption, MediaResult } from "../types";
import { buildResult, fetchWithTimeout, ProviderError } from "./utils";

interface TikwmResponse {
  code: number;
  msg?: string;
  data?: {
    title?: string;
    author?: { nickname?: string; unique_id?: string };
    cover?: string;
    origin_cover?: string;
    duration?: number;
    play?: string;
    hdplay?: string;
    wmplay?: string;
    music?: string;
    music_info?: { title?: string };
    images?: string[];
  };
}

export async function downloadWithTikwm(url: string): Promise<MediaResult> {
  const endpoints = [
    `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`,
    `https://tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`,
  ];

  let lastError = "TikWM could not resolve this TikTok.";
  for (const endpoint of endpoints) {
    try {
      const res = await fetchWithTimeout(
        endpoint,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `url=${encodeURIComponent(url)}&hd=1`,
        },
        15_000,
      );
      if (!res.ok) {
        lastError = `TikWM HTTP ${res.status}`;
        continue;
      }

      const json = (await res.json()) as TikwmResponse;
      if (json.code !== 0 || !json.data) {
        lastError = json.msg || "TikWM could not resolve this TikTok.";
        continue;
      }

      const data = json.data;
      const options: DownloadOption[] = [];

      if (data.hdplay) {
        options.push({
          id: "tikwm-hd",
          label: "HD · no watermark",
          quality: "HD",
          format: "mp4",
          kind: "video",
          url: data.hdplay,
          proxied: true,
        });
      }
      if (data.play) {
        options.push({
          id: "tikwm-sd",
          label: "Standard · no watermark",
          quality: "SD",
          format: "mp4",
          kind: "video",
          url: data.play,
          proxied: true,
        });
      }
      if (data.wmplay) {
        options.push({
          id: "tikwm-wm",
          label: "With watermark",
          quality: "wm",
          format: "mp4",
          kind: "video",
          url: data.wmplay,
          proxied: true,
        });
      }
      if (data.music) {
        options.push({
          id: "tikwm-audio",
          label: data.music_info?.title || "Original sound",
          quality: "audio",
          format: "mp3",
          kind: "audio",
          url: data.music,
          proxied: true,
        });
      }
      if (data.images?.length) {
        data.images.forEach((img, i) => {
          options.push({
            id: `tikwm-img-${i}`,
            label: `Slide ${i + 1}`,
            quality: "original",
            format: "jpg",
            kind: "photo",
            url: img,
            proxied: true,
          });
        });
      }

      return buildResult({
        platform: "tiktok",
        title: data.title || "TikTok video",
        author: data.author?.nickname || data.author?.unique_id,
        thumbnail: data.cover || data.origin_cover,
        duration: data.duration,
        options,
        provider: "tikwm",
        sourceUrl: url,
      });
    } catch (err) {
      lastError = err instanceof Error ? err.message : "TikWM request failed";
    }
  }

  throw new ProviderError(lastError);
}
