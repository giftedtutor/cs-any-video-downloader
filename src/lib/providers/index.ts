import { detectPlatform } from "../platforms";
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
  facebook: [withPlatform(downloadWithFacebook), cobaltProvider()],
  instagram: [withPlatform(downloadWithInstagramEmbed), cobaltProvider()],
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
      return result;
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "Provider failed");
    }
  }
  throw new ProviderError(errors[errors.length - 1] || "All providers failed.");
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
        return enrichYouTube(url, rapid);
      }
    } catch {
      // ignore
    }

    if (platform !== "unknown") {
      try {
        return enrichYouTube(url, await downloadWithCobalt(url, platform));
      } catch {
        // fall through
      }
    }

    throw primaryError instanceof Error
      ? primaryError
      : new ProviderError("Unable to resolve this URL.");
  }
}

export function getProviderSummary() {
  return [
    {
      name: "TikWM",
      platforms: ["TikTok"],
      note: "Free public API · ~1 request/second",
    },
    {
      name: "FxTwitter / VxTwitter",
      platforms: ["X (Twitter)"],
      note: "Free public tweet media API",
    },
    {
      name: "Facebook Video Plugin",
      platforms: ["Facebook"],
      note: "Public plugin scrape for SD/HD",
    },
    {
      name: "Instagram Embed",
      platforms: ["Instagram"],
      note: "Public embed page extraction",
    },
    {
      name: "Cobalt (community + self-host)",
      platforms: ["YouTube", "Reddit", "Vimeo", "1000+ sites"],
      note: "Live directory fallbacks · set COBALT_API_URL for best results",
    },
    {
      name: "RapidAPI (optional)",
      platforms: ["Multi-platform backups"],
      note: "Uses RAPIDAPI_KEY free quota when set",
    },
  ];
}
