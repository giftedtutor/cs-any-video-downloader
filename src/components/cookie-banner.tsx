"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cs-any-video-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
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
        <Link href="/privacy">Privacy Policy</Link> and{" "}
        <Link href="/cookies">Cookie Policy</Link>.
      </p>
      <button type="button" onClick={accept} className="cookie-banner__btn">
        Got it
      </button>
    </div>
  );
}
