import { pokemonRegions } from "@/shared/utils/regionData";

import hoOhData from "./hoOhData.json";

export const getAllHoOhTrainers = () => {
  return hoOhData;
};

export const getAvailableHoOhRegions = () => {
  const hoOhRegionsSet = new Set(hoOhData.map((h) => h.region));
  return pokemonRegions.filter((region) => hoOhRegionsSet.has(region.name));
};

export const getHoOhTrainersByRegion = (regionName) => {
  if (!regionName) return [];
  return hoOhData.filter((h) => h.region === regionName);
};

export const getHoOhTrainer = (name, region) => {
  return hoOhData.find((h) => h.name === name && h.region === region) || null;
};

export const getTeamNamesForHoOh = (name, region) => {
  const trainer = getHoOhTrainer(name, region);
  if (!trainer || !trainer.teams) return [];
  return Object.keys(trainer.teams).sort();
};

export const getPokemonListForTeam = (name, region, teamName) => {
  const trainer = getHoOhTrainer(name, region);
  if (!trainer || !trainer.teams || !teamName) return [];

  const team = trainer.teams[teamName];
  return team ? team.pokemonNames : [];
};

export const getPokemonStrategy = (name, region, teamName, pokemonName) => {
  const trainer = getHoOhTrainer(name, region);
  if (!trainer || !trainer.teams || !teamName) return [];

  const team = trainer.teams[teamName];
  if (!team || !team.pokemonStrategies) return [];

  return team.pokemonStrategies[pokemonName] || [];
};
