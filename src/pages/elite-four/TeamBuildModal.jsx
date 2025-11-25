import "./EliteFourPage.css"; // Usiamo lo stesso CSS o quello aggiornato sotto

import { getPokemonCardData } from "@/pages/pokedex/data/pokemonService";

// Helper per URL strumenti (copiato da RaidsPage o importato da utils)
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

const PlayerBuildCard = ({ build }) => {
  const { sprite } = getPokemonCardData(build.name);

  return (
    <div className="raids-build-card">
      {/* Header */}
      <div className="build-card-header">
        <img src={sprite} alt={build.name} className="build-sprite" />
        <div className="build-main-info">
          <span className="build-name">{build.name}</span>
        </div>

        {/* Strumento */}
        {build.item && (
          <span className="build-held-item">
            <img
              src={getItemSpriteUrl(build.item)}
              alt={build.item}
              className="item-icon"
              onError={(e) => (e.target.style.display = "none")}
            />
            {build.item}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="build-stats-row">
        {build.ability && (
          <span className="build-stat">
            Ability: <strong>{build.ability}</strong>
          </span>
        )}
        {build.nature && (
          <span className="build-stat">
            Nature: <strong>{build.nature}</strong>
          </span>
        )}
        {build.evs && (
          <span className="build-stat">
            EVs: <strong>{build.evs}</strong>
          </span>
        )}
      </div>

      {/* Mosse */}
      {build.moves && (
        <div className="build-moves-list">
          {build.moves.map((m, k) => (
            <span key={k} className="build-move">
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const TeamBuildModal = ({ teamName, builds, onClose }) => {
  if (!builds || builds.length === 0) return null;

  return (
    <div className="raids-overlay" onClick={onClose}>
      <div className="raids-modal" onClick={(e) => e.stopPropagation()}>
        <div className="raids-modal-header" style={{ background: "#2a2b30" }}>
          <h2>{teamName} Setup</h2>
          <p>Player Team Configuration</p>
        </div>

        <div className="raids-modal-content">
          <div className="raids-builds-grid fade-in">
            {builds.map((build, idx) => (
              <PlayerBuildCard key={idx} build={build} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamBuildModal;
