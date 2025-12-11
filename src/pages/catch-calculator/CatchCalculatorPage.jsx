import { Search, Trophy, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import BallSelector from "@/pages/catch-calculator/components/BallSelector";
import HpBarSlider from "@/pages/catch-calculator/components/HpBarSlider";
import LevelSlider from "@/pages/catch-calculator/components/LevelSlider";
import RepeatCapturesSlider from "@/pages/catch-calculator/components/RepeatCapturesSlider";
import TurnsSlider from "@/pages/catch-calculator/components/TurnsSlider";
import { STATUS_CONDITIONS } from "@/pages/catch-calculator/data/calculatorConstants";
import { useCatchProbability } from "@/pages/catch-calculator/hooks/useCatchProbability";
import { getPokemonCardData } from "@/pages/pokedex/data/pokemonService";
import PageTitle from "@/shared/components/PageTitle";
import { usePokedexData } from "@/shared/hooks/usePokedexData";

const CatchCalculatorPage = () => {
  const { allPokemonData } = usePokedexData();

  // -- State --
  const [targetHpPercentage, setTargetHpPercentage] = useState(100);
  const [statusCondition, setStatusCondition] = useState("None");
  const [ballType, setBallType] = useState("Poké Ball");
  const [dreamBallTurns, setDreamBallTurns] = useState(0);
  const [targetLevel, setTargetLevel] = useState(50);
  const [turnsPassed, setTurnsPassed] = useState(1);
  const [repeatBallCaptures, setRepeatBallCaptures] = useState(0);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPokemonName, setSelectedPokemonName] = useState(() => {
    return allPokemonData && allPokemonData.length > 0
      ? allPokemonData[0].name
      : "";
  });

  // Ref for Pokemon Search
  const searchRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -- Derived Data --
  const filteredPokemon = (() => {
    if (!allPokemonData) return [];
    if (!searchTerm) return allPokemonData;
    return allPokemonData.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  })();

  const selectedPokemon = allPokemonData?.find(
    (p) => p.name === selectedPokemonName
  );
  const baseCatchRate = selectedPokemon ? selectedPokemon.catchRate : 0;
  const { sprite, background } = getPokemonCardData(selectedPokemonName);

  const catchProbability = useCatchProbability({
    selectedPokemon,
    targetHpPercentage,
    statusCondition,
    ballType,
    dreamBallTurns,
    targetLevel,
    turnsPassed,
    repeatBallCaptures,
  });

  return (
    <div className="w-full pb-20">
      <PageTitle title="PokéMMO Compendium: Catch Calculator" />

      {/* Header */}
      <div className="mb-8 flex flex-col items-center space-y-2">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <Trophy className="text-yellow-400" size={32} />
          Catch Calculator
        </h1>
        <p className="text-slate-400">Optimize your capture strategy.</p>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3">
        {/* --- COLUMN 1: TARGET POKEMON --- */}
        <div className="flex flex-col gap-6 rounded-2xl border border-white/5 bg-[#1e2025] p-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <Search className="text-blue-400" size={20} />
            <h2 className="text-lg font-bold text-slate-200">Target</h2>
          </div>

          {/* Search */}
          <div className="relative z-20" ref={searchRef}>
            <input
              type="text"
              placeholder="Search Pokémon..."
              value={searchTerm}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearchOpen(true);
              }}
              className="w-full rounded-lg border border-slate-700 bg-[#15161a] px-4 py-3 text-slate-200 transition-colors placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
            {/* Dropdown List */}
            {isSearchOpen && (
              <div className="scrollbar-thin scrollbar-thumb-slate-700 absolute top-full right-0 left-0 z-50 mt-2 max-h-48 overflow-y-auto rounded-lg border border-slate-700 bg-[#15161a] shadow-xl">
                {filteredPokemon.slice(0, 50).map((p) => (
                  <button
                    key={p.name}
                    onClick={() => {
                      setSelectedPokemonName(p.name);
                      setSearchTerm(p.name);
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

          {/* Selected Preview */}
          {selectedPokemon && (
            <div className="relative flex min-h-[200px] flex-grow flex-col items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-[#15161a] p-6">
              {/* Background Glow */}
              <div
                className="absolute inset-0 opacity-20 blur-xl transition-colors duration-500"
                style={{ background: background }}
              />
              <img
                src={sprite}
                alt={selectedPokemonName}
                className="rendering-pixelated relative z-10 h-32 w-32 object-contain drop-shadow-md"
              />
              <h3 className="relative z-10 mt-2 text-xl font-bold text-white">
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
        <div className="flex flex-col gap-8 rounded-2xl border border-white/5 bg-[#1e2025] p-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <Zap className="text-yellow-400" size={20} />
            <h2 className="text-lg font-bold text-slate-200">Conditions</h2>
          </div>

          {/* HP Slider */}
          <HpBarSlider
            value={targetHpPercentage}
            onChange={setTargetHpPercentage}
          />

          {/* Status Conditions */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-300">
              Status Condition
            </label>
            <div className="grid grid-cols-2 gap-3">
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
                      : "border-slate-700 bg-[#15161a] text-slate-400 hover:border-slate-500 hover:bg-slate-800"
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
        <div className="flex flex-col gap-6 rounded-2xl border border-white/5 bg-[#1e2025] p-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <Trophy className="text-green-400" size={20} />
            <h2 className="text-lg font-bold text-slate-200">Capture</h2>
          </div>

          {/* Ball Selection */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-300">
              Select Poké Ball
            </label>
            <BallSelector selectedBall={ballType} onSelect={setBallType} />

            {/* Dream Ball Special Logic */}
            {ballType === "Dream Ball" && (
              <div className="animate-in fade-in slide-in-from-top-2 space-y-2 pt-2 duration-300">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Turns Asleep</span>
                  <span className="text-pink-400">
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
                <div className="grid grid-cols-4 gap-1 rounded-lg border border-slate-700 bg-[#15161a] p-1">
                  {[0, 1, 2, 3].map((turn) => (
                    <button
                      key={turn}
                      onClick={() => setDreamBallTurns(turn)}
                      className={`rounded py-1.5 text-xs font-bold transition-all ${
                        dreamBallTurns === turn
                          ? "bg-pink-600 text-white shadow-sm"
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
              <div className="animate-in fade-in slide-in-from-top-2 pt-2 duration-300">
                <LevelSlider value={targetLevel} onChange={setTargetLevel} />
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
              <div className="animate-in fade-in slide-in-from-top-2 pt-2 duration-300">
                <TurnsSlider value={turnsPassed} onChange={setTurnsPassed} />
                <p className="mt-2 text-center text-xs text-slate-500">
                  Current:{" "}
                  <span className="text-orange-400">
                    x{Math.min(4, 1 + (turnsPassed - 1) * 0.3).toFixed(1)}
                  </span>{" "}
                  Rate
                  {turnsPassed >= 11 && " (Maxed)"}
                </p>
              </div>
            )}

            {/* Repeat Ball Special Logic */}
            {ballType === "Repeat Ball" && (
              <div className="animate-in fade-in slide-in-from-top-2 pt-2 duration-300">
                <RepeatCapturesSlider
                  value={repeatBallCaptures}
                  onChange={setRepeatBallCaptures}
                />
                <p className="mt-2 text-center text-xs text-slate-500">
                  Current:{" "}
                  <span className="text-purple-400">
                    x{Math.min(2.5, 1 + repeatBallCaptures * 0.1).toFixed(1)}
                  </span>{" "}
                  Rate
                  {repeatBallCaptures >= 15 && " (Maxed)"}
                </p>
              </div>
            )}

            {/* Quick Ball Special Logic */}
            {ballType === "Quick Ball" && (
              <div className="animate-in fade-in slide-in-from-top-2 space-y-2 pt-2 duration-300">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Combat Turn</span>
                  <span className="text-blue-400">
                    {turnsPassed === 1
                      ? baseCatchRate >= 154
                        ? "Guaranteed"
                        : "5x Rate"
                      : "1x Rate"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 rounded-lg border border-slate-700 bg-[#15161a] p-1">
                  <button
                    onClick={() => setTurnsPassed(1)}
                    className={`rounded py-1.5 text-xs font-bold transition-all ${
                      turnsPassed === 1
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                    } `}
                  >
                    First Turn
                  </button>
                  <button
                    onClick={() => setTurnsPassed(2)}
                    className={`rounded py-1.5 text-xs font-bold transition-all ${
                      turnsPassed !== 1
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                    } `}
                  >
                    Later Turns
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Result Display */}
          <div className="flex flex-1 flex-col justify-center">
            <div className="group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-slate-700 bg-[#15161a] p-8 transition-colors hover:border-slate-600">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-green-500/10" />

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
    </div>
  );
};

export default CatchCalculatorPage;
