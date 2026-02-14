import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  Map,
  Settings,
  Shield,
  Swords,
  Trash2,
  Users,
} from "lucide-react";
import React, { ReactNode, useState } from "react";

import Button from "@/components/atoms/Button";
import { Team, TeamMember } from "@/firebase/firestoreService";
import { EliteFourMember } from "@/utils/eliteFourMembers";
import { getSpriteUrlByName } from "@/utils/pokemonImageHelper";

interface PokemonIconProps {
  size?: number;
  pokemonName: string;
  className?: string;
}

const PokemonIcon = ({
  size = 16,
  pokemonName,
  className,
}: PokemonIconProps) => {
  const src = getSpriteUrlByName(pokemonName);
  if (!src) return null;
  return (
    <img
      src={src}
      alt={pokemonName}
      className={className}
      style={{ width: size, height: size }}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = `${import.meta.env.BASE_URL}assets/placeholder-pokemon.png`;
      }}
    />
  );
};

interface SidebarSectionProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  defaultOpen?: boolean;
}

const SidebarSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: SidebarSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase hover:bg-white/5"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} />} <span>{title}</span>
        </div>
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {isOpen && <div className="mt-1 space-y-0.5 pl-2">{children}</div>}
    </div>
  );
};

interface SidebarItemProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  icon?: LucideIcon | React.ElementType | null;
  actions?: ReactNode;
}

const SidebarItem = ({
  active,
  onClick,
  children,
  icon: Icon,
  actions,
}: SidebarItemProps) => (
  <div
    className={`group flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors duration-200 ${
      active
        ? "border-blue-500/20 bg-blue-600/10 text-blue-400"
        : "border-transparent text-slate-300 hover:bg-white/5 hover:text-white"
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3 overflow-hidden">
      {Icon && (
        <Icon
          size={16}
          className={active ? "text-blue-500" : "text-slate-500"}
        />
      )}
      <span className="truncate">{children}</span>
    </div>
    {actions && (
      <div
        className="opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {actions}
      </div>
    )}
  </div>
);

interface EditorSidebarProps {
  team: Team;
  activeView: string;
  activeId: string | number | null;
  onNavigate: (
    view: string,
    id?: string | number | null,
    context?: string | null
  ) => void;
  regions: string[];
  availableMembers: EliteFourMember[];
  enemyPools: Record<string, string[]>;
  onAddEnemy: (member: EliteFourMember) => void;
  onRemoveEnemy: (memberName: string, enemyName: string) => void;
  className?: string;
}

const EditorSidebar = ({
  team,
  activeView,
  activeId,
  onNavigate,
  regions,
  availableMembers,
  enemyPools,
  onAddEnemy,
  onRemoveEnemy,
  className = "",
}: EditorSidebarProps) => {
  const [expandedRegions, setExpandedRegions] = useState<
    Record<string, boolean>
  >({});
  const [expandedMembers, setExpandedMembers] = useState<
    Record<string, boolean>
  >({});

  const toggleRegion = (r: string) =>
    setExpandedRegions((prev) => ({ ...prev, [r]: !prev[r] }));
  const toggleMember = (m: string) =>
    setExpandedMembers((prev) => ({ ...prev, [m]: !prev[m] }));

  return (
    <div
      className={`animate-fade-in flex h-full w-full flex-col border-r border-white/5 bg-[#1a1b20] ${className}`}
    >
      {/* Team Header Summary */}
      <div className="border-b border-white/5 p-4 text-white">
        <h2 className="truncate text-lg font-bold"> {team.name} </h2>
        <p className="text-xs text-slate-500">
          {team.members.filter((m: TeamMember | null) => m && m.name).length} /
          6 Members
        </p>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto p-3">
        {/* Navigation: Team Settings */}
        <SidebarItem
          active={activeView === "settings"}
          onClick={() => onNavigate("settings")}
          icon={Settings}
        >
          Team Settings
        </SidebarItem>

        <div className="h-4" />

        {/* Section: Roster */}
        <SidebarSection title="My Team" icon={Users}>
          {team.members.map((member: TeamMember | null, idx: number) => (
            <SidebarItem
              key={idx}
              active={activeView === "roster" && activeId === idx}
              onClick={() => onNavigate("roster", idx)}
              icon={
                member?.name
                  ? (props: { size?: number; className?: string }) => (
                      <PokemonIcon {...props} pokemonName={member.name} />
                    )
                  : null
              }
            >
              <div className="flex items-center gap-2">
                <span className={member?.name ? "" : "text-slate-500 italic"}>
                  {member?.name || "Empty Slot"}
                </span>
              </div>
            </SidebarItem>
          ))}
        </SidebarSection>

        <div className="h-4" />

        {/* Section: Strategies */}
        <SidebarSection title="Battle Plans" icon={Swords}>
          {regions.map((region) => (
            <div key={region} className="mb-1 text-white">
              <div
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-white/5"
                onClick={() => toggleRegion(region)}
              >
                {expandedRegions[region] ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
                <Map size={14} className="text-slate-500" /> {region}
              </div>
              {expandedRegions[region] && (
                <div className="ml-4 border-l border-white/5 pl-2">
                  {availableMembers
                    .filter((m) => m.region === region)
                    .map((member) => (
                      <div key={member.name} className="mb-1">
                        <div
                          className="flex cursor-pointer items-center gap-2 rounded py-1 text-sm hover:bg-white/5"
                          onClick={() => toggleMember(member.name)}
                        >
                          {expandedMembers[member.name] ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                          <Shield size={14} className="text-slate-500" />
                          {member.name}
                        </div>
                        {expandedMembers[member.name] && (
                          <div className="ml-4 border-l border-white/5 pl-2">
                            {/* Button to Add Enemy */}
                            <button
                              onClick={() => onAddEnemy(member)}
                              className="mb-1 flex w-full items-center gap-2 rounded px-2 py-1 text-xs text-slate-500 hover:bg-white/5 hover:text-blue-400"
                            >
                              + Add Enemy
                            </button>
                            {/* List of Enemies in Pool */}
                            {(enemyPools[member.name] || []).map((enemy) => (
                              <SidebarItem
                                key={enemy}
                                active={
                                  activeView === "strategy" &&
                                  activeId === enemy
                                }
                                onClick={() =>
                                  onNavigate("strategy", enemy, member.name)
                                }
                                actions={
                                  <Button
                                    variant="ghost"
                                    size="xs"
                                    className="text-slate-500 hover:text-red-400"
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          `Remove ${enemy} from ${member.name}'s plan?`
                                        )
                                      ) {
                                        onRemoveEnemy(member.name, enemy);
                                      }
                                    }}
                                    icon={Trash2}
                                  >
                                    {""}
                                  </Button>
                                }
                              >
                                {enemy}
                              </SidebarItem>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </SidebarSection>
      </div>
    </div>
  );
};

export default EditorSidebar;
