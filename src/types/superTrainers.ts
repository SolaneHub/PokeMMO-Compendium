import { StrategyStep } from "@/firebase/firestoreService";
import { PokemonType } from "@/utils/pokemonColors";

export interface SuperTrainerTeam {
  pokemonNames: string[];
  pokemonStrategies: Record<string, StrategyStep[]>;
}

export interface SuperTrainer {
  name: string;
  region: string;
  type: PokemonType;
  image: string;
  teams: Record<string, SuperTrainerTeam>;
}
