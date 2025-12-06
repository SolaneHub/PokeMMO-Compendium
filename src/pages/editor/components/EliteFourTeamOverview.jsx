import { getSpriteUrlByName } from "@/shared/utils/pokemonImageHelper";

const EliteFourTeamOverview = ({
  teamKey,
  team,
  selectedPokemon,
  onSelectPokemon,
}) => {
  return (
    <div className="bg-[#252526] border border-[#333] border-t-4 border-t-pink-500 rounded-md p-5 shadow-md mb-5">
      <h4 className="text-white text-md font-semibold mb-3">Team: {teamKey}</h4>
      <div className="flex flex-wrap gap-4">
        {team.pokemonNames.map((pokemonName) => {
          const spriteUrl = getSpriteUrlByName(pokemonName);
          const isPokemonSelected = selectedPokemon === pokemonName;

          return (
            <button
              key={pokemonName}
              className={`relative flex flex-col items-center p-2 rounded-lg border-2 transition-all duration-200 ease-in-out
                ${isPokemonSelected ? "border-green-500 bg-green-900/30 shadow-lg" : "border-gray-700 bg-gray-800 hover:border-green-500 hover:bg-gray-700"}
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
              onClick={() => onSelectPokemon(pokemonName)}
            >
              {spriteUrl ? (
                <img
                  src={spriteUrl}
                  alt={pokemonName}
                  className="w-16 h-16 object-contain mb-1"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-gray-600 rounded mb-1 text-xs text-gray-300">
                  No Sprite
                </div>
              )}
              <span
                className={`text-xs font-medium ${isPokemonSelected ? "text-green-300" : "text-white"}`}
              >
                {pokemonName}
              </span>
              {isPokemonSelected && (
                <div className="absolute top-0 right-0 text-green-400 text-xs font-bold px-1 py-0.5 rounded-bl-lg bg-green-900/50">
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
