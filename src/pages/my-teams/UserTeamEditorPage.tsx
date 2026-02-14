import { ArrowLeft, Menu, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/components/atoms/Button";
import CoverageCard from "@/components/molecules/CoverageCard";
import RosterSlotCard from "@/components/molecules/RosterSlotCard";
import AddEnemyPokemonModal from "@/components/organisms/AddEnemyPokemonModal";
import EditorSidebar from "@/components/organisms/Editor/EditorSidebar";
import StrategyEditor from "@/components/organisms/Editor/StrategyEditor";
import PokemonEditorView from "@/components/organisms/Editor/views/PokemonEditorView";
import { useToast } from "@/context/ToastContext";
import { StrategyStep, TeamMember } from "@/firebase/firestoreService";
import { useTeamEditor } from "@/hooks/useTeamEditor";
import { EliteFourMember, eliteFourMembers } from "@/utils/eliteFourMembers";

const REGIONS = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova"];

const UserTeamEditorPage = () => {
  const navigate = useNavigate();
  const { userId: paramUserId } = useParams<{ userId?: string; id?: string }>();
  const showToast = useToast();
  const { team, setTeam, loading, saving, saveTeam } = useTeamEditor();
  const [activeView, setActiveView] = useState("settings");
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [activeContext, setActiveContext] = useState<string | null>(null);
  const [showAddEnemyModal, setShowAddEnemyModal] = useState(false);
  const [targetMemberForAdd, setTargetMemberForAdd] =
    useState<EliteFourMember | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const availableMembers = useMemo(() => {
    return eliteFourMembers;
  }, []);

  const handleNavigate = (
    view: string,
    id: string | number | null = null,
    context: string | null = null
  ) => {
    setActiveView(view);
    setActiveId(id);
    setActiveContext(context);
    setIsSidebarOpen(false);
  };

  const handleUpdateMember = (newMemberData: TeamMember) => {
    if (activeId === null || typeof activeId !== "number" || !team) return;
    const newMembers = [...team.members];
    newMembers[activeId] = newMemberData;
    setTeam({ ...team, members: newMembers });
    showToast("Roster updated locally", "success");
  };

  const openAddEnemyModal = (member: EliteFourMember) => {
    setTargetMemberForAdd(member);
    setShowAddEnemyModal(true);
  };

  const handleRemoveEnemyPokemon = (
    memberName: string,
    pokemonName: string
  ) => {
    if (!team) return;
    const newPools = { ...team.enemyPools };
    if (newPools[memberName]) {
      newPools[memberName] = newPools[memberName].filter(
        (p) => p !== pokemonName
      );
      setTeam({ ...team, enemyPools: newPools });
      if (
        activeView === "strategy" &&
        activeId === pokemonName &&
        activeContext === memberName
      ) {
        handleNavigate("settings");
      }
    }
  };

  const handleAddEnemyPokemon = (pokemonName: string) => {
    if (!targetMemberForAdd || !team) return;
    const memberName = targetMemberForAdd.name;
    const newPools = { ...(team.enemyPools || {}) };
    const currentList = newPools[memberName] || [];
    if (currentList.includes(pokemonName)) {
      showToast("Pokemon already in list", "info");
      return;
    }
    newPools[memberName] = [...currentList, pokemonName];
    setTeam({ ...team, enemyPools: newPools });
    handleNavigate("strategy", pokemonName, memberName);
  };

  const getCurrentStrategies = (): StrategyStep[] => {
    if (
      activeView !== "strategy" ||
      !activeContext ||
      !activeId ||
      typeof activeId !== "string"
    )
      return [];
    if (!team) return [];
    return team.strategies?.[activeContext]?.[activeId] || [];
  };

  const updateStrategies = (newSteps: StrategyStep[]) => {
    if (
      activeView !== "strategy" ||
      !activeContext ||
      !activeId ||
      typeof activeId !== "string"
    )
      return;
    if (!team) return;
    const memberName = activeContext;
    const enemyName = activeId;
    const newStrategies = { ...(team.strategies || {}) };
    if (!newStrategies[memberName]) newStrategies[memberName] = {};
    newStrategies[memberName][enemyName] = newSteps;
    setTeam({ ...team, strategies: newStrategies });
  };

  const handleNameChange = (newName: string) => {
    if (!team) return;
    setTeam({ ...team, name: newName });
  };

  if (loading)
    return (
      <div className="animate-fade-in flex h-screen items-center justify-center text-white">
        Loading Team Editor...
      </div>
    );

  if (!team) return null;

  let mainContent;
  if (activeView === "settings") {
    mainContent = (
      <div className="animate-fade-in custom-scrollbar flex h-full flex-col overflow-y-auto bg-gradient-to-br from-[#1a1b20] to-[#25262b] p-4 text-white lg:p-8">
        <div className="mx-auto w-full max-w-6xl space-y-10">
          {/* Header Section */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-blue-400 uppercase">
                Team Name
              </label>
              <input
                type="text"
                className="w-full min-w-[300px] border-b-2 border-white/5 bg-transparent px-0 py-2 text-4xl font-black text-white transition-colors focus:border-blue-400 focus:outline-none"
                value={team.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Untitled Team"
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span>Editor Active</span>
              </div>
              <span>•</span>
              <span>
                {(team.members || []).filter((m) => m && m.name).length}/6
                Members
              </span>
            </div>
          </div>

          {/* Roster Grid */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <span className="h-6 w-1 rounded-full bg-blue-600" /> Active
              Roster
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {team.members.map((member, idx) => (
                <RosterSlotCard
                  key={idx}
                  idx={idx}
                  member={member}
                  onClick={() => handleNavigate("roster", idx)}
                />
              ))}
            </div>
          </div>

          {/* Strategy Coverage Overview */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <span className="h-6 w-1 rounded-full bg-purple-600" /> Strategy
              Coverage
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {REGIONS.map((region) => {
                const totalMembers = availableMembers.filter(
                  (m) => m.region === region
                ).length;
                const coveredMembers = availableMembers.filter(
                  (m) =>
                    m.region === region &&
                    team.strategies &&
                    team.strategies[m.name] &&
                    Object.keys(team.strategies[m.name]).length > 0
                ).length;
                const percent =
                  totalMembers > 0
                    ? Math.round((coveredMembers / totalMembers) * 100)
                    : 0;
                return (
                  <CoverageCard
                    key={region}
                    region={region}
                    percent={percent}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (activeView === "roster") {
    const memberData =
      typeof activeId === "number" ? team.members[activeId] : null;
    mainContent = (
      <div className="animate-fade-in custom-scrollbar h-full overflow-y-auto p-4 lg:p-8">
        <PokemonEditorView
          key={activeId}
          data={memberData}
          onSave={handleUpdateMember}
        />
      </div>
    );
  } else if (activeView === "strategy") {
    mainContent = (
      <div className="animate-fade-in custom-scrollbar h-full overflow-y-auto p-4 lg:p-8">
        <StrategyEditor
          key={activeId}
          selectedEnemyPokemon={activeId as string}
          steps={getCurrentStrategies()}
          onUpdateSteps={updateStrategies}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex h-full flex-1 overflow-hidden bg-[#1a1b20]">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 1. Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 lg:static lg:h-full lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <EditorSidebar
          team={team}
          activeView={activeView}
          activeId={activeId}
          onNavigate={handleNavigate}
          regions={REGIONS}
          availableMembers={availableMembers}
          enemyPools={team.enemyPools || {}}
          onAddEnemy={openAddEnemyModal}
          onRemoveEnemy={handleRemoveEnemyPokemon}
          className="h-full w-full"
        />
      </div>

      {/* 2. Main Content Area */}
      <div className="relative flex flex-1 flex-col overflow-hidden bg-[#1a1b20]">
        {/* Top Bar for Context/Actions */}
        <div className="flex h-14 items-center justify-between border-b border-white/5 bg-[#1a1b20] px-6 text-white">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden"
              icon={Menu}
            >
              {""}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                navigate(paramUserId ? "/admin/dashboard" : "/my-teams")
              }
              icon={ArrowLeft}
            >
              <span className="hidden sm:inline">
                {paramUserId ? "Back to Admin Dashboard" : "Back to My Teams"}
              </span>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            {saving && (
              <span className="animate-pulse text-xs text-slate-500">
                Saving...
              </span>
            )}
            <Button
              onClick={() => saveTeam(team)}
              variant="secondary"
              size="sm"
              icon={Save}
            >
              Save
            </Button>
          </div>
        </div>

        {/* View Content */}
        <div className="relative flex-1 overflow-hidden">{mainContent}</div>
      </div>

      {/* Modals */}
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
