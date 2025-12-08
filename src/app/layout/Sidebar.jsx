import {
  BookOpen,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Crown,
  Edit3,
  Home,
  Package,
  RefreshCw,
  Skull,
  Swords,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const baseNavigation = [
    { name: "Home", path: "/", icon: Home },
    { name: "Pokédex", path: "/pokedex", icon: BookOpen },
    { name: "Breeding", path: "/breeding", icon: Calculator },
    { name: "Catch Calculator", path: "/catch-calculator", icon: Trophy },
    { name: "Pickup", path: "/pickup", icon: Package },
    { name: "Elite Four", path: "/elite-four", icon: Crown },
    { name: "Trainer Rerun", path: "/trainer-rerun", icon: RefreshCw },
    { name: "Raids", path: "/raids", icon: Users },
    { name: "Super Trainers", path: "/super-trainers", icon: Swords },
    { name: "Boss Fights", path: "/boss-fights", icon: Skull },
  ];

  const navigation = import.meta.env.PROD
    ? baseNavigation
    : [
        ...baseNavigation,
        { name: "Editor", path: "/editor", icon: Edit3, admin: true },
      ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-[#1a1b20] border-r border-white/5 transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
          w-64
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          {!isCollapsed && (
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate">
              Compendium
            </span>
          )}
          {/* Collapse Toggle (Desktop Only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>

          {/* Close Button (Mobile Only) */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`group relative flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-blue-600/10 text-blue-400"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                  }
                `}
              >
                <Icon
                  size={22}
                  className={`transition-colors ${
                    isActive
                      ? "text-blue-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />

                <span
                  className={`ml-3 font-medium transition-all duration-300 whitespace-nowrap
                    ${isCollapsed ? "lg:opacity-0 lg:w-0 lg:overflow-hidden" : "opacity-100"}
                  `}
                >
                  {item.name}
                </span>

                {/* Active Indicator Strip */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
                )}

                {/* Tooltip for Collapsed State */}
                {isCollapsed && (
                  <div className="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg border border-white/10 whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer / User / Status (Optional) */}
        <div className="p-4 border-t border-white/5">
          <div
            className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold text-xs">
              PM
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-200">
                  PokeMMO
                </span>
                <span className="text-[10px] text-slate-500">v1.0.0</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
