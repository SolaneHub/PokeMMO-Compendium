import TeamCard from "./TeamCard";

const TeamList = ({ teams, onTeamClick, onDeleteTeam, onSubmitTeam }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          onClick={() => onTeamClick(team.id)}
          onDelete={onDeleteTeam}
          onSubmit={onSubmitTeam}
        />
      ))}
    </div>
  );
};
export default TeamList;
