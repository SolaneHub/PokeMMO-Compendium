import { vi } from "vitest";

import type { MoveMaster, Pokemon } from "@/types/pokemon";
import { MoveMasterSchema, PokemonSchema } from "@/types/pokemon";
import type { StrategyStep } from "@/types/strategy";
import { StrategyStepSchema } from "@/types/strategy";
import type { Team } from "@/types/teams";
import { TeamSchema } from "@/types/teams";

/**
 * 5 Realistic Pokemon entries conforming to PokemonSchema
 */
export const mockPokemonList: Pokemon[] = [
  PokemonSchema.parse({
    id: 87,
    dexId: 87,
    name: "Dewgong",
    category: "Sea Lion Pokémon",
    types: ["Water", "Ice"],
    description:
      "Its entire body is a snowy white. Unharmed by even intense cold, it swims powerfully in icy waters.",
    height: "1.7 m",
    weight: "120.0 kg",
    genderRatio: { m: 0.5, f: 0.5 },
    catchRate: 75,
    baseExp: 166,
    growthRate: "Medium Fast",
    evYield: "2 Sp. Def",
    heldItems: "Aspear Berry",
    abilities: {
      main: ["Thick Fat", "Hydration"],
      hidden: "Ice Body",
    },
    eggGroups: ["Water 1", "Field"],
    baseStats: {
      hp: 90,
      atk: 70,
      def: 80,
      spa: 70,
      spd: 95,
      spe: 70,
    },
    moves: [
      {
        name: "Ice Beam",
        type: "Ice",
        category: "Special",
        power: 90,
        accuracy: 100,
        pp: 10,
        level: "TM",
      },
      {
        name: "Surf",
        type: "Water",
        category: "Special",
        power: 90,
        accuracy: 100,
        pp: 15,
        level: "HM",
      },
      {
        name: "Sheer Cold",
        type: "Ice",
        category: "Special",
        power: "OHKO",
        accuracy: 30,
        pp: 5,
        level: 65,
      },
      {
        name: "Rest",
        type: "Psychic",
        category: "Status",
        power: "-",
        accuracy: "-",
        pp: 10,
        level: 27,
      },
    ],
    evolutions: [
      {
        name: "Seel",
        method: "Level up",
        level: 34,
      },
    ],
    locations: [
      {
        region: "Kanto",
        area: "Seafoam Islands",
        rarity: "Uncommon",
        method: "Surfing",
        levels: "30-40",
      },
    ],
  }),

  PokemonSchema.parse({
    id: 131,
    dexId: 131,
    name: "Lapras",
    category: "Transport Pokémon",
    types: ["Water", "Ice"],
    description:
      "A smart and kindhearted Pokémon, it glides across the surface of the sea while its beautiful song echoes around it.",
    height: "2.5 m",
    weight: "220.0 kg",
    genderRatio: { m: 0.5, f: 0.5 },
    catchRate: 45,
    baseExp: 187,
    growthRate: "Slow",
    evYield: "2 HP",
    heldItems: "Mystic Water",
    abilities: {
      main: ["Water Absorb", "Shell Armor"],
      hidden: "Hydration",
    },
    eggGroups: ["Monster", "Water 1"],
    baseStats: {
      hp: 130,
      atk: 85,
      def: 80,
      spa: 85,
      spd: 95,
      spe: 60,
    },
    moves: [
      {
        name: "Hydro Pump",
        type: "Water",
        category: "Special",
        power: 110,
        accuracy: 80,
        pp: 5,
        level: 43,
      },
      {
        name: "Ice Beam",
        type: "Ice",
        category: "Special",
        power: 90,
        accuracy: 100,
        pp: 10,
        level: 32,
      },
      {
        name: "Thunderbolt",
        type: "Electric",
        category: "Special",
        power: 90,
        accuracy: 100,
        pp: 15,
        level: "TM",
      },
      {
        name: "Sing",
        type: "Normal",
        category: "Status",
        power: "-",
        accuracy: 55,
        pp: 15,
        level: 1,
      },
    ],
    evolutions: [],
    locations: [
      {
        region: "Kanto",
        area: "Silph Co.",
        rarity: "Gift",
        method: "Gift from NPC",
      },
    ],
  }),

  PokemonSchema.parse({
    id: 91,
    dexId: 91,
    name: "Cloyster",
    category: "Bivalve Pokémon",
    types: ["Water", "Ice"],
    description:
      "Its shell is extremely hard. It cannot be shattered, even with a bomb. The shell opens only when it is attacking.",
    height: "1.5 m",
    weight: "132.5 kg",
    genderRatio: { m: 0.5, f: 0.5 },
    catchRate: 60,
    baseExp: 184,
    growthRate: "Slow",
    evYield: "2 Def",
    heldItems: "Pearl",
    abilities: {
      main: ["Skill Link", "Shell Armor"],
      hidden: "Overcoat",
    },
    eggGroups: ["Water 3"],
    baseStats: {
      hp: 50,
      atk: 95,
      def: 180,
      spa: 85,
      spd: 45,
      spe: 70,
    },
    moves: [
      {
        name: "Icicle Spear",
        type: "Ice",
        category: "Physical",
        power: 25,
        accuracy: 100,
        pp: 30,
        level: 13,
      },
      {
        name: "Shell Smash",
        type: "Normal",
        category: "Status",
        power: "-",
        accuracy: "-",
        pp: 15,
        level: 1,
      },
      {
        name: "Rock Blast",
        type: "Rock",
        category: "Physical",
        power: 25,
        accuracy: 90,
        pp: 10,
        level: "Egg",
      },
      {
        name: "Ice Shard",
        type: "Ice",
        category: "Physical",
        power: 40,
        accuracy: 100,
        pp: 30,
        level: 28,
      },
    ],
    evolutions: [
      {
        name: "Shellder",
        method: "Water Stone",
      },
    ],
    locations: [
      {
        region: "Kanto",
        area: "Seafoam Islands",
        rarity: "Rare",
        method: "Super Rod",
        levels: "25-35",
      },
    ],
  }),

  PokemonSchema.parse({
    id: 6,
    dexId: 6,
    name: "Charizard",
    category: "Flame Pokémon",
    types: ["Fire", "Flying"],
    description:
      "It spits fire that is hot enough to melt boulders. It may cause forest fires by blowing flames.",
    height: "1.7 m",
    weight: "90.5 kg",
    genderRatio: { m: 0.875, f: 0.125 },
    catchRate: 45,
    baseExp: 240,
    growthRate: "Medium Slow",
    evYield: "3 Sp. Atk",
    heldItems: "None",
    abilities: {
      main: ["Blaze"],
      hidden: "Solar Power",
    },
    eggGroups: ["Monster", "Dragon"],
    baseStats: {
      hp: 78,
      atk: 84,
      def: 78,
      spa: 109,
      spd: 85,
      spe: 100,
    },
    moves: [
      {
        name: "Flamethrower",
        type: "Fire",
        category: "Special",
        power: 90,
        accuracy: 100,
        pp: 15,
        level: 47,
      },
      {
        name: "Air Slash",
        type: "Flying",
        category: "Special",
        power: 75,
        accuracy: 95,
        pp: 15,
        level: 1,
      },
      {
        name: "Dragon Pulse",
        type: "Dragon",
        category: "Special",
        power: 85,
        accuracy: 100,
        pp: 10,
        level: "TM",
      },
      {
        name: "Solar Beam",
        type: "Grass",
        category: "Special",
        power: 120,
        accuracy: 100,
        pp: 10,
        level: "TM",
      },
    ],
    evolutions: [
      {
        name: "Charmander",
        method: "Level up",
        level: 16,
      },
      {
        name: "Charmeleon",
        method: "Level up",
        level: 36,
      },
    ],
    locations: [
      {
        region: "Kanto",
        area: "Pallet Town",
        rarity: "Starter",
        method: "Professor Oak gift",
      },
    ],
  }),

  PokemonSchema.parse({
    id: 121,
    dexId: 121,
    name: "Starmie",
    category: "Mysterious Pokémon",
    types: ["Water", "Psychic"],
    description:
      "Its central core glows with the seven colors of the rainbow. Some people value the core as a gem.",
    height: "1.1 m",
    weight: "80.0 kg",
    genderRatio: { m: 0, f: 0 },
    catchRate: 60,
    baseExp: 182,
    growthRate: "Slow",
    evYield: "2 Spe",
    heldItems: "Stardust",
    abilities: {
      main: ["Natural Cure", "Illuminate"],
      hidden: "Analytic",
    },
    eggGroups: ["Water 3"],
    baseStats: {
      hp: 60,
      atk: 75,
      def: 85,
      spa: 100,
      spd: 85,
      spe: 115,
    },
    moves: [
      {
        name: "Hydro Pump",
        type: "Water",
        category: "Special",
        power: 110,
        accuracy: 80,
        pp: 5,
        level: 1,
      },
      {
        name: "Psychic",
        type: "Psychic",
        category: "Special",
        power: 90,
        accuracy: 100,
        pp: 10,
        level: "TM",
      },
      {
        name: "Ice Beam",
        type: "Ice",
        category: "Special",
        power: 90,
        accuracy: 100,
        pp: 10,
        level: "TM",
      },
      {
        name: "Thunderbolt",
        type: "Electric",
        category: "Special",
        power: 90,
        accuracy: 100,
        pp: 15,
        level: "TM",
      },
    ],
    evolutions: [
      {
        name: "Staryu",
        method: "Water Stone",
      },
    ],
    locations: [
      {
        region: "Kanto",
        area: "Route 19",
        rarity: "Uncommon",
        method: "Super Rod",
        levels: "20-40",
      },
    ],
  }),
];

