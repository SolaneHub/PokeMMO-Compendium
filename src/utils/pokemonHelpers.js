import { generateDualTypeGradient, typeBackgrounds } from "./pokemonColors";
import { getSpriteUrlByName } from "./pokemonImageHelper";
const PREFIX_VARIANTS = [
  "Heat Rotom",
  "Wash Rotom",
  "Frost Rotom",
  "Fan Rotom",
  "Mow Rotom",
];
export const getFamilyName = (name) => {
  if (PREFIX_VARIANTS.includes(name)) {
    return "Rotom";
  }
  if (name.includes(" (")) {
    return name.split(" (")[0];
  }
  return name;
};
export const getPokemonBackground = (pokemon) => {
  if (!pokemon) return typeBackgrounds[""];
  if (typeBackgrounds[pokemon.name]) {
    return typeBackgrounds[pokemon.name];
  }
  const types = pokemon.types || [];
  if (types.length >= 2) {
    return generateDualTypeGradient(types[0], types[1]);
  }
  if (types.length === 1) {
    return typeBackgrounds[types[0]] || typeBackgrounds[""];
  }
  return typeBackgrounds[""];
};
export const getPokemonCardData = (pokemon) => {
  if (!pokemon) return { sprite: null, background: typeBackgrounds[""] };
  const background = getPokemonBackground(pokemon);
  const sprite = pokemon.sprite || getSpriteUrlByName(pokemon.name);
  return { ...pokemon, sprite, background };
};
export const getPokemonVariants = (selectedName, allPokemon) => {
  if (!allPokemon) return [];
  const targetFamily = getFamilyName(selectedName);
  return allPokemon
    .filter((p) => getFamilyName(p.name) === targetFamily)
    .map((p) => p.name);
};
