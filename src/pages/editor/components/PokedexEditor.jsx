import { useState, useTransition } from "react";

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
  const [deferredSearch, setDeferredSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  if (!data || !Array.isArray(data)) {
    return (
      <div className="p-5 text-center text-[#ff6b81]">⚠️ Invalid Data.</div>
    );
  }

  const filteredList = data.filter((p) => {
    if (!p) return false;
    const name = (p.name || "").toLowerCase();
    const s = deferredSearch.toLowerCase();
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

      <div className="flex w-[250px] flex-col border-r border-[#333] pr-[15px]">
        <h3 className="m-0 mb-2.5 text-lg font-bold text-[#00bcd4]">
          📖 Pokedex
        </h3>
        <input
          type="text"
          placeholder="Search..."
          className="mb-2.5 w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            startTransition(() => {
              setDeferredSearch(value);
            });
          }}
        />
        <div
          className={`flex-1 overflow-y-auto transition-opacity duration-200 ${
            isPending ? "opacity-50" : "opacity-100"
          }`}
        >
          {filteredList.map((p, index) => (
            <div
              key={p.id ?? index}
              onClick={() => setSelectedId(p.id)}
              className={`mb-0.5 cursor-pointer border-l-[3px] p-2 transition-colors ${
                selectedId === p.id
                  ? "border-[#00bcd4] bg-[#00bcd4]/15 text-white"
                  : "border-transparent bg-transparent text-[#aaa] hover:bg-[#2526]"
              }`}
            >
              <strong>#{p.id}</strong> {p.name || "Unnamed"}
            </div>
          ))}
        </div>
        <button
          className="mt-2.5 flex cursor-pointer items-center justify-center gap-2 rounded border-none bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 active:translate-y-[1px]"
          onClick={() => {
            const newId =
              data.length > 0 ? Math.max(...data.map((p) => p.id || 0)) + 1 : 1;
            onChange([...data, { ...POKE_TEMPLATE, id: newId }]);
            setSelectedId(newId);
            setActiveTab("info");
          }}
        >
          + New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2.5">
        {pokemon ? (
          <div className="mb-5 overflow-hidden rounded-md border border-[#333] bg-[#1e1e1e] p-0 shadow-sm">
            <div className="flex items-center justify-between bg-[#252526] p-4 px-5">
              <h2 className="m-0 text-xl font-bold text-white">
                {pokemon.name}{" "}
                <span className="text-[0.6em] text-[#888]">#{pokemon.id}</span>
              </h2>
              <button
                className="cursor-pointer rounded border-none bg-red-600 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-red-700"
                onClick={() => {
                  if (window.confirm("Permanently delete?")) {
                    onChange(data.filter((p) => p.id !== selectedId));
                    setSelectedId(null);
                  }
                }}
              >
                Delete
              </button>
            </div>

            <div className="flex border-b border-[#333] bg-[#1e1e1e]">
              {["info", "stats", "moves", "extra"].map((t) => (
                <div
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 cursor-pointer border-b-[3px] p-2.5 text-center transition-colors ${
                    activeTab === t
                      ? "border-[#00bcd4] bg-[#333] font-bold text-white"
                      : "border-transparent bg-transparent font-normal text-[#888] hover:bg-[#2526]"
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
                  <div className="mb-4 grid grid-cols-[1fr_2fr] gap-5">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-[#aaa] uppercase">
                        ID
                      </label>
                      <input
                        type="number"
                        className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                        value={pokemon.id}
                        onChange={(e) => {
                          const newId = parseInt(e.target.value);
                          updateField("id", newId);
                          setSelectedId(newId);
                        }}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-[#aaa] uppercase">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                        value={pokemon.name}
                        onChange={(e) => updateField("name", e.target.value)}
                      />
                    </div>
                  </div>

                  <label className="mb-1.5 block text-xs font-bold text-[#aaa] uppercase">
                    Description
                  </label>
                  <textarea
                    className="mb-4 w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                    rows={3}
                    value={pokemon.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                  />

                  <div className="mb-4 grid grid-cols-3 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-[#aaa] uppercase">
                        Category
                      </label>
                      <input
                        type="text"
                        className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                        value={pokemon.category || ""}
                        onChange={(e) =>
                          updateField("category", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-[#aaa] uppercase">
                        Height
                      </label>
                      <input
                        type="text"
                        className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                        value={pokemon.height || ""}
                        onChange={(e) => updateField("height", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-[#aaa] uppercase">
                        Weight
                      </label>
                      <input
                        type="text"
                        className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                        value={pokemon.weight || ""}
                        onChange={(e) => updateField("weight", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="rounded-md bg-[#252526] p-2.5">
                      <label className="mb-1.5 block text-xs font-bold text-[#aaa] uppercase">
                        Types
                      </label>
                      {(pokemon.types || []).map((type, i) => (
                        <div key={i} className="mb-1.5 flex">
                          <input
                            type="text"
                            className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                            value={type}
                            onChange={(e) =>
                              updateArrayPrimitive("types", i, e.target.value)
                            }
                          />
                          <button
                            className="ml-1.5 cursor-pointer rounded border-none bg-red-600 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-red-700"
                            onClick={() => removeArrayPrimitive("types", i)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        className="w-full cursor-pointer rounded border-none bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-blue-700"
                        onClick={() => addArrayPrimitive("types")}
                      >
                        + Add Type
                      </button>
                    </div>

                    <div className="rounded-md bg-[#252526] p-2.5">
                      <label className="mb-1.5 block text-xs font-bold text-[#aaa] uppercase">
                        Egg Groups
                      </label>
                      {(pokemon.eggGroups || []).map((eg, i) => (
                        <div key={i} className="mb-1.5 flex">
                          <input
                            type="text"
                            className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
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
                            className="ml-1.5 cursor-pointer rounded border-none bg-red-600 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-red-700"
                            onClick={() => removeArrayPrimitive("eggGroups", i)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        className="w-full cursor-pointer rounded border-none bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-blue-700"
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
                  <h4 className="mb-4 border-b border-[#444] pb-1.5 font-semibold text-[#fab1a0]">
                    Base Stats
                  </h4>
                  <div className="mb-5 grid grid-cols-6 gap-2.5">
                    {["hp", "atk", "def", "spa", "spd", "spe"].map((stat) => (
                      <div key={stat} className="text-center">
                        <label className="mb-1 block text-xs font-bold text-[#888] uppercase">
                          {stat}
                        </label>
                        <input
                          type="number"
                          className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-1 py-2 text-center font-bold text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
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
                      <label className="mb-1.5 block text-xs font-bold text-[#aaa] uppercase">
                        Gender Ratio (M %)
                      </label>
                      <input
                        type="number"
                        className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                        value={pokemon.genderRatio?.m ?? ""}
                        onChange={(e) =>
                          updateNested(
                            "genderRatio",
                            "m",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                      <label className="mt-2.5 mb-1.5 block text-xs font-bold text-[#aaa] uppercase">
                        Gender Ratio (F %)
                      </label>
                      <input
                        type="number"
                        className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
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
                      <label className="mb-1.5 block text-xs font-bold text-[#aaa] uppercase">
                        Catch Rate
                      </label>
                      <input
                        type="number"
                        className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                        value={pokemon.catchRate}
                        onChange={(e) =>
                          updateField("catchRate", parseInt(e.target.value))
                        }
                      />
                      <label className="mt-2.5 mb-1.5 block text-xs font-bold text-[#aaa] uppercase">
                        Tier
                      </label>
                      <input
                        type="text"
                        className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                        value={pokemon.tier}
                        onChange={(e) => updateField("tier", e.target.value)}
                      />
                    </div>
                  </div>

                  <h4 className="mt-5 mb-4 border-b border-[#444] pb-1.5 font-semibold text-[#a3be8c]">
                    Abilities
                  </h4>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="rounded-md bg-[#252526] p-2.5">
                      <label className="mb-1.5 block text-xs font-bold text-[#aaa] uppercase">
                        Main Abilities
                      </label>
                      {(pokemon.abilities?.main || []).map((ab, i) => (
                        <div key={i} className="mt-1.5 flex">
                          <input
                            type="text"
                            className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
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
                            className="ml-1.5 cursor-pointer rounded border-none bg-red-600 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-red-700"
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
                        className="mt-1.5 w-full cursor-pointer rounded border-none bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-blue-700"
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
                      <label className="mb-1.5 block text-xs font-bold text-[#aaa] uppercase">
                        Hidden Ability
                      </label>
                      <input
                        type="text"
                        className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
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
                  <div className="mb-2.5 flex items-center justify-between">
                    <h4 className="m-0 font-bold text-[#81a1c1]">
                      Moves ({pokemon.moves?.length || 0})
                    </h4>
                    <button
                      className="cursor-pointer rounded border-none bg-green-600 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-green-700"
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
                    <div className="grid grid-cols-[50px_2fr_100px_80px_50px_50px_40px] gap-2.5 px-2.5 text-xs font-bold text-[#888] uppercase">
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
                        className="grid grid-cols-[50px_2fr_100px_80px_50px_50px_40px] items-center gap-2.5 rounded bg-[#2e2e2e] p-2"
                      >
                        <input
                          type="text"
                          className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-1 py-1 text-center text-sm text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                          value={move.level}
                          onChange={(e) => {
                            const newMoves = [...pokemon.moves];
                            newMoves[i].level = e.target.value;
                            updateField("moves", newMoves);
                          }}
                        />
                        <input
                          type="text"
                          className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-1 py-1 text-sm text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                          value={move.name}
                          onChange={(e) => {
                            const newMoves = [...pokemon.moves];
                            newMoves[i].name = e.target.value;
                            updateField("moves", newMoves);
                          }}
                        />
                        <input
                          type="text"
                          className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-1 py-1 text-sm text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                          value={move.type}
                          onChange={(e) => {
                            const newMoves = [...pokemon.moves];
                            newMoves[i].type = e.target.value;
                            updateField("moves", newMoves);
                          }}
                        />
                        <select
                          className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-1 py-1 text-sm text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
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
                          className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-1 py-1 text-center text-sm text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                          value={move.pwr}
                          onChange={(e) => {
                            const newMoves = [...pokemon.moves];
                            newMoves[i].pwr = e.target.value;
                            updateField("moves", newMoves);
                          }}
                        />
                        <input
                          type="text"
                          className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-1 py-1 text-center text-sm text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                          value={move.acc}
                          onChange={(e) => {
                            const newMoves = [...pokemon.moves];
                            newMoves[i].acc = e.target.value;
                            updateField("moves", newMoves);
                          }}
                        />
                        <button
                          className="cursor-pointer rounded border-none bg-transparent px-1 text-lg leading-none text-[#555] transition-colors hover:bg-red-500/10 hover:text-[#ff6b6b]"
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
                    <div className="mb-2.5 flex items-center justify-between border-b border-[#444] pb-1.5">
                      <h4 className="m-0 font-bold text-[#ebcb8b]">
                        Evolutions
                      </h4>
                      <button
                        className="cursor-pointer rounded border-none bg-green-600 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-green-700"
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
                        className="mb-2.5 grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-2.5 rounded-md bg-[#252526] p-2.5"
                      >
                        <div>
                          <label className="mb-1 block text-[0.7rem] font-bold text-[#aaa] uppercase">
                            Name
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                            value={evo.name}
                            onChange={(e) => {
                              const newEvos = [...pokemon.evolutions];
                              newEvos[i].name = e.target.value;
                              updateField("evolutions", newEvos);
                            }}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[0.7rem] font-bold text-[#aaa] uppercase">
                            Condition
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                            value={evo.level}
                            onChange={(e) => {
                              const newEvos = [...pokemon.evolutions];
                              newEvos[i].level = e.target.value;
                              updateField("evolutions", newEvos);
                            }}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[0.7rem] font-bold text-[#aaa] uppercase">
                            Sprite ID
                          </label>
                          <input
                            type="number"
                            className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                            value={evo.sprite_id}
                            onChange={(e) => {
                              const newEvos = [...pokemon.evolutions];
                              newEvos[i].sprite_id = parseInt(e.target.value);
                              updateField("evolutions", newEvos);
                            }}
                          />
                        </div>
                        <button
                          className="h-[38px] cursor-pointer rounded border-none bg-red-600 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-red-700"
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
                    <div className="mb-2.5 flex items-center justify-between border-b border-[#444] pb-1.5">
                      <h4 className="m-0 font-bold text-[#b48ead]">
                        Locations
                      </h4>
                      <button
                        className="cursor-pointer rounded border-none bg-green-600 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-green-700"
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
                        className="mb-2.5 rounded-md bg-[#252526] p-2.5"
                      >
                        <div className="mb-1.5 grid grid-cols-[1fr_2fr] gap-2.5">
                          <input
                            type="text"
                            className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
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
                            className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
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
                            className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
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
                            className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                            placeholder="Rarity"
                            value={loc.rarity}
                            onChange={(e) => {
                              const newLocs = [...pokemon.locations];
                              newLocs[i].rarity = e.target.value;
                              updateField("locations", newLocs);
                            }}
                          />
                          <button
                            className="cursor-pointer rounded border-none bg-red-600 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-red-700"
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
          <div className="mt-[100px] text-center text-[#666]">
            Select a Pokémon to start.
          </div>
        )}
      </div>
    </div>
  );
};

export default PokedexEditor;
