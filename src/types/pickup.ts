export interface PickupLocation {
  name: string;
  items: Record<string, string[]>;
}

export interface PickupRegion {
  id: string;
  name: string;
  note?: string;
  locations: PickupLocation[];
}
