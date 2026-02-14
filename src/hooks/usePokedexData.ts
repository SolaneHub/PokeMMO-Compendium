import { usePokedexContext } from "@/context/PokedexContext";

export const usePokedexData = () => {
  return usePokedexContext();
};
