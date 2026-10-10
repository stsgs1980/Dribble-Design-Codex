import { NextRequest, NextResponse } from "next/server";
import { docRegistry, getDocBySlug } from "@/lib/docs";
import { attachmentDisposition } from "@/lib/content-disposition";

// GET /api/docs/<slug>
// Returns the raw markdown of a whitelisted document as an attachment.
// generateStaticParams prerenders one response per registry slug at build
// time. Any other slug is resolved through the same registry whitelist, so
// path traversal such as ../package.json can never leave docs/.
export function generateStaticParams() {
  return docRegistry.map((meta) => ({ file: meta.slug }));
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;

  const doc = getDocBySlug(file);
  if (!doc) {
    return NextResponse.json({ error: "Документ не найден." }, { status: 404 });
  }

  return new NextResponse(doc.content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": attachmentDisposition(doc.fileName),
    },
  });
}
