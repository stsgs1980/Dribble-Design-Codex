// @ts-nocheck
/**
 * Barrel for react-syntax-highlighter deep ESM imports.
 *
 * Why this file exists: the light build (`prism-light` + per-language
 * modules) keeps the client bundle small, but those deep `.js` paths ship
 * no types and `@types/react-syntax-highlighter` only declares them as
 * ambient modules. TypeScript 5 resolved the ambient declarations; since
 * TypeScript 7 the successfully-resolved `.js` file wins and tsc reports
 * TS7016 on every deep import. Centralizing the untyped imports here (with
 * checking disabled for this file only) keeps the rest of the codebase
 * fully typed. If RSH ever ships bundled types, delete this barrel and
 * import the deep paths directly again.
 */
export { default as PrismLight } from "react-syntax-highlighter/dist/esm/prism-light";
export { default as bash } from "react-syntax-highlighter/dist/esm/languages/prism/bash";
export { default as css } from "react-syntax-highlighter/dist/esm/languages/prism/css";
export { default as javascript } from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
export { default as jsx } from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
export { default as json } from "react-syntax-highlighter/dist/esm/languages/prism/json";
export { default as markdown } from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
export { default as markup } from "react-syntax-highlighter/dist/esm/languages/prism/markup";
export { default as tsx } from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
export { default as typescript } from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
export { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
