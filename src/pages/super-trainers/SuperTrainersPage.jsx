import { Swords } from "lucide-react";
import { useState } from "react";

import {
  getPokemonBackground,
  getPokemonByName,
} from "@/pages/pokedex/data/pokemonService";
import SuperTrainerSection from "@/pages/super-trainers/components/SuperTrainerSection";
import PageTitle from "@/shared/components/PageTitle";
import StrategyModal from "@/shared/components/StrategyModal";
import { usePokedexData } from "@/shared/hooks/usePokedexData";
import { useSuperTrainersData } from "@/shared/hooks/useSuperTrainersData";

function SuperTrainersPage() {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);
  const [currentStrategyView, setCurrentStrategyView] = useState([]);
  const [strategyHistory, setStrategyHistory] = useState([]);

  const { pokemonMap, isLoading: pokedexLoading } = usePokedexData();
  const { superTrainersData, isLoading: trainersLoading } =
    useSuperTrainersData();

  const isLoading = pokedexLoading || trainersLoading;

  const currentPokemonObject = selectedPokemon
    ? getPokemonByName(selectedPokemon, pokemonMap)
    : null;
  const detailsTitleBackground = selectedPokemon
    ? getPokemonBackground(selectedPokemon, pokemonMap)
    : "#333";

  const handlePokemonCardClick = (
    pokemonName,
    trainerName,
    trainerRegion,
    teamName
  ) => {
    const trainer = superTrainersData.find(
      (t) => t.name === trainerName && t.region === trainerRegion
    );
    const team = trainer?.teams?.[teamName];
    const strategy = team?.pokemonStrategies?.[pokemonName] || [];

    if (strategy && strategy.length > 0) {
      setSelectedPokemon(pokemonName);
      setIsPokemonDetailsVisible(true);
      setCurrentStrategyView(strategy);
      setStrategyHistory([]);
    } else {
      setIsPokemonDetailsVisible(false);
    }
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
        <p>Loading Super Trainers data...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-24">
      <PageTitle title="PokéMMO Compendium: Super Trainers" />

      {/* Header */}
      <div className="mb-8 flex flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-100">
          <Swords className="text-blue-400" size={32} />
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

export default SuperTrainersPage;
