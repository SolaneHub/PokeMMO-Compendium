import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as bossFightsService from "@/firebase/services/bossFightsService";
import { BossFight } from "@/types/bossFights";

import { useBossFightsData } from "./useBossFightsData";

vi.mock("@/firebase/services/bossFightsService", () => ({
  getBossFights: vi.fn(),
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
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useBossFightsData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and sorts boss fights correctly", async () => {
    const mockData: Partial<BossFight>[] = [
      { name: "Cynthia" },
      { name: "Blue" },
      { name: "Alder" },
    ];
    // @ts-expect-error - Mocking service
    bossFightsService.getBossFights.mockResolvedValue(mockData);

    const { result } = renderHook(() => useBossFightsData(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.bossFightsData.length).toBe(3);
    // Should be sorted alphabetically
    expect(result.current.bossFightsData[0].name).toBe("Alder");
    expect(result.current.bossFightsData[1].name).toBe("Blue");
    expect(result.current.bossFightsData[2].name).toBe("Cynthia");
  });

  it("handles fetch error", async () => {
    // @ts-expect-error - Mocking service
    bossFightsService.getBossFights.mockRejectedValue(new Error("Fetch failed"));

    const { result } = renderHook(() => useBossFightsData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.bossFightsData).toEqual([]);
  });
});
