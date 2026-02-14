export interface RaidLocation {
  area: string;
  requirements?: string[];
}

export interface RaidMechanics {
  ability?: string;
  heldItem?: string;
  notes?: string;
  thresholds?: Record<string, string | { effect: string }>;
}

export type RaidRole = Record<string, string>;

export interface RaidBuild {
  name: string;
  player?: string;
  item?: string;
  ability?: string;
  nature?: string;
  evs?: string;
  ivs?: string;
  moves?: string[];
  order?: number;
}

export interface RaidStrategy {
  id?: string;
  label?: string;
  roles: Record<string, string[]>;
  recommended: RaidBuild[];
}

export interface Raid {
  name: string;
  stars: number;
  moves: string[];
  teamStrategies: RaidStrategy[];
  locations?: Record<string, RaidLocation | string>;
  mechanics?: RaidMechanics;
}
