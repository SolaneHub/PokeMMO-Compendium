import { BookOpen } from "lucide-react";
import { useState } from "react";

import PokemonGrid from "@/pages/pokedex/components/PokemonGrid";
import { getPokedexMainList } from "@/pages/pokedex/data/pokemonService";
import PageTitle from "@/shared/components/PageTitle";
import PokemonSummary from "@/shared/components/PokemonSummary";
import SearchBar from "@/shared/components/SearchBar";

const MAIN_POKEMON_LIST = getPokedexMainList();

function PokedexPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const filteredPokemon = !searchTerm
    ? MAIN_POKEMON_LIST
    : MAIN_POKEMON_LIST.filter((name) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="box-border flex min-h-screen w-full flex-col items-center space-y-8 pb-24">
      <PageTitle title="PokéMMO Compendium: Pokédex" />

      {/* Header */}
      <div className="flex flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <BookOpen className="text-blue-500" size={32} />
          Pokédex
        </h1>
        <p className="text-slate-400">
          Search and view details for all Pokémon.
        </p>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search Pokémon..."
      />

      <PokemonGrid
        pokemonList={filteredPokemon}
        selectedPokemon={selectedPokemon}
        onSelectPokemon={setSelectedPokemon}
      />

      {selectedPokemon && (
        <PokemonSummary
          pokemonName={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          onSelectPokemon={setSelectedPokemon}
        />
      )}
    </div>
  );
}

export default PokedexPage;
