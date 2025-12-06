import { Activity, useEffect, useState } from "react";

import {
  getPokemonBackground,
  getPokemonCardData,
} from "@/pages/pokedex/data/pokemonService";
import {
  getActiveStrategy,
  getRaidByName,
  getRaidsByStars,
  getStarLevels,
} from "@/pages/raids/data/raidsService";
import PageTitle from "@/shared/components/PageTitle";
import PokemonCard from "@/shared/components/PokemonCard";
import { typeBackgrounds } from "@/shared/utils/pokemonColors";

const getItemSpriteUrl = (itemName) => {
  if (!itemName) return null;
  const formattedName = itemName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/['’]/g, "")
    .replace(/\./g, "");
  return `/PokeMMO-Compendium/items/${formattedName}.png`;
};

const BuildCard = ({ buildData }) => {
  const [activeBuild, setActiveBuild] = useState(buildData);

  const allVariants = (() => {
    if (!buildData.variants) return [buildData];
    const inheritedVariants = buildData.variants.map((variant) => ({
      ...variant,
      player: variant.player || buildData.player,
      order: variant.order || buildData.order,
      turn: variant.turn || buildData.turn,
    }));
    return [buildData, ...inheritedVariants];
  })();

  if (activeBuild.name !== buildData.name && !buildData.variants) {
    setActiveBuild(buildData);
  }

  useEffect(() => {
    setActiveBuild(buildData);
  }, [buildData]);

  const { sprite } = getPokemonCardData(activeBuild.name);

  return (
    <div className="flex flex-col bg-neutral-900 border border-slate-700 rounded-lg overflow-hidden shadow-sm hover:border-slate-500 transition-colors">
      {allVariants.length > 1 && (
        <div className="flex bg-neutral-900 border-b border-slate-700 overflow-x-auto scrollbar-hide">
          {allVariants.map((variant, idx) => (
            <button
              key={idx}
              className={`flex-1 bg-transparent border-none border-r border-slate-700 text-slate-500 cursor-pointer text-xs font-bold uppercase px-2.5 py-2 transition-colors whitespace-nowrap last:border-r-0 hover:bg-slate-800 hover:text-slate-300 ${activeBuild.name === variant.name ? "bg-slate-800 text-blue-500 shadow-[inset_0_-2px_0_#3b82f6]" : ""}`}
              onClick={() => setActiveBuild(variant)}
            >
              {variant.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between p-2.5 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <img 
            src={sprite} 
            alt={activeBuild.name} 
            className="w-10 h-10 object-contain drop-shadow-md" 
          />
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm leading-tight">{activeBuild.name}</span>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase mt-0.5">
              {activeBuild.order && (
                <span className="text-yellow-400">
                  Pokemon {activeBuild.order}
                </span>
              )}
            </div>
          </div>
        </div>

        {activeBuild.item && (
          <span className="flex items-center text-slate-300 text-xs bg-white/5 px-2 py-0.5 rounded-full border border-white/10 ml-auto">
            <img
              key={activeBuild.item}
              src={getItemSpriteUrl(activeBuild.item)}
              alt={activeBuild.item}
              className="w-5 h-5 object-contain mr-1.5"
              onError={(e) => (e.target.style.display = "none")}
            />
            {activeBuild.item}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5 bg-neutral-800 border-b border-slate-700 px-2.5 py-1.5 text-xs">
        {activeBuild.ability && (
          <span className="text-slate-400">
            Ability: <strong className="text-slate-200 ml-1">{activeBuild.ability}</strong>
          </span>
        )}
        {activeBuild.nature && (
          <span className="text-slate-400">
            Nature: <strong className="text-slate-200 ml-1">{activeBuild.nature}</strong>
          </span>
        )}
        {activeBuild.evs && (
          <span className="text-slate-400">
            EVs: <strong className="text-slate-200 ml-1">{activeBuild.evs}</strong>
          </span>
        )}
        {activeBuild.ivs && (
          <span className="text-slate-400">
            IVs: <strong className="text-slate-200 ml-1">{activeBuild.ivs}</strong>
          </span>
        )}
      </div>

      {activeBuild.moves && (
        <div className="flex flex-wrap gap-1.5 p-2.5 bg-neutral-900">
          {activeBuild.moves.map((m, k) => (
            <span key={k} className="bg-slate-800 border border-slate-700 text-slate-300 rounded px-1.5 py-0.5 text-xs">
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

function RaidsPage() {
  const [selectedStar, setSelectedStar] = useState();
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);

  const [activeTab, setActiveTab] = useState("Strategy");
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedTurnIndex, setSelectedTurnIndex] = useState(0);
  const [selectedStrategyIndex, setSelectedStrategyIndex] = useState(0);

  const [selectedBuildGroup, setSelectedBuildGroup] = useState(null);

  const tabs = ["Strategy", "Builds", "Mechanics", "Locations"];

  const starLevels = getStarLevels();
  const filteredRaids = getRaidsByStars(selectedStar);
  const currentRaid = selectedPokemon ? getRaidByName(selectedPokemon) : null;
  const activeTeamStrategy = getActiveStrategy(
    selectedPokemon,
    selectedStrategyIndex
  );

  const rolesSource = activeTeamStrategy?.roles || null;
  const recommendedList = activeTeamStrategy?.recommended || [];
  const detailsTitleBackground = selectedPokemon
    ? getPokemonBackground(selectedPokemon)
    : typeBackgrounds[""];

  const buildGroups = (() => {
    if (!recommendedList.length || typeof recommendedList[0] !== "object")
      return null;

    const groups = recommendedList.reduce((acc, build) => {
      const groupName = build.player || "General";
      if (!acc[groupName]) acc[groupName] = [];
      acc[groupName].push(build);
      return acc;
    }, {});

    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => {
        if (a.order && b.order) return a.order - b.order;
        return a.name.localeCompare(b.name);
      });
    });
    return groups;
  })();

  const effectiveBuildGroupKey = (() => {
    if (selectedBuildGroup && buildGroups && buildGroups[selectedBuildGroup]) {
      return selectedBuildGroup;
    }
    if (buildGroups) {
      const keys = Object.keys(buildGroups).sort();
      return keys.length > 0 ? keys[0] : null;
    }
    return null;
  })();

  const closePokemonDetails = () => {
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    setSelectedRole(null);
    setSelectedTurnIndex(0);
    setSelectedStrategyIndex(0);
    setSelectedBuildGroup(null);
  };

  const handleStarClick = (star) => {
    setSelectedStar((prev) => (prev === star ? undefined : star));
    closePokemonDetails();
  };

  const handlePokemonCardClick = (pokemonName) => {
    setSelectedPokemon(pokemonName);
    setIsPokemonDetailsVisible(true);
    setSelectedRole(null);
    setSelectedTurnIndex(0);
    setSelectedStrategyIndex(0);
    setSelectedBuildGroup(null);
    setActiveTab("Strategy");
  };

  const handleRoleChange = (roleKey) => {
    setSelectedRole(roleKey);
    setSelectedTurnIndex(0);
  };

  const effectiveSelectedRole = (() => {
    if (!rolesSource) return "";
    if (selectedRole && rolesSource[selectedRole]) return selectedRole;
    if (rolesSource.player1) return "player1";
    const keys = Object.keys(rolesSource);
    return keys.length ? keys[0] : "";
  })();

  const roleOptions = rolesSource ? Object.keys(rolesSource) : [];
  const movesForSelectedRole =
    rolesSource && effectiveSelectedRole
      ? rolesSource[effectiveSelectedRole] || []
      : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
      <PageTitle title="PokéMMO Compendium: Raids" />

      <div className="flex flex-wrap justify-center gap-4 my-8">
        {starLevels.map((star) => (
          <div
            key={star}
            className={`w-32 h-16 flex items-center justify-center bg-slate-700 border-2 border-transparent rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg
              ${selectedStar === star ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] bg-slate-600" : "hover:bg-slate-600"}
            `}
            onClick={() => handleStarClick(star)}
          >
            <p className="text-white font-bold m-0">{star}★</p>
          </div>
        ))}
      </div>

      {selectedStar && filteredRaids.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {filteredRaids.map((raid) => {
            const { sprite, background } = getPokemonCardData(raid.name);
            return (
              <PokemonCard
                key={raid.name}
                pokemonName={raid.name}
                pokemonImageSrc={sprite}
                nameBackground={background}
                onClick={() => handlePokemonCardClick(raid.name)}
                isSelected={selectedPokemon === raid.name}
              />
            );
          })}
        </div>
      )}

      {isPokemonDetailsVisible && currentRaid && (
        <div 
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 backdrop-blur-sm animate-[fade-in_0.3s_ease-out_forwards]" 
          onClick={closePokemonDetails}
        >
          <div 
            className="relative w-[500px] max-w-[95vw] max-h-[90vh] flex flex-col bg-slate-800 rounded-lg shadow-2xl overflow-hidden animate-[scale-in_0.4s_ease-out_forwards]" 
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex flex-col p-4 shadow-md z-10 shrink-0"
              style={{ background: detailsTitleBackground }}
            >
              <h2 className="text-slate-900 font-bold text-xl m-0 drop-shadow-sm">{currentRaid.name}</h2>
              <p className="text-slate-800 font-medium text-sm m-0 opacity-90">{currentRaid.stars}★ Raid</p>
            </div>

            <div className="flex shrink-0 overflow-x-auto bg-slate-900 border-b border-slate-700 z-10 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 min-w-[80px] py-3.5 text-sm font-semibold whitespace-nowrap uppercase tracking-wide transition-colors relative
                    ${activeTab === tab 
                      ? "bg-slate-800 text-blue-500 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-blue-500" 
                      : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5 bg-slate-800 flex flex-col gap-5">
              <Activity mode={activeTab === "Strategy" ? "visible" : "hidden"}>
                <div className="flex flex-col gap-5">
                  {currentRaid.teamStrategies &&
                    currentRaid.teamStrategies.length > 1 && (
                      <section className="bg-neutral-800 rounded-lg p-3">
                        <h3 className="text-slate-200 text-xs font-bold tracking-widest uppercase mb-2">Select Strategy</h3>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-2">
                          {currentRaid.teamStrategies.map((strategy, idx) => (
                            <button
                              key={strategy.id || idx}
                              className={`bg-neutral-900 border border-slate-700 rounded-md text-slate-400 cursor-pointer font-semibold text-sm p-2 transition-all hover:bg-slate-700 hover:text-slate-200
                                ${selectedStrategyIndex === idx ? "bg-blue-500/15 border-blue-500 text-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]" : ""}
                              `}
                              onClick={() => {
                                setSelectedStrategyIndex(idx);
                                setSelectedRole(null);
                                setSelectedTurnIndex(0);
                                setSelectedBuildGroup(null);
                              }}
                            >
                              {strategy.label || `Version ${idx + 1}`}
                            </button>
                          ))}
                        </div>
                      </section>
                    )}

                  <section className="bg-neutral-800 rounded-lg p-3">
                    {rolesSource && roleOptions.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        <h3 className="text-slate-200 text-xs font-bold tracking-widest uppercase">Player Roles</h3>

                        <div className="flex flex-wrap gap-2 mb-2">
                          {roleOptions.map((roleKey) => (
                            <button
                              key={roleKey}
                              className={`flex-1 min-w-[80px] bg-neutral-900 border border-slate-700 rounded-md text-slate-400 cursor-pointer font-semibold text-sm py-2.5 px-1.5 transition-all hover:bg-slate-700 hover:text-slate-200
                                ${effectiveSelectedRole === roleKey ? "bg-blue-500/15 border-blue-500 text-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]" : ""}
                              `}
                              onClick={() => handleRoleChange(roleKey)}
                            >
                              {roleKey === "player1"
                                ? "Player 1"
                                : roleKey.replace("player", "Player ")}
                            </button>
                          ))}
                        </div>

                        {movesForSelectedRole.length > 0 && (
                          <>
                            <div className="flex items-center justify-between bg-slate-700 border border-slate-700 border-b-neutral-900 rounded-t-lg p-2">
                              <button
                                className="flex items-center justify-center w-8 h-8 bg-neutral-800 border border-slate-600 rounded-md text-white transition-all hover:bg-blue-500 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-800 disabled:hover:border-slate-600"
                                disabled={selectedTurnIndex === 0}
                                onClick={() =>
                                  setSelectedTurnIndex((prev) =>
                                    Math.max(0, prev - 1)
                                  )
                                }
                              >
                                ❮
                              </button>

                              <div className="flex items-baseline gap-1.5">
                                <span className="text-slate-400 text-xs font-bold uppercase">Turn</span>
                                <span className="text-white font-mono text-lg font-bold">
                                  {selectedTurnIndex + 1}
                                </span>
                                <span className="text-slate-500 text-sm font-medium">
                                  / {movesForSelectedRole.length}
                                </span>
                              </div>

                              <button
                                className="flex items-center justify-center w-8 h-8 bg-neutral-800 border border-slate-600 rounded-md text-white transition-all hover:bg-blue-500 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-800 disabled:hover:border-slate-600"
                                disabled={
                                  selectedTurnIndex >=
                                  movesForSelectedRole.length - 1
                                }
                                onClick={() =>
                                  setSelectedTurnIndex((prev) =>
                                    Math.min(
                                      movesForSelectedRole.length - 1,
                                      prev + 1
                                    )
                                  )
                                }
                              >
                                ❯
                              </button>
                            </div>

                            <ul className="flex flex-col gap-1 bg-neutral-900 border border-slate-700 border-t-0 rounded-b-lg p-2.5 mt-0 list-none">
                              {movesForSelectedRole.map((item, idx) => (
                                <li
                                  key={idx}
                                  className={`flex items-center rounded-md text-sm px-3 py-2 cursor-pointer transition-colors relative
                                    ${idx === selectedTurnIndex 
                                      ? "bg-blue-500/15 border border-blue-500/30" 
                                      : "hover:bg-slate-800"}
                                  `}
                                  onClick={() => setSelectedTurnIndex(idx)}
                                >
                                  <span className={`font-mono text-xs mr-3 min-w-[25px] ${idx === selectedTurnIndex ? "text-blue-400 font-bold" : "text-slate-500"}`}>
                                    T{idx + 1}:
                                  </span>
                                  <span className="flex-1 text-slate-200">
                                    {item}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    ) : (
                      <p className="text-slate-500 italic p-4 text-center">No strategy data available.</p>
                    )}
                  </section>
                </div>
              </Activity>

              <Activity mode={activeTab === "Builds" ? "visible" : "hidden"}>
                <section className="bg-neutral-800 rounded-lg p-3">
                  {recommendedList.length > 0 ? (
                    <>
                      <h3 className="text-slate-200 text-xs font-bold tracking-widest uppercase mb-3">Recommended Setup</h3>
                      {buildGroups ? (
                        <>
                          <div className="flex flex-wrap gap-2 mb-5">
                            {Object.keys(buildGroups)
                              .sort()
                              .map((groupName) => (
                                <button
                                  key={groupName}
                                  className={`flex-1 min-w-[80px] bg-neutral-900 border border-slate-700 rounded-md text-slate-400 cursor-pointer font-semibold text-sm py-2.5 px-1.5 transition-all hover:bg-slate-700 hover:text-slate-200
                                    ${effectiveBuildGroupKey === groupName ? "bg-blue-500/15 border-blue-500 text-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]" : ""}
                                  `}
                                  onClick={() =>
                                    setSelectedBuildGroup(groupName)
                                  }
                                >
                                  {groupName}
                                </button>
                              ))}
                          </div>

                          {effectiveBuildGroupKey &&
                            buildGroups[effectiveBuildGroupKey] && (
                              <div className="flex flex-col gap-2.5 animate-[fade-in_0.3s_ease-out]">
                                {buildGroups[effectiveBuildGroupKey].map(
                                  (build, i) => (
                                    <BuildCard key={i} buildData={build} />
                                  )
                                )}
                              </div>
                            )}
                        </>
                      ) : (
                        <ul className="flex flex-col gap-2 list-none p-0 m-0">
                          {recommendedList.map((rec, i) => (
                            <li key={i} className="bg-neutral-900 border border-slate-700 rounded p-2 text-slate-300 text-sm">{rec}</li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <p className="text-slate-500 italic p-4 text-center">
                      No recommended builds available.
                    </p>
                  )}
                </section>
              </Activity>

              <Activity mode={activeTab === "Mechanics" ? "visible" : "hidden"}>
                {currentRaid.mechanics ? (
                  <section className="bg-neutral-800 rounded-lg p-3 flex flex-col gap-4">
                    <div>
                      <h3 className="text-slate-200 text-xs font-bold tracking-widest uppercase mb-2">Boss Info</h3>
                      <div className="grid grid-cols-2 gap-2.5">
                        {currentRaid.mechanics.ability && (
                          <div className="flex flex-col gap-1 bg-neutral-900 border border-slate-700 rounded-lg p-2.5">
                            <strong className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Ability</strong>
                            <span className="text-slate-200 text-sm">{currentRaid.mechanics.ability}</span>
                          </div>
                        )}
                        {currentRaid.mechanics.heldItem && (
                          <div className="flex flex-col gap-1 bg-neutral-900 border border-slate-700 rounded-lg p-2.5">
                             <strong className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Item</strong>
                             <span className="text-slate-200 text-sm">{currentRaid.mechanics.heldItem}</span>
                          </div>
                        )}
                        {currentRaid.mechanics.notes && (
                          <div className="col-span-2 flex flex-col gap-1 bg-neutral-900 border border-slate-700 rounded-lg p-2.5">
                             <strong className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Notes</strong>
                             <span className="text-slate-200 text-sm">{currentRaid.mechanics.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {currentRaid.mechanics.thresholds && (
                      <div className="flex flex-col gap-2">
                        <h3 className="text-slate-200 text-xs font-bold tracking-widest uppercase">HP Thresholds</h3>
                        <ul className="flex flex-col gap-1 list-none p-0">
                          {Object.entries(currentRaid.mechanics.thresholds)
                            .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
                            .map(([hp, info]) => (
                              <li key={hp} className="flex items-center bg-neutral-900 border border-slate-700 rounded-md p-2 hover:bg-slate-700/50 transition-colors">
                                <span className="bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono font-bold text-xs text-center min-w-[55px] py-0.5 mr-3">
                                  {hp}% HP
                                </span>
                                <span className="text-slate-200 text-sm font-medium">
                                  {typeof info === "string"
                                    ? info
                                    : info?.effect}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    {currentRaid.moves && (
                      <div className="flex flex-col gap-2">
                        <h3 className="text-slate-200 text-xs font-bold tracking-widest uppercase">Known Moves</h3>
                        <ul className="flex flex-wrap gap-1.5 list-none p-0">
                          {currentRaid.moves.map((move) => (
                            <li key={move} className="bg-white/5 border border-white/10 rounded-full text-slate-300 text-xs font-semibold px-3 py-1">
                              {move}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </section>
                ) : (
                  <div />
                )}
              </Activity>

              <Activity mode={activeTab === "Locations" ? "visible" : "hidden"}>
                <section className="bg-neutral-800 rounded-lg p-3">
                  <h3 className="text-slate-200 text-xs font-bold tracking-widest uppercase mb-3">Where to find</h3>
                  {currentRaid.locations ? (
                    <div className="flex flex-col gap-3">
                      {Object.entries(currentRaid.locations).map(
                        ([region, locationData]) => {
                          const areaName = locationData.area || locationData;
                          const reqs = locationData.requirements || [];
                          return (
                            <div key={region} className="bg-neutral-900 border border-slate-700 rounded-lg overflow-hidden">
                              <div className="bg-slate-700 border-b border-slate-700 p-2 px-3">
                                <span className="text-white text-xs font-bold uppercase tracking-wider">{region}</span>
                              </div>
                              <div className="p-3 flex flex-col gap-3">
                                <div className="flex flex-col gap-1">
                                  <strong className="text-slate-500 text-[10px] font-bold uppercase">Area</strong>
                                  <span className="text-slate-200 text-sm font-medium">{areaName}</span>
                                </div>
                                {reqs.length > 0 && (
                                  <div className="flex flex-col gap-1">
                                    <strong className="text-slate-500 text-[10px] font-bold uppercase">
                                      Requirements
                                    </strong>
                                    <div className="flex flex-wrap gap-1.5">
                                      {reqs.map((req, k) => (
                                        <span key={k} className="inline-flex items-center rounded border text-xs font-semibold px-2 py-1 bg-orange-500/15 border-orange-500/40 text-orange-500">
                                          {req}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic p-4 text-center">No location data available.</p>
                  )}
                </section>
              </Activity>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RaidsPage;