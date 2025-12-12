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
    <div className="space-y-5 rounded-xl border border-white/5 bg-[#1a1b20] p-5">
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
              className={`rounded border px-3 py-1.5 text-sm font-medium transition-all ${
                selectedRegion === r
                  ? "border-purple-500 bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  : "border-white/10 bg-[#1e2025] text-slate-400 hover:border-white/20 hover:bg-[#25272e] hover:text-slate-200"
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
              className={`rounded border px-3 py-1.5 text-sm font-medium transition-all ${
                selectedMemberIndex === idx
                  ? "border-blue-500 bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  : "border-white/10 bg-[#1e2025] text-slate-400 hover:border-white/20 hover:bg-[#25272e] hover:text-slate-200"
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
