import { NextRequest, NextResponse } from "next/server";
import { getDocBySlug } from "@/lib/docs";

// GET /api/docs?file=<slug>
// Returns the raw markdown of a whitelisted document as an attachment.
// The slug is validated against the registry, so path traversal such as
// ../package.json can never resolve to a file outside docs/.
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get("file");

  if (!file) {
    return NextResponse.json(
      { error: "Обязательный параметр file не указан" },
      { status: 400 },
    );
  }

  const doc = getDocBySlug(file);
  if (!doc) {
    return NextResponse.json(
      { error: "Документ не найден. Проверьте значение параметра file." },
      { status: 404 },
    );
  }

  return new NextResponse(doc.content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${doc.fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
