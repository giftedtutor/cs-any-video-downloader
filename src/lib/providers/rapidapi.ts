import type { DownloadOption, MediaResult } from "../types";
import { buildResult, fetchWithTimeout, ProviderError } from "./utils";

/**
 * Optional RapidAPI free-tier providers.
 * Set RAPIDAPI_KEY in .env to enable. Quotas vary by API plan.
 */
export async function downloadWithRapidApi(
  url: string,
): Promise<MediaResult | null> {
  const key = process.env.RAPIDAPI_KEY?.trim();
  if (!key) return null;

  const attempts: Array<{
    host: string;
    path: string;
    buildBody: () => BodyInit;
    map: (json: unknown) => MediaResult | null;
  }> = [
    {
      host: "social-download-all-in-one.p.rapidapi.com",
      path: "/v1/social/autolink",
      buildBody: () => JSON.stringify({ url }),
      map: (json) => mapAllInOne(json, url),
    },
    {
      host: "youtube-media-downloader.p.rapidapi.com",
      path: `/v2/video/details?videoId=${extractYtId(url) ?? ""}`,
      buildBody: () => "",
      map: (json) => mapYtRapid(json, url),
    },
  ];

  for (const attempt of attempts) {
    if (attempt.host.includes("youtube") && !extractYtId(url)) continue;
    try {
      const method = attempt.buildBody() ? "POST" : "GET";
      const res = await fetchWithTimeout(
        `https://${attempt.host}${attempt.path}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-key": key,
            "x-rapidapi-host": attempt.host,
          },
          body: method === "POST" ? attempt.buildBody() : undefined,
        },
        16_000,
      );
      if (!res.ok) continue;
      const json = await res.json();
      const mapped = attempt.map(json);
      if (mapped) return mapped;
    } catch {
      // try next
    }
  }
  return null;
}

function extractYtId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

function mapAllInOne(json: unknown, sourceUrl: string): MediaResult | null {
  const data = json as {
    title?: string;
    author?: string;
    thumbnail?: string | string[];
    duration?: number;
    medias?: Array<{
      url?: string;
      quality?: string;
      extension?: string;
      type?: string;
    }>;
    error?: boolean;
  };
  if (!data || data.error || !data.medias?.length) return null;

  const thumb = Array.isArray(data.thumbnail)
    ? data.thumbnail[0]
    : data.thumbnail;

  return buildResult({
    platform: "unknown",
    title: data.title || "Downloaded media",
    author: data.author,
    thumbnail: thumb,
    duration: data.duration,
    provider: "rapidapi-all-in-one",
    sourceUrl,
    options: data.medias
      .filter((m) => m.url)
      .map((m, i) => ({
        id: `rapid-${i}`,
        label: m.quality || m.type || `Option ${i + 1}`,
        quality: m.quality,
        format: m.extension || "mp4",
        kind:
          m.type === "audio"
            ? ("audio" as const)
            : m.type === "image"
              ? ("photo" as const)
              : ("video" as const),
        url: m.url!,
        proxied: true,
      })),
  });
}

function mapYtRapid(json: unknown, sourceUrl: string): MediaResult | null {
  const data = json as {
    title?: string;
    channel?: { name?: string };
    thumbnail?: { url?: string } | string;
    videos?: { items?: Array<{ url?: string; quality?: string; sizeText?: string }> };
    audios?: { items?: Array<{ url?: string; quality?: string }> };
  };
  if (!data?.title) return null;

  const options: DownloadOption[] = [];
  for (const [i, item] of (data.videos?.items || []).entries()) {
    if (!item.url) continue;
    options.push({
      id: `yt-rapid-v-${i}`,
      label: item.quality || `Video ${i + 1}`,
      quality: item.quality,
      format: "mp4",
      kind: "video" as const,
      url: item.url,
      proxied: true,
    });
  }
  for (const [i, item] of (data.audios?.items || []).entries()) {
    if (!item.url) continue;
    options.push({
      id: `yt-rapid-a-${i}`,
      label: item.quality || `Audio ${i + 1}`,
      quality: item.quality,
      format: "mp3",
      kind: "audio" as const,
      url: item.url,
      proxied: true,
    });
  }
  if (!options.length) return null;

  const thumb =
    typeof data.thumbnail === "string"
      ? data.thumbnail
      : data.thumbnail?.url;

  try {
    return buildResult({
      platform: "youtube",
      title: data.title,
      author: data.channel?.name,
      thumbnail: thumb,
      provider: "rapidapi-youtube",
      sourceUrl,
      options,
    });
  } catch {
    throw new ProviderError("RapidAPI YouTube returned empty formats.");
  }
}
