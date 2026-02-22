import { Pokemon } from "@/types/pokemon";
import {
  generateDualTypeGradient,
  getDualShadow,
  typeBackgrounds,
} from "@/utils/pokemonColors";
import { getSpriteUrlByName } from "@/utils/pokemonImageHelper";

const PREFIX_VARIANTS = [
  "Heat Rotom",
  "Wash Rotom",
  "Frost Rotom",
  "Fan Rotom",
  "Mow Rotom",
];

const fallbackFullDetails = (name: string): Pokemon => ({
  id: null,
  name: name || "Unknown Pokémon",
  category: "Unknown Category",
  types: [],
  description:
    "Details not available at this time. Full data for this Pokémon has not been entered yet.",
  height: "N/A",
  weight: "N/A",
  genderRatio: { m: 0, f: 0 },
  catchRate: "N/A",
  baseExp: "N/A",
  growthRate: "N/A",
  evYield: "N/A",
  heldItems: "None",
  tier: "N/A",
  abilities: { main: [], hidden: null },
  eggGroups: [],
  baseStats: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  moves: [],
  evolutions: [],
  locations: [],
  variants: [],
});

export const getPokemonFullDetails = (
  name: string,
  pokemonMap: Map<string, Pokemon>
): Pokemon & { sprite: string | null; background: string } => {
  const pokemonBase = getPokemonByName(name, pokemonMap);
  const isBasePokemon = pokemonBase && pokemonBase.id !== null;
  const variants = isBasePokemon
    ? getPokemonVariants(name, Array.from(pokemonMap.values())).filter(
        (v) => v !== name
      )
    : [];

  if (pokemonBase.id === null) {
    const fallback = fallbackFullDetails(name);
    const cardData = getPokemonCardData(name, pokemonMap);
    return {
      ...fallback,
      sprite: cardData.sprite,
      background: "#1a1b20",
      variants: [],
    };
  }

  const background = getPokemonBackground(name, pokemonMap);
  const sprite = getSpriteUrlByName(name);

  const data = {
    ...fallbackFullDetails(name),
    ...pokemonBase,
    sprite,
    background,
    variants,
    abilities: {
      ...fallbackFullDetails(name).abilities,
      ...pokemonBase.abilities,
    },
    baseStats: {
      ...fallbackFullDetails(name).baseStats,
      ...pokemonBase.baseStats,
    },
  };
  return data;
};

const getFamilyName = (name: string): string => {
  if (PREFIX_VARIANTS.includes(name)) {
    return "Rotom";
  }
  if (name.includes(" (")) {
    return name.split(" (")[0];
  }
  return name;
};

export const getAllPokemonNames = (pokedexData: Pokemon[]): string[] => {
  return pokedexData.map((p) => p.name);
};

export const getPokedexMainList = (pokedexData: Pokemon[]): string[] => {
  const familyGroups = new Map<string, string[]>();
  pokedexData.forEach((p) => {
    const family = getFamilyName(p.name);
    if (!familyGroups.has(family)) {
      familyGroups.set(family, []);
    }
    familyGroups.get(family)?.push(p.name);
  });

  const mainList: string[] = [];
  const processedFamilies = new Set<string>();
  pokedexData.forEach((p) => {
    const family = getFamilyName(p.name);
    if (processedFamilies.has(family)) return;
    const variants = familyGroups.get(family);
    if (!variants) return;

    let mainEntry = variants.find((v) => v === family);
    if (!mainEntry) {
      mainEntry = variants[0];
    }
    mainList.push(mainEntry);
    processedFamilies.add(family);
  });
  return mainList;
};

export const getPokemonVariants = (
  selectedName: string,
  pokedexData: Pokemon[]
): string[] => {
  const targetFamily = getFamilyName(selectedName);
  return pokedexData
    .filter((p) => getFamilyName(p.name) === targetFamily)
    .map((p) => p.name);
};

export const getAllPokemon = (pokedexData: Pokemon[]): Pokemon[] => {
  return pokedexData;
};

export const getPokemonByName = (
  name: string,
  pokemonMap: Map<string, Pokemon>
): Pokemon => {
  return (
    pokemonMap.get(name) || {
      id: null,
      name: name,
      types: [],
      abilities: { main: [], hidden: null },
      baseStats: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      moves: [],
      evolutions: [],
      locations: [],
    }
  );
};

export const getPokemonBackground = (
  name: string,
  pokemonMap: Map<string, Pokemon>
): string => {
  if (name in typeBackgrounds) {
    return (typeBackgrounds as Record<string, string>)[name];
  }
  const pokemon = getPokemonByName(name, pokemonMap);
  const types = pokemon.types || [];
  if (types.length >= 2) {
    return generateDualTypeGradient(types[0], types[1]);
  }
  if (types.length === 1) {
    return typeBackgrounds[types[0]] || typeBackgrounds[""];
  }
  return typeBackgrounds[""];
};

export const getPokemonShadow = (
  name: string,
  pokemonMap: Map<string, Pokemon>
): string => {
  const background = getPokemonBackground(name, pokemonMap);
  return getDualShadow(background);
};

export interface PokemonCardData extends Pokemon {
  sprite: string | null;
  background: string;
}

export const getPokemonCardData = (
  name: string,
  pokemonMap: Map<string, Pokemon>
): PokemonCardData => {
  const pokemon = getPokemonByName(name, pokemonMap);
  const background = getPokemonBackground(name, pokemonMap);
  const sprite = getSpriteUrlByName(name);
  return { ...pokemon, sprite, background };
};
