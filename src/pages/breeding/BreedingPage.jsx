import { Calculator, Dna, Settings2 } from "lucide-react";

import IVsDropdown from "@/pages/breeding/components/IVsDropdown";
import IVsSelector from "@/pages/breeding/components/IVsSelector";
import TreeScheme from "@/pages/breeding/components/TreeScheme";
import { IV_OPTIONS, IV_STATS } from "@/pages/breeding/data/breedingConstants";
import PageTitle from "@/shared/components/PageTitle";
import { usePersistentState } from "@/shared/utils/usePersistentState";

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
    <div className="space-y-6 pb-24">
      <PageTitle title="PokéMMO Compendium: Breeding Planner" />

      {/* Header Section */}
      <div className="mb-8 flex flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <Calculator className="text-blue-500" size={32} />
          Breeding Planner
        </h1>
        <p className="text-slate-400">
          Calculate the most efficient breeding path for perfect IVs.
        </p>
      </div>

      {/* Controls Container */}
      <div className="grid animate-[fade-in_0.3s_ease-out] grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Configuration Panel */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-white/5 bg-[#1e2025] p-6 shadow-xl">
            <div className="mb-6 flex items-center gap-2 border-b border-white/5 pb-4 font-semibold text-slate-200">
              <Settings2 size={20} className="text-blue-400" />
              <span>Configuration</span>
            </div>

            <IVsSelector
              ivOptions={IV_OPTIONS}
              selectedIvCount={selectedIvCount}
              setSelectedIvCount={setSelectedIvCount}
              nature={nature}
              setNature={setNature}
            />
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#1e2025] p-6 shadow-xl">
            <div className="mb-6 flex items-center gap-2 border-b border-white/5 pb-4 font-semibold text-slate-200">
              <Dna size={20} className="text-purple-400" />
              <span>Stat Priority</span>
            </div>

            <IVsDropdown
              ivStats={IV_STATS}
              selectedIvCount={selectedIvCount}
              selectedIvStats={selectedIvStats}
              setSelectedIvStats={setSelectedIvStats}
            />
          </div>
        </div>

        {/* Tree Visualization */}
        <div className="flex min-h-[600px] flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#1e2025] shadow-xl lg:col-span-2">
          <div className="flex items-center justify-between border-b border-white/5 bg-black/20 p-4">
            <span className="text-sm font-medium tracking-wider text-slate-400 uppercase">
              Breeding Tree
            </span>
            <div className="flex gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-white/20"></span>
                Select nodes to highlight path
              </span>
            </div>
          </div>

          <div className="bg-opacity-5 relative flex-1 bg-[url('/grid.svg')]">
            <TreeScheme
              selectedIvCount={selectedIvCount}
              nature={nature}
              selectedIvStats={selectedIvStats}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BreedingPage;
