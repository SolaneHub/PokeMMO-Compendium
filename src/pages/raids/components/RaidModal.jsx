import { Activity, useState } from "react";

import { getPokemonBackground } from "@/pages/pokedex/data/pokemonService";
import {
  getActiveStrategy,
  getRaidByName,
} from "@/pages/raids/data/raidsService";
import { typeBackgrounds } from "@/shared/utils/pokemonColors";

import RaidBuildsTab from "./tabs/RaidBuildsTab";
import RaidLocationsTab from "./tabs/RaidLocationsTab";
import RaidMechanicsTab from "./tabs/RaidMechanicsTab";
import RaidStrategyTab from "./tabs/RaidStrategyTab";

const RaidModal = ({ raidName, onClose, pokemonMap }) => {
  // Accept pokemonMap here
  const [activeTab, setActiveTab] = useState("Strategy");
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedTurnIndex, setSelectedTurnIndex] = useState(0);
  const [selectedStrategyIndex, setSelectedStrategyIndex] = useState(0);
  const [selectedBuildGroup, setSelectedBuildGroup] = useState(null);

  const tabs = ["Strategy", "Builds", "Mechanics", "Locations"];

  const currentRaid = getRaidByName(raidName);
  const activeTeamStrategy = getActiveStrategy(raidName, selectedStrategyIndex);

  const rolesSource = activeTeamStrategy?.roles || null;
  const recommendedList = activeTeamStrategy?.recommended || [];
  const detailsTitleBackground = currentRaid
    ? getPokemonBackground(currentRaid.name, pokemonMap) // Pass pokemonMap
    : typeBackgrounds[""];

  const buildGroups = (() => {
    if (!recommendedList.length || typeof recommendedList[0] !== "object")
      return null;

    const groups = recommendedList.reduce((acc, build) => {
      const groupName = build.player || "General";
      if (!acc[groupName]) acc[groupName] = [];
      acc[groupName].push(build);
      return acc;
    }, {});

    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => {
        if (a.order && b.order) return a.order - b.order;
        return a.name.localeCompare(b.name);
      });
    });
    return groups;
  })();

  const effectiveBuildGroupKey = (() => {
    if (selectedBuildGroup && buildGroups && buildGroups[selectedBuildGroup]) {
      return selectedBuildGroup;
    }
    if (buildGroups) {
      const keys = Object.keys(buildGroups).sort();
      return keys.length > 0 ? keys[0] : null;
    }
    return null;
  })();

  const handleRoleChange = (roleKey) => {
    setSelectedRole(roleKey);
    setSelectedTurnIndex(0);
  };

  const effectiveSelectedRole = (() => {
    if (!rolesSource) return "";
    if (selectedRole && rolesSource[selectedRole]) return selectedRole;
    if (rolesSource.player1) return "player1";
    const keys = Object.keys(rolesSource);
    return keys.length ? keys[0] : "";
  })();

  const roleOptions = rolesSource ? Object.keys(rolesSource) : [];
  const movesForSelectedRole =
    rolesSource && effectiveSelectedRole
      ? rolesSource[effectiveSelectedRole] || []
      : [];

  if (!currentRaid) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex animate-[fade-in_0.3s_ease-out_forwards] items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-[500px] max-w-[95vw] animate-[scale-in_0.4s_ease-out_forwards] flex-col overflow-hidden rounded-lg bg-slate-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="z-10 flex shrink-0 flex-col p-4 shadow-md"
          style={{ background: detailsTitleBackground }}
        >
          <h2 className="m-0 text-xl font-bold text-slate-900 drop-shadow-sm">
            {currentRaid.name}
          </h2>
          <p className="m-0 text-sm font-medium text-slate-800 opacity-90">
            {currentRaid.stars}★ Raid
          </p>
        </div>

        <div className="scrollbar-hide z-10 flex shrink-0 overflow-x-auto border-b border-slate-700 bg-slate-900">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`relative min-w-[80px] flex-1 py-3.5 text-sm font-semibold tracking-wide whitespace-nowrap uppercase transition-colors ${
                activeTab === tab
                  ? "bg-slate-800 text-blue-500 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-blue-500 after:content-['']"
                  : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto bg-slate-800 p-5">
          <Activity mode={activeTab === "Strategy" ? "visible" : "hidden"}>
            <RaidStrategyTab
              currentRaid={currentRaid}
              selectedStrategyIndex={selectedStrategyIndex}
              setSelectedStrategyIndex={setSelectedStrategyIndex}
              setSelectedRole={setSelectedRole}
              setSelectedTurnIndex={setSelectedTurnIndex}
              setSelectedBuildGroup={setSelectedBuildGroup}
              rolesSource={rolesSource}
              roleOptions={roleOptions}
              effectiveSelectedRole={effectiveSelectedRole}
              handleRoleChange={handleRoleChange}
              movesForSelectedRole={movesForSelectedRole}
              selectedTurnIndex={selectedTurnIndex}
            />
          </Activity>

          <Activity mode={activeTab === "Builds" ? "visible" : "hidden"}>
            <RaidBuildsTab
              recommendedList={recommendedList}
              buildGroups={buildGroups}
              effectiveBuildGroupKey={effectiveBuildGroupKey}
              setSelectedBuildGroup={setSelectedBuildGroup}
              pokemonMap={pokemonMap} // Pass pokemonMap
            />
          </Activity>

          <Activity mode={activeTab === "Mechanics" ? "visible" : "hidden"}>
            <RaidMechanicsTab currentRaid={currentRaid} />
          </Activity>

          <Activity mode={activeTab === "Locations" ? "visible" : "hidden"}>
            <RaidLocationsTab currentRaid={currentRaid} />
          </Activity>
        </div>
      </div>
    </div>
  );
};
export default RaidModal;
