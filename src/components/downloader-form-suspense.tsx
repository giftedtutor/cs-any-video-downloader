"use client";

import { Suspense } from "react";
import { DownloaderForm } from "./downloader-form";

function DownloaderFallback() {
  return (
    <div className="downloader" aria-hidden>
      <div className="downloader__field">
        <input disabled placeholder="Paste video link here" />
        <button type="button" className="downloader__submit" disabled>
          Download
        </button>
      </div>
    </div>
  );
}

export function DownloaderFormSuspense({
  initialUrl = "",
}: {
  initialUrl?: string;
}) {
  return (
    <Suspense fallback={<DownloaderFallback />}>
      <DownloaderForm initialUrl={initialUrl} />
    </Suspense>
  );
}
