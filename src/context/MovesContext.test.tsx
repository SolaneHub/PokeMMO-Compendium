import { render, renderHook, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getMoves } from "@/firebase/services/movesService";
import { clearQueryCache } from "@/hooks/useDataQuery";
import { createMockMoveMaster } from "@/test/factories";
import { MoveMaster } from "@/types/pokemon";

import { MovesProvider, useMoves } from "./MovesContext";

vi.mock("@/firebase/services/movesService", () => ({
  getMoves: vi.fn(),
}));

describe("MovesContext", () => {
  const mockMoves: MoveMaster[] = [
    createMockMoveMaster({
      id: "tackle",
      name: "Tackle",
      type: "Normal",
      category: "Physical",
      power: "40",
      accuracy: "100",
      pp: "35",
    }),
    createMockMoveMaster({
      id: "growl",
      name: "Growl",
      type: "Normal",
      category: "Status",
      power: "-",
      accuracy: "100",
      pp: "40",
    }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    clearQueryCache();
  });

  it("returns fallback and warns if useMoves is used outside of MovesProvider", () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {
      // Mock console.warn
    });
    const { result } = renderHook(() => useMoves());
    expect(consoleWarn).toHaveBeenCalledWith(
      "useMoves was called outside of a MovesProvider. Returning empty fallback state."
    );
    expect(result.current.moves).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    consoleWarn.mockRestore();
  });

  it("fetches moves on mount", async () => {
    vi.mocked(getMoves).mockResolvedValueOnce(mockMoves);

    const TestComponent = () => {
      const { moves, isLoading } = useMoves();
      if (isLoading) return <div>Loading...</div>;
      return (
        <ul>
          {moves.map((m) => (
            <li key={m.id}>{m.name}</li>
          ))}
        </ul>
      );
    };

    render(
      <MovesProvider>
        <TestComponent />
      </MovesProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Tackle")).toBeInTheDocument();
    expect(screen.getByText("Growl")).toBeInTheDocument();
    expect(getMoves).toHaveBeenCalledTimes(1);
  });

  it("handles fetch error gracefully", async () => {
    vi.mocked(getMoves).mockRejectedValueOnce(new Error("Fetch failed"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {
      // Mock console.error
    });

    render(
      <MovesProvider>
        <div />
      </MovesProvider>
    );

    await waitFor(() => {
      expect(getMoves).toHaveBeenCalledTimes(1);
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching moves:",
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});
