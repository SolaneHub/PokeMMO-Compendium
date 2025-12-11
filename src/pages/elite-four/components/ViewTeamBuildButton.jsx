function ViewTeamBuildButton({ selectedTeam, onOpen }) {
  return (
    <div className="flex animate-[fade-in_0.3s_ease-out] justify-center">
      <button
        className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-105 hover:bg-blue-500 active:scale-95"
        onClick={onOpen}
      >
        📋 View {selectedTeam} Team Build
      </button>
    </div>
  );
}

export default ViewTeamBuildButton;
