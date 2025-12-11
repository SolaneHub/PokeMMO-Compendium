import { useState } from "react";

import {
  getPokemonListForTeam,
  getTeamNamesForBossFight,
} from "@/pages/boss-fights/data/bossFightsService";
import { getPokemonCardData } from "@/pages/pokedex/data/pokemonService";
import PokemonCard from "@/shared/components/PokemonCard";
import { typeBackgrounds } from "@/shared/utils/pokemonColors";

const BossFightSection = ({
  bossFight,
  onPokemonCardClick,
  selectedPokemon,
}) => {
  const teamKeys = Object.keys(bossFight.teams || {});
  const [activeTeam, setActiveTeam] = useState(teamKeys[0] ?? null);
  const teamNames = getTeamNamesForBossFight(bossFight.name, bossFight.region);
  const pokemonNamesForSelectedTeam = getPokemonListForTeam(
    bossFight.name,
    bossFight.region,
    activeTeam
  );

  const bossBackground = typeBackgrounds[bossFight.type] || typeBackgrounds[""];

  return (
    <div className="animate-[fade-in_0.4s_ease-out] rounded-2xl border border-white/5 bg-[#1e2025] p-4 shadow-lg md:p-6">
      <div className="mb-6 flex flex-col items-center gap-4 md:flex-row">
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-4 border-red-500 shadow-md md:h-32 md:w-32">
          <img
            src={`${import.meta.env.BASE_URL}trainers/${bossFight.image}`}
            alt={bossFight.name}
            className="h-full w-full object-cover object-top"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/128x128/cccccc/333333?text=${bossFight.name}`;
            }}
          />
        </div>
        <div className="text-center md:text-left">
          <h2 className="m-0 text-3xl font-bold text-white">
            {bossFight.name}
          </h2>
          <p className="m-0 text-lg text-red-400">
            {bossFight.region} Boss Fight
          </p>
          {bossFight.type && (
            <span
              className="mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold text-[#1a1b20]"
              style={{ backgroundColor: bossBackground }}
            >
              {bossFight.type}
            </span>
          )}
        </div>
      </div>

      {teamNames.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-3 text-center text-xl font-semibold text-slate-300 md:text-left">
            Teams
          </h3>
          <div className="mb-4 flex flex-wrap justify-center gap-3 md:justify-start">
            {teamNames.map((teamName) => (
              <button
                key={teamName}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  activeTeam === teamName
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
                } `}
                onClick={() => setActiveTeam(teamName)}
              >
                {teamName}
              </button>
            ))}
          </div>

          {pokemonNamesForSelectedTeam.length > 0 && (
            <div>
              <h3 className="mb-3 text-center text-xl font-semibold text-slate-300 md:text-left">
                Pokémon for {activeTeam}
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {pokemonNamesForSelectedTeam.map((pokemonName) => {
                  const { sprite, background } =
                    getPokemonCardData(pokemonName);
                  return (
                    <PokemonCard
                      key={pokemonName}
                      pokemonName={pokemonName}
                      pokemonImageSrc={sprite}
                      nameBackground={background}
                      onClick={() =>
                        onPokemonCardClick(
                          pokemonName,
                          bossFight.name,
                          bossFight.region,
                          activeTeam
                        )
                      }
                      isSelected={selectedPokemon === pokemonName}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BossFightSection;
