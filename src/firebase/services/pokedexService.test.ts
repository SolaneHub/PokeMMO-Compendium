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
  updatePokedexSummary,
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

    it("handles pagination with lastDoc", async () => {
      setMockDocs([validPokemonDoc]);
      const lastDoc = {
        id: "1",
        data: () => validPokemonDoc,
      } as unknown as firestore.DocumentSnapshot;
      const result = await getPokedexPaginated(10, lastDoc);
      expect(firestore.startAfter).toHaveBeenCalledWith(lastDoc);
      expect(result.data.length).toBe(1);
    });

    it("returns null lastDoc if no results", async () => {
      setMockDocs([]);
      const result = await getPokedexPaginated(10);
      expect(result.data.length).toBe(0);
      expect(result.lastDoc).toBeNull();
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
      setMockDocs([validPokemonDoc]);

      const originalGetDoc = firestore.getDoc;
      // @ts-expect-error - Mocking firestore getDoc method
      firestore.getDoc = vi.fn().mockImplementationOnce(() => ({
        exists: () => false,
      }));

      const result = await getPokedexSummary();
      expect(result.length).toBe(1);
      expect(result[0].name).toBe("Bulbasaur");
      expect(firestore.setDoc).toHaveBeenCalled();

      firestore.getDoc = originalGetDoc;
    });

    it("handles setDoc failure in summary generation", async () => {
      setMockDocs([validPokemonDoc]);

      const originalGetDoc = firestore.getDoc;
      const originalSetDoc = firestore.setDoc;

      // @ts-expect-error - Mocking firestore getDoc method
      firestore.getDoc = vi.fn().mockImplementationOnce(() => ({
        exists: () => false,
      }));
      // @ts-expect-error - Mocking firestore setDoc method
      firestore.setDoc = vi
        .fn()
        .mockRejectedValueOnce(new Error("Permission denied"));

      const result = await getPokedexSummary();
      expect(result.length).toBe(1);
      // Even if setDoc fails, we still get the generated summary
      expect(result[0].name).toBe("Bulbasaur");

      firestore.getDoc = originalGetDoc;
      firestore.setDoc = originalSetDoc;
    });

    it("falls back to full data if summary exists but pokemonList is not an array", async () => {
      setMockDocs([
        { id: "_summary", pokemonList: "not-an-array" }, // Invalid summary structure
        validPokemonDoc,
      ]);

      const result = await getPokedexSummary();
      expect(result.length).toBe(1);
      expect(result[0].name).toBe("Bulbasaur");
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

    it("savePokedexEntry uses name as fallback ID if no id provided", async () => {
      const pokemonNoId = { ...validPokemonDoc, id: null };
      await savePokedexEntry(pokemonNoId as unknown as Pokemon);
      // getPokemonDocId should have been called with "bulbasaur" (mock implementation just stringifies)
      expect(firestore.doc).toHaveBeenCalledWith(
        expect.anything(),
        "pokedex",
        "bulbasaur"
      );
    });

    it("updatePokedexEntry calls updateDoc", async () => {
      await updatePokedexEntry("1", { name: "Venusaur" });
      expect(firestore.updateDoc).toHaveBeenCalled();
    });

    it("deletePokedexEntry calls deleteDoc", async () => {
      await deletePokedexEntry("1");
      expect(firestore.deleteDoc).toHaveBeenCalled();
    });

    it("updatePokedexData skips pokemon without id", async () => {
      const pokemonNoId = { ...validPokemonDoc, id: null };
      await updatePokedexData([
        pokemonNoId as unknown as Pokemon,
        validPokemonDoc as unknown as Pokemon,
      ]);

      const mockBatch = (
        firestore.writeBatch as unknown as {
          mock: { results: { value: { set: vi.Mock } }[] };
        }
      ).mock.results[0].value;

      // Should only call set once for the valid one
      expect(mockBatch.set).toHaveBeenCalledTimes(1);
    });

    it("savePokedexEntry uses provided id if available", async () => {
      await savePokedexEntry(validPokemonDoc as unknown as Pokemon);
      expect(firestore.doc).toHaveBeenCalledWith(
        expect.anything(),
        "pokedex",
        "1"
      );
    });

    it("savePokedexEntry throws if name is missing", async () => {
      const noName = { ...validPokemonDoc, name: "" };
      await expect(
        savePokedexEntry(noName as unknown as Pokemon)
      ).rejects.toThrow("Pokemon name is required");
    });

    it("updatePokedexSummary calls setDoc with summary document", async () => {
      await updatePokedexSummary([validPokemonDoc as unknown as Pokemon]);
      expect(firestore.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          pokemonList: expect.any(Array),
        })
      );
    });
  });
});
