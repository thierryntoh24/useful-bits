"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

const HistoryContext = createContext<{
  history: string[];
  canGoBack: boolean;
  goBack: () => void;
  setHistory: Dispatch<SetStateAction<string[]>>;
} | null>(null);

export const HistoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [history, setHistory] = useState<string[]>([]);
  const [canGoBack, setCanGoBack] = useState(false);

  const { location } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const goBack = () => {
    if (canGoBack) {
      const newHistory = [...history];
      newHistory.pop(); // Remove the current route
      setHistory(newHistory); // Update history

      router.back(); // Navigate to the previous route
    }
  };

  useEffect(() => {
    const currentPathWithQuery = `${pathname}${
      searchParams.size > 0 ? `?${searchParams.toString()}` : ""
    }`;

    setHistory((prev) => {
      if (location && currentPathWithQuery === `/${location as string}`)
        return [`/${location as string}`];

      // Ensure we don't add duplicate entries for the same path with the same query
      if (prev[prev.length - 1] !== currentPathWithQuery) {
        return [...prev, currentPathWithQuery];
      }
      return prev;
    });
  }, [pathname, searchParams, location]);

  useEffect(() => {
    setCanGoBack(history.length > 1);
  }, [history]);

  useEffect(() => {
    const handlePopState = () => {
      setHistory((prev) => {
        const newHistory = [...prev];
        newHistory.pop();
        return newHistory.length > 0 ? newHistory : [`/${location as string}`];
      });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location]);

  return (
    <HistoryContext.Provider value={{ setHistory, history, canGoBack, goBack }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};
