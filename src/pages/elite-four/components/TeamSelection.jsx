function TeamSelection({ teams, selectedTeamId, onTeamClick }) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {teams.map((team) => (
        <button
          key={team.id}
          onClick={() => onTeamClick(team.id)}
          className={`relative h-16 w-40 rounded-2xl border text-lg font-bold transition-all duration-300 ${
            selectedTeamId === team.id
              ? "scale-105 border-blue-500 bg-blue-600/20 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
              : "border-white/5 bg-[#1e2025] text-slate-400 hover:-translate-y-1 hover:border-white/20 hover:bg-[#25272e] hover:text-slate-200"
          } `}
        >
          {team.name}
        </button>
      ))}
    </div>
  );
}

export default TeamSelection;
