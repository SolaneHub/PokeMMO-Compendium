import { BookOpen } from "lucide-react";
import { useState } from "react";

import {
  getPokedexMainList,
  getPokemonCardData,
} from "@/pages/pokedex/data/pokemonService";
import PageTitle from "@/shared/components/PageTitle";
import PokemonCard from "@/shared/components/PokemonCard";
import PokemonSummary from "@/shared/components/PokemonSummary";

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
    <div className="flex flex-col items-center w-full pb-24 box-border min-h-screen space-y-8">
      <PageTitle title="PokéMMO Compendium: Pokédex" />

      {/* Header */}
      <div className="flex flex-col items-center space-y-2 text-center">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BookOpen className="text-blue-500" size={32} />
          Pokédex
        </h1>
        <p className="text-slate-400">
          Search and view details for all Pokémon.
        </p>
      </div>

      <input
        type="text"
        placeholder="Search Pokémon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-[400px] bg-slate-800 border-2 border-slate-700 rounded-full text-slate-200 text-base outline-none px-5 py-3 mb-8 transition-all duration-200 focus:border-blue-500 focus:shadow-[0_0_8px_rgba(59,130,246,0.4)] placeholder:text-slate-500"
      />

      <div className="flex flex-wrap justify-center gap-5 w-full max-w-[1400px]">
        {filteredPokemon.map((pokemonName, index) => {
          const { sprite, background } = getPokemonCardData(pokemonName);

          return (
            <PokemonCard
              key={`${pokemonName}-${index}`}
              pokemonName={pokemonName}
              pokemonImageSrc={sprite}
              nameBackground={background}
              onClick={() => setSelectedPokemon(pokemonName)}
              isSelected={selectedPokemon === pokemonName}
            />
          );
        })}

        {filteredPokemon.length === 0 && (
          <p className="text-slate-400 text-xl mt-10 text-center">
            No Pokémon found.
          </p>
        )}
      </div>

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
