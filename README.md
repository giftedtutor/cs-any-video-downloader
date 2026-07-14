# CS Any Video Downloader — Free Multi-Platform Video Downloader

Next.js web app to download videos from **YouTube, TikTok, Instagram, Facebook, X (Twitter), Reddit, Vimeo**, and more using free public APIs and Cobalt community instances.

## Features

- Paste-a-link downloader with quality / format options
- Platform-specific SEO pages (`/download/youtube`, `/download/tiktok`, …)
- Multi-provider fallback chain (TikWM → FxTwitter → Instagram embed → Facebook plugin → Cobalt → optional RapidAPI)
- Stream proxy for CDN referer/CORS issues
- Sitemap, robots.txt, Open Graph, FAQ + WebApplication JSON-LD
- Elegant teal / mist UI (Syne + Plus Jakarta Sans)

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site URL for SEO |
| `COBALT_API_URL` | Recommended for YouTube | Your self-hosted [Cobalt](https://github.com/imputnet/cobalt) API |
| `COBALT_API_KEY` | If Cobalt requires auth | `Api-Key` header value |
| `COBALT_FALLBACK_URLS` | Optional | Comma-separated community Cobalt APIs |
| `RAPIDAPI_KEY` | Optional | Unlocks RapidAPI free-tier backup providers |

## Free API stack

1. **TikWM** — TikTok HD / no watermark (~1 req/sec free)
2. **FxTwitter / VxTwitter** — X video variants
3. **Instagram embed** — public reels/posts
4. **Facebook video plugin** — public SD/HD URLs
5. **Cobalt instances** — YouTube + 1000+ sites (self-host for production)
6. **RapidAPI** — optional free-quota backups when `RAPIDAPI_KEY` is set

## Production tip

Community Cobalt mirrors rotate and may have Turnstile protection. For reliable YouTube downloads, deploy your own Cobalt instance and set `COBALT_API_URL`.

## AdSense / legal pages

For Google AdSense review this site includes:

- `/privacy` — Privacy Policy (AdSense & cookies disclosure)
- `/terms` — Terms of Service (+ DMCA)
- `/cookies` — Cookie Policy
- `/about` — About us
- `/contact` — Support at **codesplitters@gmail.com**
- `/ads.txt` — replace the placeholder publisher ID after AdSense approval
- Cookie consent banner on first visit

Set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxx` in `.env.local` to load the AdSense script.

Only download content you own or have permission to save. Respect platform terms and copyright law.
