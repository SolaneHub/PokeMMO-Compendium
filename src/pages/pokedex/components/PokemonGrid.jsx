import { getPokemonCardData } from "@/pages/pokedex/data/pokemonService";
import PokemonCard from "@/shared/components/PokemonCard";

const PokemonGrid = ({ pokemonList, selectedPokemon, onSelectPokemon }) => {
  if (pokemonList.length === 0) {
    return (
      <p className="mt-10 text-center text-xl text-slate-400">
        No Pokémon found.
      </p>
    );
  }

  return (
    <div className="flex w-full max-w-[1400px] flex-wrap justify-center gap-5">
      {pokemonList.map((pokemonName, index) => {
        const { sprite, background } = getPokemonCardData(pokemonName);

        return (
          <PokemonCard
            key={`${pokemonName}-${index}`}
            pokemonName={pokemonName}
            pokemonImageSrc={sprite}
            nameBackground={background}
            onClick={() => onSelectPokemon(pokemonName)}
            isSelected={selectedPokemon === pokemonName}
          />
        );
      })}
    </div>
  );
};
export default PokemonGrid;
