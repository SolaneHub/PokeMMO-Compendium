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
      <label className="text-sm text-slate-400 font-medium ml-1">
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
              className={`
                w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm font-semibold transition-all
                ${
                  openDropdownIndex === index
                    ? "bg-[#25272e] border-blue-500 text-white shadow-lg ring-1 ring-blue-500/20"
                    : "bg-[#25272e] border-white/5 text-slate-300 hover:border-white/20 hover:text-white"
                }
              `}
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
                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-[#1a1b20] border border-white/10 rounded-lg shadow-2xl z-30 overflow-hidden py-1 animate-[fade-in_0.1s_ease-out]">
                  {ivStats.map((stat) => {
                    const isSelected = selectedIvStats[index] === stat;
                    const isUsed =
                      selectedIvStats.includes(stat) && !isSelected;

                    return (
                      <button
                        key={stat}
                        onClick={() => handleSelect(index, stat)}
                        className={`
                          w-full text-left px-3 py-2 text-sm flex items-center justify-between
                          ${isSelected ? "bg-blue-600/10 text-blue-400" : "text-slate-300 hover:bg-white/5"}
                          ${isUsed ? "opacity-50" : "cursor-pointer"}
                        `}
                      >
                        {stat}
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        )}
                        {isUsed && !isSelected && (
                          <div className="text-[10px] text-slate-500 uppercase font-bold px-1.5 py-0.5 rounded border border-white/10">
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
