import { Menu } from "lucide-react";
import { useState } from "react";

import Sidebar from "./Sidebar";

function Shell({ children, noPadding }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mainClasses = `flex-1 overflow-x-hidden overflow-y-auto scroll-smooth ${
    noPadding ? "" : "p-4 lg:p-8"
  }`;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0f1014] font-sans text-slate-200 selection:bg-blue-500/30">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="relative flex h-full flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="z-30 flex h-14 shrink-0 items-center border-b border-white/5 bg-[#1a1b20] px-4 lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="-ml-2 p-2 text-slate-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <span className="ml-3 font-semibold text-slate-200">
            PokeMMO Compendium
          </span>
        </header>

        {/* Scrollable Content */}
        <main className={mainClasses}>
          <div className="h-full animate-[fade-in_0.3s_ease-out]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Shell;
