import raidsData from "@/data/raidsData.json";

const raidsMap = new Map(raidsData.map((r) => [r.name, r]));

export const getStarLevels = () => {
  const allStars = raidsData.map((r) => r.stars);
  return [...new Set(allStars)].sort((a, b) => a - b);
};

export const getRaidsByStars = (starLevel) => {
  if (starLevel == null) return [];

  return raidsData
    .filter((r) => r.stars === starLevel)
    .sort((a, b) =>
      a.name.localeCompare(b.name, "it", { sensitivity: "base" })
    );
};

export const getRaidByName = (name) => {
  return raidsMap.get(name) || null;
};

export const getActiveStrategy = (raidName, strategyIndex = 0) => {
  const raid = getRaidByName(raidName);
  if (!raid) return null;

  if (raid.teamStrategies && raid.teamStrategies.length > 0) {
    return raid.teamStrategies[strategyIndex] || raid.teamStrategies[0];
  }
  return {
    roles: raid.roles,
    strategy: raid.strategy,
    recommended: raid.recommended,
    links: raid.links,
  };
};
