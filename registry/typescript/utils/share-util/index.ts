/**
 * Interface for share data
 */
export interface ShareData {
  title?: string;
  text?: string;
  url: string;
  files?: File[];
}

/**
 * Check if the Web Share API is available
 */
export function isShareSupported(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}

/**
 * Check if sharing files is supported
 */
export function isFileShareSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.share &&
    !!navigator.canShare
  );
}

/**
 * Share content using the Web Share API or fallback to copying to clipboard
 * @param data The data to share
 * @param onSuccess Optional callback on successful share
 * @param onError Optional callback on share error
 * @param onUnsupported Optional callback when sharing is not supported
 */
export async function shareContent({
  data,
  onSuccess,
  onError,
  onUnsupported,
  fallbackCopyToClipboard = true,
}: {
  data: ShareData;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  onUnsupported?: () => void;
  fallbackCopyToClipboard?: boolean;
}): Promise<boolean> {
  // Check if the Web Share API is available
  if (isShareSupported()) {
    try {
      // Check if we're trying to share files and if that's supported
      if (data.files && data.files.length > 0) {
        if (
          !isFileShareSupported() ||
          !navigator.canShare({ files: data.files })
        ) {
          onUnsupported?.();

          // Fall back to URL sharing without files
          const { files, ...restData } = data;
          await navigator.share(restData);
          onSuccess?.();
          return true;
        }
      }

      await navigator.share(data);
      onSuccess?.();
      return true;
    } catch (error) {
      // Ignore AbortError which happens when user cancels the share dialog
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("Share dialog was closed by the user");
        return false;
      }

      onError?.(error);
      console.error("Error sharing content", error);

      // Fall back to clipboard if specified
      if (fallbackCopyToClipboard) {
        try {
          await copyToClipboard(data);
          return true;
        } catch (clipboardError) {
          console.error("Failed to copy URL to clipboard", clipboardError);
          return false;
        }
      }

      return false;
    }
  } else {
    onUnsupported?.();

    // Fall back to clipboard if specified
    if (fallbackCopyToClipboard) {
      try {
        await copyToClipboard(data);
        return true;
      } catch (clipboardError) {
        console.error("Failed to copy URL to clipboard", clipboardError);
        return false;
      }
    }

    return false;
  }
}

/**Fallback method to copy to clipboard */
async function copyToClipboard(data: ShareData) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(data.url);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = data.url;
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    const success = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (!success) throw new Error("Fallback copy failed");
  }
}
