import { STAT_COLOR_MAP } from "@/constants/breedingConstants";

export interface RowConfig {
  size: number;
  pairGap: number;
  rowGap: number;
}

export const NODE_SIZE = 48;
export const BASE_PAIR_GAP = 40;
export const BASE_ROW_GAP = 90;
export const VERTICAL_GAP = 60;

export const getStatColors = (stats: string[]): string[] =>
  stats.map(
    (stat) => (STAT_COLOR_MAP as Record<string, string>)[stat] || "#ffffff"
  );

/**
 * Generates the breeding binary tree level data with hex color arrays for each node.
 */
export function generateBreedingTree(
  selectedIvCount: number,
  selectedIvStats: string[],
  nature: boolean
): string[][][] {
  const clampedCount = Math.min(selectedIvCount ?? 0, 6);
  const baseStats = selectedIvStats.slice(0, clampedCount);
  const stats = nature ? ["Nature", ...baseStats] : baseStats;
  if (stats.length === 0) return [];

  const levels: string[][][] = [];
  let currentLevel: string[][] = [stats];

  while (currentLevel.length > 0) {
    levels.push(currentLevel);
    const nextLevel: string[][] = [];
    currentLevel.forEach((nodeStats) => {
      if (nodeStats.length > 1) {
        nextLevel.push(nodeStats.slice(0, -1), nodeStats.slice(1));
      }
    });
    currentLevel = nextLevel;
  }

  return levels
    .map((level) => level.map((nodeStats) => getStatColors(nodeStats)))
    .reverse();
}

/**
 * Toggles a node in the breeding tree and returns the updated set of active node IDs.
 * Implements bidirectional ancestor and descendant activation/deactivation.
 */
export function toggleTreeNode(
  activeIds: Set<string>,
  rowIndex: number,
  colIndex: number,
  totalRows: number
): Set<string> {
  const clickedId = `${rowIndex}-${colIndex}`;
  const newSet = new Set(activeIds);
  const isTurningOn = !newSet.has(clickedId);

  if (isTurningOn) {
    newSet.add(clickedId);
    const activateAncestors = (r: number, c: number) => {
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
    const deactivateDescendants = (r: number, c: number) => {
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

    const deactivateAncestors = (r: number, c: number) => {
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

  return newSet;
}

/**
 * Calculates spacing and dimensions for each row in the tree scheme.
 */
export function calculateRowConfigs(totalRows: number): RowConfig[] {
  const rowConfigs: RowConfig[] = Array.from({ length: totalRows }, () => ({
    size: NODE_SIZE,
    pairGap: 0,
    rowGap: 0,
  }));

  if (rowConfigs.length > 0) {
    const firstConfig = rowConfigs[0];
    if (firstConfig) {
      firstConfig.pairGap = BASE_PAIR_GAP;
      firstConfig.rowGap = BASE_ROW_GAP;
    }
  }

  for (let i = 0; i < totalRows - 1; i++) {
    const current = rowConfigs[i];
    const next = rowConfigs[i + 1];
    if (current && next) {
      const dist = 2 * current.size + current.pairGap + current.rowGap;
      const nextGap = dist - next.size;
      next.pairGap = nextGap;
      next.rowGap = nextGap;
    }
  }

  return rowConfigs;
}
