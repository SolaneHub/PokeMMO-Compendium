import { Team } from "@/firebase/firestoreService";

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
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          onClick={
            team.status === "pending"
              ? undefined
              : () => team.id && onTeamClick(team.id)
          }
          onDelete={onDeleteTeam}
          onSubmit={onSubmitTeam}
          onCancelSubmission={onCancelSubmission}
        />
      ))}
    </div>
  );
};

export default TeamList;