/**
 * MoveMaster list conforming to MoveMasterSchema
 */
export const mockMovesList: MoveMaster[] = [
  MoveMasterSchema.parse({
    id: "ice-beam",
    name: "Ice Beam",
    type: "Ice",
    category: "Special",
    power: 90,
    accuracy: 100,
    pp: 10,
  }),
  MoveMasterSchema.parse({
    id: "surf",
    name: "Surf",
    type: "Water",
    category: "Special",
    power: 90,
    accuracy: 100,
    pp: 15,
  }),
  MoveMasterSchema.parse({
    id: "sheer-cold",
    name: "Sheer Cold",
    type: "Ice",
    category: "Special",
    power: "OHKO",
    accuracy: 30,
    pp: 5,
  }),
  MoveMasterSchema.parse({
    id: "rest",
    name: "Rest",
    type: "Psychic",
    category: "Status",
    power: "-",
    accuracy: "-",
    pp: 10,
  }),
  MoveMasterSchema.parse({
    id: "thunderbolt",
    name: "Thunderbolt",
    type: "Electric",
    category: "Special",
    power: 90,
    accuracy: 100,
    pp: 15,
  }),
  MoveMasterSchema.parse({
    id: "hydro-pump",
    name: "Hydro Pump",
    type: "Water",
    category: "Special",
    power: 110,
    accuracy: 80,
    pp: 5,
  }),
  MoveMasterSchema.parse({
    id: "flamethrower",
    name: "Flamethrower",
    type: "Fire",
    category: "Special",
    power: 90,
    accuracy: 100,
    pp: 15,
  }),
  MoveMasterSchema.parse({
    id: "close-combat",
    name: "Close Combat",
    type: "Fighting",
    category: "Physical",
    power: 120,
    accuracy: 100,
    pp: 5,
  }),
  MoveMasterSchema.parse({
    id: "stealth-rock",
    name: "Stealth Rock",
    type: "Rock",
    category: "Status",
    power: "-",
    accuracy: "-",
    pp: 20,
  }),
];

