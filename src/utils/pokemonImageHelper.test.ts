import { describe, expect, it } from "vitest";

import { formatItemNameForUrl, getSpriteUrlByName } from "./pokemonImageHelper";

describe("pokemonImageHelper", () => {
  describe("getSpriteUrlByName", () => {
    it("should return correct URL for standard pokemon", () => {
      const url = getSpriteUrlByName("Bulbasaur");
      expect(url).toContain("1.svg");
    });

    it("should handle variants with IDs", () => {
      // Assuming Deoxys-Attack is a variant in variantIds
      const url = getSpriteUrlByName("Deoxys (Attack)");
      expect(url).not.toBeNull();
    });

    it("should handle Nidoran special cases", () => {
      expect(getSpriteUrlByName("Nidoran♀")).toContain("29.svg");
      expect(getSpriteUrlByName("Nidoran♂")).toContain("32.svg");
    });

    it("should handle Basculin (Red-Striped)", () => {
      expect(getSpriteUrlByName("Basculin (Red-Striped)")).toContain("550.svg");
    });

    it("should return null for unknown pokemon", () => {
      expect(getSpriteUrlByName("Unknown")).toBeNull();
    });
  });

  describe("formatItemNameForUrl", () => {
    it("should format standard item names", () => {
      expect(formatItemNameForUrl("Quick Claw")).toBe("Quick_Claw");
    });

    it("should handle Poké Ball special cases", () => {
      expect(formatItemNameForUrl("Poké Ball")).toBe("Poké_Ball");
      expect(formatItemNameForUrl("Poke Ball")).toBe("Poké_Ball");
    });

    it("should remove parentheses and trim", () => {
      expect(formatItemNameForUrl("Leftovers (5%)")).toBe("Leftovers");
    });

    it("should return empty string for empty input", () => {
      expect(formatItemNameForUrl("")).toBe("");
    });
  });
});
