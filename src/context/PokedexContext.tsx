import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";

import { getPokemonById } from "@/firebase/services/pokedexService";
import { usePokedexSummaryQuery } from "@/hooks/usePokedexData";
import { Pokemon } from "@/types/pokemon";

export interface PokedexContextType {
  pokemonNames: string[];
  abilityNames: string[];
  itemNames: string[];
  allPokemonData: Pokemon[];
  pokemonMap: Map<string, Pokemon>;
  pokemonColorMap: Record<string, string>;
  isLoading: boolean;
  fullList: Pokemon[];
  refetch: (shouldSetLoading?: boolean) => Promise<void>;
  getPokemonDetails: (id: string | number) => Promise<Pokemon | null>;
}

const PokedexContext = createContext<PokedexContextType | undefined>(undefined);

interface PokedexProviderProps {
  children: ReactNode;
}

const emptyData = {
  pokemonNames: [],
  abilityNames: [],
  itemNames: [],
  allPokemonData: [],
  pokemonMap: new Map<string, Pokemon>(),
  pokemonColorMap: {},
  fullList: [],
};

export const PokedexProvider = ({ children }: PokedexProviderProps) => {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = usePokedexSummaryQuery();

  const getPokemonDetails = useCallback(
    async (id: string | number) => {
      const idStr = id.toString();

      // Use queryClient to fetch or get from cache
      return queryClient.fetchQuery({
        queryKey: ["pokemon", idStr],
        queryFn: async () => {
          const fullData = await getPokemonById(idStr);
          if (fullData) {
            return { ...fullData, _isFullData: true };
          }
          return null;
        },
        staleTime: Infinity,
      });
    },
    [queryClient]
  );

  const value = useMemo(
    () => ({
      ...(data || emptyData),
      isLoading,
      refetch: async (_shouldSetLoading?: boolean) => {
        // TanStack Query handles loading state automatically,
        // but we keep the signature for compatibility
        await refetch();
      },
      getPokemonDetails,
    }),
    [data, isLoading, refetch, getPokemonDetails]
  );

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
