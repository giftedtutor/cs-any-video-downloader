import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact & Support",
  description: `Contact ${siteConfig.name} support at ${siteConfig.supportEmail}. Privacy requests, DMCA, ads, and general help.`,
  path: "/contact",
  keywords: ["contact", "support", "DMCA", "help"],
});

export default function ContactPage() {
  const email = siteConfig.supportEmail;
  const description = `Contact ${siteConfig.name} support at ${siteConfig.supportEmail}. Privacy requests, DMCA, ads, and general help.`;

  return (
    <LegalPage
      title="Contact & Support"
      updated={siteConfig.lastUpdated}
      path="/contact"
      description={description}
    >
      <p>
        We are happy to help with support, privacy requests, advertising
        questions, and copyright notices.
      </p>

      <h2>Support email</h2>
      <p className="legal__highlight">
        <a href={`mailto:${email}`}>{email}</a>
      </p>
      <p>
        Please include a clear subject line (for example “Privacy request”,
        “DMCA”, “Bug report”, or “AdSense / ads”) so we can respond faster.
      </p>

      <h2>What to include</h2>
      <ul>
        <li>The page URL you were using</li>
        <li>The video link (if the issue is about a download)</li>
        <li>Your browser and device</li>
        <li>Screenshots or error messages when relevant</li>
      </ul>

      <h2>Privacy & data requests</h2>
      <p>
        To exercise privacy rights or ask how we handle data, email{" "}
        <a href={`mailto:${email}?subject=Privacy%20request`}>{email}</a> and
        read our <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>DMCA / copyright</h2>
      <p>
        Send copyright complaints to{" "}
        <a href={`mailto:${email}?subject=DMCA%20Notice`}>{email}</a> with the
        information listed in our <Link href="/terms">Terms of Service</Link>.
        We review valid notices and take appropriate action.
      </p>

      <h2>Advertising</h2>
      <p>
        Questions about ads or Google AdSense compliance on this site can also
        be sent to <a href={`mailto:${email}`}>{email}</a>. Our{" "}
        <Link href="/cookies">Cookie Policy</Link> explains advertising cookies.
      </p>

      <h2>Response time</h2>
      <p>
        We aim to reply within a few business days. Complex legal or copyright
        requests may take longer.
      </p>
    </LegalPage>
  );
}
