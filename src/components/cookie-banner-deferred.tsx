"use client";

import dynamic from "next/dynamic";

const CookieBannerLazy = dynamic(
  () =>
    import("@/components/cookie-banner").then((m) => m.CookieBanner),
  { ssr: false },
);

export function CookieBannerDeferred() {
  return <CookieBannerLazy />;
}
