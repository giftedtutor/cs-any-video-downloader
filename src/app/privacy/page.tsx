import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteConfig.name}. How we collect, use, and protect your information, including ads and cookies.`,
  path: "/privacy",
  type: "article",
  keywords: ["privacy policy", "data protection", "AdSense privacy"],
});

export default function PrivacyPage() {
  const email = siteConfig.supportEmail;
  const description = `Privacy Policy for ${siteConfig.name}. How we collect, use, and protect your information, including ads and cookies.`;

  return (
    <LegalPage
      title="Privacy Policy"
      updated={siteConfig.lastUpdated}
      path="/privacy"
      description={description}
    >
      <p>
        This Privacy Policy explains how <strong>{siteConfig.name}</strong>{" "}
        (“we”, “us”, or “our”) collects, uses, and shares information when you
        use {siteConfig.url.replace(/^https?:\/\//, "")} and related services
        (the “Service”).
      </p>
      <p>
        By using the Service, you agree to this Policy. If you do not agree,
        please stop using the Service. For privacy questions, contact us at{" "}
        <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <h2>1. Information we collect</h2>
      <h3>1.1 Information you provide</h3>
      <ul>
        <li>
          <strong>Video URLs</strong> you paste into the downloader so we can
          resolve available media formats.
        </li>
        <li>
          <strong>Support messages</strong> you send to{" "}
          <a href={`mailto:${email}`}>{email}</a>, including your email address
          and message content.
        </li>
      </ul>

      <h3>1.2 Information collected automatically</h3>
      <ul>
        <li>
          <strong>Usage data</strong> such as pages visited, referring URL,
          browser type, device type, approximate location (from IP), and
          timestamps.
        </li>
        <li>
          <strong>Log data</strong> for rate limiting and abuse prevention (for
          example IP address and request path).
        </li>
        <li>
          <strong>Cookies and similar technologies</strong> as described in our{" "}
          <Link href="/cookies">Cookie Policy</Link>.
        </li>
      </ul>

      <h3>1.3 What we do not intentionally store</h3>
      <p>
        We do not create user accounts for basic downloads. We do not
        intentionally keep copies of downloaded videos on our servers. Media is
        resolved on demand and may be temporarily proxied to your browser.
      </p>

      <h2>2. How we use information</h2>
      <ul>
        <li>Provide, operate, and improve the downloader Service</li>
        <li>Respond to support and legal requests</li>
        <li>Prevent fraud, spam, and abuse</li>
        <li>
          Display advertising (including through Google AdSense) and measure ad
          performance
        </li>
        <li>Comply with applicable laws</li>
      </ul>

      <h2>3. Advertising and Google AdSense</h2>
      <p>
        We may use third-party advertising partners, including{" "}
        <strong>Google AdSense</strong>, to show ads on the Service. Google and
        its partners may use cookies (including the DoubleClick cookie) and
        similar technologies to serve ads based on your prior visits to this
        website and other websites.
      </p>
      <ul>
        <li>
          Google’s use of advertising cookies enables it and its partners to
          serve ads based on your visit to our site and/or other sites on the
          Internet.
        </li>
        <li>
          You may opt out of personalized advertising by visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>
          .
        </li>
        <li>
          You can also visit{" "}
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
          >
            aboutads.info/choices
          </a>{" "}
          to opt out of personalized ads from participating companies.
        </li>
      </ul>
      <p>
        For more information about how Google processes data, see{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google’s Privacy Policy
        </a>{" "}
        and{" "}
        <a
          href="https://policies.google.com/technologies/ads"
          target="_blank"
          rel="noopener noreferrer"
        >
          How Google uses data when you use our partners’ sites or apps
        </a>
        .
      </p>

      <h2>4. Third-party services</h2>
      <p>
        To process download requests we may contact third-party APIs and media
        CDNs (for example platform-specific free APIs and Cobalt instances).
        Those services may receive the URL you submitted and standard technical
        request headers. Their privacy practices are governed by their own
        policies.
      </p>
      <p>
        Analytics or hosting providers (if used) may process usage data on our
        behalf under appropriate terms.
      </p>

      <h2>5. Legal bases (EEA/UK users)</h2>
      <p>Where GDPR/UK GDPR applies, we process data based on:</p>
      <ul>
        <li>
          <strong>Legitimate interests</strong> — operating a secure, abuse-free
          Service and measuring aggregate usage
        </li>
        <li>
          <strong>Consent</strong> — non-essential cookies and personalized
          advertising where required
        </li>
        <li>
          <strong>Contract / request</strong> — fulfilling download and support
          requests you initiate
        </li>
        <li>
          <strong>Legal obligation</strong> — when we must retain or disclose
          information to comply with law
        </li>
      </ul>

      <h2>6. Data retention</h2>
      <p>
        Server logs used for rate limiting and security are retained only as
        long as reasonably needed (typically a short rolling window). Support
        emails are kept as long as needed to resolve your request and meet legal
        requirements. We do not permanently archive downloaded media files.
      </p>

      <h2>7. Children’s privacy</h2>
      <p>
        The Service is not directed to children under 13 (or the minimum age
        required in your jurisdiction). We do not knowingly collect personal
        information from children. If you believe a child has provided us
        information, contact <a href={`mailto:${email}`}>{email}</a> and we
        will take appropriate steps to delete it.
      </p>
      <p>
        We do not knowingly serve personalized ads to users under 16 where
        prohibited, and we configure AdSense age-restricted settings as required
        by Google policies when applicable.
      </p>

      <h2>8. Your rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct,
        delete, or restrict processing of your personal data, and to object to
        certain processing or withdraw consent. To exercise these rights, email{" "}
        <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <h2>9. Security</h2>
      <p>
        We use reasonable technical and organizational measures to protect
        information. No method of transmission over the Internet is 100% secure.
      </p>

      <h2>10. International transfers</h2>
      <p>
        Information may be processed in countries other than your own (including
        where our hosting providers and advertising partners operate). Where
        required, we rely on appropriate safeguards for such transfers.
      </p>

      <h2>11. Changes to this Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The “Last updated”
        date at the top will change when we do. Continued use of the Service
        after changes means you accept the updated Policy.
      </p>

      <h2>12. Contact</h2>
      <p>
        Privacy and data requests:{" "}
        <a href={`mailto:${email}`}>{email}</a>
        <br />
        Website: <Link href="/">{siteConfig.name}</Link>
        <br />
        Also see our <Link href="/terms">Terms of Service</Link>,{" "}
        <Link href="/cookies">Cookie Policy</Link>, and{" "}
        <Link href="/contact">Contact</Link> page.
      </p>
    </LegalPage>
  );
}
