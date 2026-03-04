import { useMemo } from "react";

import { Pokemon } from "@/types/pokemon";
import {
  getDualShadow,
  getPokemonBackgroundStyle,
} from "@/utils/pokemonColors";
import { getSpriteUrlByName } from "@/utils/pokemonImageHelper";

export interface PokemonUIData {
  sprite: string | null;
  background: string;
  shadow: string;
}

/**
 * Custom hook to manage Pokemon UI-related data like colors, shadows, and sprites.
 */
export const usePokemonUI = (
  pokemon: Pokemon | null | undefined
): PokemonUIData => {
  return useMemo(() => {
    if (!pokemon) {
      return {
        sprite: null,
        background: "#1a1b20",
        shadow: "none",
      };
    }

    const background = getPokemonBackgroundStyle(pokemon.types || []);
    const shadow = getDualShadow(background);
    const sprite = getSpriteUrlByName(pokemon.name);

    return {
      sprite,
      background,
      shadow,
    };
  }, [pokemon]);
};
