// src/shared/utils/pokedexDataExtraction.js

// This function would be responsible for fetching the pokedex data.
// In a real application, you might fetch this from an API or a pre-processed file.
// For now, we'll assume `pokedexData` is imported directly.
import pokedexData from "@/data/pokedex.json";

export const extractPokedexData = () => {
  const pokemonNames = new Set();
  const moveNames = new Set();
  const abilityNames = new Set();

  pokedexData.forEach((pokemon) => {
    pokemonNames.add(pokemon.name);

    if (pokemon.abilities) {
      if (pokemon.abilities.main) {
        pokemon.abilities.main.forEach((ability) => abilityNames.add(ability));
      }
      if (pokemon.abilities.hidden) {
        abilityNames.add(pokemon.abilities.hidden);
      }
    }

    if (pokemon.moves) {
      pokemon.moves.forEach((move) => moveNames.add(move.name));
    }
  });

  // For items, we need to read the public/items directory.
  // This is typically not possible directly from client-side JavaScript due to security restrictions.
  // In a local development environment with Node.js backend, you would make an API call
  // to list files in that directory. For now, I'll hardcode the known items based on the file structure.
  // This part would ideally be dynamic if the backend was more integrated for client-side use.

  const itemNames = new Set([
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
    // Add more items as needed, or implement a backend endpoint to list them dynamically
  ]);

  return {
    pokemonNames: Array.from(pokemonNames).sort(),
    moveNames: Array.from(moveNames).sort(),
    abilityNames: Array.from(abilityNames).sort(),
    itemNames: Array.from(itemNames).sort(),
  };
};
