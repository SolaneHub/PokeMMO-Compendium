import { describe, expect, it } from "vitest";

import { StrategyStepSchema, TeamMemberSchema, TeamSchema } from "./teams";

describe("Teams Types", () => {
  it("TeamMemberSchema should validate correct data", () => {
    const validData = {
      name: "Pikachu",
      item: "Light Ball",
      ability: "Static",
      nature: "Jolly",
      evs: "252/0/0/0/0/252",
      ivs: "6x31",
      moves: ["Thunderbolt"],
    };
    expect(TeamMemberSchema.safeParse(validData).success).toBe(true);
  });

  it("StrategyStepSchema should validate correct data", () => {
    const validData = { id: "1", type: "text", description: "Step 1" };
    expect(StrategyStepSchema.safeParse(validData).success).toBe(true);
  });

  it("TeamSchema should validate correct data", () => {
    const validData = {
      name: "My Team",
      region: "Kanto",
      members: [],
    };
    expect(TeamSchema.safeParse(validData).success).toBe(true);
  });
});
