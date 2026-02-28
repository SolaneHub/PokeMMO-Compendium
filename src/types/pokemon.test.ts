import { describe, expect, it } from "vitest";

import { PokemonSchema } from "./pokemon";

describe("PokemonSchema", () => {
  const minimalValidPokemon = {
    id: 1,
    name: "Bulbasaur",
  };

  it("successfully parses a minimal pokemon with all default fallbacks triggered", () => {
    const result = PokemonSchema.safeParse(minimalValidPokemon);

    expect(result.success).toBe(true);
    if (result.success) {
      const data = result.data;

      // Checking preprocess fallbacks
      expect(data.types).toEqual([]);
      expect(data.abilities).toEqual({ main: [], hidden: null });
      expect(data.baseStats).toEqual({
        hp: 0,
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0,
      });
      expect(data.moves).toEqual([]);
      expect(data.evolutions).toEqual([]);
      expect(data.locations).toEqual([]);
    }
  });

  it("successfully parses a full pokemon object", () => {
    const fullPokemon = {
      id: "25",
      name: "Pikachu",
      category: "Mouse",
      types: ["Electric"],
      description: "Electric mouse",
      height: "0.4 m",
      weight: "6.0 kg",
      genderRatio: { m: 50, f: 50 },
      catchRate: "190",
      baseExp: 112,
      growthRate: "Medium Fast",
      evYield: "2 Spe",
      heldItems: { "Light Ball": "5%" },
      tier: "NU",
      abilities: { main: ["Static"], hidden: "Lightning Rod" },
      eggGroups: ["Field", "Fairy"],
      baseStats: { hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90 },
      moves: [{ name: "Thunderbolt", type: "Electric", power: 90 }],
      evolutions: [{ name: "Raichu", method: "Thunder Stone" }],
      locations: [{ region: "Kanto", area: "Viridian Forest", rarity: "Rare" }],
      variants: [
        "Cosplay Pikachu",
        { name: "Pikachu Libre", category: "Cosplay" },
      ],
      dexId: 25,
      _isFullData: true,
    };

    const result = PokemonSchema.safeParse(fullPokemon);
    expect(result.success).toBe(true);
  });

  it("handles explicit nulls or undefined values in preprocessed fields", () => {
    const nullFieldsPokemon = {
      id: 2,
      name: "Ivysaur",
      types: null,
      abilities: undefined,
      baseStats: null,
      moves: null,
      evolutions: undefined,
      locations: null,
    };

    const result = PokemonSchema.safeParse(nullFieldsPokemon);

    expect(result.success).toBe(true);
    if (result.success) {
      const data = result.data;
      expect(data.types).toEqual([]);
      expect(data.abilities).toEqual({ main: [], hidden: null });
      expect(data.baseStats).toEqual({
        hp: 0,
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0,
      });
      expect(data.moves).toEqual([]);
      expect(data.evolutions).toEqual([]);
      expect(data.locations).toEqual([]);
    }
  });

  it("fails if required fields are completely missing or invalid type", () => {
    const invalidPokemon = {
      // Missing 'name'
      id: "invalid-id",
    };

    const result = PokemonSchema.safeParse(invalidPokemon);
    expect(result.success).toBe(false);
  });
});
