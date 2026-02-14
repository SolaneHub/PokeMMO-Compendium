import { useCallback, useState } from "react";

import { StrategyStep, StrategyVariation } from "@/firebase/firestoreService";

export function useStrategyNavigation() {
  const [currentStrategyView, setCurrentStrategyView] = useState<
    StrategyStep[]
  >([]);
  const [strategyHistory, setStrategyHistory] = useState<StrategyStep[][]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

  const initializeStrategy = useCallback((strategy: StrategyStep[] | null) => {
    setCurrentStrategyView(strategy || []);
    setStrategyHistory([]);
    setBreadcrumbs([]);
  }, []);

  const navigateToStep = useCallback(
    (item: StrategyVariation) => {
      if (item?.steps && Array.isArray(item.steps)) {
        setStrategyHistory((prev) => [...prev, currentStrategyView]);
        setBreadcrumbs((prev) => [...prev, item.name || "Next"]);
        setCurrentStrategyView(item.steps);
      }
    },
    [currentStrategyView]
  );

  const navigateBack = useCallback(() => {
    if (strategyHistory.length > 0) {
      const previousView = strategyHistory[strategyHistory.length - 1];
      setCurrentStrategyView(previousView);
      setStrategyHistory((prev) => prev.slice(0, -1));
      setBreadcrumbs((prev) => prev.slice(0, -1));
    }
  }, [strategyHistory]);

  const resetStrategy = useCallback(() => {
    setCurrentStrategyView([]);
    setStrategyHistory([]);
    setBreadcrumbs([]);
  }, []);

  return {
    currentStrategyView,
    strategyHistory,
    breadcrumbs,
    initializeStrategy,
    navigateToStep,
    navigateBack,
    resetStrategy,
  };
}
