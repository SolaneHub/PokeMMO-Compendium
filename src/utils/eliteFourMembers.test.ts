import { describe, expect, it } from "vitest";

import { eliteFourMembers } from "./eliteFourMembers";

describe("eliteFourMembers", () => {
  it("should be an array of Elite Four members", () => {
    expect(Array.isArray(eliteFourMembers)).toBe(true);
    expect(eliteFourMembers.length).toBeGreaterThan(0);
  });

  it("should have members with the correct properties", () => {
    eliteFourMembers.forEach((member) => {
      expect(member).toHaveProperty("name");
      expect(member).toHaveProperty("region");
      expect(member).toHaveProperty("type");
      expect(member).toHaveProperty("image");

      expect(typeof member.name).toBe("string");
      expect(typeof member.region).toBe("string");
      expect(typeof member.type).toBe("string");
      expect(typeof member.image).toBe("string");

      // Images should follow the naming convention
      expect(member.image.endsWith(".png")).toBe(true);
    });
  });

  it("should contain expected regions", () => {
    const regions = new Set(eliteFourMembers.map((m) => m.region));
    expect(regions.has("Kanto")).toBe(true);
    expect(regions.has("Johto")).toBe(true);
    expect(regions.has("Hoenn")).toBe(true);
    expect(regions.has("Sinnoh")).toBe(true);
    expect(regions.has("Unova")).toBe(true);
  });
});
