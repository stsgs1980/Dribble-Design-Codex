import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type { DocMeta, DocPayload, TocHeading } from "./docs-types";

// Read-only registry of the project documentation. The slug is the only
// value accepted by the /api/docs/<slug> download endpoint (whitelist, no
// path traversal possible: the file path always comes from this registry).
export const docRegistry: readonly DocMeta[] = [
  {
    slug: "design-guide",
    file: "design-guide.md",
    fileName: "design-guide.md",
    title: "Единый гайд по дизайну интерфейсов уровня Dribbble",
    subtitle: "Рабочий стандарт дизайна",
    short: "Единый гайд",
    icon: "book",
    primary: true,
  },
  {
    slug: "fundamentals",
    file: "sources/01-design-fundamentals.md",
    fileName: "design-fundamentals.md",
    title: "Фундамент дизайна",
    subtitle: "Основы визуального дизайна",
    short: "Фундамент",
    icon: "palette",
    primary: false,
  },
  {
    slug: "layers",
    file: "sources/02-dribbble-level-layers.md",
    fileName: "dribbble-level-layers.md",
    title: "Dribbble-уровень: слои",
    subtitle: "Модель шести слоёв визуального качества",
    short: "Слои Dribbble",
    icon: "layers",
    primary: false,
  },
  {
    slug: "untitled-ui",
    file: "sources/03-untitled-ui-react-flow.md",
    fileName: "untitled-ui-react-flow.md",
    title: "Untitled UI + React Flow",
    subtitle: "Стек без shadcn",
    short: "Untitled UI",
    icon: "workflow",
    primary: false,
  },
  {
    slug: "full-guide",
    file: "sources/04-design-guide-dribbble-level.md",
    fileName: "design-guide-dribbble-level.md",
    title: "Гайд по дизайну: полный стек",
    subtitle: "Фундамент, стек, насмотренность",
    short: "Полный стек",
    icon: "compass",
    primary: false,
  },
];

// Per CommonMark a closing sequence of #s is only a closing sequence when it
// is preceded by a space/tab (or the whole line is #s), so "## C#" keeps the
// trailing hash while "## Title ###" does not.
const HEADING_RE = /^(#{1,6})[ \t]+(.*?)[ \t]*$/;
const TRAILING_HASHES_RE = /(^|[ \t])#+$/;
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

    const raw = match[2].replace(TRAILING_HASHES_RE, "$1").trim();
    const text = stripInlineMarkdown(raw);
    if (!text) continue;

    const depth = match[1].length;
    const id = slugger.slug(text);
    if (depth === 2 || depth === 3) {
      headings.push({ id, text, depth });
    }
  }

  return headings;
}

/**
 * Per-process read cache keyed by file mtime, so prerendered pages and route
 * handlers re-read and re-parse unchanged markdown while edits in docs/** are
 * still picked up on the next regeneration.
 */
const docCache = new Map<string, { mtimeMs: number; payload: DocPayload }>();

function readDoc(meta: DocMeta): DocPayload {
  const filePath = docFilePath(meta);
  const { mtimeMs } = fs.statSync(filePath);
  const cached = docCache.get(filePath);
  if (cached && cached.mtimeMs === mtimeMs) return cached.payload;

  const content = fs.readFileSync(filePath, "utf8");
  const toc = extractToc(content);

  const payload: DocPayload = {
    ...meta,
    content,
    toc,
    lines: content.split(/\r?\n/).length,
    sections: toc.filter((heading) => heading.depth === 2).length,
  };
  docCache.set(filePath, { mtimeMs, payload });
  return payload;
}

/** Lightweight registry copy: sidebar/list data without file content. */
export function getAllDocMetas(): DocMeta[] {
  return docRegistry.map((meta) => ({ ...meta }));
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

function docFilePath(meta: DocMeta): string {
  // The "docs" segment is statically visible to the bundler so that the
  // standalone output traces the docs/ folder instead of the whole project.
  return path.join(process.cwd(), "docs", meta.file);
}

/**
 * Change signature of the whole documentation set: every registered file's
 * mtime and size, plus a marker for unreadable entries. The viewer pages and
 * the download responses are prerendered (generateStaticParams), so their
 * cache is invalidated on demand only when this signature changes — see the
 * syncDocs server action in app/actions.ts.
 */
export function getDocsRevision(): string {
  return docRegistry
    .map((meta) => {
      try {
        const { mtimeMs, size } = fs.statSync(docFilePath(meta));
        return `${meta.slug}:${mtimeMs}:${size}`;
      } catch {
        return `${meta.slug}:unreadable`;
      }
    })
    .join("|");
}

/**
 * Loads every registered document. Unreadable entries are skipped instead of
 * throwing, so a missing or renamed file degrades to a shorter list rather
 * than a 500 on the home page. The viewer already handles an empty list.
 */
export function getAllDocs(): DocPayload[] {
  const payloads: DocPayload[] = [];

  for (const meta of docRegistry) {
    try {
      payloads.push(readDoc(meta));
    } catch {
      console.error(`[docs] failed to read "${meta.file}" (slug "${meta.slug}")`);
    }
  }

  return payloads;
}
