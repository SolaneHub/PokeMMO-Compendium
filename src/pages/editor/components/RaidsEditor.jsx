import { useState } from "react";

import UniversalJsonEditor from "./UniversalJsonEditor";

// TEMPLATE BASE (per inizializzazione)
const RAID_TEMPLATE = {
  drops: [],
  moves: [],
  mechanics: {
    ability: "",
    heldItem: "",
    thresholds: { 100: { effect: "" } },
  },
  teamStrategies: [],
  locations: { kanto: {}, johto: {}, hoenn: {}, sinnoh: {}, unova: {} },
};

// LISTA DEI CAMPI SUGGERITI (Basata su Heatran)
// Questi appariranno nel menu a tendina quando modifichi un Pokémon raccomandato
const POKEMON_BUILD_KEYS = [
  "name",
  "player",
  "order",
  "item",
  "ability",
  "nature",
  "evs",
  "ivs",
  "moves",
  "variants",
];

const RaidsEditor = ({ data, onChange }) => {
  const [idx, setIdx] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  const handleRaidChange = (field, value) => {
    const newData = [...data];
    newData[idx] = { ...newData[idx], [field]: value };
    onChange(newData);
  };

  const ensureField = (field) => {
    if (!data[idx][field]) {
      handleRaidChange(field, RAID_TEMPLATE[field]);
    }
  };

  const raid = idx !== null ? data[idx] : null;

  const tabStyle = (tabName) => ({
    padding: "10px 20px",
    cursor: "pointer",
    borderBottom:
      activeTab === tabName ? "3px solid #007bff" : "3px solid transparent",
    color: activeTab === tabName ? "white" : "#888",
    fontWeight: activeTab === tabName ? "bold" : "normal",
    backgroundColor: activeTab === tabName ? "#252526" : "transparent",
    borderRadius: "6px 6px 0 0",
  });

  return (
    <div>
      <h3 style={{ borderBottom: "2px solid #00bcd4", paddingBottom: "10px" }}>
        👹 Editor Raid Avanzato
      </h3>

      <div style={{ marginBottom: "20px" }}>
        <select
          className="universal-input"
          value={idx ?? ""}
          onChange={(e) =>
            setIdx(e.target.value !== "" ? parseInt(e.target.value) : null)
          }
        >
          <option value="">-- Seleziona un Raid Boss --</option>
          {data.map((r, i) => (
            <option key={i} value={i}>
              {r.name} ({r.stars}★)
            </option>
          ))}
        </select>
      </div>

      {raid ? (
        <div className="step-card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #333",
              background: "#1e1e1e",
            }}
          >
            <div onClick={() => setActiveTab("info")} style={tabStyle("info")}>
              📝 Info
            </div>
            <div
              onClick={() => setActiveTab("locations")}
              style={tabStyle("locations")}
            >
              🌍 Location
            </div>
            <div
              onClick={() => setActiveTab("mechanics")}
              style={tabStyle("mechanics")}
            >
              ⚙️ Meccaniche
            </div>
            <div
              onClick={() => setActiveTab("strategies")}
              style={tabStyle("strategies")}
            >
              ⚔️ Strategie
            </div>
          </div>

          <div style={{ padding: "20px" }}>
            {/* TAB INFO */}
            {activeTab === "info" && (
              <div className="fade-in">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "3fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div>
                    <label>Nome Boss:</label>
                    <input
                      type="text"
                      className="universal-input"
                      value={raid.name}
                      onChange={(e) => handleRaidChange("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Stelle:</label>
                    <input
                      type="number"
                      className="universal-input"
                      value={raid.stars}
                      onChange={(e) =>
                        handleRaidChange("stars", parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "20px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div>
                    <h5 style={{ color: "#fab1a0" }}>Drops</h5>
                    <UniversalJsonEditor
                      data={raid.drops || []}
                      onChange={(v) => handleRaidChange("drops", v)}
                    />
                  </div>
                  <div>
                    <h5 style={{ color: "#fab1a0" }}>Moveset</h5>
                    <UniversalJsonEditor
                      data={raid.moves || []}
                      onChange={(v) => handleRaidChange("moves", v)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB LOCATION */}
            {activeTab === "locations" && (
              <div className="fade-in">
                {!raid.locations ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => ensureField("locations")}
                  >
                    ➕ Inizializza Location
                  </button>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "10px",
                    }}
                  >
                    {["kanto", "johto", "hoenn", "sinnoh", "unova"].map(
                      (reg) => (
                        <div
                          key={reg}
                          style={{
                            background: "#252526",
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid #333",
                          }}
                        >
                          <strong
                            style={{
                              textTransform: "capitalize",
                              color: "#88c0d0",
                            }}
                          >
                            {reg}
                          </strong>
                          <input
                            type="text"
                            className="universal-input"
                            style={{ marginTop: "5px" }}
                            value={raid.locations?.[reg]?.area || ""}
                            placeholder="Area..."
                            onChange={(e) => {
                              const locs = { ...raid.locations };
                              if (!locs[reg]) locs[reg] = {};
                              locs[reg].area = e.target.value;
                              handleRaidChange("locations", locs);
                            }}
                          />
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB MECHANICS */}
            {activeTab === "mechanics" && (
              <div className="fade-in">
                {!raid.mechanics ? (
                  <button
                    className="btn btn-success"
                    onClick={() => ensureField("mechanics")}
                  >
                    ➕ Aggiungi Meccaniche
                  </button>
                ) : (
                  <UniversalJsonEditor
                    data={raid.mechanics}
                    onChange={(v) => handleRaidChange("mechanics", v)}
                    // Qui i suggerimenti potrebbero essere diversi, ma per ora non servono
                  />
                )}
              </div>
            )}

            {/* TAB STRATEGIES - QUI USIAMO I SUGGERIMENTI */}
            {activeTab === "strategies" && (
              <div className="fade-in">
                {!raid.teamStrategies || raid.teamStrategies.length === 0 ? (
                  <button
                    className="btn btn-success"
                    onClick={() => ensureField("teamStrategies")}
                  >
                    ➕ Crea Strategia
                  </button>
                ) : (
                  <UniversalJsonEditor
                    data={raid.teamStrategies}
                    onChange={(v) => handleRaidChange("teamStrategies", v)}
                    // 🔥 QUESTA E' LA PARTE MAGICA: Passiamo le chiavi suggerite!
                    suggestedKeys={POKEMON_BUILD_KEYS}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#666", marginTop: "50px" }}>
          ⬅️ Seleziona un raid.
        </p>
      )}
    </div>
  );
};

export default RaidsEditor;
