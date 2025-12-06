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
    : "#ccc";

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

      // Scroll to top logic if needed, handled by React state re-render mostly,
      // but manual scroll might be needed if the modal content is long.
      // Tailwind/React specific scroll reset can be done via refs if necessary.
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
      <div className="w-full flex mb-2.5">
        <div className="w-full bg-gradient-to-br from-red-400 to-red-600 border border-red-500 rounded-lg shadow-md text-red-950 text-sm font-semibold p-3 text-center">
          {warningText}
        </div>
      </div>
    ) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
      <PageTitle title="PokéMMO Compendium: Elite Four" />

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

      {selectedTeam && currentTeamBuilds.length > 0 && (
        <div className="w-full flex justify-center my-4 mb-6 animate-[fade-in_0.3s_ease-out]">
          <button
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-500/15 border border-blue-500 rounded-lg text-white font-semibold uppercase tracking-wide text-sm shadow-md transition-all hover:bg-blue-500 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            onClick={() => setIsTeamBuildVisible(true)}
          >
            📋 View {selectedTeam} Team Build
          </button>
        </div>
      )}

      {selectedTeam && (
        <div className="flex flex-wrap justify-center gap-4 my-8">
          {pokemonRegions.map((region) => (
            <RegionCard
              key={region.id}
              region={region}
              onRegionClick={() => handleRegionClick(region.name)}
              isSelected={selectedRegion === region.name}
            />
          ))}
        </div>
      )}

      {selectedRegion && filteredEliteFour.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 my-8">
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
      )}

      {selectedMember && pokemonNamesForSelectedTeam.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mb-8">
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
      )}

      {isTeamBuildVisible && (
        <TeamBuildModal
          teamName={selectedTeam}
          builds={currentTeamBuilds}
          onClose={() => setIsTeamBuildVisible(false)}
        />
      )}

      {isPokemonDetailsVisible && currentPokemonObject && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 backdrop-blur-sm animate-[fade-in_0.3s_ease-out_forwards]"
          onClick={() => setIsPokemonDetailsVisible(false)}
        >
          <div
            className="relative w-[500px] max-w-[95vw] max-h-[90vh] flex flex-col bg-slate-800 rounded-lg shadow-2xl overflow-hidden animate-[scale-in_0.4s_ease-out_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex justify-center p-4 shadow-md z-10 shrink-0"
              style={{ background: detailsTitleBackground }}
            >
              <h2 className="text-slate-900 font-bold text-xl m-0">
                {currentPokemonObject.name}
              </h2>
            </div>

            <div
              id="pokemon-details-content"
              className="flex-1 overflow-y-auto p-5 bg-slate-800"
            >
              <div className="flex flex-col gap-3">
                {strategyHistory.length > 0 && (
                  <button
                    className="w-full mb-2.5 px-4 py-2 bg-neutral-900 border border-slate-700 rounded-lg text-white font-semibold hover:bg-slate-700 hover:border-blue-500 transition-all text-left flex items-center gap-2"
                    onClick={handleBackClick}
                  >
                    ⬅️ Back
                  </button>
                )}

                {currentStrategyView.length === 0 ? (
                  <p className="text-slate-400 text-center italic">
                    No strategy available for this Pokémon.
                  </p>
                ) : (
                  currentStrategyView.map((item, index) => {
                    return (
                      <div key={index} className="flex flex-col">
                        {(item.type === "main" || item.type === "step") && (
                          <>
                            {item.player && (
                              <div
                                className={`flex justify-center mb-2.5 px-3 py-3 rounded-lg ${
                                  item.type === "main"
                                    ? "bg-neutral-800 shadow-sm"
                                    : "bg-transparent"
                                }`}
                              >
                                <p className="text-white text-center m-0 leading-relaxed">
                                  <MoveColoredText text={item.player} />
                                </p>
                              </div>
                            )}
                            {renderWarning(item.warning)}
                          </>
                        )}

                        {item.variations && (
                          <div className="flex flex-col gap-2 pb-2.5">
                            {item.variations.map((v, vi) => (
                              <div
                                key={vi}
                                className="flex items-center justify-center gap-2 h-10 px-3 bg-neutral-800 border border-slate-700 rounded text-slate-200 cursor-pointer transition-all hover:bg-slate-700 hover:border-blue-500"
                                onClick={() => handleStepClick(v)}
                              >
                                <p className="m-0 text-sm font-semibold">
                                  {v.name}
                                </p>
                                {renderWarning(v.warning)}
                              </div>
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
