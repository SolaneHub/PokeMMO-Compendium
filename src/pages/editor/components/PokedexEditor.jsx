import { useState, useTransition } from "react";

import { useConfirm } from "@/shared/components/ConfirmationModal"; // Import useConfirm

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
  const confirm = useConfirm(); // Initialize useConfirm

  if (!data || !Array.isArray(data)) {
    return (
      <div className="p-5 text-center font-bold text-red-400 italic">
        ⚠️ Invalid Data.
      </div>
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
    <div className="flex h-full gap-6">
      <title>Editor: Pokédex</title>

      {/* LEFT LIST */}
      <div className="flex w-[280px] flex-col border-r border-white/5 pr-4">
        <div className="mb-4 flex flex-col gap-1">
          <h3 className="m-0 text-sm font-black tracking-widest text-blue-400 uppercase">
            Pokédex Registry
          </h3>
          <div className="h-1 w-8 rounded-full bg-blue-500" />
        </div>

        <input
          type="text"
          placeholder="Filter by name or ID..."
          className="mb-4 w-full rounded-lg border border-white/10 bg-[#0f1014] px-3 py-2 text-sm text-slate-100 transition-colors outline-none focus:border-blue-500"
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
          className={`custom-scrollbar flex-1 overflow-y-auto transition-opacity duration-200 ${
            isPending ? "opacity-50" : "opacity-100"
          }`}
        >
          <div className="space-y-1">
            {filteredList.map((p, index) => (
              <button
                key={p.id ?? index}
                onClick={() => setSelectedId(p.id)}
                className={`w-full rounded-lg p-2.5 text-left text-xs font-semibold transition-all ${
                  selectedId === p.id
                    ? "border border-blue-500/30 bg-blue-600/20 text-blue-400"
                    : "border border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <span className="mr-2 opacity-50">#{p.id}</span>{" "}
                {p.name || "Unnamed"}
              </button>
            ))}
          </div>
        </div>
        <button
          className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-green-700 active:scale-95"
          onClick={() => {
            const newId =
              data.length > 0 ? Math.max(...data.map((p) => p.id || 0)) + 1 : 1;
            onChange([...data, { ...POKE_TEMPLATE, id: newId }]);
            setSelectedId(newId);
            setActiveTab("info");
          }}
        >
          + Add New Entry
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
        {pokemon ? (
          <div className="mb-8 overflow-hidden rounded-2xl border border-white/5 bg-[#1a1b20] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 bg-white/5 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/5 bg-[#0f1014] text-xl font-black text-blue-400">
                  #{pokemon.id}
                </div>
                <h2 className="m-0 text-2xl font-black tracking-tight text-slate-100 uppercase">
                  {pokemon.name}
                </h2>
              </div>
              <button
                className="cursor-pointer rounded-lg border border-red-600/20 bg-red-600/10 px-4 py-2 text-xs font-bold text-red-400 transition-all hover:bg-red-600 hover:text-white"
                onClick={async () => {
                  const confirmed = await confirm({
                    message: "Permanently delete this Pokemon?",
                    title: "Delete Pokémon",
                    confirmText: "Delete",
                    cancelText: "Cancel",
                  });
                  if (confirmed) {
                    onChange(data.filter((p) => p.id !== selectedId));
                    setSelectedId(null);
                  }
                }}
              >
                Remove Pokémon
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 bg-[#0f1014]/50">
              {["info", "stats", "moves", "extra"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-3.5 text-[10px] font-black tracking-[0.2em] uppercase transition-all ${
                    activeTab === t
                      ? "border-b-2 border-blue-500 bg-[#1a1b20] text-blue-400"
                      : "border-b-2 border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300"
                  }`}
                >
                  {t === "info"
                    ? "📝 Overview"
                    : t === "stats"
                      ? "📊 Statistics"
                      : t === "moves"
                        ? "⚔️ Movepool"
                        : "🧬 Advanced"}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "info" && (
                <div className="animate-[fade-in_0.3s_ease-out] space-y-6">
                  <div className="grid grid-cols-[1fr_2fr] gap-6">
                    <div className="space-y-2">
                      <label className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                        Pokedex ID
                      </label>
                      <input
                        type="number"
                        className="w-full rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2.5 font-bold text-slate-100 transition-colors outline-none focus:border-blue-500"
                        value={pokemon.id}
                        onChange={(e) => {
                          const newId = parseInt(e.target.value);
                          updateField("id", newId);
                          setSelectedId(newId);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                        Pokémon Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2.5 font-bold text-slate-100 transition-colors outline-none focus:border-blue-500"
                        value={pokemon.name}
                        onChange={(e) => updateField("name", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                      Species Description
                    </label>
                    <textarea
                      className="min-h-[100px] w-full rounded-xl border border-white/10 bg-[#0f1014] px-4 py-3 text-sm text-slate-300 transition-colors outline-none focus:border-blue-500"
                      value={pokemon.description || ""}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Category", field: "category" },
                      { label: "Height", field: "height" },
                      { label: "Weight", field: "weight" },
                    ].map((item) => (
                      <div key={item.field} className="space-y-2">
                        <label className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                          {item.label}
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2 text-sm text-slate-200 transition-colors outline-none focus:border-blue-500"
                          value={pokemon[item.field] || ""}
                          onChange={(e) =>
                            updateField(item.field, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <div className="space-y-4 rounded-2xl border border-white/5 bg-[#0f1014]/50 p-4">
                      <label className="ml-1 text-[10px] font-black tracking-widest text-blue-400 uppercase">
                        Elemental Types
                      </label>
                      <div className="space-y-2">
                        {(pokemon.types || []).map((type, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              type="text"
                              className="w-full rounded-lg border border-white/10 bg-[#0f1014] px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-blue-500"
                              value={type}
                              onChange={(e) =>
                                updateArrayPrimitive("types", i, e.target.value)
                              }
                            />
                            <button
                              className="flex h-8 w-8 items-center justify-center rounded bg-red-600/20 text-red-400 transition-all hover:bg-red-600 hover:text-white"
                              onClick={() => removeArrayPrimitive("types", i)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          className="w-full rounded-lg border border-dashed border-blue-500/30 bg-blue-600/5 py-2 text-[10px] font-black tracking-widest text-blue-400 uppercase transition-all hover:bg-blue-600/10"
                          onClick={() => addArrayPrimitive("types")}
                        >
                          + Add Type
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-white/5 bg-[#0f1014]/50 p-4">
                      <label className="ml-1 text-[10px] font-black tracking-widest text-purple-400 uppercase">
                        Egg Groups
                      </label>
                      <div className="space-y-2">
                        {(pokemon.eggGroups || []).map((eg, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              type="text"
                              className="w-full rounded-lg border border-white/10 bg-[#0f1014] px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-blue-500"
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
                              className="flex h-8 w-8 items-center justify-center rounded bg-red-600/20 text-red-400 transition-all hover:bg-red-600 hover:text-white"
                              onClick={() =>
                                removeArrayPrimitive("eggGroups", i)
                              }
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          className="w-full rounded-lg border border-dashed border-purple-500/30 bg-purple-600/5 py-2 text-[10px] font-black tracking-widest text-purple-400 uppercase transition-all hover:bg-purple-600/10"
                          onClick={() => addArrayPrimitive("eggGroups")}
                        >
                          + Add Group
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "stats" && (
                <div className="animate-[fade-in_0.3s_ease-out] space-y-8">
                  <div className="space-y-4">
                    <h4 className="m-0 text-xs font-black tracking-[0.2em] text-orange-400 uppercase">
                      Base Statistics
                    </h4>
                    <div className="grid grid-cols-6 gap-4">
                      {["hp", "atk", "def", "spa", "spd", "spe"].map((stat) => (
                        <div key={stat} className="space-y-2">
                          <label className="block text-center text-[10px] font-black tracking-widest text-slate-500 uppercase">
                            {stat}
                          </label>
                          <input
                            type="number"
                            className="w-full rounded-xl border border-white/10 bg-[#0f1014] py-3 text-center text-lg font-black text-slate-100 transition-colors outline-none focus:border-orange-500"
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
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-5">
                      <h4 className="m-0 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Demographics
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Male %
                          </label>
                          <input
                            type="number"
                            className="w-full rounded-lg border border-white/10 bg-[#0f1014] px-3 py-2 text-sm font-bold text-slate-100 outline-none"
                            value={pokemon.genderRatio?.m ?? ""}
                            onChange={(e) =>
                              updateNested(
                                "genderRatio",
                                "m",
                                parseFloat(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Female %
                          </label>
                          <input
                            type="number"
                            className="w-full rounded-lg border border-white/10 bg-[#0f1014] px-3 py-2 text-sm font-bold text-slate-100 outline-none"
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
                      </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-5">
                      <h4 className="m-0 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Metagame Info
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Catch Rate
                          </label>
                          <input
                            type="number"
                            className="w-full rounded-lg border border-white/10 bg-[#0f1014] px-3 py-2 text-sm font-bold text-slate-100 outline-none focus:border-blue-500"
                            value={pokemon.catchRate}
                            onChange={(e) =>
                              updateField("catchRate", parseInt(e.target.value))
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Tier
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-lg border border-white/10 bg-[#0f1014] px-3 py-2 text-sm font-bold text-slate-100 outline-none focus:border-blue-500"
                            value={pokemon.tier}
                            onChange={(e) =>
                              updateField("tier", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="m-0 text-xs font-black tracking-[0.2em] text-green-400 uppercase">
                      Abilities
                    </h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4 rounded-2xl border border-white/5 bg-[#0f1014]/50 p-4">
                        <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                          Main Slot
                        </label>
                        <div className="space-y-2">
                          {(pokemon.abilities?.main || []).map((ab, i) => (
                            <div key={i} className="flex gap-2">
                              <input
                                type="text"
                                className="w-full rounded-lg border border-white/10 bg-[#0f1014] px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-blue-500"
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
                                className="flex h-8 w-8 items-center justify-center rounded bg-red-600/20 text-red-400 transition-all hover:bg-red-600 hover:text-white"
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
                            className="w-full rounded-lg border border-dashed border-green-500/30 bg-green-600/5 py-2 text-[10px] font-black tracking-widest text-green-400 uppercase transition-all hover:bg-green-600/10"
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
                      </div>
                      <div className="space-y-2">
                        <label className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                          Hidden Ability
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2.5 text-sm font-bold text-slate-100 outline-none focus:border-green-500"
                          value={pokemon.abilities?.hidden || ""}
                          onChange={(e) =>
                            updateNested("abilities", "hidden", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "moves" && (
                <div className="animate-[fade-in_0.3s_ease-out] space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h4 className="m-0 text-xl font-black tracking-tight text-slate-100 uppercase">
                        Movepool
                      </h4>
                      <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                        {pokemon.moves?.length || 0} Learned Moves
                      </span>
                    </div>
                    <button
                      className="rounded-xl bg-green-600 px-6 py-2.5 text-xs font-black text-white shadow-lg transition-all hover:bg-green-700 active:scale-95"
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
                      + Register Move
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-[60px_2fr_100px_80px_60px_60px_40px] gap-4 border-b border-white/5 px-4 py-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                      <span>Level</span>
                      <span>Name</span>
                      <span>Type</span>
                      <span>Class</span>
                      <span>Pwr</span>
                      <span>Acc</span>
                      <span></span>
                    </div>

                    <div className="space-y-1.5">
                      {(pokemon.moves || []).map((move, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-[60px_2fr_100px_80px_60px_60px_40px] items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-2 transition-colors hover:bg-white/10"
                        >
                          <input
                            type="text"
                            className="w-full rounded-lg border border-white/10 bg-[#0f1014] px-1 py-1 text-center text-xs font-black text-blue-400 outline-none"
                            value={move.level}
                            onChange={(e) => {
                              const newMoves = [...pokemon.moves];
                              newMoves[i].level = e.target.value;
                              updateField("moves", newMoves);
                            }}
                          />
                          <input
                            type="text"
                            className="w-full rounded-lg border border-white/10 bg-[#0f1014] px-3 py-1 text-xs font-bold text-slate-100 outline-none"
                            value={move.name}
                            onChange={(e) => {
                              const newMoves = [...pokemon.moves];
                              newMoves[i].name = e.target.value;
                              updateField("moves", newMoves);
                            }}
                          />
                          <input
                            type="text"
                            className="w-full rounded-lg border border-white/10 bg-[#0f1014] px-2 py-1 text-[10px] font-bold text-slate-300 outline-none"
                            value={move.type}
                            onChange={(e) => {
                              const newMoves = [...pokemon.moves];
                              newMoves[i].type = e.target.value;
                              updateField("moves", newMoves);
                            }}
                          />
                          <select
                            className="w-full cursor-pointer rounded-lg border border-white/10 bg-[#0f1014] px-1 py-1 text-[10px] font-bold text-slate-300 outline-none"
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
                            className="w-full rounded-lg border border-white/10 bg-[#0f1014] px-1 py-1 text-center text-xs font-bold text-slate-200 outline-none"
                            value={move.pwr}
                            onChange={(e) => {
                              const newMoves = [...pokemon.moves];
                              newMoves[i].pwr = e.target.value;
                              updateField("moves", newMoves);
                            }}
                          />
                          <input
                            type="text"
                            className="w-full rounded-lg border border-white/10 bg-[#0f1014] px-1 py-1 text-center text-xs font-bold text-slate-200 outline-none"
                            value={move.acc}
                            onChange={(e) => {
                              const newMoves = [...pokemon.moves];
                              newMoves[i].acc = e.target.value;
                              updateField("moves", newMoves);
                            }}
                          />
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-red-600/20 hover:text-red-400"
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
                </div>
              )}

              {activeTab === "extra" && (
                <div className="animate-[fade-in_0.3s_ease-out] space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <h4 className="m-0 text-xs font-black tracking-[0.2em] text-yellow-500 uppercase">
                        Evolution Chain
                      </h4>
                      <button
                        className="rounded-lg border border-green-600/20 bg-green-600/10 px-3 py-1.5 text-xs font-bold text-green-400 transition-all hover:bg-green-600 hover:text-white"
                        onClick={() => {
                          updateField("evolutions", [
                            ...(pokemon.evolutions || []),
                            { name: "", level: "", sprite_id: 0 },
                          ]);
                        }}
                      >
                        + Add Form
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(pokemon.evolutions || []).map((evo, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-[1fr_1fr_100px_auto] items-end gap-4 rounded-2xl border border-white/5 bg-white/5 p-4"
                        >
                          <div className="space-y-1.5">
                            <label className="ml-1 block text-[10px] font-black tracking-widest text-slate-500 uppercase">
                              Species
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2 text-xs font-bold text-slate-100 outline-none focus:border-yellow-500"
                              value={evo.name}
                              onChange={(e) => {
                                const newEvos = [...pokemon.evolutions];
                                newEvos[i].name = e.target.value;
                                updateField("evolutions", newEvos);
                              }}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="ml-1 block text-[10px] font-black tracking-widest text-slate-500 uppercase">
                              Method/Level
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2 text-xs font-bold text-slate-100 outline-none focus:border-yellow-500"
                              value={evo.level}
                              onChange={(e) => {
                                const newEvos = [...pokemon.evolutions];
                                newEvos[i].level = e.target.value;
                                updateField("evolutions", newEvos);
                              }}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="ml-1 block text-[10px] font-black tracking-widest text-slate-500 uppercase">
                              Sprite ID
                            </label>
                            <input
                              type="number"
                              className="w-full rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2 text-xs font-bold text-slate-100 outline-none focus:border-yellow-500"
                              value={evo.sprite_id}
                              onChange={(e) => {
                                const newEvos = [...pokemon.evolutions];
                                newEvos[i].sprite_id = parseInt(e.target.value);
                                updateField("evolutions", newEvos);
                              }}
                            />
                          </div>
                          <button
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-600/20 bg-red-600/10 text-red-400 transition-all hover:bg-red-600 hover:text-white"
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
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <h4 className="m-0 text-xs font-black tracking-[0.2em] text-pink-400 uppercase">
                        World Locations
                      </h4>
                      <button
                        className="rounded-lg border border-green-600/20 bg-green-600/10 px-3 py-1.5 text-xs font-bold text-green-400 transition-all hover:bg-green-600 hover:text-white"
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
                        + Add Region Area
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(pokemon.locations || []).map((loc, i) => (
                        <div
                          key={i}
                          className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-4 shadow-sm"
                        >
                          <div className="grid grid-cols-[1fr_2fr_auto] gap-4">
                            <input
                              type="text"
                              className="rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2 text-xs font-bold text-slate-100 outline-none focus:border-pink-500"
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
                              className="rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2 text-xs font-bold text-slate-100 outline-none focus:border-pink-500"
                              placeholder="Area Name"
                              value={loc.area}
                              onChange={(e) => {
                                const newLocs = [...pokemon.locations];
                                newLocs[i].area = e.target.value;
                                updateField("locations", newLocs);
                              }}
                            />
                            <button
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-600/20 bg-red-600/10 text-red-400 transition-all hover:bg-red-600 hover:text-white"
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
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                                Levels
                              </label>
                              <input
                                type="text"
                                className="w-full rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2 text-xs text-slate-200 outline-none"
                                placeholder="e.g. 25 - 30"
                                value={loc.levels}
                                onChange={(e) => {
                                  const newLocs = [...pokemon.locations];
                                  newLocs[i].levels = e.target.value;
                                  updateField("locations", newLocs);
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                                Rarity
                              </label>
                              <input
                                type="text"
                                className="w-full rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2 text-xs text-slate-200 outline-none"
                                placeholder="e.g. Common (20%)"
                                value={loc.rarity}
                                onChange={(e) => {
                                  const newLocs = [...pokemon.locations];
                                  newLocs[i].rarity = e.target.value;
                                  updateField("locations", newLocs);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-[60vh] flex-col items-center justify-center opacity-30 select-none">
            <div className="mb-4 text-8xl">📜</div>
            <p className="text-xl font-black tracking-[0.3em] text-slate-500 uppercase">
              Select Registry Entry
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokedexEditor;
