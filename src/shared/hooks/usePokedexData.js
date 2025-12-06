// src/shared/hooks/usePokedexData.js
import { useMemo } from "react";

import { extractPokedexData } from "@/shared/utils/pokedexDataExtraction";

export const usePokedexData = () => {
  const pokedexData = useMemo(() => extractPokedexData(), []);
  return pokedexData;
};
