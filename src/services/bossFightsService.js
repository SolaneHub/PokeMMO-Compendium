import bossFightsData from "@/data/bossFightsData.json";
import { pokemonRegions } from "@/utils/regionData";
export const getAllBossFights = () => {
  return bossFightsData;
};
export const getAvailableBossFightRegions = () => {
  const bossFightRegionsSet = new Set(bossFightsData.map((h) => h.region));
  return pokemonRegions.filter((region) =>
    bossFightRegionsSet.has(region.name)
  );
};
export const getBossFightsByRegion = (regionName) => {
  if (!regionName) return [];
  return bossFightsData.filter((h) => h.region === regionName);
};
export const getBossFight = (name, region) => {
  return (
    bossFightsData.find((h) => h.name === name && h.region === region) || null
  );
};
export const getTeamNamesForBossFight = (name, region) => {
  const trainer = getBossFight(name, region);
  if (!trainer || !trainer.teams) return [];
  return Object.keys(trainer.teams).sort();
};
export const getPokemonListForTeam = (name, region, teamName) => {
  const trainer = getBossFight(name, region);
  if (!trainer || !trainer.teams || !teamName) return [];
  const team = trainer.teams[teamName];
  return team ? team.pokemonNames : [];
};
export const getPokemonStrategy = (name, region, teamName, pokemonName) => {
  const trainer = getBossFight(name, region);
  if (!trainer || !trainer.teams || !teamName) return [];
  const team = trainer.teams[teamName];
  if (!team || !team.pokemonStrategies) return [];
  return team.pokemonStrategies[pokemonName] || [];
};
