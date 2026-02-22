import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getMoves } from "@/firebase/firestoreService";
import { MoveMaster } from "@/types/pokemon";

interface MovesContextType {
  moves: MoveMaster[];
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const MovesContext = createContext<MovesContextType | undefined>(undefined);

export const MovesProvider = ({ children }: { children: ReactNode }) => {
  const [moves, setMoves] = useState<MoveMaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMoves = useCallback(async () => {
    setIsLoading(true);
    try {
      const movesData = await getMoves();
      setMoves(movesData);
    } catch (error) {
      console.error("Error fetching moves:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMoves();
  }, [fetchMoves]);

  return (
    <MovesContext.Provider value={{ moves, isLoading, refetch: fetchMoves }}>
      {children}
    </MovesContext.Provider>
  );
};

export const useMoves = () => {
  const context = useContext(MovesContext);
  if (!context) {
    throw new Error("useMoves must be used within a MovesProvider");
  }
  return context;
};
