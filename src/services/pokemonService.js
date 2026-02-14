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
const fallbackFullDetails = (name) => ({
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
  baseStats: {},
  moves: [],
  evolutions: [],
  locations: [],
  variants: [],
});
export const getPokemonFullDetails = (name, pokemonMap) => {
  const pokemonBase = getPokemonByName(name, pokemonMap);
  const isBasePokemon = pokemonBase && pokemonBase.id !== null;
  const variants = isBasePokemon
    ? getPokemonVariants(name, Array.from(pokemonMap.values())).filter(
        (v) => v !== name
      )
    : [];
  if (!pokemonBase) {
    const fallback = fallbackFullDetails(name);
    return {
      ...fallback,
      sprite: getPokemonCardData(name, pokemonMap).sprite,
      background: "#1a1b20",
    };
  }
  const background = getPokemonBackground(name, pokemonMap);
  const sprite =
    pokemonBase.sprite || getPokemonCardData(name, pokemonMap).sprite;
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
const getFamilyName = (name) => {
  if (PREFIX_VARIANTS.includes(name)) {
    return "Rotom";
  }
  if (name.includes(" (")) {
    return name.split(" (")[0];
  }
  return name;
};
export const getAllPokemonNames = (pokedexData) => {
  return pokedexData.map((p) => p.name);
};
export const getPokedexMainList = (pokedexData) => {
  const familyGroups = new Map();
  pokedexData.forEach((p) => {
    const family = getFamilyName(p.name);
    if (!familyGroups.has(family)) {
      familyGroups.set(family, []);
    }
    familyGroups.get(family).push(p.name);
  });
  const mainList = [];
  const processedFamilies = new Set();
  pokedexData.forEach((p) => {
    const family = getFamilyName(p.name);
    if (processedFamilies.has(family)) return;
    const variants = familyGroups.get(family);
    let mainEntry = variants.find((v) => v === family);
    if (!mainEntry) {
      mainEntry = variants[0];
    }
    mainList.push(mainEntry);
    processedFamilies.add(family);
  });
  return mainList;
};
export const getPokemonVariants = (selectedName, pokedexData) => {
  const targetFamily = getFamilyName(selectedName);
  return pokedexData
    .filter((p) => getFamilyName(p.name) === targetFamily)
    .map((p) => p.name);
};
export const getAllPokemon = (pokedexData) => {
  return pokedexData;
};
export const getPokemonByName = (name, pokemonMap) => {
  return (
    pokemonMap.get(name) || { id: null, name: name, types: [], sprite: null }
  );
};
export const getPokemonBackground = (name, pokemonMap) => {
  if (typeBackgrounds[name]) {
    return typeBackgrounds[name];
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
export const getPokemonShadow = (name, pokemonMap) => {
  const background = getPokemonBackground(name, pokemonMap);
  return getDualShadow(background);
};
export const getPokemonCardData = (name, pokemonMap) => {
  const pokemon = getPokemonByName(name, pokemonMap);
  const background = getPokemonBackground(name, pokemonMap);
  const sprite = pokemon.sprite || getSpriteUrlByName(name);
  return { ...pokemon, sprite, background };
};
