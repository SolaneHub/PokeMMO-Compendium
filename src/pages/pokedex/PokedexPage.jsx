import "./PokedexPage.css";

import { useMemo, useState } from "react";

import {
  getPokedexMainList,
  getPokemonCardData,
} from "@/pages/pokedex/data/pokemonService";
import PokemonCard from "@/shared/components/PokemonCard";
import PokemonSummary from "@/shared/components/PokemonSummary";

function PokedexPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // ? Tracks the Pokemon selected to open the details modal
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // * 1. Retrieve the main list (only base forms/family heads)
  const mainPokemonList = useMemo(() => getPokedexMainList(), []);

  // * 2. Search bar filter logic
  const filteredPokemon = useMemo(() => {
    if (!searchTerm) return mainPokemonList;
    return mainPokemonList.filter((name) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [mainPokemonList, searchTerm]);

  // * 3. Modal Open/Close handlers
  const handleCardClick = (pokemonName) => {
    setSelectedPokemon(pokemonName);
  };

  const closeModal = () => {
    setSelectedPokemon(null);
  };

  return (
    <div className="pokedex-container">
      {/* --- Search Bar --- */}
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pokedex-search-input"
      />

      {/* --- Card Grid --- */}
      <div className="pokemon-cards-display">
        {filteredPokemon.map((pokemonName, index) => {
          // ? Fetch graphic data (sprite, background) from the service
          const { sprite, background } = getPokemonCardData(pokemonName);

          return (
            <PokemonCard
              key={`${pokemonName}-${index}`}
              pokemonName={pokemonName}
              pokemonImageSrc={sprite}
              nameBackground={background}
              onClick={() => handleCardClick(pokemonName)}
              isSelected={selectedPokemon === pokemonName}
            />
          );
        })}

        {filteredPokemon.length === 0 && (
          <p className="no-results">No Pokémon found.</p>
        )}
      </div>

      {/* --- Details Modal --- */}
      {selectedPokemon && (
        <PokemonSummary
          pokemonName={selectedPokemon}
          onClose={closeModal}
          onSelectPokemon={handleCardClick}
        />
      )}
    </div>
  );
}

export default PokedexPage;
