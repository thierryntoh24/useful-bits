# share-util
Share content using the Web Share API or fallback to copying to clipboard

## Usage
```ts
const handleShare = async () => {
  if (isSharing) return;
  setIsSharing(true);

  try {
    await shareContent({
      data: {
        title: "Check this out",
        text: "https://pin.it/35wq49n7z",
      },
      onSuccess: () => toast.success("Shared successfully!"),
      onError: () =>
        toast.error("Failed to share, Copy link instead", {
          action: {
            label: "Copy link",
            onClick: handleCopyLink,
          },
        }),

      onUnsupported: () => {
        toast.error('Native sharing not supported. Link copied to clipboard instead.')
      },
    });
  } finally {
    setIsSharing(false);
  }
};
  ```