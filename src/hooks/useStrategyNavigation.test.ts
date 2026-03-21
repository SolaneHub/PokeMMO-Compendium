import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StrategyStep, StrategyVariation } from "@/types/teams";

import { useStrategyNavigation } from "./useStrategyNavigation";

describe("useStrategyNavigation", () => {
  const mockSteps: StrategyStep[] = [
    { id: "step1", type: "text", description: "Step 1" },
  ];
  const mockVariation: StrategyVariation = {
    type: "variation",
    name: "Variation 1",
    steps: [{ id: "step2", type: "text", description: "Step 2" }],
  };

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useStrategyNavigation());

    expect(result.current.currentStrategyView).toEqual([]);
    expect(result.current.strategyHistory).toEqual([]);
    expect(result.current.breadcrumbs).toEqual([]);
  });

  it("should initialize strategy", () => {
    const { result } = renderHook(() => useStrategyNavigation());

    act(() => {
      result.current.initializeStrategy(mockSteps);
    });

    expect(result.current.currentStrategyView).toEqual(mockSteps);
    expect(result.current.strategyHistory).toEqual([]);
    expect(result.current.breadcrumbs).toEqual([]);
  });

  it("should navigate to a step", () => {
    const { result } = renderHook(() => useStrategyNavigation());

    act(() => {
      result.current.initializeStrategy(mockSteps);
    });

    act(() => {
      result.current.navigateToStep(mockVariation);
    });

    expect(result.current.currentStrategyView).toEqual(mockVariation.steps);
    expect(result.current.strategyHistory).toEqual([mockSteps]);
    expect(result.current.breadcrumbs).toEqual([mockVariation.name]);
  });

  it("should navigate back", () => {
    const { result } = renderHook(() => useStrategyNavigation());

    act(() => {
      result.current.initializeStrategy(mockSteps);
    });

    act(() => {
      result.current.navigateToStep(mockVariation);
    });

    expect(result.current.currentStrategyView).toEqual(mockVariation.steps);

    act(() => {
      result.current.navigateBack();
    });

    expect(result.current.currentStrategyView).toEqual(mockSteps);
    expect(result.current.strategyHistory).toEqual([]);
    expect(result.current.breadcrumbs).toEqual([]);
  });

  it("should reset strategy", () => {
    const { result } = renderHook(() => useStrategyNavigation());

    act(() => {
      result.current.initializeStrategy(mockSteps);
    });

    act(() => {
      result.current.navigateToStep(mockVariation);
    });

    act(() => {
      result.current.resetStrategy();
    });

    expect(result.current.currentStrategyView).toEqual([]);
    expect(result.current.strategyHistory).toEqual([]);
    expect(result.current.breadcrumbs).toEqual([]);
  });
});
