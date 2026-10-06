import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface TabsContextValue {
  tabs: string[];
  openTab: (name: string) => void;
  closeTab: (name: string) => void;
  closeAllTabs: () => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function TabsProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<string[]>([]);

  const openTab = useCallback((name: string) => {
    setTabs((prev) => (prev.includes(name) ? prev : [...prev, name]));
  }, []);

  const closeTab = useCallback((name: string) => {
    setTabs((prev) => prev.filter((t) => t !== name));
  }, []);

  const closeAllTabs = useCallback(() => {
    setTabs([]);
  }, []);

  const value = useMemo(
    () => ({ tabs, openTab, closeTab, closeAllTabs }),
    [tabs, openTab, closeTab, closeAllTabs],
  );

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}

export function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("useTabs must be used within TabsProvider");
  return ctx;
}
