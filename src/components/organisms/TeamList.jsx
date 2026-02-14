import TeamCard from "./TeamCard";
const TeamList = ({
  teams,
  onTeamClick,
  onDeleteTeam,
  onSubmitTeam,
  onCancelSubmission,
}) => {
  return (
    <div className="animate-fade-in grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {" "}
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          onClick={
            team.status === "pending" ? null : () => onTeamClick(team.id)
          }
          onDelete={onDeleteTeam}
          onSubmit={onSubmitTeam}
          onCancelSubmission={onCancelSubmission}
        />
      ))}{" "}
    </div>
  );
};
export default TeamList;
