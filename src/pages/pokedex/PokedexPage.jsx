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

      <input
        type="text"
        placeholder="Search Pokémon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-8 w-full max-w-[400px] rounded-full border-2 border-slate-700 bg-slate-800 px-5 py-3 text-base text-slate-200 transition-all duration-200 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:shadow-[0_0_8px_rgba(59,130,246,0.4)]"
      />

      <div className="flex w-full max-w-[1400px] flex-wrap justify-center gap-5">
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
          <p className="mt-10 text-center text-xl text-slate-400">
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
