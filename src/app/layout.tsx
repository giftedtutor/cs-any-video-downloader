import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import { AdSenseScript } from "@/components/adsense";
import { CookieBanner } from "@/components/cookie-banner";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import {
  buildMetadata,
  siteConfig,
  siteViewport,
} from "@/lib/seo";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
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
  // Root layout should not force homepage canonical on child routes
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
        <CookieBanner />
      </body>
    </html>
  );
}
