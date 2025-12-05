import eliteFourData from "@/data/eliteFourData.json";

const membersMap = new Map(eliteFourData.map((m) => [m.name, m]));

export const getAllEliteFourMembers = () => {
  return eliteFourData;
};

export const getMembersByRegion = (regionName) => {
  if (!regionName) return [];
  return eliteFourData.filter((m) => m.region === regionName);
};

export const getMemberByName = (memberName) => {
  return membersMap.get(memberName) || null;
};

export const getTeamNamesForMember = (memberName) => {
  const member = getMemberByName(memberName);
  if (!member || !member.teams) return [];
  return Object.keys(member.teams).sort();
};

export const getPokemonListForTeam = (memberName, teamName) => {
  const member = getMemberByName(memberName);
  if (!member || !member.teams || !teamName) return [];

  const team = member.teams[teamName];
  return team ? team.pokemonNames : [];
};

export const getPokemonStrategy = (memberName, teamName, pokemonName) => {
  const member = getMemberByName(memberName);
  if (!member || !member.teams || !teamName) return [];

  const team = member.teams[teamName];
  if (!team || !team.pokemonStrategies) return [];

  return team.pokemonStrategies[pokemonName] || [];
};

export const getTeamBuilds = (teamName) => {
  if (!teamName) return [];

  const memberWithTeam = eliteFourData.find(
    (m) => m.teams && m.teams[teamName]
  );

  if (memberWithTeam && memberWithTeam.teams[teamName].builds) {
    return memberWithTeam.teams[teamName].builds;
  }

  return [];
};
