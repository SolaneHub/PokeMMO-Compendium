import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  getPokedexSummary,
  getPokemonById,
} from "@/firebase/services/pokedexService";
import * as dataQueryModule from "@/hooks/useDataQuery";
import { Pokemon } from "@/types/pokemon";

import {
  usePokedexSummaryQuery,
  usePokemonDetailsQuery,
} from "./usePokedexData";

vi.mock("@/hooks/useDataQuery", () => ({
  useDataQuery: vi.fn(),
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
    it("calls useDataQuery with correct options and sorting", async () => {
      vi.mocked(dataQueryModule.useDataQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      });

      renderHook(() => usePokedexSummaryQuery());

      expect(dataQueryModule.useDataQuery).toHaveBeenCalledWith(
        "pokedex:summary",
        expect.any(Function)
      );

      // Test the query function logic
      const call = vi.mocked(dataQueryModule.useDataQuery).mock.calls[0];
      if (!call) throw new Error("useDataQuery not called");
      const queryFn = call[1] as () => Promise<{
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
    it("calls useDataQuery for specific pokemon", async () => {
      vi.mocked(dataQueryModule.useDataQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      });

      renderHook(() => usePokemonDetailsQuery("1"));

      expect(dataQueryModule.useDataQuery).toHaveBeenCalledWith(
        "pokemon:1",
        expect.any(Function),
        expect.objectContaining({
          enabled: true,
          ttl: Infinity,
        })
      );

      // Test query function
      const call = vi.mocked(dataQueryModule.useDataQuery).mock.calls[0];
      if (!call) throw new Error("useDataQuery not called");
      const queryFn = call[1] as () => Promise<Pokemon>;
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

      expect(dataQueryModule.useDataQuery).toHaveBeenCalledWith(
        "pokemon:undefined",
        expect.any(Function),
        expect.objectContaining({
          enabled: false,
        })
      );

      const call = vi.mocked(dataQueryModule.useDataQuery).mock.calls[0];
      if (!call) throw new Error("useDataQuery not called");
      const queryFn = call[1] as () => Promise<unknown>;
      const result = await queryFn();
      expect(result).toBeNull();
    });
  });
});
