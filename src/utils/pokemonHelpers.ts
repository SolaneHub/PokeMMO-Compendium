import { Pokemon } from "../types/pokemon";
import { generateDualTypeGradient, typeBackgrounds } from "./pokemonColors";
import { getSpriteUrlByName } from "./pokemonImageHelper";

const PREFIX_VARIANTS = [
  "Heat Rotom",
  "Wash Rotom",
  "Frost Rotom",
  "Fan Rotom",
  "Mow Rotom",
];

export const getFamilyName = (name: string): string => {
  if (PREFIX_VARIANTS.includes(name)) {
    return "Rotom";
  }
  if (name.includes(" (")) {
    return name.split(" (")[0];
  }
  return name;
};

export const getPokemonBackground = (
  pokemon: Pokemon | null | undefined
): string => {
  if (!pokemon) return typeBackgrounds[""];
  if (pokemon.name in typeBackgrounds) {
    return (typeBackgrounds as Record<string, string>)[pokemon.name];
  }
  const types = pokemon.types || [];
  if (types.length >= 2) {
    return generateDualTypeGradient(types[0], types[1]);
  }
  if (types.length === 1) {
    return typeBackgrounds[types[0]] || typeBackgrounds[""];
  }
  return typeBackgrounds[""];
};

export const getPokemonCardData = (pokemon: Pokemon | null | undefined) => {
  if (!pokemon) return { sprite: null, background: typeBackgrounds[""] };
  const background = getPokemonBackground(pokemon);
  const sprite = getSpriteUrlByName(pokemon.name);
  return { ...pokemon, sprite, background };
};

export const getPokemonVariants = (
  selectedName: string,
  allPokemon: Pokemon[]
): string[] => {
  if (!allPokemon) return [];
  const targetFamily = getFamilyName(selectedName);
  return allPokemon
    .filter((p) => getFamilyName(p.name) === targetFamily)
    .map((p) => p.name);
};
