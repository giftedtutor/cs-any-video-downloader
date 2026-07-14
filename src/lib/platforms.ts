import type { PlatformId, PlatformInfo } from "./types";

export const PLATFORMS: PlatformInfo[] = [
  {
    id: "youtube",
    name: "YouTube",
    slug: "youtube",
    domains: ["youtube.com", "youtu.be", "m.youtube.com", "music.youtube.com", "www.youtube.com"],
    description:
      "Download YouTube videos, Shorts, and Music tracks in MP4 or extract audio as MP3 — free, no watermark.",
    color: "#FF0033",
  },
  {
    id: "tiktok",
    name: "TikTok",
    slug: "tiktok",
    domains: ["tiktok.com", "vm.tiktok.com", "vt.tiktok.com", "www.tiktok.com"],
    description:
      "Save TikTok videos without watermark in HD. Paste any public TikTok link and download instantly.",
    color: "#111111",
  },
  {
    id: "instagram",
    name: "Instagram",
    slug: "instagram",
    domains: ["instagram.com", "www.instagram.com", "instagr.am"],
    description:
      "Download Instagram Reels, posts, and IGTV videos in high quality from any public URL.",
    color: "#E1306C",
  },
  {
    id: "facebook",
    name: "Facebook",
    slug: "facebook",
    domains: ["facebook.com", "fb.watch", "www.facebook.com", "m.facebook.com", "fb.com"],
    description:
      "Download public Facebook videos and Reels in SD or HD with a single paste-and-go link.",
    color: "#1877F2",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    slug: "twitter",
    domains: ["twitter.com", "x.com", "mobile.twitter.com", "www.twitter.com"],
    description:
      "Save videos and GIFs from X (Twitter) posts without installing an extension.",
    color: "#0F1419",
  },
  {
    id: "reddit",
    name: "Reddit",
    slug: "reddit",
    domains: ["reddit.com", "www.reddit.com", "v.redd.it", "redd.it"],
    description:
      "Download Reddit videos with audio from posts, including v.redd.it hosted clips.",
    color: "#FF4500",
  },
  {
    id: "vimeo",
    name: "Vimeo",
    slug: "vimeo",
    domains: ["vimeo.com", "www.vimeo.com", "player.vimeo.com"],
    description: "Download public Vimeo videos in the best available resolution.",
    color: "#1AB7EA",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    slug: "pinterest",
    domains: ["pinterest.com", "www.pinterest.com", "pin.it"],
    description: "Save Pinterest video pins in original quality for offline viewing.",
    color: "#E60023",
  },
  {
    id: "soundcloud",
    name: "SoundCloud",
    slug: "soundcloud",
    domains: ["soundcloud.com", "www.soundcloud.com", "on.soundcloud.com"],
    description: "Download SoundCloud tracks as audio files from any public track URL.",
    color: "#FF5500",
  },
  {
    id: "dailymotion",
    name: "Dailymotion",
    slug: "dailymotion",
    domains: ["dailymotion.com", "www.dailymotion.com", "dai.ly"],
    description: "Download Dailymotion videos quickly from a public share link.",
    color: "#00A0E3",
  },
  {
    id: "twitch",
    name: "Twitch",
    slug: "twitch",
    domains: ["twitch.tv", "www.twitch.tv", "clips.twitch.tv"],
    description: "Download Twitch clips and VODs that are publicly available.",
    color: "#9146FF",
  },
  {
    id: "bluesky",
    name: "Bluesky",
    slug: "bluesky",
    domains: ["bsky.app", "www.bsky.app"],
    description: "Download videos shared on Bluesky posts from a public link.",
    color: "#0085FF",
  },
  {
    id: "tumblr",
    name: "Tumblr",
    slug: "tumblr",
    domains: ["tumblr.com", "www.tumblr.com"],
    description: "Save Tumblr video posts in their original uploaded quality.",
    color: "#001935",
  },
  {
    id: "bilibili",
    name: "Bilibili",
    slug: "bilibili",
    domains: ["bilibili.com", "www.bilibili.com", "b23.tv"],
    description: "Download Bilibili videos from mainland and international links.",
    color: "#FB7299",
  },
  {
    id: "snapchat",
    name: "Snapchat",
    slug: "snapchat",
    domains: ["snapchat.com", "www.snapchat.com", "t.snapchat.com"],
    description: "Download public Snapchat Spotlight videos from share links.",
    color: "#FFFC00",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    slug: "linkedin",
    domains: ["linkedin.com", "www.linkedin.com"],
    description: "Download public LinkedIn videos shared in posts and articles.",
    color: "#0A66C2",
  },
];

export function detectPlatform(rawUrl: string): PlatformId {
  try {
    const host = new URL(rawUrl).hostname.replace(/^www\./, "").toLowerCase();
    for (const platform of PLATFORMS) {
      if (platform.domains.some((d) => host === d || host.endsWith(`.${d}`))) {
        return platform.id;
      }
    }
    if (host.includes("youtu")) return "youtube";
    if (host.includes("tiktok")) return "tiktok";
    if (host.includes("instagram") || host === "instagr.am") return "instagram";
    if (host.includes("facebook") || host.includes("fb.watch") || host === "fb.com")
      return "facebook";
    if (host.includes("twitter") || host === "x.com") return "twitter";
    if (host.includes("reddit") || host === "redd.it" || host === "v.redd.it")
      return "reddit";
  } catch {
    return "unknown";
  }
  return "unknown";
}

export function getPlatformBySlug(slug: string): PlatformInfo | undefined {
  return PLATFORMS.find((p) => p.slug === slug);
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
