import { getPokemonCardData } from "@/pages/pokedex/data/pokemonService";
import PokemonCard from "@/shared/components/PokemonCard";

function PokemonSelection({
  pokemonNames,
  selectedPokemon,
  onPokemonClick,
  pokemonMap,
}) {
  return (
    <div className="animate-[fade-in_0.4s_ease-out] space-y-4">
      <h2 className="text-center text-xl font-semibold text-slate-300">
        Select Opponent Pokémon
      </h2>
      <div className="flex flex-wrap justify-center gap-5">
        {pokemonNames.map((pokemonName) => {
          const { sprite, background } = getPokemonCardData(
            pokemonName,
            pokemonMap
          );
          return (
            <PokemonCard
              key={pokemonName}
              pokemonName={pokemonName}
              pokemonImageSrc={sprite}
              nameBackground={background}
              onClick={() => onPokemonClick(pokemonName)}
              isSelected={selectedPokemon === pokemonName}
            />
          );
        })}
      </div>
    </div>
  );
}

export default PokemonSelection;
