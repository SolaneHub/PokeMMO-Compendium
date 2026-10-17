import { describe, expect, it } from "vitest";

import { FirestoreTimestampSchema, Team, TeamSchema } from "./teams";

describe("FirestoreTimestampSchema", () => {
  it("accepts valid timestamp representations", () => {
    // 1. Date instance
    const dateVal = new Date();
    expect(FirestoreTimestampSchema.safeParse(dateVal).success).toBe(true);

    // 2. Numeric timestamp
    expect(FirestoreTimestampSchema.safeParse(1700000000).success).toBe(true);

    // 3. ISO date string
    expect(
      FirestoreTimestampSchema.safeParse("2026-10-17T00:00:00.000Z").success
    ).toBe(true);

    // 4. Firestore object with .toDate()
    const firestoreTimestamp = { toDate: () => new Date() };
    expect(FirestoreTimestampSchema.safeParse(firestoreTimestamp).success).toBe(
      true
    );

    // 5. Object with seconds and nanoseconds
    expect(
      FirestoreTimestampSchema.safeParse({
        seconds: 1700000000,
        nanoseconds: 0,
      }).success
    ).toBe(true);

    // Object with seconds only (nanoseconds optional)
    expect(
      FirestoreTimestampSchema.safeParse({ seconds: 1700000000 }).success
    ).toBe(true);
  });

  it("rejects invalid timestamp representations", () => {
    // Boolean
    expect(FirestoreTimestampSchema.safeParse(true).success).toBe(false);

    // Empty object
    expect(FirestoreTimestampSchema.safeParse({}).success).toBe(false);

    // Array
    expect(FirestoreTimestampSchema.safeParse([]).success).toBe(false);

    // Object where toDate is not a function
    expect(
      FirestoreTimestampSchema.safeParse({ toDate: "string" }).success
    ).toBe(false);
  });
});

describe("TeamSchema", () => {
  const baseTeamData: Omit<Team, "createdAt" | "updatedAt"> = {
    id: "team-1",
    userId: "user-1",
    name: "Competitive Kanto",
    region: "Kanto",
    members: [],
    status: "draft",
    isPublic: false,
  };

  it("accepts a team with createdAt and updatedAt containing an object with .toDate()", () => {
    const teamWithFirestoreTimestamps = {
      ...baseTeamData,
      createdAt: { toDate: () => new Date() },
      updatedAt: { toDate: () => new Date() },
    };

    const parsed = TeamSchema.safeParse(teamWithFirestoreTimestamps);
    expect(parsed.success).toBe(true);
  });

  it("accepts a team with createdAt and updatedAt omitted", () => {
    const parsed = TeamSchema.safeParse(baseTeamData);
    expect(parsed.success).toBe(true);
  });

  it("rejects a team if createdAt is a boolean or non-compliant value", () => {
    const invalidTeamBoolean = {
      ...baseTeamData,
      createdAt: true,
    };
    expect(TeamSchema.safeParse(invalidTeamBoolean).success).toBe(false);

    const invalidTeamObject = {
      ...baseTeamData,
      createdAt: { invalid: "property" },
    };
    expect(TeamSchema.safeParse(invalidTeamObject).success).toBe(false);
  });
});
