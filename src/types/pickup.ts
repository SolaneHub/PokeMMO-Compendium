import { z } from "zod";

export const PickupLocationSchema = z.object({
  name: z.string(),
  items: z.record(z.string(), z.array(z.string())),
});

export const PickupRegionSchema = z.object({
  id: z.string(),
  name: z.string(),
  note: z.string().optional(),
  locations: z.array(PickupLocationSchema),
});

export type PickupLocation = z.infer<typeof PickupLocationSchema>;
export type PickupRegion = z.infer<typeof PickupRegionSchema>;
