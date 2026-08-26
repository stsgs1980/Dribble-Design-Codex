"use client";

import * as React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { motion, useReducedMotion } from "framer-motion";
import { Check, ExternalLink, Hash } from "lucide-react";
import { CodeBlock } from "./code-block";
import { cn } from "@/lib/utils";

/** Collects the plain text of a React node tree (used for code blocks). */
function nodeText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map((child) => nodeText(child)).join("");
  }
  if (React.isValidElement(node)) {
    return nodeText((node.props as { children?: React.ReactNode }).children);
  }
  return "";
}

const REVEAL_VIEWPORT = { once: true, margin: "0px 0px -48px 0px" } as const;

type RevealTag = "p" | "ul" | "ol" | "blockquote" | "div";

/**
 * Subtle scroll-reveal wrapper. Skipped entirely when the user prefers
 * reduced motion. Code blocks and headings are never animated.
 */
function Reveal({
  tag,
  reduced,
  className,
  children,
}: {
  tag: RevealTag;
  reduced: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  if (reduced) {
    const Tag = tag;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = (motion as unknown as Record<RevealTag, typeof motion.p>)[tag];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </MotionTag>
  );
}

/** Hover anchor link attached to section headings. */
function AnchorLink({ id }: { id?: string }) {
  if (!id) return null;
  return (
    <a
      href={`#${id}`}
      aria-label="Ссылка на этот раздел"
      className="absolute left-0 hidden h-[1.4em] w-6 -translate-x-full items-center justify-center text-muted-foreground/70 opacity-0 transition-opacity duration-200 hover:text-brand focus-visible:opacity-100 focus-visible:text-brand group-hover:opacity-100 sm:flex"
    >
      <Hash className="size-3.5" aria-hidden="true" />
    </a>
  );
}

function createComponents(reduced: boolean): Components {
  return {
    // The document title is rendered in the hero section instead.
    h1: () => null,

    h2: ({ id, children }) => (
      <h2
        id={id}
        className="group relative mt-14 scroll-mt-24 border-t border-border pt-8 text-[1.45rem] font-semibold leading-snug tracking-tight text-foreground sm:text-[1.55rem]"
      >
        <AnchorLink id={id} />
        {children}
      </h2>
    ),

    h3: ({ id, children }) => (
      <h3
        id={id}
        className="group relative mt-10 scroll-mt-24 text-[1.08rem] font-medium leading-snug tracking-tight text-muted-foreground"
      >
        <AnchorLink id={id} />
        {children}
      </h3>
    ),

    h4: ({ id, children }) => (
      <h4 id={id} className="mt-7 scroll-mt-24 text-[0.95rem] font-semibold text-foreground/90">
        {children}
      </h4>
    ),

    h5: ({ id, children }) => (
      <h5 id={id} className="mt-6 scroll-mt-24 text-[0.9rem] font-semibold text-foreground/85">
        {children}
      </h5>
    ),

    h6: ({ id, children }) => (
      <h6
        id={id}
        className="mt-6 scroll-mt-24 text-[0.85rem] font-semibold uppercase tracking-wide text-muted-foreground"
      >
        {children}
      </h6>
    ),

    p: ({ children }) => (
      <Reveal tag="p" reduced={reduced}>
        {children}
      </Reveal>
    ),

    ul: ({ children }) => (
      <Reveal tag="ul" reduced={reduced}>
        {children}
      </Reveal>
    ),

    ol: ({ children }) => (
      <Reveal tag="ol" reduced={reduced}>
        {children}
      </Reveal>
    ),

    blockquote: ({ children }) => (
      <Reveal tag="blockquote" reduced={reduced}>
        {children}
      </Reveal>
    ),

    table: ({ children }) => (
      <Reveal tag="div" reduced={reduced} className="my-6">
        <div className="w-full overflow-x-auto rounded-xl border border-border/70 bg-card/40">
          <table className="w-full">{children}</table>
        </div>
      </Reveal>
    ),

    a: ({ href, children }) => {
      const isExternal = Boolean(href && /^https?:\/\//.test(href));
      return (
        <a
          href={href}
          {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
          className="font-medium text-brand underline decoration-brand/40 underline-offset-4 transition-colors hover:decoration-brand"
        >
          {children}
          {isExternal && (
            <ExternalLink className="ml-0.5 inline size-3 align-[-0.125em]" aria-hidden="true" />
          )}
        </a>
      );
    },

    code: ({ children }) => (
      <code className="rounded-[5px] border border-border/70 bg-muted/70 px-[0.35em] py-[0.1em] font-mono text-[0.82em] font-medium text-foreground">
        {children}
      </code>
    ),

    pre: ({ children }) => {
      const first = Array.isArray(children) ? children[0] : children;
      if (React.isValidElement(first)) {
        const props = first.props as {
          className?: string;
          children?: React.ReactNode;
        };
        const languageMatch = /language-([^\s]+)/.exec(props.className ?? "");
        const code = nodeText(props.children).replace(/\n$/, "");
        return <CodeBlock code={code} language={languageMatch?.[1] ?? "text"} />;
      }
      return <pre>{children}</pre>;
    },

    input: ({ checked, type }) => {
      if (type !== "checkbox") {
        return <input type={type} readOnly className="size-4 accent-[var(--brand)]" />;
      }
      return (
        <span
          className={cn(
            "flex size-[15px] shrink-0 items-center justify-center rounded-[4px] border transition-colors",
            checked
              ? "border-brand bg-brand text-brand-foreground"
              : "border-muted-foreground/40 bg-background/40",
          )}
          aria-hidden="true"
        >
          {checked ? <Check className="size-3" strokeWidth={3.5} aria-hidden="true" /> : null}
        </span>
      );
    },
  };
}

export const MarkdownContent = React.memo(function MarkdownContent({
  content,
}: {
  content: string;
}) {
  const reducedMotion = useReducedMotion();
  const components = React.useMemo<Components>(
    () => createComponents(reducedMotion ?? false),
    [reducedMotion],
  );

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={components}>
      {content}
    </ReactMarkdown>
  );
});
