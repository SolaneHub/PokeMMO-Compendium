import "./TreeScheme.css";

import { usePersistentState } from "@/shared/utils/usePersistentState";

import StatCircle from "./StatCircle";

const STAT_COLOR_MAP = {
  HP: "#55b651",
  Attack: "#f72533",
  Defense: "#f78025",
  "Sp. Attack": "#e925f7",
  "Sp. Defense": "#f7e225",
  Speed: "#25e2f7",
  Nature: "#ffffff",
};

const NODE_SIZE = 50;
const BASE_PAIR_GAP = 50;
const BASE_ROW_GAP = 100;
const VERTICAL_GAP = 60;

const getColors = (stats) =>
  stats.map((stat) => STAT_COLOR_MAP[stat] || "#ffffff");

function TreeScheme({ selectedIvCount, selectedIvStats, nature }) {
  const [activeIdsArray, setActiveIdsArray] = usePersistentState(
    "breeding_activeNodes",
    []
  );

  const activeIds = new Set(activeIdsArray);

  const updateActiveIds = (newSet) => {
    setActiveIdsArray(Array.from(newSet));
  };

  const generateTree = () => {
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
          nextLevel.push(nodeStats.slice(0, -1), nodeStats.slice(1));
        }
      });
      currentLevel = nextLevel;
    }
    return levels
      .map((level) => level.map((nodeStats) => getColors(nodeStats)))
      .reverse();
  };

  const dataByRow = generateTree();
  const totalRows = dataByRow.length;

  const handleNodeClick = (rowIndex, colIndex) => {
    const clickedId = `${rowIndex}-${colIndex}`;
    const newSet = new Set(activeIds);
    const isTurningOn = !newSet.has(clickedId);

    if (isTurningOn) {
      newSet.add(clickedId);
      const activateAncestors = (r, c) => {
        if (r === 0) return;
        const parentRow = r - 1;
        newSet.add(`${parentRow}-${c * 2}`);
        newSet.add(`${parentRow}-${c * 2 + 1}`);
        activateAncestors(parentRow, c * 2);
        activateAncestors(parentRow, c * 2 + 1);
      };
      activateAncestors(rowIndex, colIndex);
    } else {
      newSet.delete(clickedId);

      const deactivateDescendants = (r, c) => {
        const childRow = r + 1;
        if (childRow >= totalRows) return;
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
        const leftP = `${parentRow}-${c * 2}`;
        const rightP = `${parentRow}-${c * 2 + 1}`;
        if (newSet.has(leftP)) {
          newSet.delete(leftP);
          deactivateAncestors(parentRow, c * 2);
        }
        if (newSet.has(rightP)) {
          newSet.delete(rightP);
          deactivateAncestors(parentRow, c * 2 + 1);
        }
      };
      deactivateAncestors(rowIndex, colIndex);
    }

    updateActiveIds(newSet);
  };

  const rowConfigs = Array.from({ length: totalRows }, () => ({
    size: NODE_SIZE,
    pairGap: 0,
    rowGap: 0,
  }));

  if (rowConfigs.length > 0) {
    rowConfigs[0].pairGap = BASE_PAIR_GAP;
    rowConfigs[0].rowGap = BASE_ROW_GAP;
  }

  for (let i = 0; i < totalRows - 1; i++) {
    const current = rowConfigs[i];
    const next = rowConfigs[i + 1];
    const dist = 2 * current.size + current.pairGap + current.rowGap;
    const nextGap = dist - next.size;
    next.pairGap = nextGap;
    next.rowGap = nextGap;
  }

  const scale = nature
    ? selectedIvCount >= 6
      ? 0.9
      : selectedIvCount === 5
        ? 0.95
        : 1.0
    : selectedIvCount >= 6
      ? 0.95
      : 1.0;

  return (
    <div className="tree-scheme-container">
      <div className="legend-container">
        <div className="legend-items">
          {selectedIvStats.slice(0, selectedIvCount).map((statName, index) => (
            <div key={index} className="legend-item">
              <span className="legend-stat-name">{statName}</span>
              <StatCircle ivColors={[STAT_COLOR_MAP[statName]]} />
            </div>
          ))}
        </div>
      </div>

      <div className="tree-scroll-view">
        <div className="tree-wrapper">
          <div
            className="tree-container"
            style={{ "--scale": scale, "--vertical-gap": `${VERTICAL_GAP}px` }}
          >
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
                              onClick={() => handleNodeClick(rowIndex, i)}
                              isActive={activeIds.has(id1)}
                              isDimmed={
                                activeIds.size > 0 && !activeIds.has(id1)
                              }
                            />
                          </div>
                          {next && (
                            <div className="tree-node">
                              <StatCircle
                                ivColors={next}
                                onClick={() => handleNodeClick(rowIndex, i + 1)}
                                isActive={activeIds.has(id2)}
                                isDimmed={
                                  activeIds.size > 0 && !activeIds.has(id2)
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