/**
 * Strategy steps for Lorelei's Dewgong
 */
const dewgongStrategySteps: StrategyStep[] = [
  StrategyStepSchema.parse({
    id: "lorelei-dewgong-step-1",
    type: "main",
    player: "Lead with Cloyster. Use Shell Smash on turn 1.",
    description: "Lead with Cloyster to set up Shell Smash and sweep.",
    warning: "Watch out for Electric/Grass counter attacks.",
    notes:
      "Dewgong holds Thick Fat and can absorb Ice/Fire attacks effectively.",
    variations: [
      {
        type: "step",
        name: "Opponent uses Surf",
        warning: "Surf deals around 25% damage to Cloyster.",
        steps: [
          StrategyStepSchema.parse({
            id: "lorelei-dewgong-substep-1",
            type: "main",
            player: "Use Rock Blast to knock out Dewgong.",
            description:
              "Click Rock Blast immediately for a clean multi-hit knockout.",
            notes: "Guaranteed KO after Shell Smash boost.",
          }),
        ],
      },
    ],
  }),
  StrategyStepSchema.parse({
    id: "lorelei-dewgong-step-2",
    type: "main",
    player: "Cast Thunderbolt with Starmie if Cloyster is down.",
    description: "Cast Thunderbolt with Starmie.",
    notes:
      "Deals 80-95% HP damage. Finish off with Surf or a second Thunderbolt.",
    warning: "Dewgong may use Rest if HP drops below 25%.",
  }),
];

