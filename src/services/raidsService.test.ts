import { describe, expect, it } from "vitest";

import { Raid } from "@/types/raids";

import {
  getActiveStrategy,
  getActiveStrategyFromRaid,
  getRaidByName,
  getRaidsByStars,
  getStarLevels,
} from "./raidsService";

describe("raidsService", () => {
  describe("getActiveStrategyFromRaid", () => {
    const mockRaid = {
      name: "Test Raid",
      teamStrategies: [
        { label: "Strat 1", roles: {}, recommended: [] },
        { label: "Strat 2", roles: {}, recommended: [] },
      ],
    } as unknown as Raid;

    it("returns null if raid is null", () => {
      expect(getActiveStrategyFromRaid(null)).toBeNull();
    });

    it("returns the requested strategy if index exists", () => {
      const result = getActiveStrategyFromRaid(mockRaid, 1);
      expect(result?.label).toBe("Strat 2");
    });

    it("returns the first strategy if requested index is out of bounds", () => {
      const result = getActiveStrategyFromRaid(mockRaid, 99);
      expect(result?.label).toBe("Strat 1");
    });

    it("returns null if raid has no teamStrategies array", () => {
      const emptyRaid = { name: "Test" } as unknown as Raid;
      expect(getActiveStrategyFromRaid(emptyRaid)).toBeNull();
    });

    it("returns null if raid has empty teamStrategies array", () => {
      const emptyRaid = { name: "Test", teamStrategies: [] } as unknown as Raid;
      expect(getActiveStrategyFromRaid(emptyRaid)).toBeNull();
    });
  });

  // Test deprecated functions to maintain 100% statement coverage
  describe("deprecated functions", () => {
    it("getStarLevels returns empty array", () => {
      expect(getStarLevels()).toEqual([]);
    });

    it("getRaidsByStars returns empty array", () => {
      expect(getRaidsByStars()).toEqual([]);
    });

    it("getRaidByName returns null", () => {
      expect(getRaidByName()).toBeNull();
    });

    it("getActiveStrategy returns null", () => {
      expect(getActiveStrategy()).toBeNull();
    });
  });
});
