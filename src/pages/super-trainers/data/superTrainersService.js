import superTrainersData from "@/data/superTrainersData.json";
import { pokemonRegions } from "@/shared/utils/regionData";

export const getAllSuperTrainers = () => {
  return [...superTrainersData].sort((a, b) => a.name.localeCompare(b.name));
};

export const getAvailableSuperTrainerRegions = () => {
  const superTrainerRegionsSet = new Set(
    superTrainersData.map((r) => r.region)
  );
  return pokemonRegions.filter((region) =>
    superTrainerRegionsSet.has(region.name)
  );
};

export const getSuperTrainersByRegion = (regionName) => {
  if (!regionName) return [];
  return superTrainersData.filter((r) => r.region === regionName);
};

export const getSuperTrainer = (name, region) => {
  return (
    superTrainersData.find((r) => r.name === name && r.region === region) ||
    null
  );
};

export const getTeamNamesForSuperTrainer = (name, region) => {
  const trainer = getSuperTrainer(name, region);
  if (!trainer || !trainer.teams) return [];
  return Object.keys(trainer.teams).sort();
};

export const getPokemonListForTeam = (name, region, teamName) => {
  const trainer = getSuperTrainer(name, region);
  if (!trainer || !trainer.teams || !teamName) return [];

  const team = trainer.teams[teamName];
  return team ? team.pokemonNames : [];
};

export const getPokemonStrategy = (name, region, teamName, pokemonName) => {
  const trainer = getSuperTrainer(name, region);
  if (!trainer || !trainer.teams || !teamName) return [];

  const team = trainer.teams[teamName];
  if (!team || !team.pokemonStrategies) return [];

  return team.pokemonStrategies[pokemonName] || [];
};
