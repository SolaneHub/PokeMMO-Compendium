function IVsDropdown({
    ivStats,
    selectedIvCount,
    selectedIvStats,
    setSelectedIvStats,
}) {
    const handleSelect = (index, newStat) => {
        const newSelectedIvStats = [...selectedIvStats];
        const conflictIndex = newSelectedIvStats.findIndex(
            (currentStat) => currentStat === newStat
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
        <div className="dropdown-container">
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
