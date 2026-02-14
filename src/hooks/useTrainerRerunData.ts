import { useEffect, useState } from "react";

import { getTrainerRerun } from "@/firebase/firestoreService";
import { TrainerRerunData } from "@/types/trainerRerun";

interface TrainerRerunState {
  trainerRerunData: TrainerRerunData | null;
  isLoading: boolean;
}

let cachedTrainerRerunData: TrainerRerunState | null = null;

const initialEmptyState: TrainerRerunState = {
  trainerRerunData: null,
  isLoading: true,
};

export const useTrainerRerunData = () => {
  const [data, setData] = useState<TrainerRerunState>(() => {
    if (cachedTrainerRerunData) {
      return cachedTrainerRerunData;
    }
    return initialEmptyState;
  });

  useEffect(() => {
    if (cachedTrainerRerunData) {
      return;
    }
    let isMounted = true;
    const fetchData = async () => {
      try {
        const rawData = await getTrainerRerun();
        const finalData = { trainerRerunData: rawData, isLoading: false };
        cachedTrainerRerunData = finalData;
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
