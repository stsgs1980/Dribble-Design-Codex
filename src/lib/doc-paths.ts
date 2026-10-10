import type { DocMeta } from "./docs-types";

/**
 * Public URL of a document. The primary document lives at the site root, every
 * other document under its own static path (see app/[doc]/page.tsx), so the
 * viewer pages are prerendered by generateStaticParams instead of rendered
 * per request.
 *
 * @param meta - Document metadata (only slug and primary are read).
 * @returns "/" for the primary document, "/<slug>" for the rest.
 */
export function docPath(meta: Pick<DocMeta, "slug" | "primary">): string {
  return meta.primary ? "/" : `/${encodeURIComponent(meta.slug)}`;
}
