import { z } from "zod";

export const RaidLocationSchema = z.object({
  area: z.string(),
  requirements: z.array(z.string()).optional(),
});

export const RaidMechanicsSchema = z.object({
  ability: z.string().optional(),
  heldItem: z.string().optional(),
  notes: z.string().optional(),
  thresholds: z
    .record(z.string(), z.union([z.string(), z.object({ effect: z.string() })]))
    .optional(),
});

export const RaidRoleSchema = z.record(z.string(), z.string());

export interface RaidBuild {
  name: string;
  player?: string;
  item?: string;
  ability?: string;
  nature?: string;
  evs?: string;
  ivs?: string;
  moves?: string[];
  order?: number;
  variants?: RaidBuild[];
}

export const RaidBuildSchema: z.ZodType<RaidBuild> = z.lazy(() =>
  z.object({
    name: z.string(),
    player: z.string().optional(),
    item: z.string().optional(),
    ability: z.string().optional(),
    nature: z.string().optional(),
    evs: z.string().optional(),
    ivs: z.string().optional(),
    moves: z.array(z.string()).optional(),
    order: z.number().optional(),
    variants: z.array(RaidBuildSchema).optional(),
  })
);

export const RaidStrategySchema = z.object({
  id: z.string().optional(),
  label: z.string().optional(),
  roles: z.record(z.string(), z.array(z.string())),
  recommended: z.array(RaidBuildSchema),
});

export const RaidSchema = z.object({
  name: z.string(),
  stars: z.number(),
  moves: z.array(z.string()),
  teamStrategies: z.array(RaidStrategySchema),
  locations: z
    .record(z.string(), z.union([RaidLocationSchema, z.string()]))
    .optional(),
  mechanics: RaidMechanicsSchema.optional(),
});

export type RaidLocation = z.infer<typeof RaidLocationSchema>;
export type RaidMechanics = z.infer<typeof RaidMechanicsSchema>;
export type RaidRole = z.infer<typeof RaidRoleSchema>;
export type RaidStrategy = z.infer<typeof RaidStrategySchema>;
export type Raid = z.infer<typeof RaidSchema>;
