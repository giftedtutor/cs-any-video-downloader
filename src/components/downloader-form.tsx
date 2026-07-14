"use client";

import { useEffect, useState, useTransition } from "react";
import type { DownloadApiResponse, MediaResult } from "@/lib/types";
import { ResultPanel } from "./result-panel";

export function DownloaderForm({ initialUrl = "" }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MediaResult | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (initialUrl) setUrl(initialUrl);
  }, [initialUrl]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Paste a video link to get started.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: trimmed }),
        });
        const data = (await res.json()) as DownloadApiResponse;
        if (!data.ok) {
          setError(data.error);
          return;
        }
        setResult(data.result);
      } catch {
        setError("Network error. Check your connection and try again.");
      }
    });
  }

  return (
    <div className="downloader">
      <form className="downloader__form" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="video-url">
          Video URL
        </label>
        <div className="downloader__field">
          <input
            id="video-url"
            name="url"
            type="url"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            placeholder="Paste video link here"
            enterKeyHint="go"
            autoCapitalize="off"
            autoCorrect="off"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={pending}
          />
          <button type="submit" disabled={pending} className="downloader__submit">
            {pending ? (
              <span className="downloader__spinner" aria-hidden />
            ) : null}
            {pending ? "Fetching…" : "Download"}
          </button>
        </div>
      </form>

      {error ? (
        <p className="downloader__error" role="alert">
          {error}
        </p>
      ) : null}

      {result ? <ResultPanel result={result} /> : null}
    </div>
  );
}
