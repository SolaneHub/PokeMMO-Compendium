import { useMemo, useState } from "react";

import eliteFourData from "@/data/eliteFourData.json";
import AddEnemyPokemonModal from "@/pages/my-teams/components/AddEnemyPokemonModal";
import EnemyPool from "@/pages/my-teams/components/editor/EnemyPool";
import MyRoster from "@/pages/my-teams/components/editor/MyRoster";
import OpponentSelector from "@/pages/my-teams/components/editor/OpponentSelector";
import StrategyEditor from "@/pages/my-teams/components/editor/StrategyEditor";
import TeamHeader from "@/pages/my-teams/components/editor/TeamHeader";
import PokemonEditorModal from "@/pages/my-teams/components/PokemonEditorModal";
import { useTeamEditor } from "@/pages/my-teams/hooks/useTeamEditor";
import PageTitle from "@/shared/components/PageTitle";
import { useToast } from "@/shared/components/ToastNotification";

const REGIONS = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova"];

const UserTeamEditorPage = () => {
  const showToast = useToast();
  const { team, setTeam, loading, saving, saveTeam } = useTeamEditor();

  // --- UI Selection State ---
  const [selectedRegion, setSelectedRegion] = useState("Kanto");
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(null);
  const [selectedEnemyPokemon, setSelectedEnemyPokemon] = useState(null);

  // Modal State
  const [showPokemonEditor, setShowPokemonEditor] = useState(false);
  const [showAddEnemyModal, setShowAddEnemyModal] = useState(false);
  const [editingSlotIndex, setEditingSlotIndex] = useState(null);

  // --- Derived Data ---
  const availableMembers = useMemo(() => {
    return eliteFourData.filter(
      (m) => m.region === selectedRegion || !m.region
    );
  }, [selectedRegion]);

  const selectedMember =
    selectedMemberIndex !== null ? availableMembers[selectedMemberIndex] : null;

  const currentEnemyPool = useMemo(() => {
    if (!selectedMember || !team?.enemyPools) return [];
    return team.enemyPools[selectedMember?.name] || [];
  }, [selectedMember, team]);

  // --- Handlers ---

  const handleUpdateMember = (newMemberData) => {
    const newMembers = [...team.members];
    newMembers[editingSlotIndex] = newMemberData;
    setTeam({ ...team, members: newMembers });
    setShowPokemonEditor(false);
  };

  const handleAddEnemyPokemon = (pokemonName) => {
    if (!selectedMember) return;
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
    if (!selectedMember) return;

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

  const getCurrentStrategies = () => {
    if (!selectedMember || !selectedEnemyPokemon) return null;
    if (!team || !team.strategies) return null;
    return team.strategies[selectedMember.name]?.[selectedEnemyPokemon] || null;
  };

  const updateStrategies = (newSteps) => {
    if (!selectedMember || !selectedEnemyPokemon || !team) return;

    const memberName = selectedMember.name;
    const pokeName = selectedEnemyPokemon;
    const newStrategies = { ...team?.strategies };

    if (!newStrategies[memberName]) newStrategies[memberName] = {};
    newStrategies[memberName][pokeName] = newSteps;

    setTeam({ ...team, strategies: newStrategies });
  };

  if (loading) return <div className="p-8 text-white">Loading Editor...</div>;
  if (!team) return null;

  const currentSteps = getCurrentStrategies();

  return (
    <div className="animate-fade-in container mx-auto p-4 pb-20">
      <PageTitle title={`Editing: ${team.name}`} />

      <TeamHeader
        teamName={team.name}
        onSave={() => saveTeam(team)}
        saving={saving}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* --- LEFT COLUMN: Setup & Context --- */}
        <div className="space-y-6 lg:col-span-4">
          <MyRoster
            members={team.members}
            onEditSlot={(idx) => {
              setEditingSlotIndex(idx);
              setShowPokemonEditor(true);
            }}
          />

          <div className="space-y-5 rounded-xl border border-slate-700 bg-slate-800 p-5">
            <OpponentSelector
              regions={REGIONS}
              selectedRegion={selectedRegion}
              onSelectRegion={(r) => {
                setSelectedRegion(r);
                setSelectedMemberIndex(null);
                setSelectedEnemyPokemon(null);
              }}
              availableMembers={availableMembers}
              selectedMemberIndex={selectedMemberIndex}
              onSelectMember={(idx) => {
                setSelectedMemberIndex(idx);
                setSelectedEnemyPokemon(null);
              }}
            />

            <EnemyPool
              selectedMember={selectedMember}
              enemyPool={currentEnemyPool}
              teamStrategies={team?.strategies}
              selectedEnemyPokemon={selectedEnemyPokemon}
              onSelectEnemy={setSelectedEnemyPokemon}
              onAddEnemy={() => setShowAddEnemyModal(true)}
              onRemoveEnemy={handleRemoveEnemyPokemon}
            />
          </div>
        </div>

        {/* --- RIGHT COLUMN: Strategy Editor --- */}
        <div className="lg:col-span-8">
          <StrategyEditor
            selectedEnemyPokemon={selectedEnemyPokemon}
            selectedMember={selectedMember}
            selectedRegion={selectedRegion}
            steps={currentSteps}
            onUpdateSteps={updateStrategies}
          />
        </div>
      </div>

      {/* Modals */}
      {showPokemonEditor && (
        <PokemonEditorModal
          key={editingSlotIndex}
          isOpen={showPokemonEditor}
          onClose={() => setShowPokemonEditor(false)}
          initialData={team.members[editingSlotIndex]}
          onSave={handleUpdateMember}
        />
      )}

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
