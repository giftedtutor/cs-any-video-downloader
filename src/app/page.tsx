import type { Metadata } from "next";
import { DownloaderFormSuspense as DownloaderForm } from "@/components/downloader-form-suspense";
import { JsonLd } from "@/components/json-ld";
import { FaqSection, HowSection, PlatformSection } from "@/components/sections";
import { getFeatureHighlights } from "@/lib/providers";
import {
  buildMetadata,
  jsonLdFaq,
  jsonLdOrganization,
  jsonLdWebApp,
  jsonLdWebPage,
  jsonLdWebsite,
  siteConfig,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  path: "/",
  keywords: [
    "free online video downloader",
    "save video from link",
    "download social media videos",
  ],
});

export default function HomePage() {
  const features = getFeatureHighlights();

  return (
    <main id="main-content">
      <JsonLd data={jsonLdOrganization()} />
      <JsonLd data={jsonLdWebsite()} />
      <JsonLd data={jsonLdWebApp()} />
      <JsonLd
        data={jsonLdWebPage({
          title: siteConfig.name,
          description: siteConfig.description,
          path: "/",
        })}
      />
      <JsonLd data={jsonLdFaq()} />

      <section className="hero">
        <h1 className="hero__brand">{siteConfig.name}</h1>
        <p className="hero__lead">
          Free multi-platform video downloader for YouTube, TikTok, Instagram,
          Facebook, X, and more — paste a link, pick a quality, and save.
        </p>
        <DownloaderForm />
        <p className="hero__cta-note">
          No signup · Works on phone & desktop · No watermark on TikTok HD
        </p>
      </section>

      <PlatformSection />
      <HowSection />

      <section className="section providers" id="features">
        <div className="section__intro">
          <h2>Built for quick saves</h2>
          <p>
            Simple tools for everyday downloads — choose quality, skip the
            account, and get the file onto your device.
          </p>
        </div>
        <ul className="provider-grid">
          {features.map((feature) => (
            <li key={feature.name} className="provider-card">
              <h3>{feature.name}</h3>
              <p>{feature.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <FaqSection />
    </main>
  );
}
