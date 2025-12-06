import IVsDropdown from "@/pages/breeding/components/IVsDropdown";
import IVsSelector from "@/pages/breeding/components/IVsSelector";
import TreeScheme from "@/pages/breeding/components/TreeScheme";
import PageTitle from "@/shared/components/PageTitle";
import { usePersistentState } from "@/shared/utils/usePersistentState";

const IV_OPTIONS = [2, 3, 4, 5, 6];
const IV_STATS = [
  "HP",
  "Attack",
  "Defense",
  "Sp. Attack",
  "Sp. Defense",
  "Speed",
];

function BreedingPage() {
  const [selectedIvCount, setSelectedIvCount] = usePersistentState(
    "breeding_ivCount",
    3
  );
  const [nature, setNature] = usePersistentState("breeding_nature", false);
  const [selectedIvStats, setSelectedIvStats] = usePersistentState(
    "breeding_ivStats",
    IV_STATS
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <PageTitle title="PokéMMO Compendium: Breeding Planner" />
      
      <IVsSelector
        ivOptions={IV_OPTIONS}
        selectedIvCount={selectedIvCount}
        setSelectedIvCount={setSelectedIvCount}
        nature={nature}
        setNature={setNature}
      />

      <IVsDropdown
        ivStats={IV_STATS}
        selectedIvCount={selectedIvCount}
        selectedIvStats={selectedIvStats}
        setSelectedIvStats={setSelectedIvStats}
      />

      <TreeScheme
        selectedIvCount={selectedIvCount}
        nature={nature}
        selectedIvStats={selectedIvStats}
      />
    </div>
  );
}

export default BreedingPage;