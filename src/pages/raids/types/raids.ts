import { z } from "zod";

import { RaidBuild, RaidBuildSchema } from "@/types/raids";

export type { RaidBuild };
export { RaidBuildSchema };

export const RaidLocationSchema = z.object({
  area: z.string(),
  requirements: z.array(z.string().nullable()).nullish(),
});

export const RaidMechanicsSchema = z.object({
  ability: z.string().nullish(),
  heldItem: z.string().nullish(),
  notes: z.string().nullish(),
  thresholds: z
    .record(z.string(), z.union([z.string(), z.object({ effect: z.string() })]))
    .nullish(),
});

export const RaidRoleSchema = z.record(z.string(), z.string());

export const RaidStrategySchema = z.object({
  id: z.string().optional(),
  label: z.string().optional(),
  roles: z.record(z.string(), z.array(z.string())).default({}),
  recommended: z.array(RaidBuildSchema).default([]),
});

export const RaidSchema = z.object({
  name: z.string(),
  stars: z.number(),
  moves: z.array(z.string()).default([]),
  teamStrategies: z.array(RaidStrategySchema).default([]),
  locations: z
    .record(z.string(), z.union([RaidLocationSchema, z.string()]).nullable())
    .nullish(),
  mechanics: RaidMechanicsSchema.nullish(),
});

export type RaidLocation = z.infer<typeof RaidLocationSchema>;
export type RaidMechanics = z.infer<typeof RaidMechanicsSchema>;
export type RaidRole = z.infer<typeof RaidRoleSchema>;
export type RaidStrategy = z.infer<typeof RaidStrategySchema>;
export type Raid = z.infer<typeof RaidSchema>;
