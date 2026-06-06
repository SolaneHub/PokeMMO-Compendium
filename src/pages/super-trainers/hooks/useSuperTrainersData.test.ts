import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React, { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchCollectionData } from "@/firebase/services/common";
import { SuperTrainer } from "@/pages/super-trainers/types/superTrainers";

import { useSuperTrainersData } from "./useSuperTrainersData";

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
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    children
  );
};

describe("useSuperTrainersData", () => {
  const mockTrainers: SuperTrainer[] = [
    { name: "Blue", region: "Kanto", type: "Normal", image: "", teams: {} },
    { name: "Red", region: "Kanto", type: "Normal", image: "", teams: {} },
  ];

  beforeEach(async () => {
    vi.clearAllMocks();
  });

  it("fetches super trainers data on mount", async () => {
    vi.mocked(fetchCollectionData).mockResolvedValueOnce(mockTrainers);

    const { result } = renderHook(() => useSuperTrainersData(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.superTrainersData).toEqual(mockTrainers);
    expect(fetchCollectionData).toHaveBeenCalledTimes(1);
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
    vi.mocked(fetchCollectionData).mockResolvedValueOnce(unsortedTrainers);

    const { result } = renderHook(() => useSuperTrainersData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.superTrainersData[0]?.name).toBe("A-Trainer");
    expect(result.current.superTrainersData[1]?.name).toBe("Z-Trainer");
  });

  it("handles fetch error gracefully", async () => {
    vi.mocked(fetchCollectionData).mockRejectedValueOnce(
      new Error("Fetch failed")
    );

    const { result } = renderHook(() => useSuperTrainersData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.superTrainersData).toEqual([]);
  });
});
