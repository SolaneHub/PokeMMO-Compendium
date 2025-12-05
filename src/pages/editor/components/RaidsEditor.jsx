import { useState } from "react";

import UniversalJsonEditor from "./UniversalJsonEditor";

const RAID_TEMPLATE = {
  drops: [],
  moves: [],
  mechanics: { ability: "", heldItem: "", thresholds: { 100: { effect: "" } } },
  teamStrategies: [],
  locations: { kanto: {}, johto: {}, hoenn: {}, sinnoh: {}, unova: {} },
};

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
    if (idx === null) return;
    const newData = [...data];
    newData[idx] = { ...newData[idx], [field]: value };
    onChange(newData);
  };

  const ensureField = (field) => {
    if (!data[idx][field]) handleRaidChange(field, RAID_TEMPLATE[field]);
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
      <title>Editor: Raids</title>
      <h3 style={{ borderBottom: "2px solid #00bcd4", paddingBottom: "10px" }}>
        👹 Editor Raid
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
            {["info", "locations", "mechanics", "strategies"].map((t) => (
              <div key={t} onClick={() => setActiveTab(t)} style={tabStyle(t)}>
                {t === "info"
                  ? "📝 Info"
                  : t === "locations"
                    ? "🌍 Loc"
                    : t === "mechanics"
                      ? "⚙️ Mech"
                      : "⚔️ Strat"}
              </div>
            ))}
          </div>

          <div style={{ padding: "20px" }}>
            {activeTab === "info" && (
              <div className="fade-in grid grid-cols-2 gap-4">
                <div>
                  <label>Nome</label>
                  <input
                    className="universal-input"
                    value={raid.name}
                    onChange={(e) => handleRaidChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <label>Stelle</label>
                  <input
                    type="number"
                    className="universal-input"
                    value={raid.stars}
                    onChange={(e) =>
                      handleRaidChange("stars", parseInt(e.target.value))
                    }
                  />
                </div>
                <div>
                  <h5>Drops</h5>
                  <UniversalJsonEditor
                    data={raid.drops || []}
                    onChange={(v) => handleRaidChange("drops", v)}
                  />
                </div>
                <div>
                  <h5>Moveset</h5>
                  <UniversalJsonEditor
                    data={raid.moves || []}
                    onChange={(v) => handleRaidChange("moves", v)}
                  />
                </div>
              </div>
            )}

            {activeTab === "locations" && (
              <div className="fade-in">
                {!raid.locations ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => ensureField("locations")}
                  >
                    Inizializza
                  </button>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: "10px",
                    }}
                  >
                    {Object.keys(RAID_TEMPLATE.locations).map((reg) => (
                      <div
                        key={reg}
                        style={{
                          background: "#252526",
                          padding: "10px",
                          borderRadius: "4px",
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
                          className="universal-input"
                          style={{ marginTop: "5px" }}
                          value={raid.locations?.[reg]?.area || ""}
                          onChange={(e) => {
                            const locs = {
                              ...raid.locations,
                              [reg]: {
                                ...raid.locations[reg],
                                area: e.target.value,
                              },
                            };
                            handleRaidChange("locations", locs);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "mechanics" && (
              <UniversalJsonEditor
                data={raid.mechanics || {}}
                onChange={(v) => handleRaidChange("mechanics", v)}
              />
            )}

            {activeTab === "strategies" && (
              <UniversalJsonEditor
                data={raid.teamStrategies || []}
                onChange={(v) => handleRaidChange("teamStrategies", v)}
                suggestedKeys={POKEMON_BUILD_KEYS}
              />
            )}
          </div>
        </div>
      ) : (
        <p className="text-center mt-10 text-gray-500">Seleziona un raid.</p>
      )}
    </div>
  );
};
export default RaidsEditor;
