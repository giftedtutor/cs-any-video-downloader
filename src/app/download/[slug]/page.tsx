import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DownloaderForm } from "@/components/downloader-form";
import { getPlatformBySlug, PLATFORMS } from "@/lib/platforms";
import { buildMetadata, jsonLdBreadcrumb, siteConfig } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PLATFORMS.map((platform) => ({ slug: platform.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const platform = getPlatformBySlug(slug);
  if (!platform) return {};
  return buildMetadata({
    title: `Free ${platform.name} Video Downloader`,
    description: platform.description,
    path: `/download/${platform.slug}`,
    keywords: [
      `${platform.name} downloader`,
      `download ${platform.name} video`,
      `free ${platform.name} download`,
      `${platform.name} mp4 saver`,
      `${platform.name} mobile download`,
    ],
  });
}

export default async function PlatformDownloadPage({ params }: Props) {
  const { slug } = await params;
  const platform = getPlatformBySlug(slug);
  if (!platform) notFound();

  const others = PLATFORMS.filter((p) => p.id !== platform.id).slice(0, 8);

  return (
    <main id="main-content" className="platform-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLdBreadcrumb([
              { name: "Home", path: "/" },
              { name: `${platform.name} Downloader`, path: `/download/${platform.slug}` },
            ]),
          ),
        }}
      />

      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden>/</span>
        <span>{platform.name}</span>
      </nav>

      <section className="platform-page__hero">
        <h1>Free {platform.name} video downloader</h1>
        <p>{platform.description}</p>
        <DownloaderForm />
      </section>

      <section className="section platform-seo">
        <div className="section__intro">
          <h2>How to download from {platform.name}</h2>
          <p>
            Paste any public {platform.name} link into {siteConfig.name} on your
            phone or computer. We resolve available formats and let you save them
            instantly — no app install required.
          </p>
        </div>
        <ol className="how-list how-list--compact">
          <li className="how-step">
            <span className="how-step__n">01</span>
            <h3>Copy the link</h3>
            <p>Open {platform.name} and copy the share URL of the video or reel.</p>
          </li>
          <li className="how-step">
            <span className="how-step__n">02</span>
            <h3>Paste & fetch</h3>
            <p>Drop it into the box above and tap Download to load formats.</p>
          </li>
          <li className="how-step">
            <span className="how-step__n">03</span>
            <h3>Save to your device</h3>
            <p>Choose quality and save MP4, audio, or photos for offline use.</p>
          </li>
        </ol>
      </section>

      <section className="section">
        <div className="section__intro">
          <h2>More downloaders</h2>
          <p>Switch platforms anytime — CS Any Video Downloader covers them all.</p>
        </div>
        <ul className="platform-list">
          {others.map((item) => (
            <li key={item.id}>
              <Link href={`/download/${item.slug}`} className="platform-link">
                <span
                  className="platform-link__dot"
                  style={{ background: item.color }}
                  aria-hidden
                />
                <span className="platform-link__name">{item.name}</span>
                <span className="platform-link__arrow" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
