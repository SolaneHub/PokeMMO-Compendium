import "./RaidsPage.css";

import React, { useCallback, useEffect, useMemo, useState } from "react";

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
import PokemonCard from "@/shared/components/PokemonCard";
import { typeBackgrounds } from "@/shared/utils/pokemonColors";

// * HELPER: Genera URL per gli sprite degli strumenti
const getItemSpriteUrl = (itemName) => {
  if (!itemName) return null;

  const formattedName = itemName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/['’]/g, "")
    .replace(/\./g, "");

  // Percorso relativo alla cartella public del progetto
  return `/PokeMMO-Compendium/items/${formattedName}.png`;
};

// * COMPONENTE: BuildCard
// Gestisce la visualizzazione della build singola e delle sue varianti (Mini-Tabs)
const BuildCard = ({ buildData }) => {
  // Stato locale per switchare tra la build principale e le varianti
  const [activeBuild, setActiveBuild] = useState(buildData);

  // Memoizza la lista completa (Principale + Varianti) con EREDITARIETÀ
  const allVariants = useMemo(() => {
    if (!buildData.variants) return [buildData];

    // Mappa le varianti ereditando i dati contestuali (Player, Order) dal padre
    const inheritedVariants = buildData.variants.map((variant) => ({
      ...variant,
      // Se la variante non specifica player/order, usa quelli del padre
      player: variant.player || buildData.player,
      order: variant.order || buildData.order,
      // Puoi ereditare anche altro se serve (es. turn)
      turn: variant.turn || buildData.turn,
    }));

    return [buildData, ...inheritedVariants];
  }, [buildData]);

  // Resetta alla build principale se cambiano i dati padre
  useEffect(() => {
    setActiveBuild(buildData);
  }, [buildData]);

  const { sprite } = getPokemonCardData(activeBuild.name);

  return (
    <div className="raids-build-card">
      {/* SELETTORE VARIANTI (Solo se ce n'è più di una) */}
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

      {/* HEADER CARD */}
      <div className="build-card-header">
        <img src={sprite} alt={activeBuild.name} className="build-sprite" />
        <div className="build-main-info">
          <span className="build-name">{activeBuild.name}</span>

          <div className="build-roles-row">
            {/* MOSTRA ORDINE (Pokemon 1, 2, 3...) */}
            {activeBuild.order && (
              <span className="build-usage" style={{ color: "#ffd700" }}>
                Pokemon {activeBuild.order}
              </span>
            )}
          </div>
        </div>

        {/* Item Chip */}
        {activeBuild.item && (
          <span className="build-held-item">
            <img
              key={activeBuild.item} // Key per forzare il refresh dell'immagine al cambio
              src={getItemSpriteUrl(activeBuild.item)}
              alt={activeBuild.item}
              className="item-icon"
              onError={(e) => (e.target.style.display = "none")}
            />
            {activeBuild.item}
          </span>
        )}
      </div>

      {/* STATS ROW (Ability, Nature, EVs, IVs) */}
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

      {/* MOVES LIST */}
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

  // Stato per il filtro dei gruppi nella tab Builds
  const [selectedBuildGroup, setSelectedBuildGroup] = useState(null);

  const tabs = ["Strategy", "Builds", "Mechanics", "Locations" /*, "Drops"*/];

  // Data fetching
  const starLevels = useMemo(() => getStarLevels(), []);

  const filteredRaids = useMemo(() => {
    return getRaidsByStars(selectedStar);
  }, [selectedStar]);

  const currentRaid = useMemo(() => {
    return selectedPokemon ? getRaidByName(selectedPokemon) : null;
  }, [selectedPokemon]);

  const activeTeamStrategy = useMemo(() => {
    return getActiveStrategy(selectedPokemon, selectedStrategyIndex);
  }, [selectedPokemon, selectedStrategyIndex]);

  const rolesSource = useMemo(
    () => activeTeamStrategy?.roles || null,
    [activeTeamStrategy]
  );

  const recommendedList = useMemo(
    () => activeTeamStrategy?.recommended || [],
    [activeTeamStrategy]
  );

  // ! Logica di raggruppamento e ORDINAMENTO (Basato SOLO su Player e Order)
  const buildGroups = useMemo(() => {
    if (!recommendedList.length || typeof recommendedList[0] !== "object") {
      return null;
    }

    // 1. Raggruppa per PLAYER (es. "Player 1", "Player 2")
    const groups = recommendedList.reduce((acc, build) => {
      const groupName = build.player || "General";
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(build);
      return acc;
    }, {});

    // 2. Ordina le card dentro ogni gruppo per ORDER
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => {
        // Se entrambi hanno 'order', usa quello
        if (a.order && b.order) {
          return a.order - b.order;
        }
        // Fallback per nome se manca l'ordine
        return a.name.localeCompare(b.name);
      });
    });

    return groups;
  }, [recommendedList]);

  // Effetto per selezionare automaticamente il primo gruppo quando cambiano i dati
  useEffect(() => {
    if (buildGroups) {
      // Ordina le chiavi (Player 1, Player 2...)
      const groupKeys = Object.keys(buildGroups).sort();
      if (groupKeys.length > 0) {
        setSelectedBuildGroup(groupKeys[0]);
      }
    }
  }, [buildGroups]);

  const detailsTitleBackground = useMemo(() => {
    return selectedPokemon
      ? getPokemonBackground(selectedPokemon)
      : typeBackgrounds[""];
  }, [selectedPokemon]);

  const handleStarClick = useCallback((star) => {
    setSelectedStar((prev) => (prev === star ? undefined : star));
    closePokemonDetails();
  }, []);

  const handlePokemonCardClick = useCallback((pokemonName) => {
    setSelectedPokemon(pokemonName);
    setIsPokemonDetailsVisible(true);
    setSelectedRole(null);
    setSelectedTurnIndex(0);
    setSelectedStrategyIndex(0);
    setActiveTab("Strategy");
  }, []);

  const closePokemonDetails = useCallback(() => {
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    setSelectedRole(null);
    setSelectedTurnIndex(0);
    setSelectedStrategyIndex(0);
  }, []);

  const handleRoleChange = useCallback((roleKey) => {
    setSelectedRole(roleKey);
    setSelectedTurnIndex(0);
  }, []);

  const effectiveSelectedRole = useMemo(() => {
    if (!rolesSource) return "";
    if (selectedRole && rolesSource[selectedRole]) return selectedRole;
    if (rolesSource.player1) return "player1";
    const keys = Object.keys(rolesSource);
    return keys.length ? keys[0] : "";
  }, [selectedRole, rolesSource]);

  const roleOptions = useMemo(() => {
    return rolesSource ? Object.keys(rolesSource) : [];
  }, [rolesSource]);

  const movesForSelectedRole = useMemo(() => {
    if (!rolesSource || !effectiveSelectedRole) return [];
    return rolesSource[effectiveSelectedRole] || [];
  }, [rolesSource, effectiveSelectedRole]);

  return (
    <div className="container raids-page">
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
            {/* HEADER */}
            <div
              className="raids-modal-header"
              style={{ background: detailsTitleBackground }}
            >
              <h2>{currentRaid.name}</h2>
              <p>{currentRaid.stars}★ Raid</p>
            </div>

            {/* TABS NAVIGATION */}
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

            {/* SCROLLABLE CONTENT */}
            <div className="raids-modal-content">
              {/* --- TAB: STRATEGY --- */}
              {activeTab === "Strategy" && (
                <>
                  {/* Version Selector (BOTTONI) */}
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

                        {/* Role Buttons */}
                        <div className="raids-role-buttons">
                          {roleOptions.map((roleKey) => (
                            <button
                              key={roleKey}
                              className={`role-btn ${effectiveSelectedRole === roleKey ? "active" : ""}`}
                              onClick={() => handleRoleChange(roleKey)}
                            >
                              {roleKey === "player1"
                                ? "Player 1"
                                : roleKey === "player2"
                                  ? "Player 2"
                                  : roleKey === "player3"
                                    ? "Player 3"
                                    : roleKey === "player4"
                                      ? "Player 4"
                                      : roleKey}
                            </button>
                          ))}
                        </div>

                        {movesForSelectedRole.length > 0 && (
                          <>
                            {/* Turn Navigator */}
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

                            {/* Moves List */}
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

              {/* --- TAB: BUILDS --- */}
              {activeTab === "Builds" && (
                <section className="raids-section">
                  {recommendedList.length > 0 ? (
                    <>
                      <h3 className="raids-section-title">Recommended Setup</h3>

                      {/* SE SONO CARD (NUOVO FORMATO) */}
                      {buildGroups ? (
                        <>
                          {/* 1. BOTTONI FILTRO */}
                          <div
                            className="raids-role-buttons"
                            style={{ marginBottom: "20px" }}
                          >
                            {Object.keys(buildGroups)
                              .sort() // <--- QUESTO ORDINA I BOTTONI ALFABETICAMENTE (Player 1, Player 2...)
                              .map((groupName) => (
                                <button
                                  key={groupName}
                                  className={`role-btn ${selectedBuildGroup === groupName ? "active" : ""}`}
                                  onClick={() =>
                                    setSelectedBuildGroup(groupName)
                                  }
                                >
                                  {groupName}
                                </button>
                              ))}
                          </div>

                          {/* 2. GRIGLIA BUILD */}
                          {selectedBuildGroup &&
                            buildGroups[selectedBuildGroup] && (
                              <div className="raids-builds-grid fade-in">
                                {buildGroups[selectedBuildGroup].map(
                                  (build, i) => (
                                    <BuildCard key={i} buildData={build} />
                                  )
                                )}
                              </div>
                            )}
                        </>
                      ) : (
                        /* FALLBACK: Vecchio stile (lista semplice) */
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

              {/* --- TAB: MECHANICS --- */}
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

              {/* --- TAB: LOCATIONS --- */}
              {activeTab === "Locations" && (
                <section className="raids-section">
                  <h3 className="raids-section-title">Where to find</h3>
                  {currentRaid.locations ? (
                    <div className="locations-grid">
                      {Object.entries(currentRaid.locations).map(
                        ([region, locationData]) => {
                          const areaName = locationData.area || locationData;
                          const reqs = locationData.requirements || [];
                          // Nota: drops rimosso da qui

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

                                {/* Solo Requisiti (MN) */}
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

              {/* --- TAB: DROPS (LOOT) --- */}
              {/* {activeTab === "Drops" && (
                <section className="raids-section">
                  <h3 className="raids-section-title">Possible Rewards</h3>

                  {currentRaid.drops && currentRaid.drops.length > 0 ? (
                    <div className="drops-grid">
                      {currentRaid.drops.map((item, i) => (
                        <div key={i} className="drop-card">
                          <img
                            src={getItemSpriteUrl(item)}
                            alt={item}
                            className="drop-card-icon"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                          <span className="drop-name">{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-text">No drop information available.</p>
                  )}
                </section>
              )} */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RaidsPage;
