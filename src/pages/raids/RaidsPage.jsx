import { raidsData } from "@/pages/raids/data/raidsData";
import PokemonCard from "@/shared/components/PokemonCard";
import {
  generateDualTypeGradient,
  typeBackgrounds,
} from "@/shared/utils/pokemonColors";
import { pokemonData } from "@/shared/utils/pokemonData";
import { pokemonImages } from "@/shared/utils/pokemonImages";
import { useCallback, useMemo, useState } from "react";
import "./RaidsPage.css";

function RaidsPage() {
  const [selectedStar, setSelectedStar] = useState();
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedTurnIndex, setSelectedTurnIndex] = useState(0);

  // Clic sulle stelle
  const handleStarClick = useCallback((star) => {
    setSelectedStar((prev) => (prev === star ? undefined : star));
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    setSelectedRole(null);
    setSelectedTurnIndex(0);
  }, []);

  // Clic sulla card del Pokémon
  const handlePokemonCardClick = useCallback((pokemonName) => {
    setSelectedPokemon(pokemonName);
    setIsPokemonDetailsVisible(true);
    setSelectedRole(null);
    setSelectedTurnIndex(0);
  }, []);

  // Cambio ruolo → reset turno
  const handleRoleChange = useCallback((roleKey) => {
    setSelectedRole(roleKey);
    setSelectedTurnIndex(0);
  }, []);

  // Livelli di stelle disponibili
  const starLevels = useMemo(() => {
    const allStars = raidsData.map((r) => r.stars);
    return [...new Set(allStars)].sort((a, b) => a - b);
  }, []);

  // Raid filtrati per stella, ordinati A–Z
  const filteredRaids = useMemo(() => {
    if (selectedStar == null) return [];
    return raidsData
      .filter((r) => r.stars === selectedStar)
      .sort((a, b) =>
        a.name.localeCompare(b.name, "it", { sensitivity: "base" })
      );
  }, [selectedStar]);

  // Raid corrente per il modal
  const currentRaid = useMemo(() => {
    if (!selectedPokemon) return null;

    const withinStar =
      selectedStar != null
        ? raidsData.filter((r) => r.stars === selectedStar)
        : raidsData;

    return withinStar.find((r) => r.name === selectedPokemon) || null;
  }, [selectedPokemon, selectedStar]);

  // Pokémon corrente (per tipi / gradient header)
  const currentPokemonObject = useMemo(() => {
    if (!selectedPokemon) return null;
    return pokemonData.find((p) => p.name === selectedPokemon) || null;
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

  // Chiudi modal
  const closePokemonDetails = useCallback(() => {
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    setSelectedRole(null);
    setSelectedTurnIndex(0);
  }, []);

  // Background della card dei Pokémon (stesso sistema degli Elite Four)
  const getNameBackgroundForPokemon = useCallback((pokemonName) => {
    const pokemon = pokemonData.find((p) => p.name === pokemonName) || null;

    if (!pokemon) {
      return typeBackgrounds[""];
    }

    if (typeBackgrounds[pokemon.name]) {
      return typeBackgrounds[pokemon.name];
    }

    if (pokemon.types && pokemon.types.length >= 2) {
      return generateDualTypeGradient(pokemon.types[0], pokemon.types[1]);
    }

    if (pokemon.types && pokemon.types.length === 1) {
      return typeBackgrounds[pokemon.types[0]] || typeBackgrounds[""];
    }

    return typeBackgrounds[""];
  }, []);

  // Ruolo attivo
  const effectiveSelectedRole = useMemo(() => {
    if (!currentRaid?.roles) return "";
    if (selectedRole && currentRaid.roles[selectedRole]) return selectedRole;
    if (currentRaid.roles.player1) return "player1";
    const keys = Object.keys(currentRaid.roles);
    return keys.length ? keys[0] : "";
  }, [selectedRole, currentRaid]);

  const roleOptions = useMemo(() => {
    if (!currentRaid?.roles) return [];
    return Object.keys(currentRaid.roles);
  }, [currentRaid]);

  const movesForSelectedRole = useMemo(() => {
    if (!currentRaid?.roles || !effectiveSelectedRole) return [];
    return currentRaid.roles[effectiveSelectedRole] || [];
  }, [currentRaid, effectiveSelectedRole]);

  return (
    <div className="container raids-page">
      {/* Selettore stelle */}
      <div className="cards-container">
        {starLevels.map((star) => (
          <div
            key={star}
            className={`card team-card ${
              selectedStar === star ? "selected" : ""
            }`}
            onClick={() => handleStarClick(star)}
          >
            <p>{star}★</p>
          </div>
        ))}
      </div>

      {/* Card Pokémon per la stella selezionata */}
      {selectedStar && filteredRaids.length > 0 && (
        <div className="pokemon-cards-display">
          {filteredRaids.map((raid) => {
            const pokemonName = raid.name;
            const nameBackground = getNameBackgroundForPokemon(pokemonName);

            return (
              <PokemonCard
                key={pokemonName}
                pokemonName={pokemonName}
                pokemonImageSrc={pokemonImages[pokemonName]}
                onClick={() => handlePokemonCardClick(pokemonName)}
                nameBackground={nameBackground}
                isSelected={selectedPokemon === pokemonName}
              />
            );
          })}
        </div>
      )}

      {/* Overlay dettagli raid */}
      {isPokemonDetailsVisible && currentRaid && (
        <div className="raids-overlay" onClick={closePokemonDetails}>
          <div className="raids-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div
              className="raids-modal-header"
              style={{ background: detailsTitleBackground }}
            >
              <h2>{currentRaid.name}</h2>
              <p>{currentRaid.stars}★ Raid</p>
            </div>

            {/* Contenuto */}
            <div className="raids-modal-content">
              {/* Roles + Mechanics & thresholds + Moves sulla stessa riga */}
              <section className="raids-section raids-section-grid">
                {/* Roles */}
                {currentRaid.roles && roleOptions.length > 0 && (
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

                    {movesForSelectedRole?.length > 0 && (
                      <>
                        {/* Indicatore del turno corrente */}
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

                        {/* Lista dei turni */}
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

                {/* Mechanics + thresholds */}
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
                        <p>
                          <strong>Notes:</strong> {currentRaid.mechanics.notes}
                        </p>
                      )}
                    </div>

                    {currentRaid.mechanics.thresholds && (
                      <div className="raids-thresholds">
                        <ul>
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
                  </div>
                )}

                {/* Moves */}
                {currentRaid.moves && currentRaid.moves.length > 0 && (
                  <div className="raids-subsection raids-subsection-moves">
                    <h3 className="raids-section-title">Moves</h3>
                    <ul className="raids-move-chips">
                      {currentRaid.moves.map((move) => (
                        <li key={move}>{move}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              {/* Locations */}
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

              {/* Strategy */}
              {currentRaid.strategy && (
                <section className="raids-section">
                  <h3 className="raids-section-title">Strategy</h3>
                  <p className="raids-strategy-text">{currentRaid.strategy}</p>
                </section>
              )}

              {/* Recommended Pokémon */}
              {currentRaid.recommended &&
                currentRaid.recommended.length > 0 && (
                  <section className="raids-section">
                    <h3 className="raids-section-title">Recommended Pokémon</h3>
                    <ul className="raids-recommended-list">
                      {currentRaid.recommended.map((rec) => (
                        <li key={rec}>{rec}</li>
                      ))}
                    </ul>
                  </section>
                )}

              {/* Links */}
              {currentRaid.links && (
                <section className="raids-section raids-section-links">
                  <h3 className="raids-section-title">Links</h3>
                  <ul>
                    {currentRaid.links.guide && (
                      <li>
                        {currentRaid.links.guide.startsWith("http") ? (
                          <a
                            href={currentRaid.links.guide}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Guide
                          </a>
                        ) : (
                          <span>{currentRaid.links.guide}</span>
                        )}
                      </li>
                    )}
                    {currentRaid.links.video && (
                      <li>
                        <a
                          href={currentRaid.links.video}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Video
                        </a>
                      </li>
                    )}
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
