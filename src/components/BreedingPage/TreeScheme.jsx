import StatCircle from "./StatCircle";

const STAT_COLOR_MAP = {
    HP: "#55b651",
    Attack: "#f72533",
    Defense: "#f78025",
    "Sp. Attack": "#e925f7",
    "Sp. Defense": "#f7e225",
    Speed: "#25e2f7",
};

const getColors = (stats) => stats.map((stat) => STAT_COLOR_MAP[stat]);

function TreeScheme({ selectedIvCount, nature, selectedIvStats }) {
    const generateTree = (selectedIvCount, selectedIvStats) => {
        const treeDataByRow = [];

        const [iv1, iv2, iv3, iv4, iv5, iv6] = selectedIvStats;

        switch (selectedIvCount) {
            case 2: {
                treeDataByRow.push([getColors([iv1, iv2])]);

                treeDataByRow.push([getColors([iv1]), getColors([iv2])]);
                break;
            }

            case 3: {
                treeDataByRow.push([getColors([iv1, iv2, iv3])]);

                treeDataByRow.push([getColors([iv1, iv2]), getColors([iv1, iv3])]);

                treeDataByRow.push([
                    getColors([iv1]),
                    getColors([iv2]),
                    getColors([iv1]),
                    getColors([iv3]),
                ]);
                break;
            }

            case 4: {
                treeDataByRow.push([getColors([iv1, iv2, iv3, iv4])]);

                treeDataByRow.push([
                    getColors([iv1, iv2, iv3]),
                    getColors([iv2, iv3, iv4]),
                ]);

                treeDataByRow.push([
                    getColors([iv1, iv2]),
                    getColors([iv1, iv3]),
                    getColors([iv2, iv3]),
                    getColors([iv2, iv4]),
                ]);

                treeDataByRow.push([
                    getColors([iv1]),
                    getColors([iv2]),
                    getColors([iv1]),
                    getColors([iv3]),
                    getColors([iv2]),
                    getColors([iv3]),
                    getColors([iv2]),
                    getColors([iv4]),
                ]);
                break;
            }

            case 5: {
                treeDataByRow.push([getColors([iv1, iv2, iv3, iv4, iv5])]);

                treeDataByRow.push([
                    getColors([iv1, iv2, iv3, iv4]),
                    getColors([iv2, iv3, iv4, iv5]),
                ]);

                treeDataByRow.push([
                    getColors([iv1, iv2, iv3]),
                    getColors([iv2, iv3, iv4]),
                    getColors([iv2, iv3, iv4]),
                    getColors([iv3, iv4, iv5]),
                ]);

                treeDataByRow.push([
                    getColors([iv1, iv2]),
                    getColors([iv1, iv3]),

                    getColors([iv2, iv3]),
                    getColors([iv2, iv4]),

                    getColors([iv2, iv3]),
                    getColors([iv2, iv4]),

                    getColors([iv3, iv4]),
                    getColors([iv3, iv5]),
                ]);

                treeDataByRow.push([
                    getColors([iv1]),
                    getColors([iv2]),
                    getColors([iv1]),
                    getColors([iv3]),
                    getColors([iv2]),
                    getColors([iv3]),
                    getColors([iv2]),
                    getColors([iv4]),
                    getColors([iv2]),
                    getColors([iv3]),
                    getColors([iv2]),
                    getColors([iv4]),
                    getColors([iv3]),
                    getColors([iv4]),
                    getColors([iv3]),
                    getColors([iv5]),
                ]);
                break;
            }

            case 6: {
                treeDataByRow.push([getColors([iv1, iv2, iv3, iv4, iv5, iv6])]);

                treeDataByRow.push([
                    getColors([iv1, iv2, iv3, iv4, iv5]),
                    getColors([iv2, iv3, iv4, iv5, iv6]),
                ]);

                treeDataByRow.push([
                    getColors([iv1, iv2, iv3, iv4]),
                    getColors([iv2, iv3, iv4, iv5]),
                    getColors([iv2, iv3, iv4, iv5]),
                    getColors([iv3, iv4, iv5, iv6]),
                ]);

                treeDataByRow.push([
                    getColors([iv1, iv2, iv3]),
                    getColors([iv2, iv3, iv4]),
                    getColors([iv2, iv3, iv4]),
                    getColors([iv3, iv4, iv5]),
                    getColors([iv2, iv3, iv4]),
                    getColors([iv3, iv4, iv5]),
                    getColors([iv3, iv4, iv5]),
                    getColors([iv4, iv5, iv6]),
                ]);

                treeDataByRow.push([
                    getColors([iv1, iv2]),
                    getColors([iv1, iv3]),
                    getColors([iv2, iv3]),
                    getColors([iv2, iv4]),
                    getColors([iv2, iv3]),
                    getColors([iv2, iv4]),
                    getColors([iv3, iv4]),
                    getColors([iv3, iv5]),
                    getColors([iv2, iv3]),
                    getColors([iv2, iv4]),
                    getColors([iv3, iv4]),
                    getColors([iv3, iv5]),
                    getColors([iv3, iv4]),
                    getColors([iv3, iv5]),
                    getColors([iv4, iv5]),
                    getColors([iv4, iv6]),
                ]);

                treeDataByRow.push([
                    getColors([iv1]),
                    getColors([iv2]),
                    getColors([iv1]),
                    getColors([iv3]),
                    getColors([iv2]),
                    getColors([iv3]),
                    getColors([iv2]),
                    getColors([iv4]),
                    getColors([iv2]),
                    getColors([iv3]),
                    getColors([iv2]),
                    getColors([iv4]),
                    getColors([iv3]),
                    getColors([iv4]),
                    getColors([iv3]),
                    getColors([iv5]),
                    getColors([iv2]),
                    getColors([iv3]),
                    getColors([iv2]),
                    getColors([iv4]),
                    getColors([iv3]),
                    getColors([iv4]),
                    getColors([iv3]),
                    getColors([iv5]),
                    getColors([iv3]),
                    getColors([iv4]),
                    getColors([iv3]),
                    getColors([iv5]),
                    getColors([iv4]),
                    getColors([iv5]),
                    getColors([iv4]),
                    getColors([iv6]),
                ]);
                break;
            }
        }

        return treeDataByRow;
    };

    const dataByRow = generateTree(selectedIvCount, selectedIvStats);

    const legendData = selectedIvStats
        .slice(0, selectedIvCount)
        .map((statName) => ({
            name: statName,
            colors: [STAT_COLOR_MAP[statName]],
        }));

    return (
        <div className="tree-scheme-container">
            {/* Sezione Legenda Colori */}
            <div className="legend-container">
                <div className="legend-items">
                    {legendData.map((item, index) => (
                        <div key={index} className="legend-item">
                            <span className="legend-stat-name">{item.name}</span>
                            <StatCircle
                                ivColors={item.colors}
                                index={`legend-${index}`}
                                isLegend={true}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="tree-container">
                {dataByRow.map((rowItems, rowIndex) => {
                    const circlesToDisplay = rowItems;
                    const pairsToDisplay = [];

                    for (let i = 0; i < circlesToDisplay.length; i += 2) {
                        pairsToDisplay.push([circlesToDisplay[i], circlesToDisplay[i + 1]]);
                    }

                    return (
                        <div
                            key={`row-${dataByRow.length - rowIndex}`}
                            className="tree-row"
                        >
                            {pairsToDisplay.map((pair, pairIndex) => (
                                <div key={pairIndex} className="tree-branch-group">
                                    <StatCircle
                                        ivColors={pair[0]}
                                        index={`${rowIndex}-${pairIndex}-0`}
                                    />

                                    {pair[1] && <div className="tree-horizontal-line"></div>}

                                    {pair[1] && (
                                        <StatCircle
                                            ivColors={pair[1]}
                                            index={`${rowIndex}-${pairIndex}-1`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TreeScheme;
