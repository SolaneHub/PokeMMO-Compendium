import { Team } from "@/firebase/firestoreService";
import { FEATURE_CONFIG } from "@/utils/featureConfig";

interface TeamSelectionProps {
  teams: Team[];
  selectedTeamId: string | undefined;
  onTeamClick: (teamId: string) => void;
}

function TeamSelection({
  teams,
  selectedTeamId,
  onTeamClick,
}: TeamSelectionProps) {
  const accentColor = FEATURE_CONFIG["elite-four"].color;

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {teams.map((team) => {
        const isSelected = selectedTeamId === team.id;
        return (
          <button
            key={team.id}
            onClick={() => team.id && onTeamClick(team.id)}
            style={{
              borderColor: isSelected ? accentColor : undefined,
              backgroundColor: isSelected ? `${accentColor}20` : undefined,
              color: isSelected ? accentColor : undefined,
              boxShadow: isSelected ? `0 0 20px ${accentColor}33` : undefined,
            }}
            className={`relative h-16 w-40 rounded-2xl border text-lg font-bold transition-all duration-300 ${
              isSelected
                ? "scale-105"
                : "border-white/5 bg-[#1e2025] text-slate-400 hover:-translate-y-1 hover:border-white/20 hover:bg-[#25272e] hover:text-slate-200"
            }`}
          >
            {team.name}
          </button>
        );
      })}
    </div>
  );
}

export default TeamSelection;
