import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { generateBreedingTree, toggleTreeNode } from "./breedingTree";

describe("breedingTree property-based testing", () => {
  const stats = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"];

  it("Invariant 1: generateBreedingTree - tree structure and geometry", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 6 }),
        fc.boolean(),
        (ivCount, nature) => {
          const tree = generateBreedingTree(ivCount, stats, nature);
          const expectedTotalLevels = nature ? ivCount + 1 : ivCount;

          expect(tree.length).toBe(expectedTotalLevels);

          for (let r = 0; r < tree.length; r++) {
            const expectedNodesInRow = 2 ** (tree.length - 1 - r);
            const row = tree[r];
            expect(row).toBeDefined();
            expect(row?.length).toBe(expectedNodesInRow);
          }

          const rootRow = tree[tree.length - 1];
          expect(rootRow).toBeDefined();
          expect(rootRow?.length).toBe(1);
        }
      ),
      { numRuns: 200 }
    );
  });

  describe("Invariant 2: toggleTreeNode - propagation and idempotence", () => {
    it("toggling an active node removes its ID (toggle off)", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 6 }),
          fc.boolean(),
          (ivCount, nature) => {
            const tree = generateBreedingTree(ivCount, stats, nature);
            const totalRows = tree.length;

            for (let r = 0; r < totalRows; r++) {
              const row = tree[r];
              if (!row) continue;
              const rowLength = row.length;
              for (let c = 0; c < rowLength; c++) {
                const nodeId = `${r}-${c}`;
                const initialActiveIds = new Set<string>([nodeId]);
                const nextActiveIds = toggleTreeNode(
                  initialActiveIds,
                  r,
                  c,
                  totalRows
                );
                expect(nextActiveIds.has(nodeId)).toBe(false);
              }
            }
          }
        ),
        { numRuns: 20 }
      );
    });

    it("clicking a child node at r > 0 activates the node and its two parents at r - 1", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 2, max: 6 }),
          fc.boolean(),
          (ivCount, nature) => {
            const tree = generateBreedingTree(ivCount, stats, nature);
            const totalRows = tree.length;

            const r = 1;
            const c = 0;
            const clickedId = `${r}-${c}`;
            const parentLeftId = `${r - 1}-${c * 2}`;
            const parentRightId = `${r - 1}-${c * 2 + 1}`;

            const emptyActiveIds = new Set<string>();
            const activatedSet = toggleTreeNode(
              emptyActiveIds,
              r,
              c,
              totalRows
            );

            expect(activatedSet.has(clickedId)).toBe(true);
            expect(activatedSet.has(parentLeftId)).toBe(true);
            expect(activatedSet.has(parentRightId)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it("deactivating a parent at row 0 cascades to deactivate its child at row 1", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 2, max: 6 }),
          fc.boolean(),
          (ivCount, nature) => {
            const tree = generateBreedingTree(ivCount, stats, nature);
            const totalRows = tree.length;

            const childRow = 1;
            const childCol = 0;
            const parentRow = 0;
            const parentCol = 0;

            const activeSet = toggleTreeNode(
              new Set<string>(),
              childRow,
              childCol,
              totalRows
            );
            expect(activeSet.has(`${childRow}-${childCol}`)).toBe(true);
            expect(activeSet.has(`${parentRow}-${parentCol}`)).toBe(true);

            const deactivatedSet = toggleTreeNode(
              activeSet,
              parentRow,
              parentCol,
              totalRows
            );

            expect(deactivatedSet.has(`${parentRow}-${parentCol}`)).toBe(false);
            expect(deactivatedSet.has(`${childRow}-${childCol}`)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
