import redData from "@/data/redData.json";
import { pokemonRegions } from "@/shared/utils/regionData";

export const getAllRedTrainers = () => {
  return redData;
};

export const getAvailableRedRegions = () => {
  const redRegionsSet = new Set(redData.map((r) => r.region));
  return pokemonRegions.filter((region) => redRegionsSet.has(region.name));
};

export const getRedTrainersByRegion = (regionName) => {
  if (!regionName) return [];
  return redData.filter((r) => r.region === regionName);
};

export const getRedTrainer = (name, region) => {
  return redData.find((r) => r.name === name && r.region === region) || null;
};

export const getTeamNamesForRed = (name, region) => {
  const trainer = getRedTrainer(name, region);
  if (!trainer || !trainer.teams) return [];
  return Object.keys(trainer.teams).sort();
};

export const getPokemonListForTeam = (name, region, teamName) => {
  const trainer = getRedTrainer(name, region);
  if (!trainer || !trainer.teams || !teamName) return [];

  const team = trainer.teams[teamName];
  return team ? team.pokemonNames : [];
};

export const getPokemonStrategy = (name, region, teamName, pokemonName) => {
  const trainer = getRedTrainer(name, region);
  if (!trainer || !trainer.teams || !teamName) return [];

  const team = trainer.teams[teamName];
  if (!team || !team.pokemonStrategies) return [];

  return team.pokemonStrategies[pokemonName] || [];
};
