import pokedex from "@/data/pokedex.json";

import { generateDualTypeGradient, typeBackgrounds } from "./pokemonColors";

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

export const pokemonColorMap = {};

pokedex.forEach((pokemon) => {
  const types = pokemon.types || [];

  if (types.length >= 2) {
    pokemonColorMap[pokemon.name] = generateDualTypeGradient(
      types[0],
      types[1]
    );
  } else if (types.length === 1) {
    pokemonColorMap[pokemon.name] = typeBackgrounds[types[0]] || "#999999";
  } else {
    pokemonColorMap[pokemon.name] = "#999999";
  }
});

export const getMoveGradient = (moveName) => {
  const moveType = moveTypeMap[moveName];
  if (moveType && typeBackgrounds[moveType]) {
    return typeBackgrounds[moveType];
  }
  return typeBackgrounds[""];
};

export const getPokemonGradient = (pokemonName) => {
  return pokemonColorMap[pokemonName] || typeBackgrounds[""];
};

export const colorTextElements = (text) => {
  if (!text) return text;

  let result = text;

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
