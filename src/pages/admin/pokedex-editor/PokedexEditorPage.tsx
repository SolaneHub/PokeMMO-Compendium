import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

import Button from "@/components/atoms/Button";
import PageTitle from "@/components/atoms/PageTitle";
import { useMoves } from "@/context/MovesContext";
import { usePokedexContext } from "@/context/PokedexContext";
import { useToast } from "@/context/ToastContext";
import {
  deletePokedexEntry,
  savePokedexEntry,
  updatePokedexData,
  updatePokedexSummary,
} from "@/firebase/services/pokedexService";
import { usePokedexData } from "@/hooks/usePokedexData";
import {
  BaseStats,
  Evolution,
  Location,
  MoveMaster,
  Pokemon,
  PokemonMove,
} from "@/types/pokemon";

// Extended interface for editor with temp IDs
interface EditorMove extends PokemonMove {
  tempId: string;
}

const INITIAL_POKEMON_STATE: Pokemon = {
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
  dexId: "",
};

// Helper function to propagate moves from a base pokemon to its evolutions
const propagateMovesToEvolutions = (
  basePokemon: Pokemon,
  allPokemon: Pokemon[],
  visited: Set<string> = new Set()
): Pokemon[] => {
  const baseName = basePokemon.name.toLowerCase().trim();
  if (!baseName || visited.has(baseName)) return [];
  visited.add(baseName);

  if (!basePokemon.evolutions || basePokemon.evolutions.length === 0) return [];

  // Copy all move properties including level
  const baseMoves = basePokemon.moves.map(({ name, ...rest }) => ({
    name,
    ...rest,
  }));

  const updates: Pokemon[] = [];

  basePokemon.evolutions.forEach((evo) => {
    // Find evolution in allPokemon list
    const evoPokemon = allPokemon.find(
      (p) => p.name.toLowerCase().trim() === evo.name.toLowerCase().trim()
    );

    if (evoPokemon) {
      const evoName = evoPokemon.name.toLowerCase().trim();
      // Avoid infinite loop if an evolution points back to a parent or itself
      if (visited.has(evoName)) return;

      const newMovesList: PokemonMove[] = [];
      const evolutionExistingMoves = [...(evoPokemon.moves || [])];

      // For each move in base pokemon, add to evolution's move list
      baseMoves.forEach((bm) => {
        const existingMoveInEvoIdx = evolutionExistingMoves.findIndex(
          (m) => m.name.toLowerCase().trim() === bm.name.toLowerCase().trim()
        );

        if (existingMoveInEvoIdx !== -1) {
          // Overwrite with base move data (including level) as requested
          newMovesList.push({ ...bm });
          // Remove from temporary list to track what's left
          evolutionExistingMoves.splice(existingMoveInEvoIdx, 1);
        } else {
          // If it's a new move from base, add it with the base level
          newMovesList.push({ ...bm });
        }
      });

      // Add remaining moves that are unique to the evolution
      newMovesList.push(...evolutionExistingMoves);

      // Check if there was an actual change to avoid unnecessary updates
      const isDifferent =
        JSON.stringify(evoPokemon.moves) !== JSON.stringify(newMovesList);

      const updatedEvo: Pokemon = { ...evoPokemon, moves: newMovesList };
      if (isDifferent) {
        updates.push(updatedEvo);
      }

      // Recursively propagate to the next levels of evolution
      updates.push(
        ...propagateMovesToEvolutions(updatedEvo, allPokemon, visited)
      );
    }
  });

  // Filter unique updates by ID
  const uniqueUpdates: Record<string, Pokemon> = {};
  updates.forEach((p) => {
    if (p.id) uniqueUpdates[p.id.toString()] = p;
  });

  return Object.values(uniqueUpdates);
};

