import { collection, getDocs } from "firebase/firestore";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { db } from "@/firebase/config";
import { extractPokedexData } from "@/utils/pokedexDataExtraction";
import { initializePokemonColorMap } from "@/utils/pokemonMoveColors";

const PokedexContext = createContext(null);

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

export const PokedexProvider = ({ children }) => {
  const [data, setData] = useState(initialEmptyState);

  const fetchData = useCallback(async (shouldSetLoading = true) => {
    if (shouldSetLoading) {
      setData((prev) => ({ ...prev, isLoading: true }));
    }
    try {
      const querySnapshot = await getDocs(collection(db, "pokedex"));
      const rawData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
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
      console.error("Error fetching pokedex data:", err);
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

  const value = {
    ...data,
    refetch: fetchData,
  };

  return (
    <PokedexContext.Provider value={value}>
      {children}
    </PokedexContext.Provider>
  );
};

export const usePokedexContext = () => {
  const context = useContext(PokedexContext);
  if (!context) {
    throw new Error("usePokedexContext must be used within a PokedexProvider");
  }
  return context;
};
