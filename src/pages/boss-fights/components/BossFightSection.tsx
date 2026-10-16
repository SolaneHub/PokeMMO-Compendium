import TrainerStrategySection from "@/components/TrainerStrategySection";
import { BossFight } from "@/types/bossFights";
import { Pokemon } from "@/types/pokemon";

export interface BossFightSectionProps {
  bossFight: BossFight;
  onPokemonCardClick: (
    pokemonName: string,
    bossName: string,
    region: string,
    teamName: string
  ) => void;
  selectedPokemon: string | null;
  pokemonMap: Map<string, Pokemon>;
}

const BossFightSection = ({
  bossFight,
  onPokemonCardClick,
  selectedPokemon,
  pokemonMap,
}: BossFightSectionProps) => {
  return (
    <TrainerStrategySection
      name={bossFight.name}
      subtitle={bossFight.region}
      type={bossFight.type}
      image={bossFight.image}
      teams={bossFight.teams}
      region={bossFight.region}
      selectedPokemon={selectedPokemon}
      pokemonMap={pokemonMap}
      onPokemonCardClick={onPokemonCardClick}
    />
  );
};

export default BossFightSection;
