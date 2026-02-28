import { describe, expect, it } from "vitest";

import { Pokemon } from "@/types/pokemon";

import {
  extractPokedexData,
  getPokemonIdByName,
} from "./pokedexDataExtraction";

describe("pokedexDataExtraction", () => {
  describe("extractPokedexData", () => {
    it("returns empty structure when pokedexData is null", () => {
      const result = extractPokedexData(null);
      expect(result).toEqual({
        pokemonNames: [],
        abilityNames: [],
        itemNames: [],
        allPokemonData: [],
      });
    });

    it("extracts unique names, abilities, and catch rates correctly", () => {
      const mockData: Partial<Pokemon>[] = [
        {
          name: "Bulbasaur",
          catchRate: 45,
          abilities: { main: ["Overgrow"], hidden: "Chlorophyll" },
          heldItems: "None",
        },
        {
          name: "Charmander",
          catchRate: 45,
          abilities: { main: ["Blaze"], hidden: "Solar Power" },
          heldItems: ["Charcoal"], // Array format
        },
        {
          name: "Squirtle",
          catchRate: "45", // String format test
          abilities: { main: ["Torrent", "Rain Dish"], hidden: null },
          heldItems: { "Mystic Water": "100%" }, // Object format test
        },
        {
          name: "Bulbasaur", // Duplicate to test Set logic
          catchRate: 45,
        },
        {
          // Missing data gracefully handled
          name: "",
        },
      ];

      const result = extractPokedexData(mockData as Pokemon[]);

      // Check unique Pokemon Names (sorted)
      expect(result.pokemonNames).toEqual([
        "Bulbasaur",
        "Charmander",
        "Squirtle",
      ]);

      // Check Abilities (sorted)
      expect(result.abilityNames).toEqual([
        "Blaze",
        "Chlorophyll",
        "Overgrow",
        "Rain Dish",
        "Solar Power",
        "Torrent",
      ]);

      // Check Items (sorted and includes defaults)
      expect(result.itemNames).toContain("Charcoal");
      expect(result.itemNames).toContain("Mystic Water");
      expect(result.itemNames).toContain("Choice Band"); // A default item
      expect(result.itemNames).not.toContain("None");

      // Check Catch Rates
      expect(result.allPokemonData).toEqual([
        { name: "Bulbasaur", catchRate: 45 },
        { name: "Bulbasaur", catchRate: 45 },
        { name: "Charmander", catchRate: 45 },
        { name: "Squirtle", catchRate: "45" },
      ]);
    });
  });

  describe("getPokemonIdByName", () => {
    const mockData: Partial<Pokemon>[] = [
      { id: 1, name: "Bulbasaur" },
      { id: "4", name: "Charmander" },
    ];

    it("returns null if pokedexData is null", () => {
      expect(getPokemonIdByName("Bulbasaur", null)).toBeNull();
    });

    it("returns the correct ID if pokemon exists", () => {
      expect(getPokemonIdByName("Bulbasaur", mockData as Pokemon[])).toBe(1);
      expect(getPokemonIdByName("Charmander", mockData as Pokemon[])).toBe("4");
    });

    it("returns null if pokemon does not exist", () => {
      expect(getPokemonIdByName("Squirtle", mockData as Pokemon[])).toBeNull();
    });
  });
});
