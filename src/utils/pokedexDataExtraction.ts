import { Pokemon } from "../types/pokemon";

interface PokedexSummary {
  pokemonNames: string[];
  abilityNames: string[];
  itemNames: string[];
}

export const extractPokedexData = (
  pokedexData: Pokemon[] | null
): PokedexSummary => {
  if (!pokedexData)
    return {
      pokemonNames: [],
      abilityNames: [],
      itemNames: [],
    };

  const pokemonNames = new Set<string>();
  const abilityNames = new Set<string>();
  const itemNames = new Set<string>();

  pokedexData.forEach((pokemon) => {
    if (pokemon.name) {
      pokemonNames.add(pokemon.name);
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
    pokemonNames: Array.from(pokemonNames).sort((a, b) => a.localeCompare(b)),
    abilityNames: Array.from(abilityNames).sort((a, b) => a.localeCompare(b)),
    itemNames: Array.from(itemNames).sort((a, b) => a.localeCompare(b)),
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
