import { Search } from "lucide-react";
import React from "react";

import { Pokemon } from "@/types/pokemon";

interface TargetSectionProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  isPending: boolean;
  filteredPokemon: Pokemon[];
  selectedPokemonName: string;
  setSelectedPokemonName: (val: string) => void;
  setDeferredSearchTerm: (val: string) => void;
  startTransition: (callback: () => void) => void;
  searchRef: React.RefObject<HTMLDivElement | null>;
  selectedPokemon: Pokemon | null;
  sprite: string | null;
  background: string;
  baseCatchRate: number;
}

const TargetSection = ({
  searchTerm,
  setSearchTerm,
  isSearchOpen,
  setIsSearchOpen,
  isPending,
  filteredPokemon,
  selectedPokemonName,
  setSelectedPokemonName,
  setDeferredSearchTerm,
  startTransition,
  searchRef,
  selectedPokemon,
  sprite,
  background,
  baseCatchRate,
}: TargetSectionProps) => {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-white/5 bg-[#1a1b20] p-6 shadow-xl">
      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
        <Search className="text-blue-400" size={20} />
        <h2 className="text-lg font-bold text-slate-200">Target</h2>
      </div>

      {/* Search */}
      <div className="h-22">
        <label className="mb-3 block text-sm font-bold text-slate-500">
          Search Pokémon
        </label>
        <div className="relative z-20" ref={searchRef}>
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={searchTerm}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              startTransition(() => {
                setDeferredSearchTerm(value);
              });
              setIsSearchOpen(true);
            }}
            className="w-full rounded-lg border border-white/5 bg-[#0f1014] px-4 py-3 text-slate-200 transition-colors placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />
          {isSearchOpen && (
            <div
              className={`scrollbar-thin scrollbar-thumb-slate-700 absolute top-full right-0 left-0 z-50 mt-2 max-h-48 overflow-y-auto rounded-lg border border-white/5 bg-[#0f1014] shadow-xl transition-opacity duration-200 ${
                isPending ? "opacity-50" : "opacity-100"
              }`}
            >
              {filteredPokemon.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setSelectedPokemonName(p.name);
                    setSearchTerm(p.name);
                    setDeferredSearchTerm(p.name);
                    setIsSearchOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                    selectedPokemonName === p.name
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  } `}
                >
                  <span>{p.name}</span>
                  <span className="rounded bg-black/30 px-1.5 py-0.5 text-xs opacity-50">
                    CR: {p.catchRate}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Preview */}
      {selectedPokemon && (
        <div className="relative flex min-h-50 grow flex-col items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-[#0f1014] p-6">
          <div
            className="absolute inset-0 opacity-20 blur-xl transition-colors duration-500"
            style={{ background: background }}
          />
          <img
            src={sprite || ""}
            alt={selectedPokemonName}
            className="rendering-pixelated relative z-10 h-32 w-32 object-contain drop-shadow-md"
          />
          <h3 className="relative z-10 mt-2 text-xl font-bold text-slate-100">
            {selectedPokemonName}
          </h3>
          <div className="relative z-10 mt-1 rounded bg-black/40 px-2 py-1 font-mono text-xs text-slate-400">
            Base Rate: <span className="text-yellow-400">{baseCatchRate}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TargetSection;
