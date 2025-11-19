import "./IVsDropdown.css";

function IVsDropdown({
  ivStats,
  selectedIvCount,
  selectedIvStats,
  setSelectedIvStats,
}) {
  const handleSelect = (index, newStat) => {
    const newSelectedIvStats = [...selectedIvStats];

    // ? Check if the newly selected stat is already present in another slot
    const conflictIndex = newSelectedIvStats.findIndex(
      (currentStat) => currentStat === newStat
    );

    if (conflictIndex !== -1) {
      // * Swap logic: if stat exists, swap the old stat into the conflict position
      const oldStat = selectedIvStats[index];
      newSelectedIvStats[index] = newStat;
      newSelectedIvStats[conflictIndex] = oldStat;
    } else {
      // * Direct update if no conflict
      newSelectedIvStats[index] = newStat;
    }

    setSelectedIvStats(newSelectedIvStats);
  };

  return (
    <div className="dropdown-container">
      {/* ? Create dropdowns dynamically based on the selected IV count */}
      {Array.from({ length: selectedIvCount }, (_, index) => (
        <div className="dropdown" key={index}>
          <button className="dropbtn">{selectedIvStats[index]}</button>
          <div className="dropdown-content">
            {ivStats.map((stat) => (
              <a key={stat} onClick={() => handleSelect(index, stat)}>
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
