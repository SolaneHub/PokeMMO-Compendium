import { z } from "zod";

import { PokemonType } from "@/utils/pokemonColors";

import { StrategyStepSchema } from "./teams";

export const SuperTrainerTeamSchema = z.object({
  pokemonNames: z.array(z.string()),
  pokemonStrategies: z.record(z.string(), z.array(StrategyStepSchema)),
});

export const SuperTrainerSchema = z.object({
  name: z.string(),
  region: z.string(),
  type: z.custom<PokemonType>(
    (val) => typeof val === "string",
    "Invalid PokemonType"
  ),
  image: z.string(),
  teams: z.record(z.string(), SuperTrainerTeamSchema),
});

export type SuperTrainerTeam = z.infer<typeof SuperTrainerTeamSchema>;
export type SuperTrainer = z.infer<typeof SuperTrainerSchema>;
