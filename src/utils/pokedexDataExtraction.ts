import { Pokemon } from "../types/pokemon";

interface PokedexSummary {
  pokemonNames: string[];
  moveNames: string[];
  abilityNames: string[];
  itemNames: string[];
  allPokemonData: { name: string; catchRate: string | number }[];
}

export const extractPokedexData = (
  pokedexData: Pokemon[] | null
): PokedexSummary => {
  if (!pokedexData)
    return {
      pokemonNames: [],
      moveNames: [],
      abilityNames: [],
      itemNames: [],
      allPokemonData: [],
    };

  const pokemonNames = new Set<string>();
  const moveNames = new Set<string>();
  const abilityNames = new Set<string>();
  const pokemonCatchRates: { name: string; catchRate: string | number }[] = [];

  pokedexData.forEach((pokemon) => {
    if (pokemon.name) {
      pokemonNames.add(pokemon.name);
    }
    if (pokemon.name && pokemon.catchRate !== undefined) {
      pokemonCatchRates.push({
        name: pokemon.name,
        catchRate: pokemon.catchRate,
      });
    }
    if (pokemon.abilities) {
      if (pokemon.abilities.main) {
        pokemon.abilities.main.forEach((ability) => abilityNames.add(ability));
      }
      if (pokemon.abilities.hidden) {
        abilityNames.add(pokemon.abilities.hidden);
      }
    }
    if (pokemon.moves) {
      pokemon.moves.forEach((move) => {
        if (move?.name) {
          moveNames.add(move.name);
        }
      });
    }
  });

  const itemNames = new Set<string>([
    "Assault Vest",
    "Cheri Berry",
    "Choice Band",
    "Choice Scarf",
    "Choice Specs",
    "Focus Sash",
    "Ground Gem",
    "Heat Rock",
    "Life Orb",
    "Light Clay",
    "Mystic Water",
    "Rocky Helmet",
    "Water Gem",
  ]);

  return {
    pokemonNames: Array.from(pokemonNames).sort(),
    moveNames: Array.from(moveNames).sort(),
    abilityNames: Array.from(abilityNames).sort(),
    itemNames: Array.from(itemNames).sort(),
    allPokemonData: pokemonCatchRates.sort((a, b) =>
      a.name.localeCompare(b.name)
    ),
  };
};

export const getPokemonIdByName = (
  name: string,
  pokedexData: Pokemon[] | null
): string | number | null => {
  if (!pokedexData) return null;
  const pokemon = pokedexData.find((p) => p.name === name);
  return pokemon ? pokemon.id : null;
};
