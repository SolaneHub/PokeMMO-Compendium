// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { useStrategyNavigation } from "@/hooks/useStrategyNavigation";
import { StrategyStep, StrategyVariation } from "@/types/strategy";

// Arbitrary generator for recursive StrategyStep and StrategyVariation trees
const generateStrategyArbitrary = () => {
  let stepIdCounter = 0;
  const nextId = () =>
    `step_${++stepIdCounter}_${Math.random().toString(36).substring(2, 7)}`;

  const leafStepArb = fc.record<StrategyStep>({
    id: fc.string({ minLength: 1 }).map(() => nextId()),
    type: fc.constantFrom("move", "switch", "item", "text", "faint"),
    description: fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
      nil: undefined,
    }),
    notes: fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
      nil: undefined,
    }),
    player: fc.option(fc.constantFrom("Player 1", "Player 2", "Boss"), {
      nil: undefined,
    }),
    warning: fc.option(fc.string({ minLength: 1, maxLength: 30 }), {
      nil: undefined,
    }),
    variations: fc.constant(undefined),
  });

  const stepArb: fc.Memo<StrategyStep> = fc.memo((n) => {
    if (n <= 0) return leafStepArb;

    const variationArb = fc.record<StrategyVariation>({
      type: fc.constantFrom("branch", "critical", "alternate", "contingency"),
      name: fc.option(fc.string({ minLength: 1, maxLength: 30 }), {
        nil: undefined,
      }),
      warning: fc.option(fc.string({ minLength: 1, maxLength: 30 }), {
        nil: undefined,
      }),
      steps: fc.option(
        fc.array(stepArb(n - 1), { minLength: 1, maxLength: 3 }),
        { nil: undefined }
      ),
    });

    return fc.record<StrategyStep>({
      id: fc.string({ minLength: 1 }).map(() => nextId()),
      type: fc.constantFrom("move", "switch", "item", "text", "faint"),
      description: fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
        nil: undefined,
      }),
      notes: fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
        nil: undefined,
      }),
      player: fc.option(fc.constantFrom("Player 1", "Player 2", "Boss"), {
        nil: undefined,
      }),
      warning: fc.option(fc.string({ minLength: 1, maxLength: 30 }), {
        nil: undefined,
      }),
      variations: fc.option(
        fc.array(variationArb, { minLength: 1, maxLength: 2 }),
        { nil: undefined }
      ),
    });
  });

  return fc.array(stepArb(2), { minLength: 1, maxLength: 5 });
};

// Also arbitrary variations to fuzz navigation with valid and invalid/malformed inputs
const arbitraryFuzzVariation: fc.Arbitrary<StrategyVariation> = fc.oneof(
  // Valid variation with steps
  fc.record<StrategyVariation>({
    type: fc.string(),
    name: fc.option(fc.string(), { nil: undefined }),
    steps: fc.array(
      fc.record<StrategyStep>({
        id: fc.string({ minLength: 1 }),
        type: fc.string(),
      }),
      { minLength: 0, maxLength: 4 }
    ),
  }),
  // Variation with undefined / null / malformed steps
  fc.record<StrategyVariation>({
    type: fc.string(),
    name: fc.option(fc.string(), { nil: undefined }),
    steps: fc.constant(undefined),
  }),
  // Completely untyped or null object cast as StrategyVariation
  fc.constant(null as unknown as StrategyVariation),
  fc.constant(undefined as unknown as StrategyVariation),
  fc.constant({ type: "empty" } as StrategyVariation)
);

type ActionCommand =
  | {
      type: "NAVIGATE";
      pickFromCurrent: boolean;
      fallbackVar: StrategyVariation;
    }
  | { type: "BACK" }
  | { type: "RESET" }
  | { type: "INITIALIZE"; useNull: boolean };

const arbitraryActionCommand: fc.Arbitrary<ActionCommand> = fc.oneof(
  fc.record({
    type: fc.constant("NAVIGATE" as const),
    pickFromCurrent: fc.boolean(),
    fallbackVar: arbitraryFuzzVariation,
  }),
  fc.constant({ type: "BACK" as const }),
  fc.constant({ type: "RESET" as const }),
  fc.record({
    type: fc.constant("INITIALIZE" as const),
    useNull: fc.boolean(),
  })
);

