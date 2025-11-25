import redData from "@/data/redData.json";
import { pokemonRegions } from "@/shared/utils/regionData";

// * Map for fast access/filtering.
// * Note: Since "Red" appears in multiple regions with the same name,
// * we rely mainly on direct filters rather than a simple Name->Object map.
// ? This logic handles the unique structure where Red exists across different regions with distinct teams.

/**
 * ? Returns all available Red trainer data from the source JSON.
 */
export const getAllRedTrainers = () => {
  return redData;
};

/**
 * * Returns the list of regions where Red battles are available.
 * ? Filters the global 'pokemonRegions' list, returning only those present in Red's data.
 */
export const getAvailableRedRegions = () => {
  const redRegionsSet = new Set(redData.map((r) => r.region));
  return pokemonRegions.filter((region) => redRegionsSet.has(region.name));
};

/**
 * ? Returns Red trainer instances filtered by a specific region.
 */
export const getRedTrainersByRegion = (regionName) => {
  if (!regionName) return [];
  return redData.filter((r) => r.region === regionName);
};

/**
 * ? Helper: Finds a specific Red object instance given a name and region.
 */
export const getRedTrainer = (name, region) => {
  return redData.find((r) => r.name === name && r.region === region) || null;
};

/**
 * * Retrieves the sorted list of team names available for a specific instance of Red.
 * ? Example: ["Skunkrow", "Metaoyster"]
 */
export const getTeamNamesForRed = (name, region) => {
  const trainer = getRedTrainer(name, region);
  if (!trainer || !trainer.teams) return [];
  return Object.keys(trainer.teams).sort();
};

/**
 * * Returns the array of Pokemon names for a specific team.
 * ? Used to populate the Pokemon Cards display.
 */
export const getPokemonListForTeam = (name, region, teamName) => {
  const trainer = getRedTrainer(name, region);
  if (!trainer || !trainer.teams || !teamName) return [];

  const team = trainer.teams[teamName];
  return team ? team.pokemonNames : [];
};

/**
 * * Returns the specific strategy steps for a selected Pokemon.
 * ? Safely navigates the nested structure to find strategies.
 */
export const getPokemonStrategy = (name, region, teamName, pokemonName) => {
  const trainer = getRedTrainer(name, region);
  if (!trainer || !trainer.teams || !teamName) return [];

  const team = trainer.teams[teamName];
  if (!team || !team.pokemonStrategies) return [];

  return team.pokemonStrategies[pokemonName] || [];
};
