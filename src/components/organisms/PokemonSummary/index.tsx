import { useEffect, useRef, useState } from "react";

import TypeBadge from "@/components/atoms/TypeBadge";
import Tabs from "@/components/molecules/Tabs";
import { usePokedexContext } from "@/context/PokedexContext";
import { usePokemonUI } from "@/hooks/usePokemonUI";
import { Pokemon } from "@/types/pokemon";
import { getPokemonBackgroundStyle } from "@/utils/pokemonColors";
import { getPokemonVariants } from "@/utils/pokemonHelpers";
import { calculateDefenses } from "@/utils/typeUtils";

import PokemonEvolutions from "./PokemonEvolutions";
import PokemonLocations, { Location } from "./PokemonLocations";
import PokemonMoves, { Move } from "./PokemonMoves";
import PokemonOverview from "./PokemonOverview";
import PokemonStats from "./PokemonStats";

interface PokemonSummaryProps {
  pokemon: Pokemon | null;
  allPokemon: Pokemon[];
  onClose: () => void;
  onSelectPokemon: (pokemon: Pokemon) => void;
}

const PokemonSummary = ({
  pokemon: initialPokemon,
  allPokemon,
  onClose,
  onSelectPokemon,
}: PokemonSummaryProps) => {
  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const { getPokemonDetails } = usePokedexContext();
  const [fullPokemon, setFullPokemon] = useState<Pokemon | null>(
    initialPokemon
  );
  const [isFetchingFull, setIsFetchingFull] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (initialPokemon) {
      const dialog = dialogRef.current;
      if (dialog && !dialog.open) {
        dialog.showModal();
      }
    } else {
      dialogRef.current?.close();
    }
  }, [initialPokemon]);

  useEffect(() => {
    const fetchFullData = async () => {
      if (!initialPokemon?.id) return;

      if (initialPokemon?.moves?.length) {
        setFullPokemon(initialPokemon);
        return;
      }

      setIsFetchingFull(true);
      const details = await getPokemonDetails(initialPokemon.id);
      if (details) {
        setFullPokemon(details);
      }
      setIsFetchingFull(false);
    };

    fetchFullData();
  }, [initialPokemon, getPokemonDetails]);

  const { sprite } = usePokemonUI(initialPokemon);

  if (!initialPokemon) return null;

  const pokemon = fullPokemon || initialPokemon;
  const background = getPokemonBackgroundStyle(pokemon.types || []);
  const variants = getPokemonVariants(pokemon.name, allPokemon).filter(
    (v) => v !== pokemon.name
  );
  const defenses = pokemon.types ? calculateDefenses(pokemon.types) : {};

  const formatPokedexId = (id: string | number | null) => {
    if (id && (typeof id === "number" || !Number.isNaN(Number(id)))) {
      return `#${String(id).padStart(3, "0")}`;
    }
    return "???";
  };

  const tabs = ["OVERVIEW", "LOCATIONS", "STATS", "EVOLUTIONS", "MOVES"];

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed inset-0 z-2000 m-0 flex h-full max-h-none w-full max-w-none animate-[fade-in_0.3s_ease-out_forwards] items-center justify-center border-none bg-black/75 p-2 backdrop-blur-sm backdrop:bg-transparent md:p-6"
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div
        className="relative flex h-full max-h-[95vh] w-full max-w-4xl animate-[scale-in_0.4s_ease-out_forwards] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1a1b20] text-white shadow-2xl md:h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed Width */}
        <div
          className="z-10 flex shrink-0 items-center justify-between p-4 shadow-md"
          style={{ background }}
        >
          <h2 className="flex items-center gap-2 text-xl font-bold drop-shadow-md">
            <span className="rounded-md bg-black/30 px-2 py-1 font-mono text-sm text-white">
              {formatPokedexId(pokemon.id)}
            </span>
            {pokemon.name}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-xl leading-none font-bold text-slate-900 transition-colors hover:bg-black/20"
            aria-label="Close summary"
          >
            <span className="mb-1">×</span>
          </button>
        </div>

        {/* Content Area - Responsive Layout with Internal Scroll */}
        <div className="scrollbar-hide flex flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
          {/* Left Side: Sprite, Types, Category, Description */}
          <div className="relative flex w-full shrink-0 flex-col items-center justify-center border-b border-white/5 bg-[#0f1014] p-6 md:w-[320px] md:border-r md:border-b-0">
            <button
              type="button"
              className="absolute top-4 right-4 rounded-md border border-white/10 bg-[#1a1b20] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:border-blue-600"
            >
              🔈 Cry
            </button>

            <div className="flex w-full flex-col items-center gap-4 py-4 md:gap-6">
              <img
                className="h-32 w-32 animate-[float_6s_infinite] object-contain drop-shadow-xl md:h-48 md:w-48"
                src={sprite || ""}
                alt={pokemon.name}
              />

              <div className="flex w-full flex-col items-center gap-4 text-center md:gap-6">
                <div className="flex gap-2">
                  {pokemon.types?.map((t) => (
                    <TypeBadge key={t} type={t} />
                  ))}
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                    Category
                  </span>
                  <span className="text-sm font-medium text-slate-300 italic">
                    {pokemon.category}
                  </span>
                </div>

                <div className="flex w-full flex-col gap-2 px-2">
                  <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                    Description
                  </span>
                  <p className="m-0 rounded-lg border-l-4 border-blue-600 bg-white/5 p-3 text-xs leading-relaxed text-slate-300 italic">
                    {pokemon.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Menu and Content */}
          <div className="flex min-w-0 flex-1 flex-col bg-[#1a1b20]">
            {/* Menu (Tabs) */}
            <div className="scrollbar-hide sticky top-0 z-20 shrink-0 overflow-x-auto border-b border-white/5 bg-[#1a1b20]">
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            {/* Content Container */}
            <div className="scrollbar-thin scrollbar-thumb-slate-700 flex-1 p-4 md:overflow-y-auto md:p-6">
              {isFetchingFull && activeTab !== "OVERVIEW" ? (
                <div className="flex h-40 items-center justify-center text-slate-400">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500"></div>
                  <p className="ml-3 text-sm">Fetching details...</p>
                </div>
              ) : (
                <div className="animate-[fade-in_0.2s_ease-out]">
                  {activeTab === "OVERVIEW" && (
                    <div className="space-y-6">
                      <PokemonOverview pokemon={pokemon} />
                    </div>
                  )}
                  {activeTab === "STATS" && (
                    <PokemonStats
                      stats={pokemon.baseStats}
                      defenses={defenses || null}
                    />
                  )}
                  {activeTab === "MOVES" && (
                    <PokemonMoves
                      moves={
                        (pokemon.moves || []).map((m) => {
                          const moveObj: Record<string, unknown> = { ...m };
                          if (moveObj["level"] === undefined)
                            moveObj["level"] = 0;
                          return moveObj;
                        }) as unknown as Move[]
                      }
                    />
                  )}
                  {activeTab === "LOCATIONS" && (
                    <PokemonLocations
                      locations={
                        (pokemon.locations || []).map((l) => {
                          const locObj: Record<string, unknown> = { ...l };
                          if (locObj["rarity"] === undefined)
                            locObj["rarity"] = "";
                          return locObj;
                        }) as unknown as Location[]
                      }
                    />
                  )}
                  {activeTab === "EVOLUTIONS" && (
                    <PokemonEvolutions
                      pokemon={pokemon}
                      allPokemon={allPokemon}
                      onSelectPokemon={onSelectPokemon}
                      variants={variants}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default PokemonSummary;
