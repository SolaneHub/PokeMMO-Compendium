import "./RaidsPage.css";

import { useCallback, useMemo, useState } from "react";

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

function RaidsPage() {
  const [selectedStar, setSelectedStar] = useState();
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedTurnIndex, setSelectedTurnIndex] = useState(0);
  const [selectedStrategyIndex, setSelectedStrategyIndex] = useState(0);

  // ? Data fetching and filtering delegated to specific services
  const starLevels = useMemo(() => getStarLevels(), []);

  const filteredRaids = useMemo(() => {
    return getRaidsByStars(selectedStar);
  }, [selectedStar]);

  const currentRaid = useMemo(() => {
    return selectedPokemon ? getRaidByName(selectedPokemon) : null;
  }, [selectedPokemon]);

  // ? Resolves the specific strategy object, handling cases with multiple team versions
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

  const detailsTitleBackground = useMemo(() => {
    return selectedPokemon
      ? getPokemonBackground(selectedPokemon)
      : typeBackgrounds[""];
  }, [selectedPokemon]);

  const handleStarClick = useCallback((star) => {
    setSelectedStar((prev) => (prev === star ? undefined : star));
    // ! Force modal close when changing filters to avoid context mismatches
    closePokemonDetails();
  }, []);

  const handlePokemonCardClick = useCallback((pokemonName) => {
    setSelectedPokemon(pokemonName);
    setIsPokemonDetailsVisible(true);
    // * Reset internal modal state (role, turn, version) when opening a new raid
    setSelectedRole(null);
    setSelectedTurnIndex(0);
    setSelectedStrategyIndex(0);
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
    // ! Reset turn index to 0 to prevent out-of-bounds errors on the new role's move list
    setSelectedTurnIndex(0);
  }, []);

  // ? Smart fallback: if no role is manually selected, default to 'player1' or the first available key
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
            // ? Retrieve standardized UI data (sprite, gradient) via the Service
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

            <div className="raids-modal-content">
              {currentRaid.locations && (
                <section className="raids-section raids-section-locations">
                  <h3 className="raids-section-title">Locations</h3>
                  <ul>
                    {Object.entries(currentRaid.locations).map(
                      ([region, location]) => (
                        <li key={region}>
                          <strong>{region}</strong>
                          <span>{location.area}</span>
                        </li>
                      )
                    )}
                  </ul>
                </section>
              )}

              {/* * Only render Version Selector if the raid has multiple strategies */}
              {currentRaid.teamStrategies &&
                currentRaid.teamStrategies.length > 1 && (
                  <section className="raids-section raids-section-team-versions">
                    <h3 className="raids-section-title">Team version</h3>
                    <div className="raids-team-version-selector">
                      <label>
                        Choose version:
                        <select
                          value={selectedStrategyIndex}
                          onChange={(e) => {
                            setSelectedStrategyIndex(Number(e.target.value));
                            // ! Reset role and turn when switching strategies
                            setSelectedRole(null);
                            setSelectedTurnIndex(0);
                          }}
                        >
                          {currentRaid.teamStrategies.map((strategy, idx) => (
                            <option key={strategy.id || idx} value={idx}>
                              {strategy.label || `Version ${idx + 1}`}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </section>
                )}

              <section className="raids-section raids-section-grid">
                {rolesSource && roleOptions.length > 0 && (
                  <div className="raids-subsection raids-subsection-roles">
                    <h3 className="raids-section-title">Roles</h3>
                    <div className="raids-role-selector">
                      <label>
                        Choose your role:
                        <select
                          value={effectiveSelectedRole}
                          onChange={(e) => handleRoleChange(e.target.value)}
                        >
                          {roleOptions.map((roleKey) => (
                            <option key={roleKey} value={roleKey}>
                              {roleKey === "player1"
                                ? "Player 1"
                                : roleKey === "player2"
                                  ? "Player 2"
                                  : roleKey === "player3"
                                    ? "Player 3"
                                    : roleKey === "player4"
                                      ? "Player 4"
                                      : roleKey}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    {movesForSelectedRole.length > 0 && (
                      <>
                        <div className="raids-turn-indicator">
                          <span className="raids-turn-label">Turn:</span>
                          <select
                            value={selectedTurnIndex}
                            onChange={(e) =>
                              setSelectedTurnIndex(Number(e.target.value))
                            }
                          >
                            {movesForSelectedRole.map((_, idx) => (
                              <option key={idx} value={idx}>
                                {idx + 1}
                              </option>
                            ))}
                          </select>
                          <span className="raids-turn-total">
                            / {movesForSelectedRole.length}
                          </span>
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
                            >
                              <span className="raids-role-move-turn">
                                Turn {idx + 1}:
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
                )}

                {currentRaid.mechanics && (
                  <div className="raids-subsection">
                    <h3 className="raids-section-title">
                      Mechanics & thresholds
                    </h3>
                    <div className="raids-mechanics-text">
                      {currentRaid.mechanics.ability && (
                        <p>
                          <strong>Ability:</strong>{" "}
                          {currentRaid.mechanics.ability}
                        </p>
                      )}
                      {currentRaid.mechanics.heldItem && (
                        <p>
                          <strong>Held item:</strong>{" "}
                          {currentRaid.mechanics.heldItem}
                        </p>
                      )}
                      {currentRaid.mechanics.notes && (
                        <p>{currentRaid.mechanics.notes}</p>
                      )}
                    </div>
                    {currentRaid.mechanics.thresholds && (
                      <div className="raids-thresholds">
                        <ul className="raids-threshold-list">
                          {Object.entries(currentRaid.mechanics.thresholds)
                            .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
                            .map(([hp, info]) => (
                              <li key={hp}>
                                <span className="raids-threshold-hp">
                                  {hp}% HP
                                </span>
                                <span className="raids-threshold-effect">
                                  {typeof info === "string"
                                    ? info
                                    : info?.effect}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                    {currentRaid.moves && (
                      <div className="raids-mechanics-moves">
                        <h3 className="raids-section-title">Moves</h3>
                        <ul className="raids-move-chips">
                          {currentRaid.moves.map((move) => (
                            <li key={move}>{move}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {recommendedList.length > 0 && (
                <section className="raids-section">
                  <h3 className="raids-section-title">Recommended Pokémon</h3>
                  <ul className="raids-recommended-list">
                    {recommendedList.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
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
