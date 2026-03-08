import { describe, expect, it } from "vitest";

import { Pokemon } from "../types/pokemon";
import { Raid } from "../types/raids";
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
      const raid = { teamStrategies: [] } as unknown as Raid;
      expect(getActiveStrategyFromRaid(raid)).toBeNull();
    });

    it("returns the first strategy by default", () => {
      const raid = {
        teamStrategies: [{ name: "Strategy 1" }, { name: "Strategy 2" }],
      } as unknown as Raid;
      expect(getActiveStrategyFromRaid(raid)).toEqual({ name: "Strategy 1" });
    });

    it("returns the strategy at index if valid", () => {
      const raid = {
        teamStrategies: [{ name: "Strategy 1" }, { name: "Strategy 2" }],
      } as unknown as Raid;
      expect(getActiveStrategyFromRaid(raid, 1)).toEqual({
        name: "Strategy 2",
      });
    });

    it("returns the first strategy if index is out of bounds", () => {
      const raid = {
        teamStrategies: [{ name: "Strategy 1" }],
      } as unknown as Raid;
      expect(getActiveStrategyFromRaid(raid, 5)).toEqual({
        name: "Strategy 1",
      });
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
      expect(
        getPokemonVariants("Pikachu", null as unknown as Pokemon[])
      ).toEqual([]);
    });
  });

  describe("getPokedexMainList", () => {
    it("filters and groups pokemon by family correctly", () => {
      const pokedexData = [
        { name: "Pikachu" },
        { name: "Raichu" },
        { name: "Heat Rotom" },
        { name: "Rotom" },
        { name: "Wash Rotom" },
      ] as Pokemon[];

      const result = getPokedexMainList(pokedexData);
      expect(result.map((p) => p.name)).toEqual([
        "Pikachu",
        "Raichu",
        "Rotom", // Should pick "Rotom" as the family entry instead of Heat/Wash
      ]);
    });

    it("picks the first variant if the family entry itself is missing", () => {
      const pokedexData = [
        { name: "Heat Rotom" },
        { name: "Wash Rotom" },
      ] as Pokemon[];

      const result = getPokedexMainList(pokedexData);
      expect(result.map((p) => p.name)).toEqual(["Heat Rotom"]);
    });
  });
});
