import { withSortedOptions } from "../quality";
import type { DownloadOption, MediaResult } from "../types";
import {
  buildResult,
  decodeHtmlEntities,
  extractFirstMatch,
  fetchWithTimeout,
  ProviderError,
} from "./utils";

function collectUrls(html: string, patterns: RegExp[]): string[] {
  const found = new Set<string>();
  for (const pattern of patterns) {
    const global = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
    let match: RegExpExecArray | null;
    while ((match = global.exec(html)) !== null) {
      if (match[1]) found.add(decodeHtmlEntities(match[1]));
    }
  }
  return [...found];
}

export async function downloadWithFacebook(url: string): Promise<MediaResult> {
  const pluginUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;

  const res = await fetchWithTimeout(
    pluginUrl,
    {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        Referer: "https://www.facebook.com/",
      },
    },
    15_000,
  );

  if (!res.ok) throw new ProviderError(`Facebook plugin HTTP ${res.status}`);
  const html = await res.text();

  const hd = collectUrls(html, [
    /"browser_native_hd_url"\s*:\s*"([^"]+)"/,
    /browser_native_hd_url&quot;:&quot;([^&]+)&quot;/,
  ]);
  const sd = collectUrls(html, [
    /"browser_native_sd_url"\s*:\s*"([^"]+)"/,
    /browser_native_sd_url&quot;:&quot;([^&]+)&quot;/,
  ]);
  const playable = collectUrls(html, [
    /"playable_url_quality_hd"\s*:\s*"([^"]+)"/,
    /"playable_url"\s*:\s*"([^"]+)"/,
  ]);

  const title =
    extractFirstMatch(html, [
      /"title"\s*:\s*"([^"]+)"/,
      /property="og:title"\s+content="([^"]+)"/,
    ]) || "Facebook video";

  const thumbnail = extractFirstMatch(html, [
    /"preferred_thumbnail".*?"uri"\s*:\s*"([^"]+)"/,
    /property="og:image"\s+content="([^"]+)"/,
  ]);

  const options: DownloadOption[] = [];
  const pushUnique = (id: string, label: string, quality: string, mediaUrl: string) => {
    if (options.some((o) => o.url === mediaUrl)) return;
    options.push({
      id,
      label,
      quality,
      format: "mp4",
      kind: "video" as const,
      url: mediaUrl,
      proxied: true,
    });
  };

  hd.forEach((u, i) => pushUnique(`fb-hd-${i}`, "HD · higher quality", "1080", u));
  playable.forEach((u, i) =>
    pushUnique(`fb-play-${i}`, "Standard quality", "720", u),
  );
  sd.forEach((u, i) => pushUnique(`fb-sd-${i}`, "Low quality", "360", u));

  if (!options.length) {
    // Fallback: try the raw page
    const pageRes = await fetchWithTimeout(
      url,
      { headers: { Accept: "text/html", Referer: "https://www.facebook.com/" } },
      12_000,
    );
    const pageHtml = await pageRes.text();
    const pageHd = collectUrls(pageHtml, [/"browser_native_hd_url"\s*:\s*"([^"]+)"/]);
    const pageSd = collectUrls(pageHtml, [/"browser_native_sd_url"\s*:\s*"([^"]+)"/]);
    pageHd.forEach((u, i) =>
      pushUnique(`fb-page-hd-${i}`, "HD · higher quality", "1080", u),
    );
    pageSd.forEach((u, i) => pushUnique(`fb-page-sd-${i}`, "Low quality", "360", u));
  }

  return withSortedOptions(
    buildResult({
      platform: "facebook",
      title: title.slice(0, 140),
      thumbnail: thumbnail || undefined,
      options,
      provider: "cs-downloader",
      sourceUrl: url,
    }),
  );
}
