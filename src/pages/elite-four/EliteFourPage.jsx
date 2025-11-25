import "./EliteFourPage.css";
import "../raids/RaidsPage.css";

import React, { useCallback, useMemo, useState } from "react";

import {
  getAllEliteFourMembers,
  getMembersByRegion,
  getPokemonListForTeam,
  getPokemonStrategy,
  getTeamBuilds, // Assicurati di aver aggiunto questa funzione nel service come discusso!
} from "@/pages/elite-four/data/eliteFourService";
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
import { pokemonRegions } from "@/shared/utils/regionData";

// * ─────────────────────────────
// * HELPER & SUB-COMPONENTS
// * ─────────────────────────────

// Helper per URL sprite strumenti
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

// Componente Card Singola Build (Stile Raids)
const PlayerBuildCard = ({ build }) => {
  const { sprite } = getPokemonCardData(build.name);

  return (
    <div className="raids-build-card">
      {/* Header */}
      <div className="build-card-header">
        <img src={sprite} alt={build.name} className="build-sprite" />
        <div className="build-main-info">
          <span className="build-name">{build.name}</span>
        </div>

        {/* Item */}
        {build.item && (
          <span className="build-held-item">
            <img
              src={getItemSpriteUrl(build.item)}
              alt={build.item}
              className="item-icon"
              onError={(e) => (e.target.style.display = "none")}
            />
            {build.item}
          </span>
        )}
      </div>

      {/* Stats Row */}
      <div className="build-stats-row">
        {build.ability && (
          <span className="build-stat">
            Ability: <strong>{build.ability}</strong>
          </span>
        )}
        {build.nature && (
          <span className="build-stat">
            Nature: <strong>{build.nature}</strong>
          </span>
        )}
        {build.evs && (
          <span className="build-stat">
            EVs: <strong>{build.evs}</strong>
          </span>
        )}
      </div>

      {/* Moves List */}
      {build.moves && (
        <div className="build-moves-list">
          {build.moves.map((m, k) => (
            <span key={k} className="build-move">
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente Modale Team Build
const TeamBuildModal = ({ teamName, builds, onClose }) => {
  if (!builds || builds.length === 0) return null;

  return (
    <div className="raids-overlay" onClick={onClose}>
      <div className="raids-modal" onClick={(e) => e.stopPropagation()}>
        <div className="raids-modal-header" style={{ background: "#2a2b30" }}>
          <h2>{teamName} Setup</h2>
          <p>Player Team Configuration</p>
        </div>

        <div className="raids-modal-content">
          <div className="raids-builds-grid fade-in">
            {builds.map((build, idx) => (
              <PlayerBuildCard key={idx} build={build} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// * ─────────────────────────────
// * MAIN COMPONENT
// * ─────────────────────────────

function EliteFourPage() {
  const [selectedTeam, setSelectedTeam] = useState();
  const [selectedRegion, setSelectedRegion] = useState();
  const [selectedMember, setSelectedMember] = useState();
  const [selectedPokemon, setSelectedPokemon] = useState();
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);

  // Nuovo stato per la modale del Team Player
  const [isTeamBuildVisible, setIsTeamBuildVisible] = useState(false);

  const [currentStrategyView, setCurrentStrategyView] = useState([]);
  const [strategyHistory, setStrategyHistory] = useState([]);

  // * Derived Data
  const allTeamNames = useMemo(() => {
    const members = getAllEliteFourMembers();
    if (members.length === 0) return [];
    return Object.keys(members[0].teams || {}).sort();
  }, []);

  // Recupera le build per il team selezionato (Player)
  const currentTeamBuilds = useMemo(() => {
    return getTeamBuilds ? getTeamBuilds(selectedTeam) : [];
  }, [selectedTeam]);

  const filteredEliteFour = useMemo(() => {
    return getMembersByRegion(selectedRegion);
  }, [selectedRegion]);

  const pokemonNamesForSelectedTeam = useMemo(() => {
    return getPokemonListForTeam(selectedMember, selectedTeam);
  }, [selectedMember, selectedTeam]);

  const currentPokemonObject = useMemo(() => {
    return selectedPokemon ? getPokemonByName(selectedPokemon) : null;
  }, [selectedPokemon]);

  const detailsTitleBackground = useMemo(() => {
    return selectedPokemon ? getPokemonBackground(selectedPokemon) : "#ccc";
  }, [selectedPokemon]);

  // * Handlers
  const resetStrategyStates = useCallback(() => {
    setCurrentStrategyView([]);
    setStrategyHistory([]);
  }, []);

  const handleTeamClick = useCallback(
    (teamName) => {
      setSelectedTeam(teamName);
      setSelectedRegion(null);
      setSelectedMember(null);
      setSelectedPokemon(null);
      setIsPokemonDetailsVisible(false);
      setIsTeamBuildVisible(false); // Resetta modale team
      resetStrategyStates();
    },
    [resetStrategyStates]
  );

  const handleRegionClick = useCallback(
    (region) => {
      const regionName = typeof region === "object" ? region.name : region;
      setSelectedRegion((prev) => (prev === regionName ? null : regionName));
      setSelectedMember(null);
      setSelectedPokemon(null);
      setIsPokemonDetailsVisible(false);
      resetStrategyStates();
    },
    [resetStrategyStates]
  );

  const handleMemberClick = useCallback(
    (member) => {
      const memberName = typeof member === "object" ? member.name : member;
      setSelectedMember((prev) => (prev === memberName ? null : memberName));
      setSelectedPokemon(null);
      setIsPokemonDetailsVisible(false);
      resetStrategyStates();
    },
    [resetStrategyStates]
  );

  const handlePokemonCardClick = useCallback(
    (pokemonName) => {
      setSelectedPokemon(pokemonName);
      setIsPokemonDetailsVisible(true);
      const strategy = getPokemonStrategy(
        selectedMember,
        selectedTeam,
        pokemonName
      );
      setCurrentStrategyView(strategy);
      setStrategyHistory([]);
    },
    [selectedMember, selectedTeam]
  );

  const closePokemonDetails = useCallback(() => {
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategyStates();
  }, [resetStrategyStates]);

  const handleStepClick = useCallback(
    (item) => {
      if (item?.steps && Array.isArray(item.steps)) {
        setStrategyHistory((prev) => [...prev, currentStrategyView]);
        setCurrentStrategyView(item.steps);
      }
    },
    [currentStrategyView]
  );

  const handleBackClick = useCallback(() => {
    if (strategyHistory.length > 0) {
      setCurrentStrategyView(strategyHistory[strategyHistory.length - 1]);
      setStrategyHistory((prev) => prev.slice(0, -1));
    }
  }, [strategyHistory]);

  return (
    <div className="container">
      {/* 1. Team Selector */}
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

      {/* 2. Team Build Button (NUOVO) */}
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

      {/* 3. Region Selector */}
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

      {/* 4. Elite Four Members */}
      {selectedRegion && filteredEliteFour.length > 0 && (
        <div className="cards-container">
          {filteredEliteFour.map((member, i) => {
            const memberBackground =
              typeBackgrounds[member.type] || typeBackgrounds[""];
            const shadowStyle = getDualShadow(memberBackground);
            return (
              <EliteMemberCard
                key={i}
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

      {/* 5. Pokemon Cards Grid */}
      {selectedMember && pokemonNamesForSelectedTeam.length > 0 && (
        <div className="pokemon-cards-display">
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

      {/* 6. MODALE: Team Build (NUOVA) */}
      {isTeamBuildVisible && (
        <TeamBuildModal
          teamName={selectedTeam}
          builds={currentTeamBuilds}
          onClose={() => setIsTeamBuildVisible(false)}
        />
      )}

      {/* 7. MODALE: Pokemon Details (Esistente) */}
      {isPokemonDetailsVisible && currentPokemonObject && (
        <div className="overlay" onClick={closePokemonDetails}>
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
                  Back
                </button>
              )}

              {currentStrategyView.length === 0 ? (
                <p>No strategy available</p>
              ) : (
                currentStrategyView.map((item, index) => {
                  const renderWarning = (warningText) =>
                    warningText ? (
                      <div className="strategy-warning-row">
                        <div className="strategy-warning">{warningText}</div>
                      </div>
                    ) : null;

                  if (item.type === "main") {
                    return (
                      <React.Fragment key={index}>
                        {item.player && (
                          <div className="strategy-step-main">
                            <p>
                              <MoveColoredText text={item.player} />
                            </p>
                          </div>
                        )}
                        {renderWarning(item.warning)}
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
                      </React.Fragment>
                    );
                  }

                  if (item.type === "step") {
                    return (
                      <div key={index} className="strategy-step">
                        {item.player && <p>{item.player}</p>}
                        {item.variations &&
                          item.variations.map((v, vi) => (
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
                    );
                  }

                  if (!item.type && item.variations) {
                    return (
                      <div key={index} className="variation-group">
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
                    );
                  }
                  return null;
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
