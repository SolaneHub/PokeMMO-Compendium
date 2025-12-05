import "@/pages/elite-four/EliteFourPage.css";

import { useState } from "react";
import React from "react";

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
import PageTitle from "@/shared/components/PageTitle";
import PokemonCard from "@/shared/components/PokemonCard";
import RegionCard from "@/shared/components/RegionCard";
import { getDualShadow, typeBackgrounds } from "@/shared/utils/pokemonColors";

function RedPage() {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedRed, setSelectedRed] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);
  const [currentStrategyView, setCurrentStrategyView] = useState([]);
  const [strategyHistory, setStrategyHistory] = useState([]);

  const allTeamNames = (() => {
    const allData = getAllRedTrainers();
    return allData.length > 0 ? Object.keys(allData[0].teams || {}).sort() : [];
  })();

  const availableRegions = getAvailableRedRegions();
  const filteredRed = getRedTrainersByRegion(selectedRegion);
  const pokemonNamesForSelectedTeam = getPokemonListForTeam(
    selectedRed,
    selectedRegion,
    selectedTeam
  );

  const currentPokemonObject = selectedPokemon
    ? getPokemonByName(selectedPokemon)
    : null;

  const detailsTitleBackground = selectedPokemon
    ? getPokemonBackground(selectedPokemon)
    : typeBackgrounds[""];

  const resetStrategyStates = () => {
    setCurrentStrategyView([]);
    setStrategyHistory([]);
  };

  const handleTeamClick = (teamName) => {
    setSelectedTeam(teamName);
    setSelectedRegion(null);
    setSelectedRed(null);
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategyStates();
  };

  const handleRegionClick = (region) => {
    const regionName = typeof region === "object" ? region.name : region;
    setSelectedRegion((prev) => (prev === regionName ? null : regionName));

    setSelectedRed(null);
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategyStates();
  };

  const handleRedClick = (redName) => {
    setSelectedRed((prev) => (prev === redName ? null : redName));
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategyStates();
  };

  const handlePokemonCardClick = (pokemonName) => {
    setSelectedPokemon(pokemonName);
    setIsPokemonDetailsVisible(true);

    const strategy = getPokemonStrategy(
      selectedRed,
      selectedRegion,
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
      <PageTitle title="PokéMMO Compendium: Red" />

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

      {selectedRegion && filteredRed.length > 0 && (
        <div className="cards-container">
          {filteredRed.map((red, i) => {
            const redBackground =
              typeBackgrounds[red.type] || typeBackgrounds[""];
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

      {selectedRed && pokemonNamesForSelectedTeam.length > 0 && (
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
                <p>No strategy available.</p>
              ) : (
                currentStrategyView.map((item, index) => {
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

export default RedPage;
