import { describe, expect, it } from "vitest";

import {
  RouteSchema,
  TrainerRerunDataSchema,
  TrainerSchema,
} from "./trainerRerun";

describe("TrainerRerun Types", () => {
  it("TrainerSchema should validate correct data", () => {
    const validData = { name: "Youngster", money: 100 };
    expect(TrainerSchema.safeParse(validData).success).toBe(true);
  });

  it("RouteSchema should validate correct data", () => {
    const validData = { name: "Route 1", trainers: [] };
    expect(RouteSchema.safeParse(validData).success).toBe(true);
  });

  it("TrainerRerunDataSchema should validate correct data", () => {
    const validData = {
      intro: { title: "Title", description: [] },
      requirements: { title: "Reqs", items: [] },
      tips_tricks: { title: "Tips", items: [] },
      regions: [],
    };
    expect(TrainerRerunDataSchema.safeParse(validData).success).toBe(true);
  });
});
