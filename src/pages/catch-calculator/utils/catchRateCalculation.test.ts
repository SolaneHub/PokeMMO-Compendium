import { describe, expect, it } from "vitest";

import { createMockPokemon } from "@/test/factories";

import {
  calculateBallMultiplier,
  calculateCatchRate,
  getDreamBallMultiplier,
  getNestBallMultiplier,
} from "./catchRateCalculation";

const mockPokemon = createMockPokemon({
  id: 1,
  name: "Bulbasaur",
  types: ["Grass", "Poison"],
  baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
  catchRate: 45,
  abilities: { main: ["Overgrow"], hidden: "Chlorophyll" },
});

const defaultProps = {
  selectedPokemon: mockPokemon,
  targetHpPercentage: 100,
  statusCondition: "None",
  ballType: "Poké Ball",
  dreamBallTurns: 0,
  targetLevel: 5,
  turnsPassed: 1,
  repeatBallCaptures: 0,
  isNightOrCave: false,
};

describe("catchRateCalculation pure functions", () => {
  describe("getNestBallMultiplier", () => {
    it("returns 4 for level <= 16", () => {
      expect(getNestBallMultiplier(5)).toBe(4);
      expect(getNestBallMultiplier(16)).toBe(4);
    });

    it("scales down for level > 16 down to minimum 1", () => {
      expect(getNestBallMultiplier(20)).toBe(4 - 4 * 0.2);
      expect(getNestBallMultiplier(50)).toBe(1);
    });
  });

  describe("getDreamBallMultiplier", () => {
    it("returns appropriate multipliers based on turns", () => {
      expect(getDreamBallMultiplier(0)).toBe(1);
      expect(getDreamBallMultiplier(1)).toBe(1.5);
      expect(getDreamBallMultiplier(2)).toBe(2.5);
      expect(getDreamBallMultiplier(3)).toBe(4);
      expect(getDreamBallMultiplier(5)).toBe(4);
    });
  });

  describe("calculateBallMultiplier", () => {
    it("returns Dusk Ball multiplier based on night/cave", () => {
      expect(
        calculateBallMultiplier({
          ...defaultProps,
          ballType: "Dusk Ball",
          isNightOrCave: true,
          baseSpeed: 45,
          baseCatchRate: 45,
        })
      ).toBe(2.5);

      expect(
        calculateBallMultiplier({
          ...defaultProps,
          ballType: "Dusk Ball",
          isNightOrCave: false,
          baseSpeed: 45,
          baseCatchRate: 45,
        })
      ).toBe(1);
    });

    it("returns Fast Ball multiplier based on speed", () => {
      expect(
        calculateBallMultiplier({
          ...defaultProps,
          ballType: "Fast Ball",
          baseSpeed: 105,
          baseCatchRate: 45,
        })
      ).toBe(4);

      expect(
        calculateBallMultiplier({
          ...defaultProps,
          ballType: "Fast Ball",
          baseSpeed: 95,
          baseCatchRate: 45,
        })
      ).toBe(1);
    });

    it("returns Quick Ball 255 on turn 1 for high catch rate", () => {
      expect(
        calculateBallMultiplier({
          ...defaultProps,
          ballType: "Quick Ball",
          turnsPassed: 1,
          baseSpeed: 45,
          baseCatchRate: 160,
        })
      ).toBe(255);
    });
  });

  describe("calculateCatchRate", () => {
    it("returns 0 if no pokemon or no catch rate", () => {
      expect(
        calculateCatchRate({ ...defaultProps, selectedPokemon: null })
      ).toBe(0);

      expect(
        calculateCatchRate({
          ...defaultProps,
          selectedPokemon: createMockPokemon({
            ...mockPokemon,
            catchRate: undefined,
          }),
        })
      ).toBe(0);
    });

    it("handles catchRate as string", () => {
      const rate = calculateCatchRate({
        ...defaultProps,
        selectedPokemon: { ...mockPokemon, catchRate: "45" },
      });
      expect(rate).toBeGreaterThan(0);
    });

    it("returns 100% with Master Ball", () => {
      const rate = calculateCatchRate({
        ...defaultProps,
        ballType: "Master Ball",
      });
      expect(rate).toBe(100);
    });

    it("increases catch rate when HP is lower", () => {
      const fullHpRate = calculateCatchRate({
        ...defaultProps,
        targetHpPercentage: 100,
      });
      const lowHpRate = calculateCatchRate({
        ...defaultProps,
        targetHpPercentage: 10,
      });
      expect(lowHpRate).toBeGreaterThan(fullHpRate);
    });

    it("increases catch rate with asleep status condition", () => {
      const noneStatusRate = calculateCatchRate({
        ...defaultProps,
        statusCondition: "None",
      });
      const sleepStatusRate = calculateCatchRate({
        ...defaultProps,
        statusCondition: "Asleep",
      });
      expect(sleepStatusRate).toBeGreaterThan(noneStatusRate);
    });
  });
});
