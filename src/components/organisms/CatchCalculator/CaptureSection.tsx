import { Trophy } from "lucide-react";
import React from "react";

import Slider from "@/components/atoms/Slider";
import BallSelector from "@/components/molecules/BallSelector";
import { Pokemon } from "@/types/pokemon";

interface CaptureSectionProps {
  ballType: string;
  setBallType: (val: string) => void;
  selectedPokemon: Pokemon | null;
  dreamBallTurns: number;
  setDreamBallTurns: (val: number) => void;
  targetLevel: number;
  setTargetLevel: (val: number) => void;
  turnsPassed: number;
  setTurnsPassed: (val: number) => void;
  repeatBallCaptures: number;
  setRepeatBallCaptures: (val: number) => void;
  isNightOrCave: boolean;
  setIsNightOrCave: (val: boolean) => void;
  baseCatchRate: number;
  catchProbability: number;
  getProbabilityColor: (prob: number) => string;
  getProbabilityMessage: (prob: number) => string;
}

interface BallOptionsProps {
  selectedPokemon: Pokemon | null;
  dreamBallTurns: number;
  setDreamBallTurns: (val: number) => void;
  targetLevel: number;
  setTargetLevel: (val: number) => void;
  turnsPassed: number;
  setTurnsPassed: (val: number) => void;
  repeatBallCaptures: number;
  setRepeatBallCaptures: (val: number) => void;
  isNightOrCave: boolean;
  setIsNightOrCave: (val: boolean) => void;
  baseCatchRate: number;
}

const FastBallOptions = ({
  selectedPokemon,
}: Pick<BallOptionsProps, "selectedPokemon">) => {
  const speed = selectedPokemon?.baseStats.spe || 0;
  const multiplier = speed >= 100 ? "4x" : "1x";
  return (
    <div className="animate-fade-in space-y-2 pt-2">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>Base Speed</span>
        <span className="text-blue-400">{speed}</span>
      </div>
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>Multiplier</span>
        <span className={speed >= 100 ? "text-green-400" : "text-slate-400"}>
          {multiplier}
        </span>
      </div>
      <p className="text-[10px] text-slate-500">
        4x rate if base Speed is 100 or more.
      </p>
    </div>
  );
};

