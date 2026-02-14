import { Swords } from "lucide-react";
import { useState } from "react";

import StrategyModal from "@/components/organisms/StrategyModal";
import SuperTrainerSection from "@/components/organisms/SuperTrainerSection";
import PageLayout from "@/components/templates/PageLayout";
import { usePokedexData } from "@/hooks/usePokedexData";
import { useStrategyNavigation } from "@/hooks/useStrategyNavigation";
import { useSuperTrainersData } from "@/hooks/useSuperTrainersData";
import {
  getPokemonBackground,
  getPokemonByName,
} from "@/services/pokemonService";
import { Pokemon } from "@/types/pokemon";
import { FEATURE_CONFIG } from "@/utils/featureConfig";

function SuperTrainersPage() {
  const accentColor = FEATURE_CONFIG["super-trainers"].color;
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);

  const { pokemonMap, isLoading: pokedexLoading } = usePokedexData();
  const { superTrainersData, isLoading: trainersLoading } =
    useSuperTrainersData();

  const {
    currentStrategyView,
    strategyHistory,
    initializeStrategy,
    navigateToStep,
    navigateBack,
  } = useStrategyNavigation();

  const isLoading = pokedexLoading || trainersLoading;

  const currentPokemonObject = selectedPokemon
    ? getPokemonByName(selectedPokemon, pokemonMap)
    : null;
  const detailsTitleBackground = selectedPokemon
    ? getPokemonBackground(selectedPokemon, pokemonMap)
    : "#333";

  const handlePokemonCardClick = (
    pokemonName: string,
    trainerName: string,
    trainerRegion: string,
    teamName: string
  ) => {
    const trainer = superTrainersData.find(
      (t) => t.name === trainerName && t.region === trainerRegion
    );
    const team = trainer?.teams?.[teamName];
    const strategy = team?.pokemonStrategies?.[pokemonName] || [];

    if (strategy && strategy.length > 0) {
      setSelectedPokemon(pokemonName);
      setIsPokemonDetailsVisible(true);
      initializeStrategy(strategy);
    } else {
      setIsPokemonDetailsVisible(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        <p>Loading Super Trainers data...</p>
      </div>
    );
  }

  return (
    <PageLayout title="Super Trainers" accentColor={accentColor}>
      {/* Header */}
      <div className="mb-8 flex flex-col items-center space-y-2 text-center text-white">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <Swords style={{ color: accentColor }} size={32} />
          Super Trainers Strategies
        </h1>
        <p className="text-slate-400">
          Detailed strategies for defeating the Super Trainers.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {superTrainersData.map((trainer) => (
          <SuperTrainerSection
            key={trainer.name}
            trainer={trainer}
            onPokemonCardClick={handlePokemonCardClick}
            selectedPokemon={selectedPokemon}
            pokemonMap={pokemonMap}
          />
        ))}
      </div>

      {/* Strategy Modal */}
      {isPokemonDetailsVisible &&
        currentPokemonObject &&
        currentPokemonObject.id !== null && (
          <StrategyModal
            currentPokemonObject={currentPokemonObject as Pokemon}
            detailsTitleBackground={detailsTitleBackground}
            strategyHistory={strategyHistory}
            currentStrategyView={currentStrategyView}
            onClose={() => setIsPokemonDetailsVisible(false)}
            onBack={navigateBack}
            onStepClick={navigateToStep}
          />
        )}
    </PageLayout>
  );
}

export default SuperTrainersPage;
