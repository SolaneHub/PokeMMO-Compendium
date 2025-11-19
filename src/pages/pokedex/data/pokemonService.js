import pokedex from "@/pages/pokedex/data/pokedex.json";
import {
  generateDualTypeGradient,
  getDualShadow,
  typeBackgrounds,
} from "@/shared/utils/pokemonColors";
import { getSpriteUrlByName } from "@/shared/utils/pokemonImageHelper";

// * ──────────────────────────────────────────────────────────────────
// * CONFIGURATION & INTERNAL HELPERS
// * ──────────────────────────────────────────────────────────────────

// * Map for O(1) access speed for base data retrieval
const pokemonMap = new Map(pokedex.map((p) => [p.name, p]));

// ? Special forms that don't use parentheses but are variants (e.g., Rotom appliances)
const PREFIX_VARIANTS = [
  "Heat Rotom",
  "Wash Rotom",
  "Frost Rotom",
  "Fan Rotom",
  "Mow Rotom",
];

/**
 * * Complete fallback function: ensures all complex fields (arrays/objects)
 * * are initialized, preventing crashes in the UI component.
 */
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

  // * Complex fields initialized to safe empty values
  abilities: { main: [], hidden: null },
  eggGroups: [],
  baseStats: {},
  moves: [],
  evolutions: [],
  locations: [],
  variants: [],
});

/**
 * * Retrieves all Pokemon data and enriches it with UI details.
 * ? Returns a COMPLETE structure (even with fallback data if needed).
 * @param {string} name - Name of the Pokémon to search for
 * @returns {object} Complete Pokémon object (or fallback)
 */
export const getPokemonFullDetails = (name) => {
  const pokemonBase = getPokemonByName(name);

  const isBasePokemon = pokemonBase && pokemonBase.id !== null;

  const variants = isBasePokemon
    ? getPokemonVariants(name).filter((v) => v !== name)
    : [];

  // ! Check 1: If the base object has no real data (ID === null from getPokemonByName fallback)
  if (!pokemonBase) {
    const fallback = fallbackFullDetails(name);
    return {
      ...fallback,
      // ? Add UI data that would otherwise cause a crash
      sprite: getPokemonCardData(name).sprite,
      background: "#3a3b3d",
    };
  }

  // * Proceed with real data
  const background = getPokemonBackground(name);
  const sprite = pokemonBase.sprite || getPokemonCardData(name).sprite;

  // * Merge fallbacks with real data to ensure no field is missing
  const data = {
    ...fallbackFullDetails(name),
    ...pokemonBase,
    sprite,
    background,
    variants,
    // * Final guarantee on key nested fields (useful for incomplete data merge)
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

/**
 * ? Determines the "Family Name" of a Pokémon for grouping variants.
 * * Ex: "Wormadam (Plant)" -> "Wormadam"
 * * Ex: "Heat Rotom" -> "Rotom"
 * * Ex: "Pikachu" -> "Pikachu"
 */
const getFamilyName = (name) => {
  if (PREFIX_VARIANTS.includes(name)) {
    return "Rotom";
  }

  if (name.includes(" (")) {
    return name.split(" (")[0];
  }

  return name;
};

// * ──────────────────────────────────────────────────────────────────
// * LIST METHODS (FILTERS AND SEARCH)
// * ──────────────────────────────────────────────────────────────────

export const getAllPokemonNames = () => {
  return pokedex.map((p) => p.name);
};

/**
 * * Returns the list for the main Pokedex grid.
 * * LOGIC:
 * * 1. Groups Pokémon by family name.
 * * 2. For each family, shows ONLY the "family head" (the base form, e.g., "Rotom" not "Heat Rotom").
 * * 3. If the pure base form doesn't exist (e.g., Wormadam), shows the first variant found (e.g., Wormadam Plant).
 */
export const getPokedexMainList = () => {
  const familyGroups = new Map();

  pokedex.forEach((p) => {
    const family = getFamilyName(p.name);

    if (!familyGroups.has(family)) {
      familyGroups.set(family, []);
    }
    familyGroups.get(family).push(p.name);
  });

  const mainList = [];
  const processedFamilies = new Set();

  pokedex.forEach((p) => {
    const family = getFamilyName(p.name);
    if (processedFamilies.has(family)) return;

    const variants = familyGroups.get(family);

    // ? Search for the "pure" form (e.g., "Rotom")
    let mainEntry = variants.find((v) => v === family);

    // ? If the pure form doesn't exist, take the first one in the list
    if (!mainEntry) {
      mainEntry = variants[0];
    }

    mainList.push(mainEntry);
    processedFamilies.add(family);
  });

  return mainList;
};

/**
 * ? Finds all variants belonging to the same family as the selected Pokémon.
 * * Ex: Input "Rotom" -> Output ["Rotom", "Heat Rotom", "Wash Rotom"...]
 * * Ex: Input "Wormadam (Plant)" -> Output ["Wormadam (Plant)", "Wormadam (Sandy)"...]
 */
export const getPokemonVariants = (selectedName) => {
  const targetFamily = getFamilyName(selectedName);

  return pokedex
    .filter((p) => getFamilyName(p.name) === targetFamily)
    .map((p) => p.name);
};

export const getAllPokemon = () => {
  return pokedex;
};

// * ──────────────────────────────────────────────────────────────────
// * SINGLE DETAIL RETRIEVAL METHODS (Used by Card/Summary)
// * ──────────────────────────────────────────────────────────────────

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

export const getPokemonBackground = (name) => {
  if (typeBackgrounds[name]) {
    return typeBackgrounds[name];
  }

  const pokemon = getPokemonByName(name);
  const types = pokemon.types || [];

  if (types.length >= 2) {
    return generateDualTypeGradient(types[0], types[1]);
  }

  if (types.length === 1) {
    return typeBackgrounds[types[0]] || typeBackgrounds[""];
  }

  return typeBackgrounds[""];
};

export const getPokemonShadow = (name) => {
  const background = getPokemonBackground(name);
  return getDualShadow(background);
};

export const getPokemonCardData = (name) => {
  const pokemon = getPokemonByName(name);
  const background = getPokemonBackground(name);
  // ? Use the sprite helper as a fallback or if sprite property is null in main data
  const sprite = pokemon.sprite || getSpriteUrlByName(name);

  return {
    ...pokemon,
    sprite,
    background,
  };
};
