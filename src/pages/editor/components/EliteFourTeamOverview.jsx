import { getSpriteUrlByName } from "@/shared/utils/pokemonImageHelper";

const EliteFourTeamOverview = ({
  teamKey,
  team,
  selectedPokemon,
  onSelectPokemon,
}) => {
  return (
    <div className="mb-6 rounded-xl border border-t-4 border-white/5 border-t-blue-500 bg-[#1a1b20] p-6 shadow-xl">
      <h4 className="mb-4 ml-1 text-xs font-black tracking-widest text-slate-500 uppercase">
        Team Roster: <span className="text-blue-400">{teamKey}</span>
      </h4>
      <div className="flex flex-wrap gap-3">
        {(team.pokemonNames || []).map((pokemonName) => {
          const spriteUrl = getSpriteUrlByName(pokemonName);
          const isPokemonSelected = selectedPokemon === pokemonName;

          return (
            <button
              key={pokemonName}
              className={`relative flex flex-col items-center rounded-xl border-2 p-3 transition-all duration-200 ease-in-out ${
                isPokemonSelected
                  ? "border-green-500 bg-green-600/10 shadow-lg shadow-green-900/20"
                  : "border-white/5 bg-[#0f1014] hover:border-white/20 hover:bg-white/5"
              } focus:ring-2 focus:ring-green-500/50 focus:outline-none`}
              onClick={() => onSelectPokemon(pokemonName)}
            >
              {spriteUrl ? (
                <img
                  src={spriteUrl}
                  alt={pokemonName}
                  className="mb-2 h-16 w-16 object-contain drop-shadow-md"
                />
              ) : (
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-lg bg-white/5 text-[10px] font-bold tracking-tighter text-slate-500 uppercase">
                  No Sprite
                </div>
              )}
              <span
                className={`text-xs font-bold ${isPokemonSelected ? "text-green-400" : "text-slate-300"}`}
              >
                {pokemonName}
              </span>
              {isPokemonSelected && (
                <div className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white shadow-sm">
                  <span className="text-[10px] font-black">✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EliteFourTeamOverview;
