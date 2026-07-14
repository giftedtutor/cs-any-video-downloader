import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/json-ld";
import { jsonLdBreadcrumb, jsonLdWebPage } from "@/lib/seo";

export function LegalPage({
  title,
  updated,
  path,
  description,
  children,
}: {
  title: string;
  updated: string;
  path: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <article className="legal" id="main-content">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: "Home", path: "/" },
          { name: title, path },
        ])}
      />
      <JsonLd data={jsonLdWebPage({ title, description, path })} />

      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden>/</span>
        <span>{title}</span>
      </nav>

      <header className="legal__header">
        <h1>{title}</h1>
        <p className="legal__updated">Last updated: {updated}</p>
      </header>
      <div className="legal__body prose">{children}</div>
    </article>
  );
}
