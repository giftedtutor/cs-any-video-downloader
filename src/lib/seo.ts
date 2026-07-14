import type { Metadata, Viewport } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export const siteConfig = {
  name: "CS Any Video Downloader",
  shortName: "CS Downloader",
  tagline: "Free multi-platform video downloader",
  description:
    "Download videos from YouTube, TikTok, Instagram, Facebook, X, Reddit, Vimeo and more with CS Any Video Downloader. Free, fast, no watermark — powered by open free APIs.",
  url: siteUrl,
  locale: "en_US",
  supportEmail: "codesplitters@gmail.com",
  legalEntity: "CS Any Video Downloader",
  lastUpdated: "July 14, 2026",
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
  if (!path.startsWith("/")) return `${siteConfig.url}/${path}`;
  return `${siteConfig.url}${path}`;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle =
    title === siteConfig.name
      ? `${siteConfig.name} — ${siteConfig.tagline}`
      : `${title} | ${siteConfig.name}`;
  const ogImage = absoluteUrl("/opengraph-image");

  return {
    title: fullTitle,
    description,
    applicationName: siteConfig.name,
    keywords: [
      "free video downloader",
      "youtube downloader",
      "tiktok no watermark",
      "instagram reel download",
      "facebook video download",
      "online video saver",
      "mp4 downloader",
      "mobile video downloader",
      ...keywords,
    ],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "Multimedia",
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${siteConfig.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    appleWebApp: {
      capable: true,
      title: siteConfig.name,
      statusBarStyle: "default",
    },
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    other: {
      "mobile-web-app-capable": "yes",
    },
  };
}

export function jsonLdOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.supportEmail,
    logo: absoluteUrl("/icon"),
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.supportEmail,
      contactType: "customer support",
      availableLanguage: ["English"],
    },
  };
}

export function jsonLdWebApp() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works on mobile and desktop.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "YouTube video download",
      "TikTok no watermark",
      "Instagram Reels download",
      "Facebook video download",
      "X Twitter video download",
      "Multi-platform free APIs",
      "Mobile responsive downloader",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.supportEmail,
      contactType: "customer support",
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
          text: "Yes. CS Any Video Downloader uses free public and open APIs with generous free quotas. No account is required for basic downloads.",
        },
      },
      {
        "@type": "Question",
        name: "Which platforms are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "YouTube, TikTok, Instagram, Facebook, X (Twitter), Reddit, Vimeo, Pinterest, SoundCloud, Twitch clips, Bluesky, Tumblr, Bilibili, Snapchat Spotlight, LinkedIn, and more via Cobalt.",
        },
      },
      {
        "@type": "Question",
        name: "Do TikTok downloads include a watermark?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. TikTok downloads use TikWM and prefer HD streams without watermark whenever available.",
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
