import { useState } from "react";

import Tabs from "@/components/molecules/Tabs";
import { Raid } from "@/hooks/useRaidsData";
import { getPokemonBackground } from "@/services/pokemonService";
import { getActiveStrategyFromRaid } from "@/services/raidsService";
import { Pokemon } from "@/types/pokemon";
import { RaidBuild } from "@/types/raids";
import { typeBackgrounds } from "@/utils/pokemonColors";

import RaidBuildsTab from "./tabs/RaidBuildsTab";
import RaidLocationsTab from "./tabs/RaidLocationsTab";
import RaidMechanicsTab from "./tabs/RaidMechanicsTab";
import RaidStrategyTab from "./tabs/RaidStrategyTab";

interface RaidModalProps {
  raidName: string;
  onClose: () => void;
  pokemonMap: Map<string, Pokemon>;
  currentRaid: Raid | null;
}

const RaidModal = ({
  raidName,
  onClose,
  pokemonMap,
  currentRaid,
}: RaidModalProps) => {
  const [activeTab, setActiveTab] = useState("STRATEGY");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedTurnIndex, setSelectedTurnIndex] = useState(0);
  const [selectedStrategyIndex, setSelectedStrategyIndex] = useState(0);
  const [selectedBuildGroup, setSelectedBuildGroup] = useState<string | null>(
    null
  );

  const tabs = ["STRATEGY", "BUILDS", "MECHANICS", "LOCATIONS"];

  const activeTeamStrategy = currentRaid
    ? getActiveStrategyFromRaid(currentRaid, selectedStrategyIndex)
    : null;

  const rolesSource = activeTeamStrategy?.roles || null;
  const recommendedList = activeTeamStrategy?.recommended || [];

  const detailsTitleBackground = currentRaid
    ? getPokemonBackground(currentRaid.name, pokemonMap)
    : typeBackgrounds[""];

  const buildGroups = (() => {
    if (!recommendedList.length) return null;

    // Filter out strategy notes (strings) before grouping
    const buildsOnly = recommendedList.filter(
      (item): item is RaidBuild => typeof item === "object" && item !== null
    );

    if (buildsOnly.length === 0) return null;

    const groups = buildsOnly.reduce(
      (acc: Record<string, RaidBuild[]>, build: RaidBuild) => {
        const groupName = build.player || "General";
        if (!acc[groupName]) acc[groupName] = [];
        acc[groupName].push(build);
        return acc;
      },
      {}
    );

    Object.keys(groups).forEach((key) => {
      groups[key].sort((a: RaidBuild, b: RaidBuild) => {
        if (a.order !== undefined && b.order !== undefined)
          return a.order - b.order;
        return (a.name || "").localeCompare(b.name || "");
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

  const handleRoleChange = (roleKey: string) => {
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

  const roleOptions = rolesSource
    ? Object.keys(rolesSource).sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, ""), 10) || 0;
        const numB = parseInt(b.replace(/\D/g, ""), 10) || 0;
        if (numA !== numB) return numA - numB;
        return a.localeCompare(b);
      })
    : [];

  const movesForSelectedRole =
    rolesSource && effectiveSelectedRole
      ? rolesSource[effectiveSelectedRole] || []
      : [];

  if (!currentRaid) return null;

  return (
    <div
      className="fixed inset-0 z-2000 flex animate-[fade-in_0.3s_ease-out_forwards] items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-125 max-w-[95vw] animate-[scale-in_0.4s_ease-out_forwards] flex-col overflow-hidden rounded-lg bg-[#1a1b20] text-white shadow-2xl"
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

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto bg-[#1a1b20] p-5">
          {activeTab === "STRATEGY" && (
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
          )}
          {activeTab === "BUILDS" && (
            <RaidBuildsTab
              recommendedList={recommendedList}
              buildGroups={buildGroups}
              effectiveBuildGroupKey={effectiveBuildGroupKey}
              setSelectedBuildGroup={setSelectedBuildGroup}
              pokemonMap={pokemonMap}
            />
          )}
          {activeTab === "MECHANICS" && (
            <RaidMechanicsTab currentRaid={currentRaid} />
          )}
          {activeTab === "LOCATIONS" && (
            <RaidLocationsTab currentRaid={currentRaid} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RaidModal;
