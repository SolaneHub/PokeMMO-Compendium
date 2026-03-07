import { Pokemon } from "../types/pokemon";
import { Raid, RaidStrategy } from "../types/raids";

const PREFIX_VARIANTS = new Set([
  "Heat Rotom",
  "Wash Rotom",
  "Frost Rotom",
  "Fan Rotom",
  "Mow Rotom",
]);

/**
 * Gets the active strategy for a given raid object.
 */
export const getActiveStrategyFromRaid = (
  raid: Raid | null,
  strategyIndex = 0
): RaidStrategy | null => {
  if (!raid?.teamStrategies?.length) return null;
  const strategy = raid.teamStrategies[strategyIndex] ?? raid.teamStrategies[0];
  return strategy ?? null;
};

/**
 * Gets the base family name of a Pokemon (e.g., "Rotom" for "Heat Rotom").
 */
export const getFamilyName = (name: string): string => {
  if (PREFIX_VARIANTS.has(name)) {
    return "Rotom";
  }
  if (name.includes(" (")) {
    const splitName = name.split(" (")[0];
    return splitName ?? name;
  }
  return name;
};

/**
 * Gets all variants of a Pokemon based on its family name.
 */
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

/**
 * Filters a list of Pokemon to show only the main entry for each family.
 */
export const getPokedexMainList = (pokedexData: Pokemon[]): Pokemon[] => {
  const familyGroups = new Map<string, Pokemon[]>();
  pokedexData.forEach((p) => {
    const family = getFamilyName(p.name);
    if (!familyGroups.has(family)) {
      familyGroups.set(family, []);
    }
    familyGroups.get(family)?.push(p);
  });

  const mainList: Pokemon[] = [];
  const processedFamilies = new Set<string>();
  pokedexData.forEach((p) => {
    const family = getFamilyName(p.name);
    if (processedFamilies.has(family)) return;
    const variants = familyGroups.get(family);
    if (!variants || variants.length === 0) return;

    let mainEntry = variants.find((v) => v.name === family);
    if (!mainEntry) {
      mainEntry = variants[0];
    }
    if (mainEntry) {
      mainList.push(mainEntry);
      processedFamilies.add(family);
    }
  });
  return mainList;
};
