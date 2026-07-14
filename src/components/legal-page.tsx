import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <article className="legal" id="main-content">
      <header className="legal__header">
        <h1>{title}</h1>
        <p className="legal__updated">Last updated: {updated}</p>
      </header>
      <div className="legal__body prose">{children}</div>
    </article>
  );
}
