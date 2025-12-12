import { Save, Search, X } from "lucide-react";
import React, { useState } from "react";

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

const PokemonEditorModal = ({ isOpen, onClose, initialData, onSave }) => {
  const {
    pokemonNames: allPokemonNames = [],
    itemNames: allItems = [],
    moveNames: allMoves = [],
    abilityNames: allAbilities = [],
  } = usePokedexData();

  const allNatures = NATURES;

  const getInitialFormData = (data) => {
    if (data) {
      return {
        name: data.name || "",
        item: data.item || "",
        ability: data.ability || "",
        nature: data.nature || "",
        evs: data.evs || "",
        ivs: data.ivs || "",
        moves: [
          data.moves?.[0] || "",
          data.moves?.[1] || "",
          data.moves?.[2] || "",
          data.moves?.[3] || "",
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

  const [formData, setFormData] = useState(() =>
    getInitialFormData(initialData)
  );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMoveChange = (index, value) => {
    const newMoves = [...formData.moves];
    newMoves[index] = value;
    setFormData((prev) => ({ ...prev, moves: newMoves }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate generic name at least
    if (!formData.name.trim()) return;

    // Filter out empty moves
    const cleanMoves = formData.moves.filter((m) => m.trim() !== "");

    // Construct final object
    // Assuming we might want to fetch dexId or sprite url if possible, but for now name is key.
    // The parent component handles sprite logic based on name usually.
    onSave({
      ...formData,
      moves: cleanMoves,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900/50 p-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            {initialData ? "Edit Pokémon" : "Add Pokémon"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 transition-colors hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
          <form id="pokemon-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Name & Item */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="group">
                <label className="mb-1 block text-sm font-medium text-slate-400">
                  Pokémon Name
                </label>
                <div className="relative">
                  <input
                    list="pokemon-list"
                    type="text"
                    required
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 p-3 pl-10 text-white transition-colors focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. Garchomp"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  <Search
                    className="absolute top-3.5 left-3 text-slate-500"
                    size={18}
                  />
                  <datalist id="pokemon-list">
                    {allPokemonNames.map((p) => (
                      <option key={p} value={p} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-400">
                  Held Item
                </label>
                <input
                  list="items-list"
                  type="text"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 p-3 text-white transition-colors focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Choice Scarf"
                  value={formData.item}
                  onChange={(e) => handleChange("item", e.target.value)}
                />
                <datalist id="items-list">
                  {allItems.map((i) => (
                    <option key={i} value={i} />
                  ))}
                </datalist>
              </div>
            </div>
            {/* Row 2: Ability, Nature, EVs, IVs */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-400">
                  Ability
                </label>
                <input
                  list="abilities-list"
                  type="text"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 p-2.5 text-white focus:border-blue-500 focus:outline-none"
                  value={formData.ability}
                  onChange={(e) => handleChange("ability", e.target.value)}
                />
                <datalist id="abilities-list">
                  {allAbilities.map((a) => (
                    <option key={a} value={a} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-400">
                  Nature
                </label>
                <input
                  list="natures-list"
                  type="text"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 p-2.5 text-white focus:border-blue-500 focus:outline-none"
                  value={formData.nature}
                  onChange={(e) => handleChange("nature", e.target.value)}
                />
                <datalist id="natures-list">
                  {allNatures.map((n) => (
                    <option key={n} value={n} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-400">
                  EVs
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 p-2.5 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. 6 HP / 252 Atk / 252 Spe"
                  value={formData.evs}
                  onChange={(e) => handleChange("evs", e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-400">
                  IVs
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 p-2.5 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. 5x31/4x31/3x31/2x31/1x31/0"
                  value={formData.ivs}
                  onChange={(e) => handleChange("ivs", e.target.value)}
                />
              </div>
            </div>
            {/* Row 3: Moves */}{" "}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-400">
                Moveset
              </label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {formData.moves.map((move, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute top-3 left-3 font-mono text-xs text-slate-500">
                      #{idx + 1}
                    </span>
                    <input
                      list="moves-list"
                      type="text"
                      className="w-full rounded-lg border border-slate-600 bg-slate-900 p-2.5 pl-8 text-white focus:border-blue-500 focus:outline-none"
                      placeholder="Select move..."
                      value={move}
                      onChange={(e) => handleMoveChange(idx, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <datalist id="moves-list">
                {allMoves.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-700 bg-slate-900/50 p-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="pokemon-form"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-bold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95"
          >
            <Save size={18} />
            Save Pokémon
          </button>
        </div>
      </div>
    </div>
  );
};

export default PokemonEditorModal;
