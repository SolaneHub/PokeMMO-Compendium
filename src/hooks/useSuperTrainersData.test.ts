import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSuperTrainers } from "@/firebase/services/superTrainersService";
import { SuperTrainer } from "@/types/superTrainers";

import { useSuperTrainersData as originalUseSuperTrainersData } from "./useSuperTrainersData";

vi.mock("@/firebase/services/superTrainersService", () => ({
  getSuperTrainers: vi.fn(),
}));

describe("useSuperTrainersData", () => {
  let useSuperTrainersData: typeof originalUseSuperTrainersData;

  const mockTrainers: SuperTrainer[] = [
    { name: "Blue", region: "Kanto", type: "Normal", image: "", teams: {} },
    { name: "Red", region: "Kanto", type: "Normal", image: "", teams: {} },
  ];

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    const module = await import("./useSuperTrainersData");
    useSuperTrainersData = module.useSuperTrainersData;
  });

  it("fetches super trainers data on mount", async () => {
    vi.mocked(getSuperTrainers).mockResolvedValueOnce(mockTrainers);

    const { result } = renderHook(() => useSuperTrainersData());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.superTrainersData).toEqual(mockTrainers);
    expect(getSuperTrainers).toHaveBeenCalledTimes(1);
  });

  it("sorts trainers by name", async () => {
    const unsortedTrainers: SuperTrainer[] = [
      {
        name: "Z-Trainer",
        region: "Kanto",
        type: "Normal",
        image: "",
        teams: {},
      },
      {
        name: "A-Trainer",
        region: "Kanto",
        type: "Normal",
        image: "",
        teams: {},
      },
    ];
    vi.mocked(getSuperTrainers).mockResolvedValueOnce(unsortedTrainers);

    const { result } = renderHook(() => useSuperTrainersData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.superTrainersData[0]?.name).toBe("A-Trainer");
    expect(result.current.superTrainersData[1]?.name).toBe("Z-Trainer");
  });

  it("handles fetch error gracefully", async () => {
    vi.mocked(getSuperTrainers).mockRejectedValueOnce(
      new Error("Fetch failed")
    );

    const { result } = renderHook(() => useSuperTrainersData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.superTrainersData).toEqual([]);
  });
});
