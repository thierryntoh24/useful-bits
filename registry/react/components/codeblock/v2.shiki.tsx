"use client";

import { cn } from "@/lib/utils";
import { CodeCollapsibleWrapper } from "@/registry/react/components/codeblock/code-collapsible-wrapper";
import { CopyButton } from "@/registry/react/components/codeblock/copy-button";
import { getIconForLanguageExtension } from "@/registry/react/components/codeblock/icons";
import { CodeBlockProps } from "@/registry/react/components/codeblock/types";
import { useState, useEffect } from "react";
import { codeToHtml, codeToTokens, type ThemedToken } from "shiki";

/**
 * A syntax-highlighted code display component powered by
 * [Shiki](https://shiki.style), with a one-click copy button and optional
 * line numbering.
 *
 * @remarks
 * Shiki runs **client-side** inside a `useEffect` — on the first render the
 * component shows plain unstyled code as a fallback, then swaps in the
 * highlighted version once the async tokenization resolves. Language grammars
 * and themes are lazy-loaded on first use by Shiki's singleton highlighter.
 *
 * When `showLineNumbers` is `true`, the component tokenizes each line
 * individually using `codeToTokens` so that line number gutters can be
 * rendered alongside highlighted tokens without breaking Shiki's inline styles.
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
 *   theme="catppuccin-mocha"
 *   code={sourceCode}
 *   showLineNumbers
 * />
 * ```
 */
export function CodeBlock({
  code,
  language = "tsx",
  filename,
  theme = "github-dark",
  showLineNumbers = false,
  collapsible = false,
}: CodeBlockProps) {
  /**
   * Highlighted HTML string produced by `codeToHtml` (used when
   * `showLineNumbers` is false). `null` while Shiki is still loading.
   */
  const [highlightedHtml, setHighlightedHtml] = useState<string>();

  /**
   * Per-line token arrays produced by `codeToTokens` (used when
   * `showLineNumbers` is true). `null` while Shiki is still loading.
   */
  const [tokenLines, setTokenLines] = useState<ThemedToken[][]>();

  useEffect(() => {
    let cancelled = false;

    if (showLineNumbers) {
      codeToTokens(code, { lang: language, theme }).then(({ tokens }) => {
        if (!cancelled) setTokenLines(tokens);
      });
    } else {
      codeToHtml(code, { lang: language, theme }).then((html) => {
        if (!cancelled) setHighlightedHtml(html);
      });
    }

    return () => {
      cancelled = true;
    };
  }, [code, language, theme, showLineNumbers]);

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
            tokenLines,
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
          tokenLines,
        }}
      />
    </CodeCollapsibleWrapper>
  );
}

function ComponentCode({
  code,
  language = "tsx",
  filename,
  showLineNumbers,
  highlightedHtml,
  tokenLines,
}: Omit<CodeBlockProps, "collapsible"> & {
  highlightedHtml?: string;
  tokenLines?: ThemedToken[][];
}) {
  return (
    <div className="relative rounded-lg border bg-zinc-950 font-mono text-sm">
      {filename && (
        <div className="flex items-center gap-2 border-b border-border/30 px-4 py-2.5">
          {getIconForLanguageExtension(language)}

          <span className="text-muted-foreground">{filename}</span>
        </div>
      )}

      <div className="overflow-x-auto no-scrollbar max-h-75 tablet:max-h-112.5">
        <CopyButton value={code} />
        {showLineNumbers ? (
          // Line-number mode: render tokens manually so we control the layout.
          <pre className="p-4 leading-relaxed bg-transparent! ">
            <table className="w-full border-collapse">
              <tbody>
                {(tokenLines ?? code.split("\n").map(() => [])).map(
                  (tokens, i) => (
                    <tr key={i} className="group">
                      <td
                        className="select-none pr-4 text-right text-zinc-600 group-hover:text-zinc-500"
                        style={{
                          minWidth: `${String((tokenLines ?? code.split("\n")).length).length + 1}ch`,
                        }}
                      >
                        {i + 1}
                      </td>
                      <td className="w-full">
                        {tokens.length > 0 ? (
                          tokens.map((token, j) => (
                            <span key={j} style={{ color: token.color }}>
                              {token.content}
                            </span>
                          ))
                        ) : (
                          // Fallback plain text while Shiki is loading
                          <span className="text-zinc-400">
                            {code.split("\n")[i] || " "}
                          </span>
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </pre>
        ) : (
          // Standard mode: inject Shiki's full HTML output directly.
          <div
            className="[&>pre]:p-4 [&>pre]:leading-relaxed [&>pre]:bg-transparent!"
            dangerouslySetInnerHTML={{
              __html:
                highlightedHtml ??
                `<pre class="p-4 text-zinc-400">${escapeHtml(code)}</pre>`,
            }}
          />
        )}
      </div>
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

// Optional
function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
