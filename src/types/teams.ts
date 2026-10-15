import { z } from "zod";

export const TeamStatusSchema = z.enum([
  "draft",
  "pending",
  "approved",
  "rejected",
]);
export type TeamStatus = z.infer<typeof TeamStatusSchema>;
