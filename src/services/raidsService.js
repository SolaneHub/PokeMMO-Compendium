/** * Gets the active strategy for a given raid object. * @param {Object} raid - The raid object. * @param {number} strategyIndex - The index of the strategy to retrieve. * @returns {Object|null} The strategy object. */
export const getActiveStrategyFromRaid = (raid, strategyIndex = 0) => { if (!raid) return null; if (raid.teamStrategies && raid.teamStrategies.length > 0) { return raid.teamStrategies[strategyIndex] || raid.teamStrategies[0]; } return { roles: raid.roles, strategy: raid.strategy, recommended: raid.recommended, links: raid.links, };
}; /** * @deprecated Use useRaidsData hook to get data from Firestore. */
export const getStarLevels = () => [];
/** * @deprecated Use useRaidsData hook to get data from Firestore. */
export const getRaidsByStars = () => [];
/** * @deprecated Use useRaidsData hook to get data from Firestore. */
export const getRaidByName = () => null;
/** * @deprecated Use getActiveStrategyFromRaid with a raid object from useRaidsData. */
export const getActiveStrategy = () => null; 
