import { Activity, Fragment, useEffect, useState } from "react";

import { getPokemonFullDetails } from "@/pages/pokedex/data/pokemonService";
import { getPokemonCardData } from "@/pages/pokedex/data/pokemonService";
import { typeBackgrounds } from "@/shared/utils/pokemonColors";
import { calculateDefenses } from "@/shared/utils/typeUtils";

const initialLoadingState = { name: null, id: null };

const getTypePillStyle = (typeName) => {
  const backgroundStyle = typeBackgrounds[typeName] || typeBackgrounds[""];
  return { background: backgroundStyle };
};

const PokemonSummary = ({ pokemonName, onClose, onSelectPokemon }) => {
  const [prevName, setPrevName] = useState(pokemonName);
  const [activeTab, setActiveTab] = useState("Overview");
  const [pokemonData, setPokemonData] = useState(initialLoadingState);
  const [moveSearch, setMoveSearch] = useState("");

  if (pokemonName !== prevName) {
    setPrevName(pokemonName);
    setActiveTab("Overview");
    setMoveSearch("");
    setPokemonData(initialLoadingState);
  }

  const tabs = ["Overview", "Stats", "Moves", "Locations", "Evolutions"];

  useEffect(() => {
    if (!pokemonName) return;

    const timer = setTimeout(() => {
      const data = getPokemonFullDetails(pokemonName);
      setPokemonData(data);
    }, 50);

    return () => clearTimeout(timer);
  }, [pokemonName]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const defenses =
    pokemonData && pokemonData.types
      ? calculateDefenses(pokemonData.types)
      : null;

  const filteredMoves = (() => {
    if (!pokemonData || !pokemonData.moves) return [];
    if (!moveSearch) return pokemonData.moves;
    return pokemonData.moves.filter((m) =>
      m.name.toLowerCase().includes(moveSearch.toLowerCase())
    );
  })();

  const getTypesByMultiplier = (mult) => {
    if (!defenses) return [];
    return Object.entries(defenses)
      .filter(([, val]) => val === mult)
      .map(([type]) => type);
  };

  const formatPokedexId = (id) => {
    if (id && (typeof id === "number" || !isNaN(Number(id)))) {
      return `#${String(id).padStart(3, "0")}`;
    }
    return "???";
  };

  if (pokemonData.name === null) {
    return (
      <div
        className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 backdrop-blur-sm animate-[fade-in_0.3s_ease-out_forwards]"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-[480px] h-[85vh] flex items-center justify-center bg-slate-800 rounded-xl border border-slate-700 shadow-2xl animate-[scale-in_0.4s_ease-out_forwards]"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-center text-blue-400 animate-pulse">
            Loading details for {pokemonName}...
          </p>
        </div>
      </div>
    );
  }

  if (pokemonData.id === null) {
    return (
      <div
        className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 backdrop-blur-sm animate-[fade-in_0.3s_ease-out_forwards]"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-[480px] h-[85vh] flex flex-col bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden animate-[scale-in_0.4s_ease-out_forwards]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 bg-slate-700 text-white shadow-sm z-10">
            <h2 className="text-xl font-bold">Pokémon Not Available</h2>
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full bg-black/20 text-white hover:bg-black/50 transition-colors"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 text-center">
            <p className="text-lg">
              Full details for **{pokemonData.name}** are not available yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 backdrop-blur-sm animate-[fade-in_0.3s_ease-out_forwards]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[480px] h-[85vh] flex flex-col bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden animate-[scale-in_0.4s_ease-out_forwards]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 text-white shadow-md z-10 shrink-0"
          style={{ background: pokemonData.background }}
        >
          <h2 className="flex items-center gap-2 text-xl font-bold drop-shadow-md">
            <span className="bg-black/30 px-2 py-1 rounded-md font-mono text-sm">
              {formatPokedexId(pokemonData.id)}
            </span>
            {pokemonData.name}
          </h2>
          <button
            className="flex items-center justify-center w-8 h-8 rounded-full bg-black/20 text-white hover:bg-black/50 transition-colors text-2xl"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative flex flex-col items-center p-5 bg-neutral-900 border-b border-slate-700 shrink-0">
          <button className="absolute top-4 right-4 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-slate-300 text-xs font-semibold hover:border-blue-500 hover:text-white transition-colors">
            🔊 Cry
          </button>
          <img
            className="w-40 h-40 object-contain mb-4 drop-shadow-xl animate-[bounce_6s_infinite]"
            src={pokemonData.sprite}
            alt={pokemonData.name}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              {pokemonData.types.map((t) => (
                <span
                  key={t}
                  className="px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wide shadow-sm"
                  style={getTypePillStyle(t)}
                >
                  {t}
                </span>
              ))}
            </div>
            <span className="text-slate-400 text-sm italic font-medium">
              {pokemonData.category}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex shrink-0 overflow-x-auto bg-slate-900 border-b border-slate-700 z-10 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`flex-1 min-w-[80px] py-3.5 text-sm font-semibold whitespace-nowrap transition-colors relative
                ${
                  activeTab === tab
                    ? "bg-slate-800 text-blue-500 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-500"
                    : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="flex-1 flex flex-col gap-5 p-5 bg-slate-800 overflow-y-auto min-h-0">
          <Activity mode={activeTab === "Overview" ? "visible" : "hidden"}>
            <div className="flex flex-col gap-2.5">
              <p className="bg-slate-700 border-l-4 border-blue-500 rounded-lg text-slate-200 text-sm italic leading-relaxed p-3 m-0">
                {pokemonData.description}
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-700 pb-1">
                Abilities
              </h4>
              <div className="flex gap-2.5">
                {pokemonData.abilities.main.map((a) => (
                  <div
                    key={a}
                    className="flex-1 bg-neutral-900 border border-slate-700 rounded-md text-slate-200 text-sm p-2 text-center"
                  >
                    {a}
                  </div>
                ))}
                {pokemonData.abilities.hidden && (
                  <div className="flex-1 bg-red-900/10 border border-red-500/50 rounded-md text-slate-200 text-sm p-2 text-center">
                    {pokemonData.abilities.hidden}{" "}
                    <small className="block text-slate-500 text-[10px] mt-0.5">
                      Hidden
                    </small>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-700 pb-1">
                Breeding & Size
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <InfoCard label="Height" value={pokemonData.height} />
                <InfoCard label="Weight" value={pokemonData.weight} />
                <InfoCard
                  label="Egg Group"
                  value={pokemonData.eggGroups.join(", ")}
                />
                <div className="bg-slate-700 border border-slate-600 rounded-lg flex flex-col justify-center p-2.5">
                  <span className="text-slate-400 text-[10px] font-bold uppercase mb-1">
                    Gender
                  </span>
                  <span className="text-white text-sm font-semibold flex gap-2">
                    <span className="text-blue-400">
                      {pokemonData.genderRatio.m}% ♂
                    </span>
                    <span className="text-orange-400">
                      {pokemonData.genderRatio.f}% ♀
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-700 pb-1">
                Training
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <InfoCard label="Catch Rate" value={pokemonData.catchRate} />
                <InfoCard label="Base Exp" value={pokemonData.baseExp} />
                <InfoCard label="Growth Rate" value={pokemonData.growthRate} />
                <InfoCard
                  label="EV Yield"
                  value={pokemonData.evYield}
                  valueClass="text-yellow-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2">
                {/* Held Item - Modified to match PvP Tier style */}
                <div className="col-span-2 bg-slate-700 border border-slate-600 rounded-lg flex flex-row items-center justify-between p-2.5">
                  <span className="text-slate-400 text-[10px] font-bold uppercase">
                    Held Item
                  </span>
                  <span className="bg-blue-500/10 text-blue-400 rounded px-2 py-0.5 font-bold text-sm">
                    {Array.isArray(pokemonData.heldItems) &&
                    pokemonData.heldItems.length > 0
                      ? pokemonData.heldItems.join(", ")
                      : "None"}
                  </span>
                </div>
                {/* PvP Tier - Original */}
                <div className="col-span-2 bg-slate-700 border border-slate-600 rounded-lg flex flex-row items-center justify-between p-2.5">
                  <span className="text-slate-400 text-[10px] font-bold uppercase">
                    PvP Tier
                  </span>
                  <span className="bg-blue-500/10 text-blue-400 rounded px-2 py-0.5 font-bold text-sm">
                    {pokemonData.tier}
                  </span>
                </div>
              </div>
            </div>
          </Activity>

          <Activity mode={activeTab === "Stats" ? "visible" : "hidden"}>
            <div className="flex flex-col gap-2.5">
              <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-700 pb-1">
                Base Stats
              </h4>
              {Object.entries(pokemonData.baseStats).map(([key, val]) => (
                <div key={key} className="flex items-center mb-1">
                  <span className="text-slate-400 text-xs font-bold w-10 uppercase">
                    {key}
                  </span>
                  <span className="text-white text-sm font-bold text-right w-9 mr-2.5">
                    {val}
                  </span>
                  <div className="flex-1 h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((val / 255) * 100, 100)}%`,
                        background:
                          val > 100
                            ? "#00b894"
                            : val > 60
                              ? "#007bff"
                              : "#ff7675",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2.5 mt-5">
              <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-700 pb-1">
                Weakness & Resistance
              </h4>
              {!defenses ? (
                <p className="text-slate-500 italic p-5 text-center">
                  Type data not available.
                </p>
              ) : (
                <div className="flex flex-col gap-2 bg-slate-700 border border-slate-600 rounded-lg p-3">
                  {[4, 2, 0.5, 0.25, 0].map((mult) => {
                    const types = getTypesByMultiplier(mult);
                    if (types.length === 0) return null;
                    const label = mult === 0.25 ? "¼x" : `${mult}x`;
                    const colorClass =
                      mult > 1
                        ? "text-red-400"
                        : mult === 0
                          ? "text-purple-400"
                          : "text-emerald-400";

                    return (
                      <div key={mult} className="flex items-center gap-3">
                        <span
                          className={`shrink-0 text-sm font-bold text-right w-9 ${colorClass}`}
                        >
                          {label}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {types.map((t) => (
                            <span
                              key={t}
                              className="rounded-full text-white text-[10px] px-2.5 py-0.5 shadow-none"
                              style={getTypePillStyle(t)}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Activity>

          <Activity mode={activeTab === "Moves" ? "visible" : "hidden"}>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
                <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest m-0 p-0 border-none">
                  Level Up Moves
                </h4>
                <input
                  type="text"
                  className="bg-neutral-900 border border-slate-700 rounded-md text-slate-200 text-sm px-3 py-1.5 w-44 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600 placeholder:italic"
                  placeholder="Search move..."
                  value={moveSearch}
                  onChange={(e) => setMoveSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-col bg-neutral-800 border border-slate-700 rounded-lg overflow-hidden">
                <div className="flex bg-slate-700 border-b border-slate-700 text-slate-400 text-[10px] font-bold tracking-wider p-2.5 uppercase sticky top-0 z-[1]">
                  <span className="text-center w-10">LVL</span>
                  <span className="flex-1 pl-3">MOVE</span>
                  <span className="text-center w-12">CAT</span>
                  <span className="text-center w-10">PWR</span>
                  <span className="text-right w-11">ACC</span>
                </div>
                {filteredMoves.length > 0 ? (
                  filteredMoves.map((move, i) => (
                    <div
                      key={i}
                      className="flex items-center p-2 border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors last:border-b-0"
                    >
                      <div className="text-center w-10">
                        <span className="text-slate-500 font-mono text-sm font-bold group-hover:text-white">
                          {move.level}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col justify-center pl-3 gap-0.5">
                        <span className="text-slate-200 text-sm font-semibold leading-tight">
                          {move.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase opacity-80 type-text-${move.type.toLowerCase()}`}
                        >
                          {move.type}
                        </span>
                      </div>
                      <div className="flex justify-center w-12">
                        <span
                          className={`rounded-sm text-neutral-900 text-[9px] font-bold py-0.5 text-center uppercase w-10 ${
                            move.cat === "Physical"
                              ? "bg-orange-400"
                              : move.cat === "Special"
                                ? "bg-sky-400"
                                : "bg-neutral-400"
                          }`}
                        >
                          {move.cat.substring(0, 4)}
                        </span>
                      </div>
                      <div className="text-slate-300 text-sm text-center w-10">
                        {move.pwr}
                      </div>
                      <div className="text-slate-300 text-sm text-right w-11">
                        {move.acc}%
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 text-sm italic p-5 text-center">
                    No moves found.
                  </div>
                )}
              </div>
            </div>
          </Activity>

          <Activity mode={activeTab === "Locations" ? "visible" : "hidden"}>
            <div className="flex flex-col gap-2.5">
              <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-700 pb-1">
                Wild Locations
              </h4>
              {pokemonData.locations.length > 0 ? (
                <div className="flex flex-col bg-neutral-800 border border-slate-700 rounded-lg overflow-hidden">
                  <div className="flex bg-slate-700 border-b border-slate-700 text-slate-400 text-[10px] font-bold tracking-wider p-2.5 uppercase">
                    <span className="text-center w-[70px]">Method</span>
                    <span className="text-center w-[70px]">Region</span>
                    <span className="flex-1 text-center">Location</span>
                    <span className="text-center w-[70px]">Levels</span>
                    <span className="text-center w-[70px]">Rarity</span>
                  </div>
                  {pokemonData.locations.map((loc, i) => (
                    <div
                      key={i}
                      className="flex items-center p-2 border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors last:border-b-0"
                    >
                      <span className="shrink-0 bg-white/10 rounded text-slate-300 text-xs px-1.5 py-1 text-center w-[58px] mx-auto truncate capitalize">
                        {loc.method || loc.type || "-"}
                      </span>
                      <span className="text-slate-200 text-sm font-semibold text-center w-[70px]">
                        {loc.region}
                      </span>
                      <span className="flex-1 text-slate-200 text-sm font-medium text-center">
                        {loc.area}
                      </span>
                      <span className="text-slate-200 text-sm font-semibold text-center w-[70px]">
                        {loc.levels}
                      </span>
                      <span className="text-amber-500 text-xs font-bold uppercase text-center w-[70px]">
                        {loc.rarity}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic p-5 text-center">
                  No wild locations found.
                </p>
              )}
            </div>
          </Activity>

          <Activity mode={activeTab === "Evolutions" ? "visible" : "hidden"}>
            <div className="flex flex-col gap-5">
              {pokemonData.variants.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-700 pb-1">
                    Alternative Forms
                  </h4>
                  <div className="flex items-center bg-neutral-900 border border-slate-700 rounded-lg overflow-x-auto p-4 gap-0.5 scrollbar-thin scrollbar-thumb-slate-700">
                    {pokemonData.variants.map((variantName) => {
                      const variantCardData = getPokemonCardData(variantName);
                      return (
                        <div
                          key={variantName}
                          className="flex flex-1 flex-col items-center justify-center min-w-[80px] p-1.5 rounded-lg border border-transparent transition-all cursor-pointer hover:bg-slate-700 hover:border-blue-500 hover:-translate-y-0.5"
                          onClick={() => onSelectPokemon(variantName)}
                        >
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-black/20 border border-neutral-800 mb-1.5">
                            <img
                              src={variantCardData.sprite}
                              alt={variantName}
                              className="w-12 h-12 object-contain"
                            />
                          </div>
                          <span className="text-white text-sm font-bold text-center whitespace-nowrap">
                            {variantName}
                          </span>
                          <span className="text-slate-500 text-xs mt-0.5 text-center">
                            Variant
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-700 pb-1">
                  Evolution Tree
                </h4>
                {pokemonData.evolutions.length > 0 ? (
                  <div className="flex items-center justify-center bg-neutral-900 border border-slate-700 rounded-lg overflow-x-auto p-4 gap-0.5 scrollbar-thin scrollbar-thumb-slate-700">
                    {pokemonData.evolutions.map((evo, index) => {
                      const evoCardData = getPokemonCardData(evo.name);
                      return (
                        <Fragment key={evo.name}>
                          <div
                            className="flex flex-1 flex-col items-center justify-center min-w-[80px] p-1.5 rounded-lg border border-transparent transition-all cursor-pointer hover:bg-slate-700 hover:border-blue-500 hover:-translate-y-0.5"
                            onClick={() => onSelectPokemon(evo.name)}
                          >
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-black/20 border border-neutral-800 mb-1.5">
                              <img
                                src={evoCardData.sprite}
                                alt={evo.name}
                                className="w-12 h-12 object-contain"
                              />
                            </div>
                            <span className="text-white text-sm font-bold text-center whitespace-nowrap">
                              {evo.name}
                            </span>
                            <span className="text-slate-500 text-xs mt-0.5 text-center">
                              {evo.level}
                            </span>
                          </div>
                          {index < pokemonData.evolutions.length - 1 && (
                            <div className="shrink-0 text-blue-500 text-lg font-bold mx-0.5 opacity-80">
                              ➜
                            </div>
                          )}
                        </Fragment>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 italic p-5 text-center">
                    Evolution data not available.
                  </p>
                )}
              </div>
            </div>
          </Activity>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({
  label,
  value,
  className = "",
  labelClass = "",
  valueClass = "text-white",
}) => (
  <div
    className={`bg-slate-700 border border-slate-600 rounded-lg flex flex-col justify-center p-2.5 ${className}`}
  >
    <span
      className={`text-slate-400 text-[10px] font-bold uppercase mb-1 ${labelClass}`}
    >
      {label}
    </span>
    <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
  </div>
);

export default PokemonSummary;
