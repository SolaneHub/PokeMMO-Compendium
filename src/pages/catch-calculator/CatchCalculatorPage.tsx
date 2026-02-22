import { Search, Trophy, Zap } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

import Slider from "@/components/atoms/Slider";
import BallSelector from "@/components/molecules/BallSelector";
import PageLayout from "@/components/templates/PageLayout";
import { STATUS_CONDITIONS } from "@/constants/calculatorConstants";
import { useCatchProbability } from "@/hooks/useCatchProbability";
import { usePokedexData } from "@/hooks/usePokedexData";
import { getPokemonCardData } from "@/services/pokemonService";
import { Pokemon } from "@/types/pokemon";
import { FEATURE_CONFIG } from "@/utils/featureConfig";
import { usePersistentState } from "@/utils/usePersistentState";

const CatchCalculatorPage = () => {
  const accentColor = FEATURE_CONFIG["catch-calculator"].color;
  const { allPokemonData, pokemonMap, isLoading } = usePokedexData();

  const [targetHpPercentage, setTargetHpPercentage] = usePersistentState(
    "calc_hp",
    100
  );
  const [statusCondition, setStatusCondition] = usePersistentState(
    "calc_status",
    "None"
  );
  const [ballType, setBallType] = usePersistentState("calc_ball", "Poké Ball");
  const [dreamBallTurns, setDreamBallTurns] = usePersistentState(
    "calc_dream_turns",
    0
  );
  const [targetLevel, setTargetLevel] = usePersistentState("calc_level", 50);
  const [turnsPassed, setTurnsPassed] = usePersistentState("calc_turns", 1);
  const [repeatBallCaptures, setRepeatBallCaptures] = usePersistentState(
    "calc_repeat_captures",
    0
  );
  const [selectedPokemonName, setSelectedPokemonName] = usePersistentState(
    "calc_pokemon",
    "Bulbasaur"
  );
  const [isNightOrCave, setIsNightOrCave] = usePersistentState(
    "calc_night_cave",
    false
  );

  useEffect(() => {
    if (!selectedPokemonName && allPokemonData && allPokemonData.length > 0) {
      setSelectedPokemonName(allPokemonData[0].name);
    }
  }, [allPokemonData, selectedPokemonName, setSelectedPokemonName]);

  const selectedPokemon = (pokemonMap.get(selectedPokemonName) ||
    null) as Pokemon | null;

  useEffect(() => {
    if (selectedPokemon && selectedPokemon.locations) {
      const isCavePokemon = selectedPokemon.locations.some(
        (loc) => loc.method && loc.method.toLowerCase().includes("cave")
      );
      if (isCavePokemon) {
        setIsNightOrCave(true);
      }
    }
  }, [selectedPokemon, setIsNightOrCave]);

  const [searchTerm, setSearchTerm] = useState("");
  const [deferredSearchTerm, setDeferredSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  const searchRef = useRef<HTMLDivElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPokemon = (() => {
    if (isLoading) return [];
    if (!deferredSearchTerm) return allPokemonData;
    return allPokemonData.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(deferredSearchTerm.toLowerCase())
    );
  })();

  const baseCatchRateRaw = selectedPokemon ? selectedPokemon.catchRate : 0;
  const baseCatchRate =
    typeof baseCatchRateRaw === "string"
      ? parseInt(baseCatchRateRaw, 10)
      : baseCatchRateRaw || 0;

  const { sprite, background } = getPokemonCardData(
    selectedPokemonName,
    pokemonMap
  );

  const catchProbability = useCatchProbability({
    selectedPokemon,
    targetHpPercentage,
    statusCondition,
    ballType,
    dreamBallTurns,
    targetLevel,
    turnsPassed,
    repeatBallCaptures,
    isNightOrCave,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        <p>Loading Pokémon data...</p>
      </div>
    );
  }

  return (
    <PageLayout title="Catch Calculator" accentColor={accentColor}>
      {/* Header */}
      <div className="mb-8 flex flex-col items-center space-y-2 text-center text-white">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <Trophy style={{ color: accentColor }} size={32} />
          Catch Calculator
        </h1>
        <p className="text-slate-400">Optimize your capture strategy.</p>
      </div>

      <div className="mx-auto grid w-full max-w-400 grid-cols-1 gap-6 text-white lg:grid-cols-3">
        {/* --- COLUMN 1: TARGET POKEMON --- */}
        <div className="flex flex-col gap-6 rounded-2xl border border-white/5 bg-[#1a1b20] p-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <Search className="text-blue-400" size={20} />
            <h2 className="text-lg font-bold text-slate-200">Target</h2>
          </div>

          {/* Search */}
          <div className="h-22">
            <label className="mb-3 block text-sm font-bold text-slate-500">
              Search Pokémon
            </label>
            <div className="relative z-20" ref={searchRef}>
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  startTransition(() => {
                    setDeferredSearchTerm(value);
                  });
                  setIsSearchOpen(true);
                }}
                className="w-full rounded-lg border border-white/5 bg-[#0f1014] px-4 py-3 text-slate-200 transition-colors placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
              {isSearchOpen && (
                <div
                  className={`scrollbar-thin scrollbar-thumb-slate-700 absolute top-full right-0 left-0 z-50 mt-2 max-h-48 overflow-y-auto rounded-lg border border-white/5 bg-[#0f1014] shadow-xl transition-opacity duration-200 ${
                    isPending ? "opacity-50" : "opacity-100"
                  }`}
                >
                  {filteredPokemon.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => {
                        setSelectedPokemonName(p.name);
                        setSearchTerm(p.name);
                        setDeferredSearchTerm(p.name);
                        setIsSearchOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                        selectedPokemonName === p.name
                          ? "bg-blue-600/20 text-blue-400"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                      } `}
                    >
                      <span>{p.name}</span>
                      <span className="rounded bg-black/30 px-1.5 py-0.5 text-xs opacity-50">
                        CR: {p.catchRate}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Preview */}
          {selectedPokemon && (
            <div className="relative flex min-h-50 grow flex-col items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-[#0f1014] p-6">
              <div
                className="absolute inset-0 opacity-20 blur-xl transition-colors duration-500"
                style={{ background: background }}
              />
              <img
                src={sprite || ""}
                alt={selectedPokemonName}
                className="rendering-pixelated relative z-10 h-32 w-32 object-contain drop-shadow-md"
              />
              <h3 className="relative z-10 mt-2 text-xl font-bold text-slate-100">
                {selectedPokemonName}
              </h3>
              <div className="relative z-10 mt-1 rounded bg-black/40 px-2 py-1 font-mono text-xs text-slate-400">
                Base Rate:{" "}
                <span className="text-yellow-400">{baseCatchRate}</span>
              </div>
            </div>
          )}
        </div>

        {/* --- COLUMN 2: CONDITIONS --- */}
        <div className="flex flex-col gap-6 rounded-2xl border border-white/5 bg-[#1a1b20] p-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <Zap className="text-yellow-400" size={20} />
            <h2 className="text-lg font-bold text-slate-200">Conditions</h2>
          </div>

          {/* HP Slider */}
          <Slider
            label={`Remaining HP: ${targetHpPercentage}%`}
            value={targetHpPercentage}
            onChange={setTargetHpPercentage}
            min={1}
            max={100}
            colorClass={
              targetHpPercentage > 50
                ? "bg-green-500"
                : targetHpPercentage > 20
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }
          />

          {/* Status Conditions */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-500">
              Status Condition
            </label>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
              {STATUS_CONDITIONS.map((status) => (
                <button
                  key={status.name}
                  onClick={() => setStatusCondition(status.name)}
                  style={{
                    background:
                      statusCondition === status.name
                        ? status.gradient
                        : undefined,
                  }}
                  className={`rounded-lg border-2 px-3 py-3 text-sm font-bold transition-all ${
                    statusCondition === status.name
                      ? "scale-105 border-white text-white shadow-lg text-shadow-sm"
                      : "border-white/5 bg-[#0f1014] text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-slate-200"
                  } `}
                >
                  <span
                    className={
                      statusCondition === status.name ? "drop-shadow-md" : ""
                    }
                  >
                    {status.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- COLUMN 3: CAPTURE --- */}
        <div className="flex flex-col gap-6 rounded-2xl border border-white/5 bg-[#1a1b20] p-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <Trophy className="text-green-400" size={20} />
            <h2 className="text-lg font-bold text-slate-200">Capture</h2>
          </div>

          {/* Ball Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-500">
              Select Poké Ball
            </label>
            <BallSelector selectedBall={ballType} onSelect={setBallType} />

            {/* Fast Ball Special Logic */}
            {ballType === "Fast Ball" && (
              <div className="animate-fade-in space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Base Speed</span>
                  <span className="text-blue-400">
                    {selectedPokemon?.baseStats.spe || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Multiplier</span>
                  <span
                    className={
                      (selectedPokemon?.baseStats.spe || 0) >= 100
                        ? "text-green-400"
                        : "text-slate-400"
                    }
                  >
                    {(selectedPokemon?.baseStats.spe || 0) >= 100 ? "4x" : "1x"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  4x rate if base Speed is 100 or more.
                </p>
              </div>
            )}

            {/* Dream Ball Special Logic */}
            {ballType === "Dream Ball" && (
              <div className="animate-fade-in space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Turns Asleep</span>
                  <span className="text-blue-400">
                    {dreamBallTurns >= 3
                      ? "4x"
                      : dreamBallTurns === 2
                        ? "2.5x"
                        : dreamBallTurns === 1
                          ? "1.5x"
                          : "1x"}{" "}
                    Rate
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 rounded-lg border border-white/5 bg-[#0f1014] p-1">
                  {[0, 1, 2, 3].map((turn) => (
                    <button
                      key={turn}
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
            )}

            {/* Nest Ball Special Logic */}
            {ballType === "Nest Ball" && (
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
                  {targetLevel <= 16
                    ? "Max Rate (4x)"
                    : targetLevel >= 31
                      ? "Base Rate (1x)"
                      : "Reduced Rate"}
                </p>
              </div>
            )}

            {/* Timer Ball Special Logic */}
            {ballType === "Timer Ball" && (
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
            )}

            {/* Repeat Ball Special Logic */}
            {ballType === "Repeat Ball" && (
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
            )}

            {/* Quick Ball Special Logic */}
            {ballType === "Quick Ball" && (
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
            )}

            {/* Dusk Ball Special Logic */}
            {ballType === "Dusk Ball" && (
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
            )}
          </div>

          {/* Result Display */}
          <div className="flex flex-1 flex-col justify-center">
            <div className="group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/5 bg-[#0f1014] p-8 transition-colors hover:border-white/10">
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent to-green-500/10" />

              <span className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
                Probability
              </span>
              <span
                className={`text-6xl font-black transition-colors duration-300 ${catchProbability >= 100 ? "text-green-400" : catchProbability > 50 ? "text-blue-400" : catchProbability > 20 ? "text-yellow-400" : "text-red-400"}`}
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
                    {catchProbability < 1
                      ? "Don't give up!"
                      : catchProbability > 50
                        ? "It's in the bag!"
                        : "Keep trying!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CatchCalculatorPage;
