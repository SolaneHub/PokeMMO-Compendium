import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchCollectionData } from "@/firebase/services/common";
import { clearQueryCache } from "@/hooks/useDataQuery";
import { createMockBossFight } from "@/test/factories";
import { BossFight } from "@/types/bossFights";

import { useBossFightsData } from "./useBossFightsData";

vi.mock("@/firebase/services/common", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/firebase/services/common")>();
  return {
    ...actual,
    fetchCollectionData: vi.fn(),
  };
});

describe("useBossFightsData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearQueryCache();
  });

  it("fetches and sorts boss fights correctly", async () => {
    const mockData: BossFight[] = [
      createMockBossFight({ name: "Cynthia" }),
      createMockBossFight({ name: "Blue" }),
      createMockBossFight({ name: "Alder" }),
    ];
    vi.mocked(fetchCollectionData).mockResolvedValue(mockData);

    const { result } = renderHook(() => useBossFightsData());

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

    const { result } = renderHook(() => useBossFightsData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.bossFightsData).toEqual([]);
    expect(result.current.error).toEqual(new Error("Fetch failed"));
  });
});
