import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "@/firebase/config";
import { extractPokedexData } from "@/shared/utils/pokedexDataExtraction";
import { initializePokemonColorMap } from "@/shared/utils/pokemonMoveColors";

let cachedPokedexData = null;

const initialEmptyState = {
  pokemonNames: [],
  moveNames: [],
  abilityNames: [],
  itemNames: [],
  allPokemonData: [],
  pokemonMap: new Map(),
  pokemonColorMap: {},
  isLoading: true,
};

export const usePokedexData = () => {
  const [data, setData] = useState(() => {
    if (cachedPokedexData) {
      return cachedPokedexData;
    }
    return initialEmptyState;
  });

  useEffect(() => {
    if (cachedPokedexData) {
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pokedex"));

        const rawData = querySnapshot.docs.map((doc) => doc.data());

        rawData.sort((a, b) => (a.id || 0) - (b.id || 0));

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

        cachedPokedexData = finalData;
        if (isMounted) {
          setData(finalData);
        }
      } catch (err) {
        if (isMounted) setData({ ...initialEmptyState, isLoading: false });
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);
  return data;
};
