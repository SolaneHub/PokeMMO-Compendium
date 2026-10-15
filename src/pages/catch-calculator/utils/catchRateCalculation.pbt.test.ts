import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { BALL_TYPES } from "@/constants/calculatorConstants";
import { Pokemon } from "@/types/pokemon";

import { calculateCatchRate } from "./catchRateCalculation";

describe("catchRateCalculation property-based testing", () => {
  // Mapping status arbitrary strings to actual constants supported in calculator
  const statusConditionArbitrary = fc
    .constantFrom(
      "sleep",
      "freeze",
      "paralysis",
      "burn",
      "poison",
      "none",
      "Asleep",
      "Frozen",
      "Paralyzed",
      "Burned",
      "Poisoned",
      "None"
    )
    .map((status) => {
      switch (status.toLowerCase()) {
        case "sleep":
          return "Asleep";
        case "freeze":
          return "Frozen";
        case "paralysis":
          return "Paralyzed";
        case "burn":
          return "Burned";
        case "poison":
          return "Poisoned";
        default:
          return "None";
      }
    });

  const ballTypeArbitrary = fc.constantFrom(...BALL_TYPES.map((b) => b.name));

  const hpArbitrary = fc
    .integer({ min: 1, max: 1000 })
    .chain((maxHp) =>
      fc
        .integer({ min: 1, max: maxHp })
        .map((currentHp) => ({ currentHp, maxHp }))
    );

  it("always returns a valid rate between 0 and 100 without NaN/Infinity for random inputs", () => {
    fc.assert(
      fc.property(
        hpArbitrary,
        fc.integer({ min: 1, max: 255 }), // catchRate
        ballTypeArbitrary,
        statusConditionArbitrary,
        fc.integer({ min: 1, max: 100 }), // targetLevel
        fc.integer({ min: 1, max: 50 }), // turnsPassed
        fc.integer({ min: 0, max: 10 }), // dreamBallTurns
        fc.integer({ min: 0, max: 30 }), // repeatBallCaptures
        fc.boolean(), // isNightOrCave
        fc.integer({ min: 1, max: 200 }), // baseSpeed
        (
          { currentHp, maxHp },
          catchRate,
          ballType,
          statusCondition,
          targetLevel,
          turnsPassed,
          dreamBallTurns,
          repeatBallCaptures,
          isNightOrCave,
          baseSpeed
        ) => {
          const targetHpPercentage = (currentHp / maxHp) * 100;
          const pokemon: Pokemon = {
            id: 1,
            name: "TestPokemon",
            types: ["Normal"],
            baseStats: {
              hp: 50,
              atk: 50,
              def: 50,
              spa: 50,
              spd: 50,
              spe: baseSpeed,
            },
            catchRate,
            abilities: { main: ["Run Away"], hidden: null },
            moves: [],
            evolutions: [],
            locations: [],
          };

          const result = calculateCatchRate({
            selectedPokemon: pokemon,
            targetHpPercentage,
            statusCondition,
            ballType,
            dreamBallTurns,
            targetLevel,
            turnsPassed,
            repeatBallCaptures,
            isNightOrCave,
          });

          // Valida che non sia MAI NaN, null, undefined o Infinity
          expect(typeof result).toBe("number");
          expect(Number.isNaN(result)).toBe(false);
          expect(Number.isFinite(result)).toBe(true);

          // Valida che sia compreso tra 0 e 100 inclusi
          expect(result).toBeGreaterThanOrEqual(0);
          expect(result).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 1000 }
    );
  });

  it("satisfies monotonicity: lower current HP never decreases the catch rate", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }), // maxHp
        fc.integer({ min: 1, max: 1000 }), // rawHp1
        fc.integer({ min: 1, max: 1000 }), // rawHp2
        fc.integer({ min: 1, max: 255 }), // catchRate
        ballTypeArbitrary,
        statusConditionArbitrary,
        fc.integer({ min: 1, max: 100 }), // targetLevel
        fc.integer({ min: 1, max: 50 }), // turnsPassed
        fc.integer({ min: 0, max: 10 }), // dreamBallTurns
        fc.integer({ min: 0, max: 30 }), // repeatBallCaptures
        fc.boolean(), // isNightOrCave
        fc.integer({ min: 1, max: 200 }), // baseSpeed
        (
          maxHp,
          rawHp1,
          rawHp2,
          catchRate,
          ballType,
          statusCondition,
          targetLevel,
          turnsPassed,
          dreamBallTurns,
          repeatBallCaptures,
          isNightOrCave,
          baseSpeed
        ) => {
          const hpA = (rawHp1 % maxHp) + 1;
          const hpB = (rawHp2 % maxHp) + 1;

          const lowerHp = Math.min(hpA, hpB);
          const higherHp = Math.max(hpA, hpB);

          const lowerHpPercentage = (lowerHp / maxHp) * 100;
          const higherHpPercentage = (higherHp / maxHp) * 100;

          const pokemon: Pokemon = {
            id: 1,
            name: "TestPokemon",
            types: ["Normal"],
            baseStats: {
              hp: 50,
              atk: 50,
              def: 50,
              spa: 50,
              spd: 50,
              spe: baseSpeed,
            },
            catchRate,
            abilities: { main: ["Run Away"], hidden: null },
            moves: [],
            evolutions: [],
            locations: [],
          };

          const rateWithLowerHp = calculateCatchRate({
            selectedPokemon: pokemon,
            targetHpPercentage: lowerHpPercentage,
            statusCondition,
            ballType,
            dreamBallTurns,
            targetLevel,
            turnsPassed,
            repeatBallCaptures,
            isNightOrCave,
          });

          const rateWithHigherHp = calculateCatchRate({
            selectedPokemon: pokemon,
            targetHpPercentage: higherHpPercentage,
            statusCondition,
            ballType,
            dreamBallTurns,
            targetLevel,
            turnsPassed,
            repeatBallCaptures,
            isNightOrCave,
          });

          // Avere meno HP correnti non può MAI diminuire la probabilità di cattura
          expect(rateWithLowerHp).toBeGreaterThanOrEqual(rateWithHigherHp);
        }
      ),
      { numRuns: 1000 }
    );
  });
});
