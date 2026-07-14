import Link from "next/link";
import { siteConfig } from "@/lib/seo";

export function SiteFooter() {
  const email = siteConfig.supportEmail;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <div className="brand brand--footer">
              <span className="brand__mark" aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.svg"
                  alt=""
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="brand__text">
                <span className="brand__name">CS Any Video</span>
                <span className="brand__sub">Downloader</span>
              </span>
            </div>
            <p className="site-footer__tagline">
              A free, mobile-ready tool for saving public videos from YouTube,
              TikTok, Instagram, Facebook, X, and more — for personal use.
            </p>
          </div>

          <nav className="site-footer__col" aria-label="Product">
            <h2 className="site-footer__heading">Product</h2>
            <Link href="/" prefetch={false}>
              Home
            </Link>
            <Link href="/#platforms" prefetch={false}>
              Platforms
            </Link>
            <Link href="/#how" prefetch={false}>
              How it works
            </Link>
            <Link href="/download/youtube" prefetch={false}>
              YouTube
            </Link>
            <Link href="/download/tiktok" prefetch={false}>
              TikTok
            </Link>
          </nav>

          <nav className="site-footer__col" aria-label="Company">
            <h2 className="site-footer__heading">Company</h2>
            <Link href="/about" prefetch={false}>
              About
            </Link>
            <Link href="/contact" prefetch={false}>
              Contact
            </Link>
            <a href={`mailto:${email}`}>Email support</a>
          </nav>

          <nav className="site-footer__col" aria-label="Legal">
            <h2 className="site-footer__heading">Legal</h2>
            <Link href="/privacy" prefetch={false}>
              Privacy Policy
            </Link>
            <Link href="/terms" prefetch={false}>
              Terms of Service
            </Link>
            <Link href="/cookies" prefetch={false}>
              Cookie Policy
            </Link>
          </nav>
        </div>

        <div className="site-footer__bar">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <a className="site-footer__mail" href={`mailto:${email}`}>
            {email}
          </a>
        </div>
      </div>
    </footer>
  );
}
