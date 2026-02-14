import { useState } from "react";

import Button from "@/components/atoms/Button";
import PokemonCard from "@/components/molecules/PokemonCard";
import { getPokemonCardData } from "@/services/pokemonService";
import { Pokemon } from "@/types/pokemon";
import { SuperTrainer } from "@/types/superTrainers";
import { typeBackgrounds } from "@/utils/pokemonColors";

interface SuperTrainerSectionProps {
  trainer: SuperTrainer;
  onPokemonCardClick: (
    pokemonName: string,
    trainerName: string,
    region: string,
    teamName: string
  ) => void;
  selectedPokemon: string | null;
  pokemonMap: Map<string, Pokemon>;
}

const SuperTrainerSection = ({
  trainer,
  onPokemonCardClick,
  selectedPokemon,
  pokemonMap,
}: SuperTrainerSectionProps) => {
  const [activeTeam, setActiveTeam] = useState<string | null>(
    Object.keys(trainer.teams || {})[0] || null
  );

  const teamNames = Object.keys(trainer.teams || {}).sort();
  const pokemonNamesForSelectedTeam = activeTeam
    ? trainer.teams?.[activeTeam]?.pokemonNames || []
    : [];

  const trainerBackground =
    (typeBackgrounds as Record<string, string>)[trainer.type] ||
    typeBackgrounds[""];

  return (
    <div className="animate-[fade-in_0.4s_ease-out] rounded-2xl border border-white/5 bg-[#1a1b20] p-4 text-white shadow-lg md:p-6">
      <div className="mb-6 flex flex-col items-center gap-4 md:flex-row">
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-4 border-blue-500 shadow-md md:h-32 md:w-32">
          <img
            src={`${import.meta.env.BASE_URL}trainers/${trainer.image}`}
            alt={trainer.name}
            className="h-full w-full object-cover object-top"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://placehold.co/128x128/cccccc/333333?text=${trainer.name}`;
            }}
          />
        </div>
        <div className="text-center md:text-left">
          <h2 className="m-0 text-3xl font-bold"> {trainer.name} </h2>
          <p className="m-0 text-lg text-blue-400">{trainer.region} Trainer</p>
          {trainer.type && (
            <span
              className="mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold text-[#1a1b20]"
              style={{ backgroundColor: trainerBackground }}
            >
              {trainer.type}
            </span>
          )}
        </div>
      </div>

      {teamNames.length > 0 && (
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

          {pokemonNamesForSelectedTeam.length > 0 && activeTeam && (
            <div>
              <h3 className="mb-3 text-center text-xl font-semibold md:text-left">
                Pokémon for {activeTeam}
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {pokemonNamesForSelectedTeam.map((pokemonName) => {
                  const { sprite, background } = getPokemonCardData(
                    pokemonName,
                    pokemonMap
                  );
                  return (
                    <PokemonCard
                      key={pokemonName}
                      pokemonName={pokemonName}
                      pokemonImageSrc={sprite}
                      nameBackground={background}
                      onClick={() =>
                        onPokemonCardClick(
                          pokemonName,
                          trainer.name,
                          trainer.region,
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

export default SuperTrainerSection;
