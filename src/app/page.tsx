import type { Metadata } from "next";
import { DownloaderFormSuspense as DownloaderForm } from "@/components/downloader-form-suspense";
import { JsonLd } from "@/components/json-ld";
import { FaqSection, HowSection, PlatformSection } from "@/components/sections";
import { getProviderSummary } from "@/lib/providers";
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
  const providers = getProviderSummary();

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
          Facebook, X, and more — elegant, fast, and powered by open free APIs.
        </p>
        <DownloaderForm />
        <p className="hero__cta-note">
          No signup · Works on phone & desktop · No watermark on TikTok HD
        </p>
      </section>

      <PlatformSection />
      <HowSection />

      <section className="section providers" id="providers">
        <div className="section__intro">
          <h2>Free APIs under the hood</h2>
          <p>
            CS Any Video Downloader chains free endpoints and open instances so
            downloads keep working when one provider hits a quota.
          </p>
        </div>
        <ul className="provider-grid">
          {providers.map((provider) => (
            <li key={provider.name} className="provider-card">
              <h3>{provider.name}</h3>
              <p>
                {provider.platforms.join(", ")} — {provider.note}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <FaqSection />
    </main>
  );
}
