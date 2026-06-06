import { describe, expect, it } from "vitest";

import { PickupLocationSchema, PickupRegionSchema } from "./pickup";

describe("Pickup Types", () => {
  it("PickupLocationSchema should validate correct data", () => {
    const validData = {
      name: "Route 1",
      items: {
        Common: ["Potion"],
      },
    };
    expect(PickupLocationSchema.safeParse(validData).success).toBe(true);
  });

  it("PickupRegionSchema should validate correct data", () => {
    const validData = {
      id: "kanto",
      name: "Kanto",
      locations: [],
    };
    expect(PickupRegionSchema.safeParse(validData).success).toBe(true);
  });
});
