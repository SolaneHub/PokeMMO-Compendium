import { useState } from "react";

import {
  getAllBossFights,
  getAvailableBossFightRegions,
  getBossFightsByRegion,
  getPokemonListForTeam,
  getPokemonStrategy,
} from "@/pages/boss-fights/data/bossFightsService";
import {
  getPokemonBackground,
  getPokemonByName,
  getPokemonCardData,
} from "@/pages/pokedex/data/pokemonService";
import EliteMemberCard from "@/shared/components/EliteMemberCard";
import MoveColoredText from "@/shared/components/MoveColoredText";
import PageTitle from "@/shared/components/PageTitle";
import PokemonCard from "@/shared/components/PokemonCard";
import RegionCard from "@/shared/components/RegionCard";
import { getDualShadow, typeBackgrounds } from "@/shared/utils/pokemonColors";

function BossFightsPage() {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedBossFight, setSelectedBossFight] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);
  const [currentStrategyView, setCurrentStrategyView] = useState([]);
  const [strategyHistory, setStrategyHistory] = useState([]);

  const resetStrategyStates = () => {
    setCurrentStrategyView([]);
    setStrategyHistory([]);
  };

  const allTeamNames = (() => {
    const allData = getAllBossFights();
    if (allData.length === 0) return [];
    return Object.keys(allData[0].teams || {}).sort();
  })();

  const availableRegions = getAvailableBossFightRegions();

  const filteredBossFights = getBossFightsByRegion(selectedRegion);

  const pokemonNamesForSelectedTeam = getPokemonListForTeam(
    selectedBossFight,
    selectedRegion,
    selectedTeam
  );

  const currentPokemonObject = selectedPokemon
    ? getPokemonByName(selectedPokemon)
    : null;

  const detailsTitleBackground = selectedPokemon
    ? getPokemonBackground(selectedPokemon)
    : "#333";

  const handleTeamClick = (teamName) => {
    setSelectedTeam(teamName);
    setSelectedRegion(null);
    setSelectedBossFight(null);
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategyStates();
  };

  const handleRegionClick = (region) => {
    const regionName = typeof region === "object" ? region.name : region;
    setSelectedRegion((prev) => (prev === regionName ? null : regionName));
    setSelectedBossFight(null);
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategyStates();
  };

  const handleBossFightClick = (bossFightName) => {
    setSelectedBossFight((prev) =>
      prev === bossFightName ? null : bossFightName
    );
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategyStates();
  };

  const handlePokemonCardClick = (pokemonName) => {
    setSelectedPokemon(pokemonName);
    setIsPokemonDetailsVisible(true);

    const strategy = getPokemonStrategy(
      selectedBossFight,
      selectedRegion,
      selectedTeam,
      pokemonName
    );

    setCurrentStrategyView(strategy);
    setStrategyHistory([]);
  };

  const closePokemonDetails = () => {
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategyStates();
  };

  const handleStepClick = (item) => {
    if (item?.steps && Array.isArray(item.steps)) {
      setStrategyHistory((prev) => [...prev, currentStrategyView]);
      setCurrentStrategyView(item.steps);
      const modalContent = document.getElementById("pokemon-details-content");
      if (modalContent) modalContent.scrollTop = 0;
    }
  };

  const handleBackClick = () => {
    if (strategyHistory.length > 0) {
      setCurrentStrategyView(strategyHistory[strategyHistory.length - 1]);
      setStrategyHistory((prev) => prev.slice(0, -1));
    }
  };

  const renderWarning = (warningText) =>
    warningText ? (
      <div className="w-full flex mb-3">
        <div className="w-full bg-red-500/10 border border-red-500/50 rounded-xl shadow-sm text-red-200 text-sm font-medium p-3 text-center">
          ⚠️ {warningText}
        </div>
      </div>
    ) : null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24">
      <PageTitle title="PokéMMO Compendium: Boss Fights" />

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Boss Fights Strategy</h1>
        <p className="text-slate-400">Select your team to begin.</p>
      </div>

      {/* Team Selection */}
      <div className="flex flex-wrap justify-center gap-4">
        {allTeamNames.map((teamName) => (
          <button
            key={teamName}
            onClick={() => handleTeamClick(teamName)}
            className={`
              relative w-40 h-16 rounded-2xl font-bold text-lg transition-all duration-300 border
              ${
                selectedTeam === teamName
                  ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)] scale-105"
                  : "bg-[#1e2025] border-white/5 text-slate-400 hover:bg-[#25272e] hover:border-white/20 hover:text-slate-200 hover:-translate-y-1"
              }
            `}
          >
            {teamName}
          </button>
        ))}
      </div>

      {selectedTeam && (
        <div className="space-y-4 animate-[fade-in_0.4s_ease-out]">
          <h2 className="text-xl font-semibold text-slate-300 text-center">
            Select Region
          </h2>
          <div className="flex flex-wrap justify-center gap-5">
            {availableRegions.map((region) => (
              <RegionCard
                key={region.id}
                region={region}
                onRegionClick={() => handleRegionClick(region.name)}
                isSelected={selectedRegion === region.name}
              />
            ))}
          </div>
        </div>
      )}

      {selectedRegion && filteredBossFights.length > 0 && (
        <div className="space-y-4 animate-[fade-in_0.4s_ease-out]">
          <h2 className="text-xl font-semibold text-slate-300 text-center">
            Select Boss
          </h2>
          <div className="flex flex-wrap justify-center gap-5">
            {filteredBossFights.map((bossFight, i) => {
              const bossBackground =
                typeBackgrounds[bossFight.type] || typeBackgrounds[""];
              const bossShadowColor = getDualShadow(bossBackground);

              return (
                <EliteMemberCard
                  key={i}
                  member={bossFight}
                  onMemberClick={() => handleBossFightClick(bossFight.name)}
                  isSelected={selectedBossFight === bossFight.name}
                  background={bossBackground}
                  shadowColor={bossShadowColor}
                />
              );
            })}
          </div>
        </div>
      )}

      {selectedBossFight && pokemonNamesForSelectedTeam.length > 0 && (
        <div className="space-y-4 animate-[fade-in_0.4s_ease-out]">
          <h2 className="text-xl font-semibold text-slate-300 text-center">
            Select Opponent Pokémon
          </h2>
          <div className="flex flex-wrap justify-center gap-5">
            {pokemonNamesForSelectedTeam.map((pokemonName, index) => {
              const { sprite, background } = getPokemonCardData(pokemonName);

              return (
                <PokemonCard
                  key={index}
                  pokemonName={pokemonName}
                  pokemonImageSrc={sprite}
                  nameBackground={background}
                  onClick={() => handlePokemonCardClick(pokemonName)}
                  isSelected={selectedPokemon === pokemonName}
                />
              );
            })}
          </div>
        </div>
      )}

      {isPokemonDetailsVisible && currentPokemonObject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"
          onClick={closePokemonDetails}
        >
          <div
            className="relative w-[500px] max-w-[90vw] max-h-[85vh] flex flex-col bg-[#1a1b20] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-[scale-in_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex justify-center p-4 z-10 shrink-0"
              style={{ background: detailsTitleBackground }}
            >
              <h2 className="text-[#1a1b20] font-bold text-xl m-0 drop-shadow-sm">
                {currentPokemonObject.name}
              </h2>
            </div>

            {/* Modal Content */}
            <div
              id="pokemon-details-content"
              className="flex-1 overflow-y-auto p-6 bg-[#1a1b20]"
            >
              <div className="flex flex-col gap-4">
                {strategyHistory.length > 0 && (
                  <button
                    className="self-start mb-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2 text-sm font-medium"
                    onClick={handleBackClick}
                  >
                    ⬅️ Back
                  </button>
                )}

                {currentStrategyView.length === 0 ? (
                  <p className="text-slate-500 text-center italic py-8">
                    No strategy available.
                  </p>
                ) : (
                  currentStrategyView.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-col animate-[fade-in_0.3s_ease-out]"
                      >
                        {(item.type === "main" || item.type === "step") && (
                          <>
                            {item.player && (
                              <div
                                className={`mb-3 p-4 rounded-xl border ${
                                  item.type === "main"
                                    ? "bg-[#25272e] border-white/5 shadow-sm"
                                    : "bg-transparent border-transparent"
                                }`}
                              >
                                <p className="text-slate-200 text-center m-0 text-base leading-relaxed">
                                  <MoveColoredText text={item.player} />
                                </p>
                              </div>
                            )}
                            {renderWarning(item.warning)}
                          </>
                        )}

                        {item.variations && (
                          <div className="flex flex-col gap-2.5 pl-4 border-l-2 border-white/5 my-2">
                            {item.variations.map((v, vi) => (
                              <button
                                key={vi}
                                className="w-full text-left p-3 bg-[#25272e] border border-white/5 rounded-xl text-slate-300 hover:bg-[#2d3038] hover:border-blue-500/50 hover:text-blue-200 transition-all group"
                                onClick={() => handleStepClick(v)}
                              >
                                <p className="m-0 text-sm font-semibold flex items-center justify-between">
                                  {v.name}
                                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400">
                                    →
                                  </span>
                                </p>
                                {renderWarning(v.warning)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BossFightsPage;
