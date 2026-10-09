import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/docs/route";

function makeRequest(query: string): NextRequest {
  return new NextRequest(`http://localhost/api/docs${query}`);
}

describe("GET /api/docs", () => {
  it("returns the raw markdown of a whitelisted document", async () => {
    const res = await GET(makeRequest("?file=design-guide"));
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/markdown");
    expect(res.headers.get("Content-Disposition")).toContain("attachment");
    expect(res.headers.get("Content-Disposition")).toContain("design-guide.md");
    await expect(res.text()).resolves.toContain("#");
  });

  it("rejects a missing file parameter", async () => {
    const res = await GET(makeRequest(""));
    expect(res.status).toBe(400);
  });

  it("rejects unknown slugs and path traversal attempts", async () => {
    for (const value of ["../package.json", "..%2Fpackage.json", "design-guide.md", "nope"]) {
      const res = await GET(makeRequest(`?file=${value}`));
      expect(res.status).toBe(404);
    }
  });
});
