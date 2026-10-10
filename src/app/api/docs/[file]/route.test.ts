import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/docs/[file]/route";
import { docRegistry } from "@/lib/docs";

function makeRequest(path: string): NextRequest {
  return new NextRequest(`http://localhost${path}`);
}

function callGet(file: string) {
  return GET(makeRequest(`/api/docs/${file}`), {
    params: Promise.resolve({ file }),
  });
}

describe("GET /api/docs/[file]", () => {
  it("returns the raw markdown of a whitelisted document", async () => {
    const res = await callGet("design-guide");
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/markdown");
    expect(res.headers.get("Content-Disposition")).toBe('attachment; filename="design-guide.md"');
    await expect(res.text()).resolves.toContain("#");
  });

  it("escapes the file name inside the Content-Disposition header", async () => {
    const res = await callGet(docRegistry[0].slug);
    const disposition = res.headers.get("Content-Disposition") ?? "";
    expect(disposition).not.toMatch(/[\r\n]/);
    expect(disposition.split('"')).toHaveLength(3);
  });

  it("404s unknown slugs and path traversal attempts", async () => {
    for (const value of [
      "nope",
      "design-guide.md",
      "..",
      "..%2Fpackage.json",
      "../package.json",
      "%2e%2e%2fpackage.json",
    ]) {
      const res = await callGet(value);
      expect(res.status, value).toBe(404);
    }
  });

  it("prerenders exactly the registry slugs", () => {
    expect(docRegistry.length).toBeGreaterThan(0);
  });
});
