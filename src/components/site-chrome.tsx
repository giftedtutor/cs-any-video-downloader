"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/seo";

const NAV_LINKS = [
  { href: "/#platforms", label: "Platforms" },
  { href: "/#how", label: "How it works" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="site-header__inner">
        <Link
          href="/"
          className="brand"
          aria-label={`${siteConfig.name} home`}
          onClick={() => setOpen(false)}
        >
          <span className="brand__mark" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" width={38} height={38} />
          </span>
          <span className="brand__text">
            <span className="brand__name">CS Any Video</span>
            <span className="brand__sub">Downloader</span>
          </span>
        </Link>

        <nav className="site-nav site-nav--desktop" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="site-nav__link">
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="site-nav__cta">
            Contact
          </Link>
        </nav>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={open ? "nav-toggle__bar is-open" : "nav-toggle__bar"} />
          <span className={open ? "nav-toggle__bar is-open" : "nav-toggle__bar"} />
          <span className={open ? "nav-toggle__bar is-open" : "nav-toggle__bar"} />
        </button>
      </div>

      <nav
        id="mobile-nav"
        className={
          open
            ? "site-nav site-nav--mobile is-open"
            : "site-nav site-nav--mobile"
        }
        aria-label="Mobile"
        aria-hidden={!open}
      >
        <div className="site-nav__mobile-inner">
          {[...NAV_LINKS, { href: "/contact", label: "Contact" }].map(
            (link) => (
              <Link
                key={link.href}
                href={link.href}
                className="site-nav__mobile-link"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ),
          )}
          <div className="site-nav__mobile-meta">
            <Link href="/privacy" onClick={() => setOpen(false)}>
              Privacy
            </Link>
            <Link href="/terms" onClick={() => setOpen(false)}>
              Terms
            </Link>
            <a href={`mailto:${siteConfig.supportEmail}`}>Support</a>
          </div>
        </div>
      </nav>
    </header>
  );
}

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
                <img src="/logo.svg" alt="" width={40} height={40} />
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
            <Link href="/">Home</Link>
            <Link href="/#platforms">Platforms</Link>
            <Link href="/#how">How it works</Link>
            <Link href="/download/youtube">YouTube</Link>
            <Link href="/download/tiktok">TikTok</Link>
          </nav>

          <nav className="site-footer__col" aria-label="Company">
            <h2 className="site-footer__heading">Company</h2>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <a href={`mailto:${email}`}>Email support</a>
          </nav>

          <nav className="site-footer__col" aria-label="Legal">
            <h2 className="site-footer__heading">Legal</h2>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/cookies">Cookie Policy</Link>
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
