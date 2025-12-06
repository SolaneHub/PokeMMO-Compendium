import { Fragment, useState } from "react";

import {
  getAllHoOhTrainers,
  getAvailableHoOhRegions,
  getHoOhTrainersByRegion,
  getPokemonListForTeam,
  getPokemonStrategy,
} from "@/pages/ho-oh/data/hoohService";
import {
  getPokemonBackground,
  getPokemonByName,
  getPokemonCardData,
} from "@/pages/pokedex/data/pokemonService";
import EliteMemberCard from "@/shared/components/EliteMemberCard";
import MoveColoredText from "@/shared/components/MoveColoredText";
import PokemonCard from "@/shared/components/PokemonCard";
import RegionCard from "@/shared/components/RegionCard";
import { getDualShadow, typeBackgrounds } from "@/shared/utils/pokemonColors";

function HoOhPage() {
  const [selectedTeam, setSelectedTeam] = useState();
  const [selectedRegion, setSelectedRegion] = useState();
  const [selectedHoOh, setSelectedHoOh] = useState();
  const [selectedPokemon, setSelectedPokemon] = useState();
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);
  const [currentStrategyView, setCurrentStrategyView] = useState([]);
  const [strategyHistory, setStrategyHistory] = useState([]);

  const resetStrategyStates = () => {
    setCurrentStrategyView([]);
    setStrategyHistory([]);
  };

  const allTeamNames = (() => {
    const allData = getAllHoOhTrainers();
    if (allData.length === 0) return [];
    return Object.keys(allData[0].teams || {}).sort();
  })();

  const availableRegions = getAvailableHoOhRegions();

  const filteredHoOh = getHoOhTrainersByRegion(selectedRegion);

  const pokemonNamesForSelectedTeam = getPokemonListForTeam(
    selectedHoOh,
    selectedRegion,
    selectedTeam
  );

  const currentPokemonObject = selectedPokemon
    ? getPokemonByName(selectedPokemon)
    : null;

  const detailsTitleBackground = selectedPokemon
    ? getPokemonBackground(selectedPokemon)
    : typeBackgrounds[""];

  const handleTeamClick = (teamName) => {
    setSelectedTeam(teamName);
    setSelectedRegion(null);
    setSelectedHoOh(null);
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategyStates();
  };

  const handleRegionClick = (region) => {
    const regionName = typeof region === "object" ? region.name : region;
    setSelectedRegion((prev) => (prev === regionName ? null : regionName));
    setSelectedHoOh(null);
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategyStates();
  };

  const handleHoOhClick = (hoOhName) => {
    setSelectedHoOh((prev) => (prev === hoOhName ? null : hoOhName));
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategyStates();
  };

  const handlePokemonCardClick = (pokemonName) => {
    setSelectedPokemon(pokemonName);
    setIsPokemonDetailsVisible(true);

    const strategy = getPokemonStrategy(
      selectedHoOh,
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
    }
  };

  const handleBackClick = () => {
    if (strategyHistory.length > 0) {
      setCurrentStrategyView(strategyHistory[strategyHistory.length - 1]);
      setStrategyHistory((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
      {/* Team Selection */}
      <div className="flex flex-wrap justify-center gap-4 my-8">
        {allTeamNames.map((teamName) => (
          <div
            key={teamName}
            className={`w-32 h-16 flex items-center justify-center bg-slate-700 border-2 border-transparent rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg
              ${selectedTeam === teamName ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] bg-slate-600" : "hover:bg-slate-600"}
            `}
            onClick={() => handleTeamClick(teamName)}
          >
            <p className="text-white font-bold m-0">{teamName}</p>
          </div>
        ))}
      </div>

      {selectedTeam && (
        <div className="flex flex-wrap justify-center gap-4 my-8">
          {availableRegions.map((region) => (
            <RegionCard
              key={region.id}
              region={region}
              onRegionClick={() => handleRegionClick(region.name)}
              isSelected={selectedRegion === region.name}
            />
          ))}
        </div>
      )}

      {selectedRegion && filteredHoOh.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 my-8">
          {filteredHoOh.map((hoOh, i) => {
            const bossBackground =
              typeBackgrounds[hoOh.type] || typeBackgrounds[""];
            const bossShadowColor = getDualShadow(bossBackground);

            return (
              <EliteMemberCard
                key={i}
                member={hoOh}
                onMemberClick={() => handleHoOhClick(hoOh.name)}
                isSelected={selectedHoOh === hoOh.name}
                background={bossBackground}
                shadowColor={bossShadowColor}
              />
            );
          })}
        </div>
      )}

      {selectedHoOh && pokemonNamesForSelectedTeam.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mb-8">
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
      )}

      {isPokemonDetailsVisible && currentPokemonObject && (
        <div 
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 backdrop-blur-sm animate-[fade-in_0.3s_ease-out_forwards]" 
          onClick={closePokemonDetails}
        >
          <div
            className="relative w-[500px] max-w-[95vw] max-h-[90vh] flex flex-col bg-slate-800 rounded-lg shadow-2xl overflow-hidden animate-[scale-in_0.4s_ease-out_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex justify-center p-4 shadow-md z-10 shrink-0"
              style={{ background: detailsTitleBackground }}
            >
              <h2 className="text-slate-900 font-bold text-xl m-0">{currentPokemonObject.name}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-5 bg-slate-800">
              <div className="flex flex-col gap-3">
                {strategyHistory.length > 0 && (
                  <button 
                    className="w-full mb-2.5 px-4 py-2 bg-neutral-900 border border-slate-700 rounded-lg text-white font-semibold hover:bg-slate-700 hover:border-blue-500 transition-all text-left flex items-center gap-2" 
                    onClick={handleBackClick}
                  >
                    Back
                  </button>
                )}

                {currentStrategyView.length === 0 ? (
                  <p className="text-slate-400 text-center italic">No strategy available</p>
                ) : (
                  currentStrategyView.map((item, index) => {
                    const renderWarning = (warningText) =>
                      warningText ? (
                        <div className="w-full flex mb-2.5">
                          <div className="w-full bg-gradient-to-br from-red-400 to-red-600 border border-red-500 rounded-lg shadow-md text-red-950 text-sm font-semibold p-3 text-center">
                            {warningText}
                          </div>
                        </div>
                      ) : null;

                    if (item.type === "main") {
                      return (
                        <Fragment key={index}>
                          {item.player && (
                            <div className="flex justify-center mb-2.5 px-3 py-3 rounded-lg bg-neutral-800 shadow-sm">
                              <p className="text-white text-center m-0 leading-relaxed">
                                <MoveColoredText text={item.player} />
                              </p>
                            </div>
                          )}
                          {renderWarning(item.warning)}
                          {item.variations && (
                            <div className="flex flex-col gap-2 pb-2.5">
                              {item.variations.map((v, vi) => (
                                <div
                                  key={vi}
                                  className="flex items-center justify-center gap-2 h-10 px-3 bg-neutral-800 border border-slate-700 rounded text-slate-200 cursor-pointer transition-all hover:bg-slate-700 hover:border-blue-500"
                                  onClick={() => handleStepClick(v)}
                                >
                                  <p className="m-0 text-sm font-semibold">{v.name}</p>
                                  {renderWarning(v.warning)}
                                </div>
                              ))}
                            </div>
                          )}
                        </Fragment>
                      );
                    }

                    if (item.type === "step") {
                      return (
                        <div key={index} className="flex flex-col mb-2.5">
                          {item.player && <p className="text-white mb-2">{item.player}</p>}
                          {item.variations &&
                            item.variations.map((v, vi) => (
                              <div
                                key={vi}
                                className="flex items-center justify-center gap-2 h-10 px-3 mb-2 bg-neutral-800 border border-slate-700 rounded text-slate-200 cursor-pointer transition-all hover:bg-slate-700 hover:border-blue-500"
                                onClick={() => handleStepClick(v)}
                              >
                                <p className="m-0 text-sm font-semibold">{v.name}</p>
                                {renderWarning(v.warning)}
                              </div>
                            ))}
                        </div>
                      );
                    }

                    if (!item.type && item.variations) {
                      return (
                        <div key={index} className="flex flex-col gap-2 pb-2.5">
                          {item.variations.map((v, vi) => (
                            <div
                              key={vi}
                              className="flex items-center justify-center gap-2 h-10 px-3 bg-neutral-800 border border-slate-700 rounded text-slate-200 cursor-pointer transition-all hover:bg-slate-700 hover:border-blue-500"
                              onClick={() => handleStepClick(v)}
                            >
                              <p className="m-0 text-sm font-semibold">{v.name}</p>
                              {renderWarning(v.warning)}
                            </div>
                          ))}
                        </div>
                      );
                    }

                    return null;
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

export default HoOhPage;