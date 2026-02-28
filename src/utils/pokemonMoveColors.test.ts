import { describe, expect, it } from "vitest";

import { Pokemon } from "@/types/pokemon";

import { typeBackgrounds } from "./pokemonColors";
import {
  colorTextElements,
  getMoveGradient,
  getPokemonGradient,
  initializePokemonColorMap,
} from "./pokemonMoveColors";

describe("pokemonMoveColors", () => {
  describe("initializePokemonColorMap", () => {
    it("returns empty map if no pokemon data provided", () => {
      expect(initializePokemonColorMap([])).toEqual({});
      // @ts-expect-error - Testing with null to trigger error handling testing null case
      expect(initializePokemonColorMap(null)).toEqual({});
    });

    it("maps dual types correctly", () => {
      const mockData: Partial<Pokemon>[] = [
        { name: "Charizard", types: ["Fire", "Flying"] },
      ];
      const result = initializePokemonColorMap(mockData as Pokemon[]);
      // Fire's 2nd is #E62829, Flying's 2nd is #81B9EF
      expect(result["Charizard"]).toBe(
        "linear-gradient(to right, #E62829, #81B9EF)"
      );
    });

    it("maps single types correctly", () => {
      const mockData: Partial<Pokemon>[] = [
        { name: "Charmander", types: ["Fire"] },
      ];
      const result = initializePokemonColorMap(mockData as Pokemon[]);
      expect(result["Charmander"]).toBe(typeBackgrounds["Fire"]);
    });

    it("maps unknown types to default #999999", () => {
      const mockData: Partial<Pokemon>[] = [
        { name: "Missingno", types: ["Glitched"] },
      ];
      const result = initializePokemonColorMap(mockData as Pokemon[]);
      expect(result["Missingno"]).toBe("#999999");
    });

    it("handles pokemon with no types", () => {
      const mockData: Partial<Pokemon>[] = [{ name: "Typeless" }];
      const result = initializePokemonColorMap(mockData as Pokemon[]);
      expect(result["Typeless"]).toBe("#999999");
    });
  });

  describe("getMoveGradient", () => {
    it("returns correct gradient for known move", () => {
      // Flamethrower is Fire
      expect(getMoveGradient("Flamethrower")).toBe(typeBackgrounds["Fire"]);
    });

    it("returns default gradient for unknown move", () => {
      expect(getMoveGradient("Unknown Move")).toBe(typeBackgrounds[""]);
    });
  });

  describe("getPokemonGradient", () => {
    it("returns gradient from map if it exists", () => {
      const mockMap = { Charizard: "some-gradient" };
      expect(getPokemonGradient("Charizard", mockMap)).toBe("some-gradient");
    });

    it("returns default gradient if pokemon not in map", () => {
      const mockMap = { Charizard: "some-gradient" };
      expect(getPokemonGradient("Pikachu", mockMap)).toBe(typeBackgrounds[""]);
    });
  });

  describe("colorTextElements", () => {
    it("returns original text if empty", () => {
      expect(colorTextElements("", {})).toBe("");
    });

    it("replaces known moves with styled span", () => {
      const text = "Use Flamethrower on the enemy";
      const result = colorTextElements(text, {});
      expect(result).toContain(
        `<span style="background: ${typeBackgrounds["Fire"]};`
      );
      expect(result).toContain(">Flamethrower</span>");
    });

    it("replaces known pokemon with styled span from map and tests sorting logic", () => {
      // Sorting should prioritize longer names so 'Charizard' is matched before 'Char'
      const text = "Switch to Charizard now";
      const mockMap = {
        Char: "short-gradient",
        Charizard: "custom-red-gradient",
        A: "tiny",
      };
      const result = colorTextElements(text, mockMap);
      expect(result).toContain(`<span style="background: custom-red-gradient;`);
      expect(result).toContain(">Charizard</span>");
      expect(result).not.toContain("short-gradient"); // Shouldn't match partial word if we prioritize length correctly
    });

    it("replaces both moves and pokemon in the same text", () => {
      const text = "Charizard uses Earthquake";
      const mockMap = { Charizard: "custom-red" };
      const result = colorTextElements(text, mockMap);

      expect(result).toContain("custom-red");
      expect(result).toContain(typeBackgrounds["Ground"]); // Earthquake
    });

    it("is case insensitive for matching but preserves original casing in result", () => {
      const text = "flamethrower is strong";
      const result = colorTextElements(text, {});
      expect(result).toContain(">flamethrower</span>"); // original lowercase is preserved
    });
  });
});
