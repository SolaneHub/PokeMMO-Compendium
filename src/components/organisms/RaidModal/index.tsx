import { useEffect, useRef, useState } from "react";

import Tabs from "@/components/molecules/Tabs";
import { Raid } from "@/hooks/useRaidsData";
import { Pokemon } from "@/types/pokemon";
import { RaidBuild } from "@/types/raids";
import {
  getPokemonBackgroundStyle,
  typeBackgrounds,
} from "@/utils/pokemonColors";
import { getActiveStrategyFromRaid } from "@/utils/pokemonHelpers";

import RaidBuildsTab from "./tabs/RaidBuildsTab";
import RaidLocationsTab from "./tabs/RaidLocationsTab";
import RaidMechanicsTab from "./tabs/RaidMechanicsTab";
import RaidStrategyTab from "./tabs/RaidStrategyTab";

interface RaidModalProps {
  onClose: () => void;
  pokemonMap: Map<string, Pokemon>;
  currentRaid: Raid | null;
}

const RaidModal = ({ onClose, pokemonMap, currentRaid }: RaidModalProps) => {
  const [activeTab, setActiveTab] = useState("STRATEGY");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedTurnIndex, setSelectedTurnIndex] = useState(0);
  const [selectedStrategyIndex, setSelectedStrategyIndex] = useState(0);
  const [selectedBuildGroup, setSelectedBuildGroup] = useState<string | null>(
    null
  );

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (currentRaid) {
      if (dialog && !dialog.open) {
        dialog.showModal();
      }
    } else {
      dialog?.close();
    }
  }, [currentRaid]);

  const tabs = ["STRATEGY", "BUILDS", "MECHANICS", "LOCATIONS"];

  const activeTeamStrategy = currentRaid
    ? getActiveStrategyFromRaid(currentRaid, selectedStrategyIndex)
    : null;

  const rolesSource = activeTeamStrategy?.roles || null;
  const recommendedList = activeTeamStrategy?.recommended || [];

  const detailsTitleBackground = (() => {
    if (!currentRaid) return typeBackgrounds[""];
    const pokemon = pokemonMap.get(currentRaid.name);
    return getPokemonBackgroundStyle(pokemon?.types || []);
  })();

  const buildGroups = (() => {
    if (!recommendedList.length) return null;

    const buildsOnly = recommendedList.filter(
      (item): item is RaidBuild => typeof item === "object" && item !== null
    );

    if (buildsOnly.length === 0) return null;

    const groups = buildsOnly.reduce(
      (acc: Record<string, RaidBuild[]>, build: RaidBuild) => {
        const groupName = build.player || "General";
        acc[groupName] ??= [];
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
      const keys = Object.keys(buildGroups).sort((a, b) => a.localeCompare(b));
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
    if (rolesSource["player1"]) return "player1";
    const keys = Object.keys(rolesSource);
    return keys.length ? keys[0] || "" : "";
  })();

  const roleOptions = rolesSource
    ? Object.keys(rolesSource).sort((a, b) => {
        const numA = Number.parseInt(a.replaceAll(/\D/g, ""), 10) || 0;
        const numB = Number.parseInt(b.replaceAll(/\D/g, ""), 10) || 0;
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
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-2000 m-0 flex h-full max-h-none w-full max-w-none items-center justify-center border-none bg-transparent p-0"
      onClose={onClose}
      onCancel={onClose}
    >
      <button
        type="button"
        className="fixed inset-0 h-full w-full animate-[fade-in_0.3s_ease-out_forwards] border-none bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close backdrop"
      />
      <div className="relative flex max-h-[90vh] w-125 max-w-[95vw] animate-[scale-in_0.4s_ease-out_forwards] flex-col overflow-hidden rounded-lg bg-[#1a1b20] text-white shadow-2xl">
        <div
          className="z-10 flex shrink-0 flex-col p-4 shadow-md"
          style={{ background: detailsTitleBackground }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="m-0 text-xl font-bold text-slate-900 drop-shadow-sm">
                {currentRaid.name}
              </h2>
              <p className="m-0 text-sm font-medium text-slate-800 opacity-90">
                {currentRaid.stars}★ Raid
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-xl leading-none font-bold text-slate-900 transition-colors hover:bg-black/20"
              aria-label="Close modal"
            >
              <span className="mb-1">×</span>
            </button>
          </div>
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
    </dialog>
  );
};

export default RaidModal;
