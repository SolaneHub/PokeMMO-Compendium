import { z } from "zod";

import { generateId } from "@/utils/idUtils";

export interface StrategyVariation {
  type: string;
  name?: string | undefined;
  warning?: string | undefined;
  steps?: StrategyStep[] | undefined;
}

export const StrategyVariationSchema: z.ZodType<StrategyVariation> = z.lazy(
  () =>
    z.object({
      type: z.string(),
      name: z.string().optional(),
      warning: z.string().optional(),
      steps: z.array(z.lazy(() => StrategyStepSchema)).optional(),
    })
);

export interface StrategyStep {
  id: string;
  type: string;
  description?: string | undefined;
  notes?: string | undefined;
  player?: string | undefined;
  warning?: string | undefined;
  variations?: StrategyVariation[] | undefined;
}

export const StrategyStepSchema: z.ZodType<StrategyStep> = z.lazy(() =>
  z.object({
    id: z.string().default(() => generateId("step")),
    type: z.string(),
    description: z.string().optional(),
    notes: z.string().optional(),
    player: z.string().optional(),
    warning: z.string().optional(),
    variations: z.array(StrategyVariationSchema).optional(),
  })
);
