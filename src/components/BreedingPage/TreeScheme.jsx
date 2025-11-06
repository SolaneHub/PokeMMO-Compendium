import { useCallback } from "react";
import StatCircle from "./StatCircle";
import './TreeScheme.css'

const STAT_COLOR_MAP = {
    HP: "#55b651",
    Attack: "#f72533",
    Defense: "#f78025",
    "Sp. Attack": "#e925f7",
    "Sp. Defense": "#f7e225",
    Speed: "#25e2f7",
};

const GAP_VALUES = [60, 170, 390, 830, 1710, 3470]; // valori reali osservati

const getColors = (stats) =>
    stats.map((stat) => STAT_COLOR_MAP[stat] || "#ffffff");

function TreeScheme({ selectedIvCount, selectedIvStats, nature }) {
    const scaleValues = {
        2: 1,
        3: 1,
        4: 1,
        5: 0.8,
        6: 0.55,
    };

    const scaleValuesNature = {
        2: 1,
        3: 1,
        4: 0.75,
        5: 0.55,
        6: 0.27,
    };

    const scale = !nature
        ? scaleValues[selectedIvCount]
        : 1 || nature
            ? scaleValuesNature[selectedIvCount]
            : 1;

    const generateTree = useCallback(
        (selectedIvCount, selectedIvStats, nature) => {
            const treeDataByRow = [];

            const [iv1, iv2, iv3, iv4, iv5, iv6] = selectedIvStats;

            if (!nature) {
                switch (selectedIvCount) {
                    case 2: {
                        treeDataByRow.push([getColors([iv2, iv1])]);

                        treeDataByRow.push([getColors([iv1]), getColors([iv2])]);
                        break;
                    }

                    case 3: {
                        treeDataByRow.push([getColors([iv2, iv3, iv1])]);

                        treeDataByRow.push([getColors([iv2, iv1]), getColors([iv3, iv2])]);

                        treeDataByRow.push([
                            getColors([iv1]),
                            getColors([iv2]),
                            getColors([iv2]),
                            getColors([iv3]),
                        ]);
                        break;
                    }

                    case 4: {
                        treeDataByRow.push([getColors([iv2, iv3, iv4, iv1])]);

                        treeDataByRow.push([
                            getColors([iv2, iv3, iv1]),
                            getColors([iv3, iv4, iv2]),
                        ]);

                        treeDataByRow.push([
                            getColors([iv2, iv1]),
                            getColors([iv3, iv2]),
                            getColors([iv3, iv2]),
                            getColors([iv4, iv3]),
                        ]);

                        treeDataByRow.push([
                            getColors([iv1]),
                            getColors([iv2]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv3]),
                            getColors([iv4]),
                        ]);
                        break;
                    }

                    case 5: {
                        treeDataByRow.push([getColors([iv2, iv3, iv4, iv5, iv1])]);

                        treeDataByRow.push([
                            getColors([iv2, iv3, iv4, iv1]),
                            getColors([iv3, iv4, iv5, iv2]),
                        ]);

                        treeDataByRow.push([
                            getColors([iv2, iv3, iv1]),
                            getColors([iv3, iv4, iv2]),
                            getColors([iv3, iv4, iv2]),
                            getColors([iv4, iv5, iv3]),
                        ]);

                        treeDataByRow.push([
                            getColors([iv2, iv1]),
                            getColors([iv3, iv2]),
                            getColors([iv3, iv2]),
                            getColors([iv4, iv3]),
                            getColors([iv3, iv2]),
                            getColors([iv4, iv3]),
                            getColors([iv4, iv3]),
                            getColors([iv5, iv4]),
                        ]);

                        treeDataByRow.push([
                            getColors([iv1]),
                            getColors([iv2]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv4]),
                            getColors([iv5]),
                        ]);
                        break;
                    }

                    case 6: {
                        treeDataByRow.push([getColors([iv2, iv3, iv4, iv5, iv6, iv1])]);

                        treeDataByRow.push([
                            getColors([iv2, iv3, iv4, iv5, iv1]),
                            getColors([iv3, iv4, iv5, iv6, iv2]),
                        ]);

                        treeDataByRow.push([
                            getColors([iv2, iv3, iv4, iv1]),
                            getColors([iv3, iv4, iv5, iv2]),
                            getColors([iv3, iv4, iv5, iv2]),
                            getColors([iv4, iv5, iv6, iv3]),
                        ]);

                        treeDataByRow.push([
                            getColors([iv2, iv3, iv1]),
                            getColors([iv3, iv4, iv2]),
                            getColors([iv3, iv4, iv2]),
                            getColors([iv4, iv5, iv3]),
                            getColors([iv3, iv4, iv2]),
                            getColors([iv4, iv5, iv3]),
                            getColors([iv4, iv5, iv3]),
                            getColors([iv5, iv6, iv4]),
                        ]);

                        treeDataByRow.push([
                            getColors([iv2, iv1]),
                            getColors([iv3, iv2]),
                            getColors([iv3, iv2]),
                            getColors([iv4, iv3]),
                            getColors([iv3, iv2]),
                            getColors([iv4, iv3]),
                            getColors([iv4, iv3]),
                            getColors([iv5, iv4]),
                            getColors([iv3, iv2]),
                            getColors([iv4, iv3]),
                            getColors([iv4, iv3]),
                            getColors([iv5, iv4]),
                            getColors([iv4, iv3]),
                            getColors([iv5, iv4]),
                            getColors([iv5, iv4]),
                            getColors([iv6, iv5]),
                        ]);

                        treeDataByRow.push([
                            getColors([iv1]),
                            getColors([iv2]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv3]),
                            getColors([iv5]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv4]),
                            getColors([iv5]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv4]),
                            getColors([iv5]),
                            getColors([iv4]),
                            getColors([iv5]),
                            getColors([iv5]),
                            getColors([iv6]),
                        ]);
                        break;
                    }
                }
            } else {
                switch (selectedIvCount) {
                    case 2:
                        treeDataByRow.push([getColors([iv1, iv2, nature])]);
                        treeDataByRow.push([
                            getColors([iv1, nature]),
                            getColors([iv2, iv1]),
                        ]);
                        treeDataByRow.push([
                            getColors([nature]),
                            getColors([iv1]),
                            getColors([iv1]),
                            getColors([iv2]),
                        ]);

                        break;

                    case 3:
                        treeDataByRow.push([getColors([iv1, iv2, iv3, nature])]);
                        treeDataByRow.push([
                            getColors([iv1, iv2, nature]),
                            getColors([iv2, iv3, iv1]),
                        ]);
                        treeDataByRow.push([
                            getColors([iv1, nature]),
                            getColors([iv2, iv1]),
                            getColors([iv2, iv1]),
                            getColors([iv3, iv2]),
                        ]);
                        treeDataByRow.push([
                            getColors([nature]),
                            getColors([iv1]),
                            getColors([iv1]),
                            getColors([iv2]),
                            getColors([iv1]),
                            getColors([iv2]),
                            getColors([iv2]),
                            getColors([iv3]),
                        ]);
                        break;

                    case 4:
                        treeDataByRow.push([getColors([iv1, iv2, iv3, iv4, nature])]);
                        treeDataByRow.push([
                            getColors([iv1, iv2, iv3, nature]),
                            getColors([iv2, iv3, iv4, iv1]),
                        ]);
                        treeDataByRow.push([
                            getColors([iv1, iv2, nature]),
                            getColors([iv2, iv3, iv1]),
                            getColors([iv2, iv3, iv1]),
                            getColors([iv3, iv4, iv2]),
                        ]);
                        treeDataByRow.push([
                            getColors([iv1, nature]),
                            getColors([iv2, iv1]),
                            getColors([iv2, iv1]),
                            getColors([iv3, iv2]),
                            getColors([iv2, iv1]),
                            getColors([iv3, iv2]),
                            getColors([iv3, iv2]),
                            getColors([iv4, iv3]),
                        ]);

                        treeDataByRow.push([
                            getColors([nature]),
                            getColors([iv1]),
                            getColors([iv1]),
                            getColors([iv2]),
                            getColors([iv1]),
                            getColors([iv2]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv1]),
                            getColors([iv2]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv3]),
                            getColors([iv4]),
                        ]);
                        break;

                    case 5: {
                        treeDataByRow.push([getColors([iv1, iv2, iv3, iv4, iv5, nature])]);
                        treeDataByRow.push([
                            getColors([iv1, iv2, iv3, iv4, nature]),
                            getColors([iv2, iv3, iv4, iv5, iv1]),
                        ]);

                        treeDataByRow.push([
                            getColors([iv1, iv2, iv3, nature]),
                            getColors([iv2, iv3, iv4, iv1]),
                            getColors([iv2, iv3, iv4, iv1]),
                            getColors([iv3, iv4, iv5, iv2]),
                        ]);

                        treeDataByRow.push([
                            getColors([iv1, iv2, nature]),
                            getColors([iv2, iv3, iv1]),
                            getColors([iv2, iv3, iv1]),
                            getColors([iv3, iv4, iv2]),
                            getColors([iv2, iv3, iv1]),
                            getColors([iv3, iv4, iv2]),
                            getColors([iv3, iv4, iv2]),
                            getColors([iv4, iv5, iv3]),
                        ]);

                        treeDataByRow.push([
                            getColors([iv1, nature]),
                            getColors([iv2, iv1]),
                            getColors([iv2, iv1]),
                            getColors([iv3, iv2]),
                            getColors([iv2, iv1]),
                            getColors([iv3, iv2]),
                            getColors([iv3, iv2]),
                            getColors([iv4, iv3]),
                            getColors([iv2, iv1]),
                            getColors([iv3, iv2]),
                            getColors([iv3, iv2]),
                            getColors([iv4, iv3]),
                            getColors([iv3, iv2]),
                            getColors([iv4, iv3]),
                            getColors([iv4, iv3]),
                            getColors([iv5, iv4]),
                        ]);

                        treeDataByRow.push([
                            getColors([nature]),
                            getColors([iv1]),
                            getColors([iv1]),
                            getColors([iv2]),
                            getColors([iv1]),
                            getColors([iv2]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv1]),
                            getColors([iv2]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv1]),
                            getColors([iv2]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv4]),
                            getColors([iv5]),
                        ]);
                        break;
                    }
                    case 6: {
                        treeDataByRow.push([
                            getColors([iv1, iv2, iv3, iv4, iv5, iv6, nature]),
                        ]);
                        treeDataByRow.push([
                            getColors([iv1, iv2, iv3, iv4, iv5, nature]),
                            getColors([iv2, iv3, iv4, iv5, iv6, iv1]),
                        ]);

                        treeDataByRow.push([
                            getColors([iv2, iv3, iv4, iv5, iv1]),
                            getColors([iv3, iv4, iv5, iv6, iv2]),
                            getColors([iv2, iv3, iv4, iv5, iv1]),
                            getColors([iv3, iv4, iv5, iv6, iv2]),
                        ]);

                        treeDataByRow.push([
                            getColors([iv2, iv3, iv4, iv1]),
                            getColors([iv3, iv4, iv5, iv2]),
                            getColors([iv3, iv4, iv5, iv2]),
                            getColors([iv4, iv5, iv6, iv3]),
                            getColors([iv2, iv3, iv4, iv1]),
                            getColors([iv3, iv4, iv5, iv2]),
                            getColors([iv3, iv4, iv5, iv2]),
                            getColors([iv4, iv5, iv6, iv3]),
                        ]);

                        treeDataByRow.push([
                            getColors([iv2, iv3, iv1]),
                            getColors([iv3, iv4, iv2]),
                            getColors([iv3, iv4, iv2]),
                            getColors([iv4, iv5, iv3]),
                            getColors([iv3, iv4, iv2]),
                            getColors([iv4, iv5, iv3]),
                            getColors([iv4, iv5, iv3]),
                            getColors([iv5, iv6, iv4]),
                            getColors([iv2, iv3, iv1]),
                            getColors([iv3, iv4, iv2]),
                            getColors([iv3, iv4, iv2]),
                            getColors([iv4, iv5, iv3]),
                            getColors([iv3, iv4, iv2]),
                            getColors([iv4, iv5, iv3]),
                            getColors([iv4, iv5, iv3]),
                            getColors([iv5, iv6, iv4]),
                        ]);

                        treeDataByRow.push([
                            getColors([iv2, iv1]),
                            getColors([iv3, iv2]),
                            getColors([iv3, iv2]),
                            getColors([iv4, iv3]),
                            getColors([iv3, iv2]),
                            getColors([iv4, iv3]),
                            getColors([iv4, iv3]),
                            getColors([iv5, iv4]),
                            getColors([iv3, iv2]),
                            getColors([iv4, iv3]),
                            getColors([iv4, iv3]),
                            getColors([iv5, iv4]),
                            getColors([iv4, iv3]),
                            getColors([iv5, iv4]),
                            getColors([iv5, iv4]),
                            getColors([iv6, iv5]),
                            getColors([iv2, iv1]),
                            getColors([iv3, iv2]),
                            getColors([iv3, iv2]),
                            getColors([iv4, iv3]),
                            getColors([iv3, iv2]),
                            getColors([iv4, iv3]),
                            getColors([iv4, iv3]),
                            getColors([iv5, iv4]),
                            getColors([iv3, iv2]),
                            getColors([iv4, iv3]),
                            getColors([iv4, iv3]),
                            getColors([iv5, iv4]),
                            getColors([iv4, iv3]),
                            getColors([iv5, iv4]),
                            getColors([iv5, iv4]),
                            getColors([iv6, iv5]),
                        ]);

                        treeDataByRow.push([
                            getColors([nature]),
                            getColors([iv1]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv3]),
                            getColors([iv5]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv4]),
                            getColors([iv5]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv4]),
                            getColors([iv5]),
                            getColors([iv4]),
                            getColors([iv5]),
                            getColors([iv5]),
                            getColors([iv6]),
                            getColors([iv1]),
                            getColors([iv2]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv3]),
                            getColors([iv5]),
                            getColors([iv2]),
                            getColors([iv3]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv4]),
                            getColors([iv5]),
                            getColors([iv3]),
                            getColors([iv4]),
                            getColors([iv4]),
                            getColors([iv5]),
                            getColors([iv4]),
                            getColors([iv5]),
                            getColors([iv5]),
                            getColors([iv6]),
                        ]);
                        break;
                    }
                }
            }

            return treeDataByRow.reverse();
        }
    );

    const dataByRow = generateTree(selectedIvCount, selectedIvStats, nature);

    const legendData = selectedIvStats
        .slice(0, selectedIvCount)
        .map((statName) => ({
            name: statName,
            colors: [STAT_COLOR_MAP[statName]],
        }));

    return (
        <div className="tree-scheme-container">
            {/* Legenda */}
            <div className="legend-container">
                <div className="legend-items">
                    {legendData.map((item, index) => (
                        <div key={index} className="legend-item">
                            <span className="legend-stat-name">{item.name}</span>
                            <StatCircle
                                ivColors={item.colors}
                                index={`legend-${index}`}
                                isLegend
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Albero a righe (verticale) */}

            <div className="tree-wrapper">
                <div className="tree-container" style={{ "--scale": scale }}>
                    {dataByRow.map((rowItems, rowIndex) => {
                        const rowGap =
                            GAP_VALUES[rowIndex] || GAP_VALUES[GAP_VALUES.length - 1];
                        return (
                            <div
                                key={`row-${rowIndex}`}
                                className="tree-row"
                                style={{ "--gap": `${rowGap}px` }}
                            >
                                {rowItems.reduce((pairs, colors, i) => {
                                    if (i % 2 === 0) {
                                        const next = rowItems[i + 1];
                                        pairs.push(
                                            <div
                                                className="tree-pair"
                                                key={`${rowIndex}-pair-${i / 2}`}
                                            >
                                                <div className="tree-node">
                                                    <StatCircle
                                                        ivColors={colors}
                                                        index={`${rowIndex}-${i}`}
                                                    />
                                                </div>
                                                {next && (
                                                    <div className="tree-node">
                                                        <StatCircle
                                                            ivColors={next}
                                                            index={`${rowIndex}-${i + 1}`}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                    return pairs;
                                }, [])}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default TreeScheme;
