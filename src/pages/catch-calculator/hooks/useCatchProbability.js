import { useMemo } from "react";

import { BALL_TYPES, STATUS_CONDITIONS } from "../data/calculatorConstants";

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
        // Drops by 0.2 per level until 1x
        const drop = (targetLevel - 16) * 0.2;
        ballMult = Math.max(1, 4 - drop);
      }
    }

    // Timer Ball Custom Logic
    if (ballType === "Timer Ball") {
      // 1 + (turns * 0.3), max 4
      ballMult = Math.min(4, 1 + (turnsPassed - 1) * 0.3);
    }

    // Repeat Ball Custom Logic
    if (ballType === "Repeat Ball") {
      // 1 + (repeatBallCaptures * 0.1), max 2.5
      ballMult = Math.min(2.5, 1 + repeatBallCaptures * 0.1);
    }

    // Quick Ball Custom Logic (Corrected)
    if (ballType === "Quick Ball") {
      if (turnsPassed === 1) {
        if (baseCatchRate >= 154) {
          ballMult = 255; // Guaranteed catch
        } else {
          ballMult = 5; // 5x multiplier
        }
      } else {
        ballMult = 1; // After first turn, it's 1x
      }
    }

    const statusMult =
      STATUS_CONDITIONS.find((s) => s.name === statusCondition)?.multiplier ||
      1;

    // Master Ball Check
    if (ballMult === 255) return 100;

    // Calculation Formula
    // x = (((max_hp * 3 - current_hp * 2) * base_rate * ball_rate) / (max_hp * 3)) * status_rate
    const x =
      (((maxHp * 3 - currentHp * 2) * rate * ballMult) / (maxHp * 3)) *
      statusMult;

    if (x > 255) {
      return 100;
    }

    if (x <= 0) return 0;

    // y = 65536 / sqrt(sqrt(255 / x))
    const y = 65536 / Math.sqrt(Math.sqrt(255 / x));

    // Final Catch Rate = ((y / 65536) ^ 4) * 100%
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
