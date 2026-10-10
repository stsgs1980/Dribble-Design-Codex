// URL helpers shared by server and client code (no Node.js dependencies).

/**
 * Only these schemes may survive into an href. The markdown source lives in
 * the repository, but it is rendered with react-markdown as raw HTML links:
 * without an allowlist a `[text](javascript:...)` link would execute script
 * in the reader's browser.
 */
const ALLOWED_SCHEME_RE = /^(?:https?|mailto|tel):/i;

/**
 * Returns an href that is safe to put on an anchor, or null when the link
 * must be dropped. Relative URLs (paths, anchors, queries) are kept as-is;
 * every absolute URL is checked against the scheme allowlist after removing
 * the whitespace and control characters browsers ignore while parsing it.
 *
 * @param href - Raw href coming from a markdown link.
 * @returns The same href (trimmed) when it is safe, otherwise null.
 */
export function sanitizeHref(href: string | undefined | null): string | null {
  if (!href) return null;

  const value = href.trim();
  if (!value) return null;

  // A scheme is only present when the string starts with `scheme:`; anything
  // else is a relative URL (#anchor, ./path, ../path, ?query, //host).
  const compact = value.replace(/[\u0000-\u0020\u007f]/g, "");
  if (/^[a-z][a-z0-9+.-]*:/i.test(compact)) {
    return ALLOWED_SCHEME_RE.test(compact) ? value : null;
  }

  return value;
}
