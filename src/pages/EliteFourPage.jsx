import EliteMemberCard from "@/components/EliteFourPage/EliteMemberCard";
import MoveColoredText from "@/components/EliteFourPage/MoveColoredText";
import PokemonCard from "@/components/EliteFourPage/PokemonCard";
import RegionCard from "@/components/EliteFourPage/RegionCard";
import React, { useCallback, useMemo, useState } from "react";

import { eliteFourMembers } from "@/data/eliteFourData";
import {
  generateDualTypeGradient, getDualShadow,
  typeBackgrounds
} from "@/data/pokemonColors";
import { pokemonData } from "@/data/pokemonData";
import { pokemonImages } from "@/data/pokemonImages";
import { pokemonRegions } from "@/data/regionData";

function EliteFourPage() {
  // ─────────────────────────────
  // Stati principali
  // ─────────────────────────────
  const [selectedTeam, setSelectedTeam] = useState();
  const [selectedRegion, setSelectedRegion] = useState();
  const [selectedMember, setSelectedMember] = useState();
  const [selectedPokemon, setSelectedPokemon] = useState();
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);
  const [currentStrategyView, setCurrentStrategyView] = useState([]);
  const [strategyHistory, setStrategyHistory] = useState([]);

  // ─────────────────────────────
  // Reset strategy
  // ─────────────────────────────
  const resetStrategyStates = useCallback(() => {
    setCurrentStrategyView([]);
    setStrategyHistory([]);
  }, []);

  // ─────────────────────────────
  // Dati derivati
  // ─────────────────────────────
  const filteredEliteFour = useMemo(() => {
    return selectedRegion
      ? eliteFourMembers.filter((m) => m.region === selectedRegion)
      : [];
  }, [selectedRegion]);

  const currentMemberObject = useMemo(() => {
    return selectedMember
      ? eliteFourMembers.find((m) => m.name === selectedMember)
      : null;
  }, [selectedMember]);

  const currentTeamData = useMemo(() => {
    return currentMemberObject?.teams?.[selectedTeam] || null;
  }, [currentMemberObject, selectedTeam]);

  const pokemonNamesForSelectedTeam = useMemo(() => {
    return currentTeamData?.pokemonNames || [];
  }, [currentTeamData]);

  const currentPokemonObject = useMemo(() => {
    return selectedPokemon
      ? pokemonData.find((p) => p.name === selectedPokemon)
      : null;
  }, [selectedPokemon]);

  const selectedPokemonTypes = useMemo(() => {
    return currentPokemonObject?.types || [];
  }, [currentPokemonObject]);

  const detailsTitleBackground = useMemo(() => {
    if (selectedPokemonTypes.length >= 2) {
      return generateDualTypeGradient(
        selectedPokemonTypes[0],
        selectedPokemonTypes[1]
      );
    }
    if (selectedPokemonTypes.length === 1) {
      return typeBackgrounds[selectedPokemonTypes[0]] || typeBackgrounds[""];
    }
    return typeBackgrounds[""];
  }, [selectedPokemonTypes]);

  // ─────────────────────────────
  // Event handlers
  // ─────────────────────────────
  const handleTeamClick = useCallback(
    (teamName) => {
      setSelectedTeam(teamName);
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

      const pokemonStrategy =
        currentMemberObject?.teams?.[selectedTeam]?.pokemonStrategies?.[
        pokemonName
        ] || [];
      setCurrentStrategyView(pokemonStrategy);
      setStrategyHistory([]);
    },
    [currentMemberObject, selectedTeam]
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

  // ─────────────────────────────
  // Render JSX
  // ─────────────────────────────
  return (
    <div className="container">
      {/* Team Selector */}
      <div className="cards-container">
        {Object.keys(eliteFourMembers[0].teams || {})
          .sort()
          .map((teamName) => (
            <div
              key={teamName}
              className={`card team-card ${selectedTeam === teamName ? "selected" : ""
                }`}
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

      {/* Elite Four Members */}
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

      {/* Pokemon Cards */}
      {selectedMember && pokemonNamesForSelectedTeam.length > 0 && (
        <div className="pokemon-cards-display">
          {pokemonNamesForSelectedTeam.map((pokemonName, index) => {
            const pokemon = pokemonData.find((p) => p.name === pokemonName) || {
              name: pokemonName,
              types: [],
            };
            let nameBackground =
              typeBackgrounds[pokemon.name] || typeBackgrounds[""];
            if (!typeBackgrounds[pokemon.name] && pokemon.types.length >= 2) {
              nameBackground = generateDualTypeGradient(
                pokemon.types[0],
                pokemon.types[1]
              );
            } else if (
              !typeBackgrounds[pokemon.name] &&
              pokemon.types.length === 1
            ) {
              nameBackground =
                typeBackgrounds[pokemon.types[0]] || typeBackgrounds[""];
            }
            return (
              <PokemonCard
                key={index}
                pokemonName={pokemon.name}
                pokemonImageSrc={pokemonImages[pokemonName]}
                onClick={() => handlePokemonCardClick(pokemon.name)}
                nameBackground={nameBackground}
                isSelected={selectedPokemon === pokemon.name}
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

                  // Main strategy
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

                  // Step normale
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

                  // Variations senza type
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
