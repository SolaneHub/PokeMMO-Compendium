import { Plus, Search, X } from "lucide-react";
import React, { useState, useTransition } from "react";

import { usePokedexData } from "@/shared/hooks/usePokedexData";

const AddEnemyPokemonModal = ({ isOpen, onClose, onAdd }) => {
  const { pokemonNames } = usePokedexData();
  const [searchTerm, setSearchTerm] = useState("");
  const [deferredSearchTerm, setDeferredSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  // Simple filtering
  const filteredPokemon = pokemonNames
    .filter((p) => {
      // 1. Match search term
      if (!p.toLowerCase().includes(deferredSearchTerm.toLowerCase()))
        return false;

      // 2. Filter out alternative forms (containing parentheses)
      // unless they are specific exceptions that have no base form (Wormadam, Deerling, Sawsbuck).
      if (p.includes("(")) {
        const exceptions = ["Wormadam", "Deerling", "Sawsbuck"];
        const isException = exceptions.some((ex) => p.startsWith(ex));
        if (!isException) return false;
      }

      return true;
    })
    .slice(0, 2000); // Limit results for performance

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-fade-in relative flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-white/5 bg-[#1a1b20] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/5 bg-black/20 p-4">
          <h3 className="text-lg font-bold text-white">Add Enemy Pokémon</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="border-b border-white/5 p-4">
          <div className="relative">
            <input
              type="text"
              autoFocus
              className="w-full rounded-lg border border-white/10 bg-[#1e2025] p-3 pl-10 text-white outline-none focus:border-blue-500"
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                startTransition(() => {
                  setDeferredSearchTerm(value);
                });
              }}
            />
            <Search
              className="absolute top-3.5 left-3 text-slate-500"
              size={18}
            />
          </div>
        </div>

        <div
          className={`custom-scrollbar flex-1 overflow-y-auto p-2 transition-opacity duration-200 ${
            isPending ? "opacity-50" : "opacity-100"
          }`}
        >
          {filteredPokemon.length > 0 ? (
            <div className="grid grid-cols-1 gap-1">
              {filteredPokemon.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    onAdd(p);
                    onClose();
                  }}
                  className="group flex items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-white/5"
                >
                  <img
                    src={`https://img.pokemondb.net/sprites/black-white/anim/normal/${p.toLowerCase()}.gif`}
                    onError={(e) => (e.target.style.display = "none")}
                    className="h-8 w-8 object-contain"
                    alt=""
                  />
                  <span className="font-medium text-slate-200 group-hover:text-white">
                    {p}
                  </span>
                  <Plus
                    size={16}
                    className="ml-auto text-slate-500 group-hover:text-blue-400"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500">
              No Pokémon found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEnemyPokemonModal;
