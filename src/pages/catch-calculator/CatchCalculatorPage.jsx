import { ChevronDown, Search, Trophy, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { getPokemonCardData } from "@/pages/pokedex/data/pokemonService";
import ItemImage from "@/shared/components/ItemImage";
import PageTitle from "@/shared/components/PageTitle";
import { usePokedexData } from "@/shared/hooks/usePokedexData";
import { typeBackgrounds } from "@/shared/utils/pokemonColors";

// --- Constants & Config ---

const STATUS_CONDITIONS = [
  { name: "None", gradient: typeBackgrounds[""], multiplier: 1 },
  { name: "Poisoned", gradient: typeBackgrounds["Poison"], multiplier: 1.5 },
  { name: "Burned", gradient: typeBackgrounds["Fire"], multiplier: 1.5 },
  { name: "Paralyzed", gradient: typeBackgrounds["Electric"], multiplier: 1.5 },
  { name: "Asleep", gradient: typeBackgrounds["Psychic"], multiplier: 2.5 },
  { name: "Frozen", gradient: typeBackgrounds["Ice"], multiplier: 2.5 },
];

const BALL_TYPES = [
  { name: "Poké Ball", multiplier: 1 },
  { name: "Great Ball", multiplier: 1.5 },
  { name: "Ultra Ball", multiplier: 2 },
  { name: "Premier Ball", multiplier: 1.5 },
  { name: "Dive Ball", multiplier: 1 },
  { name: "Dream Ball", multiplier: 1 },
  { name: "Dusk Ball", multiplier: 1 },
  { name: "Fast Ball", multiplier: 1 },
  { name: "Heal Ball", multiplier: 1.25 },
  { name: "Heavy Ball", multiplier: 1 },
  { name: "Level Ball", multiplier: 1 },
  { name: "Love Ball", multiplier: 1 },
  { name: "Lure Ball", multiplier: 1 },
  { name: "Luxury Ball", multiplier: 1 },
  { name: "Moon Ball", multiplier: 1 },
  { name: "Nest Ball", multiplier: 1 },
  { name: "Net Ball", multiplier: 1 },
  { name: "Quick Ball", multiplier: 1 },
  { name: "Repeat Ball", multiplier: 1 },
  { name: "Timer Ball", multiplier: 1 },
  { name: "Cherish Ball", multiplier: 2 },
  { name: "Master Ball", multiplier: 255 },
];

// --- Components ---

const HpBarSlider = ({ value, onChange }) => {
  let colorClass = "bg-green-500";
  if (value < 20) colorClass = "bg-red-500";
  else if (value < 50) colorClass = "bg-yellow-400";

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm font-bold text-slate-300">
        <span>HP Remaining</span>
        <span>{value}%</span>
      </div>
      <div className="relative h-6 overflow-hidden rounded-full border border-slate-600 bg-slate-800 shadow-inner">
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-200 ${colorClass}`}
          style={{ width: `${value}%` }}
        />
        <input
          type="range"
          min="1"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
};

const LevelSlider = ({ value, onChange }) => {
  const maxLevel = 31;
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm font-bold text-slate-300">
        <span>Level</span>
        <span>{value >= maxLevel ? `${maxLevel}+` : value}</span>
      </div>
      <div className="relative h-6 overflow-hidden rounded-full border border-slate-600 bg-slate-800 shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-200"
          style={{ width: `${Math.min(100, (value / maxLevel) * 100)}%` }}
        />
        <input
          type="range"
          min="1"
          max={maxLevel}
          value={Math.min(value, maxLevel)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
};

const TurnsSlider = ({ value, onChange }) => {
  const maxTurns = 11;
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm font-bold text-slate-300">
        <span>Turns Passed</span>
        <span>{value >= maxTurns ? `${maxTurns}+` : value}</span>
      </div>
      <div className="relative h-6 overflow-hidden rounded-full border border-slate-600 bg-slate-800 shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-200"
          style={{ width: `${Math.min(100, (value / maxTurns) * 100)}%` }}
        />
        <input
          type="range"
          min="1"
          max={maxTurns}
          value={Math.min(value, maxTurns)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
};

const RepeatCapturesSlider = ({ value, onChange }) => {
  const maxCaptures = 15;
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm font-bold text-slate-300">
        <span>Previous Captures</span>
        <span>{value >= maxCaptures ? `${maxCaptures}+` : value}</span>
      </div>
      <div className="relative h-6 overflow-hidden rounded-full border border-slate-600 bg-slate-800 shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-purple-500 transition-all duration-200"
          style={{ width: `${Math.min(100, (value / maxCaptures) * 100)}%` }}
        />
        <input
          type="range"
          min="0"
          max={maxCaptures}
          value={Math.min(value, maxCaptures)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
};

const BallSelector = ({ selectedBall, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentBall = BALL_TYPES.find((b) => b.name === selectedBall);
  const filteredBalls = BALL_TYPES.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative z-30 w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex w-full items-center justify-between rounded-xl border border-slate-700 bg-[#15161a] p-3 transition-all hover:border-slate-500"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-[#0f1013] transition-colors group-hover:border-white/10">
            <ItemImage item={selectedBall} className="h-8 w-8 object-contain" />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold text-slate-200">{selectedBall}</span>
            <span className="text-xs text-slate-500">
              x{currentBall?.multiplier} rate
            </span>
          </div>
        </div>
        <ChevronDown
          className={`text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="animate-in fade-in zoom-in-95 absolute top-full right-0 left-0 mt-2 overflow-hidden rounded-xl border border-slate-700 bg-[#1e2025] shadow-2xl duration-100">
          <div className="border-b border-slate-700 p-2">
            <div className="relative">
              <Search
                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Find a ball..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#15161a] py-2 pr-3 pl-9 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
                autoFocus
              />
            </div>
          </div>
          <div className="scrollbar-thin scrollbar-thumb-slate-700 max-h-60 overflow-y-auto p-1">
            {filteredBalls.map((ball) => (
              <button
                key={ball.name}
                onClick={() => {
                  onSelect(ball.name);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`flex w-full items-center gap-3 rounded-lg p-2 transition-colors ${
                  selectedBall === ball.name
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <ItemImage
                  item={ball.name}
                  className="h-6 w-6 object-contain"
                />
                <span className="text-sm font-medium">{ball.name}</span>
                <span className="ml-auto rounded bg-black/20 px-1.5 py-0.5 text-xs text-slate-500">
                  x{ball.multiplier}
                </span>
              </button>
            ))}
            {filteredBalls.length === 0 && (
              <div className="p-4 text-center text-sm text-slate-500">
                No balls found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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
        // Keep search open if interacting with it, logic handled by onFocus/Blur usually but simpler here
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -- Derived Data --

  // Filter Pokémon
  const filteredPokemon = (() => {
    if (!allPokemonData) return [];
    if (!searchTerm) return allPokemonData;
    return allPokemonData.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  })();

  // Selected Pokémon Stats
  const selectedPokemon = allPokemonData?.find(
    (p) => p.name === selectedPokemonName
  );
  const baseCatchRate = selectedPokemon ? selectedPokemon.catchRate : 0;
  const { sprite, background } = getPokemonCardData(selectedPokemonName);

  // Calculation Logic
  const catchProbability = (() => {
    if (!selectedPokemon) return 0;

    // Constants
    const maxHp = 100; // Simplified
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
  })();

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
                      setSearchTerm(p.name); // Optional: Set text to name
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

          {/* Result Display - Now more prominent and pushed up by spacing */}
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