const DreamBallOptions = ({
  dreamBallTurns,
  setDreamBallTurns,
}: Pick<BallOptionsProps, "dreamBallTurns" | "setDreamBallTurns">) => {
  const getMultiplier = (turns: number) => {
    if (turns >= 3) return "4x";
    if (turns === 2) return "2.5x";
    if (turns === 1) return "1.5x";
    return "1x";
  };

  return (
    <div className="animate-fade-in space-y-2 pt-2">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>Turns Asleep</span>
        <span className="text-blue-400">
          {getMultiplier(dreamBallTurns)} Rate
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1 rounded-lg border border-white/5 bg-[#0f1014] p-1">
        {[0, 1, 2, 3].map((turn) => (
          <button
            key={turn}
            type="button"
            onClick={() => setDreamBallTurns(turn)}
            className={`rounded py-1.5 text-xs font-bold transition-all ${
              dreamBallTurns === turn
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
            } `}
          >
            {turn === 3 ? "3+" : turn}
          </button>
        ))}
      </div>
    </div>
  );
};

const NestBallOptions = ({
  targetLevel,
  setTargetLevel,
}: Pick<BallOptionsProps, "targetLevel" | "setTargetLevel">) => {
  const getLabel = (level: number) => {
    if (level <= 16) return "Max Rate (4x)";
    if (level >= 31) return "Base Rate (1x)";
    return "Reduced Rate";
  };

  return (
    <div className="animate-fade-in pt-2">
      <Slider
        label="Target Level"
        value={targetLevel}
        onChange={setTargetLevel}
        min={1}
        max={100}
        displayValue={`Lv. ${targetLevel}`}
      />
      <p className="mt-2 text-center text-xs text-slate-500">
        {getLabel(targetLevel)}
      </p>
    </div>
  );
};

const TimerBallOptions = ({
  turnsPassed,
  setTurnsPassed,
}: Pick<BallOptionsProps, "turnsPassed" | "setTurnsPassed">) => (
  <div className="animate-fade-in pt-2">
    <Slider
      label="Turns Passed"
      value={turnsPassed}
      onChange={setTurnsPassed}
      min={1}
      max={11}
      displayValue={`Turn ${turnsPassed}`}
    />
    <p className="mt-2 text-center text-xs text-slate-500">
      Current:{" "}
      <span className="text-orange-400">
        x{Math.min(4, 1 + (turnsPassed - 1) * 0.3).toFixed(1)}
      </span>{" "}
      Rate
    </p>
  </div>
);

const RepeatBallOptions = ({
  repeatBallCaptures,
  setRepeatBallCaptures,
}: Pick<BallOptionsProps, "repeatBallCaptures" | "setRepeatBallCaptures">) => (
  <div className="animate-fade-in pt-2">
    <Slider
      label="Times Caught"
      value={repeatBallCaptures}
      onChange={setRepeatBallCaptures}
      min={0}
      max={15}
      displayValue={`${repeatBallCaptures} captures`}
      colorClass="bg-purple-500"
    />
    <p className="mt-2 text-center text-xs text-slate-500">
      Current:{" "}
      <span className="text-purple-400">
        x{Math.min(2.5, 1 + repeatBallCaptures * 0.1).toFixed(1)}
      </span>{" "}
      Rate
    </p>
  </div>
);

const QuickBallOptions = ({
  turnsPassed,
  setTurnsPassed,
  baseCatchRate,
}: Pick<
  BallOptionsProps,
  "turnsPassed" | "setTurnsPassed" | "baseCatchRate"
>) => (
  <div className="animate-fade-in space-y-2 pt-2">
    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
      <span>Combat Turn</span>
      <span className="text-blue-400">
        {turnsPassed === 1
          ? baseCatchRate >= 154
            ? "Guaranteed"
            : "5x Rate"
          : "1x Rate"}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-1 rounded-lg border border-white/5 bg-[#0f1014] p-1">
      {[1, 2].map((turn) => (
        <button
          key={turn}
          type="button"
          onClick={() => setTurnsPassed(turn)}
          className={`rounded py-1.5 text-xs font-bold transition-all ${
            turnsPassed === turn
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
          } `}
        >
          {turn === 1 ? "First Turn" : "Later Turns"}
        </button>
      ))}
    </div>
  </div>
);

const DuskBallOptions = ({
  isNightOrCave,
  setIsNightOrCave,
}: Pick<BallOptionsProps, "isNightOrCave" | "setIsNightOrCave">) => (
  <div className="animate-fade-in space-y-2 pt-2">
    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
      <span>Environment</span>
      <span className="text-blue-400">
        {isNightOrCave ? "2.5x Rate" : "1x Rate"}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-1 rounded-lg border border-white/5 bg-[#0f1014] p-1">
      {[
        { label: "Day", value: false },
        { label: "Night/Cave", value: true },
      ].map((opt) => (
        <button
          key={opt.label}
          type="button"
          onClick={() => setIsNightOrCave(opt.value)}
          className={`rounded py-1.5 text-xs font-bold transition-all ${
            isNightOrCave === opt.value
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
          } `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

const BallSpecificOptions = (
  props: BallOptionsProps & { ballType: string }
) => {
  const { ballType } = props;
  switch (ballType) {
    case "Fast Ball":
      return <FastBallOptions selectedPokemon={props.selectedPokemon} />;
    case "Dream Ball":
      return (
        <DreamBallOptions
          dreamBallTurns={props.dreamBallTurns}
          setDreamBallTurns={props.setDreamBallTurns}
        />
      );
    case "Nest Ball":
      return (
        <NestBallOptions
          targetLevel={props.targetLevel}
          setTargetLevel={props.setTargetLevel}
        />
      );
    case "Timer Ball":
      return (
        <TimerBallOptions
          turnsPassed={props.turnsPassed}
          setTurnsPassed={props.setTurnsPassed}
        />
      );
    case "Repeat Ball":
      return (
        <RepeatBallOptions
          repeatBallCaptures={props.repeatBallCaptures}
          setRepeatBallCaptures={props.setRepeatBallCaptures}
        />
      );
    case "Quick Ball":
      return (
        <QuickBallOptions
          turnsPassed={props.turnsPassed}
          setTurnsPassed={props.setTurnsPassed}
          baseCatchRate={props.baseCatchRate}
        />
      );
    case "Dusk Ball":
      return (
        <DuskBallOptions
          isNightOrCave={props.isNightOrCave}
          setIsNightOrCave={props.setIsNightOrCave}
        />
      );
    default:
      return null;
  }
};

const CaptureSection = (props: CaptureSectionProps) => {
  const {
    ballType,
    setBallType,
    catchProbability,
    getProbabilityColor,
    getProbabilityMessage,
  } = props;

  const ballSelectorId = "ball-selector";

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-white/5 bg-[#1a1b20] p-6 shadow-xl">
      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
        <Trophy className="text-green-400" size={20} />
        <h2 className="text-lg font-bold text-slate-200">Capture</h2>
      </div>

      {/* Ball Selection */}
      <div className="space-y-3">
        <label
          htmlFor={ballSelectorId}
          className="block text-sm font-bold text-slate-500"
        >
          Select Poké Ball
        </label>
        <BallSelector
          id={ballSelectorId}
          selectedBall={ballType}
          onSelect={setBallType}
        />

        <BallSpecificOptions {...props} ballType={ballType} />
      </div>

      {/* Result Display */}
      <div className="flex flex-1 flex-col justify-center">
        <div className="group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/5 bg-[#0f1014] p-8 transition-colors hover:border-white/10">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent to-green-500/10" />

          <span className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
            Probability
          </span>
          <span
            className={`text-6xl font-black transition-colors duration-300 ${getProbabilityColor(
              catchProbability
            )}`}
          >
            {catchProbability.toFixed(1)}%
          </span>

          {catchProbability >= 100 ? (
            <span className="rounded-full border border-green-500/50 bg-green-500/20 px-3 py-1 text-xs font-bold text-green-400">
              Guaranteed
            </span>
          ) : (
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium text-slate-400">
                {getProbabilityMessage(catchProbability)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptureSection;
