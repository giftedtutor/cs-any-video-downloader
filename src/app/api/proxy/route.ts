import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_HOST_HINTS = [
  "tiktokcdn",
  "tiktok",
  "tikwm",
  "fbcdn",
  "facebook",
  "cdninstagram",
  "instagram",
  "twimg",
  "video.twimg",
  "redd.it",
  "redditmedia",
  "vimeocdn",
  "pinimg",
  "soundcloud",
  "googlevideo",
  "ytimg",
  "youtube",
  "clxxped",
  "imput.net",
  "kittycat",
  "cobalt",
  "meowing.de",
  "liubquanti",
  "eversiege",
  "wolfy.love",
  "xenon.zone",
  "snssdk",
  "muscdn",
  "byteoversea",
];

function isAllowedTarget(target: URL): boolean {
  if (target.protocol !== "https:" && target.protocol !== "http:") return false;
  const host = target.hostname.toLowerCase();
  return ALLOWED_HOST_HINTS.some(
    (hint) => host === hint || host.includes(hint),
  );
}

function refererFor(host: string): string {
  if (host.includes("tiktok") || host.includes("tikwm") || host.includes("byteoversea"))
    return "https://www.tiktok.com/";
  if (host.includes("instagram") || host.includes("cdninstagram"))
    return "https://www.instagram.com/";
  if (host.includes("facebook") || host.includes("fbcdn"))
    return "https://www.facebook.com/";
  if (host.includes("twimg") || host.includes("twitter") || host.includes("x.com"))
    return "https://x.com/";
  if (host.includes("reddit") || host.includes("redd.it"))
    return "https://www.reddit.com/";
  return "https://www.google.com/";
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url");
  const filename =
    request.nextUrl.searchParams.get("filename") || "download.mp4";

  if (!raw) {
    return NextResponse.json({ error: "Missing url." }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return NextResponse.json({ error: "Invalid url." }, { status: 400 });
  }

  if (!isAllowedTarget(target)) {
    return NextResponse.json({ error: "Host not allowed." }, { status: 403 });
  }

  const range = request.headers.get("range") || undefined;

  const upstream = await fetch(target.toString(), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Referer: refererFor(target.hostname),
      ...(range ? { Range: range } : {}),
    },
    redirect: "follow",
  });

  if (!upstream.ok && upstream.status !== 206) {
    return NextResponse.json(
      { error: `Upstream error ${upstream.status}` },
      { status: 502 },
    );
  }

  const headers = new Headers();
  const passThrough = [
    "content-type",
    "content-length",
    "content-range",
    "accept-ranges",
  ];
  for (const key of passThrough) {
    const value = upstream.headers.get(key);
    if (value) headers.set(key, value);
  }
  if (!headers.has("content-type")) {
    headers.set("content-type", "application/octet-stream");
  }
  headers.set(
    "content-disposition",
    `attachment; filename="${filename.replace(/[^\w.\-]+/g, "_")}"`,
  );
  headers.set("cache-control", "private, max-age=300");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}
