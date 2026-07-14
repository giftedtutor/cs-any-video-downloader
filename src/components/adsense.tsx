import Script from "next/script";

/**
 * Loads Google AdSense only when configured.
 * Uses lazyOnload so it does not compete with LCP / TBT on mobile.
 */
export function AdSenseScript() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) return null;

  return (
    <Script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );
}

export function AdSenseSlot({
  slot,
  format = "auto",
  fullWidthResponsive = true,
}: {
  slot: string;
  format?: string;
  fullWidthResponsive?: boolean;
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client || !slot) return null;

  return (
    <div className="adsense-slot" aria-hidden>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
      <Script id={`adsense-push-${slot}`} strategy="lazyOnload">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
}
