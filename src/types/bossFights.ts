import { PokemonType } from "@/utils/pokemonColors";

export interface BossFightTeam {
  pokemonNames: string[];
  pokemonStrategies: Record<string, string[]>;
}

export interface BossFight {
  name: string;
  region: string;
  type: PokemonType;
  image?: string;
  teams: Record<string, BossFightTeam>;
}
