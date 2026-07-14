import type { DownloadOption, MediaResult, PlatformId } from "../types";
import {
  labelForQuality,
  withSortedOptions,
} from "../quality";
import { buildResult, fetchWithTimeout, ProviderError } from "./utils";

interface CobaltTunnel {
  status: "tunnel" | "redirect";
  url: string;
  filename?: string;
}

interface CobaltPicker {
  status: "picker";
  audio?: string;
  audioFilename?: string;
  picker: Array<{ type: string; url: string; thumb?: string }>;
}

interface CobaltError {
  status: "error";
  error?: { code?: string };
}

type CobaltResponse = CobaltTunnel | CobaltPicker | CobaltError | { status: string };

const VIDEO_QUALITIES = ["360", "480", "720", "1080", "1440"] as const;

/** Prefer community instances known to work for YouTube without Turnstile when possible. */
const BUILTIN_INSTANCES = [
  "https://api.cobalt.liubquanti.click",
  "https://nuko-c.meowing.de",
  "https://subito-c.meowing.de",
  "https://cobalt.omega.wolfy.love",
  "https://api-cobalt.eversiege.network",
  "https://cobaltapi.kittycat.boo",
  "https://cobaltapi.cjs.nz",
  "https://api.qwkuns.me",
];

const directoryCache = new Map<string, { at: number; urls: string[] }>();
const DIRECTORY_TTL_MS = 10 * 60_000;

async function fetchDirectoryInstances(platform: PlatformId): Promise<string[]> {
  const key = platform === "unknown" ? "youtube" : platform;
  const cached = directoryCache.get(key);
  if (cached && Date.now() - cached.at < DIRECTORY_TTL_MS) {
    return cached.urls;
  }

  try {
    const res = await fetchWithTimeout(
      "https://cobalt.directory/api/working?type=api",
      {},
      8_000,
    );
    if (!res.ok) return [];
    const json = (await res.json()) as {
      data?: Record<string, string[]>;
    };
    const urls = (json.data?.[key] || json.data?.youtube || []).slice(0, 8);
    directoryCache.set(key, { at: Date.now(), urls });
    return urls;
  } catch {
    return [];
  }
}

async function getInstances(platform: PlatformId): Promise<string[]> {
  const primary = process.env.COBALT_API_URL?.trim();
  const fromEnv =
    process.env.COBALT_FALLBACK_URLS?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  const fromDirectory = await fetchDirectoryInstances(platform);
  const list = [
    ...(primary ? [primary] : []),
    ...fromEnv,
    ...fromDirectory,
    ...BUILTIN_INSTANCES,
  ];
  return [...new Set(list)];
}

async function callInstance(
  baseUrl: string,
  url: string,
  downloadMode: "auto" | "audio" = "auto",
  videoQuality = "720",
): Promise<CobaltResponse> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const key = process.env.COBALT_API_KEY?.trim();
  if (key && baseUrl === process.env.COBALT_API_URL?.trim()) {
    headers.Authorization = `Api-Key ${key}`;
  }

  const res = await fetchWithTimeout(
    baseUrl.replace(/\/$/, "") + "/",
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        url,
        videoQuality,
        filenameStyle: "pretty",
        downloadMode,
        alwaysProxy: false,
      }),
    },
    16_000,
  );

  if (!res.ok) {
    throw new ProviderError(`Upstream HTTP ${res.status}`);
  }
  return (await res.json()) as CobaltResponse;
}

function mapTunnelOption(
  data: CobaltTunnel,
  quality: string,
): DownloadOption {
  const filename = data.filename || "media.mp4";
  const isAudio = /\.(mp3|m4a|ogg|opus|wav)$/i.test(filename);
  return {
    id: `media-${quality}-${isAudio ? "audio" : "video"}`,
    label: labelForQuality(quality, isAudio),
    quality: isAudio ? "audio" : quality,
    format: isAudio ? filename.split(".").pop() || "mp3" : "mp4",
    kind: isAudio ? "audio" : "video",
    url: data.url,
    proxied: true,
  };
}

function mapResponse(
  data: CobaltResponse,
  platform: PlatformId,
  sourceUrl: string,
  quality: string,
): MediaResult {
  if (data.status === "error") {
    throw new ProviderError("Media unavailable from this source.");
  }

  if (data.status === "tunnel" || data.status === "redirect") {
    const tunnel = data as CobaltTunnel;
    const filename = tunnel.filename || "media.mp4";
    return buildResult({
      platform,
      title: filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "),
      sourceUrl,
      provider: "cs-downloader",
      options: [mapTunnelOption(tunnel, quality)],
    });
  }

  if (data.status === "picker") {
    const picker = data as CobaltPicker;
    const options: DownloadOption[] = picker.picker.map((item, index) => ({
      id: `pick-${index}`,
      label: item.type === "photo" ? `Photo ${index + 1}` : `Clip ${index + 1}`,
      quality: item.type,
      format: item.type === "photo" ? "jpg" : "mp4",
      kind: item.type === "photo" ? "photo" : "video",
      url: item.url,
      proxied: true,
    }));
    if (picker.audio) {
      options.push({
        id: "pick-audio",
        label: "Background audio",
        quality: "audio",
        format: "mp3",
        kind: "audio",
        url: picker.audio,
        proxied: true,
      });
    }
    return buildResult({
      platform,
      title: "Media picker",
      thumbnail: picker.picker[0]?.thumb,
      sourceUrl,
      provider: "cs-downloader",
      options,
    });
  }

  throw new ProviderError("Unsupported media response.");
}

export async function downloadWithCobalt(
  url: string,
  platform: PlatformId,
  mode: "auto" | "audio" = "auto",
): Promise<MediaResult> {
  const instances = await getInstances(platform);
  let working: string | null = null;
  let seed: MediaResult | null = null;

  for (const instance of instances) {
    try {
      const data = await callInstance(instance, url, mode, "720");
      seed = mapResponse(data, platform, url, "720");
      working = instance;
      break;
    } catch {
      // try next instance
    }
  }

  if (!working || !seed) {
    throw new ProviderError("Could not resolve downloads for this link.");
  }

  // Photos/picker or audio-only: return sorted seed
  if (
    mode === "audio" ||
    seed.options.some((o) => o.kind === "photo") ||
    seed.options.every((o) => o.kind === "audio")
  ) {
    return withSortedOptions(seed);
  }

  const settled = await Promise.all(
    VIDEO_QUALITIES.map(async (quality) => {
      try {
        const data = await callInstance(working!, url, mode, quality);
        if (data.status !== "tunnel" && data.status !== "redirect") return null;
        return mapTunnelOption(data as CobaltTunnel, quality);
      } catch {
        return null;
      }
    }),
  );

  const byUrl = new Map<string, DownloadOption>();
  for (const option of [...seed.options, ...settled.filter(Boolean) as DownloadOption[]]) {
    if (!option.url) continue;
    // Prefer keeping quality-specific ids; dedupe identical stream URLs
    if (!byUrl.has(option.url)) byUrl.set(option.url, option);
  }

  const options = [...byUrl.values()];
  if (!options.length) {
    throw new ProviderError("No downloadable formats found.");
  }

  return withSortedOptions({
    ...seed,
    provider: "cs-downloader",
    options,
  });
}
