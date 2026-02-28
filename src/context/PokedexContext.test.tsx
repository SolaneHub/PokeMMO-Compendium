import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as pokedexService from "@/firebase/services/pokedexService";
import { Pokemon } from "@/types/pokemon";

import { PokedexProvider, usePokedexContext } from "./PokedexContext";

// Mock the services
vi.mock("@/firebase/services/pokedexService", () => ({
  getPokedexSummary: vi.fn(),
  getPokemonById: vi.fn(),
}));

describe("PokedexContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws error if used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(vi.fn());
    expect(() => renderHook(() => usePokedexContext())).toThrow();
    consoleSpy.mockRestore();
  });

  describe("with PokedexProvider", () => {
    const mockSummary: Partial<Pokemon>[] = [
      { id: "1", name: "Bulbasaur", types: ["Grass"] },
      { id: 2, name: "Ivysaur", types: ["Grass"] },
    ];

    it("fetches data on mount and updates state correctly", async () => {
      // @ts-expect-error - Mocking Pokedex service methods
      pokedexService.getPokedexSummary.mockResolvedValue(mockSummary);

      const { result } = renderHook(() => usePokedexContext(), {
        wrapper: PokedexProvider,
      });

      // Initially should be loading
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Check if data is populated correctly
      expect(result.current.allPokemonData.length).toBe(2);
      expect(result.current.pokemonMap.get("Bulbasaur")).toBeDefined();
      expect(result.current.pokemonNames).toContain("Bulbasaur");
    });

    it("handles error during initial fetch", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(vi.fn());
      // @ts-expect-error - Mocking Pokedex service methods
      pokedexService.getPokedexSummary.mockRejectedValue(
        new Error("Network error")
      );

      const { result } = renderHook(() => usePokedexContext(), {
        wrapper: PokedexProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.allPokemonData.length).toBe(0);
      expect(result.current.pokemonMap.size).toBe(0);
      consoleSpy.mockRestore();
    });

    it("getPokemonDetails fetches and caches detailed data", async () => {
      // @ts-expect-error - Mocking Pokedex service methods
      pokedexService.getPokedexSummary.mockResolvedValue([
        { id: "1", name: "Bulbasaur", types: ["Grass"] },
      ]);

      const fullDetails = {
        id: "1",
        name: "Bulbasaur",
        types: ["Grass", "Poison"],
        _isFullData: true,
      };
      // @ts-expect-error - Mocking Pokedex service methods
      pokedexService.getPokemonById.mockResolvedValue(fullDetails);

      const { result } = renderHook(() => usePokedexContext(), {
        wrapper: PokedexProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Call getPokemonDetails
      let details;
      await act(async () => {
        details = await result.current.getPokemonDetails("1");
      });

      expect(details).toEqual(fullDetails);
      expect(pokedexService.getPokemonById).toHaveBeenCalledWith("1");

      // Second call should return from cache
      await act(async () => {
        details = await result.current.getPokemonDetails("1");
      });

      // getPokemonById should only have been called ONCE due to caching
      expect(pokedexService.getPokemonById).toHaveBeenCalledTimes(1);
    });

    it("refetch re-triggers data fetching", async () => {
      // @ts-expect-error - Mocking Pokedex service methods
      pokedexService.getPokedexSummary.mockResolvedValue(mockSummary);

      const { result } = renderHook(() => usePokedexContext(), {
        wrapper: PokedexProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(pokedexService.getPokedexSummary).toHaveBeenCalledTimes(1);

      await act(async () => {
        await result.current.refetch(true); // with loading set to true
      });

      expect(pokedexService.getPokedexSummary).toHaveBeenCalledTimes(2);
    });
  });
});
