import { z } from "zod";

export const IntroSchema = z.object({
  title: z.string(),
  description: z.array(z.string()),
});

export const RequirementSchema = z.object({
  title: z.string(),
  items: z.array(z.string()),
});

export const TipsTricksSchema = z.object({
  title: z.string(),
  items: z.array(z.string()),
});

export const TrainerSchema = z.object({
  name: z.string(),
  money: z.union([z.string(), z.number()]),
});

export interface Route {
  name: string;
  notes?: string[] | undefined;
  trainers?: Trainer[] | undefined;
  pp_cost?: string | number | undefined;
  type?: string | undefined;
}

export const RouteSchema: z.ZodType<Route> = z.object({
  name: z.string(),
  notes: z.array(z.string()).optional(),
  trainers: z.array(TrainerSchema).optional(),
  pp_cost: z.union([z.string(), z.number()]).optional(),
  type: z.string().optional(),
});

export interface RegionRoute {
  name: string;
  routes: Route[];
}

export const RegionRouteSchema: z.ZodType<RegionRoute> = z.object({
  name: z.string(),
  routes: z.array(RouteSchema),
});

export const TrainerRerunDataSchema = z.object({
  intro: IntroSchema,
  requirements: RequirementSchema,
  tips_tricks: TipsTricksSchema,
  regions: z.array(RegionRouteSchema),
  source: z.array(z.string()).optional(),
});

export type Intro = z.infer<typeof IntroSchema>;
export type Requirement = z.infer<typeof RequirementSchema>;
export type TipsTricks = z.infer<typeof TipsTricksSchema>;
export type Trainer = z.infer<typeof TrainerSchema>;
export type TrainerRerunData = z.infer<typeof TrainerRerunDataSchema>;
