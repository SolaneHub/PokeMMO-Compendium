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
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  if (!data || !Array.isArray(data)) {
    return (
      <div className="p-5 text-[#ff6b81] text-center">⚠️ Dati non validi.</div>
    );
  }

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

  return (
    <div className="flex h-full gap-5">
      <title>Editor: Pokédex</title>

      <div className="w-[250px] flex flex-col border-r border-[#333] pr-[15px]">
        <h3 className="m-0 mb-2.5 text-[#00bcd4] text-lg font-bold">
          📖 Pokedex
        </h3>
        <input
          type="text"
          placeholder="Cerca..."
          className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full mb-2.5 transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="overflow-y-auto flex-1">
          {filteredList.map((p, index) => (
            <div
              key={p.id ?? index}
              onClick={() => setSelectedId(p.id)}
              className={`p-2 cursor-pointer border-l-[3px] mb-0.5 transition-colors
                ${
                  selectedId === p.id
                    ? "bg-[#00bcd4]/15 border-[#00bcd4] text-white"
                    : "bg-transparent border-transparent text-[#aaa] hover:bg-[#2526]"
                }`}
            >
              <strong>#{p.id}</strong> {p.name || "Senza Nome"}
            </div>
          ))}
        </div>
        <button
          className="bg-green-600 hover:bg-green-700 text-white border-none rounded px-4 py-2 text-sm font-medium cursor-pointer mt-2.5 flex items-center justify-center gap-2 transition-all active:translate-y-[1px]"
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

      <div className="flex-1 overflow-y-auto pr-2.5">
        {pokemon ? (
          <div className="bg-[#1e1e1e] border border-[#333] rounded-md shadow-sm mb-5 overflow-hidden p-0">
            <div className="p-4 px-5 bg-[#252526] flex justify-between items-center">
              <h2 className="m-0 text-white text-xl font-bold">
                {pokemon.name}{" "}
                <span className="text-[0.6em] text-[#888]">#{pokemon.id}</span>
              </h2>
              <button
                className="bg-red-600 hover:bg-red-700 text-white border-none rounded px-2 py-1 text-xs font-medium cursor-pointer transition-all"
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

            <div className="flex bg-[#1e1e1e] border-b border-[#333]">
              {["info", "stats", "moves", "extra"].map((t) => (
                <div
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 p-2.5 cursor-pointer text-center border-b-[3px] transition-colors
                    ${
                      activeTab === t
                        ? "bg-[#333] border-[#00bcd4] font-bold text-white"
                        : "bg-transparent border-transparent font-normal text-[#888] hover:bg-[#2526]"
                    }`}
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

            <div className="p-5">
              {activeTab === "info" && (
                <div className="animate-[fade-in_0.3s_ease-out]">
                  <div className="grid grid-cols-[1fr_2fr] gap-5 mb-4">
                    <div>
                      <label className="text-[#aaa] text-xs font-bold block mb-1.5 uppercase">
                        ID
                      </label>
                      <input
                        type="number"
                        className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                        value={pokemon.id}
                        onChange={(e) => {
                          const newId = parseInt(e.target.value);
                          updateField("id", newId);
                          setSelectedId(newId);
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-[#aaa] text-xs font-bold block mb-1.5 uppercase">
                        Nome
                      </label>
                      <input
                        type="text"
                        className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                        value={pokemon.name}
                        onChange={(e) => updateField("name", e.target.value)}
                      />
                    </div>
                  </div>

                  <label className="text-[#aaa] text-xs font-bold block mb-1.5 uppercase">
                    Descrizione
                  </label>
                  <textarea
                    className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full mb-4 transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                    rows={3}
                    value={pokemon.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                  />

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-[#aaa] text-xs font-bold block mb-1.5 uppercase">
                        Category
                      </label>
                      <input
                        type="text"
                        className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                        value={pokemon.category || ""}
                        onChange={(e) =>
                          updateField("category", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="text-[#aaa] text-xs font-bold block mb-1.5 uppercase">
                        Height
                      </label>
                      <input
                        type="text"
                        className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                        value={pokemon.height || ""}
                        onChange={(e) => updateField("height", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[#aaa] text-xs font-bold block mb-1.5 uppercase">
                        Weight
                      </label>
                      <input
                        type="text"
                        className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                        value={pokemon.weight || ""}
                        onChange={(e) => updateField("weight", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="bg-[#252526] p-2.5 rounded-md">
                      <label className="text-[#aaa] text-xs font-bold block mb-1.5 uppercase">
                        Types
                      </label>
                      {(pokemon.types || []).map((type, i) => (
                        <div key={i} className="flex mb-1.5">
                          <input
                            type="text"
                            className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                            value={type}
                            onChange={(e) =>
                              updateArrayPrimitive("types", i, e.target.value)
                            }
                          />
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white border-none rounded px-2 py-1 text-xs font-medium cursor-pointer ml-1.5 transition-all"
                            onClick={() => removeArrayPrimitive("types", i)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white border-none rounded px-2 py-1 text-xs font-medium cursor-pointer w-full transition-all"
                        onClick={() => addArrayPrimitive("types")}
                      >
                        + Add Type
                      </button>
                    </div>

                    <div className="bg-[#252526] p-2.5 rounded-md">
                      <label className="text-[#aaa] text-xs font-bold block mb-1.5 uppercase">
                        Egg Groups
                      </label>
                      {(pokemon.eggGroups || []).map((eg, i) => (
                        <div key={i} className="flex mb-1.5">
                          <input
                            type="text"
                            className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
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
                            className="bg-red-600 hover:bg-red-700 text-white border-none rounded px-2 py-1 text-xs font-medium cursor-pointer ml-1.5 transition-all"
                            onClick={() => removeArrayPrimitive("eggGroups", i)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white border-none rounded px-2 py-1 text-xs font-medium cursor-pointer w-full transition-all"
                        onClick={() => addArrayPrimitive("eggGroups")}
                      >
                        + Add Group
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "stats" && (
                <div className="animate-[fade-in_0.3s_ease-out]">
                  <h4 className="border-b border-[#444] pb-1.5 text-[#fab1a0] font-semibold mb-4">
                    Base Stats
                  </h4>
                  <div className="grid grid-cols-6 gap-2.5 mb-5">
                    {["hp", "atk", "def", "spa", "spd", "spe"].map((stat) => (
                      <div key={stat} className="text-center">
                        <label className="uppercase text-xs text-[#888] font-bold block mb-1">
                          {stat}
                        </label>
                        <input
                          type="number"
                          className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-1 py-2 w-full text-center font-bold transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
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

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-[#aaa] text-xs font-bold block mb-1.5 uppercase">
                        Gender Ratio (M %)
                      </label>
                      <input
                        type="number"
                        className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                        value={pokemon.genderRatio?.m ?? ""}
                        onChange={(e) =>
                          updateNested(
                            "genderRatio",
                            "m",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                      <label className="text-[#aaa] text-xs font-bold block mt-2.5 mb-1.5 uppercase">
                        Gender Ratio (F %)
                      </label>
                      <input
                        type="number"
                        className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
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
                      <label className="text-[#aaa] text-xs font-bold block mb-1.5 uppercase">
                        Catch Rate
                      </label>
                      <input
                        type="number"
                        className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                        value={pokemon.catchRate}
                        onChange={(e) =>
                          updateField("catchRate", parseInt(e.target.value))
                        }
                      />
                      <label className="text-[#aaa] text-xs font-bold block mt-2.5 mb-1.5 uppercase">
                        Tier
                      </label>
                      <input
                        type="text"
                        className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                        value={pokemon.tier}
                        onChange={(e) => updateField("tier", e.target.value)}
                      />
                    </div>
                  </div>

                  <h4 className="border-b border-[#444] pb-1.5 text-[#a3be8c] mt-5 font-semibold mb-4">
                    Abilities
                  </h4>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="bg-[#252526] p-2.5 rounded-md">
                      <label className="text-[#aaa] text-xs font-bold block mb-1.5 uppercase">
                        Main Abilities
                      </label>
                      {(pokemon.abilities?.main || []).map((ab, i) => (
                        <div key={i} className="flex mt-1.5">
                          <input
                            type="text"
                            className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
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
                            className="bg-red-600 hover:bg-red-700 text-white border-none rounded px-2 py-1 text-xs font-medium cursor-pointer ml-1.5 transition-all"
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
                        className="bg-blue-600 hover:bg-blue-700 text-white border-none rounded px-2 py-1 text-xs font-medium cursor-pointer mt-1.5 w-full transition-all"
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
                      <label className="text-[#aaa] text-xs font-bold block mb-1.5 uppercase">
                        Hidden Ability
                      </label>
                      <input
                        type="text"
                        className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
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
                <div className="animate-[fade-in_0.3s_ease-out]">
                  <div className="flex justify-between mb-2.5 items-center">
                    <h4 className="m-0 text-[#81a1c1] font-bold">
                      Moves ({pokemon.moves?.length || 0})
                    </h4>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white border-none rounded px-2 py-1 text-xs font-medium cursor-pointer transition-all"
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

                  <div className="grid gap-2">
                    <div className="grid grid-cols-[50px_2fr_100px_80px_50px_50px_40px] gap-2.5 px-2.5 text-xs text-[#888] font-bold uppercase">
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
                        className="grid grid-cols-[50px_2fr_100px_80px_50px_50px_40px] gap-2.5 bg-[#2e2e2e] p-2 rounded items-center"
                      >
                        <input
                          type="text"
                          className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-1 py-1 w-full text-center text-sm transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                          value={move.level}
                          onChange={(e) => {
                            const newMoves = [...pokemon.moves];
                            newMoves[i].level = e.target.value;
                            updateField("moves", newMoves);
                          }}
                        />
                        <input
                          type="text"
                          className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-1 py-1 w-full text-sm transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                          value={move.name}
                          onChange={(e) => {
                            const newMoves = [...pokemon.moves];
                            newMoves[i].name = e.target.value;
                            updateField("moves", newMoves);
                          }}
                        />
                        <input
                          type="text"
                          className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-1 py-1 w-full text-sm transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                          value={move.type}
                          onChange={(e) => {
                            const newMoves = [...pokemon.moves];
                            newMoves[i].type = e.target.value;
                            updateField("moves", newMoves);
                          }}
                        />
                        <select
                          className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-1 py-1 w-full text-sm transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
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
                          className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-1 py-1 w-full text-center text-sm transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                          value={move.pwr}
                          onChange={(e) => {
                            const newMoves = [...pokemon.moves];
                            newMoves[i].pwr = e.target.value;
                            updateField("moves", newMoves);
                          }}
                        />
                        <input
                          type="text"
                          className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-1 py-1 w-full text-center text-sm transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                          value={move.acc}
                          onChange={(e) => {
                            const newMoves = [...pokemon.moves];
                            newMoves[i].acc = e.target.value;
                            updateField("moves", newMoves);
                          }}
                        />
                        <button
                          className="bg-transparent border-none text-[#555] text-lg leading-none cursor-pointer px-1 rounded transition-colors hover:text-[#ff6b6b] hover:bg-red-500/10"
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
                <div className="animate-[fade-in_0.3s_ease-out]">
                  <div className="mb-8">
                    <div className="flex justify-between mb-2.5 border-b border-[#444] pb-1.5 items-center">
                      <h4 className="m-0 text-[#ebcb8b] font-bold">
                        Evolutions
                      </h4>
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white border-none rounded px-2 py-1 text-xs font-medium cursor-pointer transition-all"
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
                        className="bg-[#252526] p-2.5 rounded-md mb-2.5 grid grid-cols-[1fr_1fr_1fr_auto] gap-2.5 items-end"
                      >
                        <div>
                          <label className="text-[0.7rem] text-[#aaa] font-bold uppercase mb-1 block">
                            Name
                          </label>
                          <input
                            type="text"
                            className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                            value={evo.name}
                            onChange={(e) => {
                              const newEvos = [...pokemon.evolutions];
                              newEvos[i].name = e.target.value;
                              updateField("evolutions", newEvos);
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-[0.7rem] text-[#aaa] font-bold uppercase mb-1 block">
                            Condition
                          </label>
                          <input
                            type="text"
                            className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                            value={evo.level}
                            onChange={(e) => {
                              const newEvos = [...pokemon.evolutions];
                              newEvos[i].level = e.target.value;
                              updateField("evolutions", newEvos);
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-[0.7rem] text-[#aaa] font-bold uppercase mb-1 block">
                            Sprite ID
                          </label>
                          <input
                            type="number"
                            className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                            value={evo.sprite_id}
                            onChange={(e) => {
                              const newEvos = [...pokemon.evolutions];
                              newEvos[i].sprite_id = parseInt(e.target.value);
                              updateField("evolutions", newEvos);
                            }}
                          />
                        </div>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white border-none rounded px-2 py-1 text-xs font-medium cursor-pointer transition-all h-[38px]"
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
                    <div className="flex justify-between mb-2.5 border-b border-[#444] pb-1.5 items-center">
                      <h4 className="m-0 text-[#b48ead] font-bold">
                        Locations
                      </h4>
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white border-none rounded px-2 py-1 text-xs font-medium cursor-pointer transition-all"
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
                        className="bg-[#252526] p-2.5 rounded-md mb-2.5"
                      >
                        <div className="grid grid-cols-[1fr_2fr] gap-2.5 mb-1.5">
                          <input
                            type="text"
                            className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
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
                            className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                            placeholder="Area"
                            value={loc.area}
                            onChange={(e) => {
                              const newLocs = [...pokemon.locations];
                              newLocs[i].area = e.target.value;
                              updateField("locations", newLocs);
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-[1fr_1fr_auto] gap-2.5">
                          <input
                            type="text"
                            className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
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
                            className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                            placeholder="Rarity"
                            value={loc.rarity}
                            onChange={(e) => {
                              const newLocs = [...pokemon.locations];
                              newLocs[i].rarity = e.target.value;
                              updateField("locations", newLocs);
                            }}
                          />
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white border-none rounded px-2 py-1 text-xs font-medium cursor-pointer transition-all"
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
          <div className="text-center mt-[100px] text-[#666]">
            Seleziona un Pokémon per iniziare.
          </div>
        )}
      </div>
    </div>
  );
};

export default PokedexEditor;