/**
 * 2 Approved community Team objects
 */
export const mockApprovedTeams: Team[] = [
  TeamSchema.parse({
    id: "team-kanto-elite4-lorelei",
    userId: "trainer-pro-1",
    name: "Kanto E4 Speed Clear (Lorelei Counter)",
    region: "Kanto",
    status: "approved",
    isPublic: true,
    createdAt: new Date("2026-01-15T10:00:00.000Z"),
    updatedAt: new Date("2026-02-01T12:00:00.000Z"),
    members: [
      {
        name: "Starmie",
        item: "Life Orb",
        ability: "Natural Cure",
        nature: "Timid",
        evs: "252 SpA / 4 SpD / 252 Spe",
        ivs: "31/0/31/31/31/31",
        moves: ["Thunderbolt", "Ice Beam", "Hydro Pump", "Psychic"],
        dexId: 121,
      },
      {
        name: "Cloyster",
        item: "Focus Sash",
        ability: "Skill Link",
        nature: "Adamant",
        evs: "252 Atk / 4 Def / 252 Spe",
        ivs: "31/31/31/31/31/31",
        moves: ["Shell Smash", "Icicle Spear", "Rock Blast", "Ice Shard"],
        dexId: 91,
      },
      {
        name: "Charizard",
        item: "Choice Specs",
        ability: "Solar Power",
        nature: "Timid",
        evs: "252 SpA / 4 SpD / 252 Spe",
        ivs: "31/0/31/31/31/31",
        moves: ["Flamethrower", "Air Slash", "Dragon Pulse", "Solar Beam"],
        dexId: 6,
      },
    ],
    enemyPools: {
      Lorelei: ["Dewgong", "Cloyster", "Lapras"],
      Bruno: ["Onix", "Hitmonchan", "Hitmonlee", "Machamp"],
    },
    strategies: {
      Lorelei: {
        Dewgong: dewgongStrategySteps,
        Lapras: [
          StrategyStepSchema.parse({
            id: "lorelei-lapras-step-1",
            type: "action",
            description:
              "Switch to Cloyster, setup Shell Smash, and sweep with Rock Blast.",
          }),
        ],
        Cloyster: [
          StrategyStepSchema.parse({
            id: "lorelei-cloyster-step-1",
            type: "action",
            description:
              "Use Special Electric moves; Cloyster has weak Sp. Def (45).",
          }),
        ],
      },
    },
  }),

  TeamSchema.parse({
    id: "team-general-rerun-balanced",
    userId: "trainer-pro-2",
    name: "All-Round Competitive Balanced Team",
    region: "Kanto",
    status: "approved",
    isPublic: true,
    createdAt: new Date("2026-02-10T08:30:00.000Z"),
    updatedAt: new Date("2026-02-12T14:20:00.000Z"),
    members: [
      {
        name: "Charizard",
        item: "Heavy-Duty Boots",
        ability: "Blaze",
        nature: "Jolly",
        evs: "252 Atk / 4 Def / 252 Spe",
        ivs: "31/31/31/31/31/31",
        moves: ["Flare Blitz", "Dragon Dance", "Earthquake", "Roost"],
        dexId: 6,
      },
      {
        name: "Lapras",
        item: "Leftovers",
        ability: "Water Absorb",
        nature: "Modest",
        evs: "248 HP / 252 SpA / 8 SpD",
        ivs: "31/0/31/31/31/31",
        moves: ["Freeze-Dry", "Surf", "Thunderbolt", "Ice Shard"],
        dexId: 131,
      },
    ],
    enemyPools: {
      Bruno: ["Machamp", "Hitmonlee"],
    },
    strategies: {
      Bruno: {
        Machamp: [
          StrategyStepSchema.parse({
            id: "bruno-machamp-step-1",
            type: "action",
            description:
              "Lead with Flying/Psychic move to KO before Dynamic Punch.",
          }),
        ],
      },
    },
  }),
];

/**
 * In-memory storage collections
 */
export interface MockDatabaseState {
  pokemon: Map<string, Pokemon>;
  teams: Map<string, Team>;
  moves: Map<string, MoveMaster>;
  rawCollections: Map<string, Map<string, unknown>>;
}

