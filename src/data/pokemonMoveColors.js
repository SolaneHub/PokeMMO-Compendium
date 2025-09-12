import { typeBackgrounds, generateDualTypeGradient } from "./pokemonColors";
import { pokemonData } from "./pokemonData";

export const moveTypeMap = {
  Explosion: "Normale",
  Protect: "Normale",
  "Shell Smash": "Normale",
  Softboiled: "Normale",
  "Swords Dance": "Normale",

  Flamethrower: "Fuoco",
  "Sunny Day": "Fuoco",

  "Energy Ball": "Erba",
  "Energy Root": "Erba",
  "Hidden Power Grass": "Erba",

  Scald: "Acqua",
  Surf: "Acqua",

  Thunder: "Elettro",
  "Thunder Punch": "Elettro",
  Thunderbolt: "Elettro",
  "Shock Wave": "Elettro",

  "Hidden Power Ice": "Ghiaccio",
  "Ice Beam": "Ghiaccio",
  "Ice Punch": "Ghiaccio",
  "Icicle Spear": "Ghiaccio",

  "Belly Drum": "Lotta",
  "Close Combat": "Lotta",
  "Drain Punch": "Lotta",
  "Dynamic Punch": "Lotta",
  "Hidden Power Fighting": "Lotta",

  Toxic: "Veleno",

  Earthquake: "Terra",
  "Earth Power": "Terra",

  "Calm Mind": "Psico",
  "Nasty Plot": "Psico",
  Trick: "Psico",

  "Stealth Rock": "Roccia",
  "Stone Edge": "Roccia",

  "Shadow Ball": "Spettro",

  "Dragon Dance": "Drago",
  "Dragon Pulse": "Drago",
  "Dual Chop": "Drago",

  Crunch: "Buio",
  "Beat Up": "Buio",
  "Dark Pulse": "Buio",
  "Hone Claws": "Buio",

  "Iron Head": "Acciaio",

  "X Speed": "Ghiaccio",
};

// Create a map of Pokémon names to their text color style
export const pokemonColorMap = {};
pokemonData.forEach((pokemon) => {
  if (pokemon.types.length >= 2) {
    // Dual-type Pokémon get a gradient text color
    pokemonColorMap[pokemon.name] = generateDualTypeGradient(
      pokemon.types[0],
      pokemon.types[1]
    );
  } else if (pokemon.types.length === 1) {
    // Single-type Pokémon get their type's color
    pokemonColorMap[pokemon.name] =
      typeBackgrounds[pokemon.types[0]] || "#999999";
  } else {
    // Default color if no type is specified
    pokemonColorMap[pokemon.name] = "#999999";
  }
});

// Function to get the gradient for a move
export const getMoveGradient = (moveName) => {
  const moveType = moveTypeMap[moveName];
  if (moveType && typeBackgrounds[moveType]) {
    return typeBackgrounds[moveType];
  }
  return typeBackgrounds[""]; // Default gradient if move not found
};

// Function to get the gradient style for a Pokémon
export const getPokemonGradient = (pokemonName) => {
  return pokemonColorMap[pokemonName] || typeBackgrounds[""];
};

// Function to color both moves and Pokémon in text with gradients
export const colorTextElements = (text) => {
  if (!text) return text;

  let result = text;

  // First color move names (prioritize longer names first)
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

  // Then color Pokémon names (prioritize longer names first)
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
