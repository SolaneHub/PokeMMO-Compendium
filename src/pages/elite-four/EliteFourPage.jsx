import { Crown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getAllApprovedTeams } from "@/firebase/firestoreService";
import MemberSelection from "@/pages/elite-four/components/MemberSelection";
import PokemonSelection from "@/pages/elite-four/components/PokemonSelection";
import RegionSelection from "@/pages/elite-four/components/RegionSelection";
import TeamSelection from "@/pages/elite-four/components/TeamSelection";
import ViewTeamBuildButton from "@/pages/elite-four/components/ViewTeamBuildButton";
import { getMembersByRegion } from "@/pages/elite-four/data/eliteFourService";
import { useStrategyNavigation } from "@/pages/elite-four/hooks/useStrategyNavigation";
import TeamBuildModal from "@/pages/elite-four/TeamBuildModal";
import {
  getPokemonBackground,
  getPokemonByName,
} from "@/pages/pokedex/data/pokemonService";
import PageTitle from "@/shared/components/PageTitle";
import StrategyModal from "@/shared/components/StrategyModal";

function EliteFourPage() {
  // State for Community Teams
  const [approvedTeams, setApprovedTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [error, setError] = useState(null); // New error state

  // Selection State
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // UI State
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);
  const [isTeamBuildVisible, setIsTeamBuildVisible] = useState(false);

  const {
    currentStrategyView,
    strategyHistory,
    breadcrumbs,
    initializeStrategy,
    navigateToStep,
    navigateBack,
    resetStrategy,
  } = useStrategyNavigation();

  // Fetch Teams on Mount
  useEffect(() => {
    const fetchTeams = async () => {
      setLoadingTeams(true);
      setError(null); // Clear previous errors
      try {
        const teams = await getAllApprovedTeams();
        setApprovedTeams(teams);
      } catch (err) {
        console.error("Failed to fetch approved teams:", err);
        setError("Failed to load community strategies. Please try again later.");
      } finally {
        setLoadingTeams(false);
      }
    };
    fetchTeams();
  }, []);

  // Derived Data
  const currentTeamData = useMemo(
    () => approvedTeams.find((t) => t.id === selectedTeamId),
    [approvedTeams, selectedTeamId]
  );

  const currentTeamBuilds = useMemo(() => {
    if (!currentTeamData?.members) return [];
    // Map user team members to the format expected by TeamBuildModal/PlayerBuildCard
    return currentTeamData.members
      .map((m) => {
        if (!m) return null;
        return {
          name: m.name,
          item: m.item,
          ability: m.ability,
          nature: m.nature,
          evs: m.evs, // Assuming string like "252 Atk / 252 Spe"
          moves: [m.move1, m.move2, m.move3, m.move4].filter(Boolean),
        };
      })
      .filter(Boolean); // Filter out empty slots/nulls
  }, [currentTeamData]);

  const filteredEliteFour = getMembersByRegion(selectedRegion);

  const pokemonNamesForSelectedTeam = useMemo(() => {
    if (!selectedMember || !currentTeamData?.enemyPools) return [];
    // Handle both string name (from selection) and object
    const memberName =
      typeof selectedMember === "object" ? selectedMember.name : selectedMember;
    return currentTeamData.enemyPools[memberName] || [];
  }, [selectedMember, currentTeamData]);

  const currentPokemonObject = selectedPokemon
    ? getPokemonByName(selectedPokemon)
    : null;

  const detailsTitleBackground = selectedPokemon
    ? getPokemonBackground(selectedPokemon)
    : "#333";

  // Actions
  const handleTeamClick = (teamId) => {
    setSelectedTeamId(teamId);
    setSelectedRegion(null);
    setSelectedMember(null);
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    setIsTeamBuildVisible(false);
    resetStrategy();
  };

  const handleRegionClick = (region) => {
    const regionName = typeof region === "object" ? region.name : region;
    setSelectedRegion((prev) => (prev === regionName ? null : regionName));

    setSelectedMember(null);
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategy();
  };

  const handleMemberClick = (member) => {
    const memberName = typeof member === "object" ? member.name : member;
    setSelectedMember((prev) => (prev === memberName ? null : memberName));

    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategy();
  };

  const handlePokemonCardClick = (pokemonName) => {
    setSelectedPokemon(pokemonName);
    setIsPokemonDetailsVisible(true);

    // Strategy Retrieval logic for User Teams
    const memberName =
      typeof selectedMember === "object" ? selectedMember.name : selectedMember;

    let strategy = [];
    if (currentTeamData?.strategies?.[memberName]?.[pokemonName]) {
      strategy = currentTeamData.strategies[memberName][pokemonName];
    }

    initializeStrategy(strategy);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-24">
      <PageTitle title="PokéMMO Compendium: Elite Four" />

      {/* Header */}
      <div className="mb-8 flex flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <Crown className="text-yellow-500" size={32} />
          Elite Four Strategy
        </h1>
        <p className="text-slate-400">Select a community strategy to begin.</p>
      </div>

      {/* Team Selection */}
      {loadingTeams ? (
        <div className="text-center text-slate-400">
          Loading community teams...
        </div>
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
        />
      )}

      {isTeamBuildVisible && (
        <TeamBuildModal
          teamName={currentTeamData?.name || "Team"}
          builds={currentTeamBuilds}
          onClose={() => setIsTeamBuildVisible(false)}
        />
      )}

      {/* Strategy Modal */}
      {isPokemonDetailsVisible && currentPokemonObject && (
        <StrategyModal
          currentPokemonObject={currentPokemonObject}
          detailsTitleBackground={detailsTitleBackground}
          strategyHistory={strategyHistory}
          currentStrategyView={currentStrategyView}
          breadcrumbs={breadcrumbs}
          onClose={() => setIsPokemonDetailsVisible(false)}
          onBack={navigateBack}
          onStepClick={navigateToStep}
        />
      )}
    </div>
  );
}

export default EliteFourPage;
