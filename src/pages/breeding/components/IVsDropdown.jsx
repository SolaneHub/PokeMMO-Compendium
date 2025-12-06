function IVsDropdown({
  ivStats,
  selectedIvCount,
  selectedIvStats,
  setSelectedIvStats,
}) {
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
  };

  return (
    <div className="flex flex-wrap gap-2.5 justify-center mx-auto mb-5 max-w-screen-xl">
      {Array.from({ length: selectedIvCount }, (_, index) => (
        <div className="relative flex-1 basis-[110px] max-w-[150px] group" key={index}>
          <button className="w-full bg-slate-800 border-2 border-transparent rounded-lg shadow-md text-slate-200 text-base font-semibold overflow-hidden py-2.5 px-0 whitespace-nowrap transition-all duration-200 group-hover:bg-slate-700 group-hover:border-blue-500 group-hover:shadow-lg group-hover:-translate-y-0.5">
            {selectedIvStats[index]}
          </button>
          <div className="hidden group-hover:block group-focus-within:block absolute top-[calc(100%+5px)] left-0 w-full min-w-[120px] bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-[1000] overflow-hidden animate-[fade-in_0.2s_ease]">
            {ivStats.map((stat) => (
              <a 
                key={stat} 
                onClick={() => handleSelect(index, stat)}
                className="block text-slate-200 text-[0.95rem] font-medium py-2.5 px-3 text-center no-underline cursor-pointer transition-colors duration-100 hover:bg-blue-500 hover:text-white"
              >
                {stat}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default IVsDropdown;