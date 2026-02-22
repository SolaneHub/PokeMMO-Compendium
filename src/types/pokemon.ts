import { PokemonType } from "../utils/pokemonColors";

export interface BaseStats {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface PokemonAbilities {
  main: string[];
  hidden: string | null;
}

export interface PokemonMove {
  name: string;
  type?: string;
  category?: string;
  power?: number | string;
  accuracy?: number | string;
  pp?: number | string;
  effect?: string;
  level?: string | number;
}

export interface Evolution {
  name: string;
  method?: string;
  level?: string | number;
}

export interface Location {
  region: string;
  area: string;
  rarity?: string;
  method?: string;
  requirements?: string[];
  levels?: string | number;
  type?: string;
}

export interface Pokemon {
  id: string | number | null;
  name: string;
  category?: string;
  types: PokemonType[];
  description?: string;
  height?: string;
  weight?: string;
  genderRatio?: { m: number; f: number };
  catchRate?: string | number;
  baseExp?: string | number;
  growthRate?: string;
  evYield?: string;
  heldItems?: string | string[] | Record<string, string>;
  tier?: string;
  abilities: PokemonAbilities;
  eggGroups?: string[] | string;
  baseStats: BaseStats;
  moves: PokemonMove[];
  evolutions: Evolution[];
  locations: Location[];
  variants?: (string | { name: string; category: string })[];
  dexId?: number | string | null;
}
