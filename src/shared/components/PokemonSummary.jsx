import { Fragment, useEffect, useState } from "react";

import { typeBackgrounds } from "@/shared/utils/pokemonColors";
import {
  getPokemonBackground,
  getPokemonCardData,
  getPokemonVariants,
} from "@/shared/utils/pokemonHelpers";
import { calculateDefenses } from "@/shared/utils/typeUtils";

const getTypePillStyle = (typeName) => {
  const backgroundStyle = typeBackgrounds[typeName] || typeBackgrounds[""];
  return { background: backgroundStyle };
};

const PokemonSummary = ({ pokemon, allPokemon, onClose, onSelectPokemon }) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [moveSearch, setMoveSearch] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!pokemon) return null;

  // Prepare data
  const background = getPokemonBackground(pokemon);
  const cardData = getPokemonCardData(pokemon);
  const sprite = cardData.sprite;

  const variants = getPokemonVariants(pokemon.name, allPokemon).filter(
    (v) => v !== pokemon.name
  );

  const defenses = pokemon.types ? calculateDefenses(pokemon.types) : null;

  const filteredMoves = (() => {
    if (!pokemon.moves) return [];
    if (!moveSearch) return pokemon.moves;
    return pokemon.moves.filter((m) =>
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

  const tabs = ["Overview", "Stats", "Moves", "Locations", "Evolutions"];

  return (
    <div
      className="fixed inset-0 z-[2000] flex animate-[fade-in_0.3s_ease-out_forwards] items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex h-[85vh] w-full max-w-[480px] animate-[scale-in_0.4s_ease-out_forwards] flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="z-10 flex shrink-0 items-center justify-between p-4 text-white shadow-md"
          style={{ background }}
        >
          <h2 className="flex items-center gap-2 text-xl font-bold drop-shadow-md">
            <span className="rounded-md bg-black/30 px-2 py-1 font-mono text-sm">
              {formatPokedexId(pokemon.id)}
            </span>
            {pokemon.name}
          </h2>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-2xl text-white transition-colors hover:bg-black/50"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative flex shrink-0 flex-col items-center border-b border-slate-700 bg-neutral-900 p-5">
          <button className="absolute top-4 right-4 rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-blue-500 hover:text-white">
            🔊 Cry
          </button>
          <img
            className="mb-4 h-40 w-40 animate-[float_6s_infinite] object-contain drop-shadow-xl"
            src={sprite}
            alt={pokemon.name}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              {pokemon.types?.map((t) => (
                <span
                  key={t}
                  className="rounded-full px-4 py-1.5 text-xs font-bold tracking-wide text-white uppercase shadow-sm"
                  style={getTypePillStyle(t)}
                >
                  {t}
                </span>
              ))}
            </div>
            <span className="text-sm font-medium text-slate-400 italic">
              {pokemon.category}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="scrollbar-hide z-10 flex shrink-0 overflow-x-auto border-b border-slate-700 bg-slate-900">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`relative min-w-[80px] flex-1 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-slate-800 text-blue-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-500 after:content-['']"
                  : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto bg-slate-800 p-5">
          <div
            className="flex flex-col gap-5"
            style={{ display: activeTab === "Overview" ? "flex" : "none" }}
          >
            <div className="flex flex-col gap-2.5">
              <p className="m-0 rounded-lg border-l-4 border-blue-500 bg-slate-700 p-3 text-sm leading-relaxed text-slate-200 italic">
                {pokemon.description}
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <h4 className="border-b border-slate-700 pb-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
                Abilities
              </h4>
              <div className="flex gap-2.5">
                {pokemon.abilities?.main?.map((a) => (
                  <div
                    key={a}
                    className="flex-1 rounded-md border border-slate-700 bg-neutral-900 p-2 text-center text-sm text-slate-200"
                  >
                    {a}
                  </div>
                ))}
                {pokemon.abilities?.hidden && (
                  <div className="flex-1 rounded-md border border-red-500/50 bg-red-900/10 p-2 text-center text-sm text-slate-200">
                    {pokemon.abilities.hidden}{" "}
                    <small className="mt-0.5 block text-[10px] text-slate-500">
                      Hidden
                    </small>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <h4 className="border-b border-slate-700 pb-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
                Breeding & Size
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <InfoCard label="Height" value={pokemon.height} />
                <InfoCard label="Weight" value={pokemon.weight} />
                <InfoCard
                  label="Egg Group"
                  value={pokemon.eggGroups?.join(", ")}
                />
                <div className="flex flex-col justify-center rounded-lg border border-slate-600 bg-slate-700 p-2.5">
                  <span className="mb-1 text-[10px] font-bold text-slate-400 uppercase">
                    Gender
                  </span>
                  <span className="flex gap-2 text-sm font-semibold text-white">
                    <span className="text-blue-400">
                      {pokemon.genderRatio?.m}% ♂
                    </span>
                    <span className="text-orange-400">
                      {pokemon.genderRatio?.f}% ♀
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <h4 className="border-b border-slate-700 pb-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
                Training
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <InfoCard label="Catch Rate" value={pokemon.catchRate} />
                <InfoCard label="Base Exp" value={pokemon.baseExp} />
                <InfoCard label="Growth Rate" value={pokemon.growthRate} />
                <InfoCard
                  label="EV Yield"
                  value={pokemon.evYield}
                  valueClass="text-yellow-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 flex flex-row items-center justify-between rounded-lg border border-slate-600 bg-slate-700 p-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Held Item
                  </span>
                  <span className="rounded bg-blue-500/10 px-2 py-0.5 text-sm font-bold text-blue-400">
                    {Array.isArray(pokemon.heldItems) &&
                    pokemon.heldItems.length > 0
                      ? pokemon.heldItems.join(", ")
                      : "None"}
                  </span>
                </div>
                <div className="col-span-2 flex flex-row items-center justify-between rounded-lg border border-slate-600 bg-slate-700 p-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    PvP Tier
                  </span>
                  <span className="rounded bg-blue-500/10 px-2 py-0.5 text-sm font-bold text-blue-400">
                    {pokemon.tier}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex flex-col gap-5"
            style={{ display: activeTab === "Stats" ? "flex" : "none" }}
          >
            <div className="flex flex-col gap-2.5">
              <h4 className="border-b border-slate-700 pb-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
                Base Stats
              </h4>
              {pokemon.baseStats &&
                ((statOrder) => {
                  return statOrder.map((key) => {
                    const val = pokemon.baseStats[key];
                    if (val === undefined) return null; // Skip if stat doesn't exist
                    return (
                      <div key={key} className="mb-1 flex items-center">
                        <span className="w-10 text-xs font-bold text-slate-400 uppercase">
                          {key}
                        </span>
                        <span className="mr-2.5 w-9 text-right text-sm font-bold text-white">
                          {val}
                        </span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-900">
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
                    );
                  });
                })(["hp", "atk", "def", "spa", "spd", "spe"])}
            </div>

            <div className="mt-5 flex flex-col gap-2.5">
              <h4 className="border-b border-slate-700 pb-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
                Weakness & Resistance
              </h4>
              {!defenses ? (
                <p className="p-5 text-center text-slate-500 italic">
                  Type data not available.
                </p>
              ) : (
                <div className="flex flex-col gap-2 rounded-lg border border-slate-600 bg-slate-700 p-3">
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
                          className={`w-9 shrink-0 text-right text-sm font-bold ${colorClass}`}
                        >
                          {label}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {types.map((t) => (
                            <span
                              key={t}
                              className="rounded-full px-2.5 py-0.5 text-[10px] text-white shadow-none"
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
          </div>

          <div
            className="flex flex-col gap-5"
            style={{ display: activeTab === "Moves" ? "flex" : "none" }}
          >
            <div className="flex flex-col gap-2.5">
              <div className="mb-2 flex items-center justify-between border-b border-slate-700 pb-2">
                <h4 className="m-0 border-none p-0 text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Level Up Moves
                </h4>
                <input
                  type="text"
                  className="w-44 rounded-md border border-slate-700 bg-neutral-900 px-3 py-1.5 text-sm text-slate-200 transition-all outline-none placeholder:text-slate-600 placeholder:italic focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Search move..."
                  value={moveSearch}
                  onChange={(e) => setMoveSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-col overflow-hidden rounded-lg border border-slate-700 bg-neutral-800">
                <div className="sticky top-0 z-[1] flex border-b border-slate-700 bg-slate-700 p-2.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  <span className="w-10 text-center">LVL</span>
                  <span className="flex-1 pl-3">MOVE</span>
                  <span className="w-12 text-center">CAT</span>
                  <span className="w-10 text-center">PWR</span>
                  <span className="w-11 text-right">ACC</span>
                </div>
                {filteredMoves.length > 0 ? (
                  filteredMoves.map((move, i) => (
                    <div
                      key={i}
                      className="flex items-center border-b border-slate-700/50 p-2 transition-colors last:border-b-0 hover:bg-slate-700/50"
                    >
                      <div className="w-10 text-center">
                        <span className="font-mono text-sm font-bold text-slate-500 group-hover:text-white">
                          {move.level}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col justify-center gap-0.5 pl-3">
                        <span className="text-sm leading-tight font-semibold text-slate-200">
                          {move.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase opacity-80 type-text-${move.type?.toLowerCase()}`}
                        >
                          {move.type}
                        </span>
                      </div>
                      <div className="flex w-12 justify-center">
                        <span
                          className={`w-10 rounded-sm py-0.5 text-center text-[9px] font-bold text-neutral-900 uppercase ${
                            move.cat === "Physical"
                              ? "bg-orange-400"
                              : move.cat === "Special"
                                ? "bg-sky-400"
                                : "bg-neutral-400"
                          }`}
                        >
                          {move.cat?.substring(0, 4)}
                        </span>
                      </div>
                      <div className="w-10 text-center text-sm text-slate-300">
                        {move.pwr}
                      </div>
                      <div className="w-11 text-right text-sm text-slate-300">
                        {move.acc}%
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-5 text-center text-sm text-slate-500 italic">
                    No moves found.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className="flex flex-col gap-5"
            style={{ display: activeTab === "Locations" ? "flex" : "none" }}
          >
            <div className="flex flex-col gap-2.5">
              <h4 className="border-b border-slate-700 pb-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
                Wild Locations
              </h4>
              {pokemon.locations && pokemon.locations.length > 0 ? (
                <div className="flex flex-col overflow-hidden rounded-lg border border-slate-700 bg-neutral-800">
                  <div className="flex border-b border-slate-700 bg-slate-700 p-2.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    <span className="w-[70px] text-center">Method</span>
                    <span className="w-[70px] text-center">Region</span>
                    <span className="flex-1 text-center">Location</span>
                    <span className="w-[70px] text-center">Levels</span>
                    <span className="w-[70px] text-center">Rarity</span>
                  </div>
                  {pokemon.locations.map((loc, i) => (
                    <div
                      key={i}
                      className="flex items-center border-b border-slate-700/50 p-2 transition-colors last:border-b-0 hover:bg-slate-700/50"
                    >
                      <span className="mx-auto w-[58px] shrink-0 truncate rounded bg-white/10 px-1.5 py-1 text-center text-xs text-slate-300 capitalize">
                        {loc.method || loc.type || "-"}
                      </span>
                      <span className="w-[70px] text-center text-sm font-semibold text-slate-200">
                        {loc.region}
                      </span>
                      <span className="flex-1 text-center text-sm font-medium text-slate-200">
                        {loc.area}
                      </span>
                      <span className="w-[70px] text-center text-sm font-semibold text-slate-200">
                        {loc.levels}
                      </span>
                      <span className="w-[70px] text-center text-xs font-bold text-amber-500 uppercase">
                        {loc.rarity}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-5 text-center text-slate-500 italic">
                  No wild locations found.
                </p>
              )}
            </div>
          </div>

          <div
            className="flex flex-col gap-5"
            style={{ display: activeTab === "Evolutions" ? "flex" : "none" }}
          >
            <div className="flex flex-col gap-5">
              {variants.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <h4 className="border-b border-slate-700 pb-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
                    Alternative Forms
                  </h4>
                  <div className="scrollbar-thin scrollbar-thumb-slate-700 flex items-center gap-0.5 overflow-x-auto rounded-lg border border-slate-700 bg-neutral-900 p-4">
                    {variants.map((variantName) => {
                      // Lookup variant in allPokemon
                      const variantObj = allPokemon.find(
                        (p) => p.name === variantName
                      );
                      if (!variantObj) return null;
                      const variantCardData = getPokemonCardData(variantObj);

                      return (
                        <div
                          key={variantName}
                          className="flex min-w-[80px] flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border border-transparent p-1.5 transition-all hover:-translate-y-0.5 hover:border-blue-500 hover:bg-slate-700"
                          onClick={() => onSelectPokemon(variantObj)}
                        >
                          <div className="mb-1.5 flex h-16 w-16 items-center justify-center rounded-full border border-neutral-800 bg-black/20">
                            <img
                              src={variantCardData.sprite}
                              alt={variantName}
                              className="h-12 w-12 object-contain"
                            />
                          </div>
                          <span className="text-center text-sm font-bold whitespace-nowrap text-white">
                            {variantName}
                          </span>
                          <span className="mt-0.5 text-center text-xs text-slate-500">
                            Variant
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                <h4 className="border-b border-slate-700 pb-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Evolution Tree
                </h4>
                {pokemon.evolutions && pokemon.evolutions.length > 0 ? (
                  <div className="scrollbar-thin scrollbar-thumb-slate-700 flex items-center justify-center gap-0.5 overflow-x-auto rounded-lg border border-slate-700 bg-neutral-900 p-4">
                    {pokemon.evolutions.map((evo, index) => {
                      const evoObj = allPokemon.find(
                        (p) => p.name === evo.name
                      );
                      if (!evoObj) return null; // Add this null guard
                      const evoCardData = getPokemonCardData(evoObj);

                      return (
                        <Fragment key={evo.name}>
                          <div
                            className="flex min-w-[80px] flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border border-transparent p-1.5 transition-all hover:-translate-y-0.5 hover:border-blue-500 hover:bg-slate-700"
                            onClick={() => evoObj && onSelectPokemon(evoObj)}
                          >
                            <div className="mb-1.5 flex h-16 w-16 items-center justify-center rounded-full border border-neutral-800 bg-black/20">
                              <img
                                src={evoCardData.sprite}
                                alt={evo.name}
                                className="h-12 w-12 object-contain"
                              />
                            </div>
                            <span className="text-center text-sm font-bold whitespace-nowrap text-white">
                              {evo.name}
                            </span>
                            <span className="mt-0.5 text-center text-xs text-slate-500">
                              {evo.level}
                            </span>
                          </div>
                          {index < pokemon.evolutions.length - 1 && (
                            <div className="mx-0.5 shrink-0 text-lg font-bold text-blue-500 opacity-80">
                              ➜
                            </div>
                          )}
                        </Fragment>
                      );
                    })}
                  </div>
                ) : (
                  <p className="p-5 text-center text-slate-500 italic">
                    Evolution data not available.
                  </p>
                )}
              </div>
            </div>
          </div>
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
    className={`flex flex-col justify-center rounded-lg border border-slate-600 bg-slate-700 p-2.5 ${className}`}
  >
    <span
      className={`mb-1 text-[10px] font-bold text-slate-400 uppercase ${labelClass}`}
    >
      {label}
    </span>
    <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
  </div>
);

export default PokemonSummary;
