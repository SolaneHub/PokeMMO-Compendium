import React from "react";

import { Pokemon } from "@/types/pokemon";
import {
  generateDualTypeGradient,
  typeBackgrounds,
} from "@/utils/pokemonColors";

export const moveTypeMap: Record<string, string> = {
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

export function initializePokemonColorMap(pokedexData: Pokemon[]) {
  const newPokemonColorMap: Record<string, string> = {};
  if (!pokedexData || pokedexData.length === 0) {
    return newPokemonColorMap;
  }
  pokedexData.forEach((pokemon) => {
    const types = pokemon.types || [];
    if (types.length >= 2) {
      newPokemonColorMap[pokemon.name] = generateDualTypeGradient(
        types[0],
        types[1]
      );
    } else if (types.length === 1) {
      newPokemonColorMap[pokemon.name] =
        (typeBackgrounds as Record<string, string>)[types[0]] || "#999999";
    } else {
      newPokemonColorMap[pokemon.name] = "#999999";
    }
  });
  return newPokemonColorMap;
}

export const getMoveGradient = (moveName: string): string => {
  const moveType = moveTypeMap[moveName];
  if (moveType && moveType in typeBackgrounds) {
    return (typeBackgrounds as Record<string, string>)[moveType];
  }
  return typeBackgrounds[""];
};

export const getPokemonGradient = (
  pokemonName: string,
  pokemonColorMap: Record<string, string>
): string => {
  return pokemonColorMap[pokemonName] || typeBackgrounds[""];
};

/**
 * Renders text with moves and pokemon names colored using React nodes instead of dangerouslySetInnerHTML.
 */
export const renderColoredText = (
  text: string,
  pokemonColorMap: Record<string, string>
): React.ReactNode => {
  if (!text) return text;

  const moveNames = Object.keys(moveTypeMap).sort(
    (a, b) => b.length - a.length
  );
  const pokemonNames = Object.keys(pokemonColorMap).sort(
    (a, b) => b.length - a.length
  );

  // Combine all names into one regex with word boundaries
  const allNames = [...moveNames, ...pokemonNames];
  if (allNames.length === 0) return text;

  const pattern = new RegExp(
    `\\b(${allNames
      .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")})\\b`,
    "gi"
  );

  const parts = text.split(pattern);
  if (parts.length <= 1) return text;

  return (
    <>
      {parts.map((part, i) => {
        // If it's a match (even indices are non-matches, odd indices are matches because of the capturing group in split)
        // Actually, split with capturing group returns [non-match, match, non-match, match, ...]
        if (i % 2 === 1) {
          // Find if it's a move or a pokemon
          let gradient = "";
          // Check moveNames first (case-insensitive)
          const matchedMove = moveNames.find(
            (m) => m.toLowerCase() === part.toLowerCase()
          );
          if (matchedMove) {
            gradient = getMoveGradient(matchedMove);
          } else {
            // Check pokemonNames
            const matchedPokemon = pokemonNames.find(
              (p) => p.toLowerCase() === part.toLowerCase()
            );
            if (matchedPokemon) {
              gradient = pokemonColorMap[matchedPokemon];
            }
          }

          if (gradient) {
            return (
              <span
                key={i}
                style={{
                  background: gradient,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  fontWeight: "bold",
                }}
              >
                {part}
              </span>
            );
          }
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
};
