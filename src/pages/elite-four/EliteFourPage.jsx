import React, { useCallback, useMemo, useState } from "react";

import {
  getAllEliteFourMembers,
  getMembersByRegion,
  getPokemonListForTeam,
  getPokemonStrategy,
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

function EliteFourPage() {
  // * ─────────────────────────────
  // * Main State Variables
  // * ─────────────────────────────
  const [selectedTeam, setSelectedTeam] = useState();
  const [selectedRegion, setSelectedRegion] = useState();
  const [selectedMember, setSelectedMember] = useState();
  const [selectedPokemon, setSelectedPokemon] = useState();
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);
  const [currentStrategyView, setCurrentStrategyView] = useState([]);
  const [strategyHistory, setStrategyHistory] = useState([]);

  // * ─────────────────────────────
  // * Derived Data (Logic delegated to Services)
  // * ─────────────────────────────

  // ? Retrieve all available team names (e.g., "Reckless", "Wild Taste").
  // ? Assumes consistency across members, using the first available member as reference.
  const allTeamNames = useMemo(() => {
    const members = getAllEliteFourMembers();
    if (members.length === 0) return [];
    return Object.keys(members[0].teams || {}).sort();
  }, []);

  const filteredEliteFour = useMemo(() => {
    return getMembersByRegion(selectedRegion);
  }, [selectedRegion]);

  const pokemonNamesForSelectedTeam = useMemo(() => {
    return getPokemonListForTeam(selectedMember, selectedTeam);
  }, [selectedMember, selectedTeam]);

  const currentPokemonObject = useMemo(() => {
    return selectedPokemon ? getPokemonByName(selectedPokemon) : null;
  }, [selectedPokemon]);

  // ? Calculate the dynamic background for the modal title based on Pokemon type
  const detailsTitleBackground = useMemo(() => {
    return selectedPokemon ? getPokemonBackground(selectedPokemon) : "#ccc";
  }, [selectedPokemon]);

  // * ─────────────────────────────
  // * Event Handlers
  // * ─────────────────────────────

  const resetStrategyStates = useCallback(() => {
    setCurrentStrategyView([]);
    setStrategyHistory([]);
  }, []);

  const handleTeamClick = useCallback(
    (teamName) => {
      setSelectedTeam(teamName);
      // * Reset all subordinate selections when changing the main team context
      setSelectedRegion(null);
      setSelectedMember(null);
      setSelectedPokemon(null);
      setIsPokemonDetailsVisible(false);
      resetStrategyStates();
    },
    [resetStrategyStates]
  );

  const handleRegionClick = useCallback(
    (region) => {
      const regionName = typeof region === "object" ? region.name : region;
      // ? Toggle logic: deselect if clicking the already selected region
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

      // ? Service Call: Retrieve specific strategy steps for the selected Pokemon
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
      // * Navigate deeper into strategy variations (nested steps)
      if (item?.steps && Array.isArray(item.steps)) {
        setStrategyHistory((prev) => [...prev, currentStrategyView]);
        setCurrentStrategyView(item.steps);
      }
    },
    [currentStrategyView]
  );

  const handleBackClick = useCallback(() => {
    // * Navigate back up the strategy history stack
    if (strategyHistory.length > 0) {
      setCurrentStrategyView(strategyHistory[strategyHistory.length - 1]);
      setStrategyHistory((prev) => prev.slice(0, -1));
    }
  }, [strategyHistory]);

  // * ─────────────────────────────
  // * Main JSX Render
  // * ─────────────────────────────
  return (
    <div className="container">
      {/* Team Selector */}
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

      {/* Region Selector */}
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

      {/* Elite Four Members Display */}
      {selectedRegion && filteredEliteFour.length > 0 && (
        <div className="cards-container">
          {filteredEliteFour.map((member, i) => {
            const memberBackground =
              typeBackgrounds[member.type] || typeBackgrounds[""];
            // ? Use getDualShadow to generate consistent colored shadows
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

      {/* Pokemon Cards Grid */}
      {selectedMember && pokemonNamesForSelectedTeam.length > 0 && (
        <div className="pokemon-cards-display">
          {pokemonNamesForSelectedTeam.map((pokemonName, index) => {
            // ? Service Call: Get UI data (sprite, gradient)
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

      {/* Pokemon Details Modal */}
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

                  // * Logic to render recursive strategy steps or flat lists
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
