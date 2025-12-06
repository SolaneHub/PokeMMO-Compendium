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
    <div className="flex flex-col items-center w-full relative box-border">
      <div className="sticky top-0 w-full flex justify-center py-2.5 pb-5 z-[200] bg-black/80 backdrop-blur-sm">
        <div className="flex flex-wrap justify-center gap-2.5">
          {selectedIvStats.slice(0, selectedIvCount).map((statName, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-1.5 w-[90px] text-center"
            >
              <span className="w-full text-slate-200 text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                {statName}
              </span>
              <StatCircle ivColors={[STAT_COLOR_MAP[statName]]} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-[100vw] overflow-x-auto overflow-y-hidden px-5 pb-5 box-border scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-700 hover:scrollbar-thumb-blue-500">
        <div className="flex items-end justify-center min-w-max mx-auto pb-5">
          <div
            className="flex flex-col items-center pt-2.5 origin-top"
            style={{
              gap: `${VERTICAL_GAP}px`,
              transform: `scale(${scale})`,
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
                                ? "before:content-[''] before:absolute before:h-[2px] before:bg-white before:opacity-30 before:top-1/2 before:left-0 before:right-0 before:mx-[calc(var(--node-size)/2)] before:-z-10 after:content-[''] after:absolute after:w-[2px] after:bg-white after:opacity-30 after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:h-[calc(var(--vertical-gap)+var(--node-size)/2+10px)] after:-z-10"
                                : ""
                            }
                          `}
                          style={{ gap: `${config.pairGap}px` }}
                          key={`${rowIndex}-pair-${i / 2}`}
                        >
                          <div className="relative flex items-center justify-center z-[2] group/node">
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
                            <div className="relative flex items-center justify-center z-[2] group/node">
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
