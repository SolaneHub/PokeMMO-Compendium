import { useMemo } from "react";

import { BALL_TYPES, STATUS_CONDITIONS } from "@/constants/calculatorConstants";

export function useCatchProbability({
  selectedPokemon,
  targetHpPercentage,
  statusCondition,
  ballType,
  dreamBallTurns,
  targetLevel,
  turnsPassed,
  repeatBallCaptures,
}) {
  return useMemo(() => {
    if (!selectedPokemon) return 0;

    const baseCatchRate = selectedPokemon.catchRate;
    const maxHp = 100;
    const currentHp = maxHp * (targetHpPercentage / 100);
    const rate = baseCatchRate;

    // Multipliers
    let ballMult = BALL_TYPES.find((b) => b.name === ballType)?.multiplier || 1;

    // Dream Ball Custom Logic
    if (ballType === "Dream Ball") {
      if (dreamBallTurns === 0) ballMult = 1;
      else if (dreamBallTurns === 1) ballMult = 1.5;
      else if (dreamBallTurns === 2) ballMult = 2.5;
      else if (dreamBallTurns >= 3) ballMult = 4;
    }

    // Nest Ball Custom Logic
    if (ballType === "Nest Ball") {
      if (targetLevel <= 16) {
        ballMult = 4;
      } else {
        const drop = (targetLevel - 16) * 0.2;
        ballMult = Math.max(1, 4 - drop);
      }
    }

    // Timer Ball Custom Logic
    if (ballType === "Timer Ball") {
      ballMult = Math.min(4, 1 + (turnsPassed - 1) * 0.3);
    }

    // Repeat Ball Custom Logic
    if (ballType === "Repeat Ball") {
      ballMult = Math.min(2.5, 1 + repeatBallCaptures * 0.1);
    }

    // Quick Ball Custom Logic
    if (ballType === "Quick Ball") {
      if (turnsPassed === 1) {
        if (baseCatchRate >= 154) {
          ballMult = 255;
        } else {
          ballMult = 5;
        }
      } else {
        ballMult = 1;
      }
    }

    const statusMult =
      STATUS_CONDITIONS.find((s) => s.name === statusCondition)?.multiplier ||
      1;

    // Master Ball Check
    if (ballMult === 255) return 100;

    // Formula
    const x =
      (((maxHp * 3 - currentHp * 2) * rate * ballMult) / (maxHp * 3)) *
      statusMult;

    if (x > 255) {
      return 100;
    }
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
  ]);
}
