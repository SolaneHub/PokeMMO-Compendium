import { describe, expect, it } from "vitest";

import { Pokemon } from "../types/pokemon";
import { typeBackgrounds } from "./pokemonColors";
import {
  getFamilyName,
  getPokemonBackground,
  getPokemonCardData,
  getPokemonVariants,
} from "./pokemonHelpers";

describe("pokemonHelpers", () => {
  describe("getFamilyName", () => {
    it("identifies Rotom variants correctly", () => {
      expect(getFamilyName("Heat Rotom")).toBe("Rotom");
      expect(getFamilyName("Wash Rotom")).toBe("Rotom");
    });

    it("strips parentheses for other variants", () => {
      expect(getFamilyName("Charizard (Mega X)")).toBe("Charizard");
      expect(getFamilyName("Meowstic (Male)")).toBe("Meowstic");
    });

    it("returns name as is if not a variant", () => {
      expect(getFamilyName("Pikachu")).toBe("Pikachu");
    });
  });

  describe("getPokemonBackground", () => {
    it("returns default background for null pokemon", () => {
      expect(getPokemonBackground(null)).toBe(typeBackgrounds[""]);
    });

    it("returns named background if it exists in map", () => {
      // Assuming 'Fire' or similar might be in typeBackgrounds
      expect(getPokemonBackground({ name: "Fire" } as Pokemon)).toBe(
        typeBackgrounds["Fire"]
      );
    });

    it("generates gradient for dual types", () => {
      const pokemon = {
        name: "Bulbasaur",
        types: ["Grass", "Poison"],
      } as Pokemon;
      const bg = getPokemonBackground(pokemon);
      expect(bg).toContain("linear-gradient");
    });

    it("returns single type background", () => {
      const pokemon = { name: "Charmander", types: ["Fire"] } as Pokemon;
      expect(getPokemonBackground(pokemon)).toBe(typeBackgrounds["Fire"]);
    });

    it("returns default if types array is empty", () => {
      const pokemon = { name: "Unknown", types: [] } as Pokemon;
      expect(getPokemonBackground(pokemon)).toBe(typeBackgrounds[""]);
    });
  });

  describe("getPokemonCardData", () => {
    it("returns null sprite for null pokemon", () => {
      const result = getPokemonCardData(null);
      expect(result.sprite).toBeNull();
      expect(result.background).toBe(typeBackgrounds[""]);
    });

    it("returns full data including sprite for valid pokemon", () => {
      const pokemon = { name: "Pikachu", types: ["Electric"] } as Pokemon;
      const result = getPokemonCardData(pokemon);
      expect(result.name).toBe("Pikachu");
      expect(result.sprite).not.toBeNull();
      expect(result.background).toBe(typeBackgrounds["Electric"]);
    });
  });

  describe("getPokemonVariants", () => {
    const allPokemon = [
      { name: "Rotom" },
      { name: "Heat Rotom" },
      { name: "Pikachu" },
      { name: "Charizard" },
    ] as Pokemon[];

    it("returns all members of the same family", () => {
      const result = getPokemonVariants("Wash Rotom", allPokemon);
      expect(result).toContain("Rotom");
      expect(result).toContain("Heat Rotom");
      expect(result).not.toContain("Pikachu");
    });

    it("returns empty array if allPokemon is missing", () => {
      // @ts-expect-error - Testing with null to trigger error handling
      expect(getPokemonVariants("Pikachu", null)).toEqual([]);
    });
  });
});
