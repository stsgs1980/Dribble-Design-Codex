import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type { DocMeta, DocPayload, TocHeading } from "./docs-types";

// Read-only registry of the project documentation. The slug is the only
// value accepted by the /api/docs download endpoint (whitelist, no path
// traversal possible: the file path always comes from this registry).
export const docRegistry: readonly DocMeta[] = [
  {
    slug: "design-guide",
    file: "docs/design-guide.md",
    fileName: "design-guide.md",
    title: "Единый гайд по дизайну интерфейсов уровня Dribbble",
    subtitle: "Рабочий стандарт дизайна",
    short: "Единый гайд",
    icon: "book",
    primary: true,
  },
  {
    slug: "fundamentals",
    file: "docs/sources/01-design-fundamentals.md",
    fileName: "design-fundamentals.md",
    title: "Фундамент дизайна",
    subtitle: "Основы визуального дизайна",
    short: "Фундамент",
    icon: "palette",
    primary: false,
  },
  {
    slug: "layers",
    file: "docs/sources/02-dribbble-level-layers.md",
    fileName: "dribbble-level-layers.md",
    title: "Dribbble-уровень: слои",
    subtitle: "Модель шести слоёв визуального качества",
    short: "Слои Dribbble",
    icon: "layers",
    primary: false,
  },
  {
    slug: "untitled-ui",
    file: "docs/sources/03-untitled-ui-react-flow.md",
    fileName: "untitled-ui-react-flow.md",
    title: "Untitled UI + React Flow",
    subtitle: "Стек без shadcn",
    short: "Untitled UI",
    icon: "workflow",
    primary: false,
  },
  {
    slug: "full-guide",
    file: "docs/sources/04-design-guide-dribbble-level.md",
    fileName: "design-guide-dribbble-level.md",
    title: "Гайд по дизайну: полный стек",
    subtitle: "Фундамент, стек, насмотренность",
    short: "Полный стек",
    icon: "compass",
    primary: false,
  },
];

const HEADING_RE = /^(#{1,6})[ \t]+(.*?)[ \t]*#*[ \t]*$/;
const FENCE_RE = /^[ \t]*(?:```|~~~)/;

function stripInlineMarkdown(raw: string): string {
  return raw
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .trim();
}

/**
 * Extracts h2/h3 headings for the table of contents. Every heading (h1-h6)
 * is passed through the slugger in document order so that dedupe suffixes
 * stay identical to the ids produced by rehype-slug at render time.
 */
export function extractToc(markdown: string): TocHeading[] {
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];
  let inFence = false;

  for (const line of markdown.split(/\r?\n/)) {
    if (FENCE_RE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = HEADING_RE.exec(line);
    if (!match) continue;

    const text = stripInlineMarkdown(match[2]);
    if (!text) continue;

    const depth = match[1].length;
    const id = slugger.slug(text);
    if (depth === 2 || depth === 3) {
      headings.push({ id, text, depth });
    }
  }

  return headings;
}

function readDoc(meta: DocMeta): DocPayload {
  const filePath = path.join(process.cwd(), meta.file);
  const content = fs.readFileSync(filePath, "utf8");
  const toc = extractToc(content);

  return {
    ...meta,
    content,
    toc,
    lines: content.split(/\r?\n/).length,
    sections: toc.filter((heading) => heading.depth === 2).length,
    words: content.split(/\s+/).filter(Boolean).length,
  };
}

/** Resolves a whitelisted slug to its full document. Returns null for unknown slugs. */
export function getDocBySlug(slug: string): DocPayload | null {
  const meta = docRegistry.find((doc) => doc.slug === slug);
  if (!meta) return null;
  try {
    return readDoc(meta);
  } catch {
    return null;
  }
}

/** Loads the whole registry (used by the / page). */
export function getAllDocs(): DocPayload[] {
  return docRegistry.map((meta) => readDoc(meta));
}

export const docsCount = docRegistry.length;
