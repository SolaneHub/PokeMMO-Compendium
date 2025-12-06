import { useState } from "react";

import {
  getPokemonBackground,
  getPokemonByName,
  getPokemonCardData,
} from "@/pages/pokedex/data/pokemonService";
import {
  getAllSuperTrainers,
  getPokemonListForTeam,
  getPokemonStrategy,
  getTeamNamesForSuperTrainer,
} from "@/pages/super-trainers/data/superTrainersService";
import MoveColoredText from "@/shared/components/MoveColoredText";
import PageTitle from "@/shared/components/PageTitle";
import PokemonCard from "@/shared/components/PokemonCard";
import { typeBackgrounds } from "@/shared/utils/pokemonColors";

const SuperTrainerSection = ({
  trainer,
  onPokemonCardClick,
  selectedPokemon,
}) => {
  const [activeTeam, setActiveTeam] = useState(
    Object.keys(trainer.teams || {})[0]
  );
  const teamNames = getTeamNamesForSuperTrainer(trainer.name, trainer.region);
  const pokemonNamesForSelectedTeam = getPokemonListForTeam(
    trainer.name,
    trainer.region,
    activeTeam
  );

  const trainerBackground =
    typeBackgrounds[trainer.type] || typeBackgrounds[""];

  return (
    <div className="bg-[#1e2025] rounded-2xl p-4 md:p-6 shadow-lg border border-white/5 animate-[fade-in_0.4s_ease-out]">
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-md flex-shrink-0">
          <img
            src={`/PokeMMO-Compendium/trainers/${trainer.image}`}
            alt={trainer.name}
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/128x128/cccccc/333333?text=${trainer.name}`;
            }}
          />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-white m-0">{trainer.name}</h2>
          <p className="text-blue-400 text-lg m-0">{trainer.region} Trainer</p>
          {trainer.type && (
            <span
              className="inline-block px-3 py-1 mt-2 rounded-full text-sm font-semibold text-[#1a1b20]"
              style={{ backgroundColor: trainerBackground }}
            >
              {trainer.type}
            </span>
          )}
        </div>
      </div>

      {teamNames.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-slate-300 mb-3 text-center md:text-left">
            Teams
          </h3>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
            {teamNames.map((teamName) => (
              <button
                key={teamName}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors
                  ${
                    activeTeam === teamName
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
                  }
                `}
                onClick={() => setActiveTeam(teamName)}
              >
                {teamName}
              </button>
            ))}
          </div>

          {pokemonNamesForSelectedTeam.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-slate-300 mb-3 text-center md:text-left">
                Pokémon for {activeTeam}
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {pokemonNamesForSelectedTeam.map((pokemonName) => {
                  const { sprite, background } =
                    getPokemonCardData(pokemonName);
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

function SuperTrainersPage() {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);
  const [currentStrategyView, setCurrentStrategyView] = useState([]);
  const [strategyHistory, setStrategyHistory] = useState([]);

  // Store the context for fetching Pokémon strategy in the modal
  const allSuperTrainers = getAllSuperTrainers();

  const currentPokemonObject = selectedPokemon
    ? getPokemonByName(selectedPokemon)
    : null;
  const detailsTitleBackground = selectedPokemon
    ? getPokemonBackground(selectedPokemon)
    : "#333";

  const handlePokemonCardClick = (
    pokemonName,
    trainerName,
    trainerRegion,
    teamName
  ) => {
    setSelectedPokemon(pokemonName);
    setIsPokemonDetailsVisible(true);
    // setStrategyContext({ trainerName, trainerRegion, teamName, pokemonName }); // Removed unused setter

    const strategy = getPokemonStrategy(
      trainerName,
      trainerRegion,
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

  const renderWarning = (warningText) =>
    warningText ? (
      <div className="w-full flex mb-3">
        <div className="w-full bg-red-500/10 border border-red-500/50 rounded-xl shadow-sm text-red-200 text-sm font-medium p-3 text-center">
          ⚠️ {warningText}
        </div>
      </div>
    ) : null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24">
      <PageTitle title="PokéMMO Compendium: Super Trainers" />

      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-white">
          Super Trainers Strategies
        </h1>
        <p className="text-slate-400">
          Detailed strategies for defeating the Super Trainers.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {allSuperTrainers.map((trainer) => (
          <SuperTrainerSection
            key={trainer.name}
            trainer={trainer}
            onPokemonCardClick={handlePokemonCardClick}
            selectedPokemon={selectedPokemon}
          />
        ))}
      </div>

      {/* Strategy Modal */}
      {isPokemonDetailsVisible && currentPokemonObject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"
          onClick={() => setIsPokemonDetailsVisible(false)}
        >
          <div
            className="relative w-[500px] max-w-[90vw] max-h-[85vh] flex flex-col bg-[#1a1b20] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-[scale-in_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex justify-center p-4 z-10 shrink-0"
              style={{ background: detailsTitleBackground }}
            >
              <h2 className="text-[#1a1b20] font-bold text-xl m-0 drop-shadow-sm">
                {currentPokemonObject.name}
              </h2>
            </div>

            {/* Modal Content */}
            <div
              id="pokemon-details-content"
              className="flex-1 overflow-y-auto p-6 bg-[#1a1b20]"
            >
              <div className="flex flex-col gap-4">
                {strategyHistory.length > 0 && (
                  <button
                    className="self-start mb-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2 text-sm font-medium"
                    onClick={handleBackClick}
                  >
                    ⬅️ Back
                  </button>
                )}

                {currentStrategyView.length === 0 ? (
                  <p className="text-slate-500 text-center italic py-8">
                    No strategy available for this Pokémon.
                  </p>
                ) : (
                  currentStrategyView.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-col animate-[fade-in_0.3s_ease-out]"
                      >
                        {(item.type === "main" || item.type === "step") && (
                          <>
                            {item.player && (
                              <div
                                className={`mb-3 p-4 rounded-xl border ${
                                  item.type === "main"
                                    ? "bg-[#25272e] border-white/5 shadow-sm"
                                    : "bg-transparent border-transparent"
                                }`}
                              >
                                <p className="text-slate-200 text-center m-0 text-base leading-relaxed">
                                  <MoveColoredText text={item.player} />
                                </p>
                              </div>
                            )}
                            {renderWarning(item.warning)}
                          </>
                        )}

                        {item.variations && (
                          <div className="flex flex-col gap-2.5 pl-4 border-l-2 border-white/5 my-2">
                            {item.variations.map((v, vi) => (
                              <button
                                key={vi}
                                className="w-full text-left p-3 bg-[#25272e] border border-white/5 rounded-xl text-slate-300 hover:bg-[#2d3038] hover:border-blue-500/50 hover:text-blue-200 transition-all group"
                                onClick={() => handleStepClick(v)}
                              >
                                <p className="m-0 text-sm font-semibold flex items-center justify-between">
                                  {v.name}
                                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400">
                                    →
                                  </span>
                                </p>
                                {renderWarning(v.warning)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperTrainersPage;
