import { Raid, RaidStrategy } from "@/types/raids";

/**
 * Gets the active strategy for a given raid object.
 * @param {Raid} raid - The raid object.
 * @param {number} strategyIndex - The index of the strategy to retrieve.
 * @returns {RaidStrategy | any} The strategy object.
 */
export const getActiveStrategyFromRaid = (
  raid: Raid | null,
  strategyIndex = 0
): RaidStrategy | null => {
  if (!raid) return null;
  if (raid.teamStrategies && raid.teamStrategies.length > 0) {
    return raid.teamStrategies[strategyIndex] || raid.teamStrategies[0];
  }
  return null;
};

/**
 * @deprecated Use useRaidsData hook to get data from Firestore.
 */
export const getStarLevels = () => [];
/**
 * @deprecated Use useRaidsData hook to get data from Firestore.
 */
export const getRaidsByStars = () => [];
/**
 * @deprecated Use useRaidsData hook to get data from Firestore.
 */
export const getRaidByName = () => null;
/**
 * @deprecated Use getActiveStrategyFromRaid with a raid object from useRaidsData.
 */
export const getActiveStrategy = () => null;
