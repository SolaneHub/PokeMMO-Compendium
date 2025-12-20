import { eliteFourMembers } from "@/shared/utils/eliteFourMembers";

const membersMap = new Map(eliteFourMembers.map((m) => [m.name, m]));

export const getAllEliteFourMembers = () => {
  return eliteFourMembers;
};

export const getMembersByRegion = (regionName) => {
  if (!regionName) return [];
  return eliteFourMembers.filter((m) => m.region === regionName);
};

export const getMemberByName = (memberName) => {
  return membersMap.get(memberName) || null;
};

/**
 * @deprecated Strategy logic moved to Firestore. Use TeamSelection and currentTeamData in EliteFourPage.
 */
export const getTeamNamesForMember = (memberName) => {
  return [];
};

/**
 * @deprecated Strategy logic moved to Firestore.
 */
export const getPokemonListForTeam = (memberName, teamName) => {
  return [];
};

/**
 * @deprecated Strategy logic moved to Firestore.
 */
export const getPokemonStrategy = (memberName, teamName, pokemonName) => {
  return [];
};

/**
 * @deprecated Strategy logic moved to Firestore.
 */
export const getTeamBuilds = (teamName) => {
  return [];
};