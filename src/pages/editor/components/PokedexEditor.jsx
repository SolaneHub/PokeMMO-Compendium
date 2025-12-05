import { useState } from "react";

const POKE_TEMPLATE = {
  id: 0,
  name: "New Mon",
  category: "Unknown",
  types: ["Normal"],
  description: "",
  height: "1'00\"",
  weight: "1.0 kg",
  genderRatio: { m: 50, f: 50 },
  catchRate: 45,
  baseExp: 60,
  growthRate: "Medium Fast",
  evYield: "",
  heldItems: "None",
  tier: "Untiered",
  abilities: { main: [], hidden: "" },
  eggGroups: [],
  baseStats: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  moves: [],
  evolutions: [],
  locations: [],
};

const PokedexEditor = ({ data, onChange }) => {
  if (!data || !Array.isArray(data)) {
    return (
      <div style={{ padding: "20px", color: "#ff6b81", textAlign: "center" }}>
        ⚠️ Dati non validi.
      </div>
    );
  }

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  const filteredList = data.filter((p) => {
    if (!p) return false;
    const name = (p.name || "").toLowerCase();
    const s = search.toLowerCase();
    return name.includes(s) || (p.id?.toString() || "").includes(s);
  });

  const pokemon = data.find((p) => p.id === selectedId);

  const updateField = (field, value) => {
    onChange(
      data.map((p) => (p.id === selectedId ? { ...p, [field]: value } : p))
    );
  };

  const updateNested = (parent, key, value) => {
    if (!pokemon) return;
    const newParentObj = { ...(pokemon[parent] || {}), [key]: value };
    updateField(parent, newParentObj);
  };

  const updateArrayPrimitive = (field, index, value) => {
    const newArray = [...(pokemon[field] || [])];
    newArray[index] = value;
    updateField(field, newArray);
  };

  const addArrayPrimitive = (field) => {
    updateField(field, [...(pokemon[field] || []), ""]);
  };

  const removeArrayPrimitive = (field, index) => {
    const newArray = (pokemon[field] || []).filter((_, i) => i !== index);
    updateField(field, newArray);
  };

  const tabBtnStyle = (tabName) => ({
    flex: 1,
    padding: "10px",
    cursor: "pointer",
    textAlign: "center",
    background: activeTab === tabName ? "#333" : "transparent",
    borderBottom:
      activeTab === tabName ? "3px solid #00bcd4" : "1px solid #333",
    fontWeight: activeTab === tabName ? "bold" : "normal",
    color: activeTab === tabName ? "#fff" : "#888",
  });

  return (
    <div style={{ display: "flex", height: "100%", gap: "20px" }}>
      <title>Editor: Pokédex</title>

      <div
        style={{
          width: "250px",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #333",
          paddingRight: "15px",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0", color: "#00bcd4" }}>📖 Pokedex</h3>
        <input
          type="text"
          placeholder="Cerca..."
          className="universal-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <div style={{ overflowY: "auto", flex: 1 }}>
          {filteredList.map((p, index) => (
            <div
              key={p.id ?? index}
              onClick={() => setSelectedId(p.id)}
              style={{
                padding: "8px",
                cursor: "pointer",
                background:
                  selectedId === p.id
                    ? "rgba(0, 188, 212, 0.15)"
                    : "transparent",
                borderLeft:
                  selectedId === p.id
                    ? "3px solid #00bcd4"
                    : "3px solid transparent",
                color: selectedId === p.id ? "#fff" : "#aaa",
                marginBottom: "2px",
              }}
            >
              <strong>#{p.id}</strong> {p.name || "Senza Nome"}
            </div>
          ))}
        </div>
        <button
          className="btn btn-success"
          style={{ marginTop: "10px" }}
          onClick={() => {
            const newId =
              data.length > 0 ? Math.max(...data.map((p) => p.id || 0)) + 1 : 1;
            onChange([...data, { ...POKE_TEMPLATE, id: newId }]);
            setSelectedId(newId);
            setActiveTab("info");
          }}
        >
          + Nuovo
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingRight: "10px" }}>
        {pokemon ? (
          <div className="step-card" style={{ padding: 0, overflow: "hidden" }}>
            <div
              style={{
                padding: "15px 20px",
                background: "#252526",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0, color: "#fff" }}>
                {pokemon.name}{" "}
                <span style={{ fontSize: "0.6em", color: "#888" }}>
                  #{pokemon.id}
                </span>
              </h2>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  if (window.confirm("Eliminare definitivamente?")) {
                    onChange(data.filter((p) => p.id !== selectedId));
                    setSelectedId(null);
                  }
                }}
              >
                Elimina
              </button>
            </div>

            <div
              style={{
                display: "flex",
                background: "#1e1e1e",
                borderBottom: "1px solid #333",
              }}
            >
              {["info", "stats", "moves", "extra"].map((t) => (
                <div
                  key={t}
                  onClick={() => setActiveTab(t)}
                  style={tabBtnStyle(t)}
                >
                  {t === "info"
                    ? "📝 Info"
                    : t === "stats"
                      ? "📊 Stats"
                      : t === "moves"
                        ? "⚔️ Moves"
                        : "🧬 Extra"}
                </div>
              ))}
            </div>

            <div style={{ padding: "20px" }}>
              {activeTab === "info" && (
                <div className="fade-in">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 2fr",
                      gap: "20px",
                      marginBottom: "15px",
                    }}
                  >
                    <div>
                      <label>ID</label>
                      <input
                        type="number"
                        className="universal-input"
                        value={pokemon.id}
                        onChange={(e) => {
                          const newId = parseInt(e.target.value);
                          updateField("id", newId);
                          setSelectedId(newId);
                        }}
                      />
                    </div>
                    <div>
                      <label>Nome</label>
                      <input
                        type="text"
                        className="universal-input"
                        value={pokemon.name}
                        onChange={(e) => updateField("name", e.target.value)}
                      />
                    </div>
                  </div>

                  <label>Descrizione</label>
                  <textarea
                    className="universal-input"
                    rows={3}
                    value={pokemon.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                    style={{ marginBottom: "15px" }}
                  />

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "15px",
                      marginBottom: "15px",
                    }}
                  >
                    <div>
                      <label>Category</label>
                      <input
                        type="text"
                        className="universal-input"
                        value={pokemon.category || ""}
                        onChange={(e) =>
                          updateField("category", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label>Height</label>
                      <input
                        type="text"
                        className="universal-input"
                        value={pokemon.height || ""}
                        onChange={(e) => updateField("height", e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Weight</label>
                      <input
                        type="text"
                        className="universal-input"
                        value={pokemon.weight || ""}
                        onChange={(e) => updateField("weight", e.target.value)}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        background: "#252526",
                        padding: "10px",
                        borderRadius: "6px",
                      }}
                    >
                      <label style={{ display: "block", marginBottom: "5px" }}>
                        Types
                      </label>
                      {(pokemon.types || []).map((type, i) => (
                        <div
                          key={i}
                          style={{ display: "flex", marginBottom: "5px" }}
                        >
                          <input
                            type="text"
                            className="universal-input"
                            value={type}
                            onChange={(e) =>
                              updateArrayPrimitive("types", i, e.target.value)
                            }
                          />
                          <button
                            className="btn btn-danger btn-sm"
                            style={{ marginLeft: "5px" }}
                            onClick={() => removeArrayPrimitive("types", i)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        className="btn btn-sm btn-primary"
                        style={{ width: "100%" }}
                        onClick={() => addArrayPrimitive("types")}
                      >
                        + Add Type
                      </button>
                    </div>

                    <div
                      style={{
                        background: "#252526",
                        padding: "10px",
                        borderRadius: "6px",
                      }}
                    >
                      <label style={{ display: "block", marginBottom: "5px" }}>
                        Egg Groups
                      </label>
                      {(pokemon.eggGroups || []).map((eg, i) => (
                        <div
                          key={i}
                          style={{ display: "flex", marginBottom: "5px" }}
                        >
                          <input
                            type="text"
                            className="universal-input"
                            value={eg}
                            onChange={(e) =>
                              updateArrayPrimitive(
                                "eggGroups",
                                i,
                                e.target.value
                              )
                            }
                          />
                          <button
                            className="btn btn-danger btn-sm"
                            style={{ marginLeft: "5px" }}
                            onClick={() => removeArrayPrimitive("eggGroups", i)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        className="btn btn-sm btn-primary"
                        style={{ width: "100%" }}
                        onClick={() => addArrayPrimitive("eggGroups")}
                      >
                        + Add Group
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "stats" && (
                <div className="fade-in">
                  <h4
                    style={{
                      borderBottom: "1px solid #444",
                      paddingBottom: "5px",
                      color: "#fab1a0",
                    }}
                  >
                    Base Stats
                  </h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(6, 1fr)",
                      gap: "10px",
                      marginBottom: "20px",
                    }}
                  >
                    {["hp", "atk", "def", "spa", "spd", "spe"].map((stat) => (
                      <div key={stat} style={{ textAlign: "center" }}>
                        <label
                          style={{
                            textTransform: "uppercase",
                            fontSize: "0.75rem",
                            color: "#888",
                          }}
                        >
                          {stat}
                        </label>
                        <input
                          type="number"
                          className="universal-input"
                          style={{ textAlign: "center", fontWeight: "bold" }}
                          value={pokemon.baseStats?.[stat] || 0}
                          onChange={(e) =>
                            updateNested(
                              "baseStats",
                              stat,
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px",
                    }}
                  >
                    <div>
                      <label>Gender Ratio (M %)</label>
                      <input
                        type="number"
                        className="universal-input"
                        value={pokemon.genderRatio?.m ?? ""}
                        onChange={(e) =>
                          updateNested(
                            "genderRatio",
                            "m",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                      <label style={{ marginTop: "5px" }}>
                        Gender Ratio (F %)
                      </label>
                      <input
                        type="number"
                        className="universal-input"
                        value={pokemon.genderRatio?.f ?? ""}
                        onChange={(e) =>
                          updateNested(
                            "genderRatio",
                            "f",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <label>Catch Rate</label>
                      <input
                        type="number"
                        className="universal-input"
                        value={pokemon.catchRate}
                        onChange={(e) =>
                          updateField("catchRate", parseInt(e.target.value))
                        }
                      />
                      <label style={{ marginTop: "5px" }}>Tier</label>
                      <input
                        type="text"
                        className="universal-input"
                        value={pokemon.tier}
                        onChange={(e) => updateField("tier", e.target.value)}
                      />
                    </div>
                  </div>

                  <h4
                    style={{
                      borderBottom: "1px solid #444",
                      paddingBottom: "5px",
                      color: "#a3be8c",
                      marginTop: "20px",
                    }}
                  >
                    Abilities
                  </h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        background: "#252526",
                        padding: "10px",
                        borderRadius: "6px",
                      }}
                    >
                      <label>Main Abilities</label>
                      {(pokemon.abilities?.main || []).map((ab, i) => (
                        <div
                          key={i}
                          style={{ display: "flex", marginTop: "5px" }}
                        >
                          <input
                            type="text"
                            className="universal-input"
                            value={ab}
                            onChange={(e) => {
                              const newMain = [
                                ...(pokemon.abilities.main || []),
                              ];
                              newMain[i] = e.target.value;
                              updateNested("abilities", "main", newMain);
                            }}
                          />
                          <button
                            className="btn btn-danger btn-sm"
                            style={{ marginLeft: "5px" }}
                            onClick={() => {
                              const newMain = pokemon.abilities.main.filter(
                                (_, idx) => idx !== i
                              );
                              updateNested("abilities", "main", newMain);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        className="btn btn-sm btn-primary"
                        style={{ marginTop: "5px", width: "100%" }}
                        onClick={() => {
                          updateNested("abilities", "main", [
                            ...(pokemon.abilities?.main || []),
                            "",
                          ]);
                        }}
                      >
                        + Add Ability
                      </button>
                    </div>
                    <div>
                      <label>Hidden Ability</label>
                      <input
                        type="text"
                        className="universal-input"
                        value={pokemon.abilities?.hidden || ""}
                        onChange={(e) =>
                          updateNested("abilities", "hidden", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "moves" && (
                <div className="fade-in">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <h4 style={{ margin: 0, color: "#81a1c1" }}>
                      Moves ({pokemon.moves?.length || 0})
                    </h4>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => {
                        const newMove = {
                          level: 1,
                          name: "Tackle",
                          type: "Normal",
                          cat: "Physical",
                          pwr: 40,
                          acc: 100,
                        };
                        updateField("moves", [
                          ...(pokemon.moves || []),
                          newMove,
                        ]);
                      }}
                    >
                      + Add Move
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: "8px" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "50px 2fr 100px 80px 50px 50px 40px",
                        gap: "10px",
                        padding: "0 10px",
                        fontSize: "0.8rem",
                        color: "#888",
                        fontWeight: "bold",
                      }}
                    >
                      <span>Lvl</span>
                      <span>Name</span>
                      <span>Type</span>
                      <span>Cat</span>
                      <span>Pwr</span>
                      <span>Acc</span>
                      <span></span>
                    </div>

                    {(pokemon.moves || []).map((move, i) => (
                      <div
                        key={i}
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "50px 2fr 100px 80px 50px 50px 40px",
                          gap: "10px",
                          background: "#2e2e2e",
                          padding: "8px",
                          borderRadius: "4px",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          className="universal-input"
                          value={move.level}
                          onChange={(e) => {
                            const newMoves = [...pokemon.moves];
                            newMoves[i].level = e.target.value;
                            updateField("moves", newMoves);
                          }}
                        />
                        <input
                          type="text"
                          className="universal-input"
                          value={move.name}
                          onChange={(e) => {
                            const newMoves = [...pokemon.moves];
                            newMoves[i].name = e.target.value;
                            updateField("moves", newMoves);
                          }}
                        />
                        <input
                          type="text"
                          className="universal-input"
                          value={move.type}
                          onChange={(e) => {
                            const newMoves = [...pokemon.moves];
                            newMoves[i].type = e.target.value;
                            updateField("moves", newMoves);
                          }}
                        />
                        <select
                          className="universal-input"
                          value={move.cat}
                          onChange={(e) => {
                            const newMoves = [...pokemon.moves];
                            newMoves[i].cat = e.target.value;
                            updateField("moves", newMoves);
                          }}
                        >
                          <option value="Physical">Phys</option>
                          <option value="Special">Spec</option>
                          <option value="Status">Stat</option>
                        </select>
                        <input
                          type="text"
                          className="universal-input"
                          value={move.pwr}
                          onChange={(e) => {
                            const newMoves = [...pokemon.moves];
                            newMoves[i].pwr = e.target.value;
                            updateField("moves", newMoves);
                          }}
                        />
                        <input
                          type="text"
                          className="universal-input"
                          value={move.acc}
                          onChange={(e) => {
                            const newMoves = [...pokemon.moves];
                            newMoves[i].acc = e.target.value;
                            updateField("moves", newMoves);
                          }}
                        />
                        <button
                          className="delete-key-btn"
                          onClick={() => {
                            const newMoves = pokemon.moves.filter(
                              (_, idx) => idx !== i
                            );
                            updateField("moves", newMoves);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "extra" && (
                <div className="fade-in">
                  <div style={{ marginBottom: "30px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                        borderBottom: "1px solid #444",
                        paddingBottom: "5px",
                      }}
                    >
                      <h4 style={{ margin: 0, color: "#ebcb8b" }}>
                        Evolutions
                      </h4>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          updateField("evolutions", [
                            ...(pokemon.evolutions || []),
                            { name: "", level: "", sprite_id: 0 },
                          ]);
                        }}
                      >
                        + Add Evo
                      </button>
                    </div>
                    {(pokemon.evolutions || []).map((evo, i) => (
                      <div
                        key={i}
                        style={{
                          background: "#252526",
                          padding: "10px",
                          borderRadius: "6px",
                          marginBottom: "10px",
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr auto",
                          gap: "10px",
                          alignItems: "end",
                        }}
                      >
                        <div>
                          <label style={{ fontSize: "0.7rem" }}>Name</label>
                          <input
                            type="text"
                            className="universal-input"
                            value={evo.name}
                            onChange={(e) => {
                              const newEvos = [...pokemon.evolutions];
                              newEvos[i].name = e.target.value;
                              updateField("evolutions", newEvos);
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.7rem" }}>
                            Condition
                          </label>
                          <input
                            type="text"
                            className="universal-input"
                            value={evo.level}
                            onChange={(e) => {
                              const newEvos = [...pokemon.evolutions];
                              newEvos[i].level = e.target.value;
                              updateField("evolutions", newEvos);
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.7rem" }}>
                            Sprite ID
                          </label>
                          <input
                            type="number"
                            className="universal-input"
                            value={evo.sprite_id}
                            onChange={(e) => {
                              const newEvos = [...pokemon.evolutions];
                              newEvos[i].sprite_id = parseInt(e.target.value);
                              updateField("evolutions", newEvos);
                            }}
                          />
                        </div>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            const newEvos = pokemon.evolutions.filter(
                              (_, idx) => idx !== i
                            );
                            updateField("evolutions", newEvos);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                        borderBottom: "1px solid #444",
                        paddingBottom: "5px",
                      }}
                    >
                      <h4 style={{ margin: 0, color: "#b48ead" }}>Locations</h4>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          updateField("locations", [
                            ...(pokemon.locations || []),
                            {
                              region: "Kanto",
                              area: "",
                              levels: "",
                              rarity: "",
                            },
                          ]);
                        }}
                      >
                        + Add Loc
                      </button>
                    </div>
                    {(pokemon.locations || []).map((loc, i) => (
                      <div
                        key={i}
                        style={{
                          background: "#252526",
                          padding: "10px",
                          borderRadius: "6px",
                          marginBottom: "10px",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 2fr",
                            gap: "10px",
                            marginBottom: "5px",
                          }}
                        >
                          <input
                            type="text"
                            className="universal-input"
                            placeholder="Region"
                            value={loc.region}
                            onChange={(e) => {
                              const newLocs = [...pokemon.locations];
                              newLocs[i].region = e.target.value;
                              updateField("locations", newLocs);
                            }}
                          />
                          <input
                            type="text"
                            className="universal-input"
                            placeholder="Area"
                            value={loc.area}
                            onChange={(e) => {
                              const newLocs = [...pokemon.locations];
                              newLocs[i].area = e.target.value;
                              updateField("locations", newLocs);
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr auto",
                            gap: "10px",
                          }}
                        >
                          <input
                            type="text"
                            className="universal-input"
                            placeholder="Levels"
                            value={loc.levels}
                            onChange={(e) => {
                              const newLocs = [...pokemon.locations];
                              newLocs[i].levels = e.target.value;
                              updateField("locations", newLocs);
                            }}
                          />
                          <input
                            type="text"
                            className="universal-input"
                            placeholder="Rarity"
                            value={loc.rarity}
                            onChange={(e) => {
                              const newLocs = [...pokemon.locations];
                              newLocs[i].rarity = e.target.value;
                              updateField("locations", newLocs);
                            }}
                          />
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              const newLocs = pokemon.locations.filter(
                                (_, idx) => idx !== i
                              );
                              updateField("locations", newLocs);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              marginTop: "100px",
              color: "#666",
            }}
          >
            Seleziona un Pokémon per iniziare.
          </div>
        )}
      </div>
    </div>
  );
};

export default PokedexEditor;
