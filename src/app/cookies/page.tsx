import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description: `Cookie Policy for ${siteConfig.name}. How we use cookies, analytics, and Google AdSense advertising cookies.`,
  path: "/cookies",
  keywords: ["cookie policy", "cookies", "AdSense cookies"],
});

export default function CookiesPage() {
  const email = siteConfig.supportEmail;

  return (
    <LegalPage title="Cookie Policy" updated={siteConfig.lastUpdated}>
      <p>
        This Cookie Policy explains how <strong>{siteConfig.name}</strong> uses
        cookies and similar technologies. For broader privacy practices, see our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a
        website. Similar technologies include local storage, pixels, and
        scripts used to remember preferences, keep the site secure, and support
        advertising.
      </p>

      <h2>2. How we use cookies</h2>
      <h3>Essential cookies</h3>
      <p>
        Required for basic functionality — for example storing your cookie
        notice acknowledgment (`cs-any-video-cookie-consent`) and keeping the site
        working securely.
      </p>

      <h3>Advertising cookies (Google AdSense)</h3>
      <p>
        When ads are enabled, Google and its partners may set cookies to:
      </p>
      <ul>
        <li>Serve ads on this site</li>
        <li>Limit how often you see the same ad</li>
        <li>
          Show personalized ads based on your browsing activity (where allowed)
        </li>
        <li>Measure ad performance</li>
      </ul>
      <p>
        Google may use the DoubleClick cookie and other advertising identifiers.
        Learn more at{" "}
        <a
          href="https://policies.google.com/technologies/ads"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Advertising Technologies
        </a>
        .
      </p>

      <h3>Analytics cookies (if used)</h3>
      <p>
        We may use analytics tools to understand aggregate traffic (pages
        viewed, approximate region, device type). These help us improve the
        Service.
      </p>

      <h2>3. Your choices</h2>
      <ul>
        <li>
          Manage personalized ads via{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>
        </li>
        <li>
          Industry opt-out:{" "}
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
          >
            aboutads.info/choices
          </a>
        </li>
        <li>
          Control cookies in your browser settings (blocking some cookies may
          affect site features or ads)
        </li>
      </ul>

      <h2>4. Cookie notice</h2>
      <p>
        On first visit we show a cookie notice so you know the site uses cookies
        for essential features and advertising. Closing/accepting the notice
        stores a preference locally on your device.
      </p>

      <h2>5. Contact</h2>
      <p>
        Questions about cookies:{" "}
        <a href={`mailto:${email}`}>{email}</a>
      </p>
    </LegalPage>
  );
}
