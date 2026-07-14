import { fetchWithTimeout } from "./utils";

export async function youtubeOEmbed(url: string): Promise<{
  title?: string;
  author?: string;
  thumbnail?: string;
} | null> {
  try {
    const res = await fetchWithTimeout(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      {},
      6_000,
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      title?: string;
      author_name?: string;
      thumbnail_url?: string;
    };
    return {
      title: json.title,
      author: json.author_name,
      thumbnail: json.thumbnail_url,
    };
  } catch {
    return null;
  }
}
