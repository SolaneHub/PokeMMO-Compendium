import { BookOpen } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import PageLayout from "@/components/PageLayout";
import PokemonGrid from "@/components/PokemonGrid";
import PokemonSummary from "@/components/PokemonSummary";
import SearchBar from "@/components/ui/SearchBar";
import { usePokedexContext } from "@/context/PokedexContext";
import { Pokemon } from "@/types/pokemon";
import { FEATURE_CONFIG } from "@/utils/featureConfig";
import { getPokedexMainList } from "@/utils/pokemonHelpers";

function PokedexPage() {
  const { fullList, isLoading } = usePokedexContext();
  const accentColor = FEATURE_CONFIG["pokedex"].color;
  const [searchTerm, setSearchTerm] = useState("");
  const [deferredSearchTerm, setDeferredSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    startTransition(() => {
      setDeferredSearchTerm(value);
    });
  };

  const mainPokemonList = useMemo(() => {
    return getPokedexMainList(fullList || []);
  }, [fullList]);

  const filteredPokemon = useMemo(() => {
    if (!deferredSearchTerm) return mainPokemonList;
    return mainPokemonList.filter((p) =>
      p.name.toLowerCase().includes(deferredSearchTerm.toLowerCase())
    );
  }, [mainPokemonList, deferredSearchTerm]);

  return (
    <PageLayout title="Pokédex">
      <div className="flex w-full flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-200">
          <BookOpen style={{ color: accentColor }} size={32} />
          Pokédex
        </h1>
        <p className="text-slate-400">
          Search and view details for all Pokémon.
        </p>
      </div>

      <div className="flex w-full justify-center">
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search Pokémon..."
          ariaLabel="Search Pokémon"
          className="max-w-2xl"
        />
      </div>

      {isLoading ? (
        <div className="mt-20 flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-blue-400"></div>
          <p className="text-slate-400">Loading Pokémon data...</p>
        </div>
      ) : (
        <div className="w-full">
          <PokemonGrid
            key={`${filteredPokemon.length}-${deferredSearchTerm}`}
            pokemonList={filteredPokemon}
            selectedPokemon={selectedPokemon}
            onSelectPokemon={setSelectedPokemon}
            isPending={isPending}
          />
        </div>
      )}

      {selectedPokemon && (
        <PokemonSummary
          key={selectedPokemon.name}
          pokemon={selectedPokemon}
          allPokemon={filteredPokemon}
          onClose={() => setSelectedPokemon(null)}
          onSelectPokemon={setSelectedPokemon}
        />
      )}
    </PageLayout>
  );
}

export default PokedexPage;
