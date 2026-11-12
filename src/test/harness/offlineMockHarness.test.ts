import { describe, expect, it } from "vitest";

import { MoveMasterSchema, PokemonSchema } from "@/types/pokemon";
import { TeamSchema } from "@/types/teams";

import {
  createFirestoreQuerySnapshotFromMock,
  getMockDatabaseState,
  mockApprovedTeams,
  mockMovesList,
  mockPokemonList,
  resetMockDatabase,
  setupMockDatabase,
} from "./offlineMockHarness";

describe("offlineMockHarness", () => {
  it("validates 5 pokemon items against PokemonSchema", () => {
    expect(mockPokemonList).toHaveLength(5);
    for (const pokemon of mockPokemonList) {
      expect(PokemonSchema.safeParse(pokemon).success).toBe(true);
      expect(pokemon.name).toBeDefined();
      expect(pokemon.types.length).toBeGreaterThan(0);
      expect(pokemon.abilities.main.length).toBeGreaterThan(0);
      expect(pokemon.moves.length).toBeGreaterThan(0);
      expect(pokemon.catchRate).not.toBeNull();
      expect(pokemon.eggGroups).toBeDefined();
    }
  });

  it("validates 2 community teams against TeamSchema with Lorelei/Dewgong", () => {
    expect(mockApprovedTeams).toHaveLength(2);
    for (const team of mockApprovedTeams) {
      expect(TeamSchema.safeParse(team).success).toBe(true);
      expect(team.status).toBe("approved");
      expect(team.isPublic).toBe(true);
    }

    const loreleiTeam = mockApprovedTeams.find(
      (t) => t.id === "team-kanto-elite4-lorelei"
    );
    expect(loreleiTeam).toBeDefined();
    expect(loreleiTeam?.region).toBe("Kanto");
    expect(loreleiTeam?.enemyPools?.["Lorelei"]).toContain("Dewgong");

    const dewgongStrategy = loreleiTeam?.strategies?.["Lorelei"]?.["Dewgong"];
    expect(dewgongStrategy).toBeDefined();
    expect(dewgongStrategy?.length).toBeGreaterThan(0);
    expect(dewgongStrategy?.[0]?.variations?.length).toBeGreaterThan(0);
  });

  it("validates move master items against MoveMasterSchema", () => {
    expect(mockMovesList.length).toBeGreaterThan(0);
    for (const move of mockMovesList) {
      expect(MoveMasterSchema.safeParse(move).success).toBe(true);
      expect(move.name).toBeDefined();
      expect(move.type).toBeDefined();
      expect(move.category).toBeDefined();
    }
  });

  it("populates and resets in-memory mock database", () => {
    const state = setupMockDatabase();
    expect(state.pokemon.size).toBeGreaterThan(0);
    expect(state.teams.size).toBe(2);
    expect(state.moves.size).toBeGreaterThan(0);
    expect(state.pokemon.get("Dewgong")).toBeDefined();
    expect(state.teams.get("team-kanto-elite4-lorelei")).toBeDefined();

    const snapshot = createFirestoreQuerySnapshotFromMock("elite_four_teams");
    expect(snapshot.empty).toBe(false);
    expect(snapshot.docs.length).toBe(2);

    resetMockDatabase();
    const clearedState = getMockDatabaseState();
    expect(clearedState.pokemon.size).toBe(0);
    expect(clearedState.teams.size).toBe(0);
    expect(clearedState.moves.size).toBe(0);
  });
});
