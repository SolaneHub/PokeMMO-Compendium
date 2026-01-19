import {
  ArrowDown,
  ArrowUp,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  deletePokedexEntry,
  savePokedexEntry,
  updatePokedexEntry,
} from "@/firebase/firestoreService";
import PageTitle from "@/shared/components/PageTitle";
import { useToast } from "@/shared/components/ToastNotification";
import { usePokedexData } from "@/shared/hooks/usePokedexData";

const INITIAL_POKEMON_STATE = {
  id: "",
  name: "",
  category: "",
  types: [],
  description: "",
  height: "",
  weight: "",
  genderRatio: { m: 0, f: 0 },
  catchRate: "",
  baseExp: "",
  growthRate: "",
  evYield: "",
  heldItems: [], // Changed from "" to []
  tier: "",
  abilities: { main: [], hidden: "" },
  eggGroups: [],
  baseStats: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  moves: [],
  evolutions: [],
  locations: [],
  variants: [],
};

const PokemonSearchSelect = ({ allPokemon, onSelect, excludeNames = [] }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query) return [];
    return allPokemon
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) &&
          !excludeNames.includes(p.name)
      )
      .slice(0, 10);
  }, [allPokemon, query, excludeNames]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search Pokemon to add..."
          className="flex-1 rounded bg-slate-700 p-2 text-white focus:outline-none"
        />
        <button
          onClick={() => {
            setQuery("");
            setIsOpen(false);
          }}
          className="rounded bg-slate-600 p-2 hover:bg-slate-500"
        >
          <X size={16} />
        </button>
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-slate-600 bg-slate-800 shadow-xl">
          {filtered.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                onSelect(p.name);
                setQuery("");
                setIsOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-700"
            >
              {p.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PokedexEditorPage = () => {
  const { fullList, isLoading, refetch } = usePokedexData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [formData, setFormData] = useState(INITIAL_POKEMON_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const showToast = useToast();

  // Update form data when a pokemon is selected
  useEffect(() => {
    if (selectedPokemon) {
      const pokemonData = JSON.parse(JSON.stringify(selectedPokemon));
      // Ensure heldItems and eggGroups are arrays
      if (typeof pokemonData.heldItems === "string") {
        pokemonData.heldItems = pokemonData.heldItems
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== "");
      } else if (!Array.isArray(pokemonData.heldItems)) {
        pokemonData.heldItems = [];
      }
      if (typeof pokemonData.eggGroups === "string") {
        pokemonData.eggGroups = pokemonData.eggGroups
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== "");
      } else if (!Array.isArray(pokemonData.eggGroups)) {
        pokemonData.eggGroups = [];
      }
      setFormData(pokemonData);
    } else {
      setFormData(INITIAL_POKEMON_STATE);
    }
  }, [selectedPokemon]);

  const filteredList =
    fullList?.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (parent, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value,
      },
    }));
  };

  const handleArrayChange = (key, value) => {
    // Split by comma and trim
    const array = value.split(",").map((item) => item.trim());
    setFormData((prev) => ({ ...prev, [key]: array }));
  };

  // Evolution Handlers
  const addEvolution = (name) => {
    const newEvo = { name, level: "Level ?" }; // Default placeholder
    setFormData((prev) => ({
      ...prev,
      evolutions: [...(prev.evolutions || []), newEvo],
    }));
  };

  const removeEvolution = (index) => {
    setFormData((prev) => ({
      ...prev,
      evolutions: prev.evolutions.filter((_, i) => i !== index),
    }));
  };

  const updateEvolution = (index, field, value) => {
    setFormData((prev) => {
      const newEvos = [...prev.evolutions];
      newEvos[index] = { ...newEvos[index], [field]: value };
      return { ...prev, evolutions: newEvos };
    });
  };

  const moveEvolution = (index, direction) => {
    setFormData((prev) => {
      const newEvos = [...prev.evolutions];
      if (direction === "up" && index > 0) {
        [newEvos[index], newEvos[index - 1]] = [
          newEvos[index - 1],
          newEvos[index],
        ];
      } else if (direction === "down" && index < newEvos.length - 1) {
        [newEvos[index], newEvos[index + 1]] = [
          newEvos[index + 1],
          newEvos[index],
        ];
      }
      return { ...prev, evolutions: newEvos };
    });
  };

  const handleSave = async () => {
    if (!formData.name) {
      showToast("Name is required", "error");
      return;
    }

    // Validate ID is a number if provided
    if (formData.id && isNaN(Number(formData.id))) {
      showToast("ID must be a number", "error");
      return;
    }

    setIsSaving(true);
    try {
      const dataToSave = {
        ...formData,
        // Ensure baseStats are numbers
        baseStats: {
          hp: Number(formData.baseStats?.hp || 0),
          atk: Number(formData.baseStats?.atk || 0),
          def: Number(formData.baseStats?.def || 0),
          spa: Number(formData.baseStats?.spa || 0),
          spd: Number(formData.baseStats?.spd || 0),
          spe: Number(formData.baseStats?.spe || 0),
        },
        // Ensure id is a number or null if empty
        id: formData.id ? Number(formData.id) : null,
      };

      // Save the main pokemon being edited. This will create or fully update it.
      await savePokedexEntry(dataToSave);

      // Now, propagate the evolution chain to all members of the chain
      if (dataToSave.evolutions && dataToSave.evolutions.length > 0) {
        const chain = dataToSave.evolutions;
        const propagationPromises = chain.map(async (member) => {
          // We need to compare by name because 'id' could be different if user has not yet assigned a numerical id
          // to a newly added evolution member (whose id would be its name.toLowerCase()).
          if (member.name === dataToSave.name) {
            return null; // The currently edited Pokemon is already saved.
          }

          const existingPokemon = fullList.find((p) => p.name === member.name);

          if (existingPokemon) {
            // If the member exists, update its evolution chain
            // The helper `getPokemonDocId` will ensure ID is handled correctly
            return updatePokedexEntry(existingPokemon.id, {
              evolutions: chain,
            });
          } else {
            // If the member does not exist in our current fullList, create a stub entry for it.
            // Its ID will be its name.toLowerCase() by default in savePokedexEntry since `id` is null.
            const newPokemonData = {
              name: member.name,
              id: null, // Let savePokedexEntry handle the ID (will use name.toLowerCase())
              evolutions: chain,
              // Initialize other required fields to avoid `undefined` and ensure minimal valid structure
              category: "",
              types: [],
              description: "",
              height: "",
              weight: "",
              genderRatio: { m: 0, f: 0 },
              catchRate: "",
              baseExp: "",
              growthRate: "",
              evYield: "",
              heldItems: "",
              tier: "",
              abilities: { main: [], hidden: "" },
              eggGroups: [],
              baseStats: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
              moves: [],
              locations: [],
              variants: [],
            };
            return savePokedexEntry(newPokemonData);
          }
        });

        await Promise.all(propagationPromises.filter(Boolean)); // Filter out nulls for the main pokemon
        showToast(
          `Saved and synced evolution chain for ${chain.length} members.`,
          "success"
        );
      } else {
        showToast(`Saved ${formData.name} successfully.`, "success");
      }

      refetch();
      setSelectedPokemon(null);
    } catch (error) {
      showToast("Failed to save Pokemon. " + error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPokemon?.id) return;
    if (!confirm(`Are you sure you want to delete ${selectedPokemon.name}?`))
      return;

    setIsSaving(true);
    try {
      await deletePokedexEntry(selectedPokemon.id);
      showToast(`Deleted ${selectedPokemon.name}`, "success");
      setSelectedPokemon(null);
      refetch();
    } catch (error) {
      showToast("Failed to delete Pokemon", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-1 animate-[fade-in_0.3s_ease-out] flex-col overflow-x-hidden overflow-y-auto scroll-smooth p-4 lg:p-8">
      <div className="container mx-auto min-h-screen w-full flex-1 text-slate-200">
        <PageTitle title="Pokedex Editor" />
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Pokedex Editor</h1>
          <button
            onClick={() => setSelectedPokemon(null)}
            className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            <Plus size={20} /> New Pokemon
          </button>
        </div>

        <div className="grid h-[calc(100vh-200px)] grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Sidebar List */}
          <div className="flex flex-col rounded-xl border border-slate-700 bg-slate-800 p-4">
            <div className="relative mb-4">
              <Search
                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search Pokemon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 py-2 pr-4 pl-10 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto pr-2">
              {isLoading ? (
                <div className="text-center text-slate-400">Loading...</div>
              ) : (
                filteredList.map((p) => (
                  <button
                    key={p.id || p.name}
                    onClick={() => setSelectedPokemon(p)}
                    className={`w-full rounded-lg p-3 text-left transition-colors ${
                      selectedPokemon?.name === p.name
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <span className="mr-2 font-mono text-xs opacity-70">
                      #{String(p.id).padStart(3, "0")}
                    </span>
                    <span className="font-bold">{p.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Editor Form */}
          <div className="flex flex-col overflow-y-auto rounded-xl border border-slate-700 bg-slate-800 p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {selectedPokemon
                  ? `Editing ${selectedPokemon.name}`
                  : "New Pokemon"}
              </h2>
              <div className="flex gap-2">
                {selectedPokemon && (
                  <button
                    onClick={handleDelete}
                    disabled={isSaving}
                    className="rounded bg-red-600 p-2 text-white hover:bg-red-700 disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  <Save size={20} /> Save
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="border-b border-slate-700 pb-2 font-bold text-blue-400">
                  Basic Info
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs text-slate-400">ID</label>
                    <input
                      type="number"
                      name="id"
                      value={formData.id || ""}
                      onChange={handleInputChange}
                      className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs text-slate-400">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category || ""}
                    onChange={handleInputChange}
                    className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400">
                    Types (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.types?.join(", ") || ""}
                    onChange={(e) => handleArrayChange("types", e.target.value)}
                    className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <h3 className="border-b border-slate-700 pb-2 font-bold text-blue-400">
                  Base Stats
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {["hp", "atk", "def", "spa", "spd", "spe"].map((stat) => (
                    <div key={stat}>
                      <label className="block text-xs text-slate-400 uppercase">
                        {stat}
                      </label>
                      <input
                        type="number"
                        value={formData.baseStats?.[stat] || 0}
                        onChange={(e) =>
                          handleNestedChange("baseStats", stat, e.target.value)
                        }
                        className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Abilities */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="border-b border-slate-700 pb-2 font-bold text-blue-400">
                  Abilities & Details
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs text-slate-400">
                      Main Abilities (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.abilities?.main?.join(", ") || ""}
                      onChange={(e) => {
                        const array = e.target.value
                          .split(",")
                          .map((item) => item.trim());
                        setFormData((prev) => ({
                          ...prev,
                          abilities: { ...prev.abilities, main: array },
                        }));
                      }}
                      className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400">
                      Hidden Ability
                    </label>
                    <input
                      type="text"
                      value={formData.abilities?.hidden || ""}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          abilities: {
                            ...prev.abilities,
                            hidden: e.target.value,
                          },
                        }));
                      }}
                      className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                    />
                  </div>
                  {/* New Fields */}
                  <div>
                    <label className="block text-xs text-slate-400">
                      Egg Groups (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.eggGroups?.join(", ") || ""}
                      onChange={(e) =>
                        handleArrayChange("eggGroups", e.target.value)
                      }
                      className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-400">
                        Gender Ratio (M%)
                      </label>
                      <input
                        type="number"
                        value={formData.genderRatio?.m || 0}
                        onChange={(e) =>
                          handleNestedChange(
                            "genderRatio",
                            "m",
                            Number(e.target.value)
                          )
                        }
                        className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400">
                        Gender Ratio (F%)
                      </label>
                      <input
                        type="number"
                        value={formData.genderRatio?.f || 0}
                        onChange={(e) =>
                          handleNestedChange(
                            "genderRatio",
                            "f",
                            Number(e.target.value)
                          )
                        }
                        className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400">
                      Catch Rate
                    </label>
                    <input
                      type="text"
                      name="catchRate"
                      value={formData.catchRate || ""}
                      onChange={handleInputChange}
                      className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400">
                      Base EXP
                    </label>
                    <input
                      type="text"
                      name="baseExp"
                      value={formData.baseExp || ""}
                      onChange={handleInputChange}
                      className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400">
                      Growth Rate
                    </label>
                    <input
                      type="text"
                      name="growthRate"
                      value={formData.growthRate || ""}
                      onChange={handleInputChange}
                      className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400">
                      EV Yield
                    </label>
                    <input
                      type="text"
                      name="evYield"
                      value={formData.evYield || ""}
                      onChange={handleInputChange}
                      className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400">
                      Held Items (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.heldItems?.join(", ") || ""}
                      onChange={(e) =>
                        handleArrayChange("heldItems", e.target.value)
                      }
                      className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400">
                      Tier (PvP)
                    </label>
                    <input
                      type="text"
                      name="tier"
                      value={formData.tier || ""}
                      onChange={handleInputChange}
                      className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                    />
                  </div>
                  {/* Other Details - Existing fields */}
                  <div>
                    <label className="block text-xs text-slate-400">
                      Height
                    </label>
                    <input
                      type="text"
                      name="height"
                      value={formData.height || ""}
                      onChange={handleInputChange}
                      className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400">
                      Weight
                    </label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight || ""}
                      onChange={handleInputChange}
                      className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none"
                    />
                  </div>{" "}
                </div>
              </div>

              {/* Evolution Editor */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="border-b border-slate-700 pb-2 font-bold text-blue-400">
                  Evolution Chain
                </h3>
                <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                  <p className="mb-4 text-xs text-slate-400">
                    Define the full evolution chain order (Base -{">"} Evo 1 -
                    {">"} Evo 2).
                  </p>

                  <div className="space-y-2">
                    {(formData.evolutions || []).map((evo, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded bg-slate-800 p-2"
                      >
                        <span className="w-6 text-center text-xs text-slate-500">
                          {index + 1}
                        </span>

                        <div className="flex-1">
                          <div className="text-sm font-bold text-white">
                            {evo.name}
                          </div>
                        </div>

                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Level / Condition"
                            value={evo.level || ""}
                            onChange={(e) =>
                              updateEvolution(index, "level", e.target.value)
                            }
                            className="w-full rounded bg-slate-700 px-2 py-1 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => moveEvolution(index, "up")}
                            disabled={index === 0}
                            className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-30"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => moveEvolution(index, "down")}
                            disabled={
                              index === (formData.evolutions?.length || 0) - 1
                            }
                            className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-30"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            onClick={() => removeEvolution(index)}
                            className="rounded p-1 text-red-500 hover:bg-red-900/20"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <label className="mb-1 block text-xs text-slate-400">
                      Add Pokemon to Chain
                    </label>
                    <PokemonSearchSelect
                      allPokemon={fullList || []}
                      onSelect={addEvolution}
                      excludeNames={(formData.evolutions || []).map(
                        (e) => e.name
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Advanced / Raw JSON for specific fields */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="border-b border-slate-700 pb-2 font-bold text-blue-400">
                  Advanced Data (JSON)
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-slate-400">
                      Moves
                    </label>
                    <textarea
                      value={JSON.stringify(formData.moves, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          setFormData((prev) => ({ ...prev, moves: parsed }));
                        } catch (err) {
                          // ignore parse error while typing
                        }
                      }}
                      className="h-40 w-full rounded bg-slate-900 p-2 font-mono text-xs text-slate-300 focus:outline-none"
                    />
                  </div>
                  {/* Evolutions removed from here as it has its own UI now */}
                  <div>
                    <label className="mb-1 block text-xs text-slate-400">
                      Locations
                    </label>
                    <textarea
                      value={JSON.stringify(formData.locations, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          setFormData((prev) => ({
                            ...prev,
                            locations: parsed,
                          }));
                        } catch (err) {
                          // ignore
                        }
                      }}
                      className="h-40 w-full rounded bg-slate-900 p-2 font-mono text-xs text-slate-300 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokedexEditorPage;
