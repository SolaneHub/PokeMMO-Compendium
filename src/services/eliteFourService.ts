import { EliteFourMember, eliteFourMembers } from "@/utils/eliteFourMembers";

const membersMap = new Map<string, EliteFourMember>(
  eliteFourMembers.map((m) => [m.name, m])
);

export const getAllEliteFourMembers = (): EliteFourMember[] => {
  return eliteFourMembers;
};

export const getMembersByRegion = (
  regionName: string | null
): EliteFourMember[] => {
  if (!regionName) return [];
  return eliteFourMembers.filter((m) => m.region === regionName);
};

export const getMemberByName = (memberName: string): EliteFourMember | null => {
  return membersMap.get(memberName) || null;
};

/**
 * @deprecated Strategy logic moved to Firestore. Use TeamSelection and currentTeamData in EliteFourPage.
 */
export const getTeamNamesForMember = (memberName: string): string[] => {
  console.warn("getTeamNamesForMember is deprecated", memberName);
  return [];
};

/**
 * @deprecated Strategy logic moved to Firestore.
 */
export const getPokemonListForTeam = (
  memberName: string,
  teamName: string
): string[] => {
  console.warn("getPokemonListForTeam is deprecated", memberName, teamName);
  return [];
};

/**
 * @deprecated Strategy logic moved to Firestore.
 */
export const getPokemonStrategy = (
  memberName: string,
  teamName: string,
  pokemonName: string
): unknown[] => {
  console.warn(
    "getPokemonStrategy is deprecated",
    memberName,
    teamName,
    pokemonName
  );
  return [];
};

/**
 * @deprecated Strategy logic moved to Firestore.
 */
export const getTeamBuilds = (teamName: string): unknown[] => {
  console.warn("getTeamBuilds is deprecated", teamName);
  return [];
};
