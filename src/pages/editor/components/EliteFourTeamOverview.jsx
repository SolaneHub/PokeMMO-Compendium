import { getSpriteUrlByName } from "@/shared/utils/pokemonImageHelper";

const EliteFourTeamOverview = ({
  teamKey,
  team,
  selectedPokemon,
  onSelectPokemon,
}) => {
  return (
    <div className="mb-5 rounded-md border border-t-4 border-[#333] border-t-pink-500 bg-[#252526] p-5 shadow-md">
      <h4 className="text-md mb-3 font-semibold text-white">Team: {teamKey}</h4>
      <div className="flex flex-wrap gap-4">
        {(team.pokemonNames || []).map((pokemonName) => {
          const spriteUrl = getSpriteUrlByName(pokemonName);
          const isPokemonSelected = selectedPokemon === pokemonName;

          return (
            <button
              key={pokemonName}
              className={`relative flex flex-col items-center rounded-lg border-2 p-2 transition-all duration-200 ease-in-out ${isPokemonSelected ? "border-green-500 bg-green-900/30 shadow-lg" : "border-gray-700 bg-gray-800 hover:border-green-500 hover:bg-gray-700"} focus:ring-opacity-50 focus:ring-2 focus:ring-green-500 focus:outline-none`}
              onClick={() => onSelectPokemon(pokemonName)}
            >
              {spriteUrl ? (
                <img
                  src={spriteUrl}
                  alt={pokemonName}
                  className="mb-1 h-16 w-16 object-contain"
                />
              ) : (
                <div className="mb-1 flex h-16 w-16 items-center justify-center rounded bg-gray-600 text-xs text-gray-300">
                  No Sprite
                </div>
              )}
              <span
                className={`text-xs font-medium ${isPokemonSelected ? "text-green-300" : "text-white"}`}
              >
                {pokemonName}
              </span>
              {isPokemonSelected && (
                <div className="absolute top-0 right-0 rounded-bl-lg bg-green-900/50 px-1 py-0.5 text-xs font-bold text-green-400">
                  ✓
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
