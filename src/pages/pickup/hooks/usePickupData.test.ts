import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchCollectionData } from "@/firebase/services/common";
import { clearQueryCache } from "@/hooks/useDataQuery";
import { PickupRegion } from "@/types/pickup";

import { usePickupData } from "./usePickupData";

vi.mock("@/firebase/services/common", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/firebase/services/common")>();
  return {
    ...actual,
    fetchCollectionData: vi.fn(),
  };
});

describe("usePickupData", () => {
  const mockRegions = [
    { id: "kanto", name: "Kanto", locations: [] },
    { id: "johto", name: "Johto", locations: [] },
  ];

  beforeEach(async () => {
    vi.clearAllMocks();
    clearQueryCache();
  });

  it("fetches pickup data on mount", async () => {
    vi.mocked(fetchCollectionData).mockResolvedValueOnce(
      mockRegions as PickupRegion[]
    );

    const { result } = renderHook(() => usePickupData());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.regions).toEqual(mockRegions);
    expect(fetchCollectionData).toHaveBeenCalledTimes(1);
  });

  it("sorts regions by name", async () => {
    const unsortedRegions = [
      { id: "z-region", name: "Z Region", locations: [] },
      { id: "a-region", name: "A Region", locations: [] },
    ];
    vi.mocked(fetchCollectionData).mockResolvedValueOnce(
      unsortedRegions as PickupRegion[]
    );

    const { result } = renderHook(() => usePickupData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.regions[0]?.name).toBe("A Region");
    expect(result.current.regions[1]?.name).toBe("Z Region");
  });

  it("handles fetch error gracefully", async () => {
    vi.mocked(fetchCollectionData).mockRejectedValueOnce(
      new Error("Fetch failed")
    );

    const { result } = renderHook(() => usePickupData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.regions).toEqual([]);
    expect(result.current.error).toEqual(new Error("Fetch failed"));
  });
});
