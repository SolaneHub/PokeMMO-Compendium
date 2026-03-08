import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  getPokedexSummary,
  getPokemonById,
} from "@/firebase/services/pokedexService";
import { Pokemon } from "@/types/pokemon";

import {
  usePokedexSummaryQuery,
  usePokemonDetailsQuery,
} from "./usePokedexData";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@/firebase/services/pokedexService", () => ({
  getPokedexSummary: vi.fn(),
  getPokemonById: vi.fn(),
}));

describe("usePokedexData hooks", () => {
  const mockPokemonList = [
    { id: "2", name: "Ivysaur", catchRate: 45 },
    { id: "1", name: "Bulbasaur", catchRate: 45 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("usePokedexSummaryQuery", () => {
    it("calls useQuery with correct options and sorting", async () => {
      vi.mocked(useQuery).mockImplementation(((options: unknown) => {
        const opt = options as { queryKey: string[] };
        if (opt.queryKey[1] === "summary") {
          return { data: null, isLoading: true };
        }
        return {};
      }) as unknown as typeof useQuery);

      renderHook(() => usePokedexSummaryQuery());

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ["pokedex", "summary"],
        })
      );

      // Test the query function logic
      const call = vi.mocked(useQuery).mock.calls[0];
      if (!call) throw new Error("useQuery not called");
      const queryFn = call[0].queryFn as () => Promise<{
        allPokemonData: Pokemon[];
        pokemonMap: Map<string, Pokemon>;
      }>;
      vi.mocked(getPokedexSummary).mockResolvedValueOnce(
        mockPokemonList as unknown as Pokemon[]
      );

      const result = await queryFn();

      const firstPokemon = result.allPokemonData[0];
      const secondPokemon = result.allPokemonData[1];
      expect(firstPokemon?.name).toBe("Bulbasaur"); // Sorted by ID
      expect(secondPokemon?.name).toBe("Ivysaur");
      expect(result.pokemonMap.get("Bulbasaur")).toBeDefined();
    });
  });

  describe("usePokemonDetailsQuery", () => {
    it("calls useQuery for specific pokemon", async () => {
      vi.mocked(useQuery).mockImplementation(((options: unknown) => {
        const opt = options as { queryKey: string[] };
        if (opt.queryKey[0] === "pokemon") {
          return { data: null, isLoading: true };
        }
        return {};
      }) as unknown as typeof useQuery);

      renderHook(() => usePokemonDetailsQuery("1"));

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ["pokemon", "1"],
          enabled: true,
        })
      );

      // Test query function
      const call = vi.mocked(useQuery).mock.calls[0];
      if (!call) throw new Error("useQuery not called");
      const queryFn = call[0].queryFn as () => Promise<Pokemon>;
      vi.mocked(getPokemonById).mockResolvedValueOnce({
        id: "1",
        name: "Bulbasaur",
      } as unknown as Pokemon);

      const result = (await queryFn()) as {
        name: string;
        _isFullData: boolean;
      };
      expect(result.name).toBe("Bulbasaur");
      expect(result._isFullData).toBe(true);
    });

    it("returns null if id is not provided", async () => {
      renderHook(() => usePokemonDetailsQuery(undefined));

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        })
      );

      const call = vi.mocked(useQuery).mock.calls[0];
      if (!call) throw new Error("useQuery not called");
      const queryFn = call[0].queryFn as () => Promise<unknown>;
      const result = await queryFn();
      expect(result).toBeNull();
    });
  });
});
