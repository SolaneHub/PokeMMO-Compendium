import TrainerStrategySection from "@/components/TrainerStrategySection";
import { Pokemon } from "@/types/pokemon";
import { SuperTrainer } from "@/types/superTrainers";

export interface SuperTrainerSectionProps {
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
  return (
    <TrainerStrategySection
      name={trainer.name}
      subtitle={`${trainer.region} Trainer`}
      type={trainer.type}
      image={trainer.image}
      teams={trainer.teams}
      region={trainer.region}
      selectedPokemon={selectedPokemon}
      pokemonMap={pokemonMap}
      onPokemonCardClick={onPokemonCardClick}
    />
  );
};

export default SuperTrainerSection;
