import { describe, expect, it } from "vitest";
import { sanitizeHref } from "@/lib/safe-href";

describe("sanitizeHref", () => {
  it("keeps relative URLs", () => {
    for (const href of ["#anchor", "./relative", "../parent", "/absolute", "?query=1", "page.md"]) {
      expect(sanitizeHref(href), href).toBe(href);
    }
  });

  it("keeps allowlisted schemes, case-insensitively", () => {
    expect(sanitizeHref("https://example.com")).toBe("https://example.com");
    expect(sanitizeHref("http://example.com")).toBe("http://example.com");
    expect(sanitizeHref("HTTPS://EXAMPLE.COM")).toBe("HTTPS://EXAMPLE.COM");
    expect(sanitizeHref("mailto:docs@example.com")).toBe("mailto:docs@example.com");
    expect(sanitizeHref("tel:+79001234567")).toBe("tel:+79001234567");
  });

  it("trims surrounding whitespace", () => {
    expect(sanitizeHref("  https://example.com  ")).toBe("https://example.com");
  });

  it("drops javascript: URLs, including obfuscated ones", () => {
    for (const href of [
      "javascript:alert(1)",
      "JaVaScRiPt:alert(1)",
      "java\tscript:alert(1)",
      " javascript:alert(1)",
      "\u0001javascript:alert(1)",
    ]) {
      expect(sanitizeHref(href), href).toBeNull();
    }
  });

  it("drops every non-allowlisted scheme", () => {
    for (const href of [
      "data:text/html,<script>alert(1)</script>",
      "vbscript:msgbox(1)",
      "file:///etc/passwd",
      "blob:https://example.com/uuid",
      "jAvascript:alert(1)",
      "javascript\t:alert(1)",
    ]) {
      expect(sanitizeHref(href), href).toBeNull();
    }
  });

  it("drops empty and missing hrefs", () => {
    expect(sanitizeHref(undefined)).toBeNull();
    expect(sanitizeHref(null)).toBeNull();
    expect(sanitizeHref("")).toBeNull();
    expect(sanitizeHref("   ")).toBeNull();
  });
});
