import { useCallback,useState } from "react";

export function useStrategyNavigation() {
  const [currentStrategyView, setCurrentStrategyView] = useState([]);
  const [strategyHistory, setStrategyHistory] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const initializeStrategy = useCallback((strategy) => {
    setCurrentStrategyView(strategy || []);
    setStrategyHistory([]);
    setBreadcrumbs([]);
  }, []);

  const navigateToStep = useCallback(
    (item) => {
      if (item?.steps && Array.isArray(item.steps)) {
        setStrategyHistory((prev) => [...prev, currentStrategyView]);
        setBreadcrumbs((prev) => [...prev, item.name]);
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
