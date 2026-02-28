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
  category: z.string().optional().nullable(),
  types: z
    .array(z.custom<PokemonType>((val) => typeof val === "string"))
    .optional()
    .nullable(),
  description: z.string().optional().nullable(),
  height: z.string().optional().nullable(),
  weight: z.string().optional().nullable(),
  genderRatio: z.object({ m: z.number(), f: z.number() }).optional().nullable(),
  catchRate: z.union([z.string(), z.number()]).optional().nullable(),
  baseExp: z.union([z.string(), z.number()]).optional().nullable(),
  growthRate: z.string().optional().nullable(),
  evYield: z.string().optional().nullable(),
  heldItems: z
    .union([z.string(), z.array(z.string()), z.record(z.string(), z.string())])
    .optional()
    .nullable(),
  tier: z.string().optional().nullable(),
  abilities: PokemonAbilitiesSchema.optional().nullable(),
  eggGroups: z.union([z.array(z.string()), z.string()]).optional().nullable(),
  baseStats: BaseStatsSchema.optional().nullable(),
  moves: z.array(PokemonMoveSchema).optional().nullable(),
  evolutions: z.array(EvolutionSchema).optional().nullable(),
  locations: z.array(LocationSchema).optional().nullable(),
  variants: z
    .array(
      z.union([
        z.string(),
        z.object({ name: z.string(), category: z.string() }),
      ])
    )
    .optional()
    .nullable(),
  dexId: z.union([z.number(), z.string()]).nullable().optional(),
});

export type BaseStats = z.infer<typeof BaseStatsSchema>;
export type PokemonAbilities = z.infer<typeof PokemonAbilitiesSchema>;
export type PokemonMove = z.infer<typeof PokemonMoveSchema>;
export type MoveMaster = z.infer<typeof MoveMasterSchema>;
export type Evolution = z.infer<typeof EvolutionSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type Pokemon = z.infer<typeof PokemonSchema>;
