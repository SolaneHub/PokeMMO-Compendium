import { useEffect, useState } from "react";

import TypeBadge from "@/components/atoms/TypeBadge";
import Tabs from "@/components/molecules/Tabs";
import { usePokedexContext } from "@/context/PokedexContext";
import { Pokemon } from "@/types/pokemon";
import {
  getPokemonBackground,
  getPokemonCardData,
  getPokemonVariants,
} from "@/utils/pokemonHelpers";
import { calculateDefenses } from "@/utils/typeUtils";

import PokemonEvolutions from "./PokemonEvolutions";
import PokemonLocations from "./PokemonLocations";
import PokemonMoves from "./PokemonMoves";
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
  const [fullPokemon, setFullPokemon] = useState<Pokemon | null>(initialPokemon);
  const [isFetchingFull, setIsFetchingFull] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const fetchFullData = async () => {
      if (!initialPokemon || !initialPokemon.id) return;

      // Check if we already have full data (moves or description)
      if (initialPokemon.moves && initialPokemon.moves.length > 0) {
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

  if (!initialPokemon) return null;

  // Use fullPokemon if available, otherwise fallback to initialPokemon (summary)
  const pokemon = fullPokemon || initialPokemon;

  const background = getPokemonBackground(pokemon);
  const cardData = getPokemonCardData(pokemon);
  const sprite = cardData.sprite;
  const variants = getPokemonVariants(pokemon.name, allPokemon).filter(
    (v) => v !== pokemon.name
  );
  const defenses = pokemon.types ? calculateDefenses(pokemon.types) : {};

  const formatPokedexId = (id: string | number | null) => {
    if (id && (typeof id === "number" || !isNaN(Number(id)))) {
      return `#${String(id).padStart(3, "0")}`;
    }
    return "???";
  };

  const tabs = ["OVERVIEW", "LOCATIONS", "STATS", "EVOLUTIONS", "MOVES"];

  return (
    <div
      className="fixed inset-0 z-[2000] flex animate-[fade-in_0.3s_ease-out_forwards] items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex h-[85vh] w-full max-w-[480px] animate-[scale-in_0.4s_ease-out_forwards] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1a1b20] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="z-10 flex shrink-0 items-center justify-between p-4 shadow-md"
          style={{ background }}
        >
          <h2 className="flex items-center gap-2 text-xl font-bold drop-shadow-md">
            <span className="rounded-md bg-black/30 px-2 py-1 font-mono text-sm">
              {formatPokedexId(pokemon.id)}
            </span>
            {pokemon.name}
          </h2>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-2xl transition-colors hover:bg-black/50"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative flex shrink-0 flex-col items-center border-b border-white/5 bg-[#0f1014] p-5">
          <button className="absolute top-4 right-4 rounded-md border border-white/10 bg-[#1a1b20] px-3 py-1.5 text-xs font-semibold transition-colors hover:border-blue-600">
            🔊 Cry
          </button>
          <img
            className="mb-4 h-40 w-40 animate-[float_6s_infinite] object-contain drop-shadow-xl"
            src={sprite || ""}
            alt={pokemon.name}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              {pokemon.types?.map((t) => (
                <TypeBadge key={t} type={t} />
              ))}
            </div>
            <span className="text-sm font-medium text-slate-400 italic">
              {pokemon.category}
            </span>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto bg-[#1a1b20] p-5">
          {isFetchingFull && activeTab !== "OVERVIEW" ? (
            <div className="flex h-40 items-center justify-center text-slate-400">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500"></div>
              <p className="ml-3">Fetching details...</p>
            </div>
          ) : (
            <>
              {activeTab === "OVERVIEW" && <PokemonOverview pokemon={pokemon} />}
              {activeTab === "STATS" && (
                <PokemonStats stats={pokemon.baseStats} defenses={defenses} />
              )}
              {activeTab === "MOVES" && <PokemonMoves moves={pokemon.moves} />}
              {activeTab === "LOCATIONS" && (
                <PokemonLocations locations={pokemon.locations} />
              )}
              {activeTab === "EVOLUTIONS" && (
                <PokemonEvolutions
                  pokemon={pokemon}
                  allPokemon={allPokemon}
                  onSelectPokemon={onSelectPokemon}
                  variants={variants}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonSummary;
