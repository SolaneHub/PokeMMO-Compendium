import { describe, expect, it } from "vitest";

import { SuperTrainerSchema, SuperTrainerTeamSchema } from "./superTrainers";

describe("SuperTrainers Types", () => {
  it("SuperTrainerTeamSchema should validate correct data", () => {
    const validData = {
      pokemonNames: ["Pikachu"],
      pokemonStrategies: {
        Pikachu: [],
      },
    };
    expect(SuperTrainerTeamSchema.safeParse(validData).success).toBe(true);
  });

  it("SuperTrainerSchema should validate correct data", () => {
    const validData = {
      name: "Red",
      region: "Kanto",
      type: "Various",
      image: "red.png",
      teams: {
        "Team 1": { pokemonNames: [], pokemonStrategies: {} },
      },
    };
    expect(SuperTrainerSchema.safeParse(validData).success).toBe(true);
  });
});
