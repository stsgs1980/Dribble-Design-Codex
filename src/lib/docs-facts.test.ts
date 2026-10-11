import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Documentation invariants for docs/design-guide.md and docs/sources/01..04.
 *
 * Source of truth: "Аудит достоверности: design-guide.md" (edition 3,
 * 2026-10-11), re-verified against the npm registry, WCAG 2.2, Tailwind CSS
 * 4.3.3 theme.css, vendor documentation and real font files on 2026-10-11.
 *
 * Each assertion encodes one required fix. The file is created before the
 * docs are edited and stays red until every fix is applied.
 */

const DOCS_DIR = path.join(process.cwd(), "docs");

function readDoc(relativePath: string): string {
  return fs.readFileSync(path.join(DOCS_DIR, relativePath), "utf8");
}

const GUIDE = readDoc("design-guide.md");
const S01 = readDoc("sources/01-design-fundamentals.md");
const S02 = readDoc("sources/02-dribbble-level-layers.md");
const S03 = readDoc("sources/03-untitled-ui-react-flow.md");
const S04 = readDoc("sources/04-design-guide-dribbble-level.md");
const ALL_DOCS: Record<string, string> = {
  guide: GUIDE,
  s01: S01,
  s02: S02,
  s03: S03,
  s04: S04,
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function row(...cells: string[]): RegExp {
  return new RegExp(cells.map(escapeRegExp).join("\\s*\\|\\s*"));
}

function expectAbsent(label: string, docs: Record<string, string>, patterns: RegExp[]): void {
  for (const [name, text] of Object.entries(docs)) {
    for (const pattern of patterns) {
      expect(text, `${label}: ${pattern} still present in ${name}`).not.toMatch(pattern);
    }
  }
}

function expectInDoc(label: string, text: string, name: string, patterns: RegExp[]): void {
  for (const pattern of patterns) {
    expect(text, `${label}: ${pattern} missing in ${name}`).toMatch(pattern);
  }
}

describe("docs: packages that do not exist or are named incorrectly", () => {
  it("has no reference to dead or misnamed packages (K1, K2, K5, F4)", () => {
    expectAbsent("dead packages", ALL_DOCS, [
      /@xyflow\/react-controls/,
      /iconify-react/,
      /shimmer-border(?!`\s+в каталоге нет)/i,
      /untitled-ui@latest/,
      /untitled-ui@\^/,
      /@untitled-ui\/icons/,
      /`untitled-ui` 0\.1\.69/,
      /v0\.dev/,
      /godly\.website/,
    ]);
  });
});

describe("docs/design-guide.md: version table", () => {
  it("pins the corrected majors and minors", () => {
    expectInDoc("versions", GUIDE, "guide", [
      row("typescript", "^7"),
      row("motion / framer-motion", "^14"),
      row("react-spring", "^10"),
      row("react-syntax-highlighter", "^16"),
      row("lottie-react", "^3"),
      row("@formkit/auto-animate", "^0.10"),
      row("tailwind-merge", "^3.7"),
      row("gsap", "^3.15"),
      row("@splinetool/react-spline", "^4"),
      row("three + @react-three/fiber", "^0.186 / ^9"),
      row("@iconify/react", "^6"),
      row("react-aria-components", "^1.22"),
      row("@dagrejs/dagre", "^3.1"),
      row("@hookform/resolvers", "^5"),
      row("lucide-react", "^1"),
      row("radix-ui", "^1.7"),
      row("geist", "^1.7.2"),
    ]);
  });

  it("describes packages that are not npm dependencies", () => {
    expectInDoc("non-npm", GUIDE, "guide", [
      row("UI (путь B)", "Untitled UI React", "не npm-зависимость"),
      row("Magic UI", "не npm-зависимость"),
      row("Tremor (copy-paste)", "не npm-зависимость"),
      /npx shadcn@latest add @magicui\//,
      /npx untitledui@latest add/,
    ]);
  });

  it("records the Vercel ownership and the frozen npm package of Tremor", () => {
    expectInDoc("tremor", GUIDE, "guide", [/Vercel/, /2025-01-13/, /copy-paste/]);
  });
});

describe("docs/design-guide.md: normative layer", () => {
  it("uses correct WCAG thresholds", () => {
    expectInDoc("wcag", GUIDE, "guide", [
      /24px regular \/ 18\.7px bold/,
      /24x24 CSS px/,
      /44x44 CSS px/,
    ]);
  });

  it("uses contrast-safe tokens", () => {
    expectInDoc("tokens", GUIDE, "guide", [/oklch\(0\.545 0 0\)/, /oklch\(0\.64 0 0\)/]);
  });

  it("connects fonts with the cyrillic subset and names the latin-only ones", () => {
    expect(GUIDE.match(/subsets: \["latin", "cyrillic"\]/g)).toHaveLength(3);
    expectInDoc("fonts", GUIDE, "guide", [/npm-пакет `geist`/, /Только латиница/]);
  });

  it("uses the current Zod API", () => {
    expectInDoc("zod", GUIDE, "guide", [/z\.email\(/]);
    expectAbsent("zod", { guide: GUIDE }, [/z\.string\(\)\.email\(/]);
  });

  it("contains the fixed code samples", () => {
    expectInDoc("code", GUIDE, "guide", [
      /group relative overflow-hidden rounded-xl/,
      /variants=\{item\}/,
      /controller\.disable\(\)/,
    ]);
  });

  it("marks the unverifiable numbers as heuristics", () => {
    expectAbsent("numbers", { guide: GUIDE }, [/90%/]);
  });

  it("points appendix B at the local rules and appendix C at the source age", () => {
    expectInDoc("appendices", GUIDE, "guide", [
      /eslint-rules\/unicode-policy\.js/,
      /eslint-rules\/code-block-language\.js/,
      /август 2026/,
    ]);
  });
});

describe("docs/sources: inherited defects", () => {
  it("source 03 drops the dead rows and bumps the versions", () => {
    expectAbsent("s03 dead rows", { s03: S03 }, [
      /React Aria.*\^1\.20/,
      /\*\*Framer Motion\*\* \/ \*\*Motion\*\* \^13/,
      /\*\*auto-animate\*\* \^0\.8/,
      /\*\*Iconify React\*\* \^4/,
      /\*\*Tremor\*\* \^3\.18/,
      /\*\*lottie-react\*\* \^2/,
      /\*\*dagre\*\*/,
      /владимость/,
    ]);
    expectInDoc("s03 fixed rows", S03, "s03", [
      /react-aria-components.*\^1\.22/,
      /@dagrejs\/dagre/,
      /@iconify\/react/,
      /240 наборов/,
      /@formkit\/auto-animate.*\^0\.10/,
      /motion.*\^14/,
      /npx untitledui@latest add/,
      /@untitledui\/icons/,
    ]);
  });

  it("sources 01, 02, 04 drop the dead claims and old addresses", () => {
    expectAbsent("sources claims", { s01: S01, s02: S02, s04: S04 }, [/150 000/, /100\+ наборов/]);
    expectInDoc("sources iconify", S02, "s02", [/240 наборов/]);
    expectInDoc("sources iconify", S04, "s04", [/300 000/]);
  });
});
