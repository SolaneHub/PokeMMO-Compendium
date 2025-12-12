import {
  ChevronDown,
  ChevronRight,
  Map,
  Settings,
  Shield,
  Swords,
  Trash2,
  Users,
} from "lucide-react";
import React, { useState } from "react";

// Simple accordion component for the sidebar
const SidebarSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase hover:bg-white/5 hover:text-slate-300"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} />}
          <span>{title}</span>
        </div>
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {isOpen && <div className="mt-1 space-y-0.5 pl-2">{children}</div>}
    </div>
  );
};

const SidebarItem = ({ active, onClick, children, icon: Icon, actions }) => (
  <div
    className={`group flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors duration-200 ${
      active
        ? "border-blue-500/20 bg-blue-600/10 text-blue-400"
        : "border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
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

const EditorSidebar = ({
  team,
  activeView,
  activeId,
  onNavigate,
  regions,
  availableMembers,
  enemyPools, // { [memberName]: [enemy1, enemy2] }
  onAddEnemy, // (memberName) => void
  onRemoveEnemy, // (memberName, enemyName) => void
}) => {
  // Local state for expanding regions/members in the strategy tree
  const [expandedRegions, setExpandedRegions] = useState({});
  const [expandedMembers, setExpandedMembers] = useState({});

  const toggleRegion = (r) =>
    setExpandedRegions((prev) => ({ ...prev, [r]: !prev[r] }));
  const toggleMember = (m) =>
    setExpandedMembers((prev) => ({ ...prev, [m]: !prev[m] }));

  return (
    <div className="flex h-full w-80 flex-col border-r border-[#333] bg-[#121317]">
      {/* Team Header Summary */}
      <div className="border-b border-[#333] p-4">
        <h2 className="truncate text-lg font-bold text-white">{team.name}</h2>
        <p className="text-xs text-slate-500">
          {team.members.filter((m) => m && m.name).length} / 6 Members
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
          {team.members.map((member, idx) => (
            <SidebarItem
              key={idx}
              active={activeView === "roster" && activeId === idx}
              onClick={() => onNavigate("roster", idx)}
              icon={null} // TODO: Add Pokemon Icon/Sprite here if available
            >
              <div className="flex items-center gap-2">
                {/* Placeholder dot or sprite */}
                <div
                  className={`h-2 w-2 rounded-full ${member?.name ? "bg-green-500" : "bg-slate-700"}`}
                />
                <span
                  className={
                    member?.name ? "text-slate-200" : "text-slate-600 italic"
                  }
                >
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
            <div key={region} className="mb-1">
              <div
                className="flex cursor-pointer items-center gap-2 px-2 py-1 text-sm text-slate-400 hover:text-slate-200"
                onClick={() => toggleRegion(region)}
              >
                {expandedRegions[region] ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
                <Map size={14} />
                {region}
              </div>

              {expandedRegions[region] && (
                <div className="ml-4 border-l border-[#333] pl-2">
                  {availableMembers
                    .filter((m) => m.region === region)
                    .map((member) => (
                      <div key={member.name} className="mb-1">
                        <div
                          className="flex cursor-pointer items-center gap-2 py-1 text-sm text-slate-400 hover:text-slate-200"
                          onClick={() => toggleMember(member.name)}
                        >
                          {expandedMembers[member.name] ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                          <Shield size={14} />
                          {member.name}
                        </div>

                        {expandedMembers[member.name] && (
                          <div className="ml-4 border-l border-[#333] pl-2">
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
                                  <button
                                    className="text-slate-500 hover:text-red-400"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (
                                        confirm(
                                          `Remove ${enemy} from ${member.name}'s plan?`
                                        )
                                      ) {
                                        onRemoveEnemy(member.name, enemy);
                                      }
                                    }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
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
