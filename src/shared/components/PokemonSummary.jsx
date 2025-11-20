import "./PokemonSummary.css";

import React, { useEffect, useMemo, useState } from "react";

import {
  getPokemonCardData,
  getPokemonFullDetails,
} from "@/pages/pokedex/data/pokemonService";
import { typeBackgrounds } from "@/shared/utils/pokemonColors";
import { calculateDefenses } from "@/shared/utils/typeUtils";

// * Minimal initial state for loading
const initialLoadingState = { name: null, id: null };

const getTypePillStyle = (typeName) => {
  const backgroundStyle = typeBackgrounds[typeName] || typeBackgrounds[""];
  return { background: backgroundStyle };
};

/* * Component: PokemonSummary (Modal View)
 * This component displays the detailed view of a selected Pokémon.
 * It handles fetching data, managing tab navigation, and rendering specific details.
 */
const PokemonSummary = ({ pokemonName, onClose, onSelectPokemon }) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [pokemonData, setPokemonData] = useState(initialLoadingState);
  const [moveSearch, setMoveSearch] = useState("");

  // * Memoized calculation of Type Defenses (Weakness/Resistance)
  const defenses = useMemo(() => {
    if (!pokemonData || !pokemonData.types) return null;
    return calculateDefenses(pokemonData.types);
  }, [pokemonData]);

  // ? Helper function to group types by their damage multiplier (e.g., 4x, 0.5x)
  const getTypesByMultiplier = (mult) => {
    if (!defenses) return [];
    return Object.entries(defenses)
      .filter(([, val]) => val === mult)
      .map(([type]) => type);
  };

  const tabs = ["Overview", "Stats", "Moves", "Locations", "Evolutions"];

  // ? Helper function to format the Pokedex ID (e.g., #001)
  const formatPokedexId = (id) => {
    if (id && (typeof id === "number" || !isNaN(Number(id)))) {
      return `#${String(id).padStart(3, "0")}`;
    }
    return "???"; // Show "???" if ID is null or not a number
  };

  // * Fetch Logic (Synchronous Service Simulation)
  useEffect(() => {
    // ! Reset to loading state on prop change
    setPokemonData(initialLoadingState);
    setMoveSearch("");
    setActiveTab("Overview");

    if (!pokemonName) return;

    // ? Use setTimeout to simulate network delay and show the loading state
    const timer = setTimeout(() => {
      const data = getPokemonFullDetails(pokemonName);
      setPokemonData(data);
    }, 50);

    return () => clearTimeout(timer); // Cleanup timer on unmount/re-run
  }, [pokemonName]);

  // ? Move filter logic
  const filteredMoves = useMemo(() => {
    if (!pokemonData || !pokemonData.moves) return [];

    const movesArray = pokemonData.moves;
    if (!moveSearch) return movesArray;

    return movesArray.filter((m) =>
      m.name.toLowerCase().includes(moveSearch.toLowerCase())
    );
  }, [moveSearch, pokemonData.moves]);

  // * ─────────────────────────────
  // * RENDER FLOW MANAGEMENT
  // * ─────────────────────────────

  // ! 1. Loading State (show while data is being prepared)
  if (pokemonData.name === null) {
    return (
      <div className="summary-overlay" onClick={onClose}>
        <div
          className="summary-card loading"
          onClick={(e) => e.stopPropagation()}
        >
          <p style={{ textAlign: "center", margin: "auto", color: "#007bff" }}>
            Loading details for {pokemonName}...
          </p>
        </div>
      </div>
    );
  }

  // ! 2. Error/Fallback State (if the service returns the structure but ID is null)
  if (pokemonData.id === null) {
    return (
      <div className="summary-overlay" onClick={onClose}>
        <div
          className="summary-card error-fallback"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="summary-header" style={{ background: "#3a3b3d" }}>
            <h2>Pokémon Not Available</h2>
            <button className="summary-close-btn" onClick={onClose}>
              ×
            </button>
          </div>
          <div
            className="summary-body"
            style={{ textAlign: "center", padding: "50px 20px", color: "#ccc" }}
          >
            <p style={{ fontSize: "1.1rem" }}>
              Full details for **{pokemonData.name}** are not available yet.
            </p>
            <p style={{ fontSize: "0.9rem" }}>
              Please verify that data has been added to the JSON file and try
              again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // * 3. Normal Render (Valid Data)
  return (
    <div className="summary-overlay" onClick={onClose}>
      <div className="summary-card" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div
          className="summary-header"
          style={{ background: pokemonData.background }}
        >
          <h2>
            <span className="id-badge">{formatPokedexId(pokemonData.id)}</span>
            {pokemonData.name}
          </h2>
          <button className="summary-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* HERO SECTION (Sprite, Types, Category) */}
        <div className="summary-hero">
          <button className="play-cry-btn">🔊 Cry</button>
          <img
            className="summary-sprite"
            src={pokemonData.sprite}
            alt={pokemonData.name}
          />

          <div className="hero-info">
            <div className="summary-types">
              {pokemonData.types.map((t) => (
                <span
                  key={t}
                  className="type-pill"
                  style={getTypePillStyle(t)} // * Apply type color/gradient
                >
                  {t}
                </span>
              ))}
            </div>
            <span className="category-text">{pokemonData.category}</span>
          </div>
        </div>

        {/* TABS Navigation */}
        <div className="summary-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`summary-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* BODY (TAB CONTENT) */}
        <div className="summary-body">
          {/* --- TAB: OVERVIEW --- */}
          {activeTab === "Overview" && (
            <>
              {/* Description */}
              <div className="data-section">
                <p className="desc-text">{pokemonData.description}</p>
              </div>

              {/* Abilities */}
              <div className="data-section">
                <h4 className="section-title">Abilities</h4>
                <div className="ability-row">
                  {pokemonData.abilities.main.map((a) => (
                    <div key={a} className="ability-chip">
                      {a}
                    </div>
                  ))}
                  {pokemonData.abilities.hidden && (
                    <div className="ability-chip hidden-ability">
                      {pokemonData.abilities.hidden} <small>Hidden</small>
                    </div>
                  )}
                </div>
              </div>

              {/* GRID 1: Physical Info & Breeding */}
              <div className="data-section">
                <h4 className="section-title">Breeding & Size</h4>
                <div className="info-grid-compact">
                  <div className="info-card">
                    <span className="info-label">Height</span>
                    <span className="info-value">{pokemonData.height}</span>
                  </div>
                  <div className="info-card">
                    <span className="info-label">Weight</span>
                    <span className="info-value">{pokemonData.weight}</span>
                  </div>
                  <div className="info-card">
                    <span className="info-label">Egg Group</span>
                    <span className="info-value">
                      {pokemonData.eggGroups.join(", ")}
                    </span>
                  </div>
                  <div className="info-card">
                    <span className="info-label">Gender</span>
                    <span className="info-value gender-row">
                      <span className="g-male">
                        {pokemonData.genderRatio.m}% ♂
                      </span>
                      <span className="g-female">
                        {pokemonData.genderRatio.f}% ♀
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* GRID 2: Training & Catching */}
              <div className="data-section">
                <h4 className="section-title">Training</h4>
                <div className="info-grid-compact">
                  <div className="info-card">
                    <span className="info-label">Catch Rate</span>
                    <span className="info-value">{pokemonData.catchRate}</span>
                  </div>
                  <div className="info-card">
                    <span className="info-label">Base Exp</span>
                    <span className="info-value">{pokemonData.baseExp}</span>
                  </div>
                  <div className="info-card">
                    <span className="info-label">Growth Rate</span>
                    <span className="info-value">{pokemonData.growthRate}</span>
                  </div>
                  <div className="info-card">
                    <span className="info-label">EV Yield</span>
                    <span className="info-value ev-text">
                      {pokemonData.evYield}
                    </span>
                  </div>
                </div>
              </div>

              {/* Extra Info */}
              <div className="data-section">
                <div className="info-grid-compact">
                  <div className="info-card full-width">
                    <span className="info-label">Held Item</span>
                    <span className="info-value">{pokemonData.heldItems}</span>
                  </div>
                  <div className="info-card full-width">
                    <span className="info-label">PvP Tier</span>
                    <span className="info-value tier-text">
                      {pokemonData.tier}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "Stats" && (
            <>
              {/* 1. BASE STATS SECTION */}
              <div className="data-section">
                <h4 className="section-title">Base Stats</h4>
                {Object.entries(pokemonData.baseStats).map(([key, val]) => (
                  <div key={key} className="stat-row">
                    <span className="stat-name">{key.toUpperCase()}</span>
                    <span className="stat-num">{val}</span>
                    <div className="stat-track">
                      {/* ? Dynamic width based on a 255 maximum value for stat bar */}
                      <div
                        className="stat-fill"
                        style={{
                          width: `${Math.min((val / 255) * 100, 100)}%`,
                          // * Color logic based on stat value (e.g., >100 is high)
                          background:
                            val > 100
                              ? "#00b894"
                              : val > 60
                                ? "#007bff"
                                : "#ff7675",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
                {Object.keys(pokemonData.baseStats).length === 0 && (
                  <p className="empty-text">Stats not available.</p>
                )}
              </div>

              {/* 2. TYPE DEFENSES SECTION (Weakness & Resistance) */}
              <div className="data-section" style={{ marginTop: "20px" }}>
                <h4 className="section-title">Weakness & Resistance</h4>

                {/* ! Fallback if defense calculation data is missing */}
                {!defenses ? (
                  <p className="empty-text">Type data not available.</p>
                ) : (
                  <div className="defense-grid">
                    {/* * Render only if types exist for this multiplier */}

                    {/* 4x (Extreme Weakness) */}
                    {getTypesByMultiplier(4).length > 0 && (
                      <div className="defense-row">
                        <span className="defense-label bad">4x</span>
                        <div className="defense-types">
                          {getTypesByMultiplier(4).map((t) => (
                            <span
                              key={t}
                              className="type-pill small"
                              style={getTypePillStyle(t)}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2x (Standard Weakness) */}
                    {getTypesByMultiplier(2).length > 0 && (
                      <div className="defense-row">
                        <span className="defense-label bad">2x</span>
                        <div className="defense-types">
                          {getTypesByMultiplier(2).map((t) => (
                            <span
                              key={t}
                              className="type-pill small"
                              style={getTypePillStyle(t)}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 0.5x (Standard Resistance) */}
                    {getTypesByMultiplier(0.5).length > 0 && (
                      <div className="defense-row">
                        <span className="defense-label good">0.5x</span>
                        <div className="defense-types">
                          {getTypesByMultiplier(0.5).map((t) => (
                            <span
                              key={t}
                              className="type-pill small"
                              style={getTypePillStyle(t)}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 0.25x (Extreme Resistance) */}
                    {getTypesByMultiplier(0.25).length > 0 && (
                      <div className="defense-row">
                        <span className="defense-label good">¼x</span>
                        <div className="defense-types">
                          {getTypesByMultiplier(0.25).map((t) => (
                            <span
                              key={t}
                              className="type-pill small"
                              style={getTypePillStyle(t)}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 0x (Immunity) */}
                    {getTypesByMultiplier(0).length > 0 && (
                      <div className="defense-row">
                        <span className="defense-label zero">0x</span>
                        <div className="defense-types">
                          {getTypesByMultiplier(0).map((t) => (
                            <span
                              key={t}
                              className="type-pill small"
                              style={getTypePillStyle(t)}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* --- TAB: MOVES --- */}
          {activeTab === "Moves" && (
            <div className="data-section">
              <div className="moves-title-row">
                <h4 className="section-title">Level Up Moves</h4>
                <input
                  type="text"
                  className="moves-search-input"
                  placeholder="Search move..."
                  value={moveSearch}
                  onChange={(e) => setMoveSearch(e.target.value)}
                />
              </div>

              <div className="moves-container">
                <div className="moves-header-row">
                  <span className="col-lvl">LVL</span>
                  <span className="col-move">MOVE</span>
                  <span className="col-cat">CAT</span>
                  <span className="col-pwr">PWR</span>
                  <span className="col-acc">ACC</span>
                </div>
                {filteredMoves.length > 0 ? (
                  filteredMoves.map((move, i) => (
                    <div key={i} className="move-row">
                      <div className="move-lvl-col">
                        <span className="lvl-badge">{move.level}</span>
                      </div>
                      <div className="move-info-col">
                        <span className="move-name">{move.name}</span>
                        <span
                          className={`move-type-text type-text-${move.type.toLowerCase()}`}
                        >
                          {move.type}
                        </span>
                      </div>
                      <div className="move-cat-col">
                        <span className={`cat-badge ${move.cat.toLowerCase()}`}>
                          {move.cat.substring(0, 4)}
                        </span>
                      </div>
                      <div className="move-pwr-col">{move.pwr}</div>
                      <div className="move-acc-col">{move.acc}%</div>
                    </div>
                  ))
                ) : (
                  // ! Handle case when search yields no results or no moves are available
                  <div className="no-moves-found">
                    {pokemonData.moves.length > 0
                      ? `No moves found for "${moveSearch}"`
                      : "Move data not available."}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- TAB: LOCATIONS --- */}
          {activeTab === "Locations" && (
            <div className="data-section">
              <h4 className="section-title">Wild Locations</h4>

              {pokemonData.locations.length > 0 ? (
                <div className="locations-container-grid">
                  {/* Location Grid Header */}
                  <div className="location-header-row">
                    {/* * Renamed from "Type" to "Method" in the underlying data structure */}
                    <span className="col-method">Method</span>
                    <span className="col-region">Region</span>
                    <span className="col-location">Location</span>
                    <span className="col-levels">Levels</span>
                    <span className="col-rarity">Rarity</span>
                  </div>

                  {pokemonData.locations.map((loc, i) => (
                    <div key={i} className="location-data-row">
                      {/* ? Use loc.method, falling back to loc.type if method is missing */}
                      <span className="loc-method">
                        {loc.method || loc.type || "-"}
                      </span>

                      <span className="loc-region">{loc.region}</span>
                      <span className="loc-area">{loc.area}</span>
                      <span className="loc-levels">{loc.levels}</span>
                      <span className="loc-rarity">{loc.rarity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-text">No wild locations found.</p>
              )}
            </div>
          )}

          {/* --- TAB: EVOLUTIONS --- */}
          {activeTab === "Evolutions" && (
            <div className="data-section">
              {/* VARIANTS SECTION */}
              {pokemonData.variants.length > 0 && (
                <div className="data-section">
                  <h4 className="section-title">Alternative Forms</h4>
                  <div className="evolution-chain">
                    {pokemonData.variants.map((variantName) => {
                      const variantCardData = getPokemonCardData(variantName);
                      return (
                        <React.Fragment key={variantName}>
                          {/* * Allow selecting variant to open new summary */}
                          <div
                            className="evo-card variant-card"
                            onClick={() => onSelectPokemon(variantName)}
                          >
                            <div className="evo-img-wrapper">
                              <img
                                src={variantCardData.sprite}
                                alt={variantName}
                              />
                            </div>
                            <span className="evo-name">{variantName}</span>
                            <span className="evo-method">Variant</span>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* EVOLUTIONS TREE SECTION */}
              <h4
                className="section-title"
                style={{
                  marginTop: pokemonData.variants.length > 0 ? "20px" : "0",
                }}
              >
                Evolution Tree
              </h4>
              {pokemonData.evolutions.length > 0 ? (
                <div className="evolution-chain">
                  {pokemonData.evolutions.map((evo, index) => {
                    // ? Fetch full card data for the sprite path
                    const evoCardData = getPokemonCardData(evo.name);

                    return (
                      <React.Fragment key={evo.name}>
                        {/* * Allow selecting evolution to open new summary */}
                        <div
                          className="evo-card"
                          onClick={() => onSelectPokemon(evo.name)}
                        >
                          {/* Uses the resolved sprite property */}
                          <div className="evo-img-wrapper">
                            <img src={evoCardData.sprite} alt={evo.name} />
                          </div>
                          <span className="evo-name">{evo.name}</span>
                          <span className="evo-method">{evo.level}</span>
                        </div>
                        {/* * Render arrow between evolutions, but not after the last one */}
                        {index < pokemonData.evolutions.length - 1 && (
                          <div className="evo-arrow">➜</div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <p className="empty-text">Evolution data not available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonSummary;
