import { BookOpen } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import PokemonGrid from "@/pages/pokedex/components/PokemonGrid";
import PageTitle from "@/shared/components/PageTitle";
import PokemonSummary from "@/shared/components/PokemonSummary";
import SearchBar from "@/shared/components/SearchBar";
import { usePokedexData } from "@/shared/hooks/usePokedexData";
import { getFamilyName } from "@/shared/utils/pokemonHelpers";

function PokedexPage() {
  const { fullList, isLoading } = usePokedexData();
  const [searchTerm, setSearchTerm] = useState("");
  const [deferredSearchTerm, setDeferredSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    startTransition(() => {
      setDeferredSearchTerm(value);
    });
  };

  const mainPokemonList = useMemo(() => {
    if (!fullList || fullList.length === 0) return [];

    const processedFamilies = new Set();
    const result = [];
    const familyGroups = new Map();

    fullList.forEach((p) => {
      const family = getFamilyName(p.name);
      if (!familyGroups.has(family)) {
        familyGroups.set(family, []);
      }
      familyGroups.get(family).push(p);
    });

    fullList.forEach((p) => {
      const family = getFamilyName(p.name);
      if (processedFamilies.has(family)) return;

      const variants = familyGroups.get(family);
      let mainEntry = variants.find((v) => v.name === family) ?? variants[0];

      result.push(mainEntry);
      processedFamilies.add(family);
    });

    return result;
  }, [fullList]);

  const filteredPokemon = useMemo(() => {
    if (!deferredSearchTerm) return mainPokemonList;
    return mainPokemonList.filter((p) =>
      p.name.toLowerCase().includes(deferredSearchTerm.toLowerCase())
    );
  }, [mainPokemonList, deferredSearchTerm]);

  return (
    <div className="box-border flex min-h-screen w-full flex-col items-center space-y-8 pb-24">
      <PageTitle title="PokéMMO Compendium: Pokédex" />

      <div className="flex flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-200">
          <BookOpen className="text-blue-400" size={32} />
          Pokédex
        </h1>
        <p className="text-slate-400">
          Search and view details for all Pokémon.
        </p>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search Pokémon..."
      />

      {isLoading ? (
        <div className="mt-20 flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-blue-400"></div>
          <p className="text-slate-400">Loading Pokémon data...</p>
        </div>
      ) : (
        <div
          className={`w-full transition-opacity duration-300 ${
            isPending ? "opacity-50" : "opacity-100"
          }`}
        >
          <PokemonGrid
            key={`${filteredPokemon.length}-${deferredSearchTerm}`}
            pokemonList={filteredPokemon}
            selectedPokemon={selectedPokemon}
            onSelectPokemon={setSelectedPokemon}
          />
        </div>
      )}

      {selectedPokemon && (
        <PokemonSummary
          key={selectedPokemon.name}
          pokemon={selectedPokemon}
          allPokemon={fullList}
          onClose={() => setSelectedPokemon(null)}
          onSelectPokemon={setSelectedPokemon}
        />
      )}
    </div>
  );
}

export default PokedexPage;
