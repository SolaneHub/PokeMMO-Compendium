import { useState } from "react";

import PokemonCard from "@/components/PokemonCard";
import Button from "@/components/ui/Button";
import { Pokemon } from "@/types/pokemon";
import {
  getPokemonBackgroundStyle,
  PokemonType,
  typeBackgrounds,
} from "@/utils/pokemonColors";
import { getSpriteUrlByName } from "@/utils/pokemonImageHelper";

export interface TrainerStrategySectionProps {
  name: string;
  subtitle: string;
  type?: string | undefined;
  image?: string | undefined;
  imageFallbackText?: string | undefined;
  teams?: Record<string, { pokemonNames?: string[] }> | undefined;
  selectedPokemon: string | null;
  pokemonMap: Map<string, Pokemon>;
  onPokemonCardClick: (
    pokemonName: string,
    name: string,
    region: string,
    teamName: string
  ) => void;
  region: string;
}

const TrainerStrategySection = ({
  name,
  subtitle,
  type,
  image,
  imageFallbackText,
  teams,
  selectedPokemon,
  pokemonMap,
  onPokemonCardClick,
  region,
}: TrainerStrategySectionProps) => {
  const teamNames = Object.keys(teams || {}).sort((a, b) => a.localeCompare(b));
  const [activeTeam, setActiveTeam] = useState<string | null>(
    teamNames[0] ?? null
  );
  const pokemonNamesForSelectedTeam = activeTeam
    ? teams?.[activeTeam]?.pokemonNames || []
    : [];

  const backgroundStyle =
    type && type in typeBackgrounds
      ? typeBackgrounds[type as PokemonType]
      : typeBackgrounds[""];
  const fallbackText = imageFallbackText || name;

  return (
    <div className="animate-[fade-in_0.4s_ease-out] rounded-2xl border border-white/5 bg-[#1a1b20] p-4 text-white shadow-lg md:p-6">
      <div className="mb-6 flex flex-col items-center gap-4 md:flex-row">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-blue-500 shadow-md md:h-32 md:w-32">
          {image && (
            <img
              src={`${import.meta.env.BASE_URL}trainers/${image}`}
              alt={name}
              className="h-full w-full object-cover object-top"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://placehold.co/128x128/cccccc/333333?text=${fallbackText}`;
              }}
            />
          )}
        </div>
        <div className="text-center md:text-left">
          <h2 className="m-0 text-3xl font-bold"> {name} </h2>
          <p className="m-0 text-lg text-blue-400">{subtitle}</p>
          {type && (
            <span
              className="mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold text-[#1a1b20]"
              style={{ background: backgroundStyle }}
            >
              {type}
            </span>
          )}
        </div>
      </div>

      {teamNames.length > 0 && activeTeam && (
        <div className="mb-4">
          <h3 className="mb-3 text-center text-xl font-semibold md:text-left">
            Teams
          </h3>
          <div className="mb-4 flex flex-wrap justify-center gap-3 md:justify-start">
            {teamNames.map((teamName) => (
              <Button
                key={teamName}
                variant={activeTeam === teamName ? "primary" : "secondary"}
                size="sm"
                onClick={() => setActiveTeam(teamName)}
                className="rounded-full"
              >
                {teamName}
              </Button>
            ))}
          </div>

          {pokemonNamesForSelectedTeam.length > 0 && (
            <div>
              <h3 className="mb-3 text-center text-xl font-semibold md:text-left">
                Pokémon for {activeTeam}
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {pokemonNamesForSelectedTeam.map((pokemonName) => {
                  const pokemon = pokemonMap.get(pokemonName);
                  const background = getPokemonBackgroundStyle(
                    pokemon?.types || []
                  );
                  const sprite = getSpriteUrlByName(pokemonName);

                  return (
                    <PokemonCard
                      key={pokemonName}
                      pokemonName={pokemonName}
                      pokemonImageSrc={sprite}
                      nameBackground={background}
                      onClick={() =>
                        onPokemonCardClick(
                          pokemonName,
                          name,
                          region,
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

export default TrainerStrategySection;
