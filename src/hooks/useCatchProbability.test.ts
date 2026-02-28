import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useCatchProbability } from "./useCatchProbability";
import { Pokemon } from "@/types/pokemon";

const mockPokemon = {
  id: 1,
  name: "Bulbasaur",
  types: ["Grass", "Poison"],
  baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
  catchRate: 45, // Classic Bulbasaur catch rate
  abilities: { main: ["Overgrow"], hidden: "Chlorophyll" },
  moves: [],
  evolutions: [],
  locations: [],
} as Pokemon;

describe("useCatchProbability", () => {
  it("returns 0 if no pokemon is selected", () => {
    const { result } = renderHook(() =>
      useCatchProbability({
        selectedPokemon: null,
        targetHpPercentage: 100,
        statusCondition: "None",
        ballType: "Poké Ball",
        dreamBallTurns: 0,
        targetLevel: 5,
        turnsPassed: 1,
        repeatBallCaptures: 0,
        isNightOrCave: false,
      })
    );
    expect(result.current).toBe(0);
  });

  it("calculates basic catch probability with Poké Ball at full HP", () => {
    const { result } = renderHook(() =>
      useCatchProbability({
        selectedPokemon: mockPokemon,
        targetHpPercentage: 100,
        statusCondition: "None",
        ballType: "Poké Ball", // 1x multiplier
        dreamBallTurns: 0,
        targetLevel: 5,
        turnsPassed: 1,
        repeatBallCaptures: 0,
        isNightOrCave: false,
      })
    );
    // Rough calculation should be around ~5-6% for 45 base rate at full HP with standard ball
    expect(result.current).toBeGreaterThan(0);
    expect(result.current).toBeLessThan(100);
  });

  it("guarantees 100% catch rate when Master Ball check applies", () => {
    // Quick Ball on turn 1 with base rate >= 154 triggers Master Ball logic
    const pidgeyMock = { ...mockPokemon, catchRate: 255 };
    const { result } = renderHook(() =>
      useCatchProbability({
        selectedPokemon: pidgeyMock,
        targetHpPercentage: 100,
        statusCondition: "None",
        ballType: "Quick Ball",
        dreamBallTurns: 0,
        targetLevel: 5,
        turnsPassed: 1, // Turn 1 triggers 255 multiplier if rate >= 154
        repeatBallCaptures: 0,
        isNightOrCave: false,
      })
    );
    expect(result.current).toBe(100);
  });

  it("increases probability when HP decreases", () => {
    const { result: fullHp } = renderHook(() =>
      useCatchProbability({
        selectedPokemon: mockPokemon,
        targetHpPercentage: 100,
        statusCondition: "None",
        ballType: "Poké Ball",
        dreamBallTurns: 0,
        targetLevel: 5,
        turnsPassed: 1,
        repeatBallCaptures: 0,
        isNightOrCave: false,
      })
    );

    const { result: lowHp } = renderHook(() =>
      useCatchProbability({
        selectedPokemon: mockPokemon,
        targetHpPercentage: 10, // 10% HP
        statusCondition: "None",
        ballType: "Poké Ball",
        dreamBallTurns: 0,
        targetLevel: 5,
        turnsPassed: 1,
        repeatBallCaptures: 0,
        isNightOrCave: false,
      })
    );

    expect(lowHp.current).toBeGreaterThan(fullHp.current);
  });

  it("increases probability with status conditions", () => {
    const { result: normal } = renderHook(() =>
      useCatchProbability({
        selectedPokemon: mockPokemon,
        targetHpPercentage: 50,
        statusCondition: "None",
        ballType: "Poké Ball",
        dreamBallTurns: 0,
        targetLevel: 5,
        turnsPassed: 1,
        repeatBallCaptures: 0,
        isNightOrCave: false,
      })
    );

    const { result: sleeping } = renderHook(() =>
      useCatchProbability({
        selectedPokemon: mockPokemon,
        targetHpPercentage: 50,
        statusCondition: "Asleep", // Multiplier is applied
        ballType: "Poké Ball",
        dreamBallTurns: 0,
        targetLevel: 5,
        turnsPassed: 1,
        repeatBallCaptures: 0,
        isNightOrCave: false,
      })
    );

    expect(sleeping.current).toBeGreaterThan(normal.current);
  });
});