const databaseState: MockDatabaseState = {
  pokemon: new Map(),
  teams: new Map(),
  moves: new Map(),
  rawCollections: new Map(),
};

/**
 * Resets the in-memory mock database to completely empty state.
 */
export function resetMockDatabase(): void {
  databaseState.pokemon.clear();
  databaseState.teams.clear();
  databaseState.moves.clear();
  databaseState.rawCollections.clear();
}

/**
 * Pre-populates the mock database with default mock data and returns the current state snapshot.
 */
export function setupMockDatabase(): MockDatabaseState {
  resetMockDatabase();

  // Populate Pokemon
  for (const p of mockPokemonList) {
    const idKey = String(p.id ?? p.name);
    databaseState.pokemon.set(idKey, structuredClone(p));
    databaseState.pokemon.set(p.name, structuredClone(p));
  }

  // Populate Moves
  for (const m of mockMovesList) {
    const idKey = m.id || m.name.toLowerCase().replaceAll(/\s+/g, "-");
    databaseState.moves.set(idKey, structuredClone(m));
    databaseState.moves.set(m.name, structuredClone(m));
  }

  // Populate Teams
  for (const t of mockApprovedTeams) {
    if (t.id) {
      databaseState.teams.set(t.id, structuredClone(t));
    }
  }

  // Initialize collections for generic Firestore simulators
  const pokedexColl = new Map<string, unknown>();
  for (const p of mockPokemonList) {
    const docId = String(p.id).padStart(3, "0");
    pokedexColl.set(docId, structuredClone(p));
  }
  databaseState.rawCollections.set("pokedex", pokedexColl);

  const movesColl = new Map<string, unknown>();
  for (const m of mockMovesList) {
    const docId = m.id || m.name.toLowerCase().replaceAll(/\s+/g, "-");
    movesColl.set(docId, structuredClone(m));
  }
  databaseState.rawCollections.set("moves", movesColl);

  const teamsColl = new Map<string, unknown>();
  for (const t of mockApprovedTeams) {
    if (t.id) {
      teamsColl.set(t.id, structuredClone(t));
    }
  }
  databaseState.rawCollections.set("elite_four_teams", teamsColl);

  return databaseState;
}

/**
 * Returns read-only access to current in-memory database state
 */
export function getMockDatabaseState(): Readonly<MockDatabaseState> {
  return databaseState;
}

/**
 * Helper to build mock query snapshot compatible with Firestore lite getDocs()
 */
export function createFirestoreQuerySnapshotFromMock(collectionName: string) {
  const coll = databaseState.rawCollections.get(collectionName);
  const docsList = coll
    ? Array.from(coll.entries()).map(([id, data]) => ({
        id,
        data: () => data,
        ref: {
          id,
          parent: {
            id: collectionName,
            parent: {
              id: (data as { userId?: string })?.userId || "mock-user-id",
            },
          },
        },
      }))
    : [];

  return {
    empty: docsList.length === 0,
    docs: docsList,
    forEach: (callback: (doc: (typeof docsList)[number]) => void) => {
      docsList.forEach(callback);
    },
  };
}

/**
 * Helper to link mock harness directly with Vitest Firestore spies
 */
export function wireMockDatabaseToFirestore(firestoreMock: {
  getDocs?: ReturnType<typeof vi.fn>;
  getDoc?: ReturnType<typeof vi.fn>;
}) {
  if (firestoreMock.getDocs) {
    firestoreMock.getDocs.mockImplementation(async (q: unknown) => {
      // Determine collection by inspecting query if possible
      const queryObj = q as {
        _query?: { path?: { segments?: string[] } };
        id?: string;
      };
      const pathSegments = queryObj?._query?.path?.segments || [];
      const collectionName =
        pathSegments.at(-1) || queryObj?.id || "elite_four_teams";

      return createFirestoreQuerySnapshotFromMock(collectionName);
    });
  }

  if (firestoreMock.getDoc) {
    firestoreMock.getDoc.mockImplementation(async (docRef: unknown) => {
      const ref = docRef as { id?: string; parent?: { id?: string } };
      const docId = ref?.id || "";
      const collectionName = ref?.parent?.id || "pokedex";
      const coll = databaseState.rawCollections.get(collectionName);
      const data = coll?.get(docId) ?? null;

      return {
        exists: () => data !== null,
        data: () => data,
        id: docId,
        ref,
      };
    });
  }
}
