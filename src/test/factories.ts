import { vi } from "vitest";

import { PokedexContextType } from "@/context/PokedexContext";
import { BossFight, BossFightTeam } from "@/types/bossFights";
import { PickupLocation, PickupRegion } from "@/types/pickup";
import { Pokemon } from "@/types/pokemon";
import { Raid, RaidBuild, RaidStrategy } from "@/types/raids";
import { SuperTrainer, SuperTrainerTeam } from "@/types/superTrainers";
import { Team, TeamMember } from "@/types/teams";
import { TrainerRerunData } from "@/types/trainerRerun";

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

export function createMockSuperTrainerTeam(
  overrides?: Partial<SuperTrainerTeam>
): SuperTrainerTeam {
  return {
    pokemonNames: ["Pikachu"],
    pokemonStrategies: {
      Pikachu: [{ id: "1", type: "text", description: "Step 1" }],
    },
    ...overrides,
  };
}

export function createMockSuperTrainer(
  overrides?: Partial<SuperTrainer>
): SuperTrainer {
  return {
    name: "Trainer 1",
    region: "Kanto",
    type: "Various",
    image: "img.png",
    teams: {
      Hard: createMockSuperTrainerTeam(),
    },
    ...overrides,
  };
}

export function createMockRaidBuild(overrides?: Partial<RaidBuild>): RaidBuild {
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

export function createMockRaidStrategy(
  overrides?: Partial<RaidStrategy>
): RaidStrategy {
  return {
    id: "1",
    label: "Main",
    roles: {},
    recommended: [createMockRaidBuild()],
    ...overrides,
  };
}

export function createMockRaid(overrides?: Partial<Raid>): Raid {
  return {
    name: "Pikachu",
    stars: 5,
    moves: ["Thunderbolt"],
    teamStrategies: [createMockRaidStrategy()],
    locations: {},
    mechanics: null,
    ...overrides,
  };
}

export function createMockPickupLocation(
  overrides?: Partial<PickupLocation>
): PickupLocation {
  return {
    name: "Route 1",
    items: { Common: ["Potion"] },
    ...overrides,
  };
}

export function createMockPickupRegion(
  overrides?: Partial<PickupRegion>
): PickupRegion {
  return {
    id: "kanto",
    name: "Kanto",
    locations: [createMockPickupLocation()],
    ...overrides,
  };
}

export function createMockTrainerRerunData(
  overrides?: Partial<TrainerRerunData>
): TrainerRerunData {
  return {
    intro: { title: "Rerun Guide", description: ["Desc 1"] },
    requirements: { title: "Reqs", items: ["Item 1"] },
    tips_tricks: { title: "Tips", items: ["Tip 1"] },
    regions: [
      {
        name: "Kanto",
        routes: [
          {
            name: "Route 1",
            trainers: [{ name: "Youngster Joey", money: 500 }],
          },
        ],
      },
    ],
    ...overrides,
  };
}
