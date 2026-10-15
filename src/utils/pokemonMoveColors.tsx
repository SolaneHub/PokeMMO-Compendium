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

// Pre-computed lowercase map for O(1) move gradient lookups
const LOWERCASE_MOVE_GRADIENT_MAP = new Map<string, string>();
for (const [moveName, moveType] of Object.entries(moveTypeMap)) {
  const gradient =
    moveType && moveType in typeBackgrounds
      ? (typeBackgrounds as Record<string, string>)[moveType] ||
        typeBackgrounds[""]
      : typeBackgrounds[""];
  LOWERCASE_MOVE_GRADIENT_MAP.set(moveName.toLowerCase(), gradient);
}

// Pre-sorted move names (longest first)
const SORTED_MOVE_NAMES = Object.keys(moveTypeMap).sort(
  (a, b) => b.length - a.length
);

// Cache for compiled pattern and color lookup map based on pokemonColorMap
interface CachedColorData {
  pattern: RegExp;
  colorLookupMap: Map<string, string>;
}

const colorDataCache = new WeakMap<Record<string, string>, CachedColorData>();
// Fallback cache for empty or non-object references if needed
let lastEmptyMapCache: CachedColorData | null = null;

function getColorData(
  pokemonColorMap: Record<string, string>
): CachedColorData {
  const isObject = pokemonColorMap && typeof pokemonColorMap === "object";
  const isEmpty = isObject && Object.keys(pokemonColorMap).length === 0;

  if (isEmpty && lastEmptyMapCache) {
    return lastEmptyMapCache;
  }

  if (isObject) {
    const cached = colorDataCache.get(pokemonColorMap);
    if (cached) {
      return cached;
    }
  }

  const pokemonNames = Object.keys(pokemonColorMap || {}).sort(
    (a, b) => b.length - a.length
  );

  const allNames = [...SORTED_MOVE_NAMES, ...pokemonNames];
  // Sort all names by length descending to match longest tokens first
  allNames.sort((a, b) => b.length - a.length);

  const escapedNames = allNames
    .map((name) => name.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`))
    .join("|");

  const pattern = new RegExp(String.raw`\b(${escapedNames})\b`, "gi");

  // Create unified O(1) lookup map (lowercase name -> gradient)
  // Moves take priority, followed by Pokémon
  const colorLookupMap = new Map<string, string>();
  for (const [name, gradient] of Object.entries(pokemonColorMap || {})) {
    colorLookupMap.set(name.toLowerCase(), gradient);
  }
  for (const [
    lowerMoveName,
    gradient,
  ] of LOWERCASE_MOVE_GRADIENT_MAP.entries()) {
    colorLookupMap.set(lowerMoveName, gradient);
  }

  const result: CachedColorData = { pattern, colorLookupMap };

  if (isObject) {
    colorDataCache.set(pokemonColorMap, result);
    if (isEmpty) {
      lastEmptyMapCache = result;
    }
  }

  return result;
}

export function initializePokemonColorMap(pokedexData: Pokemon[]) {
  const newPokemonColorMap: Record<string, string> = {};
  if (!pokedexData || pokedexData.length === 0) {
    return newPokemonColorMap;
  }
  pokedexData.forEach((pokemon) => {
    const types = pokemon.types || [];
    if (types.length >= 2) {
      const type1 = types[0];
      const type2 = types[1];
      if (type1 && type2) {
        newPokemonColorMap[pokemon.name] = generateDualTypeGradient(
          type1,
          type2
        );
      }
    } else if (types.length === 1) {
      const type = types[0];
      if (type) {
        newPokemonColorMap[pokemon.name] =
          (typeBackgrounds as Record<string, string>)[type] || "#999999";
      }
    } else {
      newPokemonColorMap[pokemon.name] = "#999999";
    }
  });
  return newPokemonColorMap;
}

export const getMoveGradient = (moveName: string): string => {
  const moveType = moveTypeMap[moveName];
  if (moveType && moveType in typeBackgrounds) {
    return (
      (typeBackgrounds as Record<string, string>)[moveType] ||
      typeBackgrounds[""]
    );
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

  const { pattern, colorLookupMap } = getColorData(pokemonColorMap);

  const parts = text.split(pattern);
  if (parts.length <= 1) return text;

  return (
    <>
      {parts.map((part, i) => {
        // If it's a match (even indices are non-matches, odd indices are matches because of the capturing group in split)
        // Actually, split with capturing group returns [non-match, match, non-match, match, ...]
        if (i % 2 === 1) {
          const gradient = colorLookupMap.get(part.toLowerCase());

          if (gradient) {
            const isGradient = gradient.startsWith("linear-gradient");
            const style: React.CSSProperties = isGradient
              ? {
                  backgroundImage: gradient,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  fontWeight: "bold",
                }
              : {
                  color: gradient,
                  fontWeight: "bold",
                };

            return (
              <span key={`${part}-${i}`} style={style}>
                {part}
              </span>
            );
          }
        }
        return <React.Fragment key={`${part}-${i}`}>{part}</React.Fragment>;
      })}
    </>
  );
};
