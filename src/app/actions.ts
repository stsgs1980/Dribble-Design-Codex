"use server";

import { revalidatePath, refresh } from "next/cache";
import { docRegistry, getDocsRevision } from "@/lib/docs";
import { docPath } from "@/lib/doc-paths";

// The viewer pages and the download responses are prerendered with
// generateStaticParams instead of being rendered on every request
// (force-dynamic). Their cache is never expired by time; instead the browser
// runs this check on every full page load. When the mtime+size signature of
// docs/ changed since the previous check, the prerendered entries are
// invalidated — the next render re-reads the markdown through the
// mtime-keyed read cache — and the current view is refreshed, so edits in
// docs/ are visible without a rebuild.
//
// The baseline starts empty on purpose: the first load invalidates once,
// which also covers a restart where files changed while the server was down.
let lastRevision: string | null = null;

/**
 * Invalidates prerendered docs routes when the docs/ signature changed.
 *
 * @returns Whether the prerendered routes were invalidated, plus the new signature.
 */
export async function syncDocs(): Promise<{ changed: boolean; revision: string }> {
  const revision = getDocsRevision();
  const changed = lastRevision !== revision;
  if (!changed) return { changed, revision };

  lastRevision = revision;

  const paths = new Set<string>(["/"]);
  for (const meta of docRegistry) {
    paths.add(docPath(meta));
    paths.add(`/api/docs/${meta.slug}`);
  }
  for (const path of paths) {
    revalidatePath(path);
  }

  refresh();
  return { changed, revision };
}
