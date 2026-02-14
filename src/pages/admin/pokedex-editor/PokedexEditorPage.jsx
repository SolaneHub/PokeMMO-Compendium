import { ArrowDown, ArrowUp, Plus, Save, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "@/components/atoms/Button";
import PageTitle from "@/components/atoms/PageTitle";
import PokemonSearchSelect from "@/components/molecules/PokemonSearchSelect";
import { useToast } from "@/context/ToastContext";
import {
  deletePokedexEntry,
  savePokedexEntry,
  updatePokedexEntry,
} from "@/firebase/firestoreService";
import { usePokedexData } from "@/hooks/usePokedexData";

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
  heldItems: [],
  tier: "",
  abilities: { main: [], hidden: "" },
  eggGroups: [],
  baseStats: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  moves: [],
  evolutions: [],
  locations: [],
  variants: [],
};

const PokedexEditorPage = () => {
  const { fullList, isLoading, refetch } = usePokedexData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [formData, setFormData] = useState(INITIAL_POKEMON_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    if (selectedPokemon) {
      const pokemonData = JSON.parse(JSON.stringify(selectedPokemon));
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
    const array = value.split(",").map((item) => item.trim());
    setFormData((prev) => ({ ...prev, [key]: array }));
  };

  const addEvolution = (name) => {
    const newEvo = { name, level: "Level ?" };
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

  const addLocation = (region, area, rarity, method) => {
    const newLoc = { region, area, rarity, method };
    setFormData((prev) => ({
      ...prev,
      locations: [...(prev.locations || []), newLoc],
    }));
  };

  const removeLocation = (index) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));
  };

  const addVariant = (name, category) => {
    const newVar = { name, category };
    setFormData((prev) => ({
      ...prev,
      variants: [...(prev.variants || []), newVar],
    }));
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!formData.name) {
      showToast("Pokémon name is required!", "error");
      return;
    }

    setIsSaving(true);
    try {
      await savePokedexEntry(formData);
      showToast(`${formData.name} saved successfully!`, "success");
      refetch();
    } catch (error) {
      showToast(`Error saving: ${error.message}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPokemon) return;
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedPokemon.name}?`
      )
    )
      return;

    setIsSaving(true);
    try {
      await deletePokedexEntry(selectedPokemon.id);
      showToast("Pokémon deleted!", "info");
      setSelectedPokemon(null);
      refetch();
    } catch (error) {
      showToast(`Error deleting: ${error.message}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto min-h-screen w-full flex-1 p-6">
      <PageTitle title="Admin: Pokedex Editor" />

      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pokedex Editor</h1>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedPokemon(null);
              setFormData(INITIAL_POKEMON_STATE);
            }}
            icon={Plus}
          >
            New Pokémon
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
            icon={Save}
          >
            {isSaving ? "Saving..." : "Save Entry"}
          </Button>
          {selectedPokemon && (
            <Button variant="danger" onClick={handleDelete} icon={Trash2}>
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Left: Search & List */}
        <div className="lg:col-span-1">
          <div className="relative mb-4">
            <Search
              className="absolute top-1/2 left-3 -translate-y-1/2"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg border border-slate-600 bg-slate-700 py-2 pr-4 pl-10 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="max-h-[700px] overflow-y-auto rounded-lg bg-slate-800 p-2">
            {isLoading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : (
              filteredList.map((p) => (
                <button
                  key={p.id}
                  className={`mb-1 w-full rounded px-3 py-2 text-left transition-colors ${
                    selectedPokemon?.id === p.id
                      ? "bg-blue-600"
                      : "bg-slate-700/50 hover:bg-slate-700"
                  }`}
                  onClick={() => setSelectedPokemon(p)}
                >
                  <span className="font-mono text-xs opacity-50">{p.id}</span>
                  <div className="font-bold">{p.name}</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Form */}
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-xl bg-slate-800 p-6 shadow-xl">
            <h2 className="mb-6 border-b border-slate-700 pb-2 text-xl font-bold">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs">ID</label>
                <input
                  name="id"
                  className="w-full rounded bg-slate-700 p-2 focus:outline-none"
                  value={formData.id}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs">Name</label>
                <input
                  name="name"
                  className="w-full rounded bg-slate-700 p-2 focus:outline-none"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs">Category</label>
                <input
                  name="category"
                  className="w-full rounded bg-slate-700 p-2 focus:outline-none"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs">
                  Types (comma separated)
                </label>
                <input
                  className="w-full rounded bg-slate-700 p-2 focus:outline-none"
                  value={formData.types.join(", ")}
                  onChange={(e) => handleArrayChange("types", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs">Description</label>
                <textarea
                  name="description"
                  rows="2"
                  className="w-full rounded bg-slate-700 p-2 focus:outline-none"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-800 p-6 shadow-xl">
            <h2 className="mb-6 border-b border-slate-700 pb-2 text-xl font-bold">
              Base Stats
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
              {["hp", "atk", "def", "spa", "spd", "spe"].map((stat) => (
                <div key={stat}>
                  <label className="mb-1 block text-xs uppercase">{stat}</label>
                  <input
                    type="number"
                    className="w-full rounded bg-slate-700 p-2 focus:outline-none"
                    value={formData.baseStats[stat]}
                    onChange={(e) =>
                      handleNestedChange(
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-slate-800 p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold">Evolutions</h2>
              <div className="space-y-2">
                {formData.evolutions?.map((evo, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      className="flex-1 rounded bg-slate-700 p-2 text-sm"
                      value={evo.name}
                      onChange={(e) => {
                        const newEvos = [...formData.evolutions];
                        newEvos[idx].name = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          evolutions: newEvos,
                        }));
                      }}
                    />
                    <input
                      className="w-24 rounded bg-slate-700 p-2 text-sm"
                      value={evo.level}
                      onChange={(e) => {
                        const newEvos = [...formData.evolutions];
                        newEvos[idx].level = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          evolutions: newEvos,
                        }));
                      }}
                    />
                    <button
                      onClick={() => removeEvolution(idx)}
                      className="text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addEvolution("New Evo")}
                  className="mt-2 flex items-center gap-1 text-xs text-blue-400"
                >
                  <Plus size={14} /> Add Evolution
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-slate-800 p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold">Locations</h2>
              <div className="space-y-4">
                {formData.locations?.map((loc, idx) => (
                  <div
                    key={idx}
                    className="relative rounded bg-slate-700/50 p-3"
                  >
                    <button
                      onClick={() => removeLocation(idx)}
                      className="absolute top-2 right-2 text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        placeholder="Region"
                        className="rounded bg-slate-700 p-1 text-xs"
                        value={loc.region}
                        onChange={(e) => {
                          const newLocs = [...formData.locations];
                          newLocs[idx].region = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            locations: newLocs,
                          }));
                        }}
                      />
                      <input
                        placeholder="Area"
                        className="rounded bg-slate-700 p-1 text-xs"
                        value={loc.area}
                        onChange={(e) => {
                          const newLocs = [...formData.locations];
                          newLocs[idx].area = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            locations: newLocs,
                          }));
                        }}
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addLocation("", "", "", "")}
                  className="flex items-center gap-1 text-xs text-blue-400"
                >
                  <Plus size={14} /> Add Location
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokedexEditorPage;
