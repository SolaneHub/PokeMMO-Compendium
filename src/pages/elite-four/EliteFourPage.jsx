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
import { usePokedexData } from "@/shared/hooks/usePokedexData";
import { initializePokemonColorMap } from "@/shared/utils/pokemonMoveColors";

function EliteFourPage() {
  const [approvedTeams, setApprovedTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);
  const [isTeamBuildVisible, setIsTeamBuildVisible] = useState(false);

  const { pokemonMap, isLoading: isLoadingPokedex } = usePokedexData();
  const {
    currentStrategyView,
    strategyHistory,
    breadcrumbs,
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
    if (pokemonMap && Object.keys(pokemonMap).length > 0) {
      initializePokemonColorMap(Object.values(pokemonMap));
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

        let moves = [];
        if (Array.isArray(m.moves) && m.moves.length > 0) {
          moves = m.moves;
        } else {
          moves = [m.move1, m.move2, m.move3, m.move4].filter(Boolean);
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
      .filter(Boolean);
  }, [currentTeamData]);

  const filteredEliteFour = getMembersByRegion(selectedRegion);

  const pokemonNamesForSelectedTeam = useMemo(() => {
    if (!selectedMember || !currentTeamData?.enemyPools) return [];
    const memberName =
      typeof selectedMember === "object" ? selectedMember.name : selectedMember;
    const pool = currentTeamData.enemyPools[memberName] || [];
    return [...pool].sort((a, b) => a.localeCompare(b));
  }, [selectedMember, currentTeamData]);

  const currentPokemonObject = selectedPokemon
    ? getPokemonByName(selectedPokemon, pokemonMap)
    : null;

  const detailsTitleBackground = selectedPokemon
    ? getPokemonBackground(selectedPokemon, pokemonMap)
    : "#333";

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

    const memberName =
      typeof selectedMember === "object" ? selectedMember.name : selectedMember;

    let strategy = [];
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
