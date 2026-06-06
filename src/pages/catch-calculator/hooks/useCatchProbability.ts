import { useMemo } from "react";

import { BALL_TYPES, STATUS_CONDITIONS } from "@/constants/calculatorConstants";
import { Pokemon } from "@/types/pokemon";

interface CatchProbabilityProps {
  selectedPokemon: Pokemon | null;
  targetHpPercentage: number;
  statusCondition: string;
  ballType: string;
  dreamBallTurns: number;
  targetLevel: number;
  turnsPassed: number;
  repeatBallCaptures: number;
  isNightOrCave: boolean;
}

const getNestBallMultiplier = (level: number) => {
  if (level <= 16) return 4;
  return Math.max(1, 4 - (level - 16) * 0.2);
};

const getDreamBallMultiplier = (turns: number) => {
  if (turns >= 3) return 4;
  if (turns === 2) return 2.5;
  if (turns === 1) return 1.5;
  return 1;
};

/**
 * Helper to calculate the specific multiplier for each Poke Ball type.
 * Extracted and decomposed to reduce cognitive complexity.
 */
const calculateBallMultiplier = (props: {
  ballType: string;
  isNightOrCave: boolean;
  baseSpeed: number;
  dreamBallTurns: number;
  targetLevel: number;
  turnsPassed: number;
  repeatBallCaptures: number;
  baseCatchRate: number;
}): number => {
  const {
    ballType,
    isNightOrCave,
    baseSpeed,
    dreamBallTurns,
    targetLevel,
    turnsPassed,
    repeatBallCaptures,
    baseCatchRate,
  } = props;

  // Base multiplier from constants
  const baseMult = BALL_TYPES.find((b) => b.name === ballType)?.multiplier || 1;

  switch (ballType) {
    case "Dusk Ball":
      return isNightOrCave ? 2.5 : 1;
    case "Fast Ball":
      return baseSpeed >= 100 ? 4 : 1;
    case "Dream Ball":
      return getDreamBallMultiplier(dreamBallTurns);
    case "Nest Ball":
      return getNestBallMultiplier(targetLevel);
    case "Timer Ball":
      return Math.min(4, 1 + (turnsPassed - 1) * 0.3);
    case "Repeat Ball":
      return Math.min(2.5, 1 + repeatBallCaptures * 0.1);
    case "Quick Ball":
      if (turnsPassed === 1) {
        return baseCatchRate >= 154 ? 255 : 5;
      }
      return 1;
    default:
      return baseMult;
  }
};

export function useCatchProbability({
  selectedPokemon,
  targetHpPercentage,
  statusCondition,
  ballType,
  dreamBallTurns,
  targetLevel,
  turnsPassed,
  repeatBallCaptures,
  isNightOrCave,
}: CatchProbabilityProps) {
  return useMemo(() => {
    if (selectedPokemon?.catchRate == null) return 0;

    const baseCatchRate =
      typeof selectedPokemon.catchRate === "string"
        ? Number.parseInt(selectedPokemon.catchRate, 10)
        : selectedPokemon.catchRate;

    if (Number.isNaN(baseCatchRate)) return 0;

    const maxHp = 100;
    const currentHp = maxHp * (targetHpPercentage / 100);

    const ballMult = calculateBallMultiplier({
      ballType,
      isNightOrCave,
      baseSpeed: selectedPokemon.baseStats.spe || 0,
      dreamBallTurns,
      targetLevel,
      turnsPassed,
      repeatBallCaptures,
      baseCatchRate,
    });

    const statusMult =
      STATUS_CONDITIONS.find((s) => s.name === statusCondition)?.multiplier ||
      1;

    // Master Ball Check
    if (ballMult === 255) return 100;

    // Formula
    const x =
      (((maxHp * 3 - currentHp * 2) * baseCatchRate * ballMult) / (maxHp * 3)) *
      statusMult;

    if (x > 255) return 100;
    if (x <= 0) return 0;

    // Final Catch Rate logic
    const y = 65536 / Math.sqrt(Math.sqrt(255 / x));
    const finalCatchRate = Math.pow(y / 65536, 4) * 100;

    return Math.min(finalCatchRate, 100);
  }, [
    selectedPokemon,
    targetHpPercentage,
    statusCondition,
    ballType,
    dreamBallTurns,
    targetLevel,
    turnsPassed,
    repeatBallCaptures,
    isNightOrCave,
  ]);
}
