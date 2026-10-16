import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";

import { getMoves } from "@/firebase/services/movesService";
import { useDataQuery } from "@/hooks/useDataQuery";
import { MoveMaster } from "@/types/pokemon";

export interface MovesContextType {
  moves: MoveMaster[];
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const MovesContext = createContext<MovesContextType | undefined>(undefined);

export const MovesProvider = ({ children }: { children: ReactNode }) => {
  const fetcher = useCallback(async () => {
    try {
      return await getMoves();
    } catch (error) {
      console.error("Error fetching moves:", error);
      throw error;
    }
  }, []);

  const {
    data: moves = [],
    isLoading,
    refetch,
  } = useDataQuery<MoveMaster[]>("moves:master", fetcher, {
    ttl: 1000 * 60 * 60 * 24,
  });

  const value = useMemo(
    () => ({
      moves,
      isLoading,
      refetch: async () => {
        await refetch();
      },
    }),
    [moves, isLoading, refetch]
  );

  return (
    <MovesContext.Provider value={value}>{children}</MovesContext.Provider>
  );
};

export const useMoves = () => {
  const context = useContext(MovesContext);
  if (!context) {
    console.warn(
      "useMoves was called outside of a MovesProvider. Returning empty fallback state."
    );
    return {
      moves: [],
      isLoading: false,
      refetch: () => Promise.resolve(),
    };
  }
  return context;
};
