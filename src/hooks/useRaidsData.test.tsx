import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as raidsService from "@/firebase/services/raidsService";
import { Raid } from "@/types/raids";

import { useRaidsData } from "./useRaidsData";

vi.mock("@/firebase/services/raidsService", () => ({
  getRaidsData: vi.fn(),
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

describe("useRaidsData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches, sorts and processes raids correctly", async () => {
    const mockData: Partial<Raid>[] = [
      { name: "Charizard", stars: 5 },
      { name: "Blastoise", stars: 4 },
      { name: "Venusaur", stars: 5 },
    ];
    vi.mocked(raidsService.getRaidsData).mockResolvedValue(mockData as Raid[]);

    const { result } = renderHook(() => useRaidsData(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.raidsData.length).toBe(3);

    // Check sorting: stars ASC, then name ASC
    const first = result.current.raidsData[0];
    const second = result.current.raidsData[1];
    const third = result.current.raidsData[2];

    expect(first?.name).toBe("Blastoise");
    expect(second?.name).toBe("Charizard");
    expect(third?.name).toBe("Venusaur");

    // Check raidsMap
    expect(result.current.raidsMap.has("Charizard")).toBe(true);
    expect(result.current.raidsMap.get("Charizard")).toEqual(
      result.current.raidsData[1]
    );

    // Check starLevels
    expect(result.current.starLevels).toEqual([4, 5]);
  });

  it("handles fetch error", async () => {
    vi.mocked(raidsService.getRaidsData).mockRejectedValue(
      new Error("Fetch failed")
    );

    const { result } = renderHook(() => useRaidsData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.raidsData).toEqual([]);
    expect(result.current.raidsMap.size).toBe(0);
    expect(result.current.starLevels).toEqual([]);
  });
});
