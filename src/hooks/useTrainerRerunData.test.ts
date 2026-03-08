import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getTrainerRerun } from "@/firebase/services/trainerRerunService";

import { useTrainerRerunData as originalUseTrainerRerunData } from "./useTrainerRerunData";

vi.mock("@/firebase/services/trainerRerunService", () => ({
  getTrainerRerun: vi.fn(),
}));

describe("useTrainerRerunData", () => {
  let useTrainerRerunData: typeof originalUseTrainerRerunData;

  const mockData = {
    intro: { title: "Test", description: [] },
    requirements: { title: "Requirements", items: [] },
    tips_tricks: { title: "Tips & Tricks", items: [] },
    regions: [],
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    const module = await import("./useTrainerRerunData");
    useTrainerRerunData = module.useTrainerRerunData;
  });

  it("fetches trainer rerun data on mount", async () => {
    vi.mocked(getTrainerRerun).mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useTrainerRerunData());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.trainerRerunData).toEqual(mockData);
    expect(getTrainerRerun).toHaveBeenCalledTimes(1);
  });

  it("handles fetch error gracefully", async () => {
    vi.mocked(getTrainerRerun).mockRejectedValueOnce(new Error("Fetch failed"));

    const { result } = renderHook(() => useTrainerRerunData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.trainerRerunData).toBeNull();
  });
});
