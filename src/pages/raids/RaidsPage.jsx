import { Users } from "lucide-react";
import { useState } from "react";

import { getPokemonCardData } from "@/pages/pokedex/data/pokemonService";
import PageTitle from "@/shared/components/PageTitle";
import PokemonCard from "@/shared/components/PokemonCard";
import { usePokedexData } from "@/shared/hooks/usePokedexData";
import { useRaidsData } from "@/shared/hooks/useRaidsData";

import RaidCard from "./components/RaidCard";
import RaidModal from "./components/RaidModal";

function RaidsPage() {
  const [selectedStar, setSelectedStar] = useState();
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);

  const { pokemonMap, isLoading: isPokedexLoading } = usePokedexData();
  const {
    raidsData,
    raidsMap,
    starLevels,
    isLoading: isRaidsLoading,
  } = useRaidsData();

  const isLoading = isPokedexLoading || isRaidsLoading;

  const filteredRaids = selectedStar
    ? raidsData.filter((r) => r.stars === selectedStar)
    : [];

  const closePokemonDetails = () => {
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
  };

  const handleStarClick = (star) => {
    setSelectedStar((prev) => (prev === star ? undefined : star));
    closePokemonDetails();
  };

  const handlePokemonCardClick = (pokemonName) => {
    setSelectedPokemon(pokemonName);
    setIsPokemonDetailsVisible(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-200">
        <p>Loading Raids data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 animate-[fade-in_0.3s_ease-out] flex-col overflow-x-hidden overflow-y-auto scroll-smooth p-4 lg:p-8">
      <div className="mx-auto w-full max-w-7xl flex-1 pb-24">
        <PageTitle title="PokéMMO Compendium: Raids" />

        {/* Header */}
        <div className="mb-8 flex flex-col items-center space-y-2 text-center">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-200">
            <Users className="text-blue-400" size={32} />
            Raid Strategies
          </h1>
          <p className="text-slate-400">
            Detailed strategies for defeating various raids.
          </p>
        </div>

        <div className="my-8 flex flex-wrap justify-center gap-4">
          {starLevels.map((star) => (
            <RaidCard
              key={star}
              raid={{ name: `${star}★` }}
              onRaidClick={() => handleStarClick(star)}
              isSelected={selectedStar === star}
              displayValue={`${star}★`}
              isCompact={true}
            />
          ))}
        </div>

        {selectedStar && filteredRaids.length > 0 && (
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            {filteredRaids.map((raid) => {
              const { sprite, background } = getPokemonCardData(
                raid.name,
                pokemonMap
              );
              return (
                <PokemonCard
                  key={raid.name}
                  pokemonName={raid.name}
                  pokemonImageSrc={sprite}
                  nameBackground={background}
                  onClick={() => handlePokemonCardClick(raid.name)}
                  isSelected={selectedPokemon === raid.name}
                />
              );
            })}
          </div>
        )}

        {isPokemonDetailsVisible && selectedPokemon && (
          <RaidModal
            raidName={selectedPokemon}
            onClose={closePokemonDetails}
            pokemonMap={pokemonMap}
            currentRaid={raidsMap.get(selectedPokemon)}
          />
        )}
      </div>
    </div>
  );
}

export default RaidsPage;
