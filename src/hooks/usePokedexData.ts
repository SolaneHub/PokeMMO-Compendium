import { useQuery } from "@tanstack/react-query";

import {
  getPokedexSummary,
  getPokemonById,
} from "@/firebase/services/pokedexService";
import { Pokemon } from "@/types/pokemon";
import { extractPokedexData } from "@/utils/pokedexDataExtraction";
import { initializePokemonColorMap } from "@/utils/pokemonMoveColors";

export const usePokedexSummaryQuery = () => {
  return useQuery({
    queryKey: ["pokedex", "summary"],
    queryFn: async () => {
      const rawData = await getPokedexSummary();

      rawData.sort((a, b) => {
        const idA =
          typeof a.id === "string" && /^\d+$/.test(a.id)
            ? parseInt(a.id, 10)
            : a.id;
        const idB =
          typeof b.id === "string" && /^\d+$/.test(b.id)
            ? parseInt(b.id, 10)
            : b.id;

        if (typeof idA === "number" && typeof idB === "number") {
          return idA - idB;
        }
        if (typeof idA === "string" && typeof idB === "string") {
          return idA.localeCompare(idB);
        }
        return 0;
      });

      const initializedPokemonColorMap = initializePokemonColorMap(rawData);
      const processed = extractPokedexData(rawData);

      const pokemonMap = new Map<string, Pokemon>();
      rawData.forEach((p) => {
        pokemonMap.set(p.name, p);
        if (p.id) pokemonMap.set(p.id.toString(), p);
      });

      return {
        ...processed,
        allPokemonData: rawData,
        fullList: rawData,
        pokemonMap,
        pokemonColorMap: initializedPokemonColorMap,
      };
    },
  });
};

export const usePokemonDetailsQuery = (id: string | number | undefined) => {
  const idStr = id?.toString();

  return useQuery({
    queryKey: ["pokemon", idStr],
    queryFn: async () => {
      if (!idStr) return null;
      const fullData = await getPokemonById(idStr);
      if (fullData) {
        const fullDataWithFlag = { ...fullData, _isFullData: true };
        
        // Optionally update the summary map if we want consistent data everywhere
        // but for now, we rely on the specific query cache
        return fullDataWithFlag;
      }
      return null;
    },
    enabled: !!idStr,
    staleTime: Infinity, // Pokemon details don't change often
  });
};

// Legacy alias to not break existing components immediately
import { usePokedexContext } from "@/context/PokedexContext";
export const usePokedexData = () => {
  return usePokedexContext();
};
