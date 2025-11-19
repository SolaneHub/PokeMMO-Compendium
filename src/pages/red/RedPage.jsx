import "@/pages/elite-four/EliteFourPage.css";

import React, { useCallback, useMemo, useState } from "react";

import {
  getPokemonBackground,
  getPokemonByName,
  getPokemonCardData,
} from "@/pages/pokedex/data/pokemonService";
import {
  getAllRedTrainers,
  getAvailableRedRegions,
  getPokemonListForTeam,
  getPokemonStrategy,
  getRedTrainersByRegion,
} from "@/pages/red/data/redService";
import EliteMemberCard from "@/shared/components/EliteMemberCard";
import MoveColoredText from "@/shared/components/MoveColoredText";
import PokemonCard from "@/shared/components/PokemonCard";
import RegionCard from "@/shared/components/RegionCard";
import { getDualShadow, typeBackgrounds } from "@/shared/utils/pokemonColors";

function RedPage() {
  // * ─────────────────────────────
  // * Main State Variables
  // * ─────────────────────────────
  const [selectedTeam, setSelectedTeam] = useState();
  const [selectedRegion, setSelectedRegion] = useState();
  const [selectedRed, setSelectedRed] = useState();
  const [selectedPokemon, setSelectedPokemon] = useState();
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);
  const [currentStrategyView, setCurrentStrategyView] = useState([]);
  const [strategyHistory, setStrategyHistory] = useState([]);

  // * ─────────────────────────────
  // * Strategy Logic & Reset
  // * ─────────────────────────────
  const resetStrategyStates = useCallback(() => {
    setCurrentStrategyView([]);
    setStrategyHistory([]);
  }, []);

  // * ─────────────────────────────
  // * Derived Data (Service Calls)
  // * ─────────────────────────────

  // ? Retrieve all available team names.
  // ? Assumes Red has consistent team names across regions, using the first entry as a reference.
  const allTeamNames = useMemo(() => {
    const allData = getAllRedTrainers();
    if (allData.length === 0) return [];
    return Object.keys(allData[0].teams || {}).sort();
  }, []);

  const availableRegions = useMemo(() => {
    return getAvailableRedRegions();
  }, []);

  const filteredRed = useMemo(() => {
    return getRedTrainersByRegion(selectedRegion);
  }, [selectedRegion]);

  const pokemonNamesForSelectedTeam = useMemo(() => {
    return getPokemonListForTeam(selectedRed, selectedRegion, selectedTeam);
  }, [selectedRed, selectedRegion, selectedTeam]);

  const currentPokemonObject = useMemo(() => {
    return selectedPokemon ? getPokemonByName(selectedPokemon) : null;
  }, [selectedPokemon]);

  const detailsTitleBackground = useMemo(() => {
    return selectedPokemon
      ? getPokemonBackground(selectedPokemon)
      : typeBackgrounds[""];
  }, [selectedPokemon]);

  // * ─────────────────────────────
  // * Event Handlers
  // * ─────────────────────────────
  const handleTeamClick = useCallback(
    (teamName) => {
      setSelectedTeam(teamName);
      setSelectedRegion(null);
      setSelectedRed(null);
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
      setSelectedRed(null);
      setSelectedPokemon(null);
      setIsPokemonDetailsVisible(false);
      resetStrategyStates();
    },
    [resetStrategyStates]
  );

  const handleRedClick = useCallback(
    (redName) => {
      // ! redName is passed as a string from the child component here
      setSelectedRed((prev) => (prev === redName ? null : redName));
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

      // ? Service Call: Fetch the specific strategy for the selected Pokemon
      const strategy = getPokemonStrategy(
        selectedRed,
        selectedRegion,
        selectedTeam,
        pokemonName
      );

      setCurrentStrategyView(strategy);
      setStrategyHistory([]);
    },
    [selectedRed, selectedRegion, selectedTeam]
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

      {/* Red Trainers Display */}
      {selectedRegion && filteredRed.length > 0 && (
        <div className="cards-container">
          {filteredRed.map((red, i) => {
            const redBackground =
              typeBackgrounds[red.type] || typeBackgrounds[""];
            // ? Use getDualShadow for consistency with EliteFourPage
            const redShadowColor = getDualShadow(redBackground);

            return (
              <EliteMemberCard
                key={i}
                member={red}
                onMemberClick={() => handleRedClick(red.name)}
                isSelected={selectedRed === red.name}
                background={redBackground}
                shadowColor={redShadowColor}
              />
            );
          })}
        </div>
      )}

      {/* Pokemon Cards */}
      {selectedRed && pokemonNamesForSelectedTeam.length > 0 && (
        <div className="pokemon-cards-display">
          {pokemonNamesForSelectedTeam.map((pokemonName, index) => {
            // ? Unified Service Call for card data
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

                  // * Main strategy rendering logic
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

                  // * Standard Step rendering
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

                  // * Variations without specific type
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

export default RedPage;
