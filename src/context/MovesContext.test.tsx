import { render, renderHook, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getMoves } from "@/firebase/services/movesService";
import { MoveMaster } from "@/types/pokemon";

import { MovesProvider, useMoves } from "./MovesContext";

vi.mock("@/firebase/services/movesService", () => ({
  getMoves: vi.fn(),
}));

describe("MovesContext", () => {
  const mockMoves: MoveMaster[] = [
    {
      id: "tackle",
      name: "Tackle",
      type: "Normal",
      category: "Physical",
      power: "40",
      accuracy: "100",
      pp: "35",
    },
    {
      id: "growl",
      name: "Growl",
      type: "Normal",
      category: "Status",
      power: "-",
      accuracy: "100",
      pp: "40",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws error if useMoves is used outside of MovesProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {
      // Mock console.error
    });
    expect(() => renderHook(() => useMoves())).toThrow(
      "useMoves must be used within a MovesProvider"
    );
    consoleError.mockRestore();
  });

  it("fetches moves on mount", async () => {
    vi.mocked(getMoves).mockResolvedValueOnce(
      mockMoves as unknown as MoveMaster[]
    );

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
