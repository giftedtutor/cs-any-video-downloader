import { DownloaderForm } from "@/components/downloader-form";
import { FaqSection, HowSection, PlatformSection } from "@/components/sections";
import { getProviderSummary } from "@/lib/providers";
import {
  jsonLdFaq,
  jsonLdOrganization,
  jsonLdWebApp,
  siteConfig,
} from "@/lib/seo";

export default function HomePage() {
  const providers = getProviderSummary();

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq()) }}
      />

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
