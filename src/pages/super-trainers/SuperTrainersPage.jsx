import { Swords } from "lucide-react";
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
    <div className="animate-[fade-in_0.4s_ease-out] rounded-2xl border border-white/5 bg-[#1e2025] p-4 shadow-lg md:p-6">
      <div className="mb-6 flex flex-col items-center gap-4 md:flex-row">
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-4 border-blue-500 shadow-md md:h-32 md:w-32">
          <img
            src={`${import.meta.env.BASE_URL}trainers/${trainer.image}`}
            alt={trainer.name}
            className="h-full w-full object-cover object-top"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/128x128/cccccc/333333?text=${trainer.name}`;
            }}
          />
        </div>
        <div className="text-center md:text-left">
          <h2 className="m-0 text-3xl font-bold text-white">{trainer.name}</h2>
          <p className="m-0 text-lg text-blue-400">{trainer.region} Trainer</p>
          {trainer.type && (
            <span
              className="mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold text-[#1a1b20]"
              style={{ backgroundColor: trainerBackground }}
            >
              {trainer.type}
            </span>
          )}
        </div>
      </div>

      {teamNames.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-3 text-center text-xl font-semibold text-slate-300 md:text-left">
            Teams
          </h3>
          <div className="mb-4 flex flex-wrap justify-center gap-3 md:justify-start">
            {teamNames.map((teamName) => (
              <button
                key={teamName}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  activeTeam === teamName
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
                } `}
                onClick={() => setActiveTeam(teamName)}
              >
                {teamName}
              </button>
            ))}
          </div>

          {pokemonNamesForSelectedTeam.length > 0 && (
            <div>
              <h3 className="mb-3 text-center text-xl font-semibold text-slate-300 md:text-left">
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
      <div className="mb-3 flex w-full">
        <div className="w-full rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-center text-sm font-medium text-red-200 shadow-sm">
          ⚠️ {warningText}
        </div>
      </div>
    ) : null;

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-24">
      <PageTitle title="PokéMMO Compendium: Super Trainers" />

      {/* Header */}
      <div className="mb-8 flex flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <Swords className="text-orange-500" size={32} />
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
          className="fixed inset-0 z-[100] flex animate-[fade-in_0.2s_ease-out] items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsPokemonDetailsVisible(false)}
        >
          <div
            className="relative flex max-h-[85vh] w-[500px] max-w-[90vw] animate-[scale-in_0.3s_ease-out] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a1b20] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="z-10 flex shrink-0 justify-center p-4"
              style={{ background: detailsTitleBackground }}
            >
              <h2 className="m-0 text-xl font-bold text-[#1a1b20] drop-shadow-sm">
                {currentPokemonObject.name}
              </h2>
            </div>

            {/* Modal Content */}
            <div
              id="pokemon-details-content"
              className="flex-1 overflow-y-auto bg-[#1a1b20] p-6"
            >
              <div className="flex flex-col gap-4">
                {strategyHistory.length > 0 && (
                  <button
                    className="mb-2 flex items-center gap-2 self-start rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                    onClick={handleBackClick}
                  >
                    ⬅️ Back
                  </button>
                )}

                {currentStrategyView.length === 0 ? (
                  <p className="py-8 text-center text-slate-500 italic">
                    No strategy available for this Pokémon.
                  </p>
                ) : (
                  currentStrategyView.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex animate-[fade-in_0.3s_ease-out] flex-col"
                      >
                        {(item.type === "main" || item.type === "step") && (
                          <>
                            {item.player && (
                              <div
                                className={`mb-3 rounded-xl border p-4 ${
                                  item.type === "main"
                                    ? "border-white/5 bg-[#25272e] shadow-sm"
                                    : "border-transparent bg-transparent"
                                }`}
                              >
                                <p className="m-0 text-center text-base leading-relaxed text-slate-200">
                                  <MoveColoredText text={item.player} />
                                </p>
                              </div>
                            )}
                            {renderWarning(item.warning)}
                          </>
                        )}

                        {item.variations && (
                          <div className="my-2 flex flex-col gap-2.5 border-l-2 border-white/5 pl-4">
                            {item.variations.map((v, vi) => (
                              <button
                                key={vi}
                                className="group w-full rounded-xl border border-white/5 bg-[#25272e] p-3 text-left text-slate-300 transition-all hover:border-blue-500/50 hover:bg-[#2d3038] hover:text-blue-200"
                                onClick={() => handleStepClick(v)}
                              >
                                <p className="m-0 flex items-center justify-between text-sm font-semibold">
                                  {v.name}
                                  <span className="text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
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
