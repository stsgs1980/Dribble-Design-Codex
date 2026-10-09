import { getAllDocMetas, getDocBySlug } from "@/lib/docs";
import { DocsViewer } from "@/components/docs/docs-viewer";

// The documentation files are read from disk on every request (with an
// mtime-based cache in lib/docs.ts) so that edits to docs/** are reflected
// without a rebuild. Only the active document's content crosses the server
// boundary; the rest of the payload is lightweight metadata.
export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: Promise<{ doc?: string | string[] }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const requested = typeof params.doc === "string" ? params.doc : undefined;

  const docs = getAllDocMetas();
  const meta =
    docs.find((doc) => doc.slug === requested) ?? docs.find((doc) => doc.primary) ?? docs[0];
  const activeDoc = meta ? getDocBySlug(meta.slug) : null;

  return <DocsViewer docs={docs} activeDoc={activeDoc} />;
}
