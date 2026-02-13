import { Users } from "lucide-react";
import { useState } from "react";

import Button from "@/components/atoms/Button";
import PokemonCard from "@/components/molecules/PokemonCard";
import RaidModal from "@/components/organisms/RaidModal";
import PageLayout from "@/components/templates/PageLayout";
import { usePokedexData } from "@/hooks/usePokedexData";
import { useRaidsData } from "@/hooks/useRaidsData";
import { getPokemonCardData } from "@/services/pokemonService";
import { FEATURE_CONFIG } from "@/utils/featureConfig";

function RaidsPage() {
  const accentColor = FEATURE_CONFIG.raids.color;
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
      <div className="flex h-screen items-center justify-center text-slate-400">
        <p>Loading Raids data...</p>
      </div>
    );
  }

  return (
    <PageLayout title="Raids" accentColor={accentColor}>
      {/* Header */}
      <div className="mb-8 flex flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-200">
          <Users style={{ color: accentColor }} size={32} />
          Raid Strategies
        </h1>
        <p className="text-slate-400">
          Detailed strategies for defeating various raids.
        </p>
      </div>

      <div className="my-8 flex flex-wrap justify-center gap-4">
        {starLevels.map((star) => (
          <Button
            key={star}
            variant={selectedStar === star ? "primary" : "secondary"}
            onClick={() => handleStarClick(star)}
            className="h-12 min-w-[80px]"
          >
            {star}★
          </Button>
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
    </PageLayout>
  );
}
export default RaidsPage;
