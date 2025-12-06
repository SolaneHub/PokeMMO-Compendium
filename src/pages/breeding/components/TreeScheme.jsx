import { Minus, Plus, RefreshCcw } from "lucide-react";
import { useState } from "react";

import StatCircle from "@/pages/breeding/components/StatCircle";
import { usePersistentState } from "@/shared/utils/usePersistentState";

const STAT_COLOR_MAP = {
  HP: "#55b651",
  Attack: "#f72533",
  Defense: "#f78025",
  "Sp. Attack": "#e925f7",
  "Sp. Defense": "#f7e225",
  Speed: "#25e2f7",
  Nature: "#ffffff",
};

const NODE_SIZE = 48;
const BASE_PAIR_GAP = 40;
const BASE_ROW_GAP = 90;
const VERTICAL_GAP = 60;

const getColors = (stats) =>
  stats.map((stat) => STAT_COLOR_MAP[stat] || "#ffffff");

function TreeScheme({ selectedIvCount, selectedIvStats, nature }) {
  const [activeIdsArray, setActiveIdsArray] = usePersistentState(
    "breeding_activeNodes",
    []
  );
  // Manual Zoom State
  const [zoomLevel, setZoomLevel] = useState(1);

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

  return (
    <div className="flex flex-col items-center w-full h-full relative">
      {/* Legend / Key - Sticky inside the container */}
      <div className="sticky top-0 w-full flex items-center justify-between px-6 py-4 bg-[#1e2025]/95 backdrop-blur-md z-[20] border-b border-white/5 shadow-md">
        <div className="flex flex-wrap gap-2">
          {selectedIvStats.slice(0, selectedIvCount).map((statName, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 border border-white/10"
            >
              <StatCircle
                ivColors={[STAT_COLOR_MAP[statName]]}
                size={12}
                className="shadow-none"
              />
              <span className="text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                {statName}
              </span>
            </div>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-lg p-1 ml-4 shrink-0">
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.1, 0.3))}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="text-xs font-mono text-slate-300 w-10 text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.1, 2.0))}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <Plus size={16} />
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Reset Zoom"
          >
            <RefreshCcw size={14} />
          </button>
        </div>
      </div>

      {/* Scrollable Tree Area */}
      <div className="flex-1 w-full overflow-auto p-8 relative bg-[url('/grid.svg')] bg-opacity-5">
        {/*
          Using min-w-max to ensure the container expands to fit the content horizontally.
          The transform origin is top-center to keep it centered while zooming.
        */}
        <div className="min-w-max mx-auto pb-20 pt-10">
          <div
            className="flex flex-col items-center transition-transform duration-200 ease-out origin-top"
            style={{
              gap: `${VERTICAL_GAP}px`,
              transform: `scale(${zoomLevel})`,
              "--node-size": `${NODE_SIZE}px`,
              "--vertical-gap": `${VERTICAL_GAP}px`,
            }}
          >
            {dataByRow.map((rowItems, rowIndex) => {
              const config = rowConfigs[rowIndex];
              const isLastRow = rowIndex === totalRows - 1;

              return (
                <div
                  key={`row-${rowIndex}`}
                  className="flex justify-center"
                  style={{
                    gap: `${config.rowGap}px`,
                  }}
                >
                  {rowItems.reduce((pairs, colors, i) => {
                    if (i % 2 === 0) {
                      const next = rowItems[i + 1];
                      const id1 = `${rowIndex}-${i}`;
                      const id2 = `${rowIndex}-${i + 1}`;

                      pairs.push(
                        <div
                          className={`
                            relative flex justify-center items-center
                            ${
                              !isLastRow
                                ? "before:content-[''] before:absolute before:h-[1px] before:bg-white/20 before:top-1/2 before:left-0 before:right-0 before:mx-[calc(var(--node-size)/2)] before:-z-10 after:content-[''] after:absolute after:w-[1px] after:bg-white/20 after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:h-[calc(var(--vertical-gap)+var(--node-size)/2+10px)] after:-z-10"
                                : ""
                            }
                          `}
                          style={{ gap: `${config.pairGap}px` }}
                          key={`${rowIndex}-pair-${i / 2}`}
                        >
                          <div className="relative flex items-center justify-center z-[2]">
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
                            <div className="relative flex items-center justify-center z-[2]">
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
