import { Pokemon } from "../types/pokemon";

interface PokedexSummary {
  pokemonNames: string[];
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
      abilityNames: [],
      itemNames: [],
      allPokemonData: [],
    };

  const pokemonNames = new Set<string>();
  const abilityNames = new Set<string>();
  const itemNames = new Set<string>();
  const pokemonCatchRates: { name: string; catchRate: string | number }[] = [];

  pokedexData.forEach((pokemon) => {
    if (pokemon.name) {
      pokemonNames.add(pokemon.name);
    }
    if (
      pokemon.name &&
      pokemon.catchRate !== undefined &&
      pokemon.catchRate !== null
    ) {
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
    if (pokemon.heldItems) {
      if (Array.isArray(pokemon.heldItems)) {
        pokemon.heldItems.forEach((item) => itemNames.add(item));
      } else if (typeof pokemon.heldItems === "object") {
        Object.keys(pokemon.heldItems).forEach((item) => itemNames.add(item));
      } else if (
        typeof pokemon.heldItems === "string" &&
        pokemon.heldItems !== "None"
      ) {
        itemNames.add(pokemon.heldItems);
      }
    }
  });

  // Keep some common items even if not in pokedex yet
  const commonItems = [
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
  ];
  commonItems.forEach((item) => itemNames.add(item));

  return {
    pokemonNames: Array.from(pokemonNames).sort(),
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
