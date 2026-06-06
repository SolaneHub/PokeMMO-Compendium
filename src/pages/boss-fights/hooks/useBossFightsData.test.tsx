import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchCollectionData } from "@/firebase/services/common";
import { BossFight } from "@/pages/boss-fights/types/bossFights";

import { useBossFightsData } from "./useBossFightsData";

vi.mock("@/firebase/services/common", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/firebase/services/common")>();
  return {
    ...actual,
    fetchCollectionData: vi.fn(),
  };
});

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
    vi.mocked(fetchCollectionData).mockResolvedValue(mockData as BossFight[]);

    const { result } = renderHook(() => useBossFightsData(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.bossFightsData.length).toBe(3);
    // Should be sorted alphabetically
    const first = result.current.bossFightsData[0];
    const second = result.current.bossFightsData[1];
    const third = result.current.bossFightsData[2];

    expect(first?.name).toBe("Alder");
    expect(second?.name).toBe("Blue");
    expect(third?.name).toBe("Cynthia");
  });

  it("handles fetch error", async () => {
    vi.mocked(fetchCollectionData).mockRejectedValue(new Error("Fetch failed"));

    const { result } = renderHook(() => useBossFightsData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.bossFightsData).toEqual([]);
  });
});
