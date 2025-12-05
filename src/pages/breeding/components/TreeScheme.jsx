import "./TreeScheme.css";

import { useCallback, useEffect, useState } from "react";

import StatCircle from "./StatCircle";

// * Configuration: Stat Colors Mapping
const STAT_COLOR_MAP = {
  HP: "#55b651",
  Attack: "#f72533",
  Defense: "#f78025",
  "Sp. Attack": "#e925f7",
  "Sp. Defense": "#f7e225",
  Speed: "#25e2f7",
  Nature: "#ffffff",
};

// ? Helper: Maps an array of stat names to their hex codes
const getColors = (stats) =>
  stats.map((stat) => STAT_COLOR_MAP[stat] || "#ffffff");

// * ============================================
// * COMPONENT: TreeScheme
// * ============================================
function TreeScheme({ selectedIvCount, selectedIvStats, nature }) {
  // * 1. VISUAL CONFIGURATION
  const NODE_SIZE = 50;
  const BASE_PAIR_GAP = 50;
  const BASE_ROW_GAP = 100;
  const VERTICAL_GAP = 60;

  const scaleValues = { 2: 1.0, 3: 1.0, 4: 1.0, 5: 1.0, 6: 0.95 };
  const scaleValuesNature = { 2: 1.0, 3: 1.0, 4: 1.0, 5: 0.95, 6: 0.9 };

  const scale = nature
    ? scaleValuesNature[selectedIvCount]
    : scaleValues[selectedIvCount];

  // * State: Tracks which nodes are currently active/lit up
  // ! PERSISTENZA: Inizializza leggendo dal LocalStorage
  const [activeIds, setActiveIds] = useState(() => {
    const saved = localStorage.getItem("breeding_activeNodes");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // ! EFFECT: Salva nel LocalStorage ogni volta che un nodo viene cliccato
  useEffect(() => {
    localStorage.setItem(
      "breeding_activeNodes",
      JSON.stringify([...activeIds])
    );
  }, [activeIds]);

  // * ============================================
  // * 2. TREE GENERATION LOGIC
  // * ============================================
  const generateTree = useCallback(
    (selectedIvCount, selectedIvStats, nature) => {
      const clampedCount = Math.min(selectedIvCount ?? 0, 6);
      const baseStats = selectedIvStats.slice(0, clampedCount);
      const stats = nature ? ["Nature", ...baseStats] : baseStats;

      if (stats.length === 0) return [];

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
      return levels
        .map((level) => level.map((nodeStats) => getColors(nodeStats)))
        .reverse();
    },
    []
  );

  const dataByRow = generateTree(selectedIvCount, selectedIvStats, nature);
  const totalRows = dataByRow.length;

  // * ============================================
  // * 3. INTERACTION HANDLER (Recursive Selection)
  // * ============================================
  const handleNodeClick = (rowIndex, colIndex) => {
    const clickedId = `${rowIndex}-${colIndex}`;

    setActiveIds((prevSet) => {
      const newSet = new Set(prevSet);
      const isTurningOn = !newSet.has(clickedId);

      if (isTurningOn) {
        // * ACTION: TURN ON
        newSet.add(clickedId);
        const activateAncestors = (r, c) => {
          if (r === 0) return;
          const parentRow = r - 1;
          const leftP = `${parentRow}-${c * 2}`;
          const rightP = `${parentRow}-${c * 2 + 1}`;
          newSet.add(leftP);
          newSet.add(rightP);
          activateAncestors(parentRow, c * 2);
          activateAncestors(parentRow, c * 2 + 1);
        };
        activateAncestors(rowIndex, colIndex);
      } else {
        // * ACTION: TURN OFF
        newSet.delete(clickedId);
        const deactivateDescendants = (r, c) => {
          const childRow = r + 1;
          if (childRow >= dataByRow.length) return;
          const childCol = Math.floor(c / 2);
          const childId = `${childRow}-${childCol}`;
          if (newSet.has(childId)) {
            newSet.delete(childId);
            deactivateDescendants(childRow, childCol);
          }
        };
        deactivateDescendants(rowIndex, colIndex);

        const deactivateAncestors = (r, c) => {
          if (r === 0) return;
          const parentRow = r - 1;
          const pLeftId = `${parentRow}-${c * 2}`;
          const pRightId = `${parentRow}-${c * 2 + 1}`;

          if (newSet.has(pLeftId)) {
            newSet.delete(pLeftId);
            deactivateAncestors(parentRow, c * 2);
          }
          if (newSet.has(pRightId)) {
            newSet.delete(pRightId);
            deactivateAncestors(parentRow, c * 2 + 1);
          }
        };
        deactivateAncestors(rowIndex, colIndex);
      }
      return newSet;
    });
  };

  const legendData = selectedIvStats
    .slice(0, selectedIvCount)
    .map((statName) => ({
      name: statName,
      colors: [STAT_COLOR_MAP[statName]],
    }));

  const isSelectionActive = activeIds.size > 0;

  // * ============================================
  // * 4. GEOMETRIC GAP CALCULATION
  // * ============================================
  const rowConfigs = [];
  for (let i = 0; i < totalRows; i++) {
    rowConfigs.push({ size: NODE_SIZE, pairGap: 0, rowGap: 0 });
  }

  if (rowConfigs.length > 0) {
    rowConfigs[0].pairGap = BASE_PAIR_GAP;
    rowConfigs[0].rowGap = BASE_ROW_GAP;
  }

  for (let i = 0; i < totalRows - 1; i++) {
    const current = rowConfigs[i];
    const next = rowConfigs[i + 1];
    const distanceBetweenParents =
      2 * current.size + current.pairGap + current.rowGap;
    const nextGap = distanceBetweenParents - next.size;
    next.pairGap = nextGap;
    next.rowGap = nextGap;
  }

  return (
    <div className="tree-scheme-container">
      {/* * A. Sticky Legend */}
      <div className="legend-container">
        <div className="legend-items">
          {legendData.map((item, index) => (
            <div key={index} className="legend-item">
              <span className="legend-stat-name">{item.name}</span>
              <StatCircle ivColors={item.colors} index={`legend-${index}`} />
            </div>
          ))}
        </div>
      </div>

      {/* * B. Horizontal Scroll Area */}
      <div className="tree-scroll-view">
        <div className="tree-wrapper">
          <div
            className="tree-container"
            style={{
              "--scale": scale,
              "--vertical-gap": `${VERTICAL_GAP}px`,
            }}
          >
            {/* * C. Tree Rows Rendering */}
            {dataByRow.map((rowItems, rowIndex) => {
              const config = rowConfigs[rowIndex];

              return (
                <div
                  key={`row-${rowIndex}`}
                  className="tree-row"
                  style={{
                    "--row-gap": `${config.rowGap}px`,
                    "--pair-gap": `${config.pairGap}px`,
                    "--node-size": `${config.size}px`,
                  }}
                >
                  {/* * D. Node Pairs Rendering */}
                  {rowItems.reduce((pairs, colors, i) => {
                    if (i % 2 === 0) {
                      const next = rowItems[i + 1];
                      const id1 = `${rowIndex}-${i}`;
                      const id2 = `${rowIndex}-${i + 1}`;

                      pairs.push(
                        <div
                          className="tree-pair"
                          key={`${rowIndex}-pair-${i / 2}`}
                        >
                          <div className="tree-node">
                            <StatCircle
                              ivColors={colors}
                              index={id1}
                              onClick={() => handleNodeClick(rowIndex, i)}
                              isActive={activeIds.has(id1)}
                              isDimmed={
                                isSelectionActive && !activeIds.has(id1)
                              }
                            />
                          </div>
                          {next && (
                            <div className="tree-node">
                              <StatCircle
                                ivColors={next}
                                index={id2}
                                onClick={() => handleNodeClick(rowIndex, i + 1)}
                                isActive={activeIds.has(id2)}
                                isDimmed={
                                  isSelectionActive && !activeIds.has(id2)
                                }
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
    </div>
  );
}

export default TreeScheme;
