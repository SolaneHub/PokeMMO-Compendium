import { z } from "zod";

import { PokemonType } from "@/utils/pokemonColors";

import { StrategyStepSchema } from "./teams";

export const BossFightTeamSchema = z.object({
  pokemonNames: z.array(z.string()).default([]),
  pokemonStrategies: z
    .record(z.string(), z.array(z.union([z.string(), StrategyStepSchema])))
    .default({}),
});

export const BossFightSchema = z.object({
  name: z.string(),
  region: z.string(),
  type: z.custom<PokemonType>(
    (val) => typeof val === "string",
    "Invalid PokemonType"
  ),
  image: z.string().optional(),
  teams: z.record(z.string(), BossFightTeamSchema),
});

export type BossFightTeam = z.infer<typeof BossFightTeamSchema>;
export type BossFight = z.infer<typeof BossFightSchema>;
