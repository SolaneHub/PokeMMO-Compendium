import React, { useState } from "react";

import UniversalJsonEditor from "./UniversalJsonEditor";

// TEMPLATE COMPLETO
const POKE_TEMPLATE = {
  id: 0,
  name: "New Mon",
  type: [],
  stats: { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spe: 0 },
  abilities: [],
  evolution: {},
};

const PokedexEditor = ({ data, onChange }) => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  const filteredData = data.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toString().includes(search)
  );

  const handlePokeChange = (field, value) => {
    const newData = data.map((p) =>
      p.id === selectedId ? { ...p, [field]: value } : p
    );
    onChange(newData);
  };

  const createPokemon = () => {
    const newId = data.length > 0 ? Math.max(...data.map((p) => p.id)) + 1 : 1;
    onChange([...data, { ...POKE_TEMPLATE, id: newId }]);
    setSelectedId(newId);
    setActiveTab("info");
  };

  const pokemon = data.find((p) => p.id === selectedId);

  // Helper per inizializzare campi mancanti
  const ensureField = (field, templateValue) => {
    if (!pokemon[field]) handlePokeChange(field, templateValue);
  };

  // Stile Tabs
  const tabStyle = (key) => ({
    flex: 1,
    textAlign: "center",
    padding: "10px",
    cursor: "pointer",
    background: activeTab === key ? "#252526" : "transparent",
    borderBottom:
      activeTab === key ? "3px solid #a3be8c" : "3px solid transparent",
    fontWeight: activeTab === key ? "bold" : "normal",
    color: activeTab === key ? "white" : "#888",
  });

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* SIDEBAR LISTA */}
      <div
        style={{
          width: "260px",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #333",
          paddingRight: "15px",
        }}
      >
        <h3
          style={{
            borderBottom: "2px solid #a3be8c",
            paddingBottom: "10px",
            margin: "0 0 10px 0",
          }}
        >
          📖 Pokedex
        </h3>
        <input
          type="text"
          className="universal-input"
          placeholder="🔍 Cerca..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <div style={{ overflowY: "auto", flex: 1 }}>
          {filteredData.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderRadius: "4px",
                marginBottom: "2px",
                background: selectedId === p.id ? "#a3be8c" : "transparent",
                color: selectedId === p.id ? "#121212" : "#ccc",
              }}
            >
              <strong>#{p.id}</strong> {p.name}
            </div>
          ))}
        </div>
        <button
          className="btn btn-success"
          style={{ marginTop: "10px" }}
          onClick={createPokemon}
        >
          + Nuovo
        </button>
      </div>

      {/* MAIN EDITOR */}
      <div style={{ flex: 1, overflowY: "auto", paddingLeft: "10px" }}>
        {pokemon ? (
          <div className="step-card" style={{ padding: 0, overflow: "hidden" }}>
            {/* HEADER */}
            <div
              style={{
                padding: "20px",
                background: "#252526",
                borderBottom: "1px solid #333",
              }}
            >
              <h2 style={{ margin: 0, color: "#a3be8c" }}>
                {pokemon.name} <small>#{pokemon.id}</small>
              </h2>
            </div>

            {/* TABS */}
            <div style={{ display: "flex", borderBottom: "1px solid #333" }}>
              <div
                onClick={() => setActiveTab("info")}
                style={tabStyle("info")}
              >
                Info
              </div>
              <div
                onClick={() => setActiveTab("stats")}
                style={tabStyle("stats")}
              >
                Stats
              </div>
              <div
                onClick={() => setActiveTab("extra")}
                style={tabStyle("extra")}
              >
                Abilities & Evo
              </div>
            </div>

            <div style={{ padding: "20px" }}>
              {activeTab === "info" && (
                <div className="fade-in">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 2fr",
                      gap: "15px",
                    }}
                  >
                    <div>
                      <label>ID</label>
                      <input
                        type="number"
                        className="universal-input"
                        value={pokemon.id}
                        onChange={(e) =>
                          handlePokeChange("id", parseInt(e.target.value))
                        }
                      />
                    </div>
                    <div>
                      <label>Name</label>
                      <input
                        type="text"
                        className="universal-input"
                        value={pokemon.name}
                        onChange={(e) =>
                          handlePokeChange("name", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <h5 style={{ color: "#88c0d0" }}>Type</h5>
                    <UniversalJsonEditor
                      data={pokemon.type || []}
                      onChange={(v) => handlePokeChange("type", v)}
                    />
                  </div>
                </div>
              )}

              {activeTab === "stats" && (
                <div className="fade-in">
                  {!pokemon.stats ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => ensureField("stats", POKE_TEMPLATE.stats)}
                    >
                      Inizializza Stats
                    </button>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "15px",
                      }}
                    >
                      {Object.keys(POKE_TEMPLATE.stats).map((k) => (
                        <div key={k}>
                          <label
                            style={{
                              textTransform: "uppercase",
                              fontSize: "0.7rem",
                            }}
                          >
                            {k}
                          </label>
                          <input
                            type="number"
                            className="universal-input"
                            value={pokemon.stats[k] || 0}
                            onChange={(e) =>
                              handlePokeChange("stats", {
                                ...pokemon.stats,
                                [k]: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "extra" && (
                <div className="fade-in">
                  <h5 style={{ color: "#b48ead" }}>Abilities</h5>
                  {!pokemon.abilities ? (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => ensureField("abilities", [])}
                    >
                      Crea Array
                    </button>
                  ) : (
                    <UniversalJsonEditor
                      data={pokemon.abilities}
                      onChange={(v) => handlePokeChange("abilities", v)}
                    />
                  )}

                  <hr style={{ borderColor: "#333", margin: "20px 0" }} />

                  <h5 style={{ color: "#ebcb8b" }}>Evolution</h5>
                  <UniversalJsonEditor
                    data={pokemon.evolution || {}}
                    onChange={(v) => handlePokeChange("evolution", v)}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{ textAlign: "center", marginTop: "50px", color: "#666" }}
          >
            Seleziona un Pokémon
          </div>
        )}
      </div>
    </div>
  );
};

export default PokedexEditor;
