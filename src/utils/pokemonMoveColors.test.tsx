import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Pokemon } from "@/types/pokemon";

import { typeBackgrounds } from "./pokemonColors";
import {
  getMoveGradient,
  getPokemonGradient,
  initializePokemonColorMap,
  renderColoredText,
} from "./pokemonMoveColors";

describe("pokemonMoveColors", () => {
  describe("initializePokemonColorMap", () => {
    it("returns empty map if no pokemon data provided", () => {
      expect(initializePokemonColorMap([])).toEqual({});
      expect(initializePokemonColorMap(null as unknown as Pokemon[])).toEqual(
        {}
      );
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
        { name: "Missingno", types: ["Unknown" as any] },
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

  describe("renderColoredText", () => {
    it("returns original text if empty", () => {
      expect(renderColoredText("", {})).toBe("");
    });

    it("renders known moves with styled span", () => {
      const text = "Use Flamethrower on the enemy";
      const { container } = render(<>{renderColoredText(text, {})}</>);

      const span = container.querySelector("span");
      expect(span).toBeTruthy();
      expect(span?.textContent).toBe("Flamethrower");
      // JSDOM might convert hex to rgb and add properties to background shorthand
      expect(span?.style.background).toBeTruthy();
    });

    it("renders known pokemon with styled span from map and tests sorting logic", () => {
      const text = "Switch to Charizard now";
      const mockMap = {
        Char: "short-gradient",
        Charizard: "custom-red-gradient",
      };
      const { container } = render(<>{renderColoredText(text, mockMap)}</>);

      const span = container.querySelector("span");
      expect(span).toBeTruthy();
      expect(span?.textContent).toBe("Charizard");
      // Check that it's NOT 'Char' by checking the matched text
      expect(span?.textContent).not.toBe("Char");
    });

    it("renders both moves and pokemon in the same text", () => {
      const text = "Charizard uses Earthquake";
      const mockMap = { Charizard: "custom-red" };
      const { container } = render(<>{renderColoredText(text, mockMap)}</>);

      const spans = container.querySelectorAll("span");
      expect(spans.length).toBe(2);
      expect(spans[0]?.textContent).toBe("Charizard");
      expect(spans[1]?.textContent).toBe("Earthquake");
    });

    it("is case insensitive for matching but preserves original casing in result", () => {
      const text = "flamethrower is strong";
      const { container } = render(<>{renderColoredText(text, {})}</>);
      const span = container.querySelector("span");
      expect(span?.textContent).toBe("flamethrower");
    });
  });
});
