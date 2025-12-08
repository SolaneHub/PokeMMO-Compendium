import { ChevronDown, Search, Trophy, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { getPokemonCardData } from "@/pages/pokedex/data/pokemonService";
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
  { name: "Poké Ball", multiplier: 1, image: "poké-ball.png" },
  { name: "Great Ball", multiplier: 1.5, image: "great-ball.png" },
  { name: "Ultra Ball", multiplier: 2, image: "ultra-ball.png" },
  { name: "Premier Ball", multiplier: 1.5, image: "premier-ball.png" },
  { name: "Dive Ball", multiplier: 1, image: "dive-ball.png" },
  { name: "Dream Ball", multiplier: 1, image: "dream-ball.png" },
  { name: "Dusk Ball", multiplier: 1, image: "dusk-ball.png" },
  { name: "Fast Ball", multiplier: 1, image: "fast-ball.png" },
  { name: "Heal Ball", multiplier: 1.25, image: "heal-ball.png" },
  { name: "Heavy Ball", multiplier: 1, image: "heavy-ball.png" },
  { name: "Level Ball", multiplier: 1, image: "level-ball.png" },
  { name: "Love Ball", multiplier: 1, image: "love-ball.png" },
  { name: "Lure Ball", multiplier: 1, image: "lure-ball.png" },
  { name: "Luxury Ball", multiplier: 1, image: "luxury-ball.png" },
  { name: "Moon Ball", multiplier: 1, image: "moon-ball.png" },
  { name: "Nest Ball", multiplier: 1, image: "nest-ball.png" },
  { name: "Net Ball", multiplier: 1, image: "net-ball.png" },
  { name: "Quick Ball", multiplier: 5, image: "quick-ball.png" },
  { name: "Repeat Ball", multiplier: 1, image: "repeat-ball.png" },
  { name: "Timer Ball", multiplier: 1, image: "timer-ball.png" },
  { name: "Cherish Ball", multiplier: 2, image: "cherish-ball.png" },
  { name: "Master Ball", multiplier: 255, image: "master-ball.png" },
];

const getBallImage = (filename) => {
  if (filename === "master-ball.png") return `${import.meta.env.BASE_URL}${filename}`;
  return `${import.meta.env.BASE_URL}items/${filename}`;
};

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
      <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden border border-slate-600 shadow-inner">
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
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

const LevelSlider = ({ value, onChange }) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm font-bold text-slate-300">
        <span>Level</span>
        <span>{value}</span>
      </div>
      <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden border border-slate-600 shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-200"
          style={{ width: `${value}%` }}
        />
        <input
          type="range"
          min="1"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

