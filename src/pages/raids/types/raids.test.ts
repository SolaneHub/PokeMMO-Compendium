import { describe, expect, it } from "vitest";

import { RaidLocationSchema, RaidMechanicsSchema, RaidSchema } from "./raids";

describe("Raids Types", () => {
  it("RaidLocationSchema should validate correct data", () => {
    const validData = { area: "Route 1", requirements: ["Surf"] };
    expect(RaidLocationSchema.safeParse(validData).success).toBe(true);
  });

  it("RaidMechanicsSchema should validate correct data", () => {
    const validData = { ability: "Static", notes: "Test" };
    expect(RaidMechanicsSchema.safeParse(validData).success).toBe(true);
  });

  it("RaidSchema should validate correct data", () => {
    const validData = {
      name: "Boss",
      stars: 5,
      moves: ["Tackle"],
      teamStrategies: [],
      locations: { Kanto: "Route 1" },
      mechanics: { ability: "None" },
    };
    expect(RaidSchema.safeParse(validData).success).toBe(true);
  });
});
