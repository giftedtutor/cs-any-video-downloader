import type { DownloadOption, MediaResult, PlatformId } from "../types";
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
        videoQuality: "1080",
        filenameStyle: "pretty",
        downloadMode,
        alwaysProxy: false,
      }),
    },
    16_000,
  );

  if (!res.ok) {
    // Auth-gated community mirrors often return 401/403/400
    throw new ProviderError(`Cobalt HTTP ${res.status}`);
  }
  return (await res.json()) as CobaltResponse;
}

function mapResponse(
  data: CobaltResponse,
  platform: PlatformId,
  sourceUrl: string,
  instance: string,
): MediaResult {
  if (data.status === "error") {
    const code = (data as CobaltError).error?.code ?? "unknown";
    throw new ProviderError(`Cobalt error: ${code}`);
  }

  if (data.status === "tunnel" || data.status === "redirect") {
    const tunnel = data as CobaltTunnel;
    const filename = tunnel.filename || "media.mp4";
    const isAudio = /\.(mp3|m4a|ogg|opus|wav)$/i.test(filename);
    return buildResult({
      platform,
      title: filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "),
      sourceUrl,
      provider: `cobalt:${new URL(instance).hostname}`,
      options: [
        {
          id: "cobalt-primary",
          label: isAudio ? "Audio download" : "Best quality",
          quality: isAudio ? "audio" : "best",
          format: isAudio ? filename.split(".").pop() || "mp3" : "mp4",
          kind: isAudio ? "audio" : "video",
          url: tunnel.url,
          proxied: true,
        },
      ],
    });
  }

  if (data.status === "picker") {
    const picker = data as CobaltPicker;
    const options: DownloadOption[] = picker.picker.map((item, index) => ({
      id: `cobalt-pick-${index}`,
      label: item.type === "photo" ? `Photo ${index + 1}` : `Clip ${index + 1}`,
      quality: item.type,
      format: item.type === "photo" ? "jpg" : "mp4",
      kind: item.type === "photo" ? "photo" : "video",
      url: item.url,
      proxied: true,
    }));
    if (picker.audio) {
      options.push({
        id: "cobalt-audio",
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
      provider: `cobalt:${new URL(instance).hostname}`,
      options,
    });
  }

  throw new ProviderError(`Unsupported Cobalt status: ${data.status}`);
}

export async function downloadWithCobalt(
  url: string,
  platform: PlatformId,
  mode: "auto" | "audio" = "auto",
): Promise<MediaResult> {
  const errors: string[] = [];
  const instances = await getInstances(platform);

  for (const instance of instances) {
    try {
      const data = await callInstance(instance, url, mode);
      return mapResponse(data, platform, url, instance);
    } catch (err) {
      const message = err instanceof Error ? err.message : "failed";
      // Skip auth-walled mirrors quickly in the error summary
      if (
        message.includes("auth") ||
        message.includes("jwt") ||
        message.includes("HTTP 401") ||
        message.includes("HTTP 403")
      ) {
        continue;
      }
      errors.push(`${new URL(instance).hostname}: ${message}`);
      if (errors.length >= 5) break;
    }
  }
  throw new ProviderError(
    errors.length
      ? `Cobalt providers failed (${errors.slice(0, 3).join(" · ")})`
      : "No reachable Cobalt instances. Set COBALT_API_URL to your self-hosted API.",
  );
}
