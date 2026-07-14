import { NextResponse } from "next/server";
import { isValidHttpUrl } from "@/lib/platforms";
import { resolveMedia } from "@/lib/providers";
import type { DownloadApiResponse } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 20;
const hits = new Map<string, number[]>();

function clientKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

export async function POST(request: Request) {
  if (!checkRateLimit(clientKey(request))) {
    const body: DownloadApiResponse = {
      ok: false,
      error: "Too many requests. Please wait a moment and try again.",
    };
    return NextResponse.json(body, { status: 429 });
  }

  let payload: { url?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." } satisfies DownloadApiResponse,
      { status: 400 },
    );
  }

  const url = payload.url?.trim();
  if (!url || !isValidHttpUrl(url)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please paste a valid http(s) video link.",
      } satisfies DownloadApiResponse,
      { status: 400 },
    );
  }

  try {
    const result = await resolveMedia(url);
    const body: DownloadApiResponse = { ok: true, result };
    return NextResponse.json(body);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Could not fetch media for this link.";
    const body: DownloadApiResponse = { ok: false, error: message };
    return NextResponse.json(body, { status: 422 });
  }
}
