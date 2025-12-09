import { ChevronDown } from "lucide-react";
import { useState } from "react";

function IVsDropdown({
  ivStats,
  selectedIvCount,
  selectedIvStats,
  setSelectedIvStats,
}) {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const handleSelect = (index, newStat) => {
    const newSelectedIvStats = [...selectedIvStats];
    const conflictIndex = newSelectedIvStats.findIndex(
      (stat) => stat === newStat
    );

    if (conflictIndex !== -1) {
      const oldStat = selectedIvStats[index];
      newSelectedIvStats[index] = newStat;
      newSelectedIvStats[conflictIndex] = oldStat;
    } else {
      newSelectedIvStats[index] = newStat;
    }

    setSelectedIvStats(newSelectedIvStats);
    setOpenDropdownIndex(null);
  };

  return (
    <div className="space-y-3">
      <label className="ml-1 text-sm font-medium text-slate-400">
        Stat Configuration
      </label>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: selectedIvCount }, (_, index) => (
          <div
            className={`relative ${openDropdownIndex === index ? "z-50" : "z-20"}`}
            key={index}
          >
            <button
              onClick={() =>
                setOpenDropdownIndex(openDropdownIndex === index ? null : index)
              }
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all ${
                openDropdownIndex === index
                  ? "border-blue-500 bg-[#25272e] text-white shadow-lg ring-1 ring-blue-500/20"
                  : "border-white/5 bg-[#25272e] text-slate-300 hover:border-white/20 hover:text-white"
              } `}
            >
              <span className="truncate">{selectedIvStats[index]}</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  openDropdownIndex === index
                    ? "rotate-180 text-blue-400"
                    : "text-slate-500"
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {openDropdownIndex === index && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setOpenDropdownIndex(null)}
                />
                <div className="absolute top-[calc(100%+4px)] left-0 z-30 w-full animate-[fade-in_0.1s_ease-out] overflow-hidden rounded-lg border border-white/10 bg-[#1a1b20] py-1 shadow-2xl">
                  {ivStats.map((stat) => {
                    const isSelected = selectedIvStats[index] === stat;
                    const isUsed =
                      selectedIvStats.includes(stat) && !isSelected;

                    return (
                      <button
                        key={stat}
                        onClick={() => handleSelect(index, stat)}
                        className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${isSelected ? "bg-blue-600/10 text-blue-400" : "text-slate-300 hover:bg-white/5"} ${isUsed ? "opacity-50" : "cursor-pointer"} `}
                      >
                        {stat}
                        {isSelected && (
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                        )}
                        {isUsed && !isSelected && (
                          <div className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 uppercase">
                            Swap
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default IVsDropdown;
