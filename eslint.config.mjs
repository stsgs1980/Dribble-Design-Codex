import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import markdown from "@eslint/markdown";
import unicodePolicy from "./eslint-rules/unicode-policy.mjs";
import codeBlockLanguage from "./eslint-rules/code-block-language.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Wraps a custom documentation rule so its Program() visitor also fires on
 * Markdown AST root node. Required to run the rules on full Markdown text
 * via the markdown/gfm language (its AST root is "root", not "Program").
 */
function withMarkdownRoot(rule) {
  const originalCreate = rule.create;
  return {
    ...rule,
    create(context) {
      const visitors = originalCreate(context);
      const check = visitors.Program;
      if (typeof check === "function") {
        return { ...visitors, root: check };
      }
      return visitors;
    },
  };
}

const unicodePolicyPlugin = {
  meta: { name: "unicode-policy", version: "1.0.0" },
  rules: {
    emoji: withMarkdownRoot(unicodePolicy.rules.emoji),
    "unicode-graphics": withMarkdownRoot(unicodePolicy.rules["unicode-graphics"]),
    "emoji-in-md": withMarkdownRoot(unicodePolicy.rules["emoji-in-md"]),
    "unicode-graphics-in-md": withMarkdownRoot(
      unicodePolicy.rules["unicode-graphics-in-md"],
    ),
  },
};

const codeBlockLanguagePlugin = {
  meta: { name: "code-block-language", version: "1.0.0" },
  rules: { "require-language": withMarkdownRoot(codeBlockLanguage) },
};

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  rules: {
    // TypeScript rules
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/prefer-as-const": "off",
    "@typescript-eslint/no-unused-disable-directive": "off",

    // React rules
    "react-hooks/exhaustive-deps": "off",
    "react-hooks/purity": "off",
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "react/prop-types": "off",
    "react-compiler/react-compiler": "off",

    // Next.js rules
    "@next/next/no-img-element": "off",
    "@next/next/no-html-link-for-pages": "off",

    // General JavaScript rules
    "prefer-const": "off",
    "no-unused-vars": "off",
    "no-console": "off",
    "no-debugger": "off",
    "no-empty": "off",
    "no-irregular-whitespace": "off",
    "no-case-declarations": "off",
    "no-fallthrough": "off",
    "no-mixed-spaces-and-tabs": "off",
    "no-redeclare": "off",
    "no-undef": "off",
    "no-unreachable": "off",
    "no-useless-escape": "off",
  },
}, {
  // Project documentation (docs/**): Markdown quality + documentation policy.
  // Policy rules (from eslint-rules/): no emoji, no unicode graphics,
  // fenced code blocks must specify a language.
  files: ["docs/**/*.md"],
  language: "markdown/gfm",
  plugins: {
    markdown,
    "unicode-policy": unicodePolicyPlugin,
    "code-block-language": codeBlockLanguagePlugin,
  },
  rules: {
    // @eslint/markdown recommended set
    "markdown/fenced-code-language": "error",
    "markdown/heading-increment": "error",
    "markdown/no-duplicate-definitions": "error",
    "markdown/no-duplicate-headings": "error",
    "markdown/no-empty-definitions": "error",
    "markdown/no-empty-images": "error",
    "markdown/no-empty-links": "error",
    "markdown/no-html": "error",
    "markdown/no-invalid-label-refs": "error",
    "markdown/no-missing-atx-heading-space": "error",
    "markdown/no-missing-label-refs": "error",
    "markdown/no-missing-link-fragments": "error",
    "markdown/no-multiple-h1": "error",
    "markdown/no-reference-like-urls": "error",
    "markdown/no-reversed-media-syntax": "error",
    "markdown/no-space-in-emphasis": "error",
    "markdown/no-unused-definitions": "error",
    "markdown/require-alt-text": "error",
    "markdown/table-column-count": "error",
    // Documentation policy: unicode-policy (no emoji, no unicode graphics)
    "unicode-policy/emoji": "error",
    "unicode-policy/unicode-graphics": "error",
    "unicode-policy/emoji-in-md": "error",
    "unicode-policy/unicode-graphics-in-md": "error",
    // Documentation policy: code blocks must specify a language
    "code-block-language/require-language": "error",
  },
}, {
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "examples/**", "skills", "upload/**", "eslint.docs-*.config.mjs"]
}];

export default eslintConfig;
