import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  ArrowLeft,
  Edit,
  Map,
  Plus,
  Save,
  Shield,
  Sword,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import eliteFourData from "@/data/eliteFourData.json";
import { getUserTeams, updateUserTeam } from "@/firebase/firestoreService";
import { SortableStepItem } from "@/pages/editor/components/SortableStepItem";
import AddEnemyPokemonModal from "@/pages/my-teams/components/AddEnemyPokemonModal";
import PokemonEditorModal from "@/pages/my-teams/components/PokemonEditorModal";
import PageTitle from "@/shared/components/PageTitle";
import { useToast } from "@/shared/components/ToastNotification";
import { useAuth } from "@/shared/context/AuthContext";

const REGIONS = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova"];

const createNewStepTemplate = () => ({
  type: "main",
  player: "",
  warning: "",
  variations: [],
  id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
});

const UserTeamEditorPage = () => {
  const { id: teamId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- UI Selection State ---

  // 0. Selected Region Context
  const [selectedRegion, setSelectedRegion] = useState("Kanto");

  // 1. Selected Opponent Member (e.g., Lorelei)
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(null);

  // 2. Selected Specific Enemy Pokemon (e.g., "Lapras")
  const [selectedEnemyPokemon, setSelectedEnemyPokemon] = useState(null);

  // Modal State
  const [showPokemonEditor, setShowPokemonEditor] = useState(false);
  const [showAddEnemyModal, setShowAddEnemyModal] = useState(false);
  const [editingSlotIndex, setEditingSlotIndex] = useState(null);

  // --- Load Team Data ---
  useEffect(() => {
    async function load() {
      if (!currentUser) return;
      try {
        const teams = await getUserTeams(currentUser.uid);
        const found = teams.find((t) => t.id === teamId);
        if (found) {
          setTeam(found);
          // Initialize data structures if missing
          if (!found.strategies) found.strategies = {};
          if (!found.enemyPools) found.enemyPools = {};
        } else {
          showToast("Team not found", "error");
          navigate("/my-teams");
        }
      } catch (err) {
        console.error(err);
        showToast("Error loading team", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser, teamId, navigate, showToast]);

  // --- Derived Data ---

  // Filter Members by Selected Region
  const availableMembers = useMemo(() => {
    return eliteFourData.filter(
      (m) => m.region === selectedRegion || !m.region
    );
  }, [selectedRegion]);

  const selectedMember =
    selectedMemberIndex !== null ? availableMembers[selectedMemberIndex] : null;

  // Available Pokemon in Enemy Pool for Selected Member
  const currentEnemyPool = useMemo(() => {
    if (!selectedMember || !team?.enemyPools) return [];
    return team.enemyPools[selectedMember.name] || [];
  }, [selectedMember, team]);

  // --- Handlers ---

  const handleSaveTeam = async () => {
    if (!team) return;
    setSaving(true);
    try {
      await updateUserTeam(currentUser.uid, teamId, {
        name: team.name,
        members: team.members,
        strategies: team.strategies,
        enemyPools: team.enemyPools,
      });
      showToast("Team saved successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to save team", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateMember = (newMemberData) => {
    const newMembers = [...team.members];
    newMembers[editingSlotIndex] = newMemberData;
    setTeam({ ...team, members: newMembers });
    setShowPokemonEditor(false);
  };

  // --- Enemy Pool Management ---

  const handleAddEnemyPokemon = (pokemonName) => {
    const memberName = selectedMember.name;

    const newPools = { ...team.enemyPools };
    const currentList = newPools[memberName] || [];

    if (currentList.includes(pokemonName)) {
      showToast("Pokemon already in list", "info");
      return;
    }

    newPools[memberName] = [...currentList, pokemonName];
    setTeam({ ...team, enemyPools: newPools });
  };

  const handleRemoveEnemyPokemon = (pokemonName, e) => {
    e.stopPropagation();
    if (!window.confirm(`Remove ${pokemonName}?`)) return;

    const memberName = selectedMember.name;

    const newPools = { ...team.enemyPools };
    if (newPools[memberName]) {
      newPools[memberName] = newPools[memberName].filter(
        (p) => p !== pokemonName
      );
    }

    setTeam({ ...team, enemyPools: newPools });
    if (selectedEnemyPokemon === pokemonName) setSelectedEnemyPokemon(null);
  };

  // --- Strategy Logic ---
  // Key Structure: strategies[memberName][enemyPokemonName] = [Steps]

  const getCurrentStrategies = () => {
    if (!selectedMember || !selectedEnemyPokemon) return null;

    return (
      team.strategies?.[selectedMember.name]?.[selectedEnemyPokemon] || null
    );
  };

  const updateStrategies = (newSteps) => {
    if (!selectedMember || !selectedEnemyPokemon) return;

    const memberName = selectedMember.name;
    const pokeName = selectedEnemyPokemon;

    const newStrategies = { ...team.strategies };

    if (!newStrategies[memberName]) newStrategies[memberName] = {};

    newStrategies[memberName][pokeName] = newSteps;

    setTeam({ ...team, strategies: newStrategies });
  };

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const currentSteps = getCurrentStrategies();

    if (active.id !== over.id && currentSteps) {
      const oldIndex = currentSteps.findIndex((step) => step.id === active.id);
      const newIndex = currentSteps.findIndex((step) => step.id === over.id);
      const newSteps = arrayMove(currentSteps, oldIndex, newIndex);
      updateStrategies(newSteps);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading Editor...</div>;
  if (!team) return null;

  const currentSteps = getCurrentStrategies();

  return (
    <div className="animate-fade-in container mx-auto p-4 pb-20">
      <PageTitle title={`Editing: ${team.name}`} />

      {/* --- Top Bar --- */}
      <div className="sticky top-4 z-40 mb-6 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/my-teams")}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-700 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{team.name}</h1>
            <span className="rounded border border-pink-500/30 bg-pink-900/30 px-2 py-0.5 font-mono text-xs text-pink-400">
              Universal Team
            </span>
          </div>
        </div>
        <button
          onClick={handleSaveTeam}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 font-bold text-white shadow-lg transition-all hover:bg-green-700 active:scale-95 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Team"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* --- LEFT COLUMN: Setup & Context --- */}
        <div className="space-y-6 lg:col-span-4">
          {/* 1. My Team Roster */}
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-400 uppercase">
              <Users size={16} />
              My Roster
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {team.members.map((member, idx) => (
                <div
                  key={idx}
                  className="group relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-slate-700 bg-slate-900/50 transition-colors hover:border-pink-500"
                  onClick={() => {
                    setEditingSlotIndex(idx);
                    setShowPokemonEditor(true);
                  }}
                >
                  {member ? (
                    <img
                      src={
                        member.sprite ||
                        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.dexId || 0}.png`
                      }
                      onError={(e) => {
                        e.target.src =
                          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";
                      }}
                      alt={member.name}
                      className="h-10 w-10 object-contain"
                      title={`${member.name} (${member.item || "No Item"})`}
                    />
                  ) : (
                    <Plus
                      size={20}
                      className="text-slate-600 group-hover:text-pink-400"
                    />
                  )}
                  {member && (
                    <div className="absolute -top-1 -right-1 rounded-full border border-slate-600 bg-slate-800 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Edit size={10} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. Opponent Selection */}
          <div className="space-y-5 rounded-xl border border-slate-700 bg-slate-800 p-5">
            {/* Region Selector */}
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-400 uppercase">
                <Map size={16} />
                Region
              </h3>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setSelectedRegion(r);
                      setSelectedMemberIndex(null); // Reset member
                      setSelectedEnemyPokemon(null);
                    }}
                    className={`rounded border px-3 py-1.5 text-sm font-medium transition-colors ${
                      selectedRegion === r
                        ? "border-purple-500 bg-purple-600 text-white"
                        : "border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Member Selector */}
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-400 uppercase">
                <Shield size={16} />
                Select Opponent
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableMembers.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedMemberIndex(idx);
                      setSelectedEnemyPokemon(null);
                    }}
                    className={`rounded border px-3 py-1.5 text-sm font-medium transition-colors ${
                      selectedMemberIndex === idx
                        ? "border-pink-500 bg-pink-600 text-white"
                        : "border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Enemy Pokemon List (Directly associated with Member) */}
            {selectedMember && (
              <div className="animate-fade-in">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase">
                    <Sword size={16} />
                    Enemy Pool
                  </h3>
                  <button
                    onClick={() => setShowAddEnemyModal(true)}
                    className="flex items-center gap-1 rounded bg-slate-700 px-2 py-1 text-xs text-white transition-colors hover:bg-slate-600"
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>

                <div className="custom-scrollbar grid max-h-[300px] grid-cols-1 gap-2 overflow-y-auto pr-1">
                  {currentEnemyPool.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500 italic">
                      Use the &apos;Add&apos; button to define the Pokémon{" "}
                      {selectedMember.name} uses against this team.
                    </div>
                  ) : (
                    currentEnemyPool.map((pName) => {
                      const hasStrategy =
                        team.strategies?.[selectedMember.name]?.[pName]
                          ?.length > 0;

                      return (
                        <div key={pName} className="group/item flex gap-1">
                          <button
                            onClick={() => setSelectedEnemyPokemon(pName)}
                            className={`flex flex-1 items-center gap-3 rounded-lg border p-2 text-left transition-all ${
                              selectedEnemyPokemon === pName
                                ? "border-pink-500 bg-pink-900/30"
                                : "border-slate-700 bg-slate-900/30 hover:bg-slate-800"
                            }`}
                          >
                            <div className="h-8 w-8 flex-shrink-0">
                              <img
                                src={`https://img.pokemondb.net/sprites/black-white/anim/normal/${pName.toLowerCase()}.gif`}
                                onError={(e) =>
                                  (e.target.style.display = "none")
                                }
                                alt={pName}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div
                                className={`truncate font-medium ${selectedEnemyPokemon === pName ? "text-pink-300" : "text-slate-200"}`}
                              >
                                {pName}
                              </div>
                              <div className="text-xs text-slate-500">
                                {hasStrategy
                                  ? "Strategy Active"
                                  : "No Strategy"}
                              </div>
                            </div>
                            {hasStrategy && (
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            )}
                          </button>
                          <button
                            onClick={(e) => handleRemoveEnemyPokemon(pName, e)}
                            className="hidden items-center justify-center rounded-lg border border-slate-700 bg-slate-800 px-2 text-slate-500 transition-all group-hover/item:flex hover:border-red-500 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN: Strategy Editor --- */}
        <div className="lg:col-span-8">
          <div className="flex min-h-[600px] flex-col rounded-xl border border-slate-700 bg-slate-800 p-6">
            {!selectedEnemyPokemon ? (
              <div className="flex flex-1 flex-col items-center justify-center text-slate-500 opacity-60">
                <Sword size={64} className="mb-4" />
                <p className="text-xl font-medium">
                  Select an Enemy Pokémon to plan a strategy.
                </p>
              </div>
            ) : (
              // Strategy Editor Area
              <div className="animate-fade-in flex flex-1 flex-col">
                <div className="mb-6 flex items-center justify-between border-b border-slate-600 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Strategy vs {selectedEnemyPokemon}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      {selectedRegion} • {selectedMember.name}
                    </p>
                  </div>
                  <button
                    className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white shadow-lg transition-colors hover:bg-green-700 active:scale-95"
                    onClick={() =>
                      updateStrategies([
                        ...(currentSteps || []),
                        createNewStepTemplate(),
                      ])
                    }
                  >
                    + Add Step
                  </button>
                </div>

                {/* Steps List */}
                {currentSteps && currentSteps.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={currentSteps.map((s) => s.id)}>
                      <div className="space-y-4">
                        {currentSteps.map((step, i) => (
                          <SortableStepItem
                            key={step.id}
                            id={step.id}
                            index={i}
                            step={step}
                            onChange={(updatedStep) => {
                              const newSteps = [...currentSteps];
                              newSteps[i] = updatedStep;
                              updateStrategies(newSteps);
                            }}
                            onRemove={() =>
                              updateStrategies(
                                currentSteps.filter((_, idx) => idx !== i)
                              )
                            }
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/30 p-10">
                    <p className="mb-4 max-w-md text-center text-slate-500">
                      How do you handle {selectedEnemyPokemon}? <br />
                      Click below to define your strategy step-by-step.
                    </p>
                    <button
                      className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 font-medium text-pink-400 transition-colors hover:border-pink-500 hover:underline"
                      onClick={() =>
                        updateStrategies([createNewStepTemplate()])
                      }
                    >
                      Create first step
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pokemon Editor Modal (My Roster) */}
      {showPokemonEditor && (
        <PokemonEditorModal
          key={editingSlotIndex}
          isOpen={showPokemonEditor}
          onClose={() => setShowPokemonEditor(false)}
          initialData={team.members[editingSlotIndex]}
          onSave={handleUpdateMember}
        />
      )}

      {/* Add Enemy Pokemon Modal (Search) */}
      {showAddEnemyModal && (
        <AddEnemyPokemonModal
          isOpen={showAddEnemyModal}
          onClose={() => setShowAddEnemyModal(false)}
          onAdd={handleAddEnemyPokemon}
        />
      )}
    </div>
  );
};

export default UserTeamEditorPage;
