import type { Metadata } from "next";
import localFont from "next/font/local";
import { AdSenseScript } from "@/components/adsense";
import { CookieBannerDeferred } from "@/components/cookie-banner-deferred";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  buildMetadata,
  siteConfig,
  siteViewport,
} from "@/lib/seo";
import "./globals.css";

const syne = localFont({
  src: [
    {
      path: "./fonts/syne-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/syne-latin-800-normal.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-syne",
  display: "swap",
  preload: true,
  fallback: ["Arial Narrow", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

const jakarta = localFont({
  src: [
    {
      path: "./fonts/plus-jakarta-sans-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/plus-jakarta-sans-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-jakarta",
  display: "swap",
  preload: true,
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

const base = buildMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  path: "/",
});

export const metadata: Metadata = {
  ...base,
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  alternates: {
    ...base.alternates,
    canonical: undefined,
  },
  openGraph: {
    ...base.openGraph,
    url: siteConfig.url,
  },
  manifest: "/manifest.webmanifest",
};

export const viewport = siteViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${jakarta.variable} h-full`}>
      <body className="min-h-full antialiased">
        <AdSenseScript />
        <div className="page-frame">
          <SiteHeader />
          <div className="shell shell--main">{children}</div>
          <SiteFooter />
        </div>
        <CookieBannerDeferred />
      </body>
    </html>
  );
}
