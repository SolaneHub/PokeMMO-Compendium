import { Minus, Plus, RefreshCcw } from "lucide-react";
import { CSSProperties, useMemo, useState } from "react";

import StatCircle from "@/components/ui/StatCircle";
import { STAT_COLOR_MAP } from "@/constants/breedingConstants";
import { usePersistentState } from "@/hooks/usePersistentState";
import {
  calculateRowConfigs,
  generateBreedingTree,
  NODE_SIZE,
  toggleTreeNode,
  VERTICAL_GAP,
} from "@/pages/breeding/utils/breedingTree";

interface TreeSchemeProps {
  readonly selectedIvCount: number;
  readonly selectedIvStats: string[];
  readonly nature: boolean;
}

interface CustomCSSProperties extends CSSProperties {
  "--node-size"?: string;
  "--vertical-gap"?: string;
}

function TreeScheme({
  selectedIvCount,
  selectedIvStats,
  nature,
}: TreeSchemeProps) {
  const [activeIdsArray, setActiveIdsArray] = usePersistentState<string[]>(
    "breeding_activeNodes",
    []
  );
  const [zoomLevel, setZoomLevel] = useState(1);

  const activeIds = useMemo(() => new Set(activeIdsArray), [activeIdsArray]);

  const updateActiveIds = (newSet: Set<string>) => {
    setActiveIdsArray(Array.from(newSet));
  };

  const dataByRow = useMemo(
    () => generateBreedingTree(selectedIvCount, selectedIvStats, nature),
    [selectedIvCount, selectedIvStats, nature]
  );
  const totalRows = dataByRow.length;

  const handleNodeClick = (rowIndex: number, colIndex: number) => {
    const newSet = toggleTreeNode(activeIds, rowIndex, colIndex, totalRows);
    updateActiveIds(newSet);
  };

  const rowConfigs = useMemo(() => calculateRowConfigs(totalRows), [totalRows]);

  return (
    <div className="relative flex h-full w-full flex-col items-center text-white">
      {/* Legend / Key - Sticky inside the container */}
      <div className="sticky top-0 z-20 flex w-full items-center justify-between border-b border-white/5 bg-[#1e2025]/95 px-6 py-4 shadow-md backdrop-blur-md">
        <div className="flex flex-wrap gap-2">
          {selectedIvStats.slice(0, selectedIvCount).map((statName) => (
            <div
              key={`legend-stat-${statName}`}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-2.5 py-1"
            >
              <StatCircle
                ivColors={[
                  (STAT_COLOR_MAP as Record<string, string>)[statName] ||
                    "#ffffff",
                ]}
                size={12}
                className="shadow-none"
              />
              <span className="text-[10px] font-bold tracking-wider uppercase">
                {statName}
              </span>
            </div>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="ml-4 flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-black/40 p-1">
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.1, 0.3))}
            className="rounded p-1.5 transition-colors hover:bg-white/10"
          >
            <Minus size={16} />
          </button>
          <span className="w-10 text-center font-mono text-xs">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.1, 2))}
            className="rounded p-1.5 transition-colors hover:bg-white/10"
          >
            <Plus size={16} />
          </button>
          <div className="mx-1 h-4 w-px bg-white/10" />
          <button
            onClick={() => setZoomLevel(1)}
            className="rounded p-1.5 transition-colors hover:bg-white/10"
            title="Reset Zoom"
          >
            <RefreshCcw size={14} />
          </button>
        </div>
      </div>

      {/* Scrollable Tree Area */}
      <div className="bg-opacity-5 relative w-full flex-1 overflow-auto bg-[url('/grid.svg')] p-8">
        <div className="mx-auto min-w-max pt-10 pb-20">
          <div
            className="flex origin-top flex-col items-center transition-transform duration-200 ease-out"
            style={
              {
                gap: `${VERTICAL_GAP}px`,
                transform: `scale(${zoomLevel})`,
                "--node-size": `${NODE_SIZE}px`,
                "--vertical-gap": `${VERTICAL_GAP}px`,
              } as CustomCSSProperties
            }
          >
            {dataByRow.map((rowItems, rowIndex) => {
              const config = rowConfigs[rowIndex];
              const isLastRow = rowIndex === totalRows - 1;
              const rowKey = rowItems.map((item) => item.join("")).join("-");
              return (
                <div
                  key={`row-${rowKey}-${rowIndex}`}
                  className="flex justify-center"
                  style={{ gap: `${config?.rowGap || 0}px` }}
                >
                  {rowItems.reduce((pairs: React.ReactElement[], colors, i) => {
                    if (i % 2 === 0) {
                      const next = rowItems[i + 1];
                      const id1 = `${rowIndex}-${i}`;
                      const id2 = `${rowIndex}-${i + 1}`;
                      pairs.push(
                        <div
                          className={`relative flex items-center justify-center ${
                            isLastRow
                              ? ""
                              : "before:absolute before:top-1/2 before:right-0 before:left-0 before:-z-10 before:mx-[calc(var(--node-size)/2)] before:h-px before:bg-white/20 before:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-z-10 after:h-[calc(var(--vertical-gap)+var(--node-size)/2+10px)] after:w-px after:-translate-x-1/2 after:bg-white/20 after:content-['']"
                          } `}
                          style={{ gap: `${config?.pairGap || 0}px` }}
                          key={`${rowIndex}-pair-${i / 2}`}
                        >
                          <div className="relative z-2 flex items-center justify-center">
                            <StatCircle
                              ivColors={colors}
                              size={NODE_SIZE}
                              onClick={() => handleNodeClick(rowIndex, i)}
                              isActive={activeIds.has(id1)}
                              isDimmed={
                                activeIds.size > 0 && !activeIds.has(id1)
                              }
                            />
                          </div>
                          {next && (
                            <div className="relative z-2 flex items-center justify-center">
                              <StatCircle
                                ivColors={next}
                                size={NODE_SIZE}
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
