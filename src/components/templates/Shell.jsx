import { Menu } from"lucide-react";
import { useState } from"react"; 

import Button from"@/components/atoms/Button";
import Sidebar from"@/components/organisms/Sidebar"; function Shell({ children }) { const [isSidebarOpen, setIsSidebarOpen] = useState(false); return ( <div className="flex h-screen w-full overflow-hidden bg-[#0f1014] font-sans selection:bg-blue-500/30"> {/* Sidebar */} <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} /> {/* Main Content Area */} <div className="relative flex h-full flex-1 flex-col overflow-hidden"> {/* Mobile Header */} <header className="z-30 flex h-14 shrink-0 items-center border-b border-white/5 bg-[#1a1b20] px-4 lg:hidden"> <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(true)} className="-ml-2" icon={Menu} /> <span className="ml-3 font-semibold"> PokeMMO Compendium </span> </header> {/* Content */} <main className="relative flex h-full flex-1 flex-col overflow-hidden"> {children} </main> </div> </div> );
} export default Shell; 
