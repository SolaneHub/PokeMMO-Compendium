import { describe, expect, it } from "vitest";

import {
  generateDualTypeGradient,
  getDualShadow,
  getPrimaryColor,
  typeBackgrounds,
} from "./pokemonColors";

describe("pokemonColors", () => {
  describe("getPrimaryColor", () => {
    it("returns default color for null or undefined", () => {
      expect(getPrimaryColor(null)).toBe("#475569");
      expect(getPrimaryColor(undefined)).toBe("#475569");
      expect(getPrimaryColor("")).toBe("#475569");
    });

    it("extracts the first color from a linear-gradient", () => {
      const gradient = "linear-gradient(to right, #D8D8D8, #9FA19F)";
      expect(getPrimaryColor(gradient)).toBe("#D8D8D8");
    });

    it("returns default color if linear-gradient has no colors", () => {
      const emptyGradient = "linear-gradient(to right, )"; // Technically invalid CSS but tests parsing
      expect(getPrimaryColor(emptyGradient)).toBe("#475569");
    });

    it("returns the exact string if it is not a gradient", () => {
      expect(getPrimaryColor("#123456")).toBe("#123456");
      expect(getPrimaryColor("red")).toBe("red");
    });
  });

  describe("getDualShadow", () => {
    it("returns default shadow for null or undefined", () => {
      expect(getDualShadow(null)).toBe("0 4px 10px #475569aa");
      expect(getDualShadow(undefined)).toBe("0 4px 10px #475569aa");
      expect(getDualShadow("")).toBe("0 4px 10px #475569aa");
    });

    it("returns single shadow if not a gradient", () => {
      expect(getDualShadow("#123456")).toBe("0 4px 10px #123456aa");
    });

    it("returns dual shadow for standard 2-color gradient", () => {
      const gradient = "linear-gradient(to right, #D8D8D8, #9FA19F)";
      expect(getDualShadow(gradient)).toBe(
        "0 4px 10px #D8D8D8aa, 0 2px 5px #9FA19Faa"
      );
    });

    it("returns special rainbow shadow for 7-color Various gradient", () => {
      const gradient = typeBackgrounds["Various"];
      const shadow = getDualShadow(gradient);
      expect(shadow).toContain("#FF000088"); // Contains first color
      expect(shadow).toContain("#9400D388"); // Contains last color
      expect(shadow).toContain("Red Loop Closure"); // Contains comment
    });

    it("handles single-color gradient gracefully", () => {
      const gradient = "linear-gradient(to right, #D8D8D8)";
      expect(getDualShadow(gradient)).toBe("0 4px 10px #D8D8D8aa");
    });

    it("handles broken gradients gracefully", () => {
      const brokenGradient = "linear-gradient(to right, )";
      expect(getDualShadow(brokenGradient)).toBe("0 4px 10px #475569aa");
    });
  });

  describe("generateDualTypeGradient", () => {
    it("returns various gradient if either type is Various", () => {
      expect(generateDualTypeGradient("Various", "Fire")).toBe(
        typeBackgrounds["Various"]
      );
      expect(generateDualTypeGradient("Water", "Various")).toBe(
        typeBackgrounds["Various"]
      );
    });

    it("returns default background if both types are invalid", () => {
      expect(generateDualTypeGradient("InvalidType", "AnotherInvalid")).toBe(
        typeBackgrounds[""]
      );
    });

    it("returns the valid background if only one type is valid", () => {
      expect(generateDualTypeGradient("Fire", "InvalidType")).toBe(
        typeBackgrounds["Fire"]
      );
      expect(generateDualTypeGradient("InvalidType", "Water")).toBe(
        typeBackgrounds["Water"]
      );
    });

    it("generates a new gradient combining the second colors of both types", () => {
      // Fire is #FF7172, #E62829 -> second color is #E62829
      // Water is #83B9FF, #2980EF -> second color is #2980EF
      const result = generateDualTypeGradient("Fire", "Water");
      expect(result).toBe("linear-gradient(to right, #E62829, #2980EF)");
    });

    it("generates gradient using first colors if second colors are missing", () => {
      // Mocking type backgrounds dynamically just for testing this branch
      const originalFire = typeBackgrounds["Fire"];
      const originalWater = typeBackgrounds["Water"];

      typeBackgrounds["Fire"] = "linear-gradient(to right, #FF7172)";
      typeBackgrounds["Water"] = "linear-gradient(to right, #83B9FF)";

      const result = generateDualTypeGradient("Fire", "Water");
      expect(result).toBe("linear-gradient(to right, #FF7172, #83B9FF)");

      // Restore
      typeBackgrounds["Fire"] = originalFire;
      typeBackgrounds["Water"] = originalWater;
    });

    it("returns one of the backgrounds if extraction fails", () => {
      const originalFire = typeBackgrounds["Fire"];
      const originalWater = typeBackgrounds["Water"];

      typeBackgrounds["Fire"] = "invalid-format";
      typeBackgrounds["Water"] = "linear-gradient(to right, #83B9FF, #2980EF)";

      const result = generateDualTypeGradient("Fire", "Water");
      // Because extraction for fire treats 'invalid-format' as a single color, it combines it with the first color of water
      expect(result).toBe("linear-gradient(to right, invalid-format, #83B9FF)");

      // Restore
      typeBackgrounds["Fire"] = originalFire;
      typeBackgrounds["Water"] = originalWater;
    });

    it("falls back to default background if linear-gradient regex fails completely", () => {
      const originalFire = typeBackgrounds["Fire"];
      // Starts with linear-gradient but doesn't have 'to right' so regex fails, returning []
      typeBackgrounds["Fire"] = "linear-gradient(to bottom, red, blue)";

      const result = generateDualTypeGradient("Fire", "Water");
      expect(result).toBe(typeBackgrounds["Fire"]); // Falls back to returning the first valid background

      typeBackgrounds["Fire"] = originalFire;
    });
  });
});
