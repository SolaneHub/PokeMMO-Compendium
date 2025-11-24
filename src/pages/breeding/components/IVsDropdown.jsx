import "./IVsDropdown.css";

function IVsDropdown({
  ivStats,
  selectedIvCount,
  selectedIvStats,
  setSelectedIvStats,
}) {
  // * Main Handler: Updates the state when a user selects a stat from the dropdown
  const handleSelect = (index, newStat) => {
    const newSelectedIvStats = [...selectedIvStats];

    // ? Check: Is the newly selected stat ALREADY present in another slot?
    const conflictIndex = newSelectedIvStats.findIndex(
      (currentStat) => currentStat === newStat
    );

    // ! CRITICAL LOGIC: Prevention of duplicate IVs
    if (conflictIndex !== -1) {
      // * Swap Strategy:
      // If the stat exists elsewhere, we don't just overwrite it.
      // We swap the old value into the conflicting position to maintain unique selection.
      const oldStat = selectedIvStats[index];
      newSelectedIvStats[index] = newStat;
      newSelectedIvStats[conflictIndex] = oldStat;
    } else {
      // * Standard Update:
      // No conflict found, simply update the value at the specific index.
      newSelectedIvStats[index] = newStat;
    }

    setSelectedIvStats(newSelectedIvStats);
  };

  return (
    // * 1. Wrapper Container
    <div className="dropdown-container">
      {/* ? Generating dynamic dropdowns based on the selected count (e.g., 3x, 4x, 6x) */}
      {Array.from({ length: selectedIvCount }, (_, index) => (
        // * 2. Individual Dropdown Wrapper
        <div className="dropdown" key={index}>
          {/* * 3. Main Button (Activator) */}
          <button className="dropbtn">{selectedIvStats[index]}</button>

          {/* * 4. Hidden Content (Menu) */}
          <div className="dropdown-content">
            {ivStats.map((stat) => (
              // * 5. Dropdown Options (Links)
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
