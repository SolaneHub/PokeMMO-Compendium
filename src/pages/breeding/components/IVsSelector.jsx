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
        <label className="ml-1 text-sm font-medium text-slate-400">
          Desired Perfect IVs
        </label>
        <div className="grid grid-cols-5 gap-2">
          {ivOptions.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedIvCount(option)}
              className={`relative flex h-12 flex-col items-center justify-center rounded-xl text-lg font-bold transition-all duration-200 ${
                option === selectedIvCount
                  ? "scale-105 bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "border border-transparent bg-[#25272e] text-slate-400 hover:border-white/10 hover:bg-[#2d3038] hover:text-slate-200"
              } `}
            >
              <span className="leading-none">{option}</span>
              <span className="text-[10px] font-normal opacity-60">IV</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nature Toggle */}
      <div className="space-y-3 pt-2">
        <div
          className={`group relative cursor-pointer rounded-xl border p-4 transition-all duration-300 ${
            nature
              ? "border-emerald-500/50 bg-emerald-500/10"
              : "border-white/5 bg-[#25272e] hover:border-white/10"
          } `}
          onClick={() => setNature(!nature)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-lg p-2 transition-colors ${
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
              className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 ${nature ? "rotate-0 bg-emerald-500 text-white" : "-rotate-90 bg-slate-700 text-slate-400"} `}
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
