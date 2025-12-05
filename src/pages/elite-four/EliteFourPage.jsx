import "./EliteFourPage.css";
import "../raids/RaidsPage.css";

import { useState } from "react";

import {
  getAllEliteFourMembers,
  getMembersByRegion,
  getPokemonListForTeam,
  getPokemonStrategy,
  getTeamBuilds,
} from "@/pages/elite-four/data/eliteFourService";
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

import TeamBuildModal from "./TeamBuildModal";

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

      const modalContent = document.querySelector(".pokemon-details-card");
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
      <div className="strategy-warning-row">
        <div className="strategy-warning">{warningText}</div>
      </div>
    ) : null;

  return (
    <div className="container">
      <PageTitle title="PokéMMO Compendium: Elite Four" />

      <div className="cards-container">
        {allTeamNames.map((teamName) => (
          <div
            key={teamName}
            className={`card team-card ${selectedTeam === teamName ? "selected" : ""}`}
            onClick={() => handleTeamClick(teamName)}
          >
            <p>{teamName}</p>
          </div>
        ))}
      </div>

      {selectedTeam && currentTeamBuilds.length > 0 && (
        <div className="team-info-bar fade-in">
          <button
            className="team-info-btn"
            onClick={() => setIsTeamBuildVisible(true)}
          >
            📋 View {selectedTeam} Team Build
          </button>
        </div>
      )}

      {selectedTeam && (
        <div className="cards-container">
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
        <div className="cards-container">
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
        <div className="pokemon-cards-display">
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
          className="overlay"
          onClick={() => setIsPokemonDetailsVisible(false)}
        >
          <div
            className="pokemon-details-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="pokemon-details-title-wrapper"
              style={{ background: detailsTitleBackground }}
            >
              <h2>{currentPokemonObject.name}</h2>
            </div>

            <div className="menu-content">
              {strategyHistory.length > 0 && (
                <button className="back-button" onClick={handleBackClick}>
                  ⬅️ Back
                </button>
              )}

              {currentStrategyView.length === 0 ? (
                <p>No strategy available for this Pokémon.</p>
              ) : (
                currentStrategyView.map((item, index) => {
                  return (
                    <div key={index} className="strategy-block">
                      {(item.type === "main" || item.type === "step") && (
                        <>
                          {item.player && (
                            <div
                              className={
                                item.type === "main"
                                  ? "strategy-step-main"
                                  : "strategy-step"
                              }
                            >
                              <p>
                                <MoveColoredText text={item.player} />
                              </p>
                            </div>
                          )}
                          {renderWarning(item.warning)}
                        </>
                      )}

                      {item.variations && (
                        <div className="variation-group">
                          {item.variations.map((v, vi) => (
                            <div
                              key={vi}
                              className="strategy-variation-as-button"
                              onClick={() => handleStepClick(v)}
                            >
                              <p>{v.name}</p>
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
      )}
    </div>
  );
}

export default EliteFourPage;
