import { notFound, redirect } from "next/navigation";
import { getAllDocMetas, getDocBySlug } from "@/lib/docs";
import { docPath } from "@/lib/doc-paths";
import { DocsViewer } from "@/components/docs/docs-viewer";

interface DocPageProps {
  params: Promise<{ doc: string }>;
}

/**
 * One static path per registered document (the primary one lives at /).
 * Unknown slugs are still resolved through the registry whitelist and 404,
 * so path traversal can never leave docs/.
 *
 * @returns Route params for every non-primary registry slug.
 */
export function generateStaticParams() {
  return getAllDocMetas()
    .filter((meta) => !meta.primary)
    .map((meta) => ({ doc: meta.slug }));
}

/**
 * Renders a single document; the slug of the primary document redirects to
 * the site root and unknown slugs end in the not-found page.
 *
 * @param props - Route params of the [doc] segment.
 * @returns The viewer with the requested document.
 */
export default async function DocPage({ params }: DocPageProps) {
  const { doc } = await params;

  const activeDoc = getDocBySlug(doc);
  if (!activeDoc) {
    notFound();
  }
  if (activeDoc.primary) {
    // The primary document is served from the site root.
    redirect(docPath(activeDoc));
  }

  const docs = getAllDocMetas();
  return <DocsViewer docs={docs} activeDoc={activeDoc} />;
}
