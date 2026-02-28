import { z } from "zod";

import { PokemonType } from "../utils/pokemonColors";

export const BaseStatsSchema = z.object({
  hp: z.number(),
  atk: z.number(),
  def: z.number(),
  spa: z.number(),
  spd: z.number(),
  spe: z.number(),
});

export const PokemonAbilitiesSchema = z.object({
  main: z.array(z.string()),
  hidden: z.string().nullable(),
});

export const PokemonMoveSchema = z.object({
  name: z.string(),
  type: z.string().optional(),
  category: z.string().optional(),
  power: z.union([z.number(), z.string()]).optional(),
  accuracy: z.union([z.number(), z.string()]).optional(),
  pp: z.union([z.number(), z.string()]).optional(),
  effect: z.string().optional(),
  level: z.union([z.string(), z.number()]).optional(),
});

export const MoveMasterSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  category: z.string(),
  power: z.union([z.number(), z.string()]),
  accuracy: z.union([z.number(), z.string()]),
  pp: z.union([z.number(), z.string()]),
});

export const EvolutionSchema = z.object({
  name: z.string(),
  method: z.string().optional(),
  level: z.union([z.string(), z.number()]).optional(),
});

export const LocationSchema = z.object({
  region: z.string(),
  area: z.string(),
  rarity: z.string().optional(),
  method: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  levels: z.union([z.string(), z.number()]).optional(),
  type: z.string().optional(),
});

export const PokemonSchema = z.object({
  id: z.union([z.string(), z.number()]).nullable(),
  name: z.string(),
  category: z.string().optional(),
  types: z.array(z.custom<PokemonType>((val) => typeof val === "string")),
  description: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  genderRatio: z.object({ m: z.number(), f: z.number() }).optional(),
  catchRate: z.union([z.string(), z.number()]).optional(),
  baseExp: z.union([z.string(), z.number()]).optional(),
  growthRate: z.string().optional(),
  evYield: z.string().optional(),
  heldItems: z
    .union([z.string(), z.array(z.string()), z.record(z.string(), z.string())])
    .optional(),
  tier: z.string().optional(),
  abilities: PokemonAbilitiesSchema,
  eggGroups: z.union([z.array(z.string()), z.string()]).optional(),
  baseStats: BaseStatsSchema,
  moves: z.array(PokemonMoveSchema),
  evolutions: z.array(EvolutionSchema),
  locations: z.array(LocationSchema),
  variants: z
    .array(
      z.union([
        z.string(),
        z.object({ name: z.string(), category: z.string() }),
      ])
    )
    .optional(),
  dexId: z.union([z.number(), z.string()]).nullable().optional(),
});

export type BaseStats = z.infer<typeof BaseStatsSchema>;
export type PokemonAbilities = z.infer<typeof PokemonAbilitiesSchema>;
export type PokemonMove = z.infer<typeof PokemonMoveSchema>;
export type MoveMaster = z.infer<typeof MoveMasterSchema>;
export type Evolution = z.infer<typeof EvolutionSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type Pokemon = z.infer<typeof PokemonSchema>;
