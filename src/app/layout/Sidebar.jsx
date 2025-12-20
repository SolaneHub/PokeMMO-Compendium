import {
  BookOpen,
  Calculator,
  CheckCircle, // Re-added CheckCircle import
  ChevronLeft,
  ChevronRight,
  Crown,
  Edit3,
  Home,
  LogIn,
  LogOut,
  Package,
  RefreshCw,
  Skull,
  Swords,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/shared/context/AuthContext";

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin: isUserAdmin } = useAuth();
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

  const navigation = [...baseNavigation];

  if (currentUser) {
    navigation.push({ name: "My Teams", path: "/my-teams", icon: User });
    if (isUserAdmin) {
      navigation.push({
        name: "Admin Dashboard",
        path: "/admin/dashboard",
        icon: CheckCircle,
      });
    }
  } else {
    navigation.push({ name: "Login", path: "/login", icon: LogIn });
  }

  if (!import.meta.env.PROD) {
    navigation.push({
      name: "Editor",
      path: "/editor",
      icon: Edit3,
      admin: true,
    });
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/5 bg-[#1a1b20] transition-all duration-300 ease-in-out lg:static ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${isCollapsed ? "lg:w-20" : "lg:w-64"} w-64`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">
          {!isCollapsed && (
            <span className="truncate bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent">
              Compendium
            </span>
          )}
          {/* Collapse Toggle (Desktop Only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white lg:flex"
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
            className="p-1.5 text-slate-400 hover:text-white lg:hidden"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`group relative flex items-center rounded-xl px-4 py-2.5 transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                } `}
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                  <Icon
                    size={22}
                    className={`transition-colors ${
                      isActive
                        ? "text-blue-400"
                        : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  />
                </div>

                <span
                  className={`overflow-hidden font-medium whitespace-nowrap transition-[width,opacity,margin] duration-300 ease-in-out ${
                    isCollapsed ? "ml-0 w-0 opacity-0" : "ml-3 w-32 opacity-100" // Fixed width for text allows smoother transition than 'w-auto'
                  }`}
                >
                  {item.name}
                </span>

                {/* Active Indicator Strip */}
                {isActive && (
                  <div className="absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r-full bg-blue-500" />
                )}

                {/* Tooltip for Collapsed State */}
                {isCollapsed && (
                  <div className="absolute left-full z-50 ml-2 hidden rounded border border-white/10 bg-slate-800 px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg lg:group-hover:block">
                    {item.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer / User / Status (Optional) */}
        <div className="border-t border-white/5 p-4">
          <div
            className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}
          >
            {currentUser ? (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {currentUser.email[0].toUpperCase()}
                </div>
                {!isCollapsed && (
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <span className="truncate text-xs font-medium text-slate-200">
                      {currentUser.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1 text-[10px] text-red-400 hover:underline"
                    >
                      <LogOut size={10} /> Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-400">
                  ?
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-200">
                      Guest
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Log in to save teams
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
