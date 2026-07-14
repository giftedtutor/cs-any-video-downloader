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
          prefetch={false}
        >
          <span className="brand__mark" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt=""
              width={38}
              height={38}
              decoding="async"
              fetchPriority="high"
            />
          </span>
          <span className="brand__text">
            <span className="brand__name">CS Any Video</span>
            <span className="brand__sub">Downloader</span>
          </span>
        </Link>

        <nav className="site-nav site-nav--desktop" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="site-nav__link"
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="site-nav__cta" prefetch={false}>
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
                prefetch={false}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ),
          )}
          <div className="site-nav__mobile-meta">
            <Link href="/privacy" prefetch={false} onClick={() => setOpen(false)}>
              Privacy
            </Link>
            <Link href="/terms" prefetch={false} onClick={() => setOpen(false)}>
              Terms
            </Link>
            <a href={`mailto:${siteConfig.supportEmail}`}>Support</a>
          </div>
        </div>
      </nav>
    </header>
  );
}
