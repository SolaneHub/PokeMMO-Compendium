import {
  getPokedexSummary,
  getPokemonById,
} from "@/firebase/services/pokedexService";
import { useDataQuery } from "@/hooks/useDataQuery";
import { Pokemon } from "@/types/pokemon";
import { extractPokedexData } from "@/utils/pokedexDataExtraction";
import { initializePokemonColorMap } from "@/utils/pokemonMoveColors";

export const usePokedexSummaryQuery = () => {
  return useDataQuery(
    "pokedex:summary",
    async () => {
      const rawData = await getPokedexSummary();

      rawData.sort((a, b) => {
        const idA =
          typeof a.id === "string" && /^\d+$/.test(a.id)
            ? Number.parseInt(a.id, 10)
            : a.id;
        const idB =
          typeof b.id === "string" && /^\d+$/.test(b.id)
            ? Number.parseInt(b.id, 10)
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
    {
      ttl: 1000 * 60 * 60 * 24, // 24 ore per dati statici di gioco
    }
  );
};

export const usePokemonDetailsQuery = (id: string | number | undefined) => {
  const idStr = id?.toString();

  return useDataQuery(
    `pokemon:${idStr}`,
    async () => {
      if (!idStr) return null;
      const fullData = await getPokemonById(idStr);
      if (fullData) {
        return { ...fullData, _isFullData: true };
      }
      return null;
    },
    {
      enabled: !!idStr,
      ttl: Infinity, // Pokemon details don't change often
    }
  );
};
