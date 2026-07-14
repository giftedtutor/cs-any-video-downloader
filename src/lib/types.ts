export type PlatformId =
  | "youtube"
  | "tiktok"
  | "instagram"
  | "facebook"
  | "twitter"
  | "reddit"
  | "vimeo"
  | "pinterest"
  | "soundcloud"
  | "dailymotion"
  | "twitch"
  | "bluesky"
  | "tumblr"
  | "bilibili"
  | "snapchat"
  | "linkedin"
  | "okru"
  | "rutube"
  | "unknown";

export type MediaKind = "video" | "audio" | "photo";

export interface DownloadOption {
  id: string;
  label: string;
  quality?: string;
  format: string;
  kind: MediaKind;
  url: string;
  /** When true, download via our proxy (fixes CDN referer/CORS issues). */
  proxied?: boolean;
  filesize?: number;
}

export interface MediaResult {
  platform: PlatformId;
  title: string;
  author?: string;
  thumbnail?: string;
  duration?: number;
  options: DownloadOption[];
  provider: string;
  sourceUrl: string;
}

export interface DownloadApiSuccess {
  ok: true;
  result: MediaResult;
}

export interface DownloadApiError {
  ok: false;
  error: string;
  platform?: PlatformId;
}

export type DownloadApiResponse = DownloadApiSuccess | DownloadApiError;

export interface PlatformInfo {
  id: PlatformId;
  name: string;
  slug: string;
  domains: string[];
  description: string;
  color: string;
}
