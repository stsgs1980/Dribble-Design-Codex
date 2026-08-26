import { getAllDocs } from "@/lib/docs";
import { DocsViewer } from "@/components/docs/docs-viewer";

// The documentation files are read from disk on every request so that
// edits to docs/** are reflected without a rebuild.
export const dynamic = "force-dynamic";

export default function Home() {
  const docs = getAllDocs();
  return <DocsViewer docs={docs} />;
}
