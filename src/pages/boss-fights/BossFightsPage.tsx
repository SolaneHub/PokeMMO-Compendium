import { Skull } from "lucide-react";
import { useState } from "react";

import PageLayout from "@/components/PageLayout";
import StrategyModal from "@/components/StrategyModal";
import TrainerStrategySection from "@/components/TrainerStrategySection";
import { usePokedexContext } from "@/context/PokedexContext";
import { useStrategyNavigation } from "@/hooks/useStrategyNavigation";
import { useBossFightsData } from "@/pages/boss-fights/hooks/useBossFightsData";
import { FEATURE_CONFIG } from "@/utils/featureConfig";
import { getPokemonBackgroundStyle } from "@/utils/pokemonColors";

function BossFightsPage() {
  const accentColor = FEATURE_CONFIG["boss-fights"].color;
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);

  const { pokemonMap, isLoading: isPokedexLoading } = usePokedexContext();
  const {
    bossFightsData,
    isLoading: isBossFightsLoading,
    error: bossFightsError,
  } = useBossFightsData();

  const {
    currentStrategyView,
    strategyHistory,
    initializeStrategy,
    navigateToStep,
    navigateBack,
  } = useStrategyNavigation();

  const currentPokemonObject = selectedPokemon
    ? pokemonMap.get(selectedPokemon)
    : null;

  const detailsTitleBackground = currentPokemonObject
    ? getPokemonBackgroundStyle(currentPokemonObject.types || [])
    : "#333";

  const handlePokemonCardClick = (
    pokemonName: string,
    bossFightName: string,
    bossFightRegion: string,
    teamName: string
  ) => {
    setSelectedPokemon(pokemonName);
    setIsPokemonDetailsVisible(true);

    const bossFight = bossFightsData.find(
      (bf) => bf.name === bossFightName && bf.region === bossFightRegion
    );
    const team = bossFight?.teams[teamName];
    const strategies = team?.pokemonStrategies[pokemonName] || [];

    const formattedStrategy = strategies.map((s, index) => {
      if (typeof s === "string") {
        return {
          id: `${pokemonName}-step-${index}`,
          type: "text",
          description: s,
        };
      }
      return s;
    });

    initializeStrategy(formattedStrategy);
  };

  if (isPokedexLoading || isBossFightsLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        <p>Loading Boss Fights data...</p>
      </div>
    );
  }

  if (bossFightsError) {
    return (
      <PageLayout title="Boss Fights">
        <div className="flex h-64 flex-col items-center justify-center text-center text-red-400">
          <p className="text-lg font-semibold">
            Failed to load Boss Fights data.
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {bossFightsError.message}
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Boss Fights">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-100">
          <Skull style={{ color: accentColor }} size={32} />
          Boss Fights Strategies
        </h1>
        <p className="text-slate-400">
          Detailed strategies for defeating the Boss Fights.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {bossFightsData.map((bossFight) => (
          <TrainerStrategySection
            key={`${bossFight.region}-${bossFight.name}`}
            name={bossFight.name}
            subtitle={bossFight.region}
            type={bossFight.type}
            image={bossFight.image}
            teams={bossFight.teams}
            region={bossFight.region}
            selectedPokemon={selectedPokemon}
            pokemonMap={pokemonMap}
            onPokemonCardClick={handlePokemonCardClick}
          />
        ))}
      </div>

      {isPokemonDetailsVisible && currentPokemonObject && (
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

export default BossFightsPage;
