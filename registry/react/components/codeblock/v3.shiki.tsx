"use client";

import { CopyButton } from "@/registry/react/components/codeblock/copy-button";
import { getIconForLanguageExtension } from "@/registry/react/components/codeblock/icons";
import { useState, useEffect } from "react";
import { codeToHtml } from "shiki";
import "./v3.shiki.css";
import { CodeCollapsibleWrapper } from "@/registry/react/components/codeblock/code-collapsible-wrapper";
import { CodeBlockProps } from "@/registry/react/components/codeblock/types";
import { cn } from "@/lib/utils";

/**
 * A syntax-highlighted code display component powered by
 * [Shiki](https://shiki.style), with a one-click copy button and optional
 * line numbering. Adapted from shadcn/ui
 *
 * @remarks
 * Shiki runs **client-side** inside a `useEffect` — on the first render the
 * component shows plain unstyled code as a fallback, then swaps in the
 * highlighted version once the async tokenization resolves. Language grammars
 * and themes are lazy-loaded on first use by Shiki's singleton highlighter.
 *
 * When `showLineNumbers` is `true`, the component appends data attributes to the
 * highlighted HTML, and uses CSS to style and add numbering so that line number gutters
 * can be rendered alongside highlighted tokens without breaking Shiki's inline styles.
 * imo this might be somewhat more performant than [v2](./v2.shiki.tsx).
 *
 * The copy button always copies the **raw** `code` string, not the
 * highlighted HTML, so the clipboard never contains any markup.
 *
 * If you don't need syntax highlighting and want zero extra dependencies,
 * use {@link CodeBlock} from `CodeBlock.tsx` instead.
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   filename="utils/scroll-lock.ts"
 *   language="typescript"
 *   themes = {
 *     dark: "github-dark",
 *     light: "github-light",
 *   }
 *   code={sourceCode}
 *   showLineNumbers
 * />
 * ```
 */
export function CodeBlock({
  code,
  language = "tsx",
  filename,
  themes = {
    dark: "github-dark",
    light: "github-light",
  },
  showLineNumbers = false,
  collapsible = false,
}: CodeBlockProps) {
  /**
   * Highlighted HTML string produced by `codeToHtml`.
   * `null` while Shiki is still loading.
   */
  const [highlightedHtml, setHighlightedHtml] = useState<string>();

  useEffect(() => {
    let cancelled = false;

    if (showLineNumbers) {
      codeToHtml(code, {
        lang: language,
        themes,
        transformers: [
          {
            pre(node) {
              node.properties["class"] =
                "has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 has-[[data-slot=tabs]]:p-0 bg-transparent!";
            },
            code(node) {
              node.properties["data-line-numbers"] = "";
            },
            line(node) {
              node.properties["data-line"] = "";
            },
          },
        ],
      }).then((html) => {
        if (!cancelled) setHighlightedHtml(html);
      });
    } else {
      // Plain, without the data attributes
      codeToHtml(code, { lang: language, themes }).then((html) => {
        if (!cancelled) setHighlightedHtml(html);
      });
    }

    return () => {
      cancelled = true;
    };
  }, [code, language, themes, showLineNumbers]);

  if (!collapsible) {
    return (
      <div className={cn("relative")}>
        <ComponentCode
          {...{
            code,
            language,
            filename,
            showLineNumbers,
            highlightedHtml,
          }}
        />
      </div>
    );
  }

  return (
    <CodeCollapsibleWrapper>
      <ComponentCode
        {...{
          code,
          language,
          filename,
          showLineNumbers,
          highlightedHtml,
        }}
      />
    </CodeCollapsibleWrapper>
  );
}

function ComponentCode({
  code,
  language = "tsx",
  filename,
  highlightedHtml,
}: Omit<CodeBlockProps, "collapsible"> & {
  highlightedHtml?: string;
}) {
  return (
    <div className="group relative mt-4 mb-12 flex flex-col overflow-hidden rounded-xl border">
      <figure data-rehype-pretty-code-figure="" className="[&>pre]:max-h-96">
        {filename && (
          <figcaption
            data-rehype-pretty-code-title=""
            className="text-code-foreground [&_svg]:text-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70"
            data-language={language}
          >
            {getIconForLanguageExtension(language)}
            {filename}
          </figcaption>
        )}
        <CopyButton value={code} />
        <div
          className="no-scrollbar min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain overscroll-y-auto outline-none [&>pre]:p-4 [&>pre]:leading-relaxed [&>pre]:bg-transparent! max-h-75 tablet:max-h-112.5"
          dangerouslySetInnerHTML={{
            __html:
              highlightedHtml ??
              `<pre class="p-4 text-zinc-400">${escapeHtml(code)}</pre>`,
          }}
        />
      </figure>
    </div>
  );
}

/**
 * Escapes HTML special characters to prevent XSS in the plain-text fallback
 * rendered before Shiki finishes loading.
 *
 * @param str - Raw string to escape.
 * @returns HTML-safe string.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
