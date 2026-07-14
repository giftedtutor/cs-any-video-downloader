import { detectPlatform } from "../platforms";
import { withSortedOptions } from "../quality";
import type { MediaResult, PlatformId } from "../types";
import { downloadWithCobalt } from "./cobalt";
import { downloadWithFacebook } from "./facebook";
import { downloadWithFxTwitter } from "./fxtwitter";
import { downloadWithInstagramEmbed } from "./instagram";
import { downloadWithRapidApi } from "./rapidapi";
import { downloadWithTikwm } from "./tikwm";
import { ProviderError } from "./utils";
import { youtubeOEmbed } from "./youtube-meta";

type ProviderFn = (url: string, platform: PlatformId) => Promise<MediaResult>;

function withPlatform(
  fn: (url: string) => Promise<MediaResult>,
): ProviderFn {
  return (url) => fn(url);
}

function cobaltProvider(mode: "auto" | "audio" = "auto"): ProviderFn {
  return (url, platform) => downloadWithCobalt(url, platform, mode);
}

const PLATFORM_CHAIN: Partial<Record<PlatformId, ProviderFn[]>> = {
  tiktok: [withPlatform(downloadWithTikwm), cobaltProvider()],
  twitter: [withPlatform(downloadWithFxTwitter), cobaltProvider()],
  facebook: [cobaltProvider(), withPlatform(downloadWithFacebook)],
  instagram: [cobaltProvider(), withPlatform(downloadWithInstagramEmbed)],
  youtube: [cobaltProvider()],
  reddit: [cobaltProvider()],
  vimeo: [cobaltProvider()],
  pinterest: [cobaltProvider()],
  soundcloud: [cobaltProvider("audio")],
  dailymotion: [cobaltProvider()],
  twitch: [cobaltProvider()],
  bluesky: [cobaltProvider()],
  tumblr: [cobaltProvider()],
  bilibili: [cobaltProvider()],
  snapchat: [cobaltProvider()],
  linkedin: [cobaltProvider()],
};

async function tryProviders(
  url: string,
  platform: PlatformId,
  providers: ProviderFn[],
): Promise<MediaResult> {
  const errors: string[] = [];
  for (const provider of providers) {
    try {
      const result = await provider(url, platform);
      if (result.platform === "unknown") {
        result.platform = platform;
      }
      return withSortedOptions({
        ...result,
        provider: "cs-downloader",
      });
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "Provider failed");
    }
  }
  throw new ProviderError(
    errors[errors.length - 1] || "Could not resolve downloads for this link.",
  );
}

async function enrichYouTube(
  url: string,
  result: MediaResult,
): Promise<MediaResult> {
  if (result.platform !== "youtube") return result;
  if (result.thumbnail && result.author) return result;
  const meta = await youtubeOEmbed(url);
  if (!meta) return result;
  return {
    ...result,
    title:
      result.title.includes("h264") && meta.title ? meta.title : result.title,
    author: result.author || meta.author,
    thumbnail: result.thumbnail || meta.thumbnail,
  };
}

export async function resolveMedia(url: string): Promise<MediaResult> {
  const platform = detectPlatform(url);
  const chain = PLATFORM_CHAIN[platform] ?? [cobaltProvider()];

  try {
    const result = await tryProviders(url, platform, chain);
    return enrichYouTube(url, result);
  } catch (primaryError) {
    try {
      const rapid = await downloadWithRapidApi(url);
      if (rapid) {
        if (rapid.platform === "unknown") rapid.platform = platform;
        return enrichYouTube(
          url,
          withSortedOptions({ ...rapid, provider: "cs-downloader" }),
        );
      }
    } catch {
      // ignore
    }

    if (platform !== "unknown") {
      try {
        return enrichYouTube(
          url,
          withSortedOptions(await downloadWithCobalt(url, platform)),
        );
      } catch {
        // fall through
      }
    }

    throw primaryError instanceof Error
      ? primaryError
      : new ProviderError("Unable to resolve this URL.");
  }
}

/** User-facing highlights (no internal service names). */
export function getFeatureHighlights() {
  return [
    {
      name: "Quality choices",
      detail: "Pick from lower to higher resolution when the source offers them.",
    },
    {
      name: "Major platforms",
      detail: "YouTube, TikTok, Instagram, Facebook, X, Reddit, Vimeo, and more.",
    },
    {
      name: "No watermark TikTok",
      detail: "HD options prefer clean streams whenever they’re available.",
    },
    {
      name: "Works on mobile",
      detail: "Paste a link on your phone or desktop — no app install needed.",
    },
    {
      name: "Private by design",
      detail: "We don’t keep your videos. See Privacy for how downloads work.",
    },
    {
      name: "Friendly support",
      detail: "Reach us anytime for help, privacy, or copyright questions.",
    },
  ];
}
