import "./RaidsPage.css";

import { useEffect, useState } from "react";

import {
  getPokemonBackground,
  getPokemonCardData,
} from "@/pages/pokedex/data/pokemonService";
import {
  getActiveStrategy,
  getRaidByName,
  getRaidsByStars,
  getStarLevels,
} from "@/pages/raids/data/raidsService";
import PageTitle from "@/shared/components/PageTitle";
import PokemonCard from "@/shared/components/PokemonCard";
import { typeBackgrounds } from "@/shared/utils/pokemonColors";

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

const BuildCard = ({ buildData }) => {
  const [activeBuild, setActiveBuild] = useState(buildData);

  const allVariants = (() => {
    if (!buildData.variants) return [buildData];
    const inheritedVariants = buildData.variants.map((variant) => ({
      ...variant,
      player: variant.player || buildData.player,
      order: variant.order || buildData.order,
      turn: variant.turn || buildData.turn,
    }));
    return [buildData, ...inheritedVariants];
  })();

  if (activeBuild.name !== buildData.name && !buildData.variants) {
    setActiveBuild(buildData);
  }

  useEffect(() => {
    setActiveBuild(buildData);
  }, [buildData]);

  const { sprite } = getPokemonCardData(activeBuild.name);

  return (
    <div className="raids-build-card">
      {allVariants.length > 1 && (
        <div className="build-variants-tabs">
          {allVariants.map((variant, idx) => (
            <button
              key={idx}
              className={`variant-tab ${activeBuild.name === variant.name ? "active" : ""}`}
              onClick={() => setActiveBuild(variant)}
            >
              {variant.name}
            </button>
          ))}
        </div>
      )}

      <div className="build-card-header">
        <img src={sprite} alt={activeBuild.name} className="build-sprite" />
        <div className="build-main-info">
          <span className="build-name">{activeBuild.name}</span>
          <div className="build-roles-row">
            {activeBuild.order && (
              <span className="build-usage" style={{ color: "#ffd700" }}>
                Pokemon {activeBuild.order}
              </span>
            )}
          </div>
        </div>

        {activeBuild.item && (
          <span className="build-held-item">
            <img
              key={activeBuild.item}
              src={getItemSpriteUrl(activeBuild.item)}
              alt={activeBuild.item}
              className="item-icon"
              onError={(e) => (e.target.style.display = "none")}
            />
            {activeBuild.item}
          </span>
        )}
      </div>

      <div className="build-stats-row">
        {activeBuild.ability && (
          <span className="build-stat">
            Ability: <strong>{activeBuild.ability}</strong>
          </span>
        )}
        {activeBuild.nature && (
          <span className="build-stat">
            Nature: <strong>{activeBuild.nature}</strong>
          </span>
        )}
        {activeBuild.evs && (
          <span className="build-stat">
            EVs: <strong>{activeBuild.evs}</strong>
          </span>
        )}
        {activeBuild.ivs && (
          <span className="build-stat">
            IVs: <strong>{activeBuild.ivs}</strong>
          </span>
        )}
      </div>

      {activeBuild.moves && (
        <div className="build-moves-list">
          {activeBuild.moves.map((m, k) => (
            <span key={k} className="build-move">
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

function RaidsPage() {
  const [selectedStar, setSelectedStar] = useState();
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);

  const [activeTab, setActiveTab] = useState("Strategy");
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedTurnIndex, setSelectedTurnIndex] = useState(0);
  const [selectedStrategyIndex, setSelectedStrategyIndex] = useState(0);

  const [selectedBuildGroup, setSelectedBuildGroup] = useState(null);

  const tabs = ["Strategy", "Builds", "Mechanics", "Locations"];

  const starLevels = getStarLevels();
  const filteredRaids = getRaidsByStars(selectedStar);
  const currentRaid = selectedPokemon ? getRaidByName(selectedPokemon) : null;
  const activeTeamStrategy = getActiveStrategy(
    selectedPokemon,
    selectedStrategyIndex
  );

  const rolesSource = activeTeamStrategy?.roles || null;
  const recommendedList = activeTeamStrategy?.recommended || [];
  const detailsTitleBackground = selectedPokemon
    ? getPokemonBackground(selectedPokemon)
    : typeBackgrounds[""];

  const buildGroups = (() => {
    if (!recommendedList.length || typeof recommendedList[0] !== "object")
      return null;

    const groups = recommendedList.reduce((acc, build) => {
      const groupName = build.player || "General";
      if (!acc[groupName]) acc[groupName] = [];
      acc[groupName].push(build);
      return acc;
    }, {});

    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => {
        if (a.order && b.order) return a.order - b.order;
        return a.name.localeCompare(b.name);
      });
    });
    return groups;
  })();

  const effectiveBuildGroupKey = (() => {
    if (selectedBuildGroup && buildGroups && buildGroups[selectedBuildGroup]) {
      return selectedBuildGroup;
    }
    if (buildGroups) {
      const keys = Object.keys(buildGroups).sort();
      return keys.length > 0 ? keys[0] : null;
    }
    return null;
  })();

  useEffect(() => {
    setSelectedBuildGroup(null);
  }, [selectedPokemon, selectedStrategyIndex]);

  const closePokemonDetails = () => {
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    setSelectedRole(null);
    setSelectedTurnIndex(0);
    setSelectedStrategyIndex(0);
  };

  const handleStarClick = (star) => {
    setSelectedStar((prev) => (prev === star ? undefined : star));
    closePokemonDetails();
  };

  const handlePokemonCardClick = (pokemonName) => {
    setSelectedPokemon(pokemonName);
    setIsPokemonDetailsVisible(true);
    setSelectedRole(null);
    setSelectedTurnIndex(0);
    setSelectedStrategyIndex(0);
    setActiveTab("Strategy");
  };

  const handleRoleChange = (roleKey) => {
    setSelectedRole(roleKey);
    setSelectedTurnIndex(0);
  };

  const effectiveSelectedRole = (() => {
    if (!rolesSource) return "";
    if (selectedRole && rolesSource[selectedRole]) return selectedRole;
    if (rolesSource.player1) return "player1";
    const keys = Object.keys(rolesSource);
    return keys.length ? keys[0] : "";
  })();

  const roleOptions = rolesSource ? Object.keys(rolesSource) : [];
  const movesForSelectedRole =
    rolesSource && effectiveSelectedRole
      ? rolesSource[effectiveSelectedRole] || []
      : [];

  return (
    <div className="container raids-page">
      <PageTitle title="PokéMMO Compendium: Raids" />

      <div className="cards-container">
        {starLevels.map((star) => (
          <div
            key={star}
            className={`card team-card ${selectedStar === star ? "selected" : ""}`}
            onClick={() => handleStarClick(star)}
          >
            <p>{star}★</p>
          </div>
        ))}
      </div>

      {selectedStar && filteredRaids.length > 0 && (
        <div className="pokemon-cards-display">
          {filteredRaids.map((raid) => {
            const { sprite, background } = getPokemonCardData(raid.name);
            return (
              <PokemonCard
                key={raid.name}
                pokemonName={raid.name}
                pokemonImageSrc={sprite}
                nameBackground={background}
                onClick={() => handlePokemonCardClick(raid.name)}
                isSelected={selectedPokemon === raid.name}
              />
            );
          })}
        </div>
      )}

      {isPokemonDetailsVisible && currentRaid && (
        <div className="raids-overlay" onClick={closePokemonDetails}>
          <div className="raids-modal" onClick={(e) => e.stopPropagation()}>
            <div
              className="raids-modal-header"
              style={{ background: detailsTitleBackground }}
            >
              <h2>{currentRaid.name}</h2>
              <p>{currentRaid.stars}★ Raid</p>
            </div>

            <div className="raids-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`raids-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="raids-modal-content">
              {activeTab === "Strategy" && (
                <>
                  {currentRaid.teamStrategies &&
                    currentRaid.teamStrategies.length > 1 && (
                      <section className="raids-section raids-section-team-versions">
                        <h3 className="raids-section-title">Select Strategy</h3>
                        <div className="raids-version-buttons">
                          {currentRaid.teamStrategies.map((strategy, idx) => (
                            <button
                              key={strategy.id || idx}
                              className={`role-btn ${selectedStrategyIndex === idx ? "active" : ""}`}
                              onClick={() => {
                                setSelectedStrategyIndex(idx);
                                setSelectedRole(null);
                                setSelectedTurnIndex(0);
                              }}
                            >
                              {strategy.label || `Version ${idx + 1}`}
                            </button>
                          ))}
                        </div>
                      </section>
                    )}

                  <section className="raids-section">
                    {rolesSource && roleOptions.length > 0 ? (
                      <div className="raids-subsection-roles">
                        <h3 className="raids-section-title">Player Roles</h3>

                        <div className="raids-role-buttons">
                          {roleOptions.map((roleKey) => (
                            <button
                              key={roleKey}
                              className={`role-btn ${effectiveSelectedRole === roleKey ? "active" : ""}`}
                              onClick={() => handleRoleChange(roleKey)}
                            >
                              {roleKey === "player1"
                                ? "Player 1"
                                : roleKey.replace("player", "Player ")}
                            </button>
                          ))}
                        </div>

                        {movesForSelectedRole.length > 0 && (
                          <>
                            <div className="raids-turn-navigator">
                              <button
                                className="turn-nav-btn"
                                disabled={selectedTurnIndex === 0}
                                onClick={() =>
                                  setSelectedTurnIndex((prev) =>
                                    Math.max(0, prev - 1)
                                  )
                                }
                              >
                                ❮
                              </button>

                              <div className="turn-display-text">
                                <span className="turn-label">Turn</span>
                                <span className="turn-current">
                                  {selectedTurnIndex + 1}
                                </span>
                                <span className="turn-total">
                                  / {movesForSelectedRole.length}
                                </span>
                              </div>

                              <button
                                className="turn-nav-btn"
                                disabled={
                                  selectedTurnIndex >=
                                  movesForSelectedRole.length - 1
                                }
                                onClick={() =>
                                  setSelectedTurnIndex((prev) =>
                                    Math.min(
                                      movesForSelectedRole.length - 1,
                                      prev + 1
                                    )
                                  )
                                }
                              >
                                ❯
                              </button>
                            </div>

                            <ul className="raids-role-moves">
                              {movesForSelectedRole.map((item, idx) => (
                                <li
                                  key={idx}
                                  className={
                                    idx === selectedTurnIndex
                                      ? "raids-role-move raids-role-move--active"
                                      : "raids-role-move"
                                  }
                                  onClick={() => setSelectedTurnIndex(idx)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <span className="raids-role-move-turn">
                                    T{idx + 1}:
                                  </span>
                                  <span className="raids-role-move-text">
                                    {item}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    ) : (
                      <p className="empty-text">No strategy data available.</p>
                    )}
                  </section>
                </>
              )}

              {activeTab === "Builds" && (
                <section className="raids-section">
                  {recommendedList.length > 0 ? (
                    <>
                      <h3 className="raids-section-title">Recommended Setup</h3>
                      {buildGroups ? (
                        <>
                          <div
                            className="raids-role-buttons"
                            style={{ marginBottom: "20px" }}
                          >
                            {Object.keys(buildGroups)
                              .sort()
                              .map((groupName) => (
                                <button
                                  key={groupName}
                                  className={`role-btn ${effectiveBuildGroupKey === groupName ? "active" : ""}`}
                                  onClick={() =>
                                    setSelectedBuildGroup(groupName)
                                  }
                                >
                                  {groupName}
                                </button>
                              ))}
                          </div>

                          {effectiveBuildGroupKey &&
                            buildGroups[effectiveBuildGroupKey] && (
                              <div className="raids-builds-grid fade-in">
                                {buildGroups[effectiveBuildGroupKey].map(
                                  (build, i) => (
                                    <BuildCard key={i} buildData={build} />
                                  )
                                )}
                              </div>
                            )}
                        </>
                      ) : (
                        <ul className="raids-recommended-list">
                          {recommendedList.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <p className="empty-text">
                      No recommended builds available.
                    </p>
                  )}
                </section>
              )}

              {activeTab === "Mechanics" && currentRaid.mechanics && (
                <section className="raids-section">
                  <h3 className="raids-section-title">Boss Info</h3>
                  <div className="raids-mechanics-text">
                    {currentRaid.mechanics.ability && (
                      <p>
                        <strong>Ability:</strong>{" "}
                        {currentRaid.mechanics.ability}
                      </p>
                    )}
                    {currentRaid.mechanics.heldItem && (
                      <p>
                        <strong>Item:</strong> {currentRaid.mechanics.heldItem}
                      </p>
                    )}
                    {currentRaid.mechanics.notes && (
                      <p>
                        <strong>Notes:</strong> {currentRaid.mechanics.notes}
                      </p>
                    )}
                  </div>

                  {currentRaid.mechanics.thresholds && (
                    <div
                      className="raids-thresholds"
                      style={{ marginTop: "15px" }}
                    >
                      <h3 className="raids-section-title">HP Thresholds</h3>
                      <ul className="raids-threshold-list">
                        {Object.entries(currentRaid.mechanics.thresholds)
                          .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
                          .map(([hp, info]) => (
                            <li key={hp}>
                              <span className="raids-threshold-hp">
                                {hp}% HP
                              </span>
                              <span className="raids-threshold-effect">
                                {typeof info === "string" ? info : info?.effect}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {currentRaid.moves && (
                    <div
                      className="raids-mechanics-moves"
                      style={{ marginTop: "15px" }}
                    >
                      <h3 className="raids-section-title">Known Moves</h3>
                      <ul className="raids-move-chips">
                        {currentRaid.moves.map((move) => (
                          <li key={move}>{move}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}

              {activeTab === "Locations" && (
                <section className="raids-section">
                  <h3 className="raids-section-title">Where to find</h3>
                  {currentRaid.locations ? (
                    <div className="locations-grid">
                      {Object.entries(currentRaid.locations).map(
                        ([region, locationData]) => {
                          const areaName = locationData.area || locationData;
                          const reqs = locationData.requirements || [];
                          return (
                            <div key={region} className="location-card">
                              <div className="location-header">
                                <span className="region-name">{region}</span>
                              </div>
                              <div className="location-body">
                                <div className="loc-row">
                                  <strong className="loc-label">Area</strong>
                                  <span className="area-text">{areaName}</span>
                                </div>
                                {reqs.length > 0 && (
                                  <div className="loc-row">
                                    <strong className="loc-label">
                                      Requirements
                                    </strong>
                                    <div className="loc-badges">
                                      {reqs.map((req, k) => (
                                        <span key={k} className="loc-badge req">
                                          {req}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <p className="empty-text">No location data available.</p>
                  )}
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RaidsPage;
