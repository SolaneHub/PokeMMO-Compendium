import { z } from "zod";

export interface StrategyVariation {
  type: string;
  name?: string;
  steps?: StrategyStep[];
}

export interface StrategyStep {
  id: string;
  type: string;
  description?: string;
  notes?: string;
  player?: string;
  warning?: string;
  variations?: StrategyVariation[];
}

export const StrategyVariationSchema: z.ZodType<StrategyVariation> = z.lazy(
  () =>
    z.object({
      type: z.string(),
      name: z.string().optional(),
      steps: z.array(StrategyStepSchema).optional(),
    })
);

export const StrategyStepSchema: z.ZodType<StrategyStep> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: z.string(),
    description: z.string().optional(),
    notes: z.string().optional(),
    player: z.string().optional(),
    warning: z.string().optional(),
    variations: z.array(StrategyVariationSchema).optional(),
  })
);

export const TeamStatusSchema = z.enum([
  "draft",
  "pending",
  "approved",
  "rejected",
]);
export type TeamStatus = z.infer<typeof TeamStatusSchema>;

export const TeamMemberSchema = z.object({
  name: z.string(),
  item: z.string(),
  ability: z.string(),
  nature: z.string(),
  evs: z.string(),
  ivs: z.string(),
  moves: z.array(z.string()),
  move1: z.string().optional(),
  move2: z.string().optional(),
  move3: z.string().optional(),
  move4: z.string().optional(),
  dexId: z.union([z.number(), z.string()]).nullable().optional(),
});

export type TeamMember = z.infer<typeof TeamMemberSchema>;

// Firebase Timestamp/FieldValue mapping can be any at runtime
export const TeamSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  name: z.string(),
  region: z.string().nullable(),
  members: z.array(TeamMemberSchema.nullable()),
  strategies: z
    .record(z.string(), z.record(z.string(), z.array(StrategyStepSchema)))
    .optional(),
  enemyPools: z.record(z.string(), z.array(z.string())).optional(),
  status: TeamStatusSchema.optional(),
  isPublic: z.boolean().optional(),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
});

export type Team = z.infer<typeof TeamSchema>;
