import type { Metadata, Viewport } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://free-video-downloader.thecodesplitter.com";

export const siteConfig = {
  name: "CS Any Video Downloader",
  shortName: "CS Downloader",
  tagline: "Free multi-platform video downloader",
  description:
    "Download videos from YouTube, TikTok, Instagram, Facebook, X, Reddit, Vimeo and more with CS Any Video Downloader. Free, fast, and private — choose quality and save to your device.",
  url: siteUrl,
  locale: "en_US",
  supportEmail: "thecodesplitters@gmail.com",
  legalEntity: "CS Any Video Downloader",
  lastUpdated: "July 14, 2026",
  twitterHandle: "@thecodesplitter",
};

export const siteViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#0f7a6c" },
  ],
  colorScheme: "light",
};

export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized.replace(/\/$/, "")}`;
}

function pageTitle(title: string, path: string): string {
  if (path === "/" || title === siteConfig.name) {
    return `${siteConfig.name} — ${siteConfig.tagline}`;
  }
  return `${title} | ${siteConfig.name}`;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  type = "website",
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = pageTitle(title, path);
  const isHome = path === "/";
  const ogImagePath = isHome
    ? "/opengraph-image"
    : path.startsWith("/download/")
      ? `${path}/opengraph-image`
      : "/opengraph-image";
  const ogImage = absoluteUrl(ogImagePath);
  const ogAlt = `${fullTitle} — free online video downloader`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: isHome
      ? { absolute: fullTitle }
      : { absolute: fullTitle },
    description,
    applicationName: siteConfig.name,
    keywords: [
      "free video downloader",
      "youtube downloader",
      "tiktok downloader no watermark",
      "instagram reel download",
      "facebook video download",
      "twitter video download",
      "online video saver",
      "mp4 downloader",
      "mobile video downloader",
      "CS Any Video Downloader",
      ...keywords,
    ],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "Multimedia",
    referrer: "origin-when-cross-origin",
    alternates: {
      canonical: url,
      languages: {
        "en": url,
        "x-default": url,
      },
    },
    openGraph: {
      type,
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          secureUrl: ogImage,
          width: 1200,
          height: 630,
          alt: ogAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          alt: ogAlt,
        },
      ],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
          "max-video-preview": -1,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large" as const,
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    icons: {
      icon: [
        { url: "/logo.svg", type: "image/svg+xml" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
      shortcut: ["/logo.svg"],
    },
    appleWebApp: {
      capable: true,
      title: siteConfig.shortName,
      statusBarStyle: "default",
    },
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    other: {
      "mobile-web-app-capable": "yes",
      "msapplication-TileColor": "#0f7a6c",
    },
  };
}

export function jsonLdOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.supportEmail,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.svg"),
      width: 64,
      height: 64,
    },
    image: absoluteUrl("/opengraph-image"),
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.supportEmail,
      contactType: "customer support",
      availableLanguage: ["English"],
    },
    sameAs: [siteConfig.url],
  };
}

export function jsonLdWebsite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/?url={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function jsonLdWebApp() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": absoluteUrl("/#webapp"),
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "Video Downloader",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works on mobile and desktop.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "YouTube video download",
      "TikTok no watermark",
      "Instagram Reels download",
      "Facebook video download",
      "X Twitter video download",
      "Multiple quality options",
      "Mobile responsive downloader",
    ],
    screenshot: absoluteUrl("/opengraph-image"),
    image: absoluteUrl("/opengraph-image"),
    author: { "@id": absoluteUrl("/#organization") },
    publisher: { "@id": absoluteUrl("/#organization") },
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.supportEmail,
      contactType: "customer support",
    },
  };
}

export function jsonLdWebPage({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absoluteUrl(`${path}#webpage`),
    url: absoluteUrl(path),
    name: pageTitle(title, path),
    description,
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#webapp") },
    inLanguage: "en-US",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(
        path.startsWith("/download/")
          ? `${path}/opengraph-image`
          : "/opengraph-image",
      ),
    },
  };
}

export function jsonLdBreadcrumb(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function jsonLdHowTo(platformName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to download ${platformName} videos with ${siteConfig.name}`,
    description: `Step-by-step guide to download public ${platformName} videos for free on mobile or desktop.`,
    totalTime: "PT1M",
    tool: [
      {
        "@type": "HowToTool",
        name: siteConfig.name,
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Copy the link",
        text: `Open ${platformName} and copy the public share URL of the video.`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste and fetch",
        text: `Paste the link into ${siteConfig.name} and tap Download.`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Save the file",
        text: "Choose quality/format and save the video, audio, or photo to your device.",
      },
    ],
  };
}

export function jsonLdFaq() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is CS Any Video Downloader really free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. CS Any Video Downloader is free to use with no account required for basic downloads.",
        },
      },
      {
        "@type": "Question",
        name: "Which platforms are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "YouTube, TikTok, Instagram, Facebook, X (Twitter), Reddit, Vimeo, Pinterest, SoundCloud, Twitch clips, Bluesky, Tumblr, Bilibili, Snapchat Spotlight, LinkedIn, and many more public video sites.",
        },
      },
      {
        "@type": "Question",
        name: "Do TikTok downloads include a watermark?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. When available, TikTok HD options prefer streams without a watermark.",
        },
      },
      {
        "@type": "Question",
        name: "Is downloading videos legal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Only download content you own or have permission to save. Respect each platform’s terms of service and copyright laws in your country.",
        },
      },
      {
        "@type": "Question",
        name: "How can I contact support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Email ${siteConfig.supportEmail} for support, privacy requests, or DMCA notices.`,
        },
      },
      {
        "@type": "Question",
        name: "Does CS Any Video Downloader work on mobile?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. CS Any Video Downloader is fully responsive and works on phones, tablets, and desktops — paste a link and download without installing an app.",
        },
      },
    ],
  };
}
