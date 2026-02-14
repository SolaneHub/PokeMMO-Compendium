import { Skull } from "lucide-react";
import { useState } from "react";

import BossFightSection from "@/components/organisms/BossFightSection";
import StrategyModal from "@/components/organisms/StrategyModal";
import PageLayout from "@/components/templates/PageLayout";
import { useBossFightsData } from "@/hooks/useBossFightsData";
import { usePokedexData } from "@/hooks/usePokedexData";
import { useStrategyNavigation } from "@/hooks/useStrategyNavigation";
import {
  getPokemonBackground,
  getPokemonByName,
} from "@/services/pokemonService";
import { FEATURE_CONFIG } from "@/utils/featureConfig";

function BossFightsPage() {
  const accentColor = FEATURE_CONFIG["boss-fights"].color;
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);

  const { pokemonMap, isLoading: isPokedexLoading } = usePokedexData();
  const { bossFightsData, isLoading: isBossFightsLoading } =
    useBossFightsData();

  const {
    currentStrategyView,
    strategyHistory,
    initializeStrategy,
    navigateToStep,
    navigateBack,
  } = useStrategyNavigation();

  const currentPokemonObject = selectedPokemon
    ? getPokemonByName(selectedPokemon, pokemonMap)
    : null;
  const detailsTitleBackground = selectedPokemon
    ? getPokemonBackground(selectedPokemon, pokemonMap)
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

    const formattedStrategy = strategies.map((s, index) => ({
      id: `${pokemonName}-step-${index}`,
      type: "text",
      description: s,
    }));

    initializeStrategy(formattedStrategy);
  };

  if (isPokedexLoading || isBossFightsLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        <p>Loading Boss Fights data...</p>
      </div>
    );
  }

  return (
    <PageLayout title="Boss Fights" accentColor={accentColor}>
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
          <BossFightSection
            key={`${bossFight.region}-${bossFight.name}`}
            bossFight={bossFight}
            onPokemonCardClick={handlePokemonCardClick}
            selectedPokemon={selectedPokemon}
            pokemonMap={pokemonMap}
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
