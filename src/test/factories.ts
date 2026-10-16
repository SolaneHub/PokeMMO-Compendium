import { vi } from "vitest";

import { PokedexContextType } from "@/context/PokedexContext";
import { BossFight, BossFightTeam } from "@/types/bossFights";
import { Pokemon } from "@/types/pokemon";
import { Team, TeamMember } from "@/types/teams";

export function createMockBossFightTeam(
  overrides?: Partial<BossFightTeam>
): BossFightTeam {
  return {
    pokemonNames: ["Nidoking"],
    pokemonStrategies: { Nidoking: ["Use Earthquake"] },
    ...overrides,
  };
}

export function createMockBossFight(overrides?: Partial<BossFight>): BossFight {
  return {
    name: "Giovanni",
    region: "Kanto",
    type: "Ground",
    teams: {
      "Hard Team": createMockBossFightTeam(),
    },
    ...overrides,
  };
}

export function createMockPokemon(overrides?: Partial<Pokemon>): Pokemon {
  return {
    id: 1,
    name: "Pikachu",
    category: "Mouse",
    types: ["Electric"],
    baseStats: { hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90 },
    abilities: { main: ["Static"], hidden: null },
    moves: [],
    evolutions: [],
    locations: [],
    ...overrides,
  };
}

export function createMockTeamMember(
  overrides?: Partial<TeamMember>
): TeamMember {
  return {
    name: "Pikachu",
    item: "Light Ball",
    ability: "Static",
    nature: "Jolly",
    evs: "252 Atk / 252 Spe",
    ivs: "31/31/31/31/31/31",
    moves: ["Volt Tackle"],
    ...overrides,
  };
}

export function createMockTeam(overrides?: Partial<Team>): Team {
  return {
    id: "team-1",
    name: "Test Team",
    region: "Kanto",
    members: [],
    status: "approved",
    isPublic: true,
    strategies: {},
    enemyPools: {},
    ...overrides,
  };
}

export function createMockPokedexContext(
  overrides?: Partial<PokedexContextType>
): PokedexContextType {
  return {
    pokemonNames: ["Pikachu"],
    abilityNames: ["Static"],
    itemNames: ["Light Ball"],
    allPokemonData: [],
    pokemonMap: new Map([["Pikachu", createMockPokemon()]]),
    pokemonColorMap: { Pikachu: "#F8D030" },
    isLoading: false,
    fullList: [],
    refetch: vi.fn(async () => undefined),
    getPokemonDetails: vi.fn(async () => null),
    ...overrides,
  };
}
