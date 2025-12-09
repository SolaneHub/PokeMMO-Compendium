import { Users } from "lucide-react";
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
import ItemImage from "@/shared/components/ItemImage";
import PageTitle from "@/shared/components/PageTitle";
import PokemonCard from "@/shared/components/PokemonCard";
import { typeBackgrounds } from "@/shared/utils/pokemonColors";

import RaidCard from "./components/RaidCard";

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
    <div className="flex flex-col overflow-hidden rounded-lg border border-slate-700 bg-neutral-900 shadow-sm transition-colors hover:border-slate-500">
      {allVariants.length > 1 && (
        <div className="scrollbar-hide flex overflow-x-auto border-b border-slate-700 bg-neutral-900">
          {allVariants.map((variant, idx) => (
            <button
              key={idx}
              className={`flex-1 cursor-pointer border-r border-none border-slate-700 bg-transparent px-2.5 py-2 text-xs font-bold whitespace-nowrap text-slate-500 uppercase transition-colors last:border-r-0 hover:bg-slate-800 hover:text-slate-300 ${activeBuild.name === variant.name ? "bg-slate-800 text-blue-500 shadow-[inset_0_-2px_0_#3b82f6]" : ""}`}
              onClick={() => setActiveBuild(variant)}
            >
              {variant.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 p-2.5">
        <div className="flex items-center gap-3">
          <img
            src={sprite}
            alt={activeBuild.name}
            className="h-10 w-10 object-contain drop-shadow-md"
          />
          <div className="flex flex-col">
            <span className="text-sm leading-tight font-bold text-white">
              {activeBuild.name}
            </span>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs font-bold uppercase">
              {activeBuild.order && (
                <span className="text-yellow-400">
                  Pokemon {activeBuild.order}
                </span>
              )}
            </div>
          </div>
        </div>

        {activeBuild.item && (
          <span className="ml-auto flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300">
            <ItemImage
              item={activeBuild.item}
              className="mr-1.5 h-5 w-5 object-contain"
            />
            {activeBuild.item}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5 border-b border-slate-700 bg-neutral-800 px-2.5 py-1.5 text-xs">
        {activeBuild.ability && (
          <span className="text-slate-400">
            Ability:{" "}
            <strong className="ml-1 text-slate-200">
              {activeBuild.ability}
            </strong>
          </span>
        )}
        {activeBuild.nature && (
          <span className="text-slate-400">
            Nature:{" "}
            <strong className="ml-1 text-slate-200">
              {activeBuild.nature}
            </strong>
          </span>
        )}
        {activeBuild.evs && (
          <span className="text-slate-400">
            EVs:{" "}
            <strong className="ml-1 text-slate-200">{activeBuild.evs}</strong>
          </span>
        )}
        {activeBuild.ivs && (
          <span className="text-slate-400">
            IVs:{" "}
            <strong className="ml-1 text-slate-200">{activeBuild.ivs}</strong>
          </span>
        )}
      </div>

      {activeBuild.moves && (
        <div className="flex flex-wrap gap-1.5 bg-neutral-900 p-2.5">
          {activeBuild.moves.map((m, k) => (
            <span
              key={k}
              className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-xs text-slate-300"
            >
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
    <div className="mx-auto max-w-7xl pb-24">
      <PageTitle title="PokéMMO Compendium: Raids" />

      {/* Header */}
      <div className="mb-8 flex flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <Users className="text-purple-400" size={32} />
          Raid Strategies
        </h1>
        <p className="text-slate-400">
          Detailed strategies for defeating various raids.
        </p>
      </div>

      <div className="my-8 flex flex-wrap justify-center gap-4">
        {starLevels.map((star) => (
          <RaidCard
            key={star}
            raid={{ name: `${star}★` }}
            onRaidClick={() => handleStarClick(star)}
            isSelected={selectedStar === star}
            displayValue={`${star}★`}
            isCompact={true}
          />
        ))}
      </div>

      {selectedStar && filteredRaids.length > 0 && (
        <div className="mb-8 flex flex-wrap justify-center gap-4">
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
          className="fixed inset-0 z-[2000] flex animate-[fade-in_0.3s_ease-out_forwards] items-center justify-center bg-black/75 backdrop-blur-sm"
          onClick={closePokemonDetails}
        >
          <div
            className="relative flex max-h-[90vh] w-[500px] max-w-[95vw] animate-[scale-in_0.4s_ease-out_forwards] flex-col overflow-hidden rounded-lg bg-slate-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="z-10 flex shrink-0 flex-col p-4 shadow-md"
              style={{ background: detailsTitleBackground }}
            >
              <h2 className="m-0 text-xl font-bold text-slate-900 drop-shadow-sm">
                {currentRaid.name}
              </h2>
              <p className="m-0 text-sm font-medium text-slate-800 opacity-90">
                {currentRaid.stars}★ Raid
              </p>
            </div>

            <div className="scrollbar-hide z-10 flex shrink-0 overflow-x-auto border-b border-slate-700 bg-slate-900">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`relative min-w-[80px] flex-1 py-3.5 text-sm font-semibold tracking-wide whitespace-nowrap uppercase transition-colors ${
                    activeTab === tab
                      ? "bg-slate-800 text-blue-500 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-blue-500 after:content-['']"
                      : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex flex-1 flex-col gap-5 overflow-y-auto bg-slate-800 p-5">
              <Activity mode={activeTab === "Strategy" ? "visible" : "hidden"}>
                <div className="flex flex-col gap-5">
                  {currentRaid.teamStrategies &&
                    currentRaid.teamStrategies.length > 1 && (
                      <section className="rounded-lg bg-neutral-800 p-3">
                        <h3 className="mb-2 text-xs font-bold tracking-widest text-slate-200 uppercase">
                          Select Strategy
                        </h3>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-2">
                          {currentRaid.teamStrategies.map((strategy, idx) => (
                            <button
                              key={strategy.id || idx}
                              className={`cursor-pointer rounded-md border border-slate-700 bg-neutral-900 p-2 text-sm font-semibold text-slate-400 transition-all hover:bg-slate-700 hover:text-slate-200 ${selectedStrategyIndex === idx ? "border-blue-500 bg-blue-500/15 text-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]" : ""} `}
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

                  <section className="rounded-lg bg-neutral-800 p-3">
                    {rolesSource && roleOptions.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-bold tracking-widest text-slate-200 uppercase">
                          Player Roles
                        </h3>

                        <div className="mb-2 flex flex-wrap gap-2">
                          {roleOptions.map((roleKey) => (
                            <button
                              key={roleKey}
                              className={`min-w-[80px] flex-1 cursor-pointer rounded-md border border-slate-700 bg-neutral-900 px-1.5 py-2.5 text-sm font-semibold text-slate-400 transition-all hover:bg-slate-700 hover:text-slate-200 ${effectiveSelectedRole === roleKey ? "border-blue-500 bg-blue-500/15 text-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]" : ""} `}
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
                            <div className="flex items-center justify-between rounded-t-lg border border-slate-700 border-b-neutral-900 bg-slate-700 p-2">
                              <button
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-600 bg-neutral-800 text-white transition-all hover:border-blue-500 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-600 disabled:hover:bg-neutral-800"
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
                                <span className="text-xs font-bold text-slate-400 uppercase">
                                  Turn
                                </span>
                                <span className="font-mono text-lg font-bold text-white">
                                  {selectedTurnIndex + 1}
                                </span>
                                <span className="text-sm font-medium text-slate-500">
                                  / {movesForSelectedRole.length}
                                </span>
                              </div>

                              <button
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-600 bg-neutral-800 text-white transition-all hover:border-blue-500 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-600 disabled:hover:bg-neutral-800"
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

                            <ul className="mt-0 flex list-none flex-col gap-1 rounded-b-lg border border-t-0 border-slate-700 bg-neutral-900 p-2.5">
                              {movesForSelectedRole.map((item, idx) => (
                                <li
                                  key={idx}
                                  className={`relative flex cursor-pointer items-center rounded-md px-3 py-2 text-sm transition-colors ${
                                    idx === selectedTurnIndex
                                      ? "border border-blue-500/30 bg-blue-500/15"
                                      : "hover:bg-slate-800"
                                  } `}
                                  onClick={() => setSelectedTurnIndex(idx)}
                                >
                                  <span
                                    className={`mr-3 min-w-[25px] font-mono text-xs ${idx === selectedTurnIndex ? "font-bold text-blue-400" : "text-slate-500"}`}
                                  >
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
                      <p className="p-4 text-center text-slate-500 italic">
                        No strategy data available.
                      </p>
                    )}
                  </section>
                </div>
              </Activity>

              <Activity mode={activeTab === "Builds" ? "visible" : "hidden"}>
                <section className="rounded-lg bg-neutral-800 p-3">
                  {recommendedList.length > 0 ? (
                    <>
                      <h3 className="mb-3 text-xs font-bold tracking-widest text-slate-200 uppercase">
                        Recommended Setup
                      </h3>
                      {buildGroups ? (
                        <>
                          <div className="mb-5 flex flex-wrap gap-2">
                            {Object.keys(buildGroups)
                              .sort()
                              .map((groupName) => (
                                <button
                                  key={groupName}
                                  className={`min-w-[80px] flex-1 cursor-pointer rounded-md border border-slate-700 bg-neutral-900 px-1.5 py-2.5 text-sm font-semibold text-slate-400 transition-all hover:bg-slate-700 hover:text-slate-200 ${effectiveBuildGroupKey === groupName ? "border-blue-500 bg-blue-500/15 text-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]" : ""} `}
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
                              <div className="flex animate-[fade-in_0.3s_ease-out] flex-col gap-2.5">
                                {buildGroups[effectiveBuildGroupKey].map(
                                  (build, i) => (
                                    <BuildCard key={i} buildData={build} />
                                  )
                                )}
                              </div>
                            )}
                        </>
                      ) : (
                        <ul className="m-0 flex list-none flex-col gap-2 p-0">
                          {recommendedList.map((rec, i) => (
                            <li
                              key={i}
                              className="rounded border border-slate-700 bg-neutral-900 p-2 text-sm text-slate-300"
                            >
                              {rec}
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <p className="p-4 text-center text-slate-500 italic">
                      No recommended builds available.
                    </p>
                  )}
                </section>
              </Activity>

              <Activity mode={activeTab === "Mechanics" ? "visible" : "hidden"}>
                {currentRaid.mechanics ? (
                  <section className="flex flex-col gap-4 rounded-lg bg-neutral-800 p-3">
                    <div>
                      <h3 className="mb-2 text-xs font-bold tracking-widest text-slate-200 uppercase">
                        Boss Info
                      </h3>
                      <div className="grid grid-cols-2 gap-2.5">
                        {currentRaid.mechanics.ability && (
                          <div className="flex flex-col gap-1 rounded-lg border border-slate-700 bg-neutral-900 p-2.5">
                            <strong className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                              Ability
                            </strong>
                            <span className="text-sm text-slate-200">
                              {currentRaid.mechanics.ability}
                            </span>
                          </div>
                        )}
                        {currentRaid.mechanics.heldItem && (
                          <div className="flex flex-col gap-1 rounded-lg border border-slate-700 bg-neutral-900 p-2.5">
                            <strong className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                              Item
                            </strong>
                            <span className="text-sm text-slate-200">
                              {currentRaid.mechanics.heldItem}
                            </span>
                          </div>
                        )}
                        {currentRaid.mechanics.notes && (
                          <div className="col-span-2 flex flex-col gap-1 rounded-lg border border-slate-700 bg-neutral-900 p-2.5">
                            <strong className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                              Notes
                            </strong>
                            <span className="text-sm text-slate-200">
                              {currentRaid.mechanics.notes}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {currentRaid.mechanics.thresholds && (
                      <div className="flex flex-col gap-2">
                        <h3 className="text-xs font-bold tracking-widest text-slate-200 uppercase">
                          HP Thresholds
                        </h3>
                        <ul className="flex list-none flex-col gap-1 p-0">
                          {Object.entries(currentRaid.mechanics.thresholds)
                            .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
                            .map(([hp, info]) => (
                              <li
                                key={hp}
                                className="flex items-center rounded-md border border-slate-700 bg-neutral-900 p-2 transition-colors hover:bg-slate-700/50"
                              >
                                <span className="mr-3 min-w-[55px] rounded border border-red-500/30 bg-red-500/10 py-0.5 text-center font-mono text-xs font-bold text-red-400">
                                  {hp}% HP
                                </span>
                                <span className="text-sm font-medium text-slate-200">
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
                        <h3 className="text-xs font-bold tracking-widest text-slate-200 uppercase">
                          Known Moves
                        </h3>
                        <ul className="flex list-none flex-wrap gap-1.5 p-0">
                          {currentRaid.moves.map((move) => (
                            <li
                              key={move}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300"
                            >
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
                <section className="rounded-lg bg-neutral-800 p-3">
                  <h3 className="mb-3 text-xs font-bold tracking-widest text-slate-200 uppercase">
                    Where to find
                  </h3>
                  {currentRaid.locations ? (
                    <div className="flex flex-col gap-3">
                      {Object.entries(currentRaid.locations).map(
                        ([region, locationData]) => {
                          const areaName = locationData.area || locationData;
                          const reqs = locationData.requirements || [];
                          return (
                            <div
                              key={region}
                              className="overflow-hidden rounded-lg border border-slate-700 bg-neutral-900"
                            >
                              <div className="border-b border-slate-700 bg-slate-700 p-2 px-3">
                                <span className="text-xs font-bold tracking-wider text-white uppercase">
                                  {region}
                                </span>
                              </div>
                              <div className="flex flex-col gap-3 p-3">
                                <div className="flex flex-col gap-1">
                                  <strong className="text-[10px] font-bold text-slate-500 uppercase">
                                    Area
                                  </strong>
                                  <span className="text-sm font-medium text-slate-200">
                                    {areaName}
                                  </span>
                                </div>
                                {reqs.length > 0 && (
                                  <div className="flex flex-col gap-1">
                                    <strong className="text-[10px] font-bold text-slate-500 uppercase">
                                      Requirements
                                    </strong>
                                    <div className="flex flex-wrap gap-1.5">
                                      {reqs.map((req, k) => (
                                        <span
                                          key={k}
                                          className="inline-flex items-center rounded border border-orange-500/40 bg-orange-500/15 px-2 py-1 text-xs font-semibold text-orange-500"
                                        >
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
                    <p className="p-4 text-center text-slate-500 italic">
                      No location data available.
                    </p>
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
