import { describe, expect, it } from "vitest";

import { createMockPokemon, createMockRaid } from "@/test/factories";

import { Pokemon } from "../types/pokemon";
import {
  getActiveStrategyFromRaid,
  getFamilyName,
  getPokedexMainList,
  getPokemonVariants,
} from "./pokemonHelpers";

describe("pokemonHelpers", () => {
  describe("getActiveStrategyFromRaid", () => {
    it("returns null if raid is null", () => {
      expect(getActiveStrategyFromRaid(null)).toBeNull();
    });

    it("returns null if teamStrategies is empty", () => {
      const raid = createMockRaid({ teamStrategies: [] });
      expect(getActiveStrategyFromRaid(raid)).toBeNull();
    });

    const strat1 = { id: "1", label: "Strategy 1", roles: {}, recommended: [] };
    const strat2 = { id: "2", label: "Strategy 2", roles: {}, recommended: [] };

    it("returns the first strategy by default", () => {
      const raid = createMockRaid({
        teamStrategies: [strat1, strat2],
      });
      expect(getActiveStrategyFromRaid(raid)).toEqual(strat1);
    });

    it("returns the strategy at index if valid", () => {
      const raid = createMockRaid({
        teamStrategies: [strat1, strat2],
      });
      expect(getActiveStrategyFromRaid(raid, 1)).toEqual(strat2);
    });

    it("returns the first strategy if index is out of bounds", () => {
      const raid = createMockRaid({
        teamStrategies: [strat1],
      });
      expect(getActiveStrategyFromRaid(raid, 5)).toEqual(strat1);
    });
  });

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
      createMockPokemon({ name: "Rotom" }),
      createMockPokemon({ name: "Heat Rotom" }),
      createMockPokemon({ name: "Pikachu" }),
      createMockPokemon({ name: "Charizard" }),
    ];

    it("returns all members of the same family", () => {
      const result = getPokemonVariants("Wash Rotom", allPokemon);
      expect(result).toContain("Rotom");
      expect(result).toContain("Heat Rotom");
      expect(result).not.toContain("Pikachu");
    });

    it("returns empty array if allPokemon is missing", () => {
      expect(
        getPokemonVariants("Pikachu", null as unknown as Pokemon[])
      ).toEqual([]);
    });
  });

  describe("getPokedexMainList", () => {
    it("filters and groups pokemon by family correctly", () => {
      const pokedexData = [
        createMockPokemon({ name: "Pikachu" }),
        createMockPokemon({ name: "Raichu" }),
        createMockPokemon({ name: "Heat Rotom" }),
        createMockPokemon({ name: "Rotom" }),
        createMockPokemon({ name: "Wash Rotom" }),
      ];

      const result = getPokedexMainList(pokedexData);
      expect(result.map((p) => p.name)).toEqual([
        "Pikachu",
        "Raichu",
        "Rotom", // Should pick "Rotom" as the family entry instead of Heat/Wash
      ]);
    });

    it("picks the first variant if the family entry itself is missing", () => {
      const pokedexData = [
        createMockPokemon({ name: "Heat Rotom" }),
        createMockPokemon({ name: "Wash Rotom" }),
      ];

      const result = getPokedexMainList(pokedexData);
      expect(result.map((p) => p.name)).toEqual(["Heat Rotom"]);
    });
  });
});
