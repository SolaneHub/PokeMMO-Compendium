import { describe, expect, it } from "vitest";

import {
  calculateRowConfigs,
  generateBreedingTree,
  getStatColors,
  toggleTreeNode,
} from "./breedingTree";

describe("breedingTree pure utilities", () => {
  describe("getStatColors", () => {
    it("maps known stats to colors and unknown to #ffffff", () => {
      const colors = getStatColors(["HP", "UnknownStat"]);
      expect(colors[0]).toBeDefined();
      expect(colors[0]).not.toBe("#ffffff");
      expect(colors[1]).toBe("#ffffff");
    });
  });

  describe("generateBreedingTree", () => {
    it("returns empty array when stats are empty", () => {
      expect(generateBreedingTree(0, [], false)).toEqual([]);
    });

    it("generates correct number of rows for given IVs", () => {
      // 2 IVs -> 2 rows
      const tree = generateBreedingTree(2, ["HP", "Atk"], false);
      expect(tree.length).toBe(2);
      // Row 0 has 2 nodes (parents)
      expect(tree[0]?.length).toBe(2);
      // Row 1 has 1 node (child)
      expect(tree[1]?.length).toBe(1);
    });

    it("prepends Nature if nature is true", () => {
      const tree = generateBreedingTree(2, ["HP", "Atk"], true);
      // Nature + 2 IVs = 3 items -> 3 rows
      expect(tree.length).toBe(3);
    });

    it("clamps IV count to maximum 6", () => {
      const stats = ["HP", "Atk", "Def", "SpA", "SpD", "Spe", "Extra"];
      const tree = generateBreedingTree(7, stats, false);
      expect(tree.length).toBe(6);
    });
  });

  describe("toggleTreeNode", () => {
    it("activates ancestors when a child node is turned on", () => {
      const activeIds = new Set<string>();
      // Row 1, Col 0 clicked (child of Row 0 Col 0 and Row 0 Col 1)
      const updated = toggleTreeNode(activeIds, 1, 0, 2);
      expect(updated.has("1-0")).toBe(true);
      expect(updated.has("0-0")).toBe(true);
      expect(updated.has("0-1")).toBe(true);
    });

    it("deactivates descendants and ancestors when turned off", () => {
      const activeIds = new Set<string>(["0-0", "0-1", "1-0"]);
      // Deactivate 0-0
      const updated = toggleTreeNode(activeIds, 0, 0, 2);
      expect(updated.has("0-0")).toBe(false);
      // Child (1-0) should be deactivated because descendant of 0-0
      expect(updated.has("1-0")).toBe(false);
    });
  });

  describe("calculateRowConfigs", () => {
    it("returns empty array for 0 rows", () => {
      expect(calculateRowConfigs(0)).toEqual([]);
    });

    it("computes rowConfigs properly for multiple rows", () => {
      const configs = calculateRowConfigs(3);
      expect(configs.length).toBe(3);
      expect(configs[0]?.pairGap).toBe(40);
      expect(configs[0]?.rowGap).toBe(90);
      expect(configs[1]?.pairGap).toBeGreaterThan(0);
    });
  });
});
