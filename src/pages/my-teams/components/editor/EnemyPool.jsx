import { Plus, Sword, Trash2 } from "lucide-react";

const EnemyPool = ({
  selectedMember,
  enemyPool,
  teamStrategies, // To check if strategy exists
  selectedEnemyPokemon,
  onSelectEnemy,
  onAddEnemy,
  onRemoveEnemy,
}) => {
  if (!selectedMember) return null;

  return (
    <div className="animate-fade-in mt-6 rounded-xl border border-white/5 bg-[#1a1b20] p-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase">
          <Sword size={16} />
          Enemy Pool
        </h3>
        <button
          onClick={onAddEnemy}
          className="flex items-center gap-1 rounded border border-white/10 bg-[#1e2025] px-2 py-1 text-xs text-white transition-colors hover:bg-white/10"
        >
          <Plus size={12} /> Add
        </button>
      </div>

      <div className="custom-scrollbar grid max-h-[300px] grid-cols-1 gap-2 overflow-y-auto pr-1">
        {enemyPool.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500 italic">
            Use the &apos;Add&apos; button to define the Pokémon{" "}
            {selectedMember.name} uses against this team.
          </div>
        ) : (
          enemyPool.map((pName) => {
            const hasStrategy =
              teamStrategies?.[selectedMember.name]?.[pName]?.length > 0;

            return (
              <div key={pName} className="group/item flex gap-1">
                <button
                  onClick={() => onSelectEnemy(pName)}
                  className={`flex flex-1 items-center gap-3 rounded-lg border p-2 text-left transition-all ${
                    selectedEnemyPokemon === pName
                      ? "border-blue-500 bg-blue-900/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                      : "border-white/5 bg-[#1e2025] hover:border-white/10 hover:bg-[#25272e]"
                  }`}
                >
                  <div className="h-8 w-8 flex-shrink-0">
                    <img
                      src={`https://img.pokemondb.net/sprites/black-white/anim/normal/${pName.toLowerCase()}.gif`}
                      loading="lazy"
                      onError={(e) => (e.target.style.display = "none")}
                      alt={pName}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`truncate font-medium ${selectedEnemyPokemon === pName ? "text-blue-300" : "text-slate-200"}`}
                    >
                      {pName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {hasStrategy ? "Strategy Active" : "No Strategy"}
                    </div>
                  </div>
                  {hasStrategy && (
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  )}
                </button>
                <button
                  onClick={(e) => onRemoveEnemy(pName, e)}
                  className="hidden items-center justify-center rounded-lg border border-white/10 bg-[#1e2025] px-2 text-slate-500 transition-all group-hover/item:flex hover:border-red-500 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default EnemyPool;
