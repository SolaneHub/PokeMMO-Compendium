import { Crown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import TeamSelection from "@/components/molecules/TeamSelection";
import ViewTeamBuildButton from "@/components/molecules/ViewTeamBuildButton";
import MemberSelection from "@/components/organisms/MemberSelection";
import PokemonSelection from "@/components/organisms/PokemonSelection";
import RegionSelection from "@/components/organisms/RegionSelection";
import StrategyModal from "@/components/organisms/StrategyModal";
import TeamBuildModal from "@/components/organisms/TeamBuildModal";
import PageLayout from "@/components/templates/PageLayout";
import { StrategyStep, TeamMember } from "@/firebase/firestoreService";
import { getAllApprovedTeams, Team } from "@/firebase/firestoreService";
import { usePokedexData } from "@/hooks/usePokedexData";
import { useStrategyNavigation } from "@/hooks/useStrategyNavigation";
import { getMembersByRegion } from "@/services/eliteFourService";
import {
  getPokemonBackground,
  getPokemonByName,
} from "@/services/pokemonService";
import { Pokemon } from "@/types/pokemon";
import { FEATURE_CONFIG } from "@/utils/featureConfig";
import { initializePokemonColorMap } from "@/utils/pokemonMoveColors";

function EliteFourPage() {
  const accentColor = FEATURE_CONFIG["elite-four"].color;
  const [approvedTeams, setApprovedTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>(
    undefined
  );
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);
  const [isTeamBuildVisible, setIsTeamBuildVisible] = useState(false);

  const { pokemonMap, isLoading: isLoadingPokedex } = usePokedexData();
  const {
    currentStrategyView,
    strategyHistory,
    initializeStrategy,
    navigateToStep,
    navigateBack,
    resetStrategy,
  } = useStrategyNavigation();

  useEffect(() => {
    const fetchTeams = async () => {
      setLoadingTeams(true);
      setError(null);
      try {
        const teams = await getAllApprovedTeams();
        setApprovedTeams(teams);
      } catch (err) {
        setError(
          "Failed to load community strategies. Please try again later."
        );
      } finally {
        setLoadingTeams(false);
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    if (pokemonMap && pokemonMap.size > 0) {
      initializePokemonColorMap(Array.from(pokemonMap.values()));
    }
  }, [pokemonMap]);

  const currentTeamData = useMemo(
    () => approvedTeams.find((t) => t.id === selectedTeamId),
    [approvedTeams, selectedTeamId]
  );

  const currentTeamBuilds = useMemo(() => {
    if (!currentTeamData?.members) return [];
    return currentTeamData.members
      .map((m) => {
        if (!m) return null;

        let moves: string[] = [];
        if (Array.isArray(m.moves) && m.moves.length > 0) {
          moves = m.moves;
        } else {
          moves = [m.move1, m.move2, m.move3, m.move4].filter(
            Boolean
          ) as string[];
        }

        return {
          name: m.name,
          item: m.item,
          ability: m.ability,
          nature: m.nature,
          evs: m.evs,
          ivs: m.ivs,
          moves: moves,
        };
      })
      .filter(Boolean) as TeamMember[];
  }, [currentTeamData]);

  const filteredEliteFour = getMembersByRegion(selectedRegion);

  const pokemonNamesForSelectedTeam = useMemo(() => {
    if (!selectedMember || !currentTeamData?.enemyPools) return [];
    const memberName = selectedMember;
    const pool = currentTeamData.enemyPools[memberName] || [];
    return [...pool].sort((a, b) => a.localeCompare(b));
  }, [selectedMember, currentTeamData]);

  const currentPokemonObject = selectedPokemon
    ? getPokemonByName(selectedPokemon, pokemonMap)
    : null;

  const detailsTitleBackground = selectedPokemon
    ? getPokemonBackground(selectedPokemon, pokemonMap)
    : "#333";

  const handleTeamClick = (teamId: string) => {
    setSelectedTeamId(teamId);
    setSelectedRegion(null);
    setSelectedMember(null);
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    setIsTeamBuildVisible(false);
    resetStrategy();
  };

  const handleRegionClick = (regionName: string) => {
    setSelectedRegion((prev) => (prev === regionName ? null : regionName));
    setSelectedMember(null);
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategy();
  };

  const handleMemberClick = (memberName: string) => {
    setSelectedMember((prev) => (prev === memberName ? null : memberName));
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategy();
  };

  const handlePokemonCardClick = (pokemonName: string) => {
    setSelectedPokemon(pokemonName);
    setIsPokemonDetailsVisible(true);

    const memberName = selectedMember;
    if (!memberName) return;

    let strategy: StrategyStep[] = [];
    if (currentTeamData?.strategies?.[memberName]?.[pokemonName]) {
      strategy = currentTeamData.strategies[memberName][pokemonName];
    }

    initializeStrategy(strategy);
  };

  if (isLoadingPokedex) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <p>Loading Pokedex data...</p>
      </div>
    );
  }

  return (
    <PageLayout title="Elite Four" accentColor={accentColor}>
      {/* Header */}
      <div className="mb-8 flex flex-col items-center space-y-2 text-center text-white">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <Crown style={{ color: accentColor }} size={32} />
          Elite Four Strategy
        </h1>
        <p>Select a community strategy to begin.</p>
      </div>

      {/* Team Selection */}
      <div className="text-white">
        {loadingTeams ? (
          <div className="text-center">Loading community teams...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : approvedTeams.length === 0 ? (
          <div className="text-center text-slate-400">
            No approved strategies available yet. Go to &quot;My Teams&quot; to
            create one!
          </div>
        ) : (
          <TeamSelection
            teams={approvedTeams}
            selectedTeamId={selectedTeamId}
            onTeamClick={handleTeamClick}
          />
        )}
      </div>

      {selectedTeamId && currentTeamBuilds.length > 0 && (
        <ViewTeamBuildButton
          selectedTeam={currentTeamData?.name}
          onOpen={() => setIsTeamBuildVisible(true)}
        />
      )}

      {selectedTeamId && (
        <RegionSelection
          selectedRegion={selectedRegion}
          onRegionClick={handleRegionClick}
        />
      )}

      {selectedRegion && filteredEliteFour.length > 0 && (
        <MemberSelection
          filteredEliteFour={filteredEliteFour}
          selectedMember={selectedMember}
          onMemberClick={handleMemberClick}
        />
      )}

      {selectedMember && pokemonNamesForSelectedTeam.length > 0 && (
        <PokemonSelection
          pokemonNames={pokemonNamesForSelectedTeam}
          selectedPokemon={selectedPokemon}
          onPokemonClick={handlePokemonCardClick}
          pokemonMap={pokemonMap}
        />
      )}

      {pokemonMap && isTeamBuildVisible && (
        <TeamBuildModal
          teamName={currentTeamData?.name || "Team"}
          builds={currentTeamBuilds}
          onClose={() => setIsTeamBuildVisible(false)}
          pokemonMap={pokemonMap}
        />
      )}

      {/* Strategy Modal */}
      {isPokemonDetailsVisible && currentPokemonObject && (
        <StrategyModal
          currentPokemonObject={currentPokemonObject as Pokemon}
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

export default EliteFourPage;
