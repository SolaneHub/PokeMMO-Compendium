import { useMemo } from "react";

import {
  calculateCatchRate,
  CatchProbabilityProps,
} from "@/pages/catch-calculator/utils/catchRateCalculation";

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
  return useMemo(
    () =>
      calculateCatchRate({
        selectedPokemon,
        targetHpPercentage,
        statusCondition,
        ballType,
        dreamBallTurns,
        targetLevel,
        turnsPassed,
        repeatBallCaptures,
        isNightOrCave,
      }),
    [
      selectedPokemon,
      targetHpPercentage,
      statusCondition,
      ballType,
      dreamBallTurns,
      targetLevel,
      turnsPassed,
      repeatBallCaptures,
      isNightOrCave,
    ]
  );
}
