import { Plus, Sword, Trash2 } from "lucide-react";

import Button from "@/components/atoms/Button";
const EnemyPool = ({
  selectedMember,
  enemyPool,
  teamStrategies,
  selectedEnemyPokemon,
  onSelectEnemy,
  onAddEnemy,
  onRemoveEnemy,
}) => {
  if (!selectedMember) return null;
  return (
    <div className="animate-fade-in mt-6 rounded-xl border border-white/5 bg-[#1a1b20] p-5">
      {" "}
      <div className="mb-2 flex items-center justify-between">
        {" "}
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase">
          {" "}
          <Sword size={16} /> Enemy Pool{" "}
        </h3>{" "}
        <Button variant="secondary" size="xs" onClick={onAddEnemy} icon={Plus}>
          {" "}
          Add{" "}
        </Button>{" "}
      </div>{" "}
      <div className="custom-scrollbar grid max-h-[300px] grid-cols-1 gap-2 overflow-y-auto pr-1">
        {" "}
        {enemyPool.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500 italic">
            {" "}
            Use the &apos;Add&apos; button to define the Pokémon{""}{" "}
            {selectedMember.name} uses against this team.{" "}
          </div>
        ) : (
          enemyPool.map((pName) => {
            const hasStrategy =
              teamStrategies?.[selectedMember.name]?.[pName]?.length > 0;
            return (
              <div key={pName} className="group/item flex gap-1">
                {" "}
                <button
                  onClick={() => onSelectEnemy(pName)}
                  className={`flex flex-1 items-center gap-3 rounded-lg border p-2 text-left transition-all ${selectedEnemyPokemon === pName ? "border-blue-500 bg-blue-900/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]" : "border-white/5 bg-[#1e2025] hover:border-white/10 hover:bg-[#25272e]"}`}
                >
                  {" "}
                  <div className="h-8 w-8 flex-shrink-0">
                    {" "}
                    <img
                      src={`https://img.pokemondb.net/sprites/black-white/anim/normal/${pName.toLowerCase()}.gif`}
                      loading="lazy"
                      onError={(e) => (e.target.style.display = "none")}
                      alt={pName}
                      className="h-full w-full object-contain"
                    />{" "}
                  </div>{" "}
                  <div className="min-w-0 flex-1">
                    {" "}
                    <div
                      className={`truncate font-medium ${selectedEnemyPokemon === pName ? "text-blue-300" : ""}`}
                    >
                      {" "}
                      {pName}{" "}
                    </div>{" "}
                    <div className="text-xs text-slate-500">
                      {" "}
                      {hasStrategy ? "Strategy Active" : "No Strategy"}{" "}
                    </div>{" "}
                  </div>{" "}
                  {hasStrategy && (
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  )}{" "}
                </button>{" "}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => onRemoveEnemy(pName, e)}
                  className="hidden text-slate-500 group-hover/item:flex hover:text-red-500"
                  icon={Trash2}
                />{" "}
              </div>
            );
          })
        )}{" "}
      </div>{" "}
    </div>
  );
};
export default EnemyPool;
