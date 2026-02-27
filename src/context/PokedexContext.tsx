import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getPokedexData } from "@/firebase/services/pokedexService";
import { Pokemon } from "@/types/pokemon";
import { extractPokedexData } from "@/utils/pokedexDataExtraction";
import { initializePokemonColorMap } from "@/utils/pokemonMoveColors";

interface PokedexContextType {
  pokemonNames: string[];
  moveNames: string[];
  abilityNames: string[];
  itemNames: string[];
  allPokemonData: Pokemon[];
  pokemonMap: Map<string, Pokemon>;
  pokemonColorMap: Record<string, string>;
  isLoading: boolean;
  fullList: Pokemon[];
  refetch: (shouldSetLoading?: boolean) => Promise<void>;
}

const PokedexContext = createContext<PokedexContextType | undefined>(undefined);

const initialEmptyState = {
  pokemonNames: [],
  moveNames: [],
  abilityNames: [],
  itemNames: [],
  allPokemonData: [],
  pokemonMap: new Map<string, Pokemon>(),
  pokemonColorMap: {},
  isLoading: true,
  fullList: [],
};

interface PokedexProviderProps {
  children: ReactNode;
}

export const PokedexProvider = ({ children }: PokedexProviderProps) => {
  const [data, setData] =
    useState<Omit<PokedexContextType, "refetch">>(initialEmptyState);

  const fetchData = useCallback(async (shouldSetLoading = true) => {
    // Only set loading if explicitly requested and not already loading
    if (shouldSetLoading) {
      setData((prev) => (prev.isLoading ? prev : { ...prev, isLoading: true }));
    }

    try {
      const rawData = await getPokedexData();

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
    let isMounted = true;

    // Initial load: initialEmptyState already has isLoading: true.
    // We disable the lint rule here because initial data fetching in a Context
    // is a standard pattern when not using specialized fetching libraries.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData(false).then(() => {
      if (!isMounted) return;
    });

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  const value: PokedexContextType = {
    ...data,
    refetch: fetchData,
  };

  return (
    <PokedexContext.Provider value={value}>{children}</PokedexContext.Provider>
  );
};

export const usePokedexContext = () => {
  const context = useContext(PokedexContext);
  if (!context) {
    throw new Error("usePokedexContext must be used within a PokedexProvider");
  }
  return context;
};
