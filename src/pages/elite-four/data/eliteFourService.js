import eliteFourData from "@/data/eliteFourData.json";

// * Map for fast O(1) access to Elite Four members by name.
const membersMap = new Map(eliteFourData.map((m) => [m.name, m]));

/**
 * ? Returns the raw data from the JSON source.
 */
export const getAllEliteFourMembers = () => {
  return eliteFourData;
};

/**
 * ? Filters members based on the region name (e.g., "Kanto", "Johto").
 */
export const getMembersByRegion = (regionName) => {
  if (!regionName) return [];
  return eliteFourData.filter((m) => m.region === regionName);
};

/**
 * ? Retrieves a specific member object using the cached Map.
 */
export const getMemberByName = (memberName) => {
  return membersMap.get(memberName) || null;
};

/**
 * * Returns sorted list of available team names (e.g., ["Reckless", "Wild Taste"]).
 */
export const getTeamNamesForMember = (memberName) => {
  const member = getMemberByName(memberName);
  if (!member || !member.teams) return [];
  return Object.keys(member.teams).sort();
};

/**
 * * Returns the array of Pokemon names for a specific team composition.
 */
export const getPokemonListForTeam = (memberName, teamName) => {
  const member = getMemberByName(memberName);
  if (!member || !member.teams || !teamName) return [];

  const team = member.teams[teamName];
  return team ? team.pokemonNames : [];
};

/**
 * * Returns the strategy steps for a specific Pokemon within a selected team.
 * ? Safely handles nested checks to prevent errors if data is missing.
 */
export const getPokemonStrategy = (memberName, teamName, pokemonName) => {
  const member = getMemberByName(memberName);
  if (!member || !member.teams || !teamName) return [];

  const team = member.teams[teamName];
  if (!team || !team.pokemonStrategies) return [];

  return team.pokemonStrategies[pokemonName] || [];
};
