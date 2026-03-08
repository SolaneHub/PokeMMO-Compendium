import { Plus, Search, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

import { usePokedexData } from "@/hooks/usePokedexData";

interface AddEnemyPokemonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (pokemonName: string) => void;
}

const AddEnemyPokemonModal = ({
  isOpen,
  onClose,
  onAdd,
}: AddEnemyPokemonModalProps) => {
  const { allPokemonData, isLoading } = usePokedexData();
  const [searchTerm, setSearchTerm] = useState("");
  const [deferredSearchTerm, setDeferredSearchTerm] = useState("");
  const [, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      const dialog = dialogRef.current;
      if (dialog && !dialog.open) {
        dialog.showModal();
      }
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    startTransition(() => {
      setDeferredSearchTerm(value);
    });
  };

  const filteredPokemon = allPokemonData.filter((p) =>
    p.name.toLowerCase().includes(deferredSearchTerm.toLowerCase())
  );

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="py-12 text-center text-slate-400">Loading...</div>;
    }

    if (filteredPokemon.length > 0) {
      return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {filteredPokemon.map((pokemon) => (
            <button
              key={pokemon.id}
              onClick={() => {
                onAdd(pokemon.name);
                onClose();
              }}
              className="group flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-[#0f1014] p-3 transition-all hover:border-blue-500 hover:bg-white/5"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 p-1 transition-transform group-hover:scale-110">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.dexId}.png`}
                  alt={pokemon.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-xs font-bold text-slate-300 group-hover:text-blue-400">
                {pokemon.name}
              </span>
              <Plus
                size={14}
                className="text-slate-600 transition-colors group-hover:text-blue-500"
              />
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="py-12 text-center font-medium text-slate-500">
        No Pokémon found.
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      }}
      className="fixed inset-0 z-100 m-0 flex h-full max-h-none w-full max-w-none animate-[fade-in_0.2s_ease-out] items-center justify-center border-none bg-black/60 p-0 backdrop-blur-sm backdrop:bg-transparent"
    >
      <div className="relative z-10 flex max-h-[85vh] w-120 max-w-[95vw] animate-[scale-in_0.3s_ease-out] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a1b20] shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/5 p-4 text-white">
          <h2 className="text-xl font-bold">Add Enemy Pokémon</h2>
          <button
            onClick={onClose}
            className="text-slate-400 transition-colors hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-white/5 p-4">
          <div className="relative">
            <Search
              className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="text"
              autoFocus
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-white/5 bg-[#0f1014] py-2.5 pr-4 pl-10 text-white placeholder-slate-500 transition-all focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="custom-scrollbar flex-1 overflow-y-auto p-2">
          {renderContent()}
        </div>
      </div>
    </dialog>
  );
};

export default AddEnemyPokemonModal;
