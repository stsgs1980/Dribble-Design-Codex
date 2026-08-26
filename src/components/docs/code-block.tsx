"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

const LANGUAGE_LABELS: Record<string, string> = {
  css: "CSS",
  ts: "TypeScript",
  tsx: "TSX",
  js: "JavaScript",
  jsx: "JSX",
  json: "JSON",
  bash: "Bash",
  sh: "Shell",
  text: "Text",
  md: "Markdown",
  html: "HTML",
};

const CODE_FONT =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = React.useCallback(async () => {
    const markCopied = () => {
      setCopied(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    };

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
        markCopied();
        return;
      }
    } catch {
      // Clipboard API blocked, fall through to the legacy path.
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      markCopied();
    } catch {
      // Clipboard is unavailable in this context.
    }
  }, [code]);

  const label = LANGUAGE_LABELS[language] ?? language.toUpperCase();

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-black/10 shadow-sm dark:border-white/10">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#21252b] py-1.5 pl-4 pr-2">
        <span className="flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">
          <span
            className="size-1.5 rounded-full bg-brand/80"
            aria-hidden="true"
          />
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Код скопирован" : "Копировать код"}
          className={cn(
            "flex min-h-11 items-center gap-1.5 rounded-md px-2.5 py-1.5 font-sans text-[12px] font-medium transition-colors lg:min-h-0",
            copied
              ? "text-brand"
              : "text-zinc-400 hover:bg-white/10 hover:text-zinc-100 focus-visible:bg-white/10 focus-visible:text-zinc-100",
          )}
        >
          {copied ? (
            <Check className="size-3.5" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
          <span>{copied ? "Скопировано" : "Копировать"}</span>
        </button>
      </div>
      <div className="bg-[#282c34]">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "16px 20px",
            background: "transparent",
            fontSize: "13px",
            lineHeight: 1.7,
            fontFamily: CODE_FONT,
            overflowX: "auto",
          }}
          codeTagProps={{ style: { fontFamily: "inherit", fontSize: "inherit" } }}
        >
          {code.replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
