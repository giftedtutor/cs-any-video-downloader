"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cs-any-video-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const reveal = () => {
      if (cancelled) return;
      try {
        if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
      } catch {
        setVisible(true);
      }
    };

    // Keep first paint clean for Lighthouse / mobile LCP
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(reveal, { timeout: 2500 });
    } else {
      timeoutId = setTimeout(reveal, 1800);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie notice">
      <p>
        We use cookies and similar technologies for essential site functions and,
        when enabled, advertising (including Google AdSense). See our{" "}
        <Link href="/privacy" prefetch={false}>
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/cookies" prefetch={false}>
          Cookie Policy
        </Link>
        .
      </p>
      <button type="button" onClick={accept} className="cookie-banner__btn">
        Got it
      </button>
    </div>
  );
}
