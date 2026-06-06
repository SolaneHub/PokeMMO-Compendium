import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React, { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getTrainerRerun } from "@/pages/trainer-rerun/services/trainerRerunService";

import { useTrainerRerunData } from "./useTrainerRerunData";

vi.mock("@/pages/trainer-rerun/services/trainerRerunService", () => ({
  getTrainerRerun: vi.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = createTestQueryClient();
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    children
  );
};

describe("useTrainerRerunData", () => {
  const mockData = {
    intro: { title: "Test", description: [] },
    requirements: { title: "Requirements", items: [] },
    tips_tricks: { title: "Tips & Tricks", items: [] },
    regions: [],
  };

  beforeEach(async () => {
    vi.clearAllMocks();
  });

  it("fetches trainer rerun data on mount", async () => {
    vi.mocked(getTrainerRerun).mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useTrainerRerunData(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.trainerRerunData).toEqual(mockData);
    expect(getTrainerRerun).toHaveBeenCalledTimes(1);
  });

  it("handles fetch error gracefully", async () => {
    vi.mocked(getTrainerRerun).mockRejectedValueOnce(new Error("Fetch failed"));

    const { result } = renderHook(() => useTrainerRerunData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.trainerRerunData).toBeNull();
  });
});
