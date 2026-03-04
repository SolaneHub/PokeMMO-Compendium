import { describe, expect, it } from "vitest";

import { Pokemon } from "../types/pokemon";
import { getFamilyName, getPokemonVariants } from "./pokemonHelpers";

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
