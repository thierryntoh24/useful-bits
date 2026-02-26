"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/registry/react/hooks/use-clipboard";
import { Check, Copy } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export function CopyButton({
  value,
  className,
  variant = "ghost",
  ...props
}: React.ComponentProps<typeof Button> & {
  value: string;
  src?: string;
  tooltip?: string;
}) {
  const clipboard = useClipboard({ resetDelay: 3000 });

  const handleCopy = () => {
    if (clipboard.isCopying) return;
    clipboard.copy(value);
  };

  return (
    <Button
      data-slot="copy-button"
      data-copied={clipboard.isCopied}
      size="icon"
      variant={variant}
      className={cn(
        "bg-code absolute top-3 right-2 z-10 size-7 hover:opacity-100 focus-visible:opacity-100",
        className,
      )}
      onClick={handleCopy}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {clipboard.isCopied ? (
        <Check />
      ) : clipboard.isCopying ? (
        <Spinner />
      ) : (
        <Copy />
      )}
    </Button>
  );
}
