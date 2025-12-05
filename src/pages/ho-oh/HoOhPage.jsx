import "@/pages/elite-four/EliteFourPage.css";

import React, { useCallback, useMemo, useState } from "react";

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

  const resetStrategyStates = useCallback(() => {
    setCurrentStrategyView([]);
    setStrategyHistory([]);
  }, []);

  const allTeamNames = useMemo(() => {
    const allData = getAllHoOhTrainers();
    if (allData.length === 0) return [];
    return Object.keys(allData[0].teams || {}).sort();
  }, []);

  const availableRegions = useMemo(() => {
    return getAvailableHoOhRegions();
  }, []);

  const filteredHoOh = useMemo(() => {
    return getHoOhTrainersByRegion(selectedRegion);
  }, [selectedRegion]);

  const pokemonNamesForSelectedTeam = useMemo(() => {
    return getPokemonListForTeam(selectedHoOh, selectedRegion, selectedTeam);
  }, [selectedHoOh, selectedRegion, selectedTeam]);

  const currentPokemonObject = useMemo(() => {
    return selectedPokemon ? getPokemonByName(selectedPokemon) : null;
  }, [selectedPokemon]);

  const detailsTitleBackground = useMemo(() => {
    return selectedPokemon
      ? getPokemonBackground(selectedPokemon)
      : typeBackgrounds[""];
  }, [selectedPokemon]);

  const handleTeamClick = useCallback(
    (teamName) => {
      setSelectedTeam(teamName);
      setSelectedRegion(null);
      setSelectedHoOh(null);
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
      setSelectedHoOh(null);
      setSelectedPokemon(null);
      setIsPokemonDetailsVisible(false);
      resetStrategyStates();
    },
    [resetStrategyStates]
  );

  const handleHoOhClick = useCallback(
    (hoOhName) => {
      setSelectedHoOh((prev) => (prev === hoOhName ? null : hoOhName));
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
        selectedHoOh,
        selectedRegion,
        selectedTeam,
        pokemonName
      );

      setCurrentStrategyView(strategy);
      setStrategyHistory([]);
    },
    [selectedHoOh, selectedRegion, selectedTeam]
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

      
      {selectedRegion && filteredHoOh.length > 0 && (
        <div className="cards-container">
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

export default HoOhPage;
