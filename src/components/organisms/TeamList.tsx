import { Team } from "@/types/teams";

import TeamCard from "./TeamCard";

interface TeamListProps {
  teams: Team[];
  onTeamClick: (teamId: string) => void;
  onDeleteTeam: (teamId: string) => void;
  onSubmitTeam: (teamId: string) => void;
  onCancelSubmission: (teamId: string) => void;
}

const TeamList = ({
  teams,
  onTeamClick,
  onDeleteTeam,
  onSubmitTeam,
  onCancelSubmission,
}: TeamListProps) => {
  return (
    <div className="animate-fade-in grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => {
        const teamId = team.id;
        const isClickable = team.status !== "pending" && teamId;

        const handleClick = isClickable
          ? () => onTeamClick(teamId)
          : () => {
              /* pending teams cannot be clicked */
            };

        return (
          <TeamCard
            key={teamId}
            team={team}
            onClick={handleClick}
            onDelete={onDeleteTeam}
            onSubmit={onSubmitTeam}
            onCancelSubmission={onCancelSubmission}
          />
        );
      })}
    </div>
  );
};

export default TeamList;
