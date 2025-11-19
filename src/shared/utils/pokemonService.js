import pokedex from "@/shared/utils/pokedex.json";

import {
  generateDualTypeGradient,
  getDualShadow,
  typeBackgrounds,
} from "./pokemonColors";

// * Create a Map for O(1) access speed instead of using .find() which is O(n).
// * This significantly improves performance when looking up Pokemon by name.
const pokemonMap = new Map(pokedex.map((p) => [p.name, p]));

/**
 * ? Retrieves the complete Pokemon object given its name.
 * @param {string} name
 */
export const getPokemonByName = (name) => {
  return (
    pokemonMap.get(name) || {
      id: null,
      name: name,
      types: [],
      sprite: null,
    }
  );
};

/**
 * ? Returns the CSS background (gradient or flat color) for a Pokemon.
 * * Automatically handles 1 or 2 types and specific name overrides.
 */
export const getPokemonBackground = (name) => {
  // ! 1. Check for direct name overrides first (e.g. "Arceus (Fire)")
  if (typeBackgrounds[name]) {
    return typeBackgrounds[name];
  }

  const pokemon = getPokemonByName(name);
  const types = pokemon.types || [];

  // * 2. If dual type, generate a double gradient
  if (types.length >= 2) {
    return generateDualTypeGradient(types[0], types[1]);
  }

  // * 3. If single type, return that type's background
  if (types.length === 1) {
    return typeBackgrounds[types[0]] || typeBackgrounds[""];
  }

  // ! 4. Fallback if no types found
  return typeBackgrounds[""];
};

/**
 * ? Returns the colored shadow based on the Pokemon's type configuration.
 */
export const getPokemonShadow = (name) => {
  const background = getPokemonBackground(name);
  return getDualShadow(background);
};

/**
 * * Main Helper for Cards: Returns all data needed for the UI in a single call.
 * ? Combines biological data (sprite, types) with styling data (background).
 */
export const getPokemonCardData = (name) => {
  const pokemon = getPokemonByName(name);
  const background = getPokemonBackground(name);

  return {
    ...pokemon, // id, name, types, sprite
    background,
  };
};
