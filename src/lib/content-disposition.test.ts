import { describe, expect, it } from "vitest";
import { attachmentDisposition, escapeFileNameParameter } from "@/lib/content-disposition";

describe("escapeFileNameParameter", () => {
  it("leaves safe names untouched", () => {
    expect(escapeFileNameParameter("design-guide.md")).toBe("design-guide.md");
  });

  it("escapes quotes and backslashes that would end the quoted string", () => {
    expect(escapeFileNameParameter('say "hi".md')).toBe('say \\"hi\\".md');
    expect(escapeFileNameParameter("a\\b.md")).toBe("a\\\\b.md");
  });

  it("removes CR/LF used for header smuggling", () => {
    expect(escapeFileNameParameter('a"\r\nX-Evil: 1')).toBe('a\\" X-Evil: 1');
  });
});

describe("attachmentDisposition", () => {
  it("builds an attachment header with one quoted value", () => {
    const header = attachmentDisposition("design-guide.md");
    expect(header).toBe('attachment; filename="design-guide.md"');
    expect(header.split('"')).toHaveLength(3);
  });

  it("keeps injected header lines inside the quoted string", () => {
    const header = attachmentDisposition('x"\r\nX-Evil: 1');
    expect(header).toBe('attachment; filename="x\\" X-Evil: 1"');
    expect(header).not.toMatch(/[\r\n]/);
  });
});
