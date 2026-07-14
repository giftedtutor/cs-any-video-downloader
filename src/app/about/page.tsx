import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description: `About ${siteConfig.name} — a free multi-platform video downloader. Contact support at ${siteConfig.supportEmail}.`,
  path: "/about",
  keywords: ["about", "about us", "who we are"],
});

export default function AboutPage() {
  const email = siteConfig.supportEmail;

  return (
    <LegalPage title={`About ${siteConfig.name}`} updated={siteConfig.lastUpdated}>
      <p>
        <strong>{siteConfig.name}</strong> is a free web tool that helps people
        save publicly available videos and media from popular platforms —
        including YouTube, TikTok, Instagram, Facebook, X, Reddit, Vimeo, and
        more — by pasting a link.
      </p>

      <h2>Our mission</h2>
      <p>
        Make personal offline access simple, without accounts, installs, or
        watermarked TikTok downloads when HD options are available. We combine
        free public APIs and open Cobalt instances so the tool stays accessible.
      </p>

      <h2>How we keep it free</h2>
      <p>
        The Service is free to use. We may show advertisements (including Google
        AdSense) to cover hosting and maintenance. Ads never change who owns the
        media you choose to download — you remain responsible for lawful use.
      </p>

      <h2>Transparency</h2>
      <ul>
        <li>
          <Link href="/privacy">Privacy Policy</Link> — data, ads, and cookies
        </li>
        <li>
          <Link href="/terms">Terms of Service</Link> — acceptable use
        </li>
        <li>
          <Link href="/cookies">Cookie Policy</Link> — cookie details
        </li>
        <li>
          <Link href="/contact">Contact</Link> — support and DMCA
        </li>
      </ul>

      <h2>Get in touch</h2>
      <p>
        Support and general inquiries:{" "}
        <a href={`mailto:${email}`}>{email}</a>
      </p>
    </LegalPage>
  );
}
