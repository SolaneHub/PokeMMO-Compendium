import { z } from "zod";

export interface RaidBuild {
  name: string;
  player?: string | undefined;
  item?: string | undefined;
  ability?: string | undefined;
  nature?: string | undefined;
  evs?: string | undefined;
  ivs?: string | undefined;
  moves?: string[] | undefined;
  order?: number | undefined;
  variants?: RaidBuild[] | undefined;
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
    order: z.preprocess(
      (val) => (typeof val === "string" ? Number.parseInt(val, 10) : val),
      z.number().optional()
    ),
    variants: z.array(z.lazy(() => RaidBuildSchema)).optional(),
  })
);
