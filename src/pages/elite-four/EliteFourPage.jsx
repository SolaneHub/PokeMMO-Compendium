import { ArrowLeft, ArrowRight, Crown } from "lucide-react";
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
      <div className="mb-3 flex w-full">
        <div className="w-full rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-center text-sm font-medium text-red-200 shadow-sm">
          ⚠️ {warningText}
        </div>
      </div>
    ) : null;

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-24">
      <PageTitle title="PokéMMO Compendium: Elite Four" />

      {/* Header */}
      <div className="mb-8 flex flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
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
            className={`relative h-16 w-40 rounded-2xl border text-lg font-bold transition-all duration-300 ${
              selectedTeam === teamName
                ? "scale-105 border-blue-500 bg-blue-600/20 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                : "border-white/5 bg-[#1e2025] text-slate-400 hover:-translate-y-1 hover:border-white/20 hover:bg-[#25272e] hover:text-slate-200"
            } `}
          >
            {teamName}
          </button>
        ))}
      </div>

      {selectedTeam && currentTeamBuilds.length > 0 && (
        <div className="flex animate-[fade-in_0.3s_ease-out] justify-center">
          <button
            className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-105 hover:bg-blue-500 active:scale-95"
            onClick={() => setIsTeamBuildVisible(true)}
          >
            📋 View {selectedTeam} Team Build
          </button>
        </div>
      )}

      {selectedTeam && (
        <div className="animate-[fade-in_0.4s_ease-out] space-y-4">
          <h2 className="text-center text-xl font-semibold text-slate-300">
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
        <div className="animate-[fade-in_0.4s_ease-out] space-y-4">
          <h2 className="text-center text-xl font-semibold text-slate-300">
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
        <div className="animate-[fade-in_0.4s_ease-out] space-y-4">
          <h2 className="text-center text-xl font-semibold text-slate-300">
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
          className="fixed inset-0 z-[100] flex animate-[fade-in_0.2s_ease-out] items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsPokemonDetailsVisible(false)}
        >
          <div
            className="relative flex max-h-[85vh] w-[500px] max-w-[90vw] animate-[scale-in_0.3s_ease-out] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a1b20] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="z-10 flex shrink-0 justify-center p-4"
              style={{ background: detailsTitleBackground }}
            >
              <h2 className="m-0 text-xl font-bold text-[#1a1b20] drop-shadow-sm">
                {currentPokemonObject.name}
              </h2>
            </div>

            {/* Modal Content */}
            <div
              id="pokemon-details-content"
              className="flex-1 overflow-y-auto bg-[#1a1b20] p-6"
            >
              <div className="flex flex-col gap-4">
                {strategyHistory.length > 0 && (
                  <button
                    className="group mb-2 flex items-center gap-2 self-start rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                    onClick={handleBackClick}
                  >
                    <ArrowLeft
                      size={16}
                      className="text-slate-300 group-hover:opacity-100"
                    />
                    <span>Back</span>
                  </button>
                )}

                {currentStrategyView.length === 0 ? (
                  <p className="py-8 text-center text-slate-500 italic">
                    No strategy available for this Pokémon.
                  </p>
                ) : (
                  currentStrategyView.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex animate-[fade-in_0.3s_ease-out] flex-col"
                      >
                        {(item.type === "main" || item.type === "step") && (
                          <>
                            {item.player && (
                              <div
                                className={`mb-3 rounded-xl border p-4 ${
                                  item.type === "main"
                                    ? "border-white/5 bg-[#25272e] shadow-sm"
                                    : "border-transparent bg-transparent"
                                }`}
                              >
                                <p className="m-0 text-center text-base leading-relaxed text-slate-200">
                                  <MoveColoredText text={item.player} />
                                </p>
                              </div>
                            )}
                            {renderWarning(item.warning)}
                          </>
                        )}

                        {item.variations && (
                          <div className="my-2 flex flex-col gap-2.5 border-l-2 border-white/5 pl-4">
                            {item.variations.map((v, vi) => (
                              <button
                                key={vi}
                                className="group w-full rounded-xl border border-white/5 bg-[#25272e] p-3 text-left text-slate-300 transition-all hover:border-blue-500/50 hover:bg-[#2d3038] hover:text-blue-200"
                                onClick={() => handleStepClick(v)}
                              >
                                <p className="m-0 flex items-center justify-between text-sm font-semibold">
                                  <MoveColoredText text={v.name} />
                                  <ArrowRight
                                    size={16}
                                    className="text-blue-400 opacity-0 transition-opacity group-hover:opacity-100"
                                  />
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
