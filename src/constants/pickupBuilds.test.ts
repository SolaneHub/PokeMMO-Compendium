import { describe, expect, it } from "vitest";

import { pickupPokemonBuilds } from "./pickupBuilds";

describe("pickupBuilds", () => {
  it("should be defined", () => {
    expect(pickupPokemonBuilds).toBeDefined();
    expect(Array.isArray(pickupPokemonBuilds)).toBe(true);
  });
});
