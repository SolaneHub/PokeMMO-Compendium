import PokemonCard from "@/components/molecules/PokemonCard";
import { Pokemon } from "@/types/pokemon";
import { getPokemonBackgroundStyle } from "@/utils/pokemonColors";
import { getSpriteUrlByName } from "@/utils/pokemonImageHelper";

interface PokemonSelectionProps {
  pokemonNames: string[];
  selectedPokemon: string | null;
  onPokemonClick: (pokemonName: string) => void;
  pokemonMap: Map<string, Pokemon>;
}

function PokemonSelection({
  pokemonNames,
  selectedPokemon,
  onPokemonClick,
  pokemonMap,
}: PokemonSelectionProps) {
  return (
    <div className="animate-[fade-in_0.4s_ease-out] space-y-4">
      <h2 className="text-center text-xl font-semibold text-white">
        Select Opponent Pokémon
      </h2>
      <div className="flex flex-wrap justify-center gap-5">
        {pokemonNames.map((pokemonName) => {
          const pokemon = pokemonMap.get(pokemonName);
          const background = getPokemonBackgroundStyle(pokemon?.types || []);
          const sprite = getSpriteUrlByName(pokemonName);

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