describe("Strategy State Machine Fuzzer", () => {
  it("maintains invariants across random sequences of navigation, branching, and backtracking", () => {
    fc.assert(
      fc.property(
        generateStrategyArbitrary(),
        fc.array(arbitraryActionCommand, { minLength: 1, maxLength: 50 }),
        (initialSteps, commands) => {
          const { result } = renderHook(() => useStrategyNavigation());

          // Initially initialize with generated strategy
          act(() => {
            result.current.initializeStrategy(initialSteps);
          });

          // Helper to gather all reachable step IDs in a tree
          const collectAllStepIds = (steps: StrategyStep[]): Set<string> => {
            const ids = new Set<string>();
            const traverse = (stepList?: StrategyStep[]) => {
              if (!stepList) return;
              for (const s of stepList) {
                if (s && s.id) ids.add(s.id);
                if (s?.variations) {
                  for (const v of s.variations) {
                    if (v?.steps) traverse(v.steps);
                  }
                }
              }
            };
            traverse(steps);
            return ids;
          };

          const initialValidIds = collectAllStepIds(initialSteps);

          // Track state execution
          for (const cmd of commands) {
            act(() => {
              switch (cmd.type) {
                case "NAVIGATE": {
                  let targetVariation: StrategyVariation | null = null;
                  if (
                    cmd.pickFromCurrent &&
                    result.current.currentStrategyView.length > 0
                  ) {
                    for (const step of result.current.currentStrategyView) {
                      if (step?.variations && step.variations.length > 0) {
                        const randomVar =
                          step.variations[
                            Math.floor(Math.random() * step.variations.length)
                          ];
                        if (randomVar) {
                          targetVariation = randomVar;
                          break;
                        }
                      }
                    }
                  }
                  if (!targetVariation) {
                    targetVariation = cmd.fallbackVar;
                  }

                  // Fuzz navigateToStep: must never throw unhandled exception
                  expect(() => {
                    result.current.navigateToStep(
                      targetVariation as StrategyVariation
                    );
                  }).not.toThrow();
                  break;
                }
                case "BACK": {
                  expect(() => {
                    result.current.navigateBack();
                  }).not.toThrow();
                  break;
                }
                case "RESET": {
                  expect(() => {
                    result.current.resetStrategy();
                  }).not.toThrow();
                  break;
                }
                case "INITIALIZE": {
                  expect(() => {
                    result.current.initializeStrategy(
                      cmd.useNull ? null : initialSteps
                    );
                  }).not.toThrow();
                  break;
                }
              }
            });

            // --- Assert Invariants After Each Action ---

            // Invariant 1: History length is non-negative and matches breadcrumbs
            const historyLen = result.current.strategyHistory.length;
            const breadcrumbsLen = result.current.breadcrumbs.length;
            expect(historyLen).toBeGreaterThanOrEqual(0);
            expect(breadcrumbsLen).toBeGreaterThanOrEqual(0);
            expect(historyLen).toBe(breadcrumbsLen);

            // Invariant 2: Active steps always reference valid IDs (defined and non-empty string)
            const currentView = result.current.currentStrategyView;
            expect(Array.isArray(currentView)).toBe(true);
            for (const step of currentView) {
              expect(step).toBeDefined();
              expect(typeof step.id).toBe("string");
              expect(step.id.length).toBeGreaterThan(0);
            }

            // Invariant 3: History items are all valid step arrays
            for (const histView of result.current.strategyHistory) {
              expect(Array.isArray(histView)).toBe(true);
              for (const step of histView) {
                expect(step).toBeDefined();
                expect(typeof step.id).toBe("string");
                expect(step.id.length).toBeGreaterThan(0);
              }
            }
          }

          // Resetting returns to initial empty state without leaving dangling references
          act(() => {
            result.current.resetStrategy();
          });
          expect(result.current.currentStrategyView).toEqual([]);
          expect(result.current.strategyHistory).toEqual([]);
          expect(result.current.breadcrumbs).toEqual([]);

          // Re-initializing to initialSteps restores valid step 0 references
          act(() => {
            result.current.initializeStrategy(initialSteps);
          });
          expect(result.current.currentStrategyView).toBe(initialSteps);
          expect(result.current.strategyHistory).toEqual([]);
          expect(result.current.breadcrumbs).toEqual([]);
          if (
            initialSteps.length > 0 &&
            result.current.currentStrategyView[0]?.id
          ) {
            expect(
              initialValidIds.has(result.current.currentStrategyView[0].id)
            ).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
