import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Pokemon } from "@/types/pokemon";

import { useCatchProbability } from "./useCatchProbability";

const mockPokemon = {
  id: 1,
  name: "Bulbasaur",
  types: ["Grass", "Poison"],
  baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
  catchRate: 45,
  abilities: { main: ["Overgrow"], hidden: "Chlorophyll" },
  moves: [],
  evolutions: [],
  locations: [],
} as Pokemon;

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

describe("useCatchProbability", () => {
  it("returns 0 if no pokemon or no catch rate", () => {
    let { result } = renderHook(() =>
      useCatchProbability({ ...defaultProps, selectedPokemon: null })
    );
    expect(result.current).toBe(0);

    result = renderHook(() =>
      useCatchProbability({
        ...defaultProps,
        selectedPokemon: {
          ...mockPokemon,
          catchRate: undefined,
        } as unknown as Pokemon,
      })
    ).result;
    expect(result.current).toBe(0);
  });

  it("handles catchRate as string", () => {
    const { result } = renderHook(() =>
      useCatchProbability({
        ...defaultProps,
        selectedPokemon: { ...mockPokemon, catchRate: "45" },
      })
    );
    expect(result.current).toBeGreaterThan(0);
  });

  it("returns 0 if catchRate is invalid string", () => {
    const { result } = renderHook(() =>
      useCatchProbability({
        ...defaultProps,
        selectedPokemon: { ...mockPokemon, catchRate: "invalid" },
      })
    );
    expect(result.current).toBe(0);
  });

  it("calculates basic catch probability", () => {
    const { result } = renderHook(() => useCatchProbability(defaultProps));
    expect(result.current).toBeGreaterThan(0);
    expect(result.current).toBeLessThan(100);
  });

  describe("Custom Ball Logic", () => {
    it("handles Dusk Ball inside and outside caves", () => {
      const { result: day } = renderHook(() =>
        useCatchProbability({
          ...defaultProps,
          ballType: "Dusk Ball",
          isNightOrCave: false,
        })
      );
      const { result: night } = renderHook(() =>
        useCatchProbability({
          ...defaultProps,
          ballType: "Dusk Ball",
          isNightOrCave: true,
        })
      );
      expect(night.current).toBeGreaterThan(day.current);
    });

    it("handles Fast Ball based on speed", () => {
      const { result: slow } = renderHook(
        () => useCatchProbability({ ...defaultProps, ballType: "Fast Ball" }) // Bulbasaur speed 45
      );
      const { result: fast } = renderHook(() =>
        useCatchProbability({
          ...defaultProps,
          ballType: "Fast Ball",
          selectedPokemon: {
            ...mockPokemon,
            baseStats: { ...mockPokemon.baseStats, spe: 120 },
          },
        })
      );
      expect(fast.current).toBeGreaterThan(slow.current);
    });

    it("handles Dream Ball based on turns", () => {
      const { result: t0 } = renderHook(() =>
        useCatchProbability({
          ...defaultProps,
          ballType: "Dream Ball",
          dreamBallTurns: 0,
        })
      );
      const { result: t1 } = renderHook(() =>
        useCatchProbability({
          ...defaultProps,
          ballType: "Dream Ball",
          dreamBallTurns: 1,
        })
      );
      const { result: t2 } = renderHook(() =>
        useCatchProbability({
          ...defaultProps,
          ballType: "Dream Ball",
          dreamBallTurns: 2,
        })
      );
      const { result: t3 } = renderHook(() =>
        useCatchProbability({
          ...defaultProps,
          ballType: "Dream Ball",
          dreamBallTurns: 3,
        })
      );

      expect(t1.current).toBeGreaterThan(t0.current);
      expect(t2.current).toBeGreaterThan(t1.current);
      expect(t3.current).toBeGreaterThan(t2.current);
    });

    it("handles Nest Ball based on level", () => {
      const { result: lowLevel } = renderHook(() =>
        useCatchProbability({
          ...defaultProps,
          ballType: "Nest Ball",
          targetLevel: 10,
        })
      );
      const { result: highLevel } = renderHook(() =>
        useCatchProbability({
          ...defaultProps,
          ballType: "Nest Ball",
          targetLevel: 30,
        })
      );
      expect(lowLevel.current).toBeGreaterThan(highLevel.current);
    });

    it("handles Timer Ball based on turns passed", () => {
      const { result: turn1 } = renderHook(() =>
        useCatchProbability({
          ...defaultProps,
          ballType: "Timer Ball",
          turnsPassed: 1,
        })
      );
      const { result: turn10 } = renderHook(() =>
        useCatchProbability({
          ...defaultProps,
          ballType: "Timer Ball",
          turnsPassed: 10,
        })
      );
      expect(turn10.current).toBeGreaterThan(turn1.current);
    });

    it("handles Repeat Ball based on captures", () => {
      const { result: none } = renderHook(() =>
        useCatchProbability({
          ...defaultProps,
          ballType: "Repeat Ball",
          repeatBallCaptures: 0,
        })
      );
      const { result: some } = renderHook(() =>
        useCatchProbability({
          ...defaultProps,
          ballType: "Repeat Ball",
          repeatBallCaptures: 10,
        })
      );
      expect(some.current).toBeGreaterThan(none.current);
    });

    it("handles Quick Ball", () => {
      // Turns > 1
      const { result: turn2 } = renderHook(() =>
        useCatchProbability({
          ...defaultProps,
          ballType: "Quick Ball",
          turnsPassed: 2,
        })
      );
      // Turn 1, low catch rate
      const { result: turn1Low } = renderHook(() =>
        useCatchProbability({
          ...defaultProps,
          ballType: "Quick Ball",
          turnsPassed: 1,
        })
      );
      // Turn 1, high catch rate (triggering masterball logic)
      const { result: turn1High } = renderHook(() =>
        useCatchProbability({
          ...defaultProps,
          ballType: "Quick Ball",
          turnsPassed: 1,
          selectedPokemon: { ...mockPokemon, catchRate: 200 },
        })
      );

      expect(turn1Low.current).toBeGreaterThan(turn2.current);
      expect(turn1High.current).toBe(100);
    });
  });

  describe("Edge cases", () => {
    it("Master Ball explicitly defined in constants", () => {
      const { result } = renderHook(() =>
        useCatchProbability({ ...defaultProps, ballType: "Master Ball" })
      );
      expect(result.current).toBe(100);
    });

    it("returns 0 if mathematical rate is 0 or less", () => {
      // Impossible in normal play, but forces x <= 0 coverage
      const { result } = renderHook(() =>
        useCatchProbability({
          ...defaultProps,
          selectedPokemon: { ...mockPokemon, catchRate: -1 },
        })
      );
      expect(result.current).toBe(0);
    });

    it("caps final catch rate at 100 if formula slightly exceeds it without triggering Masterball rule", () => {
      const { result } = renderHook(() =>
        useCatchProbability({
          ...defaultProps,
          targetHpPercentage: 1,
          statusCondition: "Asleep",
          ballType: "Ultra Ball", // Good multiplier
          selectedPokemon: { ...mockPokemon, catchRate: 250 },
        })
      );
      expect(result.current).toBe(100);
    });
  });
});
