"use client";

import { cn } from "@/lib/utils";
import { CodeCollapsibleWrapper } from "@/registry/react/components/codeblock/code-collapsible-wrapper";
import { CopyButton } from "@/registry/react/components/codeblock/copy-button";
import { getIconForLanguageExtension } from "@/registry/react/components/codeblock/icons";
import { CodeBlockProps } from "@/registry/react/components/codeblock/types";

/**
 * A lightweight, dependency-free code display component with a one-click copy
 * button and optional line numbering.
 *
 * @remarks
 * This version has **no syntax highlighting** — code is rendered as plain
 * monospace text. If you need token-level coloring, use {@link CodeBlock} from
 * `shiki.tsx` instead, which uses Shiki under the hood.
 *
 * The copy button uses the `navigator.clipboard` API with an
 * `execCommand("copy")` fallback for older browsers.
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   filename="components/button.tsx"
 *   code={`export function Button() { return <button>Click</button>; }`}
 *   showLineNumbers
 * />
 * ```
 */
export function CodeBlock({
  code,
  language = "tsx",
  filename,
  showLineNumbers = false,
  collapsible = false,
}: CodeBlockProps) {
  const lines = code.split("\n");

  if (!collapsible) {
    return (
      <div className={cn("relative")}>
        <ComponentCode
          {...{
            code,
            language,
            filename,
            showLineNumbers,
            lines,
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
          lines,
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
  lines,
}: Omit<CodeBlockProps, "collapsible"> & {
  lines: string[];
}) {
  return (
    <div className="relative rounded-lg border bg-zinc-950 font-mono text-sm">
      {filename && (
        <div className="flex items-center gap-2 border-b border-border/30 px-4 py-2.5">
          {getIconForLanguageExtension(language)}

          <span className="text-muted-foreground">{filename}</span>
        </div>
      )}

      <CopyButton value={code} />

      <pre className="p-4 overflow-x-auto no-scrollbar max-h-75 tablet:max-h-112.5">
        {showLineNumbers ? (
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, i) => (
                <tr key={i} className="group">
                  <td
                    className="select-none pr-4 text-right text-zinc-600 group-hover:text-zinc-500"
                    style={{ minWidth: `${String(lines.length).length + 1}ch` }}
                  >
                    {i + 1}
                  </td>
                  <td className="w-full text-zinc-300">{line || " "}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <code className="text-zinc-300">{code}</code>
        )}
      </pre>
    </div>
  );
}

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
