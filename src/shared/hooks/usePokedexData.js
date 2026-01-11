import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

import { db } from "@/firebase/config";
import { extractPokedexData } from "@/shared/utils/pokedexDataExtraction";
import { initializePokemonColorMap } from "@/shared/utils/pokemonMoveColors";

const initialEmptyState = {
  pokemonNames: [],
  moveNames: [],
  abilityNames: [],
  itemNames: [],
  allPokemonData: [],
  pokemonMap: new Map(),
  pokemonColorMap: {},
  isLoading: true,
  fullList: [],
};

export const usePokedexData = () => {
  const [data, setData] = useState(initialEmptyState);

  // Wrap fetchData in useCallback so it can be used as a refetch function
  const fetchData = useCallback(async () => {
    setData((prev) => ({ ...prev, isLoading: true })); // Set loading true on refetch
    try {
      const querySnapshot = await getDocs(collection(db, "pokedex"));

      const rawData = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Ensure id is included for each document
        ...doc.data(),
      }));

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
      const pokemonMap = new Map(rawData.map((p) => [p.name, p]));

      const finalData = {
        ...processed,
        allPokemonData: rawData,
        fullList: rawData,
        pokemonMap: pokemonMap,
        pokemonColorMap: initializedPokemonColorMap,
        isLoading: false,
      };

      setData(finalData);
    } catch (err) {
      setData((prev) => ({
        ...initialEmptyState,
        isLoading: false,
        fullList: prev.fullList,
      }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...data, refetch: fetchData };
};
