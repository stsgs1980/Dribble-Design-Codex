import { getAllDocMetas, getDocBySlug } from "@/lib/docs";
import { DocsViewer } from "@/components/docs/docs-viewer";

/**
 * Fully static home page: no request APIs, no search params. The primary
 * document is prerendered at build time and re-rendered only when the
 * syncDocs server action detects a changed docs/ mtime signature.
 *
 * @returns The viewer with the primary document.
 */
export default function Home() {
  const docs = getAllDocMetas();
  const meta = docs.find((doc) => doc.primary) ?? docs[0];
  const activeDoc = meta ? getDocBySlug(meta.slug) : null;

  return <DocsViewer docs={docs} activeDoc={activeDoc} />;
}
