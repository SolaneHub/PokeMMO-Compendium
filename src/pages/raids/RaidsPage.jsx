import { Users } from "lucide-react";
import { useState } from "react";

import { getPokemonCardData } from "@/pages/pokedex/data/pokemonService";
import {
  getRaidsByStars,
  getStarLevels,
} from "@/pages/raids/data/raidsService";
import PageTitle from "@/shared/components/PageTitle";
import PokemonCard from "@/shared/components/PokemonCard";

import RaidCard from "./components/RaidCard";
import RaidModal from "./components/RaidModal";

function RaidsPage() {
  const [selectedStar, setSelectedStar] = useState();
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);

  const starLevels = getStarLevels();
  const filteredRaids = getRaidsByStars(selectedStar);

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

  return (
    <div className="mx-auto max-w-7xl pb-24">
      <PageTitle title="PokéMMO Compendium: Raids" />

      {/* Header */}
      <div className="mb-8 flex flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <Users className="text-purple-400" size={32} />
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
            const { sprite, background } = getPokemonCardData(raid.name);
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
        <RaidModal raidName={selectedPokemon} onClose={closePokemonDetails} />
      )}
    </div>
  );
}

export default RaidsPage;
