import { describe, expect, it } from "vitest";

import { Pokemon } from "@/types/pokemon";
import { typeBackgrounds } from "@/utils/pokemonColors";

import {
  getAllPokemon,
  getAllPokemonNames,
  getPokedexMainList,
  getPokemonBackground,
  getPokemonByName,
  getPokemonCardData,
  getPokemonFullDetails,
  getPokemonShadow,
  getPokemonVariants,
} from "./pokemonService";

describe("pokemonService", () => {
  const mockPokedexData: Partial<Pokemon>[] = [
    {
      id: 1,
      name: "Bulbasaur",
      types: ["Grass", "Poison"],
      abilities: { main: ["Overgrow"], hidden: "Chlorophyll" },
      baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
    },
    {
      id: 2,
      name: "Charmander",
      types: ["Fire"],
      abilities: { main: ["Blaze"], hidden: null },
      baseStats: { hp: 39, atk: 52, def: 43, spa: 60, spd: 50, spe: 65 },
    },
    {
      id: 3,
      name: "Rotom",
      types: ["Electric", "Ghost"],
      abilities: { main: ["Levitate"], hidden: null },
      baseStats: { hp: 50, atk: 50, def: 77, spa: 95, spd: 77, spe: 91 },
    },
    {
      id: 4,
      name: "Wash Rotom",
      types: ["Electric", "Water"],
      abilities: { main: ["Levitate"], hidden: null },
      baseStats: { hp: 50, atk: 65, def: 107, spa: 105, spd: 107, spe: 86 },
    },
    {
      id: 5,
      name: "Meowstic (Wash)",
      types: ["Psychic"],
      abilities: { main: ["Keen Eye"], hidden: null },
      baseStats: { hp: 74, atk: 48, def: 76, spa: 83, spd: 81, spe: 104 },
    },
  ];

  const pokemonMap = new Map<string, Pokemon>();
  mockPokedexData.forEach((p) => {
    if (p.name) {
      pokemonMap.set(p.name, p as Pokemon);
    }
  });

  describe("getPokemonByName", () => {
    it("returns correct pokemon if it exists", () => {
      const result = getPokemonByName("Bulbasaur", pokemonMap);
      expect(result.id).toBe(1);
      expect(result.types).toEqual(["Grass", "Poison"]);
    });

    it("returns fallback empty pokemon if it does not exist", () => {
      const result = getPokemonByName("Unknown", pokemonMap);
      expect(result.id).toBeNull();
      expect(result.name).toBe("Unknown");
      expect(result.types).toEqual([]);
    });
  });

  describe("getAllPokemonNames", () => {
    it("returns an array of names", () => {
      const result = getAllPokemonNames(mockPokedexData as Pokemon[]);
      expect(result).toEqual([
        "Bulbasaur",
        "Charmander",
        "Rotom",
        "Wash Rotom",
        "Meowstic (Wash)",
      ]);
    });
  });

  describe("getAllPokemon", () => {
    it("returns the exact same array", () => {
      const result = getAllPokemon(mockPokedexData as Pokemon[]);
      expect(result).toBe(mockPokedexData);
    });
  });

  describe("getPokedexMainList", () => {
    it("groups variants and returns only the main family names", () => {
      const result = getPokedexMainList(mockPokedexData as Pokemon[]);
      // Expecting Bulbasaur, Charmander, Rotom (which includes Wash Rotom), and Meowstic (from Meowstic (Wash))
      expect(result).toEqual([
        "Bulbasaur",
        "Charmander",
        "Rotom",
        "Meowstic (Wash)",
      ]);
    });
  });

  describe("getPokemonVariants", () => {
    it("returns all variants for a Rotom family", () => {
      const result = getPokemonVariants("Rotom", mockPokedexData as Pokemon[]);
      expect(result).toEqual(["Rotom", "Wash Rotom"]);
    });

    it("returns variants based on parentheses family", () => {
      const result = getPokemonVariants(
        "Meowstic (Wash)",
        mockPokedexData as Pokemon[]
      );
      expect(result).toEqual(["Meowstic (Wash)"]);
    });
  });

  describe("getPokemonBackground", () => {
    it("returns specific type background if name is directly a type", () => {
      expect(getPokemonBackground("Fire", pokemonMap)).toBe(
        typeBackgrounds["Fire"]
      );
    });

    it("returns dual gradient for dual types", () => {
      const result = getPokemonBackground("Bulbasaur", pokemonMap);
      expect(result).toContain("linear-gradient");
      // Check that it contains hex colors associated with the types
      expect(result).toMatch(/#([a-fA-F0-9]{6})/);
    });

    it("returns solid color for single type", () => {
      const result = getPokemonBackground("Charmander", pokemonMap);
      expect(result).toBe(typeBackgrounds["Fire"]);
    });

    it("returns default background for unknown pokemon", () => {
      const result = getPokemonBackground("Unknown", pokemonMap);
      expect(result).toBe(typeBackgrounds[""]);
    });
  });

  describe("getPokemonShadow", () => {
    it("returns a shadow string based on background", () => {
      const result = getPokemonShadow("Charmander", pokemonMap);
      // Validates a standard CSS box-shadow string format
      expect(result).toContain("px");
      expect(result).toContain("0 ");
    });
  });

  describe("getPokemonCardData", () => {
    it("returns pokemon with sprite and background", () => {
      const result = getPokemonCardData("Bulbasaur", pokemonMap);
      expect(result.id).toBe(1);
      expect(result.sprite).not.toBeNull();
      expect(result.background).toContain("linear-gradient");
    });
  });

  describe("getPokemonFullDetails", () => {
    it("returns full details with variants for an existing pokemon", () => {
      const result = getPokemonFullDetails("Rotom", pokemonMap);
      expect(result.id).toBe(3);
      expect(result.sprite).not.toBeNull();
      expect(result.variants).toEqual(["Wash Rotom"]); // Excludes itself
    });

    it("returns fallback details for an unknown pokemon", () => {
      const result = getPokemonFullDetails("Unknown", pokemonMap);
      expect(result.id).toBeNull();
      expect(result.name).toBe("Unknown");
      expect(result.background).toBe("#1a1b20");
      expect(result.variants).toEqual([]);
    });
  });
});
