import Link from "next/link";
import { PLATFORMS } from "@/lib/platforms";

export function PlatformSection() {
  return (
    <section id="platforms" className="section platforms">
      <div className="section__intro">
        <h2>Every major platform, one paste</h2>
        <p>
          Dedicated free providers for TikTok, Instagram, Facebook, and X — plus
          Cobalt-powered fallbacks covering YouTube and a thousand more sites.
        </p>
      </div>
      <ul className="platform-list">
        {PLATFORMS.map((platform) => (
          <li key={platform.id}>
            <Link href={`/download/${platform.slug}`} className="platform-link">
              <span
                className="platform-link__dot"
                style={{ background: platform.color }}
                aria-hidden
              />
              <span className="platform-link__name">{platform.name}</span>
              <span className="platform-link__arrow" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function HowSection() {
  const steps = [
    {
      n: "01",
      title: "Copy a public link",
      body: "Grab the share URL from YouTube, TikTok, Instagram, Facebook, or any supported site.",
    },
    {
      n: "02",
      title: "We pick the best free API",
      body: "CS Any Video Downloader tries platform-native free endpoints first, then Cobalt community instances, then optional RapidAPI quotas.",
    },
    {
      n: "03",
      title: "Choose quality & save",
      body: "Preview the title, pick MP4 / MP3 / photo options, and download through a safe proxy when CDNs need it.",
    },
  ];

  return (
    <section id="how" className="section how">
      <div className="section__intro">
        <h2>How it works</h2>
        <p>Three steps. No account. No desktop app.</p>
      </div>
      <ol className="how-list">
        {steps.map((step) => (
          <li key={step.n} className="how-step">
            <span className="how-step__n">{step.n}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function FaqSection() {
  const faqs = [
    {
      q: "Is it free?",
      a: "Yes. Core downloads use free public APIs. Optional RapidAPI keys unlock extra free-tier quotas if you self-host.",
    },
    {
      q: "Why do some YouTube links fail?",
      a: "YouTube rate-limits public scrapers. For production reliability, set COBALT_API_URL to your own Cobalt instance — instructions are in .env.example.",
    },
    {
      q: "Do you store my videos?",
      a: "No. Media is resolved on demand and streamed through a temporary proxy. Nothing is kept on our servers. See our Privacy Policy for details.",
    },
    {
      q: "What about watermarks?",
      a: "TikTok HD options prefer no-watermark streams via TikWM whenever available.",
    },
    {
      q: "How do I contact support?",
      a: "Email codesplitters@gmail.com for help, privacy requests, or DMCA notices. Or visit the Contact page.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes. The site is fully responsive — paste a link on your phone and save videos without installing an app.",
    },
  ];

  return (
    <section id="faq" className="section faq">
      <div className="section__intro">
        <h2>FAQ</h2>
        <p>Straight answers about limits, legality, and quality.</p>
      </div>
      <div className="faq-list">
        {faqs.map((item) => (
          <details key={item.q} className="faq-item">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
