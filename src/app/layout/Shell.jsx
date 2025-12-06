import { Menu } from "lucide-react";
import { useState } from "react";

import Sidebar from "./Sidebar";

function Shell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#0f1014] overflow-hidden text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-14 flex items-center px-4 bg-[#1a1b20] border-b border-white/5 shrink-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <span className="ml-3 font-semibold text-slate-200">
            PokeMMO Compendium
          </span>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto h-full animate-[fade-in_0.3s_ease-out]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Shell;
