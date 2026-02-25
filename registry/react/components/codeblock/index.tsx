"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useClipboard } from "@/registry/react/hooks/use-clipboard";
import { useState, useRef } from "react";

/**
 * Props for the {@link CodeBlock} component.
 */
export interface CodeBlockProps {
  /** The raw code string to display. */
  code: string;
  /**
   * The language identifier used for display purposes only (no syntax highlighting).
   * @defaultValue `"tsx"`
   */
  language?: string;
  /** Optional filename shown in the header bar above the code. */
  filename?: string;
  /**
   * Whether to render line numbers alongside each line of code.
   * @defaultValue `false`
   */
  showLineNumbers?: boolean;
}

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
}: CodeBlockProps) {
  const codeRef = useRef<HTMLPreElement>(null);
  const clipboard = useClipboard({ resetDelay: 3000 });

  const lines = code.split("\n");

  const handleCopy = () => {
    if (clipboard.isCopying) return;
    clipboard.copy(code);
  };

  // const handleCopy = async () => {
  //   try {
  //     await navigator.clipboard.writeText(code);
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 2000);
  //   } catch {
  //     const selection = window.getSelection();
  //     const range = document.createRange();
  //     if (codeRef.current) {
  //       range.selectNodeContents(codeRef.current);
  //       selection?.removeAllRanges();
  //       selection?.addRange(range);
  //       document.execCommand("copy");
  //       selection?.removeAllRanges();
  //       setCopied(true);
  //       setTimeout(() => setCopied(false), 2000);
  //     }
  //   }
  // };

  return (
    <div className="relative rounded-lg border border-zinc-800 bg-zinc-950 font-mono text-sm">
      {filename && (
        <div className="flex items-center border-b border-zinc-800 px-4 py-2">
          <span className="text-xs text-zinc-400">{filename}</span>
        </div>
      )}

      <Button
        onClick={handleCopy}
        variant={"ghost"}
        size={"icon-sm"}
        aria-label={clipboard.isCopied ? "Copied!" : "Copy code"}
        className="absolute right-1 top-1 z-10"
      >
        {clipboard.isCopied ? (
          <CheckIcon className="size-3.5" />
        ) : clipboard.isCopying ? (
          <Spinner className="size-3.5" />
        ) : (
          <CopyIcon className="size-3.5" />
        )}
      </Button>

      <pre ref={codeRef} className="overflow-x-auto p-4 leading-relaxed">
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