const SortableMoveItem = ({
  move,
  idx,
  handleMoveNameChange,
  removeMove,
  setFormData,
  masterMoves,
}: {
  move: EditorMove;
  idx: number;
  handleMoveNameChange: (idx: number, name: string) => void;
  removeMove: (idx: number) => void;
  setFormData: React.Dispatch<React.SetStateAction<Pokemon>>;
  masterMoves: MoveMaster[];
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: move.tempId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded bg-slate-700/30 p-2"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab p-1 text-slate-500 hover:text-slate-300"
      >
        <GripVertical size={16} />
      </div>
      <input
        placeholder="Lvl"
        className="w-12 rounded bg-slate-700 p-1 text-sm text-white"
        value={move.level || ""}
        onChange={(e) => {
          setFormData((prev) => {
            const newMoves = [...prev.moves];
            newMoves[idx] = { ...newMoves[idx], level: e.target.value };
            return { ...prev, moves: newMoves };
          });
        }}
      />
      <input
        placeholder="Move Name"
        className="min-w-30 flex-1 rounded bg-slate-700 p-1 text-sm text-white"
        list="master-moves-list"
        value={move.name}
        onChange={(e) => handleMoveNameChange(idx, e.target.value)}
      />
      <input
        placeholder="Type"
        className="w-20 rounded bg-slate-700 p-1 text-sm text-white"
        value={move.type || ""}
        onChange={(e) => {
          setFormData((prev) => {
            const newMoves = [...prev.moves];
            newMoves[idx] = { ...newMoves[idx], type: e.target.value };
            return { ...prev, moves: newMoves };
          });
        }}
      />
      <select
        className="w-24 rounded bg-slate-700 p-1 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500"
        value={move.category || ""}
        onChange={(e) => {
          setFormData((prev) => {
            const newMoves = [...prev.moves];
            newMoves[idx] = { ...newMoves[idx], category: e.target.value };
            return { ...prev, moves: newMoves };
          });
        }}
      >
        <option value="">Category</option>
        <option value="Physical">Physical</option>
        <option value="Special">Special</option>
        <option value="Status">Status</option>
      </select>
      <input
        placeholder="Pwr"
        className="w-12 rounded bg-slate-700 p-1 text-sm text-white"
        value={move.power || ""}
        onChange={(e) => {
          setFormData((prev) => {
            const newMoves = [...prev.moves];
            newMoves[idx] = { ...newMoves[idx], power: e.target.value };
            return { ...prev, moves: newMoves };
          });
        }}
      />
      <input
        placeholder="PP"
        className="w-12 rounded bg-slate-700 p-1 text-sm text-white"
        value={move.pp || ""}
        onChange={(e) => {
          setFormData((prev) => {
            const newMoves = [...prev.moves];
            newMoves[idx] = { ...newMoves[idx], pp: e.target.value };
            return { ...prev, moves: newMoves };
          });
        }}
      />
      <input
        placeholder="Acc"
        className="w-12 rounded bg-slate-700 p-1 text-sm text-white"
        value={move.accuracy || ""}
        onChange={(e) => {
          setFormData((prev) => {
            const newMoves = [...prev.moves];
            newMoves[idx] = { ...newMoves[idx], accuracy: e.target.value };
            return { ...prev, moves: newMoves };
          });
        }}
      />
      <button
        onClick={() => removeMove(idx)}
        className="text-red-400 hover:text-red-300"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

const PokedexEditorPage = () => {
  const { fullList, isLoading: pokedexLoading, refetch } = usePokedexData();
  const { getPokemonDetails } = usePokedexContext();
  const { moves: masterMoves, isLoading: movesLoading } = useMoves();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [formData, setFormData] = useState<Pokemon>(INITIAL_POKEMON_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingFull, setIsFetchingFull] = useState(false);
  const showToast = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const isLoading = pokedexLoading || movesLoading || isFetchingFull;

  useEffect(() => {
    if (selectedPokemon) {
      const pokemonData = {
        ...INITIAL_POKEMON_STATE,
        ...JSON.parse(JSON.stringify(selectedPokemon)),
      };

      // Handle the string-to-array conversions
      if (typeof pokemonData.heldItems === "string") {
        pokemonData.heldItems = pokemonData.heldItems
          .split(",")
          .map((item: string) => item.trim())
          .filter((item: string) => item !== "");
      } else if (
        pokemonData.heldItems &&
        typeof pokemonData.heldItems === "object" &&
        !Array.isArray(pokemonData.heldItems)
      ) {
        // Convert object { "Item": "5%" } to array ["Item (5%)"] for the editor input
        pokemonData.heldItems = Object.entries(
          pokemonData.heldItems as Record<string, string>
        ).map(([item, rate]) => (rate ? `${item} (${rate})` : item));
      } else if (!Array.isArray(pokemonData.heldItems)) {
        pokemonData.heldItems = [];
      }

      if (typeof pokemonData.eggGroups === "string") {
        pokemonData.eggGroups = pokemonData.eggGroups
          .split(",")
          .map((item: string) => item.trim())
          .filter((item: string) => item !== "");
      } else if (!Array.isArray(pokemonData.eggGroups)) {
        pokemonData.eggGroups = [];
      }

      // Ensure all required nested structures are properly initialized
      pokemonData.baseStats = {
        ...INITIAL_POKEMON_STATE.baseStats,
        ...(pokemonData.baseStats || {}),
      };
      pokemonData.abilities = {
        ...INITIAL_POKEMON_STATE.abilities,
        ...(pokemonData.abilities || {}),
      };
      pokemonData.genderRatio = {
        ...INITIAL_POKEMON_STATE.genderRatio,
        ...(pokemonData.genderRatio || {}),
      };
      pokemonData.types = pokemonData.types || [];

      // Add temp IDs to moves for sorting
      pokemonData.moves = (pokemonData.moves || []).map(
        (m: PokemonMove, i: number) => ({
          ...m,
          tempId:
            (m as EditorMove).tempId ||
            `move-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        })
      );

      pokemonData.evolutions = pokemonData.evolutions || [];
      pokemonData.locations = pokemonData.locations || [];
      pokemonData.variants = pokemonData.variants || [];

      setFormData(pokemonData);
    } else {
      setFormData(INITIAL_POKEMON_STATE);
    }
  }, [selectedPokemon]);

  const filteredList =
    fullList?.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (
    parent: keyof Pokemon,
    key: string,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as Record<string, unknown>),
        [key]: value,
      },
    }));
  };

  const handleArrayChange = (key: keyof Pokemon, value: string) => {
    const array = value.split(",").map((item) => item.trim());
    setFormData((prev) => ({ ...prev, [key]: array }));
  };

  const handleNestedArrayChange = (
    parent: keyof Pokemon,
    key: string,
    value: string
  ) => {
    const array = value.split(",").map((item) => item.trim());
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as Record<string, unknown>),
        [key]: array,
      },
    }));
  };

  const addEvolution = (name: string) => {
    const newEvo: Evolution = { name, level: "Level ?" };
    setFormData((prev) => ({
      ...prev,
      evolutions: [...(prev.evolutions || []), newEvo],
    }));
  };

  const removeEvolution = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      evolutions: prev.evolutions.filter((_, i) => i !== index),
    }));
  };

  const addMove = () => {
    const newMove: EditorMove = {
      name: "",
      type: "",
      level: "",
      tempId: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setFormData((prev) => ({
      ...prev,
      moves: [...(prev.moves || []), newMove],
    }));
  };

  const removeMove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      moves: prev.moves.filter((_, i) => i !== index),
    }));
  };

  const handleMoveNameChange = (idx: number, name: string) => {
    const newMoves = [...formData.moves];
    const masterMove = masterMoves.find((m) => m.name === name);

    if (masterMove) {
      newMoves[idx] = {
        ...newMoves[idx],
        name: masterMove.name,
        type: masterMove.type,
        category: masterMove.category,
        power: masterMove.power,
        accuracy: masterMove.accuracy,
        pp: masterMove.pp,
      };
    } else {
      newMoves[idx].name = name;
    }

    setFormData((prev) => ({ ...prev, moves: newMoves }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFormData((prev) => {
        const oldIndex = (prev.moves as EditorMove[]).findIndex(
          (m) => m.tempId === active.id
        );
        const newIndex = (prev.moves as EditorMove[]).findIndex(
          (m) => m.tempId === over.id
        );

        return {
          ...prev,
          moves: arrayMove(prev.moves, oldIndex, newIndex),
        };
      });
    }
  };

  const addLocation = () => {
    const newLoc: Location = {
      region: "",
      area: "",
      rarity: "",
      method: "",
      levels: "",
    };
    setFormData((prev) => ({
      ...prev,
      locations: [...(prev.locations || []), newLoc],
    }));
  };

  const removeLocation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!formData.name) {
      showToast("Pokémon name is required!", "error");
      return;
    }

    setIsSaving(true);
    try {
      // Remove temp IDs before saving
      const dataToSave = {
        ...formData,
        moves: (formData.moves as EditorMove[]).map(
          ({ tempId: _, ...rest }) => rest
        ),
      };

      // Convert heldItems array back to object if rates are detected in parentheses
      if (Array.isArray(dataToSave.heldItems)) {
        const hasRates = dataToSave.heldItems.some(
          (item) => item.includes("(") && item.includes(")")
        );
        if (hasRates) {
          const heldItemsObject: Record<string, string> = {};
          dataToSave.heldItems.forEach((itemStr) => {
            const match = itemStr.match(/(.+)\s*\((.+)\)/);
            if (match) {
              heldItemsObject[match[1].trim()] = match[2].trim();
            } else if (itemStr.trim()) {
              heldItemsObject[itemStr.trim()] = "";
            }
          });
          dataToSave.heldItems = heldItemsObject;
        }
      }

      await savePokedexEntry(dataToSave);

      // Update summary metadata
      const newFullList = [...(fullList || [])];
      const idx = newFullList.findIndex((p) => p.id === dataToSave.id);
      if (idx !== -1) {
        newFullList[idx] = dataToSave;
      } else {
        newFullList.push(dataToSave);
      }
      await updatePokedexSummary(newFullList);

      showToast(`${formData.name} saved successfully!`, "success");
      refetch();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      showToast(`Error saving: ${message}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncMovesToEvolutions = async () => {
    if (!formData.name) {
      showToast("Pokémon name is required!", "error");
      return;
    }

    setIsSaving(true);
    try {
      // Remove temp IDs before syncing
      const dataToSync = {
        ...formData,
        moves: (formData.moves as EditorMove[]).map(
          ({ tempId: _, ...rest }) => rest
        ),
      };

      const evolutionUpdates = propagateMovesToEvolutions(
        dataToSync,
        fullList || []
      );

      if (evolutionUpdates.length > 0) {
        await updatePokedexData(evolutionUpdates);

        // Update summary metadata for all affected pokemon
        const newFullList = [...(fullList || [])];
        evolutionUpdates.forEach((update) => {
          const idx = newFullList.findIndex((p) => p.id === update.id);
          if (idx !== -1) newFullList[idx] = { ...newFullList[idx], ...update };
        });
        await updatePokedexSummary(newFullList);

        showToast(
          `Synced moves to ${evolutionUpdates.length} evolutions!`,
          "success"
        );
        refetch();
      } else {
        showToast("No evolutions to sync or already up to date.", "info");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      showToast(`Error syncing: ${message}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAlignAllEvolutions = async () => {
    if (!fullList) return;
    if (
      !window.confirm(
        "Are you sure you want to align moves for ALL evolutions in the Pokedex? This may take a while."
      )
    )
      return;

    setIsSaving(true);
    try {
      const allUpdates: Record<string, Pokemon> = {};

      // We iterate through all pokemon and propagate moves
      fullList.forEach((pokemon) => {
        const updates = propagateMovesToEvolutions(pokemon, fullList);
        updates.forEach((u) => {
          if (u.id) allUpdates[u.id.toString()] = u;
        });
      });

      const updateArray = Object.values(allUpdates);
      if (updateArray.length > 0) {
        await updatePokedexData(updateArray);

        // Update summary metadata
        const newFullList = [...(fullList || [])];
        updateArray.forEach((update) => {
          const idx = newFullList.findIndex((p) => p.id === update.id);
          if (idx !== -1) newFullList[idx] = { ...newFullList[idx], ...update };
        });
        await updatePokedexSummary(newFullList);

        showToast(
          `Aligned moves for ${updateArray.length} entries!`,
          "success"
        );
        refetch();
      } else {
        showToast("All evolutions are already aligned!", "info");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      showToast(`Error aligning: ${message}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Robust check: Is this Pokemon an evolution of someone ELSE?
  const currentName = formData.name.toLowerCase().trim();
  const isEvolution =
    !!currentName &&
    (fullList || []).some((p) => {
      const parentName = p.name.toLowerCase().trim();
      // A Pokemon is NOT an evolution of ITSELF (avoid self-disabling)
      if (parentName === currentName) return false;

      return p.evolutions?.some(
        (e) =>
          e.name.toLowerCase().trim() === currentName &&
          e.level?.toString().toLowerCase().trim() !== "base"
      );
    });

  const handleDelete = async () => {
    if (!selectedPokemon || !selectedPokemon.id) return;
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedPokemon.name}?`
      )
    )
      return;

    setIsSaving(true);
    try {
      await deletePokedexEntry(selectedPokemon.id);

      // Update summary metadata
      const newFullList = (fullList || []).filter(
        (p) => p.id !== selectedPokemon.id
      );
      await updatePokedexSummary(newFullList);

      showToast("Pokémon deleted!", "info");
      setSelectedPokemon(null);
      refetch();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      showToast(`Error deleting: ${message}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectPokemon = async (p: Pokemon) => {
    if (!p.id) return;
    setIsFetchingFull(true);
    try {
      const fullData = await getPokemonDetails(p.id);
      setSelectedPokemon(fullData || p);
    } catch (error) {
      console.error("Error selecting pokemon:", error);
      setSelectedPokemon(p);
    } finally {
      setIsFetchingFull(false);
    }
  };

  return (
    <div className="container mx-auto min-h-screen w-full flex-1 p-6 text-white">
      <PageTitle title="Admin: Pokedex Editor" />

      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-3xl font-bold text-white">Pokedex Editor</h1>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="secondary"
            onClick={handleSyncMovesToEvolutions}
            disabled={isSaving || !selectedPokemon || isEvolution}
            icon={RefreshCw}
          >
            Sync Evolutions
          </Button>
          <Button
            variant="secondary"
            onClick={handleAlignAllEvolutions}
            disabled={isSaving || isEvolution}
            icon={RefreshCw}
          >
            Align All
          </Button>
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
          <div className="sticky top-6 space-y-4">
            <div className="relative">
              <Search
                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg border border-slate-600 bg-slate-700 py-2 pr-4 pl-10 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="custom-scrollbar max-h-[calc(100vh-200px)] overflow-y-auto rounded-lg bg-slate-800 p-2">
              {isLoading ? (
                <div className="p-4 text-center text-white">Loading...</div>
              ) : (
                filteredList.map((p) => (
                  <button
                    key={p.id}
                    disabled={isFetchingFull}
                    className={`mb-1 w-full rounded px-3 py-2 text-left text-white transition-colors ${
                      selectedPokemon?.id === p.id
                        ? "bg-blue-600"
                        : "bg-slate-700/50 hover:bg-slate-700"
                    } ${isFetchingFull ? "cursor-wait opacity-50" : ""}`}
                    onClick={() => handleSelectPokemon(p)}
                  >
                    <span className="font-mono text-[10px] opacity-50">
                      {p.id}
                    </span>
                    <div className="font-bold">{p.name}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-xl bg-slate-800 p-6 text-white shadow-xl">
            <h2 className="mb-6 border-b border-slate-700 pb-2 text-xl font-bold">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                  ID (Doc ID)
                </label>
                <input
                  name="id"
                  className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={formData.id || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                  Dex ID
                </label>
                <input
                  name="dexId"
                  className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={formData.dexId || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                  Name
                </label>
                <input
                  name="name"
                  className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                  Category
                </label>
                <input
                  name="category"
                  className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={formData.category || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                  Types (comma separated)
                </label>
                <input
                  className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={formData.types.join(", ")}
                  onChange={(e) => handleArrayChange("types", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                  Tier
                </label>
                <input
                  name="tier"
                  className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={formData.tier || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                Description
              </label>
              <textarea
                name="description"
                rows={2}
                className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                value={formData.description || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="rounded-xl bg-slate-800 p-6 text-white shadow-xl">
            <h2 className="mb-6 border-b border-slate-700 pb-2 text-xl font-bold">
              Training & Physical
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                  Height
                </label>
                <input
                  name="height"
                  className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={formData.height || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                  Weight
                </label>
                <input
                  name="weight"
                  className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={formData.weight || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                  Catch Rate
                </label>
                <input
                  name="catchRate"
                  className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={formData.catchRate || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                  Base Exp
                </label>
                <input
                  name="baseExp"
                  className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={formData.baseExp || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                  Growth Rate
                </label>
                <input
                  name="growthRate"
                  className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={formData.growthRate || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                  EV Yield
                </label>
                <input
                  name="evYield"
                  className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={formData.evYield || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-800 p-6 text-white shadow-xl">
            <h2 className="mb-6 border-b border-slate-700 pb-2 text-xl font-bold">
              Abilities & Breeding
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                    Main Abilities (comma separated)
                  </label>
                  <input
                    className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    value={formData.abilities?.main?.join(", ") || ""}
                    onChange={(e) =>
                      handleNestedArrayChange(
                        "abilities",
                        "main",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                    Hidden Ability
                  </label>
                  <input
                    className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    value={formData.abilities?.hidden || ""}
                    onChange={(e) =>
                      handleNestedChange("abilities", "hidden", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                    Egg Groups (comma separated)
                  </label>
                  <input
                    className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    value={
                      Array.isArray(formData.eggGroups)
                        ? formData.eggGroups.join(", ")
                        : formData.eggGroups || ""
                    }
                    onChange={(e) =>
                      handleArrayChange("eggGroups", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                      Gender Ratio M (%)
                    </label>
                    <input
                      type="number"
                      className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      value={formData.genderRatio?.m ?? 0}
                      onChange={(e) =>
                        handleNestedChange(
                          "genderRatio",
                          "m",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                      Gender Ratio F (%)
                    </label>
                    <input
                      type="number"
                      className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      value={formData.genderRatio?.f ?? 0}
                      onChange={(e) =>
                        handleNestedChange(
                          "genderRatio",
                          "f",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-800 p-6 text-white shadow-xl">
            <h2 className="mb-6 border-b border-slate-700 pb-2 text-xl font-bold">
              Base Stats
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
              {(
                ["hp", "atk", "def", "spa", "spd", "spe"] as (keyof BaseStats)[]
              ).map((stat) => (
                <div key={stat}>
                  <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                    {stat}
                  </label>
                  <input
                    type="number"
                    className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    value={formData.baseStats[stat]}
                    onChange={(e) =>
                      handleNestedChange(
                        "baseStats",
                        stat,
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-slate-800 p-6 text-white shadow-xl">
            <h2 className="mb-6 border-b border-slate-700 pb-2 text-xl font-bold">
              Other
            </h2>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                Held Items (comma separated)
              </label>
              <input
                className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                value={
                  Array.isArray(formData.heldItems)
                    ? formData.heldItems.join(", ")
                    : typeof formData.heldItems === "string"
                      ? formData.heldItems
                      : ""
                }
                onChange={(e) => handleArrayChange("heldItems", e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-xl bg-slate-800 p-6 text-white shadow-xl">
            <h2 className="mb-4 text-xl font-bold">Moves</h2>
            <div className="flex flex-col gap-2">
              <datalist id="master-moves-list">
                {masterMoves.map((m) => (
                  <option key={m.id} value={m.name} />
                ))}
              </datalist>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={(formData.moves as EditorMove[]).map((m) => m.tempId)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-2">
                    {(formData.moves as EditorMove[]).map((move, idx) => (
                      <SortableMoveItem
                        key={move.tempId}
                        move={move}
                        idx={idx}
                        handleMoveNameChange={handleMoveNameChange}
                        removeMove={removeMove}
                        setFormData={setFormData}
                        masterMoves={masterMoves}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
            <button
              onClick={addMove}
              className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-400 uppercase hover:text-blue-300"
            >
              <Plus size={14} /> Add Move
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 text-white md:grid-cols-2">
            <div className="rounded-xl bg-slate-800 p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold">Evolutions</h2>
              <div className="space-y-2">
                {formData.evolutions?.map((evo, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      className="flex-1 rounded bg-slate-700 p-2 text-sm text-white"
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
                      className="w-24 rounded bg-slate-700 p-2 text-sm text-white"
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
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addEvolution("New Evo")}
                  className="mt-2 flex items-center gap-1 text-xs font-bold text-blue-400 uppercase hover:text-blue-300"
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
                    className="relative rounded border border-white/5 bg-slate-700/50 p-3"
                  >
                    <button
                      onClick={() => removeLocation(idx)}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          placeholder="Region"
                          className="rounded bg-slate-700 p-1 text-xs text-white"
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
                          placeholder="Location (Area)"
                          className="rounded bg-slate-700 p-1 text-xs text-white"
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
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          placeholder="Method"
                          className="rounded bg-slate-700 p-1 text-xs text-white"
                          value={loc.method || ""}
                          onChange={(e) => {
                            const newLocs = [...formData.locations];
                            newLocs[idx].method = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              locations: newLocs,
                            }));
                          }}
                        />
                        <input
                          placeholder="Rarity"
                          className="rounded bg-slate-700 p-1 text-xs text-white"
                          value={loc.rarity || ""}
                          onChange={(e) => {
                            const newLocs = [...formData.locations];
                            newLocs[idx].rarity = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              locations: newLocs,
                            }));
                          }}
                        />
                        <input
                          placeholder="Levels"
                          className="rounded bg-slate-700 p-1 text-xs text-white"
                          value={loc.levels || ""}
                          onChange={(e) => {
                            const newLocs = [...formData.locations];
                            newLocs[idx].levels = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              locations: newLocs,
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addLocation}
                  className="mt-2 flex items-center gap-1 text-xs font-bold text-blue-400 uppercase hover:text-blue-300"
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
