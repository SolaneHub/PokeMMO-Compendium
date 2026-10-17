import { describe, expect, it } from "vitest";

import { Pokemon, PokemonMove } from "@/types/pokemon";
import { propagateMovesToEvolutions } from "@/utils/pokemonEvolutionHelpers";

const createMockPokemon = (
  overrides: Partial<Pokemon> & { name: string; id: string }
): Pokemon => ({
  category: "Seed",
  types: ["Grass"],
  description: "Test description",
  height: "0.7 m",
  weight: "6.9 kg",
  abilities: { main: ["Overgrow"], hidden: null },
  genderRatio: { m: 87.5, f: 12.5 },
  eggGroups: ["Monster", "Grass"],
  baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
  moves: [],
  evolutions: [],
  locations: [],
  variants: [],
  dexId: "001",
  ...overrides,
});

describe("propagateMovesToEvolutions", () => {
  it("propagates base moves correctly to direct evolution", () => {
    const baseMoves: PokemonMove[] = [
      { name: "Tackle", level: 1, type: "Normal" },
      { name: "Growl", level: 4, type: "Normal" },
    ];

    const base = createMockPokemon({
      id: "1",
      name: "Bulbasaur",
      moves: baseMoves,
      evolutions: [{ name: "Ivysaur", method: "Level 16" }],
    });

    const evo = createMockPokemon({
      id: "2",
      name: "Ivysaur",
      moves: [],
    });

    const result = propagateMovesToEvolutions(base, [base, evo]);

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("2");
    expect(result[0]?.moves).toEqual(baseMoves);
  });

  it("preserves original learning levels (bm.level)", () => {
    const baseMoves: PokemonMove[] = [
      { name: "Ember", level: 7, type: "Fire" },
      { name: "Scratch", level: 1, type: "Normal" },
    ];

    const base = createMockPokemon({
      id: "4",
      name: "Charmander",
      moves: baseMoves,
      evolutions: [{ name: "Charmeleon", method: "Level 16" }],
    });

    // Evolution already has Scratch but with different level
    const evo = createMockPokemon({
      id: "5",
      name: "Charmeleon",
      moves: [{ name: "Scratch", level: 99, type: "Normal" }],
    });

    const result = propagateMovesToEvolutions(base, [base, evo]);

    expect(result).toHaveLength(1);
    const scratchMove = result[0]?.moves.find((m) => m.name === "Scratch");
    expect(scratchMove?.level).toBe(1);
    const emberMove = result[0]?.moves.find((m) => m.name === "Ember");
    expect(emberMove?.level).toBe(7);
  });

  it("preserves unique evolution moves not present in base pokemon", () => {
    const baseMoves: PokemonMove[] = [
      { name: "Water Gun", level: 1, type: "Water" },
    ];

    const base = createMockPokemon({
      id: "7",
      name: "Squirtle",
      moves: baseMoves,
      evolutions: [{ name: "Wartortle", method: "Level 16" }],
    });

    const evoMoves: PokemonMove[] = [
      { name: "Hydro Pump", level: 40, type: "Water" },
    ];

    const evo = createMockPokemon({
      id: "8",
      name: "Wartortle",
      moves: evoMoves,
    });

    const result = propagateMovesToEvolutions(base, [base, evo]);

    expect(result).toHaveLength(1);
    expect(result[0]?.moves).toEqual([
      { name: "Water Gun", level: 1, type: "Water" },
      { name: "Hydro Pump", level: 40, type: "Water" },
    ]);
  });

  it("propagates recursively across 3 evolutionary stages", () => {
    const charmanderMoves: PokemonMove[] = [
      { name: "Scratch", level: 1, type: "Normal" },
      { name: "Ember", level: 7, type: "Fire" },
    ];

    const charmander = createMockPokemon({
      id: "4",
      name: "Charmander",
      moves: charmanderMoves,
      evolutions: [{ name: "Charmeleon", method: "Level 16" }],
    });

    const charmeleon = createMockPokemon({
      id: "5",
      name: "Charmeleon",
      moves: [{ name: "Dragon Rage", level: 17, type: "Dragon" }],
      evolutions: [{ name: "Charizard", method: "Level 36" }],
    });

    const charizard = createMockPokemon({
      id: "6",
      name: "Charizard",
      moves: [{ name: "Wing Attack", level: 36, type: "Flying" }],
    });

    const all = [charmander, charmeleon, charizard];
    const result = propagateMovesToEvolutions(charmander, all);

    expect(result).toHaveLength(2);

    const updatedCharmeleon = result.find((p) => p.id === "5");
    const updatedCharizard = result.find((p) => p.id === "6");

    expect(updatedCharmeleon).toBeDefined();
    expect(updatedCharizard).toBeDefined();

    expect(updatedCharmeleon?.moves).toEqual([
      { name: "Scratch", level: 1, type: "Normal" },
      { name: "Ember", level: 7, type: "Fire" },
      { name: "Dragon Rage", level: 17, type: "Dragon" },
    ]);

    expect(updatedCharizard?.moves).toEqual([
      { name: "Scratch", level: 1, type: "Normal" },
      { name: "Ember", level: 7, type: "Fire" },
      { name: "Dragon Rage", level: 17, type: "Dragon" },
      { name: "Wing Attack", level: 36, type: "Flying" },
    ]);
  });

  it("protects against circular references (self-evolution or backward loops)", () => {
    const p1 = createMockPokemon({
      id: "100",
      name: "LoopMonA",
      moves: [{ name: "Tackle", level: 1, type: "Normal" }],
      evolutions: [{ name: "LoopMonB", method: "Level" }],
    });

    const p2 = createMockPokemon({
      id: "101",
      name: "LoopMonB",
      moves: [],
      evolutions: [{ name: "LoopMonA", method: "Level" }],
    });

    const selfLoop = createMockPokemon({
      id: "102",
      name: "SelfLoop",
      moves: [{ name: "Tackle", level: 1, type: "Normal" }],
      evolutions: [{ name: "SelfLoop", method: "Level" }],
    });

    expect(() => {
      const result = propagateMovesToEvolutions(p1, [p1, p2]);
      expect(result).toHaveLength(1);
    }).not.toThrow();

    expect(() => {
      const result = propagateMovesToEvolutions(selfLoop, [selfLoop]);
      expect(result).toEqual([]);
    }).not.toThrow();
  });

  it("returns empty array if base pokemon has no evolutions or if moves are already identical", () => {
    const noEvo = createMockPokemon({
      id: "150",
      name: "Mewtwo",
      moves: [{ name: "Psychic", level: 1 }],
      evolutions: [],
    });

    expect(propagateMovesToEvolutions(noEvo, [noEvo])).toEqual([]);

    const moves: PokemonMove[] = [{ name: "Pound", level: 1 }];
    const baseWithIdenticalEvo = createMockPokemon({
      id: "39",
      name: "Jigglypuff",
      moves,
      evolutions: [{ name: "Wigglytuff", method: "Moon Stone" }],
    });

    const evoIdentical = createMockPokemon({
      id: "40",
      name: "Wigglytuff",
      moves: [{ name: "Pound", level: 1 }],
    });

    const result = propagateMovesToEvolutions(baseWithIdenticalEvo, [
      baseWithIdenticalEvo,
      evoIdentical,
    ]);

    expect(result).toEqual([]);
  });
});

