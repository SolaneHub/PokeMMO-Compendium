import { Skull } from "lucide-react";
import { useState } from "react";

import BossFightSection from "@/pages/boss-fights/components/BossFightSection";
import {
  getAllBossFights,
  getPokemonStrategy,
} from "@/pages/boss-fights/data/bossFightsService";
import {
  getPokemonBackground,
  getPokemonByName,
} from "@/pages/pokedex/data/pokemonService";
import PageTitle from "@/shared/components/PageTitle";
import StrategyModal from "@/shared/components/StrategyModal";
import { usePokedexData } from "@/shared/hooks/usePokedexData";

function BossFightsPage() {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);
  const [currentStrategyView, setCurrentStrategyView] = useState([]);
  const [strategyHistory, setStrategyHistory] = useState([]);

  const { pokemonMap, isLoading } = usePokedexData();

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
    setCurrentStrategyView(strategy);
    setStrategyHistory([]);
  };

  const handleStepClick = (item) => {
    if (item?.steps && Array.isArray(item.steps)) {
      setStrategyHistory((prev) => [...prev, currentStrategyView]);
      setCurrentStrategyView(item.steps);
      const modalContent = document.getElementById("pokemon-details-content");
      if (modalContent) modalContent.scrollTop = 0;
    }
  };

  const handleBackClick = () => {
    if (strategyHistory.length > 0) {
      setCurrentStrategyView(strategyHistory[strategyHistory.length - 1]);
      setStrategyHistory((prev) => prev.slice(0, -1));
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-200">
        <p>Loading Boss Fights data...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-24">
      <PageTitle title="PokéMMO Compendium: Boss Fights" />

      {/* Header */}
      <div className="mb-8 flex flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-100">
          <Skull className="text-red-400" size={32} />
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
          onBack={handleBackClick}
          onStepClick={handleStepClick}
        />
      )}
    </div>
  );
}

export default BossFightsPage;
