import "./TreeScheme.css";

import { useCallback } from "react";

import StatCircle from "./StatCircle";

const STAT_COLOR_MAP = {
  HP: "#55b651",
  Attack: "#f72533",
  Defense: "#f78025",
  "Sp. Attack": "#e925f7",
  "Sp. Defense": "#f7e225",
  Speed: "#25e2f7",
};

// ? Real-world observed gap values for positioning tree nodes
const GAP_VALUES = [60, 170, 390, 830, 1710, 3470];

const getColors = (stats) =>
  stats.map((stat) => STAT_COLOR_MAP[stat] || "#ffffff");

function TreeScheme({ selectedIvCount, selectedIvStats, nature }) {
  // * Scale factors based on IV count to fit the tree on screen
  const scaleValues = {
    2: 1,
    3: 1,
    4: 1,
    5: 0.8,
    6: 0.55,
  };

  // * Different scale factors when Nature is included (tree gets taller)
  const scaleValuesNature = {
    2: 1,
    3: 1,
    4: 0.75,
    5: 0.55,
    6: 0.27,
  };

  const scale = nature
    ? scaleValuesNature[selectedIvCount]
    : scaleValues[selectedIvCount];

  const generateTree = useCallback(
    (selectedIvCount, selectedIvStats, nature) => {
      // ! 1. Safety clamp: max 6 IVs supported
      const clampedCount = Math.min(selectedIvCount ?? 0, 6);

      // ? 2. Slice only the active stats based on user selection
      const baseStats = selectedIvStats.slice(0, clampedCount);

      // ? 3. If nature is active, prepend it to the array.
      // * "Nature" is not in STAT_COLOR_MAP, so getColors will return "#ffffff" (White).
      const stats = nature ? ["Nature", ...baseStats] : baseStats;

      if (stats.length === 0) return [];

      // * 4. Build a Complete Binary Tree structure:
      // * Level 0: [stats] (Root)
      // * Recursion:
      // * Left Child = all elements except the last
      // * Right Child = all elements except the first
      const levels = [];
      let currentLevel = [stats];

      while (currentLevel.length > 0) {
        levels.push(currentLevel);

        const nextLevel = [];

        currentLevel.forEach((nodeStats) => {
          if (nodeStats.length > 1) {
            const leftChild = nodeStats.slice(0, -1);
            const rightChild = nodeStats.slice(1);
            nextLevel.push(leftChild, rightChild);
          }
        });

        currentLevel = nextLevel;
      }

      // ? 5. Convert stats to colors and reverse rows for display (Leaves at top, Root at bottom)
      const coloredLevels = levels
        .map((level) => level.map((nodeStats) => getColors(nodeStats)))
        .reverse();

      return coloredLevels;
    },
    []
  );

  const dataByRow = generateTree(selectedIvCount, selectedIvStats, nature);

  // * Generate legend data for the active stats
  const legendData = selectedIvStats
    .slice(0, selectedIvCount)
    .map((statName) => ({
      name: statName,
      colors: [STAT_COLOR_MAP[statName]],
    }));

  return (
    <div className="tree-scheme-container">
      {/* ? Legend Section */}
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

      {/* ? Main Tree Visualization */}
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
                  // * Group nodes in pairs for alignment
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
