import { BossFight } from "@/types/bossFights";
import { pokemonRegions } from "@/utils/regionData";

/**
 * Gets regions that have boss fights available.
 */
export const getAvailableBossFightRegions = (bossFights: BossFight[]) => {
  const bossFightRegionsSet = new Set(bossFights.map((h) => h.region));
  return pokemonRegions.filter((region) =>
    bossFightRegionsSet.has(region.name)
  );
};

/**
 * Filters boss fights by region.
 */
export const getBossFightsByRegion = (
  bossFights: BossFight[],
  regionName: string | null
): BossFight[] => {
  if (!regionName) return [];
  return bossFights.filter((h) => h.region === regionName);
};
