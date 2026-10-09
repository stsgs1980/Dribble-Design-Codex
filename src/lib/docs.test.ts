import { describe, expect, it } from "vitest";
import { extractToc, getAllDocMetas, getAllDocs, getDocBySlug } from "./docs";
import { pluralRu } from "./utils";

describe("extractToc", () => {
  it("collects h2/h3 headings with github-slugger ids", () => {
    const toc = extractToc("## First section\n\n### Sub section\n\n#### Deep\n\n# Title");
    expect(toc).toEqual([
      { id: "first-section", text: "First section", depth: 2 },
      { id: "sub-section", text: "Sub section", depth: 3 },
    ]);
  });

  it("ignores headings inside fenced code blocks (backticks and tildes)", () => {
    const md = [
      "## Real",
      "```md",
      "## Not a heading",
      "```",
      "~~~text",
      "## Also not",
      "~~~",
    ].join("\n");
    expect(extractToc(md).map((h) => h.text)).toEqual(["Real"]);
  });

  it("keeps a trailing # that is part of the text (e.g. C#)", () => {
    const toc = extractToc("## C#\n\n## Title ###\n");
    expect(toc.map((h) => h.text)).toEqual(["C#", "Title"]);
  });

  it("dedupes repeated headings the same way rehype-slug does", () => {
    const toc = extractToc("## Overview\n\n## Overview\n\n## Overview");
    expect(toc.map((h) => h.id)).toEqual(["overview", "overview-1", "overview-2"]);
  });

  it("strips inline markdown from heading text", () => {
    const toc = extractToc("## The `code` and [a link](https://example.com)");
    expect(toc[0].text).toBe("The code and a link");
    expect(toc[0].id).toBe("the-code-and-a-link");
  });
});

describe("doc registry whitelist", () => {
  it("serves registered slugs", () => {
    const doc = getDocBySlug("design-guide");
    expect(doc).not.toBeNull();
    expect(doc?.fileName).toBe("design-guide.md");
    expect(doc?.content.length).toBeGreaterThan(0);
    expect(doc?.toc.length).toBeGreaterThan(0);
  });

  it("rejects unknown slugs and any path traversal attempt", () => {
    expect(getDocBySlug("nope")).toBeNull();
    expect(getDocBySlug("../package.json")).toBeNull();
    expect(getDocBySlug("..%2Fpackage.json")).toBeNull();
    expect(getDocBySlug("design-guide/../../package.json")).toBeNull();
    expect(getDocBySlug("")).toBeNull();
  });

  it("exposes lightweight metadata for every registered document", () => {
    const metas = getAllDocMetas();
    expect(metas.length).toBeGreaterThan(0);
    for (const meta of metas) {
      expect(meta).not.toHaveProperty("content");
      expect(getDocBySlug(meta.slug)).not.toBeNull();
    }
  });

  it("loads all documents without throwing", () => {
    const docs = getAllDocs();
    expect(docs.length).toBe(getAllDocMetas().length);
  });
});

describe("pluralRu", () => {
  const forms = ["строка", "строки", "строк"] as const;

  it("selects the correct Russian plural form", () => {
    expect(pluralRu(1, ...forms)).toBe("строка");
    expect(pluralRu(2, ...forms)).toBe("строки");
    expect(pluralRu(4, ...forms)).toBe("строки");
    expect(pluralRu(5, ...forms)).toBe("строк");
    expect(pluralRu(11, ...forms)).toBe("строк");
    expect(pluralRu(21, ...forms)).toBe("строка");
    expect(pluralRu(102, ...forms)).toBe("строки");
    expect(pluralRu(0, ...forms)).toBe("строк");
    expect(pluralRu(111, ...forms)).toBe("строк");
    expect(pluralRu(-1, ...forms)).toBe("строка");
  });
});
