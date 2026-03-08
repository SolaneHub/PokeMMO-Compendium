import { Trophy } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

import CaptureSection from "@/components/organisms/CatchCalculator/CaptureSection";
import ConditionsSection from "@/components/organisms/CatchCalculator/ConditionsSection";
import TargetSection from "@/components/organisms/CatchCalculator/TargetSection";
import PageLayout from "@/components/templates/PageLayout";
import { useCatchProbability } from "@/hooks/useCatchProbability";
import { usePokedexData } from "@/hooks/usePokedexData";
import { usePokemonUI } from "@/hooks/usePokemonUI";
import { FEATURE_CONFIG } from "@/utils/featureConfig";
import { usePersistentState } from "@/utils/usePersistentState";

const CatchCalculatorPage = () => {
  const accentColor = FEATURE_CONFIG["catch-calculator"].color;
  const { allPokemonData, pokemonMap, isLoading } = usePokedexData();

  const [targetHpPercentage, setTargetHpPercentage] = usePersistentState(
    "calc_hp",
    100
  );
  const [statusCondition, setStatusCondition] = usePersistentState(
    "calc_status",
    "None"
  );
  const [ballType, setBallType] = usePersistentState("calc_ball", "Poké Ball");
  const [dreamBallTurns, setDreamBallTurns] = usePersistentState(
    "calc_dream_turns",
    0
  );
  const [targetLevel, setTargetLevel] = usePersistentState("calc_level", 50);
  const [turnsPassed, setTurnsPassed] = usePersistentState("calc_turns", 1);
  const [repeatBallCaptures, setRepeatBallCaptures] = usePersistentState(
    "calc_repeat_captures",
    0
  );
  const [selectedPokemonName, setSelectedPokemonName] = usePersistentState(
    "calc_pokemon",
    "Bulbasaur"
  );
  const [isNightOrCave, setIsNightOrCave] = usePersistentState(
    "calc_night_cave",
    false
  );

  useEffect(() => {
    if (!selectedPokemonName && allPokemonData && allPokemonData.length > 0) {
      const firstPokemon = allPokemonData[0];
      if (firstPokemon) {
        setSelectedPokemonName(firstPokemon.name);
      }
    }
  }, [allPokemonData, selectedPokemonName, setSelectedPokemonName]);

  const selectedPokemon = pokemonMap.get(selectedPokemonName) || null;

  const { sprite, background } = usePokemonUI(selectedPokemon);

  useEffect(() => {
    if (selectedPokemon?.locations) {
      const isCavePokemon = selectedPokemon.locations.some((loc) =>
        loc.method?.toLowerCase().includes("cave")
      );
      if (isCavePokemon) {
        setIsNightOrCave(true);
      }
    }
  }, [selectedPokemon, setIsNightOrCave]);

  const [searchTerm, setSearchTerm] = useState("");
  const [deferredSearchTerm, setDeferredSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  const searchRef = useRef<HTMLDivElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPokemon = (() => {
    if (isLoading) return [];
    if (!deferredSearchTerm) return allPokemonData;
    return allPokemonData.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(deferredSearchTerm.toLowerCase())
    );
  })();

  const baseCatchRateRaw = selectedPokemon ? selectedPokemon.catchRate : 0;
  const baseCatchRate =
    typeof baseCatchRateRaw === "string"
      ? Number.parseInt(baseCatchRateRaw, 10)
      : baseCatchRateRaw || 0;

  const catchProbability = useCatchProbability({
    selectedPokemon,
    targetHpPercentage,
    statusCondition,
    ballType,
    dreamBallTurns,
    targetLevel,
    turnsPassed,
    repeatBallCaptures,
    isNightOrCave,
  });

  const getProbabilityColor = (prob: number) => {
    if (prob >= 100) return "text-green-400";
    if (prob > 50) return "text-blue-400";
    if (prob > 20) return "text-yellow-400";
    return "text-red-400";
  };

  const getProbabilityMessage = (prob: number) => {
    if (prob < 1) return "Don't give up!";
    if (prob > 50) return "It's in the bag!";
    return "Keep trying!";
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        <p>Loading Pokémon data...</p>
      </div>
    );
  }

  return (
    <PageLayout title="Catch Calculator">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center space-y-2 text-center text-white">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <Trophy style={{ color: accentColor }} size={32} />
          Catch Calculator
        </h1>
        <p className="text-slate-400">Optimize your capture strategy.</p>
      </div>

      <div className="mx-auto grid w-full max-w-400 grid-cols-1 gap-6 text-white lg:grid-cols-3">
        <TargetSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
          isPending={isPending}
          filteredPokemon={filteredPokemon}
          selectedPokemonName={selectedPokemonName}
          setSelectedPokemonName={setSelectedPokemonName}
          setDeferredSearchTerm={setDeferredSearchTerm}
          startTransition={startTransition}
          searchRef={searchRef}
          selectedPokemon={selectedPokemon}
          sprite={sprite}
          background={background}
          baseCatchRate={baseCatchRate}
        />

        <ConditionsSection
          targetHpPercentage={targetHpPercentage}
          setTargetHpPercentage={setTargetHpPercentage}
          statusCondition={statusCondition}
          setStatusCondition={setStatusCondition}
        />

        <CaptureSection
          ballType={ballType}
          setBallType={setBallType}
          selectedPokemon={selectedPokemon}
          dreamBallTurns={dreamBallTurns}
          setDreamBallTurns={setDreamBallTurns}
          targetLevel={targetLevel}
          setTargetLevel={setTargetLevel}
          turnsPassed={turnsPassed}
          setTurnsPassed={setTurnsPassed}
          repeatBallCaptures={repeatBallCaptures}
          setRepeatBallCaptures={setRepeatBallCaptures}
          isNightOrCave={isNightOrCave}
          setIsNightOrCave={setIsNightOrCave}
          baseCatchRate={baseCatchRate}
          catchProbability={catchProbability}
          getProbabilityColor={getProbabilityColor}
          getProbabilityMessage={getProbabilityMessage}
        />
      </div>
    </PageLayout>
  );
};

export default CatchCalculatorPage;
