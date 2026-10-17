import { z } from "zod";

import { StrategyStepSchema } from "@/types/strategy";

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

export const FirestoreTimestampSchema = z.union([
  z.date(),
  z.number(),
  z.string(),
  z.custom<{ toDate: () => Date }>(
    (val) =>
      typeof val === "object" &&
      val !== null &&
      "toDate" in val &&
      typeof (val as { toDate: unknown }).toDate === "function"
  ),
  z.object({
    seconds: z.number(),
    nanoseconds: z.number().optional(),
  }),
]);

export type FirestoreTimestamp = z.infer<typeof FirestoreTimestampSchema>;

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
  createdAt: FirestoreTimestampSchema.optional(),
  updatedAt: FirestoreTimestampSchema.optional(),
});

export type Team = z.infer<typeof TeamSchema>;
