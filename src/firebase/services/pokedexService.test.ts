import * as firestore from "firebase/firestore";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { setMockDocs } from "@/test/setup";
import { Pokemon } from "@/types/pokemon";

import {
  deletePokedexEntry,
  getPokedexData,
  getPokedexPaginated,
  getPokedexSummary,
  getPokemonById,
  savePokedexEntry,
  updatePokedexData,
  updatePokedexEntry,
} from "./pokedexService";

// Mock global common dependencies
vi.mock("./common", () => ({
  POKEDEX_COLLECTION: "pokedex",
  getPokemonDocId: (id: string | number) => id.toString(),
}));

describe("pokedexService", () => {
  const validPokemonDoc = {
    id: "1",
    name: "Bulbasaur",
    types: ["Grass", "Poison"],
    baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
    abilities: { main: ["Overgrow"], hidden: "Chlorophyll" },
    moves: [],
    evolutions: [],
    locations: [],
  };

  const invalidPokemonDoc = {
    id: "invalid-1",
    name: 12345, // Intentionally invalid type (number instead of string) to fail Zod validation
    types: "NotAnArray",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    setMockDocs([]); // Reset firestore mock state
  });

  describe("getPokedexData", () => {
    it("returns valid pokemon and ignores internal/invalid docs", async () => {
      setMockDocs([
        validPokemonDoc,
        invalidPokemonDoc,
        { id: "_internal_doc", name: "Hidden" }, // Should be ignored
      ]);

      const result = await getPokedexData();
      expect(result.length).toBe(1);
      expect(result[0].name).toBe("Bulbasaur");
    });

    it("returns empty array if no docs exist", async () => {
      setMockDocs([]);
      const result = await getPokedexData();
      expect(result).toEqual([]);
    });
  });

  describe("getPokedexPaginated", () => {
    it("returns valid pokemon and a last doc reference", async () => {
      setMockDocs([validPokemonDoc]);
      const result = await getPokedexPaginated(10);
      expect(result.data.length).toBe(1);
      expect(result.lastDoc).toBeDefined();
    });
  });

  describe("getPokedexSummary", () => {
    it("returns parsed summary list if summary doc exists", async () => {
      // Mock the specific summary document structure
      setMockDocs([
        {
          id: "_summary",
          pokemonList: [validPokemonDoc, invalidPokemonDoc], // Invalid should be filtered
        },
      ]);

      const result = await getPokedexSummary();
      expect(result.length).toBe(1);
      expect(result[0].name).toBe("Bulbasaur");
    });

    it("generates and saves summary if summary doc does not exist", async () => {
      // First call to getDoc (summary) returns empty array (meaning exists() is false)
      // The internal fallback getPokedexData will use the same mock docs, so we provide actual docs
      setMockDocs([validPokemonDoc]);

      // Override getDoc mock locally for this test to simulate "not exists" for summary
      const originalGetDoc = firestore.getDoc;
      // @ts-expect-error - Mocking firestore getDoc method
      firestore.getDoc = vi.fn().mockImplementationOnce(() => ({
        exists: () => false,
      }));

      const result = await getPokedexSummary();
      expect(result.length).toBe(1);
      expect(result[0].name).toBe("Bulbasaur");
      expect(firestore.setDoc).toHaveBeenCalled(); // Should have tried to save the newly generated summary

      // Restore getDoc
      // @ts-expect-error - Mocking firestore getDoc method
      firestore.getDoc = originalGetDoc;
    });
  });

  describe("getPokemonById", () => {
    it("returns parsed pokemon if doc exists and is valid", async () => {
      setMockDocs([validPokemonDoc]);
      const result = await getPokemonById("1");
      expect(result).toBeDefined();
      expect(result?.name).toBe("Bulbasaur");
    });

    it("returns null if doc exists but is invalid", async () => {
      setMockDocs([invalidPokemonDoc]);
      const result = await getPokemonById("invalid-1");
      expect(result).toBeNull();
    });

    it("returns null if doc does not exist", async () => {
      setMockDocs([]);
      const result = await getPokemonById("999");
      expect(result).toBeNull();
    });
  });

  describe("Write Operations", () => {
    it("savePokedexEntry calls setDoc", async () => {
      await savePokedexEntry(validPokemonDoc as unknown as Pokemon);
      expect(firestore.setDoc).toHaveBeenCalled();
    });

    it("updatePokedexEntry calls updateDoc", async () => {
      await updatePokedexEntry("1", { name: "Venusaur" });
      expect(firestore.updateDoc).toHaveBeenCalled();
    });

    it("deletePokedexEntry calls deleteDoc", async () => {
      await deletePokedexEntry("1");
      expect(firestore.deleteDoc).toHaveBeenCalled();
    });

    it("updatePokedexData calls writeBatch commit", async () => {
      await updatePokedexData([validPokemonDoc as unknown as Pokemon]);

      // In setup.ts we mock writeBatch as vi.fn(() => ({ set: vi.fn(), commit: vi.fn(() => Promise.resolve()) }))
      // We can grab the mock instance returned
      const mockBatch = (
        firestore.writeBatch as unknown as {
          mock: { results: { value: { commit: () => void } }[] };
        }
      ).mock.results[0].value;
      expect(mockBatch.commit).toHaveBeenCalled();
    });
  });
});
