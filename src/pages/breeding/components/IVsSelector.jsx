import { Check, Leaf, X } from "lucide-react";

function IVsSelector({
  ivOptions,
  selectedIvCount,
  setSelectedIvCount,
  nature,
  setNature,
}) {
  return (
    <div className="space-y-6">
      {/* IV Count Selector */}
      <div className="space-y-3">
        <label className="text-sm text-slate-400 font-medium ml-1">
          Desired Perfect IVs
        </label>
        <div className="grid grid-cols-5 gap-2">
          {ivOptions.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedIvCount(option)}
              className={`
                relative h-12 rounded-xl font-bold text-lg transition-all duration-200 flex flex-col items-center justify-center
                ${
                  option === selectedIvCount
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105"
                    : "bg-[#25272e] text-slate-400 hover:bg-[#2d3038] hover:text-slate-200 border border-transparent hover:border-white/10"
                }
              `}
            >
              <span className="leading-none">{option}</span>
              <span className="text-[10px] opacity-60 font-normal">IV</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nature Toggle */}
      <div className="space-y-3 pt-2">
        <div
          className={`
          relative group cursor-pointer rounded-xl border p-4 transition-all duration-300
          ${
            nature
              ? "bg-emerald-500/10 border-emerald-500/50"
              : "bg-[#25272e] border-white/5 hover:border-white/10"
          }
        `}
          onClick={() => setNature(!nature)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg transition-colors ${
                  nature
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                <Leaf size={20} />
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-semibold ${
                    nature ? "text-emerald-400" : "text-slate-300"
                  }`}
                >
                  Nature Breeding
                </span>
                <span className="text-xs text-slate-500">
                  {nature ? "Include nature in path" : "IVs only"}
                </span>
              </div>
            </div>

            <div
              className={`
              w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
              ${nature ? "bg-emerald-500 text-white rotate-0" : "bg-slate-700 text-slate-400 -rotate-90"}
            `}
            >
              {nature ? <Check size={14} strokeWidth={3} /> : <X size={14} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IVsSelector;
