import { describe, expect, it } from "vitest";

import { BossFightSchema, BossFightTeamSchema } from "./bossFights";

describe("BossFights Types", () => {
  it("BossFightTeamSchema should validate correct data", () => {
    const validData = {
      pokemonNames: ["Nidoking"],
      pokemonStrategies: {
        Nidoking: ["Strategy 1"],
      },
    };
    expect(BossFightTeamSchema.safeParse(validData).success).toBe(true);
  });

  it("BossFightSchema should validate correct data", () => {
    const validData = {
      name: "Giovanni",
      region: "Kanto",
      type: "Ground",
      teams: {
        Final: { pokemonNames: [], pokemonStrategies: {} },
      },
    };
    expect(BossFightSchema.safeParse(validData).success).toBe(true);
  });
});
