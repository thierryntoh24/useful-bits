# history-provider
Provider manages browsing history stack withing the context of your app. A bit different from using the browser's navigation stack. If you used [Posts](https://www.posts.cv) when the project was still active, you'll get it. I replicated Posts's in-app navigation for my project, [Tasks](https://tasks-cv.vercel.app) (<=v.0.4.1). Next.js only

## Usage

```tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        <main>
          <HistoryProvider>{children}</HistoryProvider>
        </main>
      </body>
    </html>
  );
}

--------------

const BackButton: React.FC<BackButtonProps> = ({ className = "" }) => {
  const { canGoBack, goBack } = useHistory();

  // If we can't go back and there's no fallback, don't render
  if (!canGoBack) return;

  return (
    <Link
      href={"#"}
      className={`inline-flex items-center gap-1 ${className}`}
      onClick={(e) => {
        e.preventDefault();
        goBack();
      }}
    >
      <ArrowLeftIcon size={24} />
    </Link>
  );
};

```