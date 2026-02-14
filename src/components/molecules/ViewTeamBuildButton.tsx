import { FEATURE_CONFIG } from "@/utils/featureConfig";

interface ViewTeamBuildButtonProps {
  selectedTeam: string | undefined;
  onOpen: () => void;
}

function ViewTeamBuildButton({
  selectedTeam,
  onOpen,
}: ViewTeamBuildButtonProps) {
  const accentColor = FEATURE_CONFIG["elite-four"].color;

  return (
    <div className="flex animate-[fade-in_0.3s_ease-out] justify-center">
      <button
        onClick={onOpen}
        style={{
          borderColor: accentColor,
          backgroundColor: `${accentColor}20`,
          color: accentColor,
          boxShadow: `0 0 20px ${accentColor}33`,
        }}
        className="relative h-12 rounded-2xl border px-6 text-sm font-bold transition-all duration-300 hover:scale-105"
      >
        📋 View {selectedTeam} Team Build
      </button>
    </div>
  );
}

export default ViewTeamBuildButton;
