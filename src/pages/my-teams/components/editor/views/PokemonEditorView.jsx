import { Save, Search } from "lucide-react";
import React, { memo, useState } from "react";

import { usePokedexData } from "@/shared/hooks/usePokedexData";

const NATURES = [
  "Adamant",
  "Bashful",
  "Bold",
  "Brave",
  "Calm",
  "Careful",
  "Docile",
  "Gentle",
  "Hardy",
  "Hasty",
  "Impish",
  "Jolly",
  "Lax",
  "Lonely",
  "Mild",
  "Modest",
  "Naive",
  "Naughty",
  "Quiet",
  "Quirky",
  "Rash",
  "Relaxed",
  "Sassy",
  "Serious",
  "Timid",
];

const DataListOptions = memo(({ options }) => (
  <>
    {options.map((val) => (
      <option key={val} value={val} />
    ))}
  </>
));

DataListOptions.displayName = "DataListOptions";

const getInitialFormData = (inputData) => {
  if (inputData) {
    return {
      name: inputData.name || "",
      item: inputData.item || "",
      ability: inputData.ability || "",
      nature: inputData.nature || "",
      evs: inputData.evs || "",
      ivs: inputData.ivs || "",
      moves: [
        inputData.moves?.[0] || "",
        inputData.moves?.[1] || "",
        inputData.moves?.[2] || "",
        inputData.moves?.[3] || "",
      ],
    };
  }
  return {
    name: "",
    item: "",
    ability: "",
    nature: "",
    evs: "",
    ivs: "",
    moves: ["", "", "", ""],
  };
};

const PokemonEditorView = ({ data, onSave }) => {
  const {
    pokemonNames: allPokemonNames = [],
    itemNames: allItems = [],
    moveNames: allMoves = [],
    abilityNames: allAbilities = [],
  } = usePokedexData();

  const [formData, setFormData] = useState(() => getInitialFormData(data));

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMoveChange = (index, value) => {
    setFormData((prev) => {
      const newMoves = [...prev.moves];
      newMoves[index] = value;
      return { ...prev, moves: newMoves };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const cleanMoves = formData.moves.filter((m) => m.trim() !== "");

    onSave({
      ...formData,
      moves: cleanMoves,
    });
  };

  return (
    <div className="flex flex-col rounded-xl border border-[#333] bg-[#1a1b20] p-6 shadow-sm">
      <div className="flex flex-1 animate-[fade-in_0.3s_ease-out] flex-col">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b-2 border-blue-500 pb-2.5">
          <div>
            <h2 className="text-xl font-bold text-white">
              {data?.name ? `Editing ${data.name}` : "Edit Pokémon Slot"}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Configure stats, moves, and held item.
            </p>
          </div>
          <button
            onClick={handleSubmit}
            className="flex cursor-pointer items-center gap-2 rounded border-none bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:translate-y-[1px]"
          >
            <Save size={16} />
            Apply
          </button>
        </div>

        {/* Form Body */}
        <form id="pokemon-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Core Info */}
          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wider text-blue-400 uppercase">
              Core Info
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="group">
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  Pokémon Name
                </label>
                <div className="relative">
                  <input
                    list="pokemon-list"
                    type="text"
                    required
                    className="w-full rounded-lg border border-[#333] bg-black/20 p-3 pl-10 text-white transition-colors focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. Garchomp"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  <Search
                    className="absolute top-3.5 left-3 text-slate-500"
                    size={18}
                  />
                  <datalist id="pokemon-list">
                    <DataListOptions options={allPokemonNames} />
                  </datalist>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  Held Item
                </label>
                <input
                  list="items-list"
                  type="text"
                  className="w-full rounded-lg border border-[#333] bg-black/20 p-3 text-white transition-colors focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Choice Scarf"
                  value={formData.item}
                  onChange={(e) => handleChange("item", e.target.value)}
                />
                <datalist id="items-list">
                  <DataListOptions options={allItems} />
                </datalist>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#333]" />

          {/* Section: Stats */}
          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wider text-blue-400 uppercase">
              Stats & Nature
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  Nature
                </label>
                <input
                  list="natures-list"
                  type="text"
                  className="w-full rounded-lg border border-[#333] bg-black/20 p-2.5 text-white focus:border-blue-500 focus:outline-none"
                  value={formData.nature}
                  onChange={(e) => handleChange("nature", e.target.value)}
                />
                <datalist id="natures-list">
                  <DataListOptions options={NATURES} />
                </datalist>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  Ability
                </label>
                <input
                  list="abilities-list"
                  type="text"
                  className="w-full rounded-lg border border-[#333] bg-black/20 p-2.5 text-white focus:border-blue-500 focus:outline-none"
                  value={formData.ability}
                  onChange={(e) => handleChange("ability", e.target.value)}
                />
                <datalist id="abilities-list">
                  <DataListOptions options={allAbilities} />
                </datalist>
              </div>

              <div className="grid grid-cols-1 gap-6 md:col-span-2 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-400">
                    EVs
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-[#333] bg-black/20 p-2.5 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. 6 HP / 252 Atk / 252 Spe"
                    value={formData.evs}
                    onChange={(e) => handleChange("evs", e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-400">
                    IVs
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-[#333] bg-black/20 p-2.5 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. 5x31/4x31/3x31/2x31/1x31/0"
                    value={formData.ivs}
                    onChange={(e) => handleChange("ivs", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#333]" />

          {/* Section: Moves */}
          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wider text-blue-400 uppercase">
              Moveset
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {formData.moves.map((move, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute top-3 left-3 font-mono text-xs text-slate-500">
                    #{idx + 1}
                  </span>
                  <input
                    list="moves-list"
                    type="text"
                    className="w-full rounded-lg border border-[#333] bg-black/20 p-2.5 pl-8 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Select move..."
                    value={move}
                    onChange={(e) => handleMoveChange(idx, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <datalist id="moves-list">
              <DataListOptions options={allMoves} />
            </datalist>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PokemonEditorView;
