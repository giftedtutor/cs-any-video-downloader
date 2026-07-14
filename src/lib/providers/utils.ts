import type { DownloadOption, MediaResult, PlatformId } from "../types";

const DEFAULT_TIMEOUT_MS = 18_000;

export class ProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderError";
  }
}

export async function fetchWithTimeout(
  input: string | URL,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        ...(init.headers || {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

export function buildResult(partial: {
  platform: PlatformId;
  title: string;
  author?: string;
  thumbnail?: string;
  duration?: number;
  options: DownloadOption[];
  provider: string;
  sourceUrl: string;
}): MediaResult {
  if (!partial.options.length) {
    throw new ProviderError("No downloadable formats found.");
  }
  return partial;
}

export function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\\u0026/g, "&")
    .replace(/\\\//g, "/");
}

export function extractFirstMatch(html: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtmlEntities(match[1]);
  }
  return null;
}