describe("edge cases and defensive branches", () => {
  it("returns [] if basePokemon.name is empty or whitespace only", () => {
    const emptyNameBase = createMockPokemon({
      id: "1",
      name: "",
      evolutions: [{ name: "Ivysaur" }],
    });
    const whitespaceBase = createMockPokemon({
      id: "2",
      name: "   ",
      evolutions: [{ name: "Ivysaur" }],
    });
    const evo = createMockPokemon({ id: "3", name: "Ivysaur" });

    expect(
      propagateMovesToEvolutions(emptyNameBase, [emptyNameBase, evo])
    ).toEqual([]);
    expect(
      propagateMovesToEvolutions(whitespaceBase, [whitespaceBase, evo])
    ).toEqual([]);
  });

  it("handles basePokemon with absent or undefined moves without throwing", () => {
    const baseWithUndefinedMoves = createMockPokemon({
      id: "1",
      name: "Bulbasaur",
      moves: undefined as unknown as PokemonMove[],
      evolutions: [{ name: "Ivysaur" }],
    });
    const evo = createMockPokemon({
      id: "2",
      name: "Ivysaur",
      moves: [{ name: "Tackle", level: 1 }],
    });

    expect(() => {
      const result = propagateMovesToEvolutions(baseWithUndefinedMoves, [
        baseWithUndefinedMoves,
        evo,
      ]);
      expect(result).toEqual([]);
    }).not.toThrow();
  });

  it("ignores an evolution declared in evolutions whose name is not in allPokemon", () => {
    const base = createMockPokemon({
      id: "1",
      name: "Bulbasaur",
      moves: [{ name: "Tackle", level: 1 }],
      evolutions: [{ name: "NonExistentEvolution" }],
    });

    const result = propagateMovesToEvolutions(base, [base]);
    expect(result).toEqual([]);
  });

  it("handles an evolution in allPokemon whose moves array is undefined", () => {
    const base = createMockPokemon({
      id: "1",
      name: "Bulbasaur",
      moves: [{ name: "Tackle", level: 1 }],
      evolutions: [{ name: "Ivysaur" }],
    });
    const evoWithUndefinedMoves = createMockPokemon({
      id: "2",
      name: "Ivysaur",
      moves: undefined as unknown as PokemonMove[],
    });

    const result = propagateMovesToEvolutions(base, [
      base,
      evoWithUndefinedMoves,
    ]);
    expect(result).toHaveLength(1);
    expect(result[0]?.moves).toEqual([{ name: "Tackle", level: 1 }]);
  });

  it("does not include evolutions lacking an id in the output", () => {
    const base = createMockPokemon({
      id: "1",
      name: "Bulbasaur",
      moves: [{ name: "Tackle", level: 1 }],
      evolutions: [{ name: "Ivysaur" }],
    });
    const evoWithoutId = createMockPokemon({
      id: "",
      name: "Ivysaur",
      moves: [],
    });

    const result = propagateMovesToEvolutions(base, [base, evoWithoutId]);
    expect(result).toEqual([]);
  });
});