const TurnsSlider = ({ value, onChange }) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm font-bold text-slate-300">
        <span>Turns Passed</span>
        <span>{value}</span>
      </div>
      <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden border border-slate-600 shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-200"
          style={{ width: `${(value / 15) * 100}%` }}
        />
        <input
          type="range"
          min="0"
          max="15"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
    <div className="relative w-full z-30" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-[#15161a] border border-slate-700 hover:border-slate-500 rounded-xl p-3 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0f1013] flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
            <img
              src={getBallImage(currentBall?.image)}
              alt={selectedBall}
              className="w-8 h-8 object-contain"
            />
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e2025] border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 border-b border-slate-700">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Find a ball..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#15161a] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-700">
            {filteredBalls.map((ball) => (
              <button
                key={ball.name}
                onClick={() => {
                  onSelect(ball.name);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  selectedBall === ball.name
                    ? "bg-blue-600/20 text-blue-400"
                    : "hover:bg-white/5 text-slate-300"
                }`}
              >
                <img
                  src={getBallImage(ball.image)}
                  alt={ball.name}
                  className="w-6 h-6 object-contain"
                />
                <span className="text-sm font-medium">{ball.name}</span>
                <span className="ml-auto text-xs text-slate-500 bg-black/20 px-1.5 py-0.5 rounded">
                  x{ball.multiplier}
                </span>
              </button>
            ))}
            {filteredBalls.length === 0 && (
              <div className="p-4 text-center text-slate-500 text-sm">
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
      <div className="flex flex-col items-center mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Trophy className="text-yellow-400" size={32} />
          Catch Calculator
        </h1>
        <p className="text-slate-400">Optimize your capture strategy.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* --- COLUMN 1: TARGET POKEMON --- */}
        <div className="bg-[#1e2025] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
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
              className="w-full bg-[#15161a] border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {/* Dropdown List */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-[#15161a] border border-slate-700 rounded-lg shadow-xl z-50 scrollbar-thin scrollbar-thumb-slate-700">
                {filteredPokemon.slice(0, 50).map((p) => (
                  <button
                    key={p.name}
                    onClick={() => {
                      setSelectedPokemonName(p.name);
                      setSearchTerm(p.name); // Optional: Set text to name
                      setIsSearchOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex justify-between items-center
                    ${
                      selectedPokemonName === p.name
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }
                  `}
                  >
                    <span>{p.name}</span>
                    <span className="text-xs opacity-50 bg-black/30 px-1.5 py-0.5 rounded">
                      CR: {p.catchRate}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Preview */}
          {selectedPokemon && (
            <div className="flex flex-col items-center bg-[#15161a] rounded-xl p-6 border border-white/5 relative overflow-hidden flex-grow justify-center min-h-[200px]">
              {/* Background Glow */}
              <div
                className="absolute inset-0 opacity-20 blur-xl transition-colors duration-500"
                style={{ background: background }}
              />
              <img
                src={sprite}
                alt={selectedPokemonName}
                className="w-32 h-32 object-contain relative z-10 drop-shadow-md rendering-pixelated"
              />
              <h3 className="text-xl font-bold text-white relative z-10 mt-2">
                {selectedPokemonName}
              </h3>
              <div className="text-xs font-mono text-slate-400 mt-1 bg-black/40 px-2 py-1 rounded relative z-10">
                Base Rate:{" "}
                <span className="text-yellow-400">{baseCatchRate}</span>
              </div>
            </div>
          )}
        </div>
        {/* --- COLUMN 2: CONDITIONS --- */}
        <div className="bg-[#1e2025] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col gap-8">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
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
                  className={`
                        px-3 py-3 rounded-lg text-sm font-bold transition-all border-2
                        ${
                          statusCondition === status.name
                            ? "border-white text-white shadow-lg scale-105 text-shadow-sm"
                            : "bg-[#15161a] border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800"
                        }
                      `}
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
        <div className="bg-[#1e2025] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
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
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
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
                <div className="grid grid-cols-4 gap-1 p-1 bg-[#15161a] border border-slate-700 rounded-lg">
                  {[0, 1, 2, 3].map((turn) => (
                    <button
                      key={turn}
                      onClick={() => setDreamBallTurns(turn)}
                      className={`
                              py-1.5 rounded text-xs font-bold transition-all
                              ${
                                dreamBallTurns === turn
                                  ? "bg-pink-600 text-white shadow-sm"
                                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                              }
                           `}
                    >
                      {turn === 3 ? "3+" : turn}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Nest Ball Special Logic */}
            {ballType === "Nest Ball" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-2">
                <LevelSlider value={targetLevel} onChange={setTargetLevel} />
                <p className="text-xs text-slate-500 mt-2 text-center">
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
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-2">
                <TurnsSlider value={turnsPassed} onChange={setTurnsPassed} />
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Current:{" "}
                  <span className="text-orange-400">
                    x{Math.min(4, 1 + (turnsPassed - 1) * 0.3).toFixed(1)}
                  </span>{" "}
                  Rate
                  {turnsPassed >= 10 && " (Maxed)"}
                </p>
              </div>
            )}
          </div>

          {/* Result Display - Now more prominent and pushed up by spacing */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="bg-[#15161a] border border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 relative overflow-hidden group hover:border-slate-600 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-500/10 pointer-events-none" />

              <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
                Probability
              </span>
              <span
                className={`text-6xl font-black transition-colors duration-300 ${catchProbability >= 100 ? "text-green-400" : catchProbability > 50 ? "text-blue-400" : catchProbability > 20 ? "text-yellow-400" : "text-red-400"}`}
              >
                {catchProbability.toFixed(1)}%
              </span>

              {catchProbability >= 100 ? (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/50">
                  Guaranteed
                </span>
              ) : (
                <div className="text-center space-y-1">
                  <p className="text-sm text-slate-400 font-medium">
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
