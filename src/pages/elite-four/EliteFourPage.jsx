import { Crown } from "lucide-react";
import { useState } from "react";

import {
  getAllEliteFourMembers,
  getMembersByRegion,
  getPokemonListForTeam,
  getPokemonStrategy,
  getTeamBuilds,
} from "@/pages/elite-four/data/eliteFourService";
import TeamBuildModal from "@/pages/elite-four/TeamBuildModal";
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
import { pokemonRegions } from "@/shared/utils/regionData";

function EliteFourPage() {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);
  const [isTeamBuildVisible, setIsTeamBuildVisible] = useState(false);
  const [currentStrategyView, setCurrentStrategyView] = useState([]);
  const [strategyHistory, setStrategyHistory] = useState([]);

  const allTeamNames = (() => {
    const members = getAllEliteFourMembers();
    return members.length > 0 ? Object.keys(members[0].teams || {}).sort() : [];
  })();

  const currentTeamBuilds = getTeamBuilds ? getTeamBuilds(selectedTeam) : [];
  const filteredEliteFour = getMembersByRegion(selectedRegion);
  const pokemonNamesForSelectedTeam = getPokemonListForTeam(
    selectedMember,
    selectedTeam
  );

  const currentPokemonObject = selectedPokemon
    ? getPokemonByName(selectedPokemon)
    : null;
  const detailsTitleBackground = selectedPokemon
    ? getPokemonBackground(selectedPokemon)
    : "#333";

  const resetStrategyStates = () => {
    setCurrentStrategyView([]);
    setStrategyHistory([]);
  };

  const handleTeamClick = (teamName) => {
    setSelectedTeam(teamName);
    setSelectedRegion(null);
    setSelectedMember(null);
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    setIsTeamBuildVisible(false);
    resetStrategyStates();
  };

  const handleRegionClick = (region) => {
    const regionName = typeof region === "object" ? region.name : region;
    setSelectedRegion((prev) => (prev === regionName ? null : regionName));

    setSelectedMember(null);
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategyStates();
  };

  const handleMemberClick = (member) => {
    const memberName = typeof member === "object" ? member.name : member;
    setSelectedMember((prev) => (prev === memberName ? null : memberName));

    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategyStates();
  };

  const handlePokemonCardClick = (pokemonName) => {
    setSelectedPokemon(pokemonName);
    setIsPokemonDetailsVisible(true);

    const strategy = getPokemonStrategy(
      selectedMember,
      selectedTeam,
      pokemonName
    );
    setCurrentStrategyView(strategy);
    setStrategyHistory([]);
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
      <PageTitle title="PokéMMO Compendium: Elite Four" />

      {/* Header */}
      <div className="flex flex-col items-center mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Crown className="text-yellow-500" size={32} />
          Elite Four Strategy
        </h1>
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

      {selectedTeam && currentTeamBuilds.length > 0 && (
        <div className="flex justify-center animate-[fade-in_0.3s_ease-out]">
          <button
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-900/20 transition-all hover:scale-105 active:scale-95"
            onClick={() => setIsTeamBuildVisible(true)}
          >
            📋 View {selectedTeam} Team Build
          </button>
        </div>
      )}

      {selectedTeam && (
        <div className="space-y-4 animate-[fade-in_0.4s_ease-out]">
          <h2 className="text-xl font-semibold text-slate-300 text-center">
            Select Region
          </h2>
          <div className="flex flex-wrap justify-center gap-5">
            {pokemonRegions.map((region) => (
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

      {selectedRegion && filteredEliteFour.length > 0 && (
        <div className="space-y-4 animate-[fade-in_0.4s_ease-out]">
          <h2 className="text-xl font-semibold text-slate-300 text-center">
            Select Member
          </h2>
          <div className="flex flex-wrap justify-center gap-5">
            {filteredEliteFour.map((member) => {
              const memberBackground =
                typeBackgrounds[member.type] || typeBackgrounds[""];
              const shadowStyle = getDualShadow(memberBackground);
              return (
                <EliteMemberCard
                  key={member.name}
                  member={member}
                  onMemberClick={() => handleMemberClick(member.name)}
                  isSelected={selectedMember === member.name}
                  background={memberBackground}
                  shadowColor={shadowStyle}
                />
              );
            })}
          </div>
        </div>
      )}

      {selectedMember && pokemonNamesForSelectedTeam.length > 0 && (
        <div className="space-y-4 animate-[fade-in_0.4s_ease-out]">
          <h2 className="text-xl font-semibold text-slate-300 text-center">
            Select Opponent Pokémon
          </h2>
          <div className="flex flex-wrap justify-center gap-5">
            {pokemonNamesForSelectedTeam.map((pokemonName) => {
              const { sprite, background } = getPokemonCardData(pokemonName);
              return (
                <PokemonCard
                  key={pokemonName}
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

      {isTeamBuildVisible && (
        <TeamBuildModal
          teamName={selectedTeam}
          builds={currentTeamBuilds}
          onClose={() => setIsTeamBuildVisible(false)}
        />
      )}

      {/* Strategy Modal */}
      {isPokemonDetailsVisible && currentPokemonObject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"
          onClick={() => setIsPokemonDetailsVisible(false)}
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
                    No strategy available for this Pokémon.
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

export default EliteFourPage;
