import { extractPokedexData } from "@/shared/utils/pokedexDataExtraction";

const pokedexData = extractPokedexData();

export const usePokedexData = () => {
  return pokedexData;
};
