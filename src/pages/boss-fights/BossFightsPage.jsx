import { Skull } from "lucide-react";
import { useState } from "react";

import BossFightSection from "@/components/organisms/BossFightSection";
import StrategyModal from "@/components/organisms/StrategyModal";
import PageLayout from "@/components/templates/PageLayout";
import { usePokedexData } from "@/hooks/usePokedexData";
import { useStrategyNavigation } from "@/hooks/useStrategyNavigation";
import {
  getAllBossFights,
  getPokemonStrategy,
} from "@/services/bossFightsService";
import {
  getPokemonBackground,
  getPokemonByName,
} from "@/services/pokemonService";
import { FEATURE_CONFIG } from "@/utils/featureConfig";

function BossFightsPage() {
  const accentColor = FEATURE_CONFIG["boss-fights"].color;
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);

  const { pokemonMap, isLoading } = usePokedexData();

  const {
    currentStrategyView,
    strategyHistory,
    initializeStrategy,
    navigateToStep,
    navigateBack,
  } = useStrategyNavigation();

  const allBossFights = getAllBossFights();

  const currentPokemonObject = selectedPokemon
    ? getPokemonByName(selectedPokemon, pokemonMap)
    : null;
  const detailsTitleBackground = selectedPokemon
    ? getPokemonBackground(selectedPokemon, pokemonMap)
    : "#333";

  const handlePokemonCardClick = (
    pokemonName,
    bossFightName,
    bossFightRegion,
    teamName
  ) => {
    setSelectedPokemon(pokemonName);
    setIsPokemonDetailsVisible(true);
    const strategy = getPokemonStrategy(
      bossFightName,
      bossFightRegion,
      teamName,
      pokemonName
    );
    initializeStrategy(strategy);
  };

  if (isLoading) {
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
        {allBossFights.map((bossFight) => (
          <BossFightSection
            key={bossFight.name}
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
