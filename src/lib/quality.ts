import type { DownloadOption, MediaResult } from "./types";

const QUALITY_RANK: Record<string, number> = {
  "144": 10,
  "240": 20,
  "360": 30,
  "480": 40,
  "sd": 45,
  "540": 50,
  "720": 60,
  "hd": 65,
  "1080": 70,
  "fullhd": 70,
  "1440": 80,
  "2k": 85,
  "2160": 90,
  "4k": 95,
  max: 100,
  best: 100,
  original: 100,
  auto: 55,
  wm: 35,
};

function qualityScore(option: DownloadOption): number {
  const raw = `${option.quality ?? ""} ${option.label}`.toLowerCase();
  const height = raw.match(/(\d{3,4})\s*p?\b/);
  if (height) {
    const n = Number(height[1]);
    if (n >= 100 && n <= 4320) return Math.min(n / 24, 100);
  }
  for (const [key, score] of Object.entries(QUALITY_RANK)) {
    if (raw.includes(key)) return score;
  }
  if (option.kind === "audio") return 5;
  if (option.kind === "photo") return 15;
  return 50;
}

/** Sort options low → high quality; keep audio/photos after videos of same band. */
export function sortOptionsLowToHigh(options: DownloadOption[]): DownloadOption[] {
  return [...options].sort((a, b) => {
    const kindOrder =
      (a.kind === "video" ? 0 : a.kind === "photo" ? 1 : 2) -
      (b.kind === "video" ? 0 : b.kind === "photo" ? 1 : 2);
    if (kindOrder !== 0) return kindOrder;
    return qualityScore(a) - qualityScore(b);
  });
}

export function withSortedOptions(result: MediaResult): MediaResult {
  return {
    ...result,
    options: sortOptionsLowToHigh(result.options),
  };
}

export function labelForQuality(quality: string, isAudio: boolean): string {
  if (isAudio) return "Audio only";
  const q = quality.toLowerCase();
  if (q === "360") return "Low quality · 360p";
  if (q === "480") return "Standard · 480p";
  if (q === "720") return "HD · 720p";
  if (q === "1080") return "Full HD · 1080p";
  if (q === "1440") return "Quad HD · 1440p";
  if (q === "2160" || q === "max") return "Ultra HD · 4K";
  return `${quality}p`;
}

export function friendlyDownloadError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("rate") || lower.includes("429") || lower.includes("too many")) {
    return "Too many requests right now. Please wait a moment and try again.";
  }
  if (lower.includes("not a valid") || lower.includes("invalid")) {
    return "Please paste a valid video link and try again.";
  }
  if (lower.includes("private") || lower.includes("unavailable") || lower.includes("login")) {
    return "This video looks private or unavailable. Try a public link.";
  }
  return "We couldn’t prepare downloads for this link. Please try another public video URL.";
}
