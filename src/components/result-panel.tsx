"use client";

import type { DownloadOption, MediaResult } from "@/lib/types";

function formatDuration(seconds?: number) {
  if (!seconds || seconds <= 0) return null;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function downloadHref(option: DownloadOption, title: string) {
  const safeName = `${title.slice(0, 48)}.${option.format}`.replace(
    /[^\w.\-]+/g,
    "_",
  );
  if (option.proxied) {
    return `/api/proxy?url=${encodeURIComponent(option.url)}&filename=${encodeURIComponent(safeName)}`;
  }
  return option.url;
}

export function ResultPanel({ result }: { result: MediaResult }) {
  const duration = formatDuration(result.duration);

  return (
    <div className="result" aria-live="polite">
      <div className="result__meta">
        {result.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result.thumbnail}
            alt=""
            className="result__thumb"
            width={160}
            height={90}
          />
        ) : (
          <div className="result__thumb result__thumb--empty" aria-hidden />
        )}
        <div className="result__copy">
          <p className="result__platform">{result.platform}</p>
          <h2 className="result__title">{result.title}</h2>
          <p className="result__sub">
            {[result.author, duration].filter(Boolean).join(" · ")}
          </p>
          {result.options.length > 1 ? (
            <p className="result__hint">Qualities listed from low to high</p>
          ) : null}
        </div>
      </div>

      <ul className="result__options">
        {result.options.map((option) => (
          <li key={option.id}>
            <a
              className="result__option"
              href={downloadHref(option, result.title)}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="result__option-main">
                <strong>{option.label}</strong>
                <span>
                  {option.format.toUpperCase()}
                  {option.quality ? ` · ${option.quality}` : ""}
                </span>
              </span>
              <span className="result__option-cta">Save</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
