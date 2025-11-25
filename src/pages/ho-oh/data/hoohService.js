import { pokemonRegions } from "@/shared/utils/regionData";

import hoOhData from "./hoOhData.json";

// * Map for fast access/filtering.
// ? Gestisce la struttura dove Ho-Oh potrebbe esistere in più regioni o con team diversi.

/**
 * ? Returns all available Ho-Oh trainer data from the source JSON.
 */
export const getAllHoOhTrainers = () => {
  return hoOhData;
};

/**
 * * Returns the list of regions where Ho-Oh battles are available.
 * ? Filters the global 'pokemonRegions' list, returning only those present in Ho-Oh's data.
 */
export const getAvailableHoOhRegions = () => {
  const hoOhRegionsSet = new Set(hoOhData.map((h) => h.region));
  return pokemonRegions.filter((region) => hoOhRegionsSet.has(region.name));
};

/**
 * ? Returns Ho-Oh trainer instances filtered by a specific region.
 */
export const getHoOhTrainersByRegion = (regionName) => {
  if (!regionName) return [];
  return hoOhData.filter((h) => h.region === regionName);
};

/**
 * ? Helper: Finds a specific Ho-Oh object instance given a name and region.
 */
export const getHoOhTrainer = (name, region) => {
  return hoOhData.find((h) => h.name === name && h.region === region) || null;
};

/**
 * * Retrieves the sorted list of team names available for a specific instance of Ho-Oh.
 */
export const getTeamNamesForHoOh = (name, region) => {
  const trainer = getHoOhTrainer(name, region);
  if (!trainer || !trainer.teams) return [];
  return Object.keys(trainer.teams).sort();
};

/**
 * * Returns the array of Pokemon names for a specific team.
 * ? Used to populate the Pokemon Cards display.
 */
export const getPokemonListForTeam = (name, region, teamName) => {
  const trainer = getHoOhTrainer(name, region);
  if (!trainer || !trainer.teams || !teamName) return [];

  const team = trainer.teams[teamName];
  return team ? team.pokemonNames : [];
};

/**
 * * Returns the specific strategy steps for a selected Pokemon.
 * ? Safely navigates the nested structure to find strategies.
 */
export const getPokemonStrategy = (name, region, teamName, pokemonName) => {
  const trainer = getHoOhTrainer(name, region);
  if (!trainer || !trainer.teams || !teamName) return [];

  const team = trainer.teams[teamName];
  if (!team || !team.pokemonStrategies) return [];

  return team.pokemonStrategies[pokemonName] || [];
};
