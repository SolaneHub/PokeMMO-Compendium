import { ArrowLeft, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import eliteFourData from "@/data/eliteFourData.json";
import AddEnemyPokemonModal from "@/pages/my-teams/components/AddEnemyPokemonModal";
import EditorSidebar from "@/pages/my-teams/components/editor/EditorSidebar";
import StrategyEditor from "@/pages/my-teams/components/editor/StrategyEditor";
import PokemonEditorView from "@/pages/my-teams/components/editor/views/PokemonEditorView";
import { useTeamEditor } from "@/pages/my-teams/hooks/useTeamEditor";
import { useToast } from "@/shared/components/ToastNotification";

const REGIONS = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova"];

const UserTeamEditorPage = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const { team, setTeam, loading, saving, saveTeam } = useTeamEditor();

  // --- UI Navigation State ---
  // view: "settings" | "roster" | "strategy"
  const [activeView, setActiveView] = useState("settings");
  // id: index (for roster) or enemyName (for strategy)
  const [activeId, setActiveId] = useState(null);
  // context: memberName (only for strategy view to know which team member owns the strat)
  const [activeContext, setActiveContext] = useState(null);

  // Modal State
  const [showAddEnemyModal, setShowAddEnemyModal] = useState(false);
  const [targetMemberForAdd, setTargetMemberForAdd] = useState(null);

  // --- Derived Data ---
  const availableMembers = useMemo(() => {
    // Flatten all E4 members from all regions
    return eliteFourData;
  }, []);

  // --- Handlers ---

  const handleNavigate = (view, id = null, context = null) => {
    setActiveView(view);
    setActiveId(id);
    setActiveContext(context);
  };

  // Roster Editing
  const handleUpdateMember = (newMemberData) => {
    const idx = activeId;
    if (idx === null || idx < 0 || idx >= team.members.length) return;

    const newMembers = [...team.members];
    newMembers[idx] = newMemberData;
    setTeam({ ...team, members: newMembers });
    showToast("Roster updated locally", "success");
  };

  // Enemy Pool Management
  const openAddEnemyModal = (member) => {
    setTargetMemberForAdd(member);
    setShowAddEnemyModal(true);
  };

  const handleRemoveEnemyPokemon = (memberName, pokemonName) => {
    const newPools = { ...team.enemyPools };
    if (newPools[memberName]) {
      newPools[memberName] = newPools[memberName].filter(
        (p) => p !== pokemonName
      );
      setTeam({ ...team, enemyPools: newPools });

      // If we were viewing this deleted enemy, go back to settings
      if (
        activeView === "strategy" &&
        activeId === pokemonName &&
        activeContext === memberName
      ) {
        handleNavigate("settings");
      }
    }
  };

  const handleAddEnemyPokemon = (pokemonName) => {
    if (!targetMemberForAdd) return;
    const memberName = targetMemberForAdd.name;
    const newPools = { ...team.enemyPools };
    const currentList = newPools[memberName] || [];

    if (currentList.includes(pokemonName)) {
      showToast("Pokemon already in list", "info");
      return;
    }

    newPools[memberName] = [...currentList, pokemonName];
    setTeam({ ...team, enemyPools: newPools });

    // Auto-navigate to the new strategy
    handleNavigate("strategy", pokemonName, memberName);
  };

  // Strategy Management
  const getCurrentStrategies = () => {
    if (activeView !== "strategy" || !activeContext || !activeId) return null;
    if (!team) return null; // Aggiunto il controllo per team
    return team.strategies?.[activeContext]?.[activeId] || null;
  };

  const updateStrategies = (newSteps) => {
    if (activeView !== "strategy" || !activeContext || !activeId) return;
    if (!team) return; // Add check for team

    const memberName = activeContext; // e.g. "Lorelei"
    const enemyName = activeId; // e.g. "Dewgong"

    // Ensure team.strategies is an object before spreading
    const newStrategies = { ...(team.strategies || {}) };
    if (!newStrategies[memberName]) newStrategies[memberName] = {};
    newStrategies[memberName][enemyName] = newSteps;

    setTeam({ ...team, strategies: newStrategies });
  };

  // Team Settings (Name)
  const handleNameChange = (newName) => {
    setTeam({ ...team, name: newName });
  };

  if (loading)
    return (
      <div className="animate-fade-in flex h-screen items-center justify-center text-slate-400">
        Loading Team Editor...
      </div>
    );
  if (!team) return null;

  // --- Render Content Based on View ---
  let mainContent;

  if (activeView === "settings") {
    // --- DASHBOARD VIEW ---
    mainContent = (
      <div className="animate-fade-in custom-scrollbar flex h-full flex-col overflow-y-auto bg-gradient-to-br from-[#0a0b0e] to-[#121317] p-4 lg:p-8">
        <div className="mx-auto w-full max-w-6xl space-y-10">
          {/* Header Section */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-blue-500 uppercase">
                Team Name
              </label>
              <input
                type="text"
                className="w-full min-w-[300px] border-b-2 border-white/10 bg-transparent px-0 py-2 text-4xl font-black text-white transition-colors placeholder:text-white/20 focus:border-blue-500 focus:outline-none"
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
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <span className="h-6 w-1 rounded-full bg-blue-500" />
              Active Roster
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {team.members.map((member, idx) => {
                const isEmpty = !member?.name;

                return (
                  <div
                    key={idx}
                    onClick={() => handleNavigate("roster", idx)}
                    className={`group relative cursor-pointer overflow-hidden rounded-xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      isEmpty
                        ? "border-dashed border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                        : "border-white/10 bg-[#1a1b20] hover:border-blue-500/50 hover:shadow-blue-500/10"
                    }`}
                  >
                    {/* Background decoration */}
                    {!isEmpty && (
                      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent blur-2xl transition-all group-hover:from-blue-500/20" />
                    )}

                    <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xs font-bold tracking-wider text-slate-500 uppercase transition-colors group-hover:text-blue-400">
                            Slot 0{idx + 1}
                          </div>
                          <div
                            className={`mt-1 text-xl font-bold ${isEmpty ? "text-slate-600 italic" : "text-white"}`}
                          >
                            {isEmpty ? "Empty Slot" : member.name}
                          </div>
                        </div>
                        {/* Placeholder Icon */}
                        {isEmpty ? (
                          <div className="rounded-full bg-white/5 p-2 text-slate-600 group-hover:text-slate-400">
                            <Save size={20} className="rotate-45" />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-gradient-to-br from-slate-800 to-slate-900 text-lg shadow-inner">
                            {/* Simple initial if no sprite */}
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {!isEmpty && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between rounded bg-black/20 px-3 py-2 text-xs">
                            <span className="text-slate-400">Item</span>
                            <span
                              className={
                                member.item
                                  ? "text-blue-200"
                                  : "text-slate-600 italic"
                              }
                            >
                              {member.item || "None"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between rounded bg-black/20 px-3 py-2 text-xs">
                            <span className="text-slate-400">Nature</span>
                            <span
                              className={
                                member.nature
                                  ? "text-yellow-200"
                                  : "text-slate-600 italic"
                              }
                            >
                              {member.nature || "Neutral"}
                            </span>
                          </div>
                        </div>
                      )}

                      {isEmpty && (
                        <div className="mt-auto flex items-center justify-center pt-4 text-xs font-medium text-slate-500 group-hover:text-blue-400">
                          + Click to Configure
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strategy Coverage Overview */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <span className="h-6 w-1 rounded-full bg-purple-500" />
              Strategy Coverage
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {REGIONS.map((region) => {
                // Calculate coverage for this region
                // This is a rough estimation based on data structure
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

                const percent = Math.round(
                  (coveredMembers / totalMembers) * 100
                );

                return (
                  <div
                    key={region}
                    className="relative overflow-hidden rounded-xl border border-white/5 bg-[#1a1b20] p-4"
                  >
                    <div className="relative z-10">
                      <div className="text-xs font-bold text-slate-500 uppercase">
                        {region}
                      </div>
                      <div className="mt-1 text-2xl font-black text-white">
                        {percent}%
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                    {/* Decorative background number */}
                    <div className="absolute -right-2 -bottom-4 text-6xl font-black text-white/5 select-none">
                      {region.charAt(0)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (activeView === "roster") {
    const memberData = team.members[activeId];
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
    // activeId = enemyName, activeContext = memberName (e.g. Lorelei)
    // We need the member object for the prop
    const memberObj = availableMembers.find((m) => m.name === activeContext);

    mainContent = (
      <div className="animate-fade-in custom-scrollbar h-full overflow-y-auto p-4 lg:p-8">
        <StrategyEditor
          key={activeId}
          selectedEnemyPokemon={activeId}
          selectedMember={memberObj}
          selectedRegion={memberObj?.region}
          steps={getCurrentStrategies()}
          onUpdateSteps={updateStrategies}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex h-[calc(100vh-64px)] overflow-hidden bg-[#0a0b0e]">
      {/* 1. Sidebar */}
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
      />

      {/* 2. Main Content Area */}
      <div className="relative flex flex-1 flex-col overflow-hidden bg-[#0a0b0e]">
        {/* Top Bar for Context/Actions */}
        <div className="flex h-14 items-center justify-between border-b border-white/5 bg-[#121317] px-6">
          <button
            onClick={() => navigate("/my-teams")}
            className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to My Teams
          </button>

          <div className="flex items-center gap-3">
            {saving && (
              <span className="animate-pulse text-xs text-slate-500">
                Saving...
              </span>
            )}
            <button
              onClick={() => saveTeam(team)}
              className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <Save size={14} />
              Save
            </button>
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
