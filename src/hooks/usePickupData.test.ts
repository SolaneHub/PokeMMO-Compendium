import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getPickupData } from "@/firebase/services/pickupService";
import { PickupRegion } from "@/types/pickup";

import { usePickupData as originalUsePickupData } from "./usePickupData";

vi.mock("@/firebase/services/pickupService", () => ({
  getPickupData: vi.fn(),
}));

describe("usePickupData", () => {
  let usePickupData: typeof originalUsePickupData;

  const mockRegions = [
    { id: "kanto", name: "Kanto", locations: [] },
    { id: "johto", name: "Johto", locations: [] },
  ];

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    const module = await import("./usePickupData");
    usePickupData = module.usePickupData;
  });

  it("fetches pickup data on mount", async () => {
    vi.mocked(getPickupData).mockResolvedValueOnce(
      mockRegions as PickupRegion[]
    );

    const { result } = renderHook(() => usePickupData());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.regions).toEqual(mockRegions);
    expect(getPickupData).toHaveBeenCalledTimes(1);
  });

  it("sorts regions by name", async () => {
    const unsortedRegions = [
      { id: "z-region", name: "Z Region", locations: [] },
      { id: "a-region", name: "A Region", locations: [] },
    ];
    vi.mocked(getPickupData).mockResolvedValueOnce(
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
    vi.mocked(getPickupData).mockRejectedValueOnce(new Error("Fetch failed"));

    const { result } = renderHook(() => usePickupData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.regions).toEqual([]);
  });
});
