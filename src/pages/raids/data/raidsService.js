import raidsData from "@/data/raidsData.json";

// * Map for fast O(1) access based on the raid name.
// * This avoids iterating through the array every time a raid is selected.
const raidsMap = new Map(raidsData.map((r) => [r.name, r]));

/**
 * ? Returns the sorted, unique list of available star levels.
 * ? Example Output: [3, 4, 5, 6]
 */
export const getStarLevels = () => {
  const allStars = raidsData.map((r) => r.stars);
  return [...new Set(allStars)].sort((a, b) => a - b);
};

/**
 * ? Returns the list of raids filtered by star level and sorted alphabetically (A-Z).
 */
export const getRaidsByStars = (starLevel) => {
  if (starLevel == null) return [];

  return raidsData
    .filter((r) => r.stars === starLevel)
    .sort((a, b) =>
      a.name.localeCompare(b.name, "it", { sensitivity: "base" })
    );
};

/**
 * ? Retrieves a specific raid object by Pokemon name.
 */
export const getRaidByName = (name) => {
  return raidsMap.get(name) || null;
};

/**
 * * Returns the normalized "active strategy" object.
 * ? Handles the logic to distinguish between modern raids (with multiple 'teamStrategies')
 * ? and legacy raids (with direct 'roles' in the root object).
 */
export const getActiveStrategy = (raidName, strategyIndex = 0) => {
  const raid = getRaidByName(raidName);
  if (!raid) return null;

  // * Case 1: Raid with multiple strategies (Modern Format)
  if (raid.teamStrategies && raid.teamStrategies.length > 0) {
    return raid.teamStrategies[strategyIndex] || raid.teamStrategies[0];
  }

  // ! Case 2: Classic Raid (Legacy Fallback)
  // * Creates a dummy strategy object mimicking the modern structure
  return {
    roles: raid.roles,
    strategy: raid.strategy,
    recommended: raid.recommended,
    links: raid.links,
  };
};
