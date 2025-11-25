import pokedex from "@/data/pokedex.json";

import { generateDualTypeGradient, typeBackgrounds } from "./pokemonColors";

// * Mapping specific Move Names to their Elemental Type.
export const moveTypeMap = {
  Explosion: "Normal",
  Protect: "Normal",
  "Shell Smash": "Normal",
  Softboiled: "Normal",
  "Swords Dance": "Normal",

  Flamethrower: "Fire",
  "Sunny Day": "Fire",

  "Energy Ball": "Grass",
  "Energy Root": "Grass",
  "Hidden Power Grass": "Grass",

  Scald: "Water",
  Surf: "Water",

  Thunder: "Electric",
  "Thunder Punch": "Electric",
  Thunderbolt: "Electric",
  "Shock Wave": "Electric",

  "Hidden Power Ice": "Ice",
  "Ice Beam": "Ice",
  "Ice Punch": "Ice",
  "Icicle Spear": "Ice",

  "Belly Drum": "Fighting",
  "Close Combat": "Fighting",
  "Drain Punch": "Fighting",
  "Dynamic Punch": "Fighting",
  "Hidden Power Fighting": "Fighting",

  Toxic: "Poison",

  Earthquake: "Ground",
  "Earth Power": "Ground",

  "Calm Mind": "Psychic",
  "Nasty Plot": "Psychic",
  Trick: "Psychic",

  "Stealth Rock": "Rock",
  "Stone Edge": "Rock",

  "Shadow Ball": "Ghost",

  "Dragon Dance": "Dragon",
  "Dragon Pulse": "Dragon",
  "Dual Chop": "Dragon",

  Crunch: "Dark",
  "Beat Up": "Dark",
  "Dark Pulse": "Dark",
  "Hone Claws": "Dark",
  "Sucker Punch": "Dark",

  "Iron Head": "Steel",

  "X Speed": "Ice",
};

// ? Map to store the calculated text gradient style for each Pokemon.
export const pokemonColorMap = {};

// * Iterate over the JSON to pre-calculate colors.
pokedex.forEach((pokemon) => {
  const types = pokemon.types || [];

  if (types.length >= 2) {
    // * Dual-type Pokemon get a gradient text color
    pokemonColorMap[pokemon.name] = generateDualTypeGradient(
      types[0],
      types[1]
    );
  } else if (types.length === 1) {
    // * Single-type Pokemon get their type's flat color
    pokemonColorMap[pokemon.name] = typeBackgrounds[types[0]] || "#999999";
  } else {
    // ! Default color if no type is specified
    pokemonColorMap[pokemon.name] = "#999999";
  }
});

// ? Function to get the gradient style for a specific Move
export const getMoveGradient = (moveName) => {
  const moveType = moveTypeMap[moveName];
  if (moveType && typeBackgrounds[moveType]) {
    return typeBackgrounds[moveType];
  }
  return typeBackgrounds[""]; // ! Default if not found
};

// ? Function to get the gradient style for a specific Pokemon
export const getPokemonGradient = (pokemonName) => {
  return pokemonColorMap[pokemonName] || typeBackgrounds[""];
};

// * Main function to colorize moves and pokemon names within a text string.
export const colorTextElements = (text) => {
  if (!text) return text;

  let result = text;

  // * 1. Color Moves
  // ! Sort by length descending to prevent partial replacements (e.g., "Ice" vs "Ice Beam")
  const moveNames = Object.keys(moveTypeMap).sort(
    (a, b) => b.length - a.length
  );
  moveNames.forEach((move) => {
    const regex = new RegExp(`\\b${move}\\b`, "gi");
    const gradient = getMoveGradient(move);

    result = result.replace(
      regex,
      (match) =>
        `<span style="background: ${gradient}; background-clip: text; -webkit-background-clip: text; color: transparent; font-weight: bold;">${match}</span>`
    );
  });

  // * 2. Color Pokemon Names
  // ! Sort by length descending for the same reason as moves
  const pokemonNames = Object.keys(pokemonColorMap).sort(
    (a, b) => b.length - a.length
  );
  pokemonNames.forEach((pokemon) => {
    const regex = new RegExp(`\\b${pokemon}\\b`, "gi");
    const gradient = pokemonColorMap[pokemon];

    result = result.replace(
      regex,
      (match) =>
        `<span style="background: ${gradient}; background-clip: text; -webkit-background-clip: text; color: transparent; font-weight: bold;">${match}</span>`
    );
  });

  return result;
};
