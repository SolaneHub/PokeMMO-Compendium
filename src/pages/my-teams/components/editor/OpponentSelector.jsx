import { Map, Shield } from "lucide-react";

const OpponentSelector = ({
  regions,
  selectedRegion,
  onSelectRegion,
  availableMembers,
  selectedMemberIndex,
  onSelectMember,
}) => {
  return (
    <div className="space-y-5 rounded-xl border border-slate-700 bg-slate-800 p-5">
      {/* Region Selector */}
      <div>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-400 uppercase">
          <Map size={16} />
          Region
        </h3>
        <div className="flex flex-wrap gap-2">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => onSelectRegion(r)}
              className={`rounded border px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedRegion === r
                  ? "border-purple-500 bg-purple-600 text-white"
                  : "border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Member Selector */}
      <div>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-400 uppercase">
          <Shield size={16} />
          Select Opponent
        </h3>
        <div className="flex flex-wrap gap-2">
          {availableMembers.map((m, idx) => (
            <button
              key={idx}
              onClick={() => onSelectMember(idx)}
              className={`rounded border px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedMemberIndex === idx
                  ? "border-pink-500 bg-pink-600 text-white"
                  : "border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default OpponentSelector;
