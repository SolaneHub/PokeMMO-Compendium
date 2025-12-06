import { getPokemonCardData } from "@/pages/pokedex/data/pokemonService";

const TRAINER_PATH = `${import.meta.env.BASE_URL}items/`;
const getItemSpriteUrl = (itemName) => {
  if (!itemName) return null;
  const formattedName = itemName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/['’]/g, "")
    .replace(/\./g, "");
  return `${TRAINER_PATH}${formattedName}.png`;
};

function PlayerBuildCard({ build }) {
  const { sprite } = getPokemonCardData(build.name);

  return (
    <div className="flex flex-col bg-neutral-900 border border-slate-700 rounded-lg overflow-hidden shadow-sm hover:border-slate-500 transition-colors">
      <div className="flex items-center justify-between p-2.5 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <img 
            src={sprite} 
            alt={build.name} 
            className="w-10 h-10 object-contain drop-shadow-md" 
          />
          <span className="text-white font-bold text-sm">{build.name}</span>
        </div>

        {build.item && (
          <span className="flex items-center text-slate-300 text-xs bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
            <img
              src={getItemSpriteUrl(build.item)}
              alt={build.item}
              className="w-5 h-5 object-contain mr-1.5"
              onError={(e) => (e.target.style.display = "none")}
            />
            {build.item}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3 bg-neutral-800 border-b border-slate-700 px-2.5 py-1.5 text-xs">
        {build.ability && (
          <span className="text-slate-400">
            Ability: <strong className="text-slate-200 ml-1">{build.ability}</strong>
          </span>
        )}
        {build.nature && (
          <span className="text-slate-400">
            Nature: <strong className="text-slate-200 ml-1">{build.nature}</strong>
          </span>
        )}
        {build.evs && (
          <span className="text-slate-400">
            EVs: <strong className="text-slate-200 ml-1">{build.evs}</strong>
          </span>
        )}
      </div>

      {build.moves && (
        <div className="flex flex-wrap gap-1.5 p-2.5 bg-neutral-900">
          {build.moves.map((m, k) => (
            <span key={k} className="bg-slate-800 border border-slate-700 text-slate-300 rounded px-1.5 py-0.5 text-xs">
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeamBuildModal({ teamName, builds, onClose }) {
  if (!builds || builds.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 backdrop-blur-sm animate-[fade-in_0.3s_ease-out_forwards]" 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[480px] max-h-[85vh] flex flex-col bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden animate-[scale-in_0.4s_ease-out_forwards]" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col p-4 bg-slate-700 shadow-md z-10">
          <h2 className="text-xl font-bold text-white drop-shadow-md m-0">{teamName} Setup</h2>
          <p className="text-sm text-slate-300 opacity-80 m-0">Player Team Configuration</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-slate-800">
          <div className="flex flex-col gap-3 animate-[fade-in_0.3s_ease-out_forwards]">
            {builds.map((build, idx) => (
              <PlayerBuildCard key={idx} build={build} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}