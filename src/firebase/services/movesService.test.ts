import * as firestore from "firebase/firestore";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { setMockDocs } from "@/test/setup";
import { MoveMaster, Pokemon } from "@/types/pokemon";

import {
  deleteMove,
  getMoves,
  importMovesFromPokedex,
  saveMove,
} from "./movesService";
import { getPokedexData } from "./pokedexService";

vi.mock("./common", () => ({
  MOVES_COLLECTION: "moves",
}));

vi.mock("./pokedexService", () => ({
  getPokedexData: vi.fn(),
}));

describe("movesService", () => {
  const mockMove: MoveMaster = {
    id: "tackle",
    name: "Tackle",
    type: "Normal",
    category: "Physical",
    power: "40",
    accuracy: "100",
    pp: "35",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "warn").mockImplementation(() => {
      // Mock console.warn
    });
  });

  afterEach(() => {
    setMockDocs([]);
    vi.restoreAllMocks();
  });

  describe("getMoves", () => {
    it("returns an array of moves from firestore", async () => {
      setMockDocs([mockMove]);

      const result = await getMoves();

      expect(result.length).toBe(1);
      const move = result[0];
      if (!move) throw new Error("Move not found");
      expect(move.name).toBe("Tackle");
    });

    it("filters out invalid moves and warns", async () => {
      setMockDocs([
        mockMove,
        { id: "invalid", name: 123 } as unknown as MoveMaster,
      ]); // Invalid name type

      const result = await getMoves();

      expect(result.length).toBe(1);
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe("saveMove", () => {
    it("calls setDoc with correct parameters", async () => {
      await saveMove(mockMove);

      expect(firestore.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          name: "Tackle",
          power: "40",
        })
      );
    });

    it("throws error if move name is missing", async () => {
      const invalidMove = { ...mockMove, name: "" };
      await expect(saveMove(invalidMove)).rejects.toThrow(
        "Move name is required"
      );
    });

    it("generates id from name if id is missing", async () => {
      const { id: _, ...moveNoId } = mockMove;
      await saveMove(moveNoId as MoveMaster);

      expect(firestore.doc).toHaveBeenCalledWith(
        expect.anything(),
        "moves",
        "tackle"
      );
    });
  });

  describe("deleteMove", () => {
    it("calls deleteDoc with correct parameters", async () => {
      await deleteMove("tackle");

      expect(firestore.deleteDoc).toHaveBeenCalled();
    });
  });

  describe("importMovesFromPokedex", () => {
    it("extracts unique moves from pokedex and commits batch", async () => {
      const mockPokedex = [
        {
          name: "Bulbasaur",
          moves: [
            {
              name: "Tackle",
              type: "Normal",
              category: "Physical",
              power: "40",
              accuracy: "100",
              pp: "35",
            },
            {
              name: "Growl",
              type: "Normal",
              category: "Status",
              power: "-",
              accuracy: "100",
              pp: "40",
            },
          ],
        },
        {
          name: "Squirtle",
          moves: [
            {
              name: "Tackle",
              type: "Normal",
              category: "Physical",
              power: "40",
              accuracy: "100",
              pp: "35",
            },
          ],
        },
        {
          name: "NoMovesPokemon",
          moves: null, // Test branch where pokemon.moves is missing
        },
        {
          name: "InvalidMovePokemon",
          moves: [
            { name: "", type: "Normal" }, // Test branch where move.name is missing
          ],
        },
      ];
      vi.mocked(getPokedexData).mockResolvedValueOnce(
        mockPokedex as unknown as Pokemon[]
      );

      const count = await importMovesFromPokedex();

      expect(count).toBe(2); // Tackle and Growl
      expect(firestore.writeBatch).toHaveBeenCalled();
    });

    it("returns 0 if no moves found", async () => {
      vi.mocked(getPokedexData).mockResolvedValueOnce([]);

      const count = await importMovesFromPokedex();

      expect(count).toBe(0);
      expect(firestore.writeBatch).toHaveBeenCalled(); // Always called in this implementation
    });
  });
});
