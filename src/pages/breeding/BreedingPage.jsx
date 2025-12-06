import { Calculator, Dna, Settings2 } from "lucide-react";

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
    <div className="space-y-6 pb-24">
      <PageTitle title="PokéMMO Compendium: Breeding Planner" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Calculator className="text-pink-500" size={32} />
            Breeding Planner
          </h1>
          <p className="text-slate-400 mt-1">
            Calculate the most efficient breeding path for perfect IVs.
          </p>
        </div>
      </div>

      {/* Controls Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-[fade-in_0.3s_ease-out]">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1e2025] border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6 text-slate-200 font-semibold border-b border-white/5 pb-4">
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

          <div className="bg-[#1e2025] border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6 text-slate-200 font-semibold border-b border-white/5 pb-4">
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
        <div className="lg:col-span-2 bg-[#1e2025] border border-white/5 rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">
          <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Breeding Tree
            </span>
            <div className="flex gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white/20"></span>
                Select nodes to highlight path
              </span>
            </div>
          </div>

          <div className="flex-1 relative bg-[url('/grid.svg')] bg-opacity-5">
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
