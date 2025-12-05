import "./PokedexPage.css";

import { useState } from "react";

import {
  getPokedexMainList,
  getPokemonCardData,
} from "@/pages/pokedex/data/pokemonService";
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
    <div className="pokedex-container">
      <title>Compendium: Pokédex</title>

      <input
        type="text"
        placeholder="Search Pokémon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pokedex-search-input"
      />

      <div className="pokemon-cards-display">
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
          <p className="no-results">No Pokémon found.</p>
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
