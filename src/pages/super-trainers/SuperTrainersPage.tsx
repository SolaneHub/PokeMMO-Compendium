import { Swords } from "lucide-react";
import { useState } from "react";

import PageLayout from "@/components/PageLayout";
import StrategyModal from "@/components/StrategyModal";
import TrainerStrategySection from "@/components/TrainerStrategySection";
import { usePokedexContext } from "@/context/PokedexContext";
import { useStrategyNavigation } from "@/hooks/useStrategyNavigation";
import { useSuperTrainersData } from "@/pages/super-trainers/hooks/useSuperTrainersData";
import { FEATURE_CONFIG } from "@/utils/featureConfig";
import { getPokemonBackgroundStyle } from "@/utils/pokemonColors";

function SuperTrainersPage() {
  const accentColor = FEATURE_CONFIG["super-trainers"].color;
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);

  const { pokemonMap, isLoading: pokedexLoading } = usePokedexContext();
  const {
    superTrainersData,
    isLoading: trainersLoading,
    error: trainersError,
  } = useSuperTrainersData();

  const {
    currentStrategyView,
    strategyHistory,
    initializeStrategy,
    navigateToStep,
    navigateBack,
  } = useStrategyNavigation();

  const isLoading = pokedexLoading || trainersLoading;

  const currentPokemonObject = selectedPokemon
    ? pokemonMap.get(selectedPokemon)
    : null;

  const detailsTitleBackground = currentPokemonObject
    ? getPokemonBackgroundStyle(currentPokemonObject.types || [])
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

  if (trainersError) {
    return (
      <PageLayout title="Super Trainers">
        <div className="flex h-64 flex-col items-center justify-center text-center text-red-400">
          <p className="text-lg font-semibold">
            Failed to load Super Trainers data.
          </p>
          <p className="mt-1 text-sm text-slate-400">{trainersError.message}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Super Trainers">
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
          <TrainerStrategySection
            key={trainer.name}
            name={trainer.name}
            subtitle={`${trainer.region} Trainer`}
            type={trainer.type}
            image={trainer.image}
            teams={trainer.teams}
            region={trainer.region}
            selectedPokemon={selectedPokemon}
            pokemonMap={pokemonMap}
            onPokemonCardClick={handlePokemonCardClick}
          />
        ))}
      </div>

      {/* Strategy Modal */}
      {isPokemonDetailsVisible &&
        currentPokemonObject &&
        currentPokemonObject.id !== null && (
          <StrategyModal
            currentPokemonObject={currentPokemonObject}
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
