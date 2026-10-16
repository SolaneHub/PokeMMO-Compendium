import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchCollectionData } from "@/firebase/services/common";
import { clearQueryCache } from "@/hooks/useDataQuery";
import { Raid } from "@/types/raids";

import { useRaidsData } from "./useRaidsData";

vi.mock("@/firebase/services/common", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/firebase/services/common")>();
  return {
    ...actual,
    fetchCollectionData: vi.fn(),
  };
});

describe("useRaidsData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearQueryCache();
  });

  it("fetches, sorts and processes raids correctly", async () => {
    const mockData: Partial<Raid>[] = [
      { name: "Charizard", stars: 5 },
      { name: "Blastoise", stars: 4 },
      { name: "Venusaur", stars: 5 },
    ];
    vi.mocked(fetchCollectionData).mockResolvedValue(mockData as Raid[]);

    const { result } = renderHook(() => useRaidsData());

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
    vi.mocked(fetchCollectionData).mockRejectedValue(new Error("Fetch failed"));

    const { result } = renderHook(() => useRaidsData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.raidsData).toEqual([]);
    expect(result.current.raidsMap.size).toBe(0);
    expect(result.current.starLevels).toEqual([]);
    expect(result.current.error).toEqual(new Error("Fetch failed"));
  });
});
