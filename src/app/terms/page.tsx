import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: `Terms of Service for ${siteConfig.name}. Rules for using our free video downloader, acceptable use, and liability.`,
  path: "/terms",
  type: "article",
  keywords: ["terms of service", "terms of use", "acceptable use"],
});

export default function TermsPage() {
  const email = siteConfig.supportEmail;
  const description = `Terms of Service for ${siteConfig.name}. Rules for using our free video downloader, acceptable use, and liability.`;

  return (
    <LegalPage
      title="Terms of Service"
      updated={siteConfig.lastUpdated}
      path="/terms"
      description={description}
    >
      <p>
        These Terms of Service (“Terms”) govern your access to and use of{" "}
        <strong>{siteConfig.name}</strong> (the “Service”). By using the
        Service you agree to these Terms. If you do not agree, do not use the
        Service.
      </p>

      <h2>1. The Service</h2>
      <p>
        {siteConfig.name} provides tools to help users retrieve publicly
        available media from third-party platforms via user-supplied links. The
        Service is provided free of charge and may display advertising,
        including Google AdSense.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 13 years old (or the minimum digital consent age in
        your country) to use the Service. If you use the Service on behalf of an
        organization, you represent that you have authority to bind that
        organization.
      </p>

      <h2>3. Acceptable use</h2>
      <p>You agree that you will only use the Service to:</p>
      <ul>
        <li>
          Download content you own, content you have permission to download, or
          content that is lawfully available for personal offline use under
          applicable law
        </li>
        <li>Comply with the terms of third-party platforms you interact with</li>
        <li>Respect copyright, trademark, and other intellectual property rights</li>
      </ul>
      <p>You must not:</p>
      <ul>
        <li>Use the Service for piracy or commercial redistribution of others’ content</li>
        <li>Attempt to bypass technical protections, DRM, or paywalls</li>
        <li>Overload, scrape, or attack our systems or third-party services</li>
        <li>Use the Service for illegal, harmful, or abusive purposes</li>
        <li>Misrepresent your identity when contacting support</li>
      </ul>

      <h2>4. Third-party content and platforms</h2>
      <p>
        We do not host, own, or control the media available on YouTube, TikTok,
        Instagram, Facebook, X, or other platforms. All trademarks and content
        belong to their respective owners. You are solely responsible for
        ensuring your use of downloaded media is lawful.
      </p>

      <h2>5. No warranty</h2>
      <p>
        The Service is provided “as is” and “as available” without warranties of
        any kind, express or implied. We do not guarantee that every link will
        resolve, that quality options will always be available, or that the
        Service will be uninterrupted or error-free. Third-party APIs and
        platforms may change or block access at any time.
      </p>

      <h2>6. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {siteConfig.name} and its
        operators shall not be liable for any indirect, incidental, special,
        consequential, or punitive damages, or any loss of data, profits, or
        goodwill arising from your use of the Service. Our total liability for
        any claim relating to the Service shall not exceed USD $0 (the Service
        is free) or the minimum amount required by applicable law.
      </p>

      <h2>7. Advertising</h2>
      <p>
        The Service may display third-party advertisements. We are not
        responsible for the content of ads or the products/services they promote.
        Interactions with advertisers are between you and the advertiser. See
        our <Link href="/privacy">Privacy Policy</Link> for how ads and cookies
        work.
      </p>

      <h2>8. Intellectual property</h2>
      <p>
        The {siteConfig.name} name, design, and original site content (excluding
        user-submitted URLs and third-party media) are owned by us or our
        licensors. You may not copy or reuse our branding without permission.
      </p>

      <h2>9. DMCA / copyright complaints</h2>
      <p>
        If you believe content accessible through the Service infringes your
        copyright, contact us at <a href={`mailto:${email}`}>{email}</a> with:
      </p>
      <ul>
        <li>Your contact information</li>
        <li>Description of the copyrighted work</li>
        <li>The URL or material you believe is infringing</li>
        <li>A statement of good-faith belief and accuracy under penalty of perjury</li>
        <li>Your physical or electronic signature</li>
      </ul>
      <p>
        More details are on our <Link href="/contact">Contact & DMCA</Link>{" "}
        page.
      </p>

      <h2>10. Termination</h2>
      <p>
        We may suspend or limit access to the Service at any time for abuse,
        legal risk, or operational reasons.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update these Terms periodically. The “Last updated” date will
        reflect changes. Continued use after updates constitutes acceptance.
      </p>

      <h2>12. Governing law</h2>
      <p>
        These Terms are governed by applicable laws of the jurisdiction in which
        the Service operator resides, without regard to conflict-of-law rules,
        except where mandatory consumer protections in your country apply.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions about these Terms:{" "}
        <a href={`mailto:${email}`}>{email}</a>
      </p>
    </LegalPage>
  );
}
