import { FieldValue, Timestamp } from "firebase/firestore";

export interface StrategyStep {
  id: string;
  type: string;
  description?: string;
  notes?: string;
  player?: string;
  warning?: string;
  variations?: StrategyVariation[];
}

export interface StrategyVariation {
  type: string;
  name?: string;
  steps?: StrategyStep[];
}

export type TeamStatus = "draft" | "pending" | "approved" | "rejected";

export interface TeamMember {
  name: string;
  item: string;
  ability: string;
  nature: string;
  evs: string;
  ivs: string;
  moves: string[];
  move1?: string;
  move2?: string;
  move3?: string;
  move4?: string;
  dexId?: number | string | null;
}

export interface Team {
  id?: string;
  userId?: string;
  name: string;
  region: string | null;
  members: (TeamMember | null)[];
  strategies?: Record<string, Record<string, StrategyStep[]>>;
  enemyPools?: Record<string, string[]>;
  status?: TeamStatus;
  isPublic?: boolean;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
}
